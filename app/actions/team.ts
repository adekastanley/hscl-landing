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
	display_order?: number;
}

export async function getTeamMembers(category?: string): Promise<TeamMember[]> {
	try {
		// Sort Priority:
		// 1. Members with display_order > 0 (Explicitly ordered)
		// 2. Members with display_order = 0 (Default / Unordered)
		//
		// CASE statement logic:
		// - If display_order = 0 -> 1 (Second group)
		// - Else -> 0 (First group)
		// Then sort by display_order ASC (for the first group: 1, 2, 3...)
		// Then by created_at DESC (for tie-breaking and for the zero group)
		const orderByClause =
			"ORDER BY CASE WHEN display_order = 0 THEN 1 ELSE 0 END ASC, display_order ASC, created_at DESC";

		const sql = category
			? `SELECT * FROM team_members WHERE category = ? ${orderByClause}`
			: `SELECT * FROM team_members ${orderByClause}`;

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
			sql: "INSERT INTO team_members (id, name, role, bio, image_url, category, linkedin, twitter, email, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
				data.display_order ?? 0,
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
			sql: "UPDATE team_members SET name = ?, role = ?, bio = ?, image_url = ?, category = ?, linkedin = ?, twitter = ?, email = ?, display_order = ? WHERE id = ?",
			args: [
				data.name,
				data.role,
				data.bio,
				data.image_url || null,
				data.category,
				data.linkedin || null,
				data.twitter || null,
				data.email || null,
				data.display_order ?? 0,
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
