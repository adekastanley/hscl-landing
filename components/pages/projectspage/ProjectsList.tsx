import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import Link from "next/link";
import { type ContentItem } from "@/app/actions/content";
import { ArticleCard } from "@/components/ArticleCard";

interface ProjectListProps {
	projects: ContentItem[];
	years: string[];
	currentYear: string;
	currentPage: number;
	hasMore: boolean;
	baseUrl?: string;
}

export default function ProjectsList({
	projects,
	years,
	currentYear,
	currentPage,
	hasMore,
	baseUrl = "/projects",
}: ProjectListProps) {
	return (
		<section id="projects" className="scroll-mt-32">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
				<div>
					<h2 className="text-3xl font-bold text-chemonics-navy mb-4 tracking-tight">
						Key Projects
					</h2>
					<p className="text-muted-foreground max-w-2xl">
						Explore our ongoing and completed initiatives in health systems
						strengthening.
					</p>
				</div>

				{/* Filter Controls */}
				<div className="flex flex-wrap items-center gap-3 bg-muted/50 p-2 rounded-2xl border border-border/50">
					<span className="text-[10px] font-bold px-3 text-muted-foreground/60 uppercase flex items-center gap-2 tracking-widest">
						<Filter className="h-3 w-3" /> Filter By Year
					</span>
					<div className="flex gap-1">
						<Link
							href={`${baseUrl}?year=all#projects`}
							scroll={false}
							className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
								currentYear === "all"
									? "bg-white shadow-sm text-chemonics-teal"
									: "text-muted-foreground hover:text-chemonics-teal"
							}`}
						>
							All
						</Link>
						{years.slice(0, 4).map((y) => (
							<Link
								key={y}
								href={`${baseUrl}?year=${y}#projects`}
								scroll={false}
								className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
									currentYear === y
										? "bg-white shadow-sm text-chemonics-teal"
										: "text-muted-foreground hover:text-chemonics-teal"
								}`}
							>
								{y}
							</Link>
						))}
					</div>
				</div>
			</div>

			{projects.length === 0 ? (
				<div className="text-center py-20 border border-dashed border-border rounded-2xl">
					<p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">
						No projects found for this selection.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 -mx-px border-l border-t border-border">
					{projects.map((project) => (
						<div key={project.id} className="border-r border-b border-border">
							<ArticleCard
								title={project.title}
								summary={project.summary}
								image_url={project.image_url}
								published_date={project.published_date}
								category={new Date(project.published_date)
									.getFullYear()
									.toString()}
								slug={project.slug}
								basePath="/projects"
							/>
						</div>
					))}
				</div>
			)}

			{/* Pagination Controls */}
			{(hasMore || currentPage > 1) && (
				<div className="flex justify-center items-center gap-6 mt-16">
					{currentPage > 1 && (
						<Link
							href={`${baseUrl}?page=${currentPage - 1}&year=${currentYear}#projects`}
							scroll={false}
						>
							<Button
								variant="outline"
								className="rounded-full px-8 border-chemonics-teal text-chemonics-teal hover:bg-chemonics-teal hover:text-white font-bold text-xs uppercase tracking-widest transition-all"
							>
								Previous
							</Button>
						</Link>
					)}

					<span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
						Page {currentPage}
					</span>

					{hasMore && (
						<Link
							href={`${baseUrl}?page=${currentPage + 1}&year=${currentYear}#projects`}
							scroll={false}
						>
							<Button
								variant="outline"
								className="rounded-full px-8 border-chemonics-teal text-chemonics-teal hover:bg-chemonics-teal hover:text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-chemonics-teal/20"
							>
								Next Page
							</Button>
						</Link>
					)}
				</div>
			)}
		</section>
	);
}
