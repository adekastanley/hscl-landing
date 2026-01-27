"use client";

import { motion } from "motion/react";

const services = [
	{
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
		image: "/placeholder.svg?height=400&width=600",
	},
	{
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
		image: "/placeholder.svg?height=400&width=600",
	},
	{
		title: `Policy Analysis
& Development`,
		description: `Provision of technical
assistance to support
the review and
development of sector
wide and program
specific policies.`,
		image: "/placeholder.svg?height=400&width=600",
	},
	{
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
		image: "/placeholder.svg?height=400&width=600",
	},
	{
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
		image: "/placeholder.svg?height=400&width=600",
	},
	{
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
		image: "/placeholder.svg?height=400&width=600",
	},
];

export default function ServicesSection() {
	return (
		<section className="py-24 px-6 bg-background">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-16">
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.8 }}
						className="font-sans text-4xl md:text-5xl font-bold mb-4 text-primary"
					>
						Our Services
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="text-lg text-muted-foreground max-w-2xl mx-auto"
					>
						We provide a broad spectrum of Consultancy and Implementation
						services, and we continually strive to deepen our expertise base and
						expand our portfolio diversity.
					</motion.p>
				</div>

				<div className="grid md:grid-cols-2 gap-8">
					{services.map((item, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-100px" }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							className="group bg-secondary rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300"
						>
							<div className="aspect-[3/2] overflow-hidden">
								<img
									src={item.image || "/placeholder.svg"}
									alt={item.title}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								/>
							</div>
							<div className="p-8">
								<div className="text-3xl font-bold text-primary mb-4">
									{item.title}
								</div>
								<p className="text-muted-foreground leading-relaxed">
									{item.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
