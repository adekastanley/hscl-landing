"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function getPartners() {
	try {
		const result = await db.execute(
			"SELECT * FROM partners ORDER BY created_at DESC",
		);
		return result.rows;
	} catch (error) {
		console.error("Error fetching partners:", error);
		return [];
	}
}

export async function createPartner(formData: FormData) {
	try {
		const name = formData.get("name") as string;
		const logoUrl = formData.get("logo_url") as string;

		if (!name || !logoUrl) {
			return { error: "Name and Logo URL are required" };
		}

		const id = uuidv4();

		await db.execute({
			sql: "INSERT INTO partners (id, name, logo_url) VALUES (?, ?, ?)",
			args: [id, name, logoUrl],
		});

		revalidatePath("/admin/dashboard/partners");
		revalidatePath("/");
		return { success: true };
	} catch (error) {
		console.error("Error creating partner:", error);
		return { error: "Failed to create partner" };
	}
}

export async function deletePartner(id: string) {
	try {
		await db.execute({
			sql: "DELETE FROM partners WHERE id = ?",
			args: [id],
		});

		revalidatePath("/admin/dashboard/partners");
		revalidatePath("/");
		return { success: true };
	} catch (error) {
		console.error("Error deleting partner:", error);
		return { error: "Failed to delete partner" };
	}
}
