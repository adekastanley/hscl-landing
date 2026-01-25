import React from "react";
import { TeamManager } from "@/components/admin/TeamManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardContent() {
	return (
		<div className="flex-1 space-y-4">
			<Tabs defaultValue="team" className="space-y-4">
				<TabsList>
					<TabsTrigger value="team">Team Management</TabsTrigger>
					<TabsTrigger value="overview" disabled>
						Overview
					</TabsTrigger>
					<TabsTrigger value="settings" disabled>
						Settings
					</TabsTrigger>
				</TabsList>
				<TabsContent value="team" className="space-y-4">
					<TeamManager />
				</TabsContent>
				<TabsContent value="overview">
					<div className="h-[200px] flex items-center justify-center border rounded-lg bg-muted/10">
						<p className="text-muted-foreground">Overview coming soon</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
