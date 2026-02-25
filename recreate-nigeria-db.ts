import { createClient } from "@libsql/client";
import path from "path";

const db = createClient({
	url: `file:${path.join(process.cwd(), "hcsl.db")}`,
});

async function main() {
	try {
		console.log("Setting up nigeria map tables...");

		await db.execute(`DROP TABLE IF EXISTS nigeria_states`);

		await db.execute(`
    CREATE TABLE IF NOT EXISTS active_nigeria_states (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

		await db.execute(`
    CREATE TABLE IF NOT EXISTS active_nigeria_state_projects (
      id TEXT PRIMARY KEY,
      state_id TEXT NOT NULL,
      title TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (state_id) REFERENCES active_nigeria_states(id) ON DELETE CASCADE
    )
  `);

		console.log("Migration complete!");
	} catch (e) {
		console.error("Error migrating:", e);
	}
}

main();
