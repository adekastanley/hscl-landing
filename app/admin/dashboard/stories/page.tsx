import { ContentTable } from "@/components/admin/content/ContentTable";

export default function AdminStoriesPage() {
	return (
		<div className="p-6">
			<ContentTable type="story" />
		</div>
	);
}
