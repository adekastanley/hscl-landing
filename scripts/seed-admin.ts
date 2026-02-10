import { hashPassword } from "../lib/auth";
import db, { ensureDbInitialized } from "../lib/db";
import { v4 as uuidv4 } from "uuid";

async function main() {
	await ensureDbInitialized();
	const email = "superadmin@hscl.com"; // Default email
	const password = "password123"; // Default password
	const name = "Super Admin";

	console.log(`Seeding Super Admin...`);
	console.log(`Email: ${email}`);
	console.log(`Password: ${password}`);

	try {
		// Check if user exists
		const existing = await db.execute({
			sql: "SELECT 1 FROM admins WHERE email = ?",
			args: [email],
		});

		if (existing.rows.length > 0) {
			console.log("Super Admin already exists. Skipping.");
			return;
		}

		const hashedPassword = await hashPassword(password);
		const id = uuidv4();

		await db.execute({
			sql: "INSERT INTO admins (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
			args: [id, name, email, hashedPassword, "super_admin"],
		});

		console.log("Super Admin created successfully.");
	} catch (error) {
		console.error("Error seeding admin:", error);
	}
}

main().catch(console.error);
