import { createClient } from "@libsql/client";
import * as path from "path";

const db = createClient({
	url: `file:${path.join(process.cwd(), "hcsl.db")}`,
});

async function recreate() {
	await db.execute(`
    CREATE TABLE IF NOT EXISTS our_work_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
	console.log("Table created!");
}

recreate();
