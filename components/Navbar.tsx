"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, Variants } from "motion/react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import NavHoverContent from "./ui/navHoverContent";
import {
	IconBrandFacebook,
	IconBrandX,
	IconBrandLinkedin,
	IconBrandInstagram,
} from "@tabler/icons-react";

import { type ContentItem } from "@/app/actions/content";

import { type NavbarData } from "@/actions/landing/navbar";

interface NavbarProps {
	latestPeopleStory?: ContentItem;
	latestSuccessStory?: ContentItem;
	navbarData?: NavbarData;
}

const menuVariants: Variants = {
	initial: {
		scaleY: 0,
		opacity: 0,
		transformOrigin: "top",
	},
	animate: {
		scaleY: 1,
		opacity: 1,
		transition: {
			duration: 0.3,
			ease: "easeInOut",
			when: "beforeChildren",
			staggerChildren: 0.1,
		},
	},
	exit: {
		scaleY: 0,
		opacity: 0,
		transition: {
			duration: 0.3,
			ease: "easeInOut",
			when: "afterChildren",
			staggerChildren: 0.05,
			staggerDirection: -1,
		},
	},
};

const itemVariants: Variants = {
	initial: {
		y: 20,
		opacity: 0,
	},
	animate: {
		y: 0,
		opacity: 1,
		transition: {
			duration: 0.3,
			ease: "easeOut",
		},
	},
	exit: {
		y: 20,
		opacity: 0,
		transition: {
			duration: 0.2,
			ease: "easeIn",
		},
	},
};

