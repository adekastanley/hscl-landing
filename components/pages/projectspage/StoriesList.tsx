import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ContentItem } from "@/app/actions/content";

interface StoriesListProps {
	stories: ContentItem[];
}

export default function StoriesList({ stories }: StoriesListProps) {
	return (
		<section id="stories" className="scroll-mt-32">
			<div className="mb-8">
				<h2 className="text-3xl font-bold text-chemonics-navy mb-2">
					Success Stories
				</h2>
				<p className="text-muted-foreground">
					Real impact, real lives. See how we are making a difference.
				</p>
			</div>

			{stories.length === 0 ? (
				<div className="text-center py-20 bg-muted/30 rounded-lg">
					<p className="text-muted-foreground">No stories yet.</p>
				</div>
			) : (
				<div className="grid gap-8 md:grid-cols-2">
					{stories.map((story) => (
						<Link
							key={story.id}
							href={`/success-stories/${story.slug}`}
							className="group h-full"
						>
							<Card className="overflow-hidden border-none shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col md:flex-row bg-card">
								<div className="relative h-48 md:h-auto md:w-2/5 overflow-hidden">
									<Image
										src={story.image_url || "/assets/placeholder.jpg"}
										alt={story.title}
										fill
										className="object-cover transition-transform duration-500 group-hover:scale-105"
									/>
								</div>
								<CardContent className="flex-1 p-6 flex flex-col justify-center">
									<Quote className="h-6 w-6 text-chemonics-teal/30 fill-current mb-2" />
									<h3 className="text-xl font-bold text-chemonics-navy group-hover:text-chemonics-teal transition-colors line-clamp-2 mb-2">
										{story.title}
									</h3>
									<p className="text-muted-foreground line-clamp-2 mb-4 text-sm">
										{story.summary}
									</p>
									<div className="flex items-center gap-2 text-xs font-semibold text-chemonics-teal mt-auto">
										Read Full Story <ArrowRight className="h-3 w-3" />
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
