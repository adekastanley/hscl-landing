import { HeroSection } from "@/components/pages/homepage/HeroSection";
import { MissionSection } from "@/components/pages/homepage/MissionSection";
import { InsightsSection } from "@/components/pages/homepage/InsightsSection";
import { FeaturedProjectsSection } from "@/components/pages/homepage/FeaturedProjectsSection";
import SectionOne from "@/components/pages/homepage/sectionOne";
import ServicesSection from "@/components/pages/homepage/services";
import { ContactSection } from "@/components/pages/homepage/ContactSection";
import Map from "@/components/pages/homepage/map";
// import Clients from "@/components/pages/homepage/clients";
import FocusAreasSection from "@/components/pages/homepage/focus";

import { getItems } from "@/app/actions/content";

import { getActiveCountries } from "@/actions/landing/map";

export default async function Home() {
	const projects = await getItems("project", 3);
	const stories = await getItems("story", 3);
	const activeCountries = await getActiveCountries();

	return (
		<div className="flex min-h-screen flex-col font-sans">
			<HeroSection />
			<SectionOne />
			<FocusAreasSection />
			<MissionSection />

			<ServicesSection />
			<FeaturedProjectsSection projects={projects} />
			<InsightsSection stories={stories} />
			<Map activeCountries={activeCountries} />
			<ContactSection />
		</div>
	);
}
