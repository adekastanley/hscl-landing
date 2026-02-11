import db, { ensureDbInitialized } from "../lib/db";

async function testConnection() {
	try {
		console.log("Initializing DB...");
		await ensureDbInitialized();
		console.log("DB Initialized. Running query...");
		const result = await db.execute("SELECT 1 as val");
		console.log("Query result:", result.rows);
		if (result.rows[0].val === 1) {
			console.log("SUCCESS: Database connection works.");
		} else {
			console.error("FAILURE: Unexpected query result.");
			process.exit(1);
		}
	} catch (error) {
		console.error("FAILURE: Database connection failed:", error);
		process.exit(1);
	}
}

testConnection();
