import { Suspense } from "react";
import { getResourceDownloads } from "@/app/actions/resources";
import { DownloadsTable } from "@/components/admin/downloads/DownloadsTable";
import { IconDownload } from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default async function DownloadsPage() {
	const downloads = await getResourceDownloads();

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-2 text-chemonics-navy">
					<div className="w-10 h-10 bg-chemonics-lime/20 rounded-xl flex items-center justify-center">
						<IconDownload className="text-chemonics-navy" size={24} />
					</div>
					<h1 className="text-3xl font-bold font-montserrat">
						Resource Downloads
					</h1>
				</div>
				<p className="text-gray-500 max-w-2xl">
					Track who is downloading your resources. View applicant details, their
					industry, and precisely which document they accessed.
				</p>
			</div>

			<Suspense
				fallback={
					<div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
						Loading downloads data...
					</div>
				}
			>
				<DownloadsTable data={downloads} />
			</Suspense>
		</div>
	);
}
