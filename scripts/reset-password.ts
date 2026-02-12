import { hashPassword } from "../lib/auth";
import db, { ensureDbInitialized } from "../lib/db";

async function main() {
	const newPassword = process.argv[2];
	if (!newPassword) {
		console.error(
			"Please provide a new password: npx tsx scripts/reset-password.ts <new_password>",
		);
		process.exit(1);
	}

	await ensureDbInitialized();
	const email = "superadmin@hscl.com";

	console.log(`Resetting password for ${email}...`);

	try {
		const hashedPassword = await hashPassword(newPassword);

		// Check if user exists first
		const existing = await db.execute({
			sql: "SELECT 1 FROM admins WHERE email = ?",
			args: [email],
		});

		if (existing.rows.length === 0) {
			console.log("Super Admin user not found. Creating it...");
			// Fallback: Create if doesn't exist (using uuid import if needed, but keeping it simple for reset)
			console.error(
				"Error: User doesn't exist. Please run 'npm run seed' first or check the email.",
			);
			return;
		}

		await db.execute({
			sql: "UPDATE admins SET password_hash = ? WHERE email = ?",
			args: [hashedPassword, email],
		});

		console.log("Password reset successfully!");
		console.log(`You can now login as ${email} with your new password.`);
	} catch (error) {
		console.error("Error resetting password:", error);
	}
}

main().catch(console.error);
