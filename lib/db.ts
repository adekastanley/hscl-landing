import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "hcsl.db");
const db = new Database(dbPath);

// Initialize database schema
const initDb = () => {
	db.exec(`
    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      bio TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

initDb();

export default db;
