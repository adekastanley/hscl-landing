"use server";

import db, { ensureDbInitialized } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface ContentItem {
	id: string;
	type: "project" | "story" | "event";
	title: string;
	slug: string;
	summary: string;
	content: string;
	image_url: string;
	published_date: string;
	category?: "event" | "training";
	status?: "open" | "closed";
	registration_count?: number;
	created_at: string;
}

export async function getItems(
	type: "project" | "story" | "event",
	limit = 100,
	page = 1,
	filterYear?: string,
): Promise<ContentItem[]> {
	try {
		await ensureDbInitialized();
		const offset = (page - 1) * limit;
		const args: any[] = [type];

		let sql = `
			SELECT c.*, 
			(SELECT COUNT(*) FROM event_registrations WHERE event_id = c.id) as registration_count 
			FROM content_items c 
			WHERE c.type = ?
		`;

		if (filterYear && filterYear !== "all") {
			sql += " AND strftime('%Y', c.published_date) = ?";
			args.push(filterYear);
		}

		sql += " ORDER BY c.published_date DESC LIMIT ? OFFSET ?";
		args.push(limit, offset);

		const result = await db.execute({ sql, args });
		return result.rows.map((row) => ({
			id: row.id as string,
			type: row.type as "project" | "story",
			title: row.title as string,
			slug: row.slug as string,
			summary: row.summary as string,
			content: row.content as string,
			image_url: row.image_url as string,
			published_date: row.published_date as string,
			category: row.category as "event" | "training" | undefined,
			status: row.status as "open" | "closed" | undefined,
			registration_count: Number(row.registration_count || 0),
			created_at: String(row.created_at), // Ensure Date/Object is string
		}));
	} catch (error) {
		console.error(`Failed to get ${type} items:`, error);
		return [];
	}
}

export async function getItemBySlug(
	slug: string,
	type?: "project" | "story" | "event",
): Promise<ContentItem | null> {
	try {
		await ensureDbInitialized();
		let sql = "SELECT * FROM content_items WHERE slug = ?";
		const args = [slug];

		if (type) {
			sql += " AND type = ?";
			args.push(type);
		}

		const result = await db.execute({
			sql: sql + " LIMIT 1",
			args,
		});
		const row = result.rows[0];
		if (!row) return null;

		return {
			id: row.id as string,
			type: row.type as "project" | "story" | "event",
			title: row.title as string,
			slug: row.slug as string,
			summary: row.summary as string,
			content: row.content as string,
			image_url: row.image_url as string,
			published_date: row.published_date as string,
			created_at: String(row.created_at),
		};
	} catch (error) {
		console.error("Failed to get item by slug:", error);
		return null;
	}
}

export async function getYears(
	type: "project" | "story" | "event",
): Promise<string[]> {
	try {
		await ensureDbInitialized();
		const result = await db.execute({
			sql: "SELECT DISTINCT strftime('%Y', published_date) as year FROM content_items WHERE type = ? ORDER BY year DESC",
			args: [type],
		});
		return result.rows.map((row: any) => String(row.year)).filter(Boolean);
	} catch (error) {
		console.error("Failed to get years:", error);
		return [];
	}
}

export async function createItem(data: Omit<ContentItem, "id" | "created_at">) {
	const id = Math.random().toString(36).substring(2, 15);
	try {
		await ensureDbInitialized();
		await db.execute({
			sql: "INSERT INTO content_items (id, type, title, slug, summary, content, image_url, published_date, category, status) VALUES (:id, :type, :title, :slug, :summary, :content, :image_url, :published_date, :category, :status)",
			args: {
				id,
				type: data.type,
				title: data.title,
				slug: data.slug,
				summary: data.summary || "",
				content: data.content || "",
				image_url: data.image_url || "",
				published_date: data.published_date,
				category: data.category || null,
				status: data.status || "open",
			},
		});
		revalidatePath("/admin/dashboard/projects");
		revalidatePath("/admin/dashboard/stories");
		revalidatePath("/admin/dashboard/events");
		revalidatePath("/projects");
		revalidatePath("/success-stories");
		return { success: true, data: { id, ...data } };
	} catch (error) {
		console.error("Failed to create item:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export async function updateItem(
	id: string,
	data: Partial<Omit<ContentItem, "id" | "created_at">>,
) {
	try {
		await ensureDbInitialized();
		const fields: string[] = [];
		const args: Record<string, any> = {};

		if (data.title) {
			fields.push("title = :title");
			args.title = data.title;
		}
		if (data.slug) {
			fields.push("slug = :slug");
			args.slug = data.slug;
		}
		if (data.summary !== undefined) {
			fields.push("summary = :summary");
			args.summary = data.summary;
		}
		if (data.content !== undefined) {
			fields.push("content = :content");
			args.content = data.content;
		}
		if (data.image_url !== undefined) {
			fields.push("image_url = :image_url");
			args.image_url = data.image_url;
		}
		if (data.published_date) {
			fields.push("published_date = :published_date");
			args.published_date = data.published_date;
		}
		if (data.category !== undefined) {
			fields.push("category = :category");
			args.category = data.category;
		}
		if (data.status !== undefined) {
			fields.push("status = :status");
			args.status = data.status;
		}

		if (fields.length === 0) return { success: true };

		args.id = id;
		const sql = `UPDATE content_items SET ${fields.join(", ")} WHERE id = :id`;

		await db.execute({ sql, args });

		revalidatePath("/admin/dashboard/projects");
		revalidatePath("/admin/dashboard/stories");
		revalidatePath("/admin/dashboard/events");
		revalidatePath("/projects");
		revalidatePath("/success-stories");
		return { success: true };
	} catch (error) {
		console.error("Failed to update item:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export async function deleteItem(id: string) {
	try {
		await ensureDbInitialized();
		await db.execute({
			sql: "DELETE FROM content_items WHERE id = ?",
			args: [id],
		});
		revalidatePath("/admin/dashboard/projects");
		revalidatePath("/admin/dashboard/stories");
		revalidatePath("/admin/dashboard/events");
		revalidatePath("/projects");
		revalidatePath("/success-stories");
		return { success: true };
	} catch (error) {
		console.error("Failed to delete item:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
