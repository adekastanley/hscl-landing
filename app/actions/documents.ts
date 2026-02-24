"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export interface GlobalDocument {
	id: string;
	key: string;
	title: string;
	file_url: string;
	created_at: string;
	updated_at: string;
}

// Ensure the table exists
export async function ensureGlobalDocumentsTable() {
	try {
		await db.execute({
			sql: `
        CREATE TABLE IF NOT EXISTS global_documents (
          id TEXT PRIMARY KEY,
          key TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          file_url TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
			args: [],
		});
	} catch (error) {
		console.error("Failed to create global_documents table:", error);
	}
}

export async function getGlobalDocument(
	key: string,
): Promise<GlobalDocument | null> {
	await ensureGlobalDocumentsTable();
	try {
		const result = await db.execute({
			sql: "SELECT * FROM global_documents WHERE key = ? LIMIT 1",
			args: [key],
		});
		return result.rows[0]
			? (result.rows[0] as unknown as GlobalDocument)
			: null;
	} catch (error) {
		console.error(`Error fetching global document ${key}:`, error);
		return null;
	}
}

export async function upsertGlobalDocument(
	key: string,
	title: string,
	fileUrl: string | null,
) {
	await ensureGlobalDocumentsTable();
	try {
		const existing = await getGlobalDocument(key);

		if (fileUrl === null) {
			// Delete
			if (existing) {
				await db.execute({
					sql: "DELETE FROM global_documents WHERE key = ?",
					args: [key],
				});
			}
		} else if (existing) {
			// Update
			await db.execute({
				sql: "UPDATE global_documents SET title = ?, file_url = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?",
				args: [title, fileUrl, key],
			});
		} else {
			// Insert
			await db.execute({
				sql: "INSERT INTO global_documents (id, key, title, file_url) VALUES (?, ?, ?, ?)",
				args: [uuidv4(), key, title, fileUrl],
			});
		}

		revalidatePath("/");
		revalidatePath("/admin/dashboard/landing");
		return { success: true };
	} catch (error) {
		console.error(`Error saving global document ${key}:`, error);
		throw error;
	}
}
