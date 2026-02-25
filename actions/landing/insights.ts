"use server";

import db, { ensureDbInitialized } from "@/lib/db";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { ContentItem } from "@/app/actions/content";

export async function getAllPotentialFeaturedItems(): Promise<ContentItem[]> {
	try {
		await ensureDbInitialized();
		const res = await db.execute({
			sql: "SELECT id, type, title, slug, published_date FROM content_items WHERE type IN ('project', 'story', 'people_story') ORDER BY published_date DESC",
			args: [],
		});
		return res.rows.map((row: any) => ({
			id: row.id,
			type: row.type,
			title: row.title,
			slug: row.slug,
			published_date: row.published_date,
		})) as ContentItem[];
	} catch (error) {
		console.error("Failed to get potential featured items:", error);
		return [];
	}
}

export const getFeaturedInsightId = unstable_cache(
	async () => {
		try {
			await ensureDbInitialized();
			const res = await db.execute({
				sql: "SELECT content FROM site_content WHERE key = 'featured_insight_id'",
				args: [],
			});
			return res.rows[0]?.content as string | null;
		} catch (error) {
			return null;
		}
	},
	["featured-insight-id"],
	{ tags: ["site-content"] },
);

export async function updateFeaturedInsightId(id: string | null) {
	try {
		await ensureDbInitialized();
		if (id === null) {
			await db.execute({
				sql: "DELETE FROM site_content WHERE key = 'featured_insight_id'",
				args: [],
			});
		} else {
			await db.execute({
				sql: "INSERT OR REPLACE INTO site_content (key, content, updated_at) VALUES ('featured_insight_id', ?, CURRENT_TIMESTAMP)",
				args: [id],
			});
		}
		revalidatePath("/");
		revalidatePath("/admin/dashboard/landing");
		revalidateTag("site-content", "default");
		return { success: true };
	} catch (error) {
		console.error("Failed to update featured insight id:", error);
		return { success: false, error: "Failed to update" };
	}
}
