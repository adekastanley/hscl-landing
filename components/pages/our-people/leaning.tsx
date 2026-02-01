"use client";

import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Download,
	Bookmark,
	FileText,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LearningResource {
	id: string;
	title: string;
	description: string;
	type: "free" | "paid";
	cost: string;
	tags: string[];
	downloadLink: string;
}

const resources: LearningResource[] = [
	// Free Resources
	{
		id: "f1",
		title: "Community Health Guide",
		description:
			"A comprehensive guide to community health engagement strategies.",
		type: "free",
		cost: "Free",
		tags: ["PDF", "Guide"],
		downloadLink: "#",
	},
	{
		id: "f2",
		title: "HCSL Annual Report 2024",
		description:
			"Overview of our impact, projects, and financials for the year.",
		type: "free",
		cost: "Free",
		tags: ["Report", "Annual"],
		downloadLink: "#",
	},
	{
		id: "f3",
		title: "Malaria Prevention Toolkit",
		description:
			"Tools and resources for implementing effective malaria prevention programs.",
		type: "free",
		cost: "Free",
		tags: ["Toolkit", "Health"],
		downloadLink: "#",
	},
	{
		id: "f4",
		title: "Data Collection Best Practices",
		description:
			"Standard operating procedures for field data collection in rural areas.",
		type: "free",
		cost: "Free",
		tags: ["SOP", "Data"],
		downloadLink: "#",
	},
	{
		id: "f5",
		title: "Volunteer Handbook",
		description:
			"Essential information for new volunteers joining our missions.",
		type: "free",
		cost: "Free",
		tags: ["Handbook", "Onboarding"],
		downloadLink: "#",
	},
	{
		id: "f6",
		title: "Nutrition Workshop Slides",
		description:
			"Presentation decks from our recent nutrition awareness workshops.",
		type: "free",
		cost: "Free",
		tags: ["Presentation", "Nutrition"],
		downloadLink: "#",
	},
	{
		id: "f7",
		title: "Grant Writing Basics",
		description: "A starter guide for NGOs looking to secure funding.",
		type: "free",
		cost: "Free",
		tags: ["Guide", "Funding"],
		downloadLink: "#",
	},
	{
		id: "f8",
		title: "Impact Story Template",
		description: "Template for documenting and sharing success stories.",
		type: "free",
		cost: "Free",
		tags: ["Template", "Communications"],
		downloadLink: "#",
	},
	// Paid Resources
	{
		id: "p1",
		title: "Advanced MEL Certification",
		description:
			"Complete course materials for the Advanced Monitoring & Evaluation capability framework.",
		type: "paid",
		cost: "$150",
		tags: ["Course", "Certification"],
		downloadLink: "#",
	},
	{
		id: "p2",
		title: "Health Systems Leadership Masterclass",
		description: "Exclusive video series and workbook for health leaders.",
		type: "paid",
		cost: "$200",
		tags: ["Video", "Leadership"],
		downloadLink: "#",
	},
	{
		id: "p3",
		title: "Project Management for Development",
		description:
			"Comprehensive training module for managing development projects.",
		type: "paid",
		cost: "$120",
		tags: ["Training", "Management"],
		downloadLink: "#",
	},
	{
		id: "p4",
		title: "Grant Proposal Master Template Suite",
		description: "A collection of winning proposal templates for major donors.",
		type: "paid",
		cost: "$85",
		tags: ["Template", "Grants"],
		downloadLink: "#",
	},
	{
		id: "p5",
		title: "Statistical Analysis for Public Health",
		description:
			"In-depth guide and dataset examples for health data analysis.",
		type: "paid",
		cost: "$95",
		tags: ["Data", "Analysis"],
		downloadLink: "#",
	},
	{
		id: "p6",
		title: "NGO Financial Management Course",
		description:
			"Financial planning, reporting, and compliance for non-profits.",
		type: "paid",
		cost: "$180",
		tags: ["Finance", "Course"],
		downloadLink: "#",
	},
	{
		id: "p7",
		title: "Effective Advocacy Strategies",
		description: "Strategic frameworks for policy advocacy and change.",
		type: "paid",
		cost: "$110",
		tags: ["Strategy", "Advocacy"],
		downloadLink: "#",
	},
	{
		id: "p8",
		title: "Remote Team Management Kit",
		description:
			"Tools and policies for managing distributed development teams.",
		type: "paid",
		cost: "$75",
		tags: ["Management", "Remote Work"],
		downloadLink: "#",
	},
];

