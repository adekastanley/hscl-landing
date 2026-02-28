"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { type ContentItem } from "@/app/actions/content";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ArticleCard } from "@/components/ArticleCard";

interface StoriesListProps {
	stories: ContentItem[];
	currentPage: number;
	hasMore: boolean;
	title: string;
	description: string;
	paramName?: string;
	id?: string;
}

export default function StoriesList({
	stories,
	currentPage,
	hasMore,
	title,
	description,
	paramName = "storiesPage",
	id = "stories",
}: StoriesListProps) {
	const searchParams = useSearchParams();

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);
			return params.toString();
		},
		[searchParams],
	);

	return (
		<section id={id} className="scroll-mt-32">
			<div className="mb-12">
				<h2 className="text-3xl font-bold text-chemonics-navy mb-4 tracking-tight">
					{title}
				</h2>
				<p className="text-muted-foreground max-w-2xl">{description}</p>
			</div>

			{stories.length === 0 ? (
				<div className="text-center py-20 border border-dashed border-border rounded-lg">
					<p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">
						No stories yet.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 -mx-px border-l border-t border-border">
					{stories.map((story) => (
						<div
							key={story.id}
							className="border-r border-b border-border ml-0 mt-0"
						>
							<ArticleCard
								title={story.title}
								summary={story.summary}
								image_url={story.image_url}
								published_date={story.published_date}
								category={
									story.type === "people_story"
										? "People Story"
										: "Success Story"
								}
								slug={story.slug}
								basePath="/success-stories"
							/>
						</div>
					))}
				</div>
			)}

			{/* Pagination Controls */}
			{(hasMore || currentPage > 1) && (
				<div className="flex justify-center items-center gap-6 mt-16 pb-8">
					{currentPage > 1 && (
						<Link
							href={`?${createQueryString(paramName, String(currentPage - 1))}#${id}`}
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
							href={`?${createQueryString(paramName, String(currentPage + 1))}#${id}`}
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
