import { getItemBySlug } from "@/app/actions/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface StoryDetailPageProps {
	params: Promise<{
		slug: string;
	}>;
}

export default async function StoryDetailPage({
	params,
}: StoryDetailPageProps) {
	const { slug } = await params;
	const story = await getItemBySlug(slug);

	if (!story || story.type !== "story") {
		notFound();
	}

	return (
		<div className="min-h-screen bg-background pt-24 pb-12">
			<article className="container px-4 md:px-6 mx-auto max-w-4xl">
				{/* Back Link */}
				<Link
					href="/success-stories"
					className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-chemonics-teal mb-8 transition-colors"
				>
					<ArrowLeft className="mr-2 h-4 w-4" /> Back to Stories
				</Link>

				{/* Header */}
				<header className="mb-8 space-y-4 text-center">
					<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
						<Badge
							variant="secondary"
							className="bg-chemonics-teal/10 text-chemonics-teal hover:bg-chemonics-teal/20"
						>
							Success Story
						</Badge>
						<span className="flex items-center gap-1">
							<Calendar className="h-3 w-3" />
							{new Date(story.published_date).toLocaleDateString(undefined, {
								month: "long",
								day: "numeric",
								year: "numeric",
							})}
						</span>
					</div>
					<h1 className="text-3xl md:text-5xl font-bold tracking-tight text-chemonics-navy leading-tight">
						{story.title}
					</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						{story.summary}
					</p>
				</header>

				{/* Featured Image */}
				{story.image_url && (
					<div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden mb-12 shadow-lg">
						<Image
							src={story.image_url}
							alt={story.title}
							fill
							className="object-cover"
							priority
						/>
					</div>
				)}

				{/* Content */}
				<div className="bg-card rounded-xl p-8 md:p-12 shadow-sm border">
					<div
						className="prose prose-lg max-w-none prose-headings:text-chemonics-navy prose-a:text-chemonics-teal hover:prose-a:text-chemonics-teal/80 prose-blockquote:border-l-chemonics-teal prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg"
						dangerouslySetInnerHTML={{ __html: story.content }}
					/>
				</div>

				{/* Footer / Share */}
				<div className="mt-12 pt-8 flex justify-between items-center">
					<div className="text-sm text-muted-foreground">Share this story</div>
					<div className="flex gap-2">
						<Button variant="outline" size="icon">
							<Share2 className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</article>
		</div>
	);
}
