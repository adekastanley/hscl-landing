"use server";

import db, { ensureDbInitialized } from "@/lib/db";

export interface DashboardStats {
	listings: {
		total: number;
		active: number;
		inactive: number;
	};
	events: {
		total: number;
		upcoming: number;
		registrations: number;
	};
	content: {
		projects: number;
		stories: number;
	};
}

export async function getDashboardStats(): Promise<DashboardStats> {
	await ensureDbInitialized();

	try {
		// Listings Stats
		const listingsRes = await db.execute(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as active
            FROM job_listings
        `);

		const listingsTotal = Number(listingsRes.rows[0]?.total || 0);
		const listingsActive = Number(listingsRes.rows[0]?.active || 0);

		// Events Stats
		// Note: We check type='event'. 'upcoming' logic depends on published_date >= current date?
		// User asked for "how many events are up", implies total/active.
		// Let's count total events and closed/open events if that field exists, or by date.
		// For simplicity, let's use the 'status' field if available (we added status to content_items schema).

		const eventsRes = await db.execute(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN type = 'event' AND status = 'open' THEN 1 ELSE 0 END) as active
            FROM content_items 
            WHERE type = 'event'
        `);
		const eventsTotal = Number(eventsRes.rows[0]?.total || 0);

		// Event Registrations
		const registrationsRes = await db.execute(`
            SELECT COUNT(*) as total FROM event_registrations
        `);
		const totalRegistrations = Number(registrationsRes.rows[0]?.total || 0);

		// Content Stats
		const contentRes = await db.execute(`
            SELECT 
                SUM(CASE WHEN type = 'project' THEN 1 ELSE 0 END) as projects,
                SUM(CASE WHEN type = 'story' THEN 1 ELSE 0 END) as stories
            FROM content_items
        `);
		const totalProjects = Number(contentRes.rows[0]?.projects || 0);
		const totalStories = Number(contentRes.rows[0]?.stories || 0);

		return {
			listings: {
				total: listingsTotal,
				active: listingsActive,
				inactive: listingsTotal - listingsActive,
			},
			events: {
				total: eventsTotal,
				upcoming: Number(eventsRes.rows[0]?.active || 0), // Using active/open as proxy for "up"
				registrations: totalRegistrations,
			},
			content: {
				projects: totalProjects,
				stories: totalStories,
			},
		};
	} catch (error) {
		console.error("Failed to fetch dashboard stats:", error);
		return {
			listings: { total: 0, active: 0, inactive: 0 },
			events: { total: 0, upcoming: 0, registrations: 0 },
			content: { projects: 0, stories: 0 },
		};
	}
}
