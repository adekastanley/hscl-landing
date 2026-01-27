import { getItems, getYears } from "@/app/actions/content";
import ProjectsList from "@/components/pages/projectspage/ProjectsList";
import OurWorkClient from "@/components/pages/our-work/OurWorkClient";

interface OurWorkPageProps {
	searchParams: Promise<{
		page?: string;
		year?: string;
	}>;
}

export default async function OurWork({ searchParams }: OurWorkPageProps) {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const year = params.year || "all";
	const limit = 6; // Limit for Projects Grid

	// Fetch Projects
	const [projects, projectYears] = await Promise.all([
		getItems("project", limit, page, year),
		getYears("project"),
	]);

	const hasMoreProjects = projects.length === limit;

	return (
		<div className="min-h-screen bg-background pb-20">
			{/* Static/Client "What We Do" Content */}
			<OurWorkClient />

			{/* Dynamic Projects Section */}
			<div
				id="projects"
				className="container mx-auto px-6 max-w-6xl border-t pt-20"
			>
				<ProjectsList
					projects={projects}
					years={projectYears}
					currentYear={year}
					currentPage={page}
					hasMore={hasMoreProjects}
				/>
			</div>
		</div>
	);
}
