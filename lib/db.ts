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
        role_interest TEXT,
        message TEXT,
        status TEXT CHECK(status IN ('pending', 'review', 'accepted', 'rejected', 'reserved')) DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES job_listings(id)
      )
    `);

	// Projects & Success Stories
	await db.execute(`
      CREATE TABLE IF NOT EXISTS content_items (
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

	console.log("Database initialized successfully");

	await db.execute(`
      CREATE TABLE IF NOT EXISTS event_registrations (
        id TEXT PRIMARY KEY,
        event_id TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES content_items(id)
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

	// Migrations for content_items
	try {
		await db.execute("ALTER TABLE content_items ADD COLUMN category TEXT");
	} catch (e) {
		// Column likely exists
	}
	try {
		await db.execute(
			"ALTER TABLE content_items ADD COLUMN status TEXT DEFAULT 'open'",
		);
	} catch (e) {
		// Column likely exists
	}
	// Just in case published_date was added later in some versions
	try {
		await db.execute(
			"ALTER TABLE content_items ADD COLUMN published_date TEXT",
		);
	} catch (e) {
		// Column likely exists
	}
	// Migration for role_interest in job_applications
	try {
		await db.execute(
			"ALTER TABLE job_applications ADD COLUMN role_interest TEXT",
		);
	} catch (e) {
		// Column likely exists
	}

	// Migration for message in job_applications
	try {
		await db.execute("ALTER TABLE job_applications ADD COLUMN message TEXT");
	} catch (e) {
		// Column likely exists
	}

	// Migration for 'people_story' type in content_items
	// This requires recreating the table because of the CHECK constraint
	try {
		// Check if we need to migrate by trying to insert a dummy item with the new type (and rolling back)
		// Or simpler: just check if the schema allows it?
		// Actually, let's just do the migration if we haven't already.
		// A simple way to check is to try to SELECT from content_items where type = 'people_story'
		// But that doesn't tell us if it's ALLOWED.

		// Let's assume we need to do it once. We can check if a specific flag column exists, or just try to alter table (which fails for constraints).
		// Best approach for SQLite constraint modification:

		// 1. Rename table
		// We only do this if we suspect the constraint is the OLD one.
		// We can check the table definition from sqlite_master?

		const tableInfo = await db.execute(
			"SELECT sql FROM sqlite_master WHERE type='table' AND name='content_items'",
		);
		const sql = tableInfo.rows[0]?.sql as string;

		if (sql && !sql.includes("'people_story'")) {
			console.log("Migrating content_items to support people_story...");

			await db.execute("PRAGMA foreign_keys=OFF");

			await db.execute("ALTER TABLE content_items RENAME TO content_items_old");

			await db.execute(`
              CREATE TABLE IF NOT EXISTS content_items (
                id TEXT PRIMARY KEY,
                type TEXT CHECK(type IN ('project', 'story', 'event', 'people_story')) NOT NULL,
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

			await db.execute(`
              INSERT INTO content_items (id, type, title, slug, summary, content, image_url, published_date, category, status, created_at)
              SELECT id, type, title, slug, summary, content, image_url, published_date, category, status, created_at
              FROM content_items_old
            `);

			await db.execute("DROP TABLE content_items_old");

			await db.execute("PRAGMA foreign_keys=ON");

			console.log("Migration for people_story successful");
		}
	} catch (error) {
		console.error("Migration for people_story failed:", error);
	}

	// Active Countries & Projects for Map
	await db.execute(`
    CREATE TABLE IF NOT EXISTS active_countries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT, -- ISO code if needed for map matching, though name might suffice if standardized
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

	await db.execute(`
    CREATE TABLE IF NOT EXISTS active_country_projects (
      id TEXT PRIMARY KEY,
      country_id TEXT NOT NULL,
      title TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (country_id) REFERENCES active_countries(id) ON DELETE CASCADE
    )
  `);

	// Site Content (Mission, etc.)
	await db.execute(`
    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

	// Core Values
	await db.execute(`
    CREATE TABLE IF NOT EXISTS core_values (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

	// Services (What We Do)
	await db.execute(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

	// Migration for services slug
	try {
		const servicesTable = await db.execute(
			"SELECT sql FROM sqlite_master WHERE type='table' AND name='services'",
		);
		const sql = servicesTable.rows[0]?.sql as string;
		if (sql && !sql.includes("slug")) {
			console.log("Migrating services to include slug...");
			// This is a bit tricky with NOT NULL UNIQUE.
			// Simplest approach: Rename, Create New, Copy.
			await db.execute("PRAGMA foreign_keys=OFF");
			await db.execute("ALTER TABLE services RENAME TO services_old");
			await db.execute(`
            CREATE TABLE IF NOT EXISTS services (
              id TEXT PRIMARY KEY,
              title TEXT NOT NULL,
              slug TEXT UNIQUE NOT NULL,
              description TEXT NOT NULL,
              content TEXT NOT NULL,
              image_url TEXT,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);
			// Copy data, generating a temporary slug if needed? or just using ID?
			// Let's us ID as slug fallback if title isn't suitable, but title is there.
			// We can't do complex transformation in SQL easily in one go if we need to slugify.
			// Ideally we fetch, transform, insert. But for migration in initDb, maybe we just use title and hope?
			// Or just make it nullable for now?
			// The user wants clean links.
			// Let's do: Copy with slug = id (or title replaced spaces).
			// SQLite replace: replace(lower(title), ' ', '-')
			await db.execute(`
            INSERT INTO services (id, title, slug, description, content, image_url, created_at)
            SELECT id, title, lower(replace(title, ' ', '-')), description, content, image_url, created_at
            FROM services_old
          `);
			await db.execute("DROP TABLE services_old");
			await db.execute("PRAGMA foreign_keys=ON");
			console.log("Migration for services slug successful");
		}
	} catch (e) {
		console.error("Migration for services slug failed:", e);
	}
};

let initPromise: Promise<void> | null = null;
export const ensureDbInitialized = () => {
	if (!initPromise) initPromise = initDb();
	return initPromise;
};

export default db;
