"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { getServices, type Service } from "@/actions/landing/services";

export default function OurWorkClient() {
	const [services, setServices] = useState<Service[]>([]);
	const [activeSection, setActiveSection] = useState("");
	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	useEffect(() => {
		async function loadServices() {
			const data = await getServices();
			setServices(data);
			if (data.length > 0)
				setActiveSection(
					data[0].slug || data[0].title.toLowerCase().replace(/\s+/g, "-"),
				);
		}
		loadServices();
	}, []); // Removed missing dependency warning by adding empty array or correct dependencies

	const getSlug = (service: Service) =>
		service.slug || service.title.toLowerCase().replace(/\s+/g, "-");

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
			window.history.pushState(null, "", `#${id}`);
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
		if (services.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id);
						// Optional: Update URL hash as user scrolls? Maybe annoying.
					}
				});
			},
			{ threshold: 0.3, rootMargin: "-100px 0px -50% 0px" },
		);

		services.forEach((service) => {
			const slug = getSlug(service);
			const element = document.getElementById(slug);
			if (element) observer.observe(element);
		});

		return () => observer.disconnect();
	}, [services]);

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
			<div className="sticky  top-[80px] z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b w-full">
				<div className="container w-full flex items-center justify-center h-14 overflow-x-auto no-scrollbar">
					<nav className="w-full flex items-center space-x-6 text-sm font-medium ">
						{services.map((item) => {
							const slug = getSlug(item);
							return (
								<button
									key={item.id}
									onClick={() => scrollToSection(slug)}
									className={cn(
										"transition-colors  hover:text-chemonics-lime uppercase tracking-wide px-2 py-1 border-b-2 border-transparent whitespace-nowrap",
										activeSection === slug
											? "text-chemonics-navy border-chemonics-lime font-bold"
											: "text-muted-foreground",
									)}
								>
									{item.title}
								</button>
							);
						})}
					</nav>
				</div>
			</div>

			{services.length === 0 ? (
				<div className="container py-24 text-center text-muted-foreground">
					Loading services...
				</div>
			) : (
				<div className="container py-16 px-4 md:px-8 max-w-6xl mx-auto space-y-24">
					{services.map((service, idx) => {
						const slug = getSlug(service);
						return (
							<div key={service.id}>
								<section id={slug} className="scroll-mt-32">
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
											<p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
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
												src={service.image_url || "/assets/three.jpg"}
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
						);
					})}
				</div>
			)}
		</div>
	);
}
