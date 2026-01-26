import { ContentTable } from "@/components/admin/content/ContentTable";

export default function AdminEventsPage() {
	return (
		<div className="p-6">
			<ContentTable type="event" />
		</div>
	);
}
