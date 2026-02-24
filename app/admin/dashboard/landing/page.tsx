import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapManager from "@/components/admin/landing/MapManager";
import MissionManager from "@/components/admin/landing/MissionManager";
import ValuesManager from "@/components/admin/landing/ValuesManager";
import WhatWeDoManager from "@/components/admin/landing/WhatWeDoManager";
import DocumentManager from "@/components/admin/landing/DocumentManager";
import FocusAreasManager from "@/components/admin/landing/FocusAreasManager";

export default function LandingPageManagement() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<h1 className="text-2xl font-bold">Landing Page</h1>
			<p className="text-muted-foreground">Manage landing page content here.</p>

			<Tabs defaultValue="home" className="space-y-4">
				<TabsList>
					<TabsTrigger value="home">Home Page</TabsTrigger>
					<TabsTrigger value="about">About (Who We Are)</TabsTrigger>
				</TabsList>

				<TabsContent value="home" className="space-y-4">
					<div className="grid gap-4">
						<FocusAreasManager />
						<WhatWeDoManager />
						<DocumentManager />
						<MapManager />
					</div>
				</TabsContent>

				<TabsContent value="about" className="space-y-6">
					<MissionManager />
					<ValuesManager />
				</TabsContent>
			</Tabs>
		</div>
	);
}
