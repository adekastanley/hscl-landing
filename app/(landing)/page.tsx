import { HeroSection } from "@/components/pages/homepage/HeroSection";
import { MissionSection } from "@/components/pages/homepage/MissionSection";
import { InsightsSection } from "@/components/pages/homepage/InsightsSection";
import { SelectedEngagementSection } from "@/components/pages/homepage/SelectedEngamentSection";
import SectionOne from "@/components/pages/homepage/sectionOne";
import ServicesSection from "@/components/pages/homepage/services";
import { ContactSection } from "@/components/pages/homepage/ContactSection";
import Map from "@/components/pages/homepage/map";
import { AnimatedImpactCounters } from "@/components/pages/homepage/AnimatedImpactCounters";
// import Clients from "@/components/pages/homepage/clients";
import FocusAreasSection from "@/components/pages/homepage/focus";

import { getItems } from "@/app/actions/content";
import { getSiteContent } from "@/actions/landing/about";
import { getServices } from "@/actions/landing/services";
import { getActiveCountries } from "@/actions/landing/map";
import { getGlobalDocument } from "@/app/actions/documents";
import { LogoCloud } from "@/components/ui/logo-cloud";

export default async function Home() {
	const projects = await getItems("project", 3);
	const latestProjectList = await getItems("project", 1);
	const featuredProject = latestProjectList[0];
	const stories = await getItems("story", 3);
	const activeCountries = await getActiveCountries();
	const capabilityStatement = await getGlobalDocument("capability_statement");
	const services = await getServices();
	const focusAreasJson = await getSiteContent("focus_areas");
	const focusAreas = focusAreasJson ? JSON.parse(focusAreasJson) : null;

	return (
		<div className="flex min-h-screen flex-col font-sans">
			<HeroSection />
			<SectionOne />
			<FocusAreasSection focusAreas={focusAreas} />
			<MissionSection />
			<LogoCloud />
			<ServicesSection services={services} />
			<SelectedEngagementSection projects={projects} />
			<InsightsSection stories={stories} featuredProject={featuredProject} />
			<AnimatedImpactCounters />
			<Map activeCountries={activeCountries} document={capabilityStatement} />
			<ContactSection />
		</div>
	);
}
