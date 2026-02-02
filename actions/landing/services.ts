"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface Service {
	id: string;
	title: string;
	description: string;
	content: string;
	image_url: string;
}

export async function getServices() {
	try {
		const res = await db.execute(
			"SELECT * FROM services ORDER BY created_at ASC",
		);
		return JSON.parse(JSON.stringify(res.rows)) as Service[];
	} catch (error) {
		console.error("Failed to get services:", error);
		return [];
	}
}

export async function addService(data: Omit<Service, "id">) {
	const id = Math.random().toString(36).substring(2, 15);
	try {
		await db.execute({
			sql: "INSERT INTO services (id, title, description, content, image_url) VALUES (?, ?, ?, ?, ?)",
			args: [id, data.title, data.description, data.content, data.image_url],
		});
		revalidatePath("/admin/dashboard/landing");
		revalidatePath("/what-we-do"); // Assuming this is the public path or relevant path
		revalidatePath("/our-work"); // Based on file path
		return { success: true, id };
	} catch (error) {
		console.error("Failed to add service:", error);
		return { success: false, error: "Failed to add service" };
	}
}

export async function updateService(id: string, data: Omit<Service, "id">) {
	try {
		await db.execute({
			sql: "UPDATE services SET title = ?, description = ?, content = ?, image_url = ? WHERE id = ?",
			args: [data.title, data.description, data.content, data.image_url, id],
		});
		revalidatePath("/admin/dashboard/landing");
		revalidatePath("/what-we-do");
		revalidatePath("/our-work");
		return { success: true };
	} catch (error) {
		console.error("Failed to update service:", error);
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
		return { success: true };
	} catch (error) {
		console.error("Failed to delete service:", error);
		return { success: false, error: "Failed to delete service" };
	}
}
