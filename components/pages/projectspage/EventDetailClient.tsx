"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Share2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ContentItem } from "@/app/actions/content";
import { EventRegistrationModal } from "@/components/pages/projectspage/EventRegistrationModal";
import { motion } from "motion/react";
import Markdown from "react-markdown";

interface EventDetailClientProps {
	event: ContentItem;
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const isTraining = event.category === "training";
	const isClosed = event.status === "closed";

	return (
		<main className="min-h-screen pt-24 pb-16">
			{/* Back Navigation */}
			<div className="container mx-auto px-4 mb-8">
				<Link
					href="/projects"
					className="inline-flex items-center text-chemonics-teal hover:text-chemonics-teal/80 transition-colors font-medium mb-4"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Events
				</Link>
			</div>

			{/* Hero Section */}
			<section className="container mx-auto px-4 mb-12">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
				>
					{/* Image */}
					<div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
						<Image
							src={event.image_url || "/assets/placeholder.jpg"}
							alt={event.title}
							fill
							className="object-cover"
							priority
						/>
						<div className="absolute top-4 left-4">
							<Badge
								className={`${
									isTraining
										? "bg-chemonics-teal text-white"
										: "bg-chemonics-lime text-chemonics-navy"
								} border-none text-sm px-3 py-1 font-semibold`}
							>
								{isTraining ? "Training" : "Event"}
							</Badge>
						</div>
					</div>

					{/* Content Info */}
					<div className="space-y-6">
						<div>
							<h1 className="text-4xl lg:text-5xl font-bold text-chemonics-navy mb-4 leading-tight">
								{event.title}
							</h1>
							<div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
								<div className="flex items-center gap-2">
									<Calendar className="h-5 w-5 text-chemonics-teal" />
									<span className="font-medium">
										{new Date(event.published_date).toLocaleDateString(
											"en-US",
											{
												weekday: "long",
												year: "numeric",
												month: "long",
												day: "numeric",
											},
										)}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<MapPin className="h-5 w-5 text-chemonics-teal" />
									<span className="font-medium">Location TBD</span>
								</div>
							</div>
						</div>

						<div className="prose prose-lg text-muted-foreground">
							<p className="lead text-xl text-chemonics-navy/80">
								{event.summary}
							</p>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-wrap gap-4 pt-4 border-t">
							<Button
								size="lg"
								className={`px-8 text-lg font-semibold shadow-lg transition-all ${
									isClosed
										? "bg-muted text-muted-foreground cursor-not-allowed"
										: "bg-chemonics-teal hover:bg-chemonics-teal/90 hover:scale-105"
								}`}
								disabled={isClosed}
								onClick={() => !isClosed && setIsModalOpen(true)}
							>
								{isClosed ? "Registration Closed" : "Register Now"}
							</Button>

							<Button
								variant="outline"
								size="lg"
								className="border-chemonics-teal text-chemonics-teal hover:bg-chemonics-teal/10"
							>
								<Share2 className="mr-2 h-5 w-5" /> Share Event
							</Button>
						</div>
					</div>
				</motion.div>
			</section>

			{/* Full Content */}
			<section className="container mx-auto px-4 max-w-4xl">
				<div className="prose prose-slate max-w-none">
					<h2 className="text-3xl font-bold text-chemonics-navy mb-6">
						Event Details
					</h2>
					<Markdown>{event.content}</Markdown>
				</div>
			</section>

			<EventRegistrationModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				eventId={event.id}
				eventTitle={event.title}
			/>
		</main>
	);
}
