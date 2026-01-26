import { getItemBySlug } from "@/app/actions/content";
import EventDetailClient from "@/components/pages/projectspage/EventDetailClient";
import { notFound } from "next/navigation";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
	const resolvedParams = await params;
	const event = await getItemBySlug(resolvedParams.slug, "event");

	if (!event) {
		notFound();
	}

	return <EventDetailClient event={event} />;
}
