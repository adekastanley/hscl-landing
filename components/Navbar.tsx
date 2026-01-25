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
			inFocus: {
				title: "IN FOCUS",
				image: "/assets/three.jpg",
				articleTitle: "Driving Sustainable Impact",
				articleDescription:
					"Learn how our holistic approach ensures long-term development success across the African continent.",
				articleLink: "/impact",
			},
		},
	},
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
				items: [
					{ label: "Health Systems", href: "/our-work#health-systems" },
					{ label: "Monitoring & Evaluation", href: "/our-work#mel" },
					{ label: "Public Health", href: "/our-work#public-health" },
					{ label: "Human Resources", href: "/our-work#hrh" },
				],
			},
			inFocus: {
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
		link: "/projects",
		hoverContentProps: {
			overview: {
				title: "In Focus",
				description:
					"Explore our latest projects, success stories, and thought leadership articles from the field.",
			},
			links: {
				title: "LATEST UPDATES",
				items: [
					{ label: "All Projects", href: "/projects" },
					{ label: "Success Stories", href: "/stories" },
					{ label: "Publications", href: "/publications" },
					{ label: "News", href: "/news" },
				],
			},
			inFocus: {
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

const menuVariants: Variants = {
	initial: {
		opacity: 0,
		y: -20,
	},
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.3,
			ease: "easeOut",
			staggerChildren: 0.1,
		},
	},
	exit: {
		opacity: 0,
		y: -20,
		transition: {
			duration: 0.2,
			ease: "easeIn",
			staggerChildren: 0.05,
			staggerDirection: -1,
		},
	},
};

const itemVariants: Variants = {
	initial: { opacity: 0, y: 10 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: 10 },
};

export function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

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
					<Button className="bg-chemonics-lime text-chemonics-navy font-bold hover:bg-chemonics-lime-hover rounded-full px-6">
						Contact
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
						className="absolute top-full h-screen pt-20 left-0 w-full bg-chemonics-navy p-6 shadow-xl md:hidden flex flex-col gap-4"
					>
						{[
							{ title: "Who We Are", link: "/about" },
							{ title: "What We Do", link: "/our-work" },
							{ title: "In Focus", link: "/projects" },
						].map((item, index) => (
							<motion.div key={index} variants={itemVariants}>
								<Link href={item.link} className="text-white font-medium block">
									{item.title}
								</Link>
							</motion.div>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
}
