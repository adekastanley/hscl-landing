import { HeroSection } from "@/components/pages/homepage/HeroSection";
import { MissionSection } from "@/components/pages/homepage/MissionSection";
import { FocusAreasSection } from "@/components/pages/homepage/FocusAreasSection";
import { FeaturedProjectsSection } from "@/components/pages/homepage/FeaturedProjectsSection";
import SectionOne from "@/components/pages/homepage/sectionOne";
import ServicesSection from "@/components/pages/homepage/services";
import { ContactSection } from "@/components/pages/homepage/ContactSection";

export default function Home() {
	return (
		<div className="font-montserrat bg-chemonics-navy-light min-h-screen text-white">
			<HeroSection />
			<SectionOne />
			<MissionSection />
			<FocusAreasSection />
			<ServicesSection />
			<FeaturedProjectsSection />
			<ContactSection />
		</div>
	);
}
