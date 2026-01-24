"use client";

import { motion } from "motion/react";

export default function ServicesSection() {
	const services = [
		{
			title: "more texr",
			description: "description of service",
			image: "/placeholder.svg?height=400&width=600",
		},
		{
			title: "more texr",
			description: "description of service",
			image: "/placeholder.svg?height=400&width=600",
		},
		{
			title: "more texr",
			description: "description of service",
			image: "/placeholder.svg?height=400&width=600",
		},
		{
			title: "more texr",
			description: "description of service",
			image: "/placeholder.svg?height=400&width=600",
		},
	];

	return (
		<section className="py-24 px-6 bg-background">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-16">
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.8 }}
						className="font-serif text-4xl md:text-5xl font-bold mb-4 text-primary"
					>
						Expertise
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="text-lg text-muted-foreground max-w-2xl mx-auto"
					>
						Lorem ipsum dolor sit amet consectetur.
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
