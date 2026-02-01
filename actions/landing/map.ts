"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface ActiveCountry {
	id: string;
	name: string;
	code?: string;
	projects?: ActiveCountryProject[];
}

export interface ActiveCountryProject {
	id: string;
	country_id: string;
	title: string;
}

export async function getActiveCountries(): Promise<ActiveCountry[]> {
	try {
		const countriesResult = await db.execute(
			"SELECT * FROM active_countries ORDER BY name ASC",
		);

		// Map to plain objects and sanitize
		const countries = countriesResult.rows.map((row: any) => ({
			id: row.id,
			name: row.name,
			code: row.code,
			projects: [],
		})) as ActiveCountry[];

		for (const country of countries) {
			const projectsResult = await db.execute({
				sql: "SELECT * FROM active_country_projects WHERE country_id = ?",
				args: [country.id],
			});

			// Map projects to partial objects to ensure no extra fields like 'link' or 'created_at' leak through
			country.projects = projectsResult.rows.map((pRow: any) => ({
				id: pRow.id,
				country_id: pRow.country_id,
				title: pRow.title,
			})) as ActiveCountryProject[];
		}

		return countries;
	} catch (error) {
		console.error("Error fetching active countries:", error);
		return [];
	}
}

export async function addActiveCountry(data: { name: string; code?: string }) {
	const id = crypto.randomUUID();
	try {
		await db.execute({
			sql: "INSERT INTO active_countries (id, name, code) VALUES (?, ?, ?)",
			args: [id, data.name, data.code || null],
		});
		revalidatePath("/");
		revalidatePath("/admin/dashboard/landing");
		return { success: true, id };
	} catch (error) {
		console.error("Error adding active country:", error);
		return { success: false, error };
	}
}

export async function updateActiveCountry(
	id: string,
	data: { name: string; code?: string },
) {
	try {
		await db.execute({
			sql: "UPDATE active_countries SET name = ?, code = ? WHERE id = ?",
			args: [data.name, data.code || null, id],
		});
		revalidatePath("/");
		revalidatePath("/admin/dashboard/landing");
		return { success: true };
	} catch (error) {
		console.error("Error updating active country:", error);
		return { success: false, error };
	}
}

export async function deleteActiveCountry(id: string) {
	try {
		await db.execute({
			sql: "DELETE FROM active_countries WHERE id = ?",
			args: [id],
		});
		revalidatePath("/");
		revalidatePath("/admin/dashboard/landing");
		return { success: true };
	} catch (error) {
		console.error("Error deleting active country:", error);
		return { success: false, error };
	}
}

export async function addProjectToCountry(
	countryId: string,
	data: { title: string },
) {
	const id = crypto.randomUUID();
	try {
		await db.execute({
			sql: "INSERT INTO active_country_projects (id, country_id, title) VALUES (?, ?, ?)",
			args: [id, countryId, data.title],
		});
		revalidatePath("/");
		revalidatePath("/admin/dashboard/landing");
		return { success: true, id };
	} catch (error) {
		console.error("Error adding project to country:", error);
		return { success: false, error };
	}
}

export async function removeProjectFromCountry(projectId: string) {
	try {
		await db.execute({
			sql: "DELETE FROM active_country_projects WHERE id = ?",
			args: [projectId],
		});
		revalidatePath("/");
		revalidatePath("/admin/dashboard/landing");
		return { success: true };
	} catch (error) {
		console.error("Error removing project from country:", error);
		return { success: false, error };
	}
}
