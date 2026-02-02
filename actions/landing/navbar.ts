"use server";

import db from "@/lib/db";
import { unstable_cache } from "next/cache";
import { Service } from "./services";
import { ContentItem } from "@/app/actions/content";

export interface NavbarData {
	services: { title: string; slug: string }[];
	latestProject: ContentItem | null;
}

export const getNavbarData = unstable_cache(
	async (): Promise<NavbarData> => {
		try {
			// Fetch Services (What We Do)
			const servicesRes = await db.execute(
				"SELECT title, slug FROM services ORDER BY created_at ASC",
			);
			const services = servicesRes.rows.map((row: any) => ({
				title: row.title,
				slug: row.slug,
			}));

			// Fetch Latest Project (for "What We Do" -> In Focus)
			// Assuming 'project' type in content_items
			const projectRes = await db.execute(
				"SELECT * FROM content_items WHERE type = 'project' ORDER BY published_date DESC LIMIT 1",
			);
			const latestProject = projectRes.rows[0]
				? ({
						...projectRes.rows[0],
						created_at: String(projectRes.rows[0].created_at),
					} as ContentItem)
				: null;

			return { services, latestProject };
		} catch (error) {
			console.error("Failed to fetch navbar data:", error);
			return { services: [], latestProject: null };
		}
	},
	["navbar-data"],
	{ tags: ["services", "content-items"] },
);
