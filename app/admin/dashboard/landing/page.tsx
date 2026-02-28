import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapManager from "@/components/admin/landing/MapManager";
import MissionManager from "@/components/admin/landing/MissionManager";
import ValuesManager from "@/components/admin/landing/ValuesManager";
import WhatWeDoManager from "@/components/admin/landing/WhatWeDoManager";
import DocumentManager from "@/components/admin/landing/DocumentManager";
import FocusAreasManager from "@/components/admin/landing/FocusAreasManager";
import HeroContentManager from "@/components/admin/landing/HeroContentManager";
import MissionTextManager from "@/components/admin/landing/MissionTextManager";
import SectionHeaderManager from "@/components/admin/landing/SectionHeaderManager";
import OurWorkItemsManager from "@/components/admin/landing/OurWorkItemsManager";
import NigeriaMapManager from "@/components/admin/landing/NigeriaMapManager";
import InsightsManager from "@/components/admin/landing/InsightsManager";
import SelectedEngagementsManager from "@/components/admin/landing/SelectedEngagementsManager";

export default function LandingPageManagement() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<h1 className="text-2xl font-bold">Landing Page</h1>
			<p className="text-muted-foreground">Manage landing page content here.</p>

			<Tabs defaultValue="home" className="space-y-4">
				<TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
					<TabsTrigger value="home">Home Page</TabsTrigger>
					<TabsTrigger value="our-work">Our Work (What we do)</TabsTrigger>
					<TabsTrigger value="about">Who We Are</TabsTrigger>
					<TabsTrigger value="global">Global Items</TabsTrigger>
				</TabsList>

				<TabsContent value="home" className="space-y-6">
					<div className="space-y-8">
						<section className="space-y-4">
							<h2 className="text-lg font-semibold border-b pb-2 text-chemonics-navy">
								Hero & Mission Section
							</h2>
							<HeroContentManager />
							<MissionTextManager />
						</section>

						<section className="space-y-4">
							<h2 className="text-lg font-semibold border-b pb-2 text-chemonics-navy">
								Focus Areas Section
							</h2>
							<SectionHeaderManager
								contentKey="focus_areas_headers"
								title="Headers"
								description="Manage the title and subheading for the Focus Areas section."
								defaultHeading="Our Expertise"
								defaultSubtext="Focus Areas"
							/>
							<FocusAreasManager />
						</section>

						<section className="space-y-4">
							<h2 className="text-lg font-semibold border-b pb-2 text-chemonics-navy">
								Services Section (Homepage)
							</h2>
							<SectionHeaderManager
								contentKey="services_headers"
								title="Headers"
								description="Manage the title and subheading for the Services list on the homepage."
								defaultHeading="How We Work"
								defaultSubtext="Our Services"
							/>
							<WhatWeDoManager />
						</section>

						<section className="space-y-4">
							<h2 className="text-lg font-semibold border-b pb-2 text-chemonics-navy">
								Insights Section (Homepage)
							</h2>
							<InsightsManager />
						</section>

						<section className="space-y-4">
							<h2 className="text-lg font-semibold border-b pb-2 text-chemonics-navy">
								Selected Engagements Section (Homepage)
							</h2>
							<SelectedEngagementsManager />
						</section>
					</div>
				</TabsContent>

				<TabsContent value="our-work" className="space-y-6">
					<div className="space-y-4">
						<h2 className="text-lg font-semibold border-b pb-2 text-chemonics-navy">
							Page Layout
						</h2>
						<SectionHeaderManager
							contentKey="our_work_page_headers"
							title="Page Header (Hero)"
							description="Manage the main title and description shown at the top of the '/our-work' page."
							defaultHeading="What We Do"
							defaultSubtext="Delivering incisive solutions in health systems strengthening..."
						/>
						<OurWorkItemsManager />
					</div>
				</TabsContent>

				<TabsContent value="about" className="space-y-6">
					<div className="space-y-4">
						<h2 className="text-lg font-semibold border-b pb-2 text-chemonics-navy">
							Who We Are Page Content
						</h2>
						<MissionManager />
						<ValuesManager />
					</div>
				</TabsContent>

				<TabsContent value="global" className="space-y-6">
					<div className="space-y-4">
						<h2 className="text-lg font-semibold border-b pb-2 text-chemonics-navy">
							Site-wide Components
						</h2>
						<DocumentManager />
						<MapManager />
						<NigeriaMapManager />
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
