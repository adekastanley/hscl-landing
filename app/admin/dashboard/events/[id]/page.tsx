import { getEventRegistrations } from "@/app/actions/events";
import { getItemBySlug } from "@/app/actions/content";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import RegistrantsClientPage from "@/components/admin/events/RegistrantsClientPage";

interface PageProps {
	params: Promise<{ id: string }>;
}

async function getEventById(id: string) {
	try {
		const result = await db.execute({
			sql: "SELECT * FROM content_items WHERE id = ? LIMIT 1",
			args: [id],
		});
		const row = result.rows[0];
		if (!row) return null;
		// return standardized object if needed, or row
		return {
			...row,
			category: row.category as "event" | "training",
			status: row.status as "open" | "closed",
		};
	} catch (error) {
		console.error("Failed to get event:", error);
		return null;
	}
}

export default async function EventRegistrantsPage({ params }: PageProps) {
	const resolvedParams = await params;
	const event = await getEventById(resolvedParams.id);

	if (!event) {
		notFound();
	}

	const registrations = await getEventRegistrations(resolvedParams.id);

	return <RegistrantsClientPage event={event} registrations={registrations} />;
}
