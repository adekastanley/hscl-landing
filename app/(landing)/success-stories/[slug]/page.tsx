import { getItemBySlug } from "@/app/actions/content";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/ArticleLayout";

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
		<ArticleLayout
			title={story.title}
			summary={story.summary}
			content={story.content}
			image_url={story.image_url}
			published_date={story.published_date}
			typeLabel="Success Story"
			category={story.type === "people_story" ? "People Story" : undefined}
			backLink={{
				href: "/projects#stories",
				label: "Back to Success Stories",
			}}
		/>
	);
}
