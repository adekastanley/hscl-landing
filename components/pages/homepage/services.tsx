"use client";

import { motion } from "motion/react";
import { Service } from "@/actions/landing/services";

const defaultServices: Service[] = [
	{
		id: "1",
		slug: "design",
		content: "",
		title: "Health ProgrammesDesign and Implementation",
		description: `Design and Implementation of development and health protection programmes such as Immunization, Nutrition, FP, HIV, TB,
Malaria, MNCH, RH,
etc., and providing
Technical Assistance to
policy development
around WASH, Climate
change, Disease
surveillance, and other
Public Health concerns.`,
		image_url: "/assets/two.jpg",
	},
	{
		id: "2",
		slug: "hf",
		content: "",
		title: `Health Financing & Economic Reviews`,
		description: `Development of
innovative financing
strategies, design and
assessment of
insurance schemes,
costing, economic
evaluation of health
programmes and
public financial
management.`,
		image_url: "/assets/hf.jpg",
	},
	{
		id: "3",
		slug: "policy",
		content: "",
		title: `Policy Analysis
& Development`,
		description: `Provision of technical
assistance to support
the review and
development of sector
wide and program
specific policies.`,
		image_url: "/assets/policy.jpg",
	},
	{
		id: "4",
		slug: "merl",
		content: "",
		title: `Monitoring, Evaluation,
Research and Learning`,
		description: `Development of M&E
systems including
related technology,
designing and
conducting large scale
public health and
development research
and evaluation and
capacity building for
MERL.`,
		image_url: "/assets/eval.jpg",
	},
	{
		id: "5",
		slug: "hrh",
		content: "",
		title: `Human Resources
for Health (HRH)
Development`,
		description: `Health workforce
planning, workload
analysis, capacity
building and temporary
placement of
consultants for defined
projects/timelines.`,
		image_url: "/assets/hr.jpg",
	},
	{
		id: "6",
		slug: "psm",
		content: "",
		title: `Strengthening
Procurement Supply
Chain Management
Systems`,
		description: `Assessment and
policy/strategy
development for health
products supply chain
systems, technical
assistance for
improving coordination
and integration of PSM
for improved
efficiency.`,
		image_url: "/assets/pro.jpg",
	},
];

interface ServicesSectionProps {
	services?: Service[];
	headers?: { heading: string; subtext: string } | null;
}

export default function ServicesSection({
	services,
	headers,
}: ServicesSectionProps) {
	const displayServices =
		services && services.length > 0 ? services : defaultServices;
	return (
		<section className="py-24 px-6 bg-background">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-16 px-4">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.8 }}
					>
						<span className="mb-2 block font-montserrat text-sm font-bold uppercase tracking-widest text-chemonics-lime">
							{headers?.heading || "How We Work"}
						</span>
						<h2 className="font-sans text-4xl md:text-5xl font-bold mb-4 text-primary">
							{headers?.subtext || "Our Services"}
						</h2>
					</motion.div>
				</div>

				<div className="flex flex-col gap-24">
					{displayServices.map((item, index) => (
						<div key={item.id || index}>
							<div
								className={`grid md:grid-cols-2 gap-12 items-center ${
									index % 2 === 1 ? "md:grid-flow-row-dense" : ""
								}`}
							>
								{/* Text Content */}
								<motion.div
									initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true, margin: "-100px" }}
									transition={{ duration: 0.8 }}
									className={`${index % 2 === 1 ? "md:col-start-2" : ""}`}
								>
									<h3 className="text-3xl font-bold text-chemonics-navy mb-6">
										{item.title}
									</h3>
									<div className="w-16 h-1 bg-chemonics-lime mb-8" />
									<p className="text-xl text-muted-foreground leading-relaxed">
										{item.description}
									</p>
								</motion.div>

								{/* Image */}
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true, margin: "-100px" }}
									transition={{ duration: 0.8 }}
									className={`relative aspect-video rounded-2xl overflow-hidden shadow-xl ${
										index % 2 === 1 ? "md:col-start-1" : ""
									}`}
								>
									<img
										src={item.image_url || "/assets/three.jpg"}
										alt={item.title}
										className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
										onError={(e) => {
											e.currentTarget.src = "https://placehold.co/800x600";
										}}
									/>
								</motion.div>
							</div>
							{index < displayServices.length - 1 && (
								<div className="mt-24 h-px bg-border max-w-4xl mx-auto" />
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
