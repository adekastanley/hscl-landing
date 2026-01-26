"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobListingsTable } from "@/components/admin/careers/JobListingsTable";
import { JobApplicationsTable } from "@/components/admin/careers/JobApplicationsTable";

export default function CareersPage() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Careers Dashboard</h1>
					<p className="text-muted-foreground">
						Manage job postings and review applications.
					</p>
				</div>
			</div>

			<Tabs defaultValue="listings" className="space-y-4">
				<TabsList>
					<TabsTrigger value="listings">Job Listings</TabsTrigger>
					<TabsTrigger value="applications">Applications</TabsTrigger>
				</TabsList>
				<TabsContent value="listings">
					<JobListingsTable />
				</TabsContent>
				<TabsContent value="applications">
					<JobApplicationsTable />
				</TabsContent>
			</Tabs>
		</div>
	);
}
