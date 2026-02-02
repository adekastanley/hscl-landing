"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- Site Content (Mission, etc.) ---

export async function getSiteContent(key: string) {
	try {
		const res = await db.execute({
			sql: "SELECT content FROM site_content WHERE key = ?",
			args: [key],
		});
		return res.rows[0]?.content as string | null;
	} catch (error) {
		console.error(`Failed to get site content for key ${key}:`, error);
		return null;
	}
}

export async function updateSiteContent(key: string, content: string) {
	try {
		// UPSERT strategy: SQLite support depends on version, but `INSERT OR REPLACE` is standard enough or we check existence.
		// Let's use INSERT OR REPLACE INTO for simplicity.
		await db.execute({
			sql: "INSERT OR REPLACE INTO site_content (key, content, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
			args: [key, content],
		});
		revalidatePath("/about");
		revalidatePath("/admin/dashboard/landing");
		return { success: true };
	} catch (error) {
		console.error(`Failed to update site content for key ${key}:`, error);
		return { success: false, error: "Failed to update content" };
	}
}

// --- Core Values ---

export interface CoreValue {
	id: string;
	title: string;
	description: string;
}

export async function getCoreValues() {
	try {
		const res = await db.execute(
			"SELECT * FROM core_values ORDER BY created_at ASC",
		);
		return JSON.parse(JSON.stringify(res.rows)) as CoreValue[];
	} catch (error) {
		console.error("Failed to get core values:", error);
		return [];
	}
}

export async function addCoreValue(data: {
	title: string;
	description: string;
}) {
	const id = Math.random().toString(36).substring(2, 15);
	try {
		await db.execute({
			sql: "INSERT INTO core_values (id, title, description) VALUES (?, ?, ?)",
			args: [id, data.title, data.description],
		});
		revalidatePath("/about");
		revalidatePath("/admin/dashboard/landing");
		return { success: true, id };
	} catch (error) {
		console.error("Failed to add core value:", error);
		return { success: false, error: "Failed to add value" };
	}
}

export async function updateCoreValue(
	id: string,
	data: { title: string; description: string },
) {
	try {
		await db.execute({
			sql: "UPDATE core_values SET title = ?, description = ? WHERE id = ?",
			args: [data.title, data.description, id],
		});
		revalidatePath("/about");
		revalidatePath("/admin/dashboard/landing");
		return { success: true };
	} catch (error) {
		console.error("Failed to update core value:", error);
		return { success: false, error: "Failed to update value" };
	}
}

export async function deleteCoreValue(id: string) {
	try {
		await db.execute({
			sql: "DELETE FROM core_values WHERE id = ?",
			args: [id],
		});
		revalidatePath("/about");
		revalidatePath("/admin/dashboard/landing");
		return { success: true };
	} catch (error) {
		console.error("Failed to delete core value:", error);
		return { success: false, error: "Failed to delete value" };
	}
}
