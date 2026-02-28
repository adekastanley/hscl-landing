import { getItemBySlug } from "@/app/actions/content";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/ArticleLayout";

interface ProjectPageProps {
	params: Promise<{
		slug: string;
	}>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
	const { slug } = await params;
	const project = await getItemBySlug(slug);

	if (!project || project.type !== "project") {
		notFound();
	}

	return (
		<ArticleLayout
			title={project.title}
			summary={project.summary}
			content={project.content}
			image_url={project.image_url}
			published_date={project.published_date}
			typeLabel="Project"
			backLink={{
				href: "/insights",
				label: "Back to Insights",
			}}
		/>
	);
}
