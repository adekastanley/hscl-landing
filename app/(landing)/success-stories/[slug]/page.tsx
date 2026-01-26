import { getItemBySlug } from "@/app/actions/content";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SuccessStoryPageProps {
	params: Promise<{
		slug: string;
	}>;
}

export default async function SuccessStoryPage({
	params,
}: SuccessStoryPageProps) {
	const { slug } = await params;
	const story = await getItemBySlug(slug);

	if (!story) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-background pb-20">
			{/* Hero Section */}
			<div className="relative h-[50vh] min-h-[400px] w-full">
				<Image
					src={story.image_url || "/assets/placeholder.jpg"}
					alt={story.title}
					fill
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 bg-linear-to-t from-chemonics-navy/90 to-transparent" />
				<div className="absolute bottom-0 left-0 right-0 container pb-12 text-white">
					<Link
						href="/projects#stories"
						className="inline-flex items-center text-sm font-medium hover:text-chemonics-lime mb-6 transition-colors"
					>
						<ArrowLeft className="mr-2 h-4 w-4" /> Back to Success Stories
					</Link>
					<Badge className="bg-chemonics-teal hover:bg-chemonics-teal/90 text-white mb-4 border-none">
						Success Story
					</Badge>
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl mb-4">
						{story.title}
					</h1>
					<div className="flex flex-wrap items-center gap-6 text-gray-300">
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4" />
							{new Date(story.published_date).toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</div>
					</div>
				</div>
			</div>

			<div className="container max-w-4xl mx-auto mt-12 px-4">
				<div className="flex flex-col md:flex-row gap-12">
					<div className="flex-1">
						<div className="prose prose-lg max-w-none prose-headings:text-chemonics-navy prose-a:text-chemonics-teal">
							<p className="lead text-xl text-muted-foreground mb-8">
								{story.summary}
							</p>
							<div
								dangerouslySetInnerHTML={{ __html: story.content }}
								className="whitespace-pre-wrap"
							/>
						</div>
					</div>

					{/* Sidebar / Share Actions */}
					<div className="md:w-64 shrink-0 space-y-8">
						<div className="sticky top-24 p-6 bg-muted/30 rounded-lg">
							<h3 className="font-bold text-chemonics-navy mb-4">
								Share this story
							</h3>
							<div className="flex flex-col gap-3">
								<Button variant="outline" className="justify-start w-full">
									<Share2 className="mr-2 h-4 w-4" /> Share Link
								</Button>
								{/* Add real social share buttons here if needed */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
