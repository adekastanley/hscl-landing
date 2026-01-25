"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface TeamMember {
	id: string;
	name: string;
	role: string;
	bio: string;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
	try {
		const stmt = db.prepare(
			"SELECT * FROM team_members ORDER BY created_at DESC",
		);
		return stmt.all() as TeamMember[];
	} catch (error) {
		console.error("Database error:", error);
		return [];
	}
}

export async function addTeamMember(data: Omit<TeamMember, "id">) {
	const id = Math.random().toString(36).substring(2, 15);
	const stmt = db.prepare(
		"INSERT INTO team_members (id, name, role, bio) VALUES (?, ?, ?, ?)",
	);

	try {
		stmt.run(id, data.name, data.role, data.bio);
		revalidatePath("/about");
		revalidatePath("/admin/dashboard");
		return { id, ...data };
	} catch (error) {
		console.error("Failed to add member:", error);
		throw error;
	}
}

export async function deleteTeamMember(id: string) {
	const stmt = db.prepare("DELETE FROM team_members WHERE id = ?");

	try {
		stmt.run(id);
		revalidatePath("/about");
		revalidatePath("/admin/dashboard");
	} catch (error) {
		console.error("Failed to delete member:", error);
		throw error;
	}
}
