"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ClientShareButton } from "@/components/ClientShareButton";
import { motion } from "motion/react";

interface ArticleLayoutProps {
	title: string;
	summary?: string;
	content: string;
	image_url: string;
	published_date: string;
	category?: string;
	backLink: {
		href: string;
		label: string;
	};
	typeLabel?: string;
	contributor?: {
		name: string;
		image?: string;
		role?: string;
	};
}

export function ArticleLayout({
	title,
	summary,
	content,
	image_url,
	published_date,
	category,
	backLink,
	typeLabel,
	contributor,
}: ArticleLayoutProps) {
	// Simple reading time calculation
	const wordCount = content.trim().split(/\s+/).length;
	const readingTime = Math.ceil(wordCount / 200); // Average 200 wpm

	return (
		<div className="min-h-screen bg-background pb-20 pt-24 md:pt-32">
			{/* Header Section */}
			<div className="container max-w-5xl mx-auto px-4 text-center mb-12">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Link
						href={backLink.href}
						className="inline-flex items-center text-sm font-medium text-chemonics-teal hover:text-chemonics-teal/80 mb-8 transition-colors group"
					>
						<ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />{" "}
						{backLink.label}
					</Link>

					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-chemonics-navy mb-6">
						{title}
					</h1>

					<div className="flex flex-wrap items-center justify-center gap-3">
						{typeLabel && (
							<Badge className="bg-chemonics-teal/10 text-chemonics-teal border-chemonics-teal/20 px-3 py-1 font-semibold uppercase tracking-wider text-[10px]">
								{typeLabel}
							</Badge>
						)}
						{category && (
							<Badge className="bg-chemonics-lime/10 text-chemonics-lime border-chemonics-lime/20 px-3 py-1 font-semibold uppercase tracking-wider text-[10px]">
								{category}
							</Badge>
						)}
					</div>
				</motion.div>
			</div>

			{/* Featured Image */}
			<div className="container max-w-6xl mx-auto px-4 mb-16">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="relative aspect-21/9 w-full rounded-4xl overflow-hidden shadow-2xl"
				>
					<Image
						src={image_url || "/assets/placeholder.jpg"}
						alt={title}
						fill
						className="object-cover"
						priority
						unoptimized
					/>
				</motion.div>
			</div>

			{/* Main Content Area */}
			<div className="container max-w-5xl mx-auto px-4">
				<div className="flex flex-col md:grid md:grid-cols-[200px_1fr] gap-12 lg:gap-20">
					{/* Left Sidebar - Meta Info */}
					<aside className="space-y-10 order-2 md:order-1">
						{/* Contributor */}
						<div className="space-y-4">
							<h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
								Contributor
							</h4>
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 rounded-full bg-chemonics-navy/5 flex items-center justify-center overflow-hidden border border-border/50">
									{contributor?.image ? (
										<Image
											src={contributor.image}
											alt={contributor.name}
											width={40}
											height={40}
											className="object-cover"
										/>
									) : (
										<User className="h-5 w-5 text-chemonics-navy/40" />
									)}
								</div>
								<div>
									<p className="text-sm font-bold text-chemonics-navy">
										{contributor?.name || "HCSL Team"}
									</p>
									<p className="text-[10px] text-muted-foreground font-medium">
										{contributor?.role || "Health Systems Experts"}
									</p>
								</div>
							</div>
						</div>

						{/* Date */}
						<div className="space-y-4">
							<h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
								Published
							</h4>
							<div className="flex items-center gap-3 text-chemonics-navy">
								<Calendar className="h-5 w-5 opacity-40" />
								<span className="text-sm font-bold">
									{format(new Date(published_date), "MMM d, yyyy")}
								</span>
							</div>
						</div>

						{/* Reading Time */}
						<div className="space-y-4">
							<h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
								Reading Time
							</h4>
							<div className="flex items-center gap-3 text-chemonics-navy">
								<Clock className="h-5 w-5 opacity-40" />
								<span className="text-sm font-bold">{readingTime} Minute</span>
							</div>
						</div>

						{/* Share */}
						<div className="space-y-4 pt-6 border-t border-border/50">
							<h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
								Share
							</h4>
							<ClientShareButton title={title} text={summary || ""} />
						</div>
					</aside>

					{/* Main Column - Article Body */}
					<article className="order-1 md:order-2">
						<div className="prose prose-lg prose-chemonics max-w-none">
							{summary && (
								<p className="lead text-xl md:text-2xl text-chemonics-navy/80 font-medium mb-12 border-l-4 border-chemonics-lime pl-8 py-2">
									{summary}
								</p>
							)}

							<div
								dangerouslySetInnerHTML={{ __html: content }}
								className="whitespace-pre-wrap text-chemonics-navy/90 leading-relaxed font-normal"
							/>
						</div>
					</article>
				</div>
			</div>
		</div>
	);
}
