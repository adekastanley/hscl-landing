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
		const result = await db.execute(
			"SELECT * FROM team_members ORDER BY created_at DESC",
		);
		return result.rows as unknown as TeamMember[];
	} catch (error) {
		console.error("Database error:", error);
		return [];
	}
}

export async function addTeamMember(data: Omit<TeamMember, "id">) {
	const id = Math.random().toString(36).substring(2, 15);

	try {
		await db.execute({
			sql: "INSERT INTO team_members (id, name, role, bio) VALUES (?, ?, ?, ?)",
			args: [id, data.name, data.role, data.bio],
		});
		revalidatePath("/about");
		revalidatePath("/admin/dashboard");
		return { id, ...data };
	} catch (error) {
		console.error("Failed to add member:", error);
		throw error;
	}
}

export async function updateTeamMember(
	id: string,
	data: Omit<TeamMember, "id">,
) {
	try {
		await db.execute({
			sql: "UPDATE team_members SET name = ?, role = ?, bio = ? WHERE id = ?",
			args: [data.name, data.role, data.bio, id],
		});
		revalidatePath("/about");
		revalidatePath("/admin/dashboard");
		return { id, ...data };
	} catch (error) {
		console.error("Failed to update member:", error);
		throw error;
	}
}

export async function deleteTeamMember(id: string) {
	try {
		await db.execute({
			sql: "DELETE FROM team_members WHERE id = ?",
			args: [id],
		});
		revalidatePath("/about");
		revalidatePath("/admin/dashboard");
	} catch (error) {
		console.error("Failed to delete member:", error);
		throw error;
	}
}
