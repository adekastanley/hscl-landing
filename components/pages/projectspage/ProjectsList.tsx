import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ContentItem } from "@/app/actions/content";

interface ProjectsListProps {
	projects: ContentItem[];
	years: string[];
	currentYear: string;
	currentPage: number;
	hasMore: boolean;
}

export default function ProjectsList({
	projects,
	years,
	currentYear,
	currentPage,
	hasMore,
}: ProjectsListProps) {
	return (
		<section id="projects" className="scroll-mt-32">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
				<div>
					<h2 className="text-3xl font-bold text-chemonics-navy mb-2">
						Key Projects
					</h2>
					<p className="text-muted-foreground">
						Explore our ongoing and completed initiatives.
					</p>
				</div>

				{/* Filter & Pagination Controls */}
				<div className="flex flex-wrap items-center gap-2">
					<div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
						<span className="text-xs font-medium px-2 text-muted-foreground uppercase flex items-center gap-1">
							<Filter className="h-3 w-3" /> Year
						</span>
						<div className="flex gap-1">
							<Link
								href={`/projects?year=all#projects`}
								scroll={false}
								className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
									currentYear === "all"
										? "bg-white shadow-sm text-chemonics-teal"
										: "hover:text-chemonics-teal"
								}`}
							>
								All
							</Link>
							{years.slice(0, 3).map((y) => (
								<Link
									key={y}
									href={`/projects?year=${y}#projects`}
									scroll={false}
									className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
										currentYear === y
											? "bg-white shadow-sm text-chemonics-teal"
											: "hover:text-chemonics-teal"
									}`}
								>
									{y}
								</Link>
							))}
						</div>
					</div>

					<div className="flex items-center gap-1 ml-2">
						{currentPage > 1 && (
							<Link
								href={`/projects?page=${currentPage - 1}&year=${currentYear}#projects`}
								scroll={false}
							>
								<Button variant="outline" size="icon" className="h-8 w-8">
									<ArrowRight className="h-4 w-4 rotate-180" />
								</Button>
							</Link>
						)}
						{hasMore && (
							<Link
								href={`/projects?page=${currentPage + 1}&year=${currentYear}#projects`}
								scroll={false}
							>
								<Button variant="outline" size="icon" className="h-8 w-8">
									<ArrowRight className="h-4 w-4" />
								</Button>
							</Link>
						)}
					</div>
				</div>
			</div>

			{projects.length === 0 ? (
				<div className="text-center py-20 bg-muted/30 rounded-lg">
					<p className="text-muted-foreground">No projects found.</p>
				</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{projects.map((project) => (
						<Link
							key={project.id}
							href={`/projects/${project.slug}`}
							className="group"
						>
							<Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
								<div className="relative h-48 w-full overflow-hidden">
									<Image
										src={project.image_url || "/assets/placeholder.jpg"}
										alt={project.title}
										fill
										className="object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									<div className="absolute top-3 right-3">
										<Badge className="bg-white/90 text-chemonics-navy hover:bg-white text-xs">
											{new Date(project.published_date).getFullYear()}
										</Badge>
									</div>
								</div>
								<CardContent className="flex-1 p-5 flex flex-col">
									<h3 className="text-lg font-bold text-chemonics-navy mb-2 group-hover:text-chemonics-teal transition-colors line-clamp-2">
										{project.title}
									</h3>
									<p className="text-muted-foreground line-clamp-3 mb-4 flex-1 text-sm">
										{project.summary}
									</p>
									<div className="flex items-center text-chemonics-teal font-medium text-xs mt-auto">
										Read More{" "}
										<ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			)}
		</section>
	);
}
