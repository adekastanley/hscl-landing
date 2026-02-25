"use server";

import db from "@/lib/db";

export type SearchResultType =
	| "Project"
	| "Story"
	| "Event"
	| "Service"
	| "Page";

export interface SearchResult {
	id: string;
	title: string;
	description: string;
	type: SearchResultType;
	url: string;
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
	if (!query || query.trim().length === 0) {
		return [];
	}

	const searchTerm = `%${query.trim()}%`;
	const results: SearchResult[] = [];

	try {
		// 1. Search Content Items (Projects, Stories, Events)
		// type IN ('project', 'story', 'event')
		const contentRes = await db.execute({
			sql: `
        SELECT id, title, summary, type, slug 
        FROM content_items 
        WHERE title LIKE ? OR summary LIKE ? OR content LIKE ?
        ORDER BY created_at DESC
        LIMIT 10
      `,
			args: [searchTerm, searchTerm, searchTerm],
		});

		contentRes.rows.forEach((row: any) => {
			let url = "/";
			let displayType: SearchResultType = "Project";

			switch (row.type) {
				case "project":
					url = `/projects/${row.slug}`;
					displayType = "Project";
					break;
				case "story":
					url = `/success-stories/${row.slug}`;
					displayType = "Story";
					break;
				case "event":
					url = `/events/${row.slug}`;
					displayType = "Event";
					break;
			}

			results.push({
				id: row.id as string,
				title: row.title as string,
				description: (row.summary as string) || "No summary available.",
				type: displayType,
				url,
			});
		});

		// 2. Search Services (What We Do)
		const servicesRes = await db.execute({
			sql: `
        SELECT id, title, description, slug 
        FROM services 
        WHERE title LIKE ? OR description LIKE ? OR content LIKE ?
        ORDER BY created_at DESC
        LIMIT 5
      `,
			args: [searchTerm, searchTerm, searchTerm],
		});

		servicesRes.rows.forEach((row: any) => {
			results.push({
				id: row.id as string,
				title: row.title as string,
				description: (row.description as string) || "No overview available.",
				type: "Service",
				url: `/our-work#${row.slug}`,
			});
		});

		// 3. Search Static Pages / Sections
		const staticPages = [
			{
				title: "Home",
				url: "/",
				keywords: ["home", "homepage", "landing", "index"],
			},
			{
				title: "Who We Are (About)",
				url: "/about",
				keywords: ["about", "who we are", "company", "about us"],
			},
			{
				title: "Mission & Vision",
				url: "/about#mission",
				keywords: ["mission", "vision", "values", "purpose", "goal"],
			},
			{
				title: "Core Values",
				url: "/about#values",
				keywords: ["core", "values", "principles", "ethics"],
			},
			{
				title: "Leadership",
				url: "/about#leadership",
				keywords: ["leadership", "directors", "executives", "management"],
			},
			{
				title: "Our Team",
				url: "/about#team",
				keywords: ["team", "staff", "employees"],
			},
			{
				title: "What We Do (Our Work)",
				url: "/our-work",
				keywords: ["what we do", "our work", "services", "portfolio"],
			},
			{
				title: "Projects",
				url: "/our-work#projects",
				keywords: ["projects", "portfolio", "work"],
			},
			{
				title: "Insights",
				url: "/insight",
				keywords: ["insights", "news", "articles", "blog", "updates"],
			},
			{
				title: "Our People",
				url: "/our-people",
				keywords: ["our people", "people directory", "human resources"],
			},
			{
				title: "People's Stories",
				url: "/our-people#people-stories",
				keywords: ["people stories", "staff stories", "employee", "story"],
			},
			{
				title: "Success Stories",
				url: "/our-people#stories",
				keywords: ["success stories", "case studies", "impact"],
			},
			{
				title: "Events",
				url: "/our-people#events",
				keywords: ["events", "webinars", "upcoming"],
			},
			{
				title: "Careers",
				url: "/careers",
				keywords: ["careers", "jobs", "hiring", "vacancies", "employment"],
			},
			{
				title: "Learning & Development",
				url: "/our-people#learning-and-development",
				keywords: ["learning", "development", "training", "l&d"],
			},
			{
				title: "Resources",
				url: "/our-people#resources",
				keywords: ["resources", "documents", "downloads", "materials"],
			},
			{
				title: "Contact Us",
				url: "/contact",
				keywords: [
					"contact",
					"reach out",
					"message",
					"support",
					"location",
					"address",
				],
			},
			{
				title: "Capability Statement",
				url: "/",
				keywords: ["capability statement", "download", "pdf"],
			},
		];

		const normalizedQuery = query.toLowerCase().trim();
		staticPages.forEach((page) => {
			if (
				page.title.toLowerCase().includes(normalizedQuery) ||
				page.keywords.some((kw) => kw.includes(normalizedQuery))
			) {
				results.push({
					id: `page-${page.url}`,
					title: page.title,
					description: `Navigate to ${page.title} section`,
					type: "Page",
					url: page.url,
				});
			}
		});

		// Return combined and sorted results (basic sort by matching relevance could be complex,
		// so for now just return the merged array)
		return results;
	} catch (error) {
		console.error("Global search failed:", error);
		return [];
	}
}
