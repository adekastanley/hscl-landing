"use server";

import db, { ensureDbInitialized } from "@/lib/db";

export async function fixDatabaseSchema() {
	try {
		await ensureDbInitialized();

		// 1. Create temporary new table with correct constraints
		// Note: We include all columns that might have been added via ALTER in lib/db.ts
		await db.execute(`
      CREATE TABLE IF NOT EXISTS content_items_new (
        id TEXT PRIMARY KEY,
        type TEXT CHECK(type IN ('project', 'story', 'event')) NOT NULL,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        summary TEXT,
        content TEXT,
        image_url TEXT,
        published_date TEXT,
        category TEXT,
        status TEXT DEFAULT 'open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

		// 2. Copy data from old table to new table
		// We explicitly list columns to match the new definition
		await db.execute(`
      INSERT INTO content_items_new (id, type, title, slug, summary, content, image_url, published_date, category, status, created_at)
      SELECT id, type, title, slug, summary, content, image_url, published_date, category, status, created_at FROM content_items
    `);

		// 3. Drop old table
		await db.execute("DROP TABLE content_items");

		// 4. Rename new table to old name
		await db.execute("ALTER TABLE content_items_new RENAME TO content_items");

		return { success: true };
	} catch (error) {
		console.error("Schema fix failed:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
