import { getItemBySlug } from "@/app/actions/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProjectDetailPageProps {
	params: Promise<{
		slug: string;
	}>;
}

export default async function ProjectDetailPage({
	params,
}: ProjectDetailPageProps) {
	const { slug } = await params;
	const project = await getItemBySlug(slug);

	if (!project || project.type !== "project") {
		notFound();
	}

	return (
		<div className="min-h-screen bg-background pt-24 pb-12">
			<article className="container px-4 md:px-6 mx-auto max-w-4xl">
				{/* Back Link */}
				<Link
					href="/projects"
					className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-chemonics-teal mb-8 transition-colors"
				>
					<ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
				</Link>

				{/* Header */}
				<header className="mb-8 space-y-4">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Badge
							variant="outline"
							className="border-chemonics-teal text-chemonics-teal"
						>
							Project
						</Badge>
						<span className="flex items-center gap-1">
							<Calendar className="h-3 w-3" />
							{new Date(project.published_date).toLocaleDateString(undefined, {
								month: "long",
								day: "numeric",
								year: "numeric",
							})}
						</span>
					</div>
					<h1 className="text-3xl md:text-5xl font-bold tracking-tight text-chemonics-navy leading-tight">
						{project.title}
					</h1>
					<p className="text-xl text-muted-foreground">{project.summary}</p>
				</header>

				{/* Featured Image */}
				{project.image_url && (
					<div className="relative w-full aspect-video rounded-xl overflow-hidden mb-12 shadow-lg">
						<Image
							src={project.image_url}
							alt={project.title}
							fill
							className="object-cover"
							priority
						/>
					</div>
				)}

				{/* Content */}
				<div
					className="prose prose-lg max-w-none prose-headings:text-chemonics-navy prose-a:text-chemonics-teal hover:prose-a:text-chemonics-teal/80"
					dangerouslySetInnerHTML={{ __html: project.content }}
				/>

				{/* Footer / Share */}
				<div className="mt-12 pt-8 border-t flex justify-between items-center">
					<div className="text-sm text-muted-foreground">
						Share this project
					</div>
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