export function Navbar({
	latestPeopleStory,
	latestSuccessStory,
	navbarData,
}: NavbarProps) {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const servicesLinks = navbarData?.services.length
		? navbarData.services.map((s) => ({
				label: s.title,
				href: `/our-work#${s.slug || s.title.toLowerCase().replace(/\s+/g, "-")}`, // Fallback slug logic just in case
			}))
		: [
				{ label: "Health Systems", href: "/our-work#health-systems" },
				{ label: "Monitoring & Evaluation", href: "/our-work#mel" },
				{ label: "Public Health", href: "/our-work#public-health" },
				{ label: "Human Resources", href: "/our-work#hrh" },
			];

	const latestProject = navbarData?.latestProject;

	const pcMenu = [
		{
			title: "Who We Are",
			link: "/about",
			hoverContentProps: {
				overview: {
					title: "Who We Are",
					description:
						"Our mission is to promote meaningful change around the world to help people live healthier, more productive, and more independent lives.",
				},
				links: {
					title: "WHO WE ARE",
					items: [
						{ label: "Our Mission", href: "/about#mission" },
						{ label: "Core Values", href: "/about#values" },
						{ label: "Leadership", href: "/about#leadership" },
						{ label: "Our Team", href: "/about#team" },
					],
				},
				inFocus: latestSuccessStory
					? {
							title: "SUCCESS STORY",
							image: latestSuccessStory.image_url || "/assets/three.jpg",
							articleTitle: latestSuccessStory.title,
							articleDescription: latestSuccessStory.summary,
							articleLink: `/success-stories/${latestSuccessStory.slug}`, // Assuming route
						}
					: {
							link: "/projects",
							title: "IN FOCUS",
							image: "/assets/three.jpg",
							articleTitle: "Driving Sustainable Impact",
							articleDescription:
								"Learn how our holistic approach ensures long-term development success across the African continent.",
							articleLink: "/impact",
						},
			},
		},
		// ... rest of pcMenu items (What We Do, In Focus, Our People)

		{
			title: "What We Do",
			link: "/our-work",

			hoverContentProps: {
				overview: {
					title: "What We Do",
					description:
						"We deliver incisive solutions in health systems strengthening, monitoring & evaluation, and public health interventions.",
				},
				links: {
					title: "SECTORS",
					items: servicesLinks,
				},
				inFocus: latestProject
					? {
							title: "FEATURED WORK",
							image: latestProject.image_url || "/assets/placeholder.jpg",
							articleTitle: latestProject.title,
							articleDescription: latestProject.summary,
							articleLink: `/projects/${latestProject.slug}`,
						}
					: {
							title: "FEATURED WORK",
							image: "/assets/two.PNG",
							articleTitle: "Kebbi State HIV Intervention",
							articleDescription:
								"Improving case finding and treatment outcomes through targeted index case testing strategies.",
							articleLink: "/projects/kebbi-hiv",
						},
			},
		},
		{
			title: "In Focus",
			link: "/focus",
			hoverContentProps: {
				overview: {
					title: "In Focus",
					description:
						"Explore our team, success stories, and upcoming events from the field.",
				},
				links: {
					title: "LATEST UPDATES",
					items: [
						{ label: "Our Projects", href: "/our-work#projects" },

						{ label: "Events", href: "/our-people#events" },
					],
				},
				inFocus: navbarData?.latestEvent
					? {
							title: "LATEST EVENT",
							// Use event image or fallback
							image:
								navbarData.latestEvent.image_url || "/assets/placeholder.jpg",
							articleTitle: navbarData.latestEvent.title,
							articleDescription: navbarData.latestEvent.summary,
							// Assuming events are at /events/[slug] or similar.
							// If not, we might need to check where events are routed.
							// Based on 'content_items', maybe /events?
							// Let's assume /events/[slug] for now as it is common.
							// Or better, let's check if there is an event page route.
							// I see 'app/events' directory in previous list_dir.
							articleLink: `/events/${navbarData.latestEvent.slug}`,
							buttonText: "View Event",
						}
					: {
							title: "HIGHLIGHT",
							image: "/assets/samg.webp",
							articleTitle: "ACE3 Quality Assurance",
							articleDescription:
								"Ensuring laboratory excellence through rigorous external quality assurance panels.",
							articleLink: "/projects/ace3",
						},
			},
		},
		{
			title: "Our People",
			link: "/our-people",
			hoverContentProps: {
				overview: {
					title: "Our People",
					description:
						"Discover our people's stories, and upcoming events from the field.",
				},
				links: {
					title: "LATEST UPDATES",
					items: [
						{ label: "People's Stories", href: "/our-people#people-stories" },
						{ label: "Success Stories", href: "/our-people#stories" },
						{ label: "Careers", href: "/careers" },
						{
							label: "Learning and development",
							href: "/our-people#learning-and-development",
						},
						{ label: "Resources", href: "/our-people#resources" },
					],
				},
				inFocus: latestPeopleStory
					? {
							title: "PEOPLE'S STORY",
							image: latestPeopleStory.image_url || "/assets/placeholder.jpg",
							articleTitle: latestPeopleStory.title,
							articleDescription: latestPeopleStory.summary,
							articleLink: `/success-stories/${latestPeopleStory.slug}`, // Assuming stories use this route, or maybe different? Reusing for now.
						}
					: {
							title: "HIGHLIGHT",
							image: "/assets/samg.webp",
							articleTitle: "ACE3 Quality Assurance",
							articleDescription:
								"Ensuring laboratory excellence through rigorous external quality assurance panels.",
							articleLink: "/projects/ace3",
						},
			},
		},
	];

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled ? "bg-chemonics-navy shadow-md py-4" : "bg-transparent py-6"
			}`}
		>
			<div className="container mx-auto flex items-center justify-between px-6">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2">
					<Logo />
				</Link>

				{/* Desktop Menu */}
				<div
					className={`hidden md:flex items-center gap-8 p-4 ${
						isScrolled ? "" : "bg-chemonics-navy p-4 rounded-full px-5"
					}`}
				>
					{pcMenu.map((item, index) => {
						return (
							<HoverCard key={index} openDelay={0} closeDelay={100}>
								<HoverCardTrigger asChild>
									<Link
										href={item.link}
										className="group flex items-center gap-1 text-sm font-medium  text-white transition-colors hover:text-chemonics-lime data-[state=open]:text-chemonics-lime"
									>
										{item.title}
										<ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
									</Link>
								</HoverCardTrigger>
								<HoverCardContent className="w-auto border-none bg-transparent p-0 shadow-none">
									<NavHoverContent {...item.hoverContentProps} />
								</HoverCardContent>
							</HoverCard>
						);
					})}
					<Button
						asChild
						className="bg-chemonics-lime text-chemonics-navy font-bold hover:bg-chemonics-lime-hover rounded-full px-6"
					>
						<Link href="/contact">Contact</Link>
					</Button>
				</div>

				{/* Mobile Menu Toggle */}
				<div className="md:hidden">
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="text-white"
					>
						{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						variants={menuVariants}
						initial="initial"
						animate="animate"
						exit="exit"
						className="absolute top-full h-screen pt-20 left-0 w-full bg-chemonics-navy p-6 shadow-xl md:hidden flex flex-col gap-6"
					>
						{[
							{ title: "Who We Are", link: "/about" },
							{ title: "What We Do", link: "/our-work" },
							{ title: "In Focus", link: "/focus" },
							{ title: "Our People", link: "/our-people" },
							{ title: "Contact", link: "/contact" },
						].map((item, index) => (
							<motion.div key={index} variants={itemVariants}>
								<Link
									href={item.link}
									className="text-white text-lg font-medium block border-b border-white/10 pb-4"
									onClick={() => setIsMenuOpen(false)}
								>
									{item.title}
								</Link>
							</motion.div>
						))}

						<motion.div variants={itemVariants} className="mt-4 flex gap-4">
							<a
								href="https://web.facebook.com/HsclNigeria/"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 bg-white/10 rounded-full text-white hover:bg-chemonics-lime hover:text-chemonics-navy transition-colors"
							>
								<IconBrandFacebook size={24} />
							</a>
							<a
								href="https://x.com/HSCLimited/"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 bg-white/10 rounded-full text-white hover:bg-chemonics-lime hover:text-chemonics-navy transition-colors"
							>
								<IconBrandX size={24} />
							</a>
							<a
								href="https://www.linkedin.com/company/health-systems-consult-limited/"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 bg-white/10 rounded-full text-white hover:bg-chemonics-lime hover:text-chemonics-navy transition-colors"
							>
								<IconBrandLinkedin size={24} />
							</a>
							<a
								href="#"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 bg-white/10 rounded-full text-white hover:bg-chemonics-lime hover:text-chemonics-navy transition-colors"
							>
								<IconBrandInstagram size={24} />
							</a>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
}
