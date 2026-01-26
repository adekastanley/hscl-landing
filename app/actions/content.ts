"use server";

import db from "@/lib/db";
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
		await db.execute({
			sql: "INSERT INTO content_items (id, type, title, slug, summary, content, image_url, published_date, category, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			args: [
				id,
				data.type,
				data.title,
				data.slug,
				data.summary || "",
				data.content || "",
				data.image_url || "",
				data.published_date,
				data.category || null,
				data.status || "open",
			],
		});
		revalidatePath("/admin/dashboard/projects");
		revalidatePath("/admin/dashboard/stories");
		revalidatePath("/admin/dashboard/events");
		revalidatePath("/projects");
		revalidatePath("/success-stories");
		return { id, ...data };
	} catch (error) {
		console.error("Failed to create item:", error);
		throw error;
	}
}

export async function updateItem(
	id: string,
	data: Partial<Omit<ContentItem, "id" | "created_at">>,
) {
	try {
		const fields = [];
		const args = [];

		if (data.title) {
			fields.push("title = ?");
			args.push(data.title);
		}
		if (data.slug) {
			fields.push("slug = ?");
			args.push(data.slug);
		}
		if (data.summary !== undefined) {
			fields.push("summary = ?");
			args.push(data.summary);
		}
		if (data.content !== undefined) {
			fields.push("content = ?");
			args.push(data.content);
		}
		if (data.image_url !== undefined) {
			fields.push("image_url = ?");
			args.push(data.image_url);
		}
		if (data.published_date) {
			fields.push("published_date = ?");
			args.push(data.published_date);
		}
		if (data.category !== undefined) {
			fields.push("category = ?");
			args.push(data.category);
		}
		if (data.status !== undefined) {
			fields.push("status = ?");
			args.push(data.status);
		}

		if (fields.length === 0) return;

		args.push(id);
		const sql = `UPDATE content_items SET ${fields.join(", ")} WHERE id = ?`;

		await db.execute({ sql, args });

		revalidatePath("/admin/dashboard/projects");
		revalidatePath("/admin/dashboard/stories");
		revalidatePath("/admin/dashboard/events");
		revalidatePath("/projects");
		revalidatePath("/success-stories");
	} catch (error) {
		console.error("Failed to update item:", error);
		throw error;
	}
}

export async function deleteItem(id: string) {
	try {
		await db.execute({
			sql: "DELETE FROM content_items WHERE id = ?",
			args: [id],
		});
		revalidatePath("/admin/dashboard/projects");
		revalidatePath("/admin/dashboard/stories");
		revalidatePath("/admin/dashboard/events");
		revalidatePath("/projects");
		revalidatePath("/success-stories");
	} catch (error) {
		console.error("Failed to delete item:", error);
		throw error;
	}
}