const ITEMS_PER_PAGE = 4;

export default function Leaning() {
	const [activeTab, setActiveTab] = useState<"free" | "paid">("free");
	const [currentPage, setCurrentPage] = useState(1);

	const filteredResources = resources.filter((res) => res.type === activeTab);
	const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);

	const currentResources = filteredResources.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	const handleTabChange = (tab: "free" | "paid") => {
		setActiveTab(tab);
		setCurrentPage(1);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<section id="learning-and-development" className="py-16 bg-muted/30">
			<div className="container mx-auto px-4 max-w-6xl">
				<div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
					<div>
						<h2 className="text-3xl font-bold text-chemonics-navy mb-2">
							Learning and Development
						</h2>
						<p className="text-muted-foreground text-lg max-w-2xl">
							Access our curated library of resources, guides, and training
							materials designed to empower health professionals.
						</p>
					</div>

					{/* Filter Toggles */}
					<div className="bg-muted p-1 rounded-lg inline-flex">
						<button
							onClick={() => handleTabChange("free")}
							className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
								activeTab === "free"
									? "bg-white text-chemonics-navy shadow-sm"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							Free Resources
						</button>
						<button
							onClick={() => handleTabChange("paid")}
							className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
								activeTab === "paid"
									? "bg-white text-chemonics-navy shadow-sm"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							Premium Courses
						</button>
					</div>
				</div>

				{/* Resource Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<AnimatePresence mode="wait">
						{currentResources.map((resource) => (
							<motion.div
								key={resource.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
							>
								<Card className="h-full flex flex-col hover:shadow-lg transition-shadow border-muted">
									<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
										<div className="p-2 bg-primary/10 rounded-lg text-primary">
											<FileText className="h-6 w-6" />
										</div>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 text-muted-foreground hover:text-primary"
										>
											<Bookmark className="h-4 w-4" />
											<span className="sr-only">Save</span>
										</Button>
									</CardHeader>
									<CardContent className="flex-1 pt-4">
										<div className="flex gap-2 mb-3 flex-wrap">
											{resource.tags.map((tag) => (
												<Badge
													key={tag}
													variant="secondary"
													className="text-[10px] px-2 py-0 h-5"
												>
													{tag}
												</Badge>
											))}
										</div>
										<h3 className="font-bold text-lg leading-tight mb-2 text-chemonics-navy">
											{resource.title}
										</h3>
										<p className="text-sm text-muted-foreground line-clamp-3">
											{resource.description}
										</p>
									</CardContent>
									<CardFooter className="pt-0 flex items-center justify-between border-t bg-muted/10 px-6 py-4 mt-auto">
										<span className="font-bold text-lg text-chemonics-navy">
											{resource.cost}
										</span>
										<Button size="sm" className="gap-2">
											Download
											<Download className="h-3 w-3" />
										</Button>
									</CardFooter>
								</Card>
							</motion.div>
						))}
					</AnimatePresence>
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex justify-center items-center gap-2">
						<Button
							variant="outline"
							size="icon"
							onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
							disabled={currentPage === 1}
						>
							<ChevronLeft className="h-4 w-4" />
							<span className="sr-only">Previous Page</span>
						</Button>
						<span className="text-sm font-medium text-muted-foreground">
							Page {currentPage} of {totalPages}
						</span>
						<Button
							variant="outline"
							size="icon"
							onClick={() =>
								handlePageChange(Math.min(totalPages, currentPage + 1))
							}
							disabled={currentPage === totalPages}
						>
							<ChevronRight className="h-4 w-4" />
							<span className="sr-only">Next Page</span>
						</Button>
					</div>
				)}
			</div>
		</section>
	);
}
