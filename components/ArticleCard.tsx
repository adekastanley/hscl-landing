"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { motion } from "motion/react";

interface ArticleCardProps {
	title: string;
	summary?: string;
	image_url: string;
	published_date: string;
	category?: string;
	slug: string;
	basePath: string;
}

export function ArticleCard({
	title,
	summary,
	image_url,
	published_date,
	category,
	slug,
	basePath,
}: ArticleCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			className="group flex flex-col h-full border border-border bg-card hover:bg-muted/30 transition-all duration-300"
		>
			<Link href={`${basePath}/${slug}`} className="flex flex-col h-full p-6">
				{/* Top Meta */}
				<div className="flex justify-between items-center mb-6">
					<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
						{format(new Date(published_date), "MMMM d, yyyy")}
					</span>
					{category && (
						<span className="text-[10px] font-bold uppercase tracking-[0.2em] border border-border rounded-full px-3 py-1 text-muted-foreground/80">
							{category}
						</span>
					)}
				</div>

				{/* Image */}
				<div className="relative aspect-16/10 w-full overflow-hidden mb-8">
					<Image
						src={image_url || "/assets/placeholder.jpg"}
						alt={title}
						fill
						className="object-cover transition-transform duration-700 group-hover:scale-105"
						unoptimized
					/>
				</div>

				{/* Content */}
				<div className="flex-1 flex flex-col">
					<h3 className="text-2xl font-bold text-chemonics-navy group-hover:text-chemonics-teal transition-colors leading-tight mb-4">
						{title}
					</h3>
					{summary && (
						<p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-8 flex-1">
							{summary}
						</p>
					)}

					{/* Bottom Link */}
					<div className="pt-6 border-t border-border/50">
						<span className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-chemonics-navy group-hover:text-chemonics-teal transition-colors">
							Read More{" "}
							<ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
						</span>
					</div>
				</div>
			</Link>
		</motion.div>
	);
}
