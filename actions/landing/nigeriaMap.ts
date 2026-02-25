"use server";

import db from "@/lib/db";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

export interface ActiveNigeriaState {
	id: string;
	name: string;
	projects?: ActiveNigeriaStateProject[];
}

export interface ActiveNigeriaStateProject {
	id: string;
	state_id: string;
	title: string;
}

export const getActiveNigeriaStates = unstable_cache(
	async (): Promise<ActiveNigeriaState[]> => {
		try {
			const statesResult = await db.execute(
				"SELECT * FROM active_nigeria_states ORDER BY name ASC",
			);

			const states = statesResult.rows.map((row: any) => ({
				id: row.id,
				name: row.name,
				projects: [],
			})) as ActiveNigeriaState[];

			for (const state of states) {
				const projectsResult = await db.execute({
					sql: "SELECT * FROM active_nigeria_state_projects WHERE state_id = ?",
					args: [state.id],
				});

				state.projects = projectsResult.rows.map((pRow: any) => ({
					id: pRow.id,
					state_id: pRow.state_id,
					title: pRow.title,
				})) as ActiveNigeriaStateProject[];
			}

			return states;
		} catch (error) {
			console.error("Error fetching active nigeria states:", error);
			return [];
		}
	},
	["active-nigeria-states"],
	{ tags: ["active-nigeria-states"] },
);

export async function addActiveNigeriaState(data: { name: string }) {
	const id = crypto.randomUUID();
	try {
		await db.execute({
			sql: "INSERT INTO active_nigeria_states (id, name) VALUES (?, ?)",
			args: [id, data.name],
		});
		revalidatePath("/");
		revalidatePath("/admin/dashboard/landing");
		revalidateTag("active-nigeria-states", "default");
		return { success: true, id };
	} catch (error) {
		console.error("Error adding active nigeria state:", error);
		return { success: false, error };
	}
}

export async function updateActiveNigeriaState(
	id: string,
	data: { name: string },
) {
	try {
		await db.execute({
			sql: "UPDATE active_nigeria_states SET name = ? WHERE id = ?",
			args: [data.name, id],
		});
		revalidatePath("/");
		revalidatePath("/admin/dashboard/landing");
		revalidateTag("active-nigeria-states", "default");
		return { success: true };
	} catch (error) {
		console.error("Error updating active nigeria state:", error);
		return { success: false, error };
	}
}

export async function deleteActiveNigeriaState(id: string) {
	try {
		await db.execute({
			sql: "DELETE FROM active_nigeria_states WHERE id = ?",
			args: [id],
		});
		revalidatePath("/");
		revalidatePath("/admin/dashboard/landing");
		revalidateTag("active-nigeria-states", "default");
		return { success: true };
	} catch (error) {
		console.error("Error deleting active nigeria state:", error);
		return { success: false, error };
	}
}

export async function addProjectToNigeriaState(
	stateId: string,
	data: { title: string },
) {
	const id = crypto.randomUUID();
	try {
		await db.execute({
			sql: "INSERT INTO active_nigeria_state_projects (id, state_id, title) VALUES (?, ?, ?)",
			args: [id, stateId, data.title],
		});
		revalidatePath("/");
		revalidatePath("/admin/dashboard/landing");
		revalidateTag("active-nigeria-states", "default");
		return { success: true, id };
	} catch (error) {
		console.error("Error adding project to state:", error);
		return { success: false, error };
	}
}

export async function removeProjectFromNigeriaState(projectId: string) {
	try {
		await db.execute({
			sql: "DELETE FROM active_nigeria_state_projects WHERE id = ?",
			args: [projectId],
		});
		revalidatePath("/");
		revalidatePath("/admin/dashboard/landing");
		revalidateTag("active-nigeria-states", "default");
		return { success: true };
	} catch (error) {
		console.error("Error removing project from state:", error);
		return { success: false, error };
	}
}
