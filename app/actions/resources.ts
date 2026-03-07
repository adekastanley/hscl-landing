"use server";

import db, { ensureDbInitialized } from "@/lib/db";
import { revalidatePath, unstable_cache } from "next/cache";
import { deleteLocalFile } from "@/lib/file";

export interface Resource {
	id: string;
	title: string;
	description: string;
	type: "free" | "paid";
	cost: string | null;
	tags: string[];
	file_url: string | null;
	link_url: string | null;
	image_url: string | null;
	created_at: string;
}

export const getResources = unstable_cache(
	async (): Promise<Resource[]> => {
		try {
			await ensureDbInitialized();
			const res = await db.execute(
				"SELECT * FROM resources ORDER BY created_at DESC",
			);
			return res.rows.map((row: any) => ({
				...row,
				tags: row.tags ? JSON.parse(row.tags) : [],
			})) as Resource[];
		} catch (error) {
			console.error("Failed to get resources:", error);
			return [];
		}
	},
	["resources"],
	{ tags: ["resources"] },
);

export async function createResource(
	data: Omit<Resource, "id" | "created_at">,
) {
	const id = Math.random().toString(36).substring(2, 15);
	try {
		await ensureDbInitialized();
		await db.execute({
			sql: `
        INSERT INTO resources (id, title, description, type, cost, tags, file_url, link_url, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
			args: [
				id,
				data.title,
				data.description,
				data.type,
				data.cost || null,
				JSON.stringify(data.tags),
				data.file_url || null,
				data.link_url || null,
				data.image_url || null,
			],
		});
		revalidatePath("/our-people");
		revalidatePath("/admin/dashboard/resources");
		return { success: true, id };
	} catch (error) {
		console.error("Failed to create resource:", error);
		return { success: false, error: "Failed to create resource" };
	}
}

export async function updateResource(
	id: string,
	data: Partial<Omit<Resource, "id" | "created_at">>,
) {
	try {
		await ensureDbInitialized();

		// Get current to see if we need to delete old files
		const currentRes = await db.execute({
			sql: "SELECT file_url, image_url FROM resources WHERE id = ?",
			args: [id],
		});
		const currentFileUrl = currentRes.rows[0]?.file_url as string | null;
		const currentImageUrl = currentRes.rows[0]?.image_url as string | null;

		const updates: string[] = [];
		const args: any[] = [];

		if (data.title !== undefined) {
			updates.push("title = ?");
			args.push(data.title);
		}
		if (data.description !== undefined) {
			updates.push("description = ?");
			args.push(data.description);
		}
		if (data.type !== undefined) {
			updates.push("type = ?");
			args.push(data.type);
		}
		if (data.cost !== undefined) {
			updates.push("cost = ?");
			args.push(data.cost || null);
		}
		if (data.tags !== undefined) {
			updates.push("tags = ?");
			args.push(JSON.stringify(data.tags));
		}
		if (data.file_url !== undefined) {
			updates.push("file_url = ?");
			args.push(data.file_url || null);
		}
		if (data.link_url !== undefined) {
			updates.push("link_url = ?");
			args.push(data.link_url || null);
		}
		if (data.image_url !== undefined) {
			updates.push("image_url = ?");
			args.push(data.image_url || null);
		}

		if (updates.length > 0) {
			args.push(id);
			await db.execute({
				sql: `UPDATE resources SET ${updates.join(", ")} WHERE id = ?`,
				args,
			});

			// Cleanup old files if they were changed
			if (data.file_url !== undefined && data.file_url !== currentFileUrl) {
				await deleteLocalFile(currentFileUrl);
			}
			if (data.image_url !== undefined && data.image_url !== currentImageUrl) {
				await deleteLocalFile(currentImageUrl);
			}
		}

		revalidatePath("/our-people");
		revalidatePath("/admin/dashboard/resources");
		return { success: true };
	} catch (error) {
		console.error("Failed to update resource:", error);
		return { success: false, error: "Failed to update resource" };
	}
}

export async function deleteResource(id: string) {
	try {
		await ensureDbInitialized();

		const result = await db.execute({
			sql: "SELECT file_url, image_url FROM resources WHERE id = ?",
			args: [id],
		});
		const fileUrl = result.rows[0]?.file_url as string | null;
		const imageUrl = result.rows[0]?.image_url as string | null;

		await db.execute({
			sql: "DELETE FROM resources WHERE id = ?",
			args: [id],
		});

		if (fileUrl) await deleteLocalFile(fileUrl);
		if (imageUrl) await deleteLocalFile(imageUrl);

		revalidatePath("/our-people");
		revalidatePath("/admin/dashboard/resources");
		return { success: true };
	} catch (error) {
		console.error("Failed to delete resource:", error);
		return { success: false, error: "Failed to delete resource" };
	}
}

export async function trackResourceDownload(data: {
	resource_id: string;
	full_name: string;
	email: string;
	industry: string;
}) {
	const id = Math.random().toString(36).substring(2, 15);
	try {
		await ensureDbInitialized();
		await db.execute({
			sql: `
        INSERT INTO resource_downloads (id, resource_id, full_name, email, industry)
        VALUES (?, ?, ?, ?, ?)
      `,
			args: [id, data.resource_id, data.full_name, data.email, data.industry],
		});
		revalidatePath("/admin/dashboard/downloads");
		return { success: true };
	} catch (error) {
		console.error("Failed to track resource download:", error);
		return { success: false, error: "Failed to track download" };
	}
}

export async function getResourceDownloads() {
	try {
		await ensureDbInitialized();
		const res = await db.execute(`
      SELECT 
        rd.*, 
        r.title as resource_title 
      FROM resource_downloads rd
      LEFT JOIN resources r ON rd.resource_id = r.id
      ORDER BY rd.created_at DESC
    `);
		return res.rows as any[];
	} catch (error) {
		console.error("Failed to get resource downloads:", error);
		return [];
	}
}
