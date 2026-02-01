"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import StoriesList from "@/components/pages/projectspage/StoriesList"; // Reusing existing stories list
import EventCard from "@/components/pages/projectspage/EventCard"; // Reusing existing event card
import OurPeopleGrid from "@/components/pages/projects/OurPeopleGrid"; // Importing the Team Grid
import { type ContentItem } from "@/app/actions/content";
import { type TeamMember } from "@/app/actions/team";
import { Separator } from "@/components/ui/separator";
import Leaning from "./leaning";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface OurPeopleClientPageProps {
	// leadership: TeamMember[];
	// team: TeamMember[];
	stories: ContentItem[];

	peopleStories: ContentItem[];
	currentStoriesPage: number;
	hasMoreStories: boolean;
	currentPeoplePage: number;
	hasMorePeopleStories: boolean;
}

export default function OurPeopleClientPage({
	// leadership,
	// team,
	stories,

	peopleStories,
	currentStoriesPage,
	hasMoreStories,
	currentPeoplePage,
	hasMorePeopleStories,
}: OurPeopleClientPageProps) {
	const [activeSection, setActiveSection] = useState("team");
	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			const offset = 100;
			const bodyRect = document.body.getBoundingClientRect().top;
			const elementRect = element.getBoundingClientRect().top;
			const elementPosition = elementRect - bodyRect;
			const offsetPosition = elementPosition - offset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
			setActiveSection(id);
		}
	};

	// Handle hash navigation
	useEffect(() => {
		if (window.location.hash) {
			const id = window.location.hash.substring(1);
			setTimeout(() => {
				const element = document.getElementById(id);
				if (element) {
					const offset = 100;
					const bodyRect = document.body.getBoundingClientRect().top;
					const elementRect = element.getBoundingClientRect().top;
					const elementPosition = elementRect - bodyRect;
					const offsetPosition = elementPosition - offset;

					window.scrollTo({
						top: offsetPosition,
						behavior: "smooth",
					});
					setActiveSection(id);
				}
			}, 500);
		}
	}, []);

	// Scroll Spy
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id);
					}
				});
			},
			{ threshold: 0.3, rootMargin: "-100px 0px -50% 0px" },
		);

		const sections = ["stories", "people-stories", "resources"];
		sections.forEach((id) => {
			const element = document.getElementById(id);
			if (element) observer.observe(element);
		});

		return () => observer.disconnect();
	}, []);

	return (
		<div className="min-h-screen bg-background">
			<motion.div
				className="fixed top-0 left-0 right-0 h-1 bg-chemonics-lime z-50 origin-left"
				style={{ scaleX }}
			/>

			{/* Hero Section */}
			<section className="relative h-[40vh] min-h-[400px] flex items-center justify-center bg-chemonics-navy text-white overflow-hidden">
				<div className="absolute inset-0 bg-black/30 z-10" />
				<div
					className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
					style={{ backgroundImage: "url('/assets/three.jpg')" }}
				/>
				<div className="container relative z-20 text-center px-4">
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
						className="text-5xl md:text-6xl font-bold mb-6"
					>
						Our People
					</motion.h1>
					<div className="h-1 w-24 bg-chemonics-lime mx-auto mb-6"></div>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.2 }}
						className="text-lg md:text-xl max-w-2xl mx-auto text-gray-200"
					>
						Meet the experts, innovators, and leaders dedicated to strengthening
						health systems and improving lives.
					</motion.p>
				</div>
			</section>

			{/* Sticky Sub-navigation */}
			<div className="sticky top-[80px] z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b w-full">
				<div className="container flex items-center justify-center h-14 overflow-x-auto no-scrollbar">
					<nav className="flex items-center space-x-6 text-sm font-medium">
						{[
							// { id: "leadership", label: "Leadership" },
							// { id: "team", label: "Our Team" },
							{ id: "people-stories", label: "People Stories" },
							{ id: "stories", label: "Success Stories" },
							{
								id: "learning-and-development",
								label: "Learning and Development",
							},

							{ id: "resources", label: "Resources" },
						].map((item) => (
							<button
								key={item.id}
								onClick={() => scrollToSection(item.id)}
								className={cn(
									"transition-colors hover:text-chemonics-lime uppercase tracking-wide px-2 py-1 border-b-2 border-transparent",
									activeSection === item.id
										? "text-chemonics-navy border-chemonics-lime font-bold"
										: "text-muted-foreground",
								)}
							>
								{item.label}
							</button>
						))}
					</nav>
				</div>
			</div>

			<div className="container py-16 px-4 md:px-8 max-w-6xl mx-auto space-y-24">
				{/* People's Stories Section */}
				<StoriesList
					stories={peopleStories}
					currentPage={currentPeoplePage}
					hasMore={hasMorePeopleStories}
					title="People's Stories"
					description="Hear from the individuals whose lives have been impacted by our work."
					paramName="peoplePage"
					id="people-stories"
				/>
				{/* Stories Section */}
				<StoriesList
					stories={stories}
					currentPage={currentStoriesPage}
					hasMore={hasMoreStories}
					title="Success Stories"
					description="Real impact, real lives. See how we are making a difference."
					paramName="storiesPage"
					id="stories"
				/>
				<Separator />
				<Leaning />
				<Separator />
				{/* Resources Section */}
				<section
					id="resources"
					className="scroll-mt-32 space-y-8 min-h-[300px] flex flex-col justify-center items-center text-center"
				>
					<h2 className="text-3xl font-bold text-chemonics-navy mb-4">
						Join Our Talent Community
					</h2>

					<p className="text-muted-foreground max-w-lg">
						Share your CV and we’ll reach out when a role matches your skills.
					</p>

					<div className="flex gap-4">
						<Button className="rounded-lg">
							<Link href="/careers/general">Get Started</Link>
						</Button>
						<Button className="rounded-lg">
							<Link href="/careers">View Openings</Link>
						</Button>
					</div>
				</section>
			</div>
		</div>
	);
}
