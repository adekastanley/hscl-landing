import { ResourceManager } from "@/components/admin/resources/ResourceManager";
import { getResources } from "@/app/actions/resources";

export default async function ResourcesAdminPage() {
	const resources = await getResources();

	return (
		<div className="p-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold font-montserrat text-chemonics-navy">
					Resource Management
				</h1>
				<p className="text-muted-foreground mt-2">
					Manage and upload PDFs or link external documents in the Learning and
					Development section.
				</p>
			</div>

			<ResourceManager initialResources={resources} />
		</div>
	);
}
