import OurWorkClient from "@/components/pages/our-work/OurWorkClient";
import { getSiteContent } from "@/actions/landing/about";

export default async function OurWork() {
	const headersJson = await getSiteContent("our_work_page_headers");
	const headers = headersJson ? JSON.parse(headersJson) : null;

	return (
		<div className="min-h-screen bg-background pb-20">
			{/* Static/Client "What We Do" Content */}
			<OurWorkClient headers={headers} />
		</div>
	);
}
