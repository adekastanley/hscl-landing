import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapManager from "@/components/admin/landing/MapManager";

export default function LandingPageManagement() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<h1 className="text-2xl font-bold">Landing Page</h1>
			<p className="text-muted-foreground">Manage landing page content here.</p>

			<Tabs defaultValue="home" className="space-y-4">
				<TabsList>
					<TabsTrigger value="home">Home Page</TabsTrigger>
					<TabsTrigger value="about">About (Who We Are)</TabsTrigger>
					{/* Add more tabs as needed */}
				</TabsList>

				<TabsContent value="home" className="space-y-4">
					<div className="grid gap-4">
						<MapManager />
						{/* Add other homepage sections here, e.g. Hero, etc. */}
					</div>
				</TabsContent>

				<TabsContent value="about">
					<div className="p-4 border rounded-lg bg-muted/20 border-dashed text-center text-muted-foreground">
						About page content management coming soon.
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
