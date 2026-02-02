"use server";

import db from "@/lib/db";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

export interface Service {
	id: string;
	title: string;
	slug: string;
	description: string;
	content: string;
	image_url: string;
}

export const getServices = unstable_cache(
	async () => {
		try {
			const res = await db.execute(
				"SELECT * FROM services ORDER BY created_at ASC",
			);
			return JSON.parse(JSON.stringify(res.rows)) as Service[];
		} catch (error) {
			console.error("Failed to get services:", error);
			return [];
		}
	},
	["services"],
	{ tags: ["services"] },
);

export async function addService(data: Omit<Service, "id">) {
	const id = Math.random().toString(36).substring(2, 15);
	try {
		await db.execute({
			sql: "INSERT INTO services (id, title, slug, description, content, image_url) VALUES (?, ?, ?, ?, ?, ?)",
			args: [
				id,
				data.title,
				data.slug,
				data.description,
				data.content,
				data.image_url,
			],
		});
		revalidatePath("/admin/dashboard/landing");
		revalidatePath("/what-we-do");
		revalidatePath("/our-work");
		revalidateTag("services", "default");
		return { success: true, id };
	} catch (error: any) {
		console.error("Failed to add service:", error);
		if (error?.message?.includes("UNIQUE constraint failed: services.slug")) {
			return {
				success: false,
				error: "Slug already exists. Please choose another.",
			};
		}
		return { success: false, error: "Failed to add service" };
	}
}

export async function updateService(id: string, data: Omit<Service, "id">) {
	try {
		await db.execute({
			sql: "UPDATE services SET title = ?, slug = ?, description = ?, content = ?, image_url = ? WHERE id = ?",
			args: [
				data.title,
				data.slug,
				data.description,
				data.content,
				data.image_url,
				id,
			],
		});
		revalidatePath("/admin/dashboard/landing");
		revalidatePath("/what-we-do");
		revalidatePath("/our-work");
		revalidateTag("services", "default");
		return { success: true };
	} catch (error: any) {
		console.error("Failed to update service:", error);
		if (error?.message?.includes("UNIQUE constraint failed: services.slug")) {
			return {
				success: false,
				error: "Slug already exists. Please choose another.",
			};
		}
		return { success: false, error: "Failed to update service" };
	}
}

export async function deleteService(id: string) {
	try {
		await db.execute({
			sql: "DELETE FROM services WHERE id = ?",
			args: [id],
		});
		revalidatePath("/admin/dashboard/landing");
		revalidatePath("/what-we-do");
		revalidatePath("/our-work");
		revalidateTag("services", "default");
		return { success: true };
	} catch (error) {
		console.error("Failed to delete service:", error);
		return { success: false, error: "Failed to delete service" };
	}
}
