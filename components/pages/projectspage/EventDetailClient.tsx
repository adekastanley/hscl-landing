"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Share2, ArrowLeft, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ContentItem } from "@/app/actions/content";
import { EventRegistrationModal } from "@/components/pages/projectspage/EventRegistrationModal";
import { motion } from "motion/react";
import Markdown from "react-markdown";
import { format } from "date-fns";

interface EventDetailClientProps {
	event: ContentItem;
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const isTraining = event.category === "training";
	const isClosed = event.status === "closed";

	return (
		<main className="min-h-screen bg-background pb-20 pt-24 md:pt-32">
			{/* Header Section */}
			<div className="container max-w-5xl mx-auto px-4 text-center mb-12">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Link
						href="/projects"
						className="inline-flex items-center text-sm font-medium text-chemonics-teal hover:text-chemonics-teal/80 mb-8 transition-colors group"
					>
						<ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />{" "}
						Back to Events
					</Link>

					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-chemonics-navy mb-6">
						{event.title}
					</h1>

					<div className="flex flex-wrap items-center justify-center gap-3">
						<Badge
							className={`${
								isTraining
									? "bg-chemonics-teal/10 text-chemonics-teal border-chemonics-teal/20"
									: "bg-chemonics-lime/10 text-chemonics-lime border-chemonics-lime/20"
							} px-3 py-1 font-semibold uppercase tracking-wider text-[10px]`}
						>
							{isTraining ? "Training" : "Event"}
						</Badge>
						{isClosed && (
							<Badge className="bg-destructive/10 text-destructive border-destructive/20 px-3 py-1 font-semibold uppercase tracking-wider text-[10px]">
								Registration Closed
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
						src={event.image_url || "/assets/placeholder.jpg"}
						alt={event.title}
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
						{/* Date */}
						<div className="space-y-4">
							<h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
								Date
							</h4>
							<div className="flex items-center gap-3 text-chemonics-navy">
								<Calendar className="h-5 w-5 opacity-40" />
								<span className="text-sm font-bold">
									{format(new Date(event.published_date), "MMM d, yyyy")}
								</span>
							</div>
						</div>

						{/* Location */}
						<div className="space-y-4">
							<h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
								Location
							</h4>
							<div className="flex items-center gap-3 text-chemonics-navy">
								<MapPin className="h-5 w-5 opacity-40" />
								<span className="text-sm font-bold">Location TBD</span>
							</div>
						</div>

						{/* Quick Actions */}
						<div className="space-y-6 pt-6 border-t border-border/50">
							<Button
								className={`w-full font-bold transition-all ${
									isClosed
										? "bg-muted text-muted-foreground"
										: "bg-chemonics-teal hover:bg-chemonics-teal/90 shadow-lg hover:shadow-chemonics-teal/20"
								}`}
								disabled={isClosed}
								size="lg"
								onClick={() => !isClosed && setIsModalOpen(true)}
							>
								{isClosed ? "Closed" : "Register Now"}
							</Button>

							<Button
								variant="outline"
								className="w-full border-border hover:bg-muted/50 text-chemonics-navy font-bold"
								size="lg"
							>
								<Share2 className="mr-2 h-4 w-4" /> Share
							</Button>
						</div>
					</aside>

					{/* Main Column - Event Info */}
					<article className="order-1 md:order-2">
						<div className="prose prose-lg prose-chemonics max-w-none">
							{event.summary && (
								<p className="lead text-xl md:text-2xl text-chemonics-navy/80 font-medium mb-12 border-l-4 border-chemonics-lime pl-8 py-2">
									{event.summary}
								</p>
							)}

							<div>
								<h2 className="text-2xl font-bold text-chemonics-navy mb-6">
									Event Details
								</h2>
								<div className="text-chemonics-navy/90 leading-relaxed">
									<Markdown>{event.content}</Markdown>
								</div>
							</div>
						</div>
					</article>
				</div>
			</div>

			<EventRegistrationModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				eventId={event.id}
				eventTitle={event.title}
			/>
		</main>
	);
}
