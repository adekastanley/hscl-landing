import { ContentTable } from "@/components/admin/content/ContentTable";

export default function AdminPeopleStoriesPage() {
	return (
		<div className="p-6">
			<ContentTable type="people_story" />
		</div>
	);
}
