"use server";

import db from "@/lib/db";
import { unstable_cache } from "next/cache";
import { Service } from "./services";
import { ContentItem } from "@/app/actions/content";

export interface NavbarData {
	services: { title: string; slug: string }[];
	latestProject: ContentItem | null;
	latestEvent: ContentItem | null;
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
			const projectRes = await db.execute(
				"SELECT * FROM content_items WHERE type = 'project' ORDER BY published_date DESC LIMIT 1",
			);
			const latestProject = projectRes.rows[0]
				? ({
						...projectRes.rows[0],
						created_at: String(projectRes.rows[0].created_at),
					} as unknown as ContentItem)
				: null;

			// Fetch Latest Event (for "In Focus" -> In Focus)
			const eventRes = await db.execute(
				"SELECT * FROM content_items WHERE type = 'event' ORDER BY published_date DESC LIMIT 1",
			);
			const latestEvent = eventRes.rows[0]
				? ({
						...eventRes.rows[0],
						created_at: String(eventRes.rows[0].created_at),
					} as unknown as ContentItem)
				: null;

			return { services, latestProject, latestEvent };
		} catch (error) {
			console.error("Failed to fetch navbar data:", error);
			return { services: [], latestProject: null, latestEvent: null };
		}
	},
	["navbar-data"],
	{ tags: ["services", "content-items"] },
);
