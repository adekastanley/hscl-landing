"use server";

import db from "@/lib/db";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

import { deleteLocalFile } from "@/lib/file";

export interface OurWorkItem {
	id: string;
	title: string;
	slug: string;
	content: string;
	image_url: string;
}

export const getOurWorkItems = unstable_cache(
	async () => {
		try {
			const res = await db.execute(
				"SELECT * FROM our_work_items ORDER BY created_at ASC",
			);
			return JSON.parse(JSON.stringify(res.rows)) as OurWorkItem[];
		} catch (error) {
			console.error("Failed to get our work items:", error);
			return [];
		}
	},
	["our_work_items"],
	{ tags: ["our_work_items"] },
);

export async function addOurWorkItem(data: Omit<OurWorkItem, "id">) {
	const id = Math.random().toString(36).substring(2, 15);
	try {
		await db.execute({
			sql: "INSERT INTO our_work_items (id, title, slug, content, image_url) VALUES (?, ?, ?, ?, ?)",
			args: [id, data.title, data.slug, data.content, data.image_url],
		});
		revalidatePath("/admin/dashboard/landing");
		revalidatePath("/what-we-do");
		revalidatePath("/our-work");
		revalidateTag("our_work_items", "default");
		return { success: true, id };
	} catch (error: any) {
		console.error("Failed to add our work item:", error);
		if (
			error?.message?.includes("UNIQUE constraint failed: our_work_items.slug")
		) {
			return {
				success: false,
				error: "Slug already exists. Please choose another.",
			};
		}
		return { success: false, error: "Failed to add item" };
	}
}

export async function updateOurWorkItem(
	id: string,
	data: Omit<OurWorkItem, "id">,
) {
	try {
		// Get old image_url for cleanup
		const current = await db.execute({
			sql: "SELECT image_url FROM our_work_items WHERE id = ?",
			args: [id],
		});
		const oldImageUrl = current.rows[0]?.image_url as string | null;

		await db.execute({
			sql: "UPDATE our_work_items SET title = ?, slug = ?, content = ?, image_url = ? WHERE id = ?",
			args: [data.title, data.slug, data.content, data.image_url, id],
		});

		// Cleanup old image if changed
		if (oldImageUrl && oldImageUrl !== data.image_url) {
			await deleteLocalFile(oldImageUrl);
		}

		revalidatePath("/admin/dashboard/landing");
		revalidatePath("/what-we-do");
		revalidatePath("/our-work");
		revalidateTag("our_work_items", "default");
		return { success: true };
	} catch (error: any) {
		console.error("Failed to update our work item:", error);
		if (
			error?.message?.includes("UNIQUE constraint failed: our_work_items.slug")
		) {
			return {
				success: false,
				error: "Slug already exists. Please choose another.",
			};
		}
		return { success: false, error: "Failed to update item" };
	}
}

export async function deleteOurWorkItem(id: string) {
	try {
		// Get image_url for cleanup
		const current = await db.execute({
			sql: "SELECT image_url FROM our_work_items WHERE id = ?",
			args: [id],
		});
		const imageUrl = current.rows[0]?.image_url as string | null;

		await db.execute({
			sql: "DELETE FROM our_work_items WHERE id = ?",
			args: [id],
		});

		if (imageUrl) {
			await deleteLocalFile(imageUrl);
		}

		revalidatePath("/admin/dashboard/landing");
		revalidatePath("/what-we-do");
		revalidatePath("/our-work");
		revalidateTag("our_work_items", "default");
		return { success: true };
	} catch (error) {
		console.error("Failed to delete our work item:", error);
		return { success: false, error: "Failed to delete item" };
	}
}
