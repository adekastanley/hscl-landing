"use server";

import db from "@/lib/db"; // Assuming this is where db instance is
import { encrypt, verifyPassword, hashPassword } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export async function loginAction(prevState: any, formData: FormData) {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	if (!email || !password) {
		return { error: "Email and Password are required" };
	}

	try {
		const result = await db.execute({
			sql: "SELECT * FROM admins WHERE email = ?",
			args: [email],
		});

		const user = result.rows[0];

		if (!user) {
			return { error: "Invalid email or password" };
		}

		const isValid = await verifyPassword(
			password,
			user.password_hash as string,
		);

		if (!isValid) {
			return { error: "Invalid email or password" };
		}

		// Create session
		const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
		const sessionPayload = {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
			expires,
		};

		const session = await encrypt(sessionPayload);

		const cookieStore = await cookies();
		cookieStore.set("session", session, { expires, httpOnly: true });
	} catch (error) {
		console.error("Login error:", error);
		return { error: "An unexpected error occurred" };
	}

	redirect("/admin/dashboard");
}

export async function logoutAction() {
	const cookieStore = await cookies();
	cookieStore.set("session", "", { expires: new Date(0) });
	redirect("/login");
}

// Super Admin Actions
export async function createAdminAction(prevState: any, formData: FormData) {
	const name = formData.get("name") as string;
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const role = formData.get("role") as string;

	if (!name || !email || !password || !role) {
		return { error: "All fields are required", success: false };
	}

	try {
		// Check if email exists
		const existing = await db.execute({
			sql: "SELECT 1 FROM admins WHERE email = ?",
			args: [email],
		});

		if (existing.rows.length > 0) {
			return { error: "Email already exists", success: false };
		}

		const hashedPassword = await hashPassword(password);
		const id = uuidv4();

		await db.execute({
			sql: "INSERT INTO admins (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
			args: [id, name, email, hashedPassword, role],
		});

		revalidatePath("/admin/dashboard/settings");
		return { success: true, error: "" };
	} catch (error) {
		console.error("Create admin error:", error);
		return { error: "Failed to create admin", success: false };
	}
}

export async function deleteAdminAction(id: string) {
	try {
		await db.execute({
			sql: "DELETE FROM admins WHERE id = ?",
			args: [id],
		});
		revalidatePath("/admin/dashboard/settings");
		return { success: true, error: "" };
	} catch (error) {
		return { error: "Failed to delete admin", success: false };
	}
}

export async function changePasswordAction(prevState: any, formData: FormData) {
	const currentPassword = formData.get("currentPassword") as string;
	const newPassword = formData.get("newPassword") as string;
	const userId = formData.get("userId") as string;

	if (!newPassword || newPassword.length < 6)
		return { error: "Password must be at least 6 characters", success: false };

	try {
		if (currentPassword) {
			const result = await db.execute({
				sql: "SELECT password_hash FROM admins WHERE id = ?",
				args: [userId],
			});
			const user = result.rows[0];
			if (!user) return { error: "User not found", success: false };

			const isValid = await verifyPassword(
				currentPassword,
				user.password_hash as string,
			);
			if (!isValid)
				return { error: "Incorrect current password", success: false };
		}

		const newHash = await hashPassword(newPassword);

		await db.execute({
			sql: "UPDATE admins SET password_hash = ? WHERE id = ?",
			args: [newHash, userId],
		});

		return { success: true, error: "" };
	} catch (error) {
		return { error: "Failed to change password", success: false };
	}
}
