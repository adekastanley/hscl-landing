import { Activity, Briefcase, Calendar, FileText, Users } from "lucide-react";
import { getDashboardStats } from "@/app/actions/stats";
import { DashboardStatCard } from "@/components/admin/DashboardStatCard";

export default async function DashboardPage() {
	const stats = await getDashboardStats();

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<h1 className="text-2xl font-semibold tracking-tight text-chemonics-navy">
				Dashboard Overview
			</h1>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<DashboardStatCard
					title="Total Job Listings"
					value={String(stats.listings.total)}
					description={`${stats.listings.active} active listings`}
					icon={Briefcase}
				/>
				<DashboardStatCard
					title="Active Events"
					value={String(stats.events.upcoming)}
					description={`${stats.events.registrations} total registrations`}
					icon={Calendar}
				/>
				<DashboardStatCard
					title="Projects"
					value={String(stats.content.projects)}
					description="Published projects"
					icon={Activity}
				/>
				<DashboardStatCard
					title="Success Stories"
					value={String(stats.content.stories)}
					description="Published stories"
					icon={FileText}
				/>
			</div>
			<div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6 flex items-center justify-center text-muted-foreground text-sm">
				Select a section from the sidebar to manage content.
			</div>
		</div>
	);
}
