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

export default function Home() {
	return (
		<div className="font-montserrat bg-chemonics-navy-light min-h-screen text-white">
			<HeroSection />
			<SectionOne />
			{/* <FocusAreasSection /> */}
			<MissionSection />

			<ServicesSection />
			<FeaturedProjectsSection />
			<InsightsSection />
			<Map />
			<ContactSection />
		</div>
	);
}
