import { getItems, getYears } from "@/app/actions/content";
import FocusClientPage from "@/components/pages/focus/FocusClientPage";

export const metadata = {
	title: "Focus Areas | HCSL",
	description:
		"Our projects and events focusing on health systems strengthening.",
};

interface FocusPageProps {
	searchParams: Promise<{
		page?: string;
		year?: string;
	}>;
}

export default async function FocusPage({ searchParams }: FocusPageProps) {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const year = params.year || "all";
	const limit = 6; // Limit for Projects Grid

	// Fetch Projects and Events in parallel
	const [projects, projectYears, events] = await Promise.all([
		getItems("project", limit, page, year),
		getYears("project"),
		getItems("event", 4),
	]);

	const hasMoreProjects = projects.length === limit;

	return (
		<FocusClientPage
			projects={projects}
			projectYears={projectYears}
			currentProjectYear={year}
			currentProjectPage={page}
			hasMoreProjects={hasMoreProjects}
			events={events}
		/>
	);
}
