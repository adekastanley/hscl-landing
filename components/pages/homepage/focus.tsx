"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const focusAreas = [
	{
		year: "01",
		title: "Health Systems Strengthening",
		description:
			"Building resilient systems for sustainable healthcare delivery.",
	},
	{
		year: "02",
		title: "Monitoring, Evaluation & Research",
		description: "Data-driven insights to inform policy and practice.",
	},
	{
		year: "03",
		title: "Public Health Interventions",
		description: "Targeted programs for HIV/AIDS, Malaria, and TB.",
	},
	{
		year: "04",
		title: "Human Resources for Health",
		description: "Capacity building and workforce development for the sector.",
	},
];

export default function FocusAreasSection() {
	const containerRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start center", "end center"],
	});

	const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

	return (
		<section
			ref={containerRef}
			className="relative bg-[#181D27] py-24 text-white overflow-hidden"
		>
			<div className="container mx-auto px-6">
				<div className="mb-16 text-center">
					<span className="mb-2 block font-montserrat text-sm font-bold uppercase tracking-widest text-chemonics-lime">
						Our Expertise
					</span>
					<h2 className="font-montserrat text-4xl font-bold text-white md:text-5xl">
						Focus Areas
					</h2>
				</div>

				<div className="relative mx-auto max-w-4xl">
					{/* Vertical Line */}
					<div className="absolute left-[20px] top-0 h-full w-[2px] bg-white/20 md:left-1/2 md:-translate-x-1/2">
						<motion.div
							style={{
								height: useTransform(pathLength, (value) => `${value * 100}%`),
							}}
							className="w-full bg-chemonics-lime"
						/>
					</div>

					<div className="flex flex-col gap-12 md:gap-24">
						{focusAreas.map((area, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className={`relative flex flex-col md:flex-row md:items-center pr-20 ${
									index % 2 === 0 ? "md:flex-row-reverse lg:pl-52" : ""
								}`}
							>
								{/* Center Icon */}
								<div className="absolute left-0 z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chemonics-lime text-xl font-bold text-chemonics-navy shadow-lg shadow-chemonics-lime/50 md:left-1/2 md:-translate-x-1/2">
									<span className="text-sm">{index + 1}</span>
								</div>

								{/* Content Box */}
								<div
									className={`ml-12 md:max-w-[45%] ${
										index % 2 === 0
											? "md:mr-auto md:ml-0 md:text-right"
											: "md:ml-auto"
									}`}
								>
									<h3 className="mb-3 font-montserrat text-2xl font-bold text-white">
										{area.title}
									</h3>
									<p className="font-montserrat text-gray-300 leading-relaxed">
										{area.description}
									</p>
								</div>

								{/* Empty side for balance */}
								<div className=" md:block md:w-[45%] bg-red-900 h-full"></div>
								{/* <div className="hidden md:block md:w-[45%] bg-red-900" /> */}
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
