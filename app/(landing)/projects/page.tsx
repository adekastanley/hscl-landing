import { getItems, getYears } from "@/app/actions/content";
import ProjectsClientPage from "@/components/pages/projectspage/ProjectsClientPage";

interface ProjectsPageProps {
	searchParams: Promise<{
		page?: string;
		year?: string;
		storiesPage?: string;
	}>;
}

export default async function ProjectsPage({
	searchParams,
}: ProjectsPageProps) {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const storiesPage = Number(params.storiesPage) || 1;
	const year = params.year || "all";
	const limit = 6; // Limit for Projects Grid
	const storiesLimit = 4; // Limit for Stories Grid

	// Fetch Projects and Stories in parallel
	const [projects, projectYears, stories] = await Promise.all([
		getItems("project", limit, page, year),
		getYears("project"),
		getItems("story", storiesLimit, storiesPage),
	]);

	const hasMoreProjects = projects.length === limit;
	const hasMoreStories = stories.length === storiesLimit;

	return (
		<ProjectsClientPage
			projects={projects}
			stories={stories}
			years={projectYears}
			currentYear={year}
			currentPage={page}
			currentStoriesPage={storiesPage}
			hasMoreProjects={hasMoreProjects}
			hasMoreStories={hasMoreStories}
		/>
	);
}
