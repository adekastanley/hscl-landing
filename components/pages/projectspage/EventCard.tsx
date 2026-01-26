import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ArrowRight, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ContentItem } from "@/app/actions/content";

interface EventCardProps {
	event: ContentItem;
}

export default function EventCard({ event }: EventCardProps) {
	// Determine category based on DB or title fallback
	const isTraining = event.category
		? event.category === "training"
		: event.title.toLowerCase().includes("training");

	const isClosed = event.status === "closed";

	return (
		<Link
			href={`/events/${event.slug}`}
			className={`group h-full block ${isClosed ? "opacity-75" : ""}`}
		>
			<Card className="overflow-hidden border-none shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col bg-card">
				<div className="relative h-48 w-full overflow-hidden">
					<Image
						src={event.image_url || "/assets/placeholder.jpg"}
						alt={event.title}
						fill
						className="object-cover transition-transform duration-500 group-hover:scale-105"
					/>
					<div className="absolute top-3 left-3">
						<Badge
							className={`${
								isTraining
									? "bg-chemonics-teal text-white hover:bg-chemonics-teal/90"
									: "bg-chemonics-lime text-chemonics-navy hover:bg-chemonics-lime/90"
							} border-none font-semibold`}
						>
							{isTraining ? "Training" : "Event"}
						</Badge>
					</div>
					<div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4">
						<div className="flex items-center text-white text-xs font-medium gap-3">
							<span className="flex items-center gap-1">
								<Calendar className="h-3 w-3" />
								{new Date(event.published_date).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								})}
							</span>
							<span className="flex items-center gap-1">
								<MapPin className="h-3 w-3" />
								Location
							</span>
						</div>
					</div>
				</div>
				<CardContent className="flex-1 p-5 flex flex-col">
					<h3 className="text-lg font-bold text-chemonics-navy mb-2 group-hover:text-chemonics-teal transition-colors line-clamp-2">
						{event.title}
					</h3>
					<p className="text-muted-foreground line-clamp-3 mb-4 flex-1 text-sm">
						{event.summary}
					</p>
					<div className="flex items-center justify-between mt-auto">
						<div className="text-chemonics-teal font-medium text-xs flex items-center">
							View Details{" "}
							<ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
						</div>

						{isClosed && (
							<Badge variant="secondary" className="flex items-center gap-1">
								<Lock className="h-3 w-3" /> Closed
							</Badge>
						)}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
