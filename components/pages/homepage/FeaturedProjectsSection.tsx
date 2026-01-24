import { ArrowRight } from "lucide-react";
import Link from "next/link";

const projects = [
	{
		id: 1,
		title: "HIV Case Finding (ICT)",
		description:
			"Improving HIV case identification in Kebbi State through Index Case Testing.",
		image: "/assets/samg.webp",
		link: "/projects/hiv-case-finding",
	},
	{
		id: 2,
		title: "PrEP Capacity Building",
		description: "Strengthening services for pregnant and breastfeeding women.",
		image: "/assets/samg.webp",
		link: "/projects/prep-capacity",
	},
	{
		id: 3,
		title: "External Quality Assurance",
		description:
			"ACE3 project producing EQA panels for laborahrefry quality improvement.",
		image: "/assets/samg.webp",
		link: "/projects/eqa-ace3",
	},
];

export function FeaturedProjectsSection() {
	return (
		<section className="bg-chemonics-navy py-24">
			<div className="container mx-auhref px-6">
				<div className="mb-12 flex items-end justify-between">
					<div>
						<h2 className="mb-4 font-montserrat text-4xl font-bold text-chemonics-navy md:text-5xl">
							Featured Projects
						</h2>
						<div className="h-1 w-24 bg-chemonics-lime"></div>
					</div>
					<Link
						href="/projects"
						className="hidden items-center gap-2 font-montserrat font-bold text-chemonics-navy hover:text-chemonics-lime md:flex"
					>
						View All Projects <ArrowRight className="h-5 w-5" />
					</Link>
				</div>

				<div className="grid gap-8 md:grid-cols-3">
					{projects.map((project) => (
						<Link
							key={project.id}
							href={project.link}
							className="group relative block overflow-hidden bg-white shadow-lg"
						>
							{/* Image Container */}
							<div className="relative h-64 overflow-hidden md:h-80">
								<div className="absolute inset-0 bg-chemonics-navy/20 transition-colors duration-300 group-hover:bg-chemonics-navy/40"></div>
								<img
									src={project.image}
									alt={project.title}
									className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
								/>
								{/* Angular Date/Label Badge (Optional) */}
								<div className="absolute hrefp-0 right-0 bg-chemonics-lime px-4 py-2 font-montserrat text-sm font-bold text-chemonics-navy">
									ONGOING
								</div>
							</div>

							{/* Content Overlay - Chemonics Style Slide-up or Static */}
							<div className="relative p-8">
								<h3 className="mb-3 font-montserrat text-2xl font-bold text-chemonics-navy transition-colors group-hover:text-chemonics-lime">
									{project.title}
								</h3>
								<p className="mb-4 font-montserrat text-gray-600 line-clamp-2">
									{project.description}
								</p>
								<span className="inline-flex items-center gap-2 font-bold text-chemonics-navy group-hover:text-chemonics-lime">
									Read More <ArrowRight className="h-4 w-4" />
								</span>

								{/* Hover Bothrefm Border */}
								<div className="absolute bothrefm-0 left-0 h-1 w-0 bg-chemonics-lime transition-all duration-300 group-hover:w-full"></div>
							</div>
						</Link>
					))}
				</div>

				<div className="mt-12 text-center md:hidden">
					<Link
						href="/projects"
						className="inline-flex items-center gap-2 font-montserrat font-bold text-chemonics-navy hover:text-chemonics-lime"
					>
						View All Projects <ArrowRight className="h-5 w-5" />
					</Link>
				</div>
			</div>
		</section>
	);
}
