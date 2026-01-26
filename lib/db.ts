import { createClient } from "@libsql/client";

const db = createClient({
	url: process.env.TURSO_DATABASE_URL || "file:hcsl.db",
	authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialize database schema
const initDb = async () => {
	await db.execute(`
    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      bio TEXT NOT NULL,
      image_url TEXT,
      category TEXT DEFAULT 'team',
      linkedin TEXT,
      twitter TEXT,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

	// Migrations for existing databases
	try {
		await db.execute("ALTER TABLE team_members ADD COLUMN image_url TEXT");
	} catch (e) {
		// Column likely exists
	}
	try {
		await db.execute(
			"ALTER TABLE team_members ADD COLUMN category TEXT DEFAULT 'team'",
		);
	} catch (e) {
		// Column likely exists
	}
	try {
		await db.execute("ALTER TABLE team_members ADD COLUMN linkedin TEXT");
	} catch (e) {
		// Column likely exists
	}
	try {
		await db.execute("ALTER TABLE team_members ADD COLUMN twitter TEXT");
	} catch (e) {
		// Column likely exists
	}
	try {
		await db.execute("ALTER TABLE team_members ADD COLUMN email TEXT");
	} catch (e) {
		// Column likely exists
	}
};

initDb();

export default db;
