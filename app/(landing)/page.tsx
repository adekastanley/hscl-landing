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
import { getActiveNigeriaStates } from "@/actions/landing/nigeriaMap";
import { getFeaturedInsightId } from "@/actions/landing/insights";
import { LogoCloud } from "@/components/ui/logo-cloud";

export default async function Home() {
	const defaultProjects = await getItems("project", 3);
	let displayProjects = [...defaultProjects];

	const selectedEngagementsJson = await getSiteContent(
		"selected_engagements_projects",
	);

	if (selectedEngagementsJson) {
		try {
			const selectedIds = JSON.parse(selectedEngagementsJson);
			if (Array.isArray(selectedIds)) {
				const allProjects = await getItems("project", 100);
				const matchedProjects = selectedIds
					.map((id) => allProjects.find((p) => p.id === id))
					.filter((p): p is NonNullable<typeof p> => p !== undefined);

				if (matchedProjects.length > 0) {
					displayProjects = matchedProjects;
					if (displayProjects.length < 3) {
						const remaining = defaultProjects.filter(
							(p) => !displayProjects.some((dp) => dp.id === p.id),
						);
						displayProjects = [...displayProjects, ...remaining].slice(0, 3);
					}
				}
			}
		} catch (e) {
			console.error("Failed to parse selected engagements", e);
		}
	}

	// Feature Insight Logic
	const featuredId = await getFeaturedInsightId();
	let featuredProject = null;

	if (featuredId) {
		const items = await getItems("project", 100); // Get all to find by ID locally or add specific action
		const stories = await getItems("story", 100);
		const peopleStories = await getItems("people_story", 100);
		const allItems = [...items, ...stories, ...peopleStories];
		const found = allItems.find((i) => i.id === featuredId);
		if (found) featuredProject = found;
	}

	if (!featuredProject) {
		const latestPeopleStory = await getItems("people_story", 1);
		if (latestPeopleStory.length > 0) {
			featuredProject = latestPeopleStory[0];
		} else {
			const latestProjectList = await getItems("project", 1);
			if (latestProjectList.length > 0) {
				featuredProject = latestProjectList[0];
			} else {
				const latestStoryList = await getItems("story", 1);
				if (latestStoryList.length > 0) {
					featuredProject = latestStoryList[0];
				}
			}
		}
	}

	const stories = await getItems("story", 4);
	const activeCountries = await getActiveCountries();
	const capabilityStatement = await getGlobalDocument("capability_statement");
	const nigeriaStates = await getActiveNigeriaStates();
	const services = await getServices();
	const focusAreasJson = await getSiteContent("focus_areas");
	const focusAreas = focusAreasJson ? JSON.parse(focusAreasJson) : null;
	const heroText = await getSiteContent("hero_text");
	const missionText = await getSiteContent("mission_statement_text");

	const focusHeadersJson = await getSiteContent("focus_areas_headers");
	const focusHeaders = focusHeadersJson ? JSON.parse(focusHeadersJson) : null;

	const servicesHeadersJson = await getSiteContent("services_headers");
	const servicesHeaders = servicesHeadersJson
		? JSON.parse(servicesHeadersJson)
		: null;
	const insightsHeadersJson = await getSiteContent("insights_headers");
	const insightsHeaders = insightsHeadersJson
		? JSON.parse(insightsHeadersJson)
		: null;

	return (
		<div className="flex min-h-screen flex-col font-sans">
			<HeroSection content={heroText} />
			<SectionOne />
			<FocusAreasSection focusAreas={focusAreas} headers={focusHeaders} />
			<MissionSection content={missionText} />
			<LogoCloud />
			<ServicesSection services={services} headers={servicesHeaders} />
			<SelectedEngagementSection projects={displayProjects} />
			<InsightsSection
				stories={stories}
				featuredProject={featuredProject}
				headers={insightsHeaders}
			/>
			<AnimatedImpactCounters />
			<Map
				activeCountries={activeCountries}
				document={capabilityStatement}
				nigeriaStates={nigeriaStates}
			/>
			<ContactSection />
		</div>
	);
}
