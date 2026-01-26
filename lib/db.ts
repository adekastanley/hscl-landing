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

	await db.execute(`
    CREATE TABLE IF NOT EXISTS job_listings (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

	await db.execute(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        applicant_name TEXT NOT NULL,
        email TEXT NOT NULL,
        resume_url TEXT NOT NULL,
        status TEXT CHECK(status IN ('pending', 'review', 'accepted', 'rejected', 'reserved')) DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES job_listings(id)
      )
    `);

	// Projects & Success Stories
	await db.execute(`
      CREATE TABLE IF NOT EXISTS content_items (
        id TEXT PRIMARY KEY,
        type TEXT CHECK(type IN ('project', 'story')) NOT NULL,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        summary TEXT,
        content TEXT,
        image_url TEXT,
        published_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

	console.log("Database initialized successfully");
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
