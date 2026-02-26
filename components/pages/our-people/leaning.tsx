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
import { Resource } from "@/app/actions/resources";

const ITEMS_PER_PAGE = 4;

export default function Leaning({ resources = [] }: { resources: Resource[] }) {
	const [activeTab, setActiveTab] = useState<"free" | "paid">("free");
	const [currentPage, setCurrentPage] = useState(1);
	const filteredResources = resources.filter((res) => res.type === activeTab);
	const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE) || 1;

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
											{resource.type === "free" ? "Free" : resource.cost}
										</span>
										{resource.type === "free" ? (
											<Button asChild size="sm" className="gap-2">
												<a href={resource.file_url || "#"} download>
													Download
													<Download className="h-3 w-3" />
												</a>
											</Button>
										) : (
											<Button asChild size="sm" className="gap-2">
												<a
													href={resource.link_url || "#"}
													target="_blank"
													rel="noopener noreferrer"
												>
													Get Access
													<ChevronRight className="h-3 w-3" />
												</a>
											</Button>
										)}
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
