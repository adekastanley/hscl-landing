"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const services = [
	{
		id: "health-systems",
		title: "Health Systems Strengthening",
		description:
			"Strengthening health systems is ensuring that the system's performance is improved.",
		content: `HSS aims to improve the six health system building blocks: service delivery, health workforce, information systems, medical products/vaccines/technologies, financing, and leadership/governance. We help countries and organizations identify and implement changes in policy and practice to respond better to health challenges, leading to better health through improvements in access, coverage, quality, and efficiency.`,
		image: "/assets/three.jpg", // Placeholder
	},
	{
		id: "mel",
		title: "Monitoring, Evaluation & Learning",
		description:
			"Enhancing performance and achieving desired outcomes through data-driven insights.",
		content: `Our MEL framework is designed to improve current and future management of outputs, outcomes, and impact. We provide continuous assessment to give stakeholders timely information on progress. Our systematic evaluations assess relevance, effectiveness, efficiency, and impact, ensuring accountability and stimulating continuous learning and improvement for projects and institutions.`,
		image: "/assets/two.PNG", // Placeholder
	},
	{
		id: "public-health",
		title: "Public Health",
		description:
			"Protecting and improving the health of communities through organized efforts.",
		content: `We focus on protecting and improving the health of entire populations. Our work involves promoting healthy lifestyles, disease and injury prevention, and detecting, preventing, and responding to infectious diseases. We implement educational programs and evidence-based solutions to help communities live longer, healthier lives, ensuring health equity and preparedness.`,
		image: "/assets/samg.webp", // Placeholder
	},
	{
		id: "hrh",
		title: "Human Resources for Health",
		description: "Optimizing the health workforce for better service delivery.",
		content: `We address the challenges of the health workforce by developing strategies to improve recruitment, training, retention, and performance. Our approach ensures that the right people with the right skills are in the right places to deliver effective health services. We work on strengthening HR management systems and fostering a supportive environment for health workers.`,
		image: "/assets/three.jpg", // Placeholder
	},
];

export default function OurWorkClient() {
	const [activeSection, setActiveSection] = useState(services[0].id);
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

	// Handle hash navigation on mount
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

	// Intersection Observer
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

		services.forEach((service) => {
			const element = document.getElementById(service.id);
			if (element) observer.observe(element);
		});

		return () => observer.disconnect();
	}, []);

	return (
		<div className="bg-background">
			<motion.div
				className="fixed top-0 left-0 right-0 h-1 bg-chemonics-lime z-50 origin-left"
				style={{ scaleX }}
			/>

			{/* Hero Section */}
			<section className="relative h-[40vh] min-h-[400px] flex items-center justify-center bg-chemonics-navy text-white overflow-hidden">
				<div className="absolute inset-0 bg-black/20 z-10" />
				<div className="container relative z-20 text-center px-4">
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
						className="text-5xl md:text-6xl font-bold mb-6"
					>
						What We Do
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.2 }}
						className="text-lg md:text-xl max-w-2xl mx-auto text-gray-200"
					>
						Delivering incisive solutions in health systems strengthening,
						monitoring & evaluation, and public health interventions.
					</motion.p>
				</div>
			</section>

			{/* Sticky Sub-navigation */}
			<div className="sticky top-[80px] z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b w-full">
				<div className="container flex items-center justify-center h-14 overflow-x-auto no-scrollbar">
					<nav className="flex items-center space-x-6 text-sm font-medium">
						{services.map((item) => (
							<button
								key={item.id}
								onClick={() => scrollToSection(item.id)}
								className={cn(
									"transition-colors hover:text-chemonics-lime uppercase tracking-wide px-2 py-1 border-b-2 border-transparent whitespace-nowrap",
									activeSection === item.id
										? "text-chemonics-navy border-chemonics-lime font-bold"
										: "text-muted-foreground",
								)}
							>
								{item.title}
							</button>
						))}
					</nav>
				</div>
			</div>

			<div className="container py-16 px-4 md:px-8 max-w-6xl mx-auto space-y-24">
				{services.map((service, idx) => (
					<div key={service.id}>
						<section id={service.id} className="scroll-mt-32">
							<div
								className={cn(
									"grid md:grid-cols-2 gap-12 items-center",
									idx % 2 === 1 && "md:grid-flow-row-dense",
								)}
							>
								<motion.div
									initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									className={cn(idx % 2 === 1 && "md:col-start-2")}
								>
									<h2 className="text-3xl font-bold text-chemonics-navy mb-6">
										{service.title}
									</h2>
									<div className="w-20 h-1 bg-chemonics-lime mb-8" />
									<p className="text-xl font-medium text-chemonics-navy/80 mb-4">
										{service.description}
									</p>
									<p className="text-lg text-muted-foreground leading-relaxed">
										{service.content}
									</p>
								</motion.div>
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									className={cn(
										"bg-muted aspect-video rounded-xl overflow-hidden flex items-center justify-center shadow-lg",
										idx % 2 === 1 && "md:col-start-1",
									)}
								>
									<img
										src={service.image}
										alt={service.title}
										className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
										onError={(e) => {
											e.currentTarget.src = "https://placehold.co/600x400";
										}}
									/>
								</motion.div>
							</div>
						</section>
						{idx < services.length - 1 && <Separator className="mt-24" />}
					</div>
				))}
			</div>
		</div>
	);
}
