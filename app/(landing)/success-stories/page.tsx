import { getItems } from "@/app/actions/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function SuccessStoriesPage() {
	const stories = await getItems("story", 100); // Fetch all for now

	return (
		<div className="min-h-screen bg-background pt-24 pb-12">
			<div className="container px-4 md:px-6 mx-auto">
				<div className="max-w-3xl mx-auto text-center mb-16">
					<h1 className="text-3xl md:text-5xl font-bold tracking-tight text-chemonics-navy mb-4">
						Success Stories
					</h1>
					<p className="text-xl text-muted-foreground">
						Real impact, real lives. Discover how our initiatives are
						transforming communities across Nigeria.
					</p>
				</div>

				{stories.length === 0 ? (
					<div className="text-center py-20 bg-muted/30 rounded-lg">
						<p className="text-muted-foreground">
							No success stories published yet.
						</p>
					</div>
				) : (
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{stories.map((story) => (
							<Link
								key={story.id}
								href={`/success-stories/${story.slug}`}
								className="group h-full"
							>
								<Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-card">
									<div className="relative h-56 w-full overflow-hidden">
										<Image
											src={story.image_url || "/assets/placeholder.jpg"}
											alt={story.title}
											fill
											className="object-cover transition-transform duration-500 group-hover:scale-105"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
											<span className="text-white font-medium flex items-center gap-2">
												Read Story <ArrowRight className="h-4 w-4" />
											</span>
										</div>
									</div>
									<CardContent className="flex-1 p-6 flex flex-col">
										<div className="mb-4">
											<Quote className="h-8 w-8 text-chemonics-teal/20 fill-current mb-2" />
											<h3 className="text-xl font-bold text-chemonics-navy group-hover:text-chemonics-teal transition-colors line-clamp-2 mb-2">
												{story.title}
											</h3>
										</div>
										<p className="text-muted-foreground line-clamp-3 mb-4 flex-1 text-sm">
											{story.summary}
										</p>
										<div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-4 mt-auto">
											<Calendar className="h-3 w-3" />
											<span>
												{new Date(story.published_date).toLocaleDateString(
													undefined,
													{ month: "long", day: "numeric", year: "numeric" },
												)}
											</span>
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
