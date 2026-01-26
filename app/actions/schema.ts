"use server";

import db, { ensureDbInitialized } from "@/lib/db";

export async function fixDatabaseSchema() {
	try {
		await ensureDbInitialized();

		// We need to handle the foreign key constraint from event_registrations.
		// Strategy:
		// 1. Snapshot event_registrations
		// 2. Drop event_registrations
		// 3. Migrate content_items (fix constraint)
		// 4. Recreate event_registrations
		// 5. Restore event_registrations data
		// All in a batch transaction for safety.

		await db.batch([
			// 0. Cleanup any leftover tables from failed runs
			"DROP TABLE IF EXISTS temp_event_registrations",
			"DROP TABLE IF EXISTS content_items_new",

			// 1. Snapshot event_registrations
			"CREATE TABLE temp_event_registrations AS SELECT * FROM event_registrations",

			// 2. Drop dependent table
			"DROP TABLE event_registrations",

			// 3. Create content_items_new with correct CHECK constraint
			`CREATE TABLE IF NOT EXISTS content_items_new (
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
      )`,

			// 4. Copy data to new table
			`INSERT INTO content_items_new (id, type, title, slug, summary, content, image_url, published_date, category, status, created_at)
       SELECT id, type, title, slug, summary, content, image_url, published_date, category, status, created_at FROM content_items`,

			// 5. Drop old content_items
			"DROP TABLE content_items",

			// 6. Rename new table
			"ALTER TABLE content_items_new RENAME TO content_items",

			// 7. Recreate event_registrations with correct FK
			`CREATE TABLE event_registrations (
        id TEXT PRIMARY KEY,
        event_id TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES content_items(id)
      )`,

			// 8. Restore event_registrations data
			`INSERT INTO event_registrations (id, event_id, first_name, last_name, email, phone, created_at)
       SELECT id, event_id, first_name, last_name, email, phone, created_at FROM temp_event_registrations`,

			// 9. Cleanup temp table
			"DROP TABLE temp_event_registrations",
		]);

		return { success: true };
	} catch (error) {
		console.error("Schema fix failed:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
