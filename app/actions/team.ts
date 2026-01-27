"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface TeamMember {
	id: string;
	name: string;
	role: string;
	bio: string;
	image_url?: string;
	category: "team" | "leadership";
	linkedin?: string;
	twitter?: string;
	email?: string;
}

export async function getTeamMembers(category?: string): Promise<TeamMember[]> {
	try {
		const sql = category
			? "SELECT * FROM team_members WHERE category = ? ORDER BY created_at DESC"
			: "SELECT * FROM team_members ORDER BY created_at DESC";

		const args = category ? [category] : [];

		const result = await db.execute({ sql, args });
		// Ensure simplified objects are returned to avoid "Only plain objects..." error
		return JSON.parse(JSON.stringify(result.rows)) as TeamMember[];
	} catch (error) {
		console.error("Database error:", error);
		return [];
	}
}

export async function getTeamMemberById(
	id: string,
): Promise<TeamMember | null> {
	try {
		const result = await db.execute({
			sql: "SELECT * FROM team_members WHERE id = ? LIMIT 1",
			args: [id],
		});
		const item = result.rows[0];
		return item ? (JSON.parse(JSON.stringify(item)) as TeamMember) : null;
	} catch (error) {
		console.error("Database error:", error);
		return null;
	}
}

export async function addTeamMember(data: Omit<TeamMember, "id">) {
	const id = Math.random().toString(36).substring(2, 15);

	try {
		await db.execute({
			sql: "INSERT INTO team_members (id, name, role, bio, image_url, category, linkedin, twitter, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
			args: [
				id,
				data.name,
				data.role,
				data.bio,
				data.image_url || null,
				data.category || "team",
				data.linkedin || null,
				data.twitter || null,
				data.email || null,
			],
		});
		revalidatePath("/about");
		revalidatePath("/admin/dashboard/team");
		revalidatePath("/admin/dashboard/leadership");
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
			sql: "UPDATE team_members SET name = ?, role = ?, bio = ?, image_url = ?, category = ?, linkedin = ?, twitter = ?, email = ? WHERE id = ?",
			args: [
				data.name,
				data.role,
				data.bio,
				data.image_url || null,
				data.category,
				data.linkedin || null,
				data.twitter || null,
				data.email || null,
				id,
			],
		});
		revalidatePath("/about");
		revalidatePath("/admin/dashboard/team");
		revalidatePath("/admin/dashboard/leadership");
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
		revalidatePath("/admin/dashboard/team");
		revalidatePath("/admin/dashboard/leadership");
	} catch (error) {
		console.error("Failed to delete member:", error);
		throw error;
	}
}
