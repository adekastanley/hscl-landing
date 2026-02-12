"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentItem } from "@/app/actions/content";
import { format } from "date-fns";

interface InsightsSectionProps {
	stories: ContentItem[];
	featuredProject?: ContentItem;
}

export function InsightsSection({
	stories,
	featuredProject,
}: InsightsSectionProps) {
	return (
		<section className="py-24 bg-chemonics-navy text-white overflow-hidden">
			<div className="container mx-auto px-6 max-w-7xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
				>
					<div>
						<span className="block font-montserrat text-sm font-bold uppercase tracking-widest text-chemonics-lime mb-2">
							Our Insights
						</span>
						<h2 className="font-montserrat text-4xl md:text-5xl font-bold leading-tight">
							Thinking Ahead <br />
							<span className="text-gray-400">In Healthcare & Development</span>
						</h2>
					</div>
					<Button
						variant="outline"
						className="border-chemonics-lime text-chemonics-lime hover:bg-chemonics-lime hover:text-chemonics-navy rounded-full"
						asChild
					>
						<Link href="/our-people">View All Insights</Link>
					</Button>
				</motion.div>

				<div className="grid lg:grid-cols-12 gap-12">
					{/* Featured Article - Spans 7 cols */}
					{featuredProject && (
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
							className="lg:col-span-7 group cursor-pointer"
						>
							<Link href={`/projects/${featuredProject.slug}`}>
								<div className="relative aspect-16/10 overflow-hidden rounded-2xl mb-6">
									<div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
									<Image
										src={featuredProject.image_url || "/assets/three.jpg"}
										alt={featuredProject.title}
										fill
										className="object-cover transition-transform duration-700 group-hover:scale-105"
										unoptimized
									/>
									<div className="absolute top-6 left-6 z-20">
										<span className="bg-chemonics-lime text-chemonics-navy px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
											Featured
										</span>
									</div>
								</div>
								<div className="space-y-4">
									<div className="flex items-center gap-4 text-sm text-gray-400">
										<span className="flex items-center gap-1">
											<Calendar size={14} />{" "}
											{format(
												new Date(featuredProject.published_date),
												"dd MMM yyyy",
											)}
										</span>
										<span className="flex items-center gap-1">
											<Clock size={14} /> 5 min read
										</span>
									</div>
									<h3 className="text-3xl font-bold font-montserrat leading-tight group-hover:text-chemonics-lime transition-colors">
										{featuredProject.title}
									</h3>
									<p className="text-gray-300 text-lg leading-relaxed line-clamp-3">
										{featuredProject.summary}
									</p>
									<div className="pt-2">
										<span className="inline-flex items-center gap-2 text-chemonics-lime font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
											Read Story <ArrowRight size={16} />
										</span>
									</div>
								</div>
							</Link>
						</motion.div>
					)}

					{/* Sidebar List - Spans 5 cols */}
					<div className="lg:col-span-4 flex flex-col justify-between lg:justify-start space-y-8 lg:space-y-8">
						{stories.map((item, index) => (
							<motion.div
								key={item.id}
								initial={{ opacity: 0, x: 30 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
								className="group flex gap-6 items-start"
							>
								<div className="relative w-32 aspect-square shrink-0 rounded-xl overflow-hidden bg-gray-800">
									<Image
										src={item.image_url || "/assets/three.jpg"}
										alt={item.title}
										fill
										className="object-cover transition-transform duration-500 group-hover:scale-110"
										unoptimized
									/>
								</div>
								<div className="space-y-2">
									<div className="flex items-center gap-3 text-xs">
										<span className="text-chemonics-lime font-bold uppercase tracking-wider">
											Success Story
										</span>
										<span className="text-gray-500">•</span>
										<span className="text-gray-400">
											{format(new Date(item.published_date), "dd MMM yyyy")}
										</span>
									</div>
									<h4 className="text-lg font-bold font-montserrat leading-snug group-hover:text-chemonics-lime transition-colors line-clamp-3">
										<Link href={`/success-stories/${item.slug}`}>
											{item.title}
										</Link>
									</h4>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
