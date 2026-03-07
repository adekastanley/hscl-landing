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
	FileText,
	ChevronLeft,
	ChevronRight,
	Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Resource, trackResourceDownload } from "@/app/actions/resources";
import { toast } from "sonner";
import {
	DownloadFormModal,
	UserData,
} from "@/components/modals/DownloadFormModal";

const ITEMS_PER_PAGE = 4;

export default function Leaning({ resources = [] }: { resources: Resource[] }) {
	const [activeTab, setActiveTab] = useState<"free" | "paid">("free");
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedResource, setSelectedResource] = useState<Resource | null>(
		null,
	);
	const [isModalOpen, setIsModalOpen] = useState(false);

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

	const handleShare = async (resource: Resource) => {
		const shareData = {
			title: resource.title,
			text: resource.description,
			url: window.location.href, // Or resource.link_url if you prefer direct link
		};

		if (navigator.share && navigator.canShare(shareData)) {
			try {
				await navigator.share(shareData);
			} catch (err) {
				console.error("Error sharing:", err);
			}
		} else {
			// Fallback to clipboard
			try {
				await navigator.clipboard.writeText(
					resource.link_url || window.location.href,
				);
				toast.success("Link copied to clipboard!");
			} catch (err) {
				console.error("Failed to copy:", err);
				toast.error("Failed to copy link.");
			}
		}
	};

	const handleDownloadClick = (e: React.MouseEvent, resource: Resource) => {
		// Only check for free resources
		if (resource.type !== "free") return;

		const storedUser = localStorage.getItem("hscl_user_info");
		if (storedUser) {
			try {
				const userData = JSON.parse(storedUser);
				// Silent tracking
				trackResourceDownload({
					resource_id: resource.id,
					full_name: userData.fullName,
					email: userData.email,
					industry: userData.industry,
				});
				// Allow default download behavior (the <a> tag will handle it)
				return;
			} catch (e) {
				// Invalid data in localStorage, show modal
			}
		}

		// Show modal
		e.preventDefault();
		setSelectedResource(resource);
		setIsModalOpen(true);
	};

	const handleModalSuccess = (userData: UserData) => {
		if (selectedResource?.file_url) {
			// Trigger download programmatically after form submission
			const link = document.createElement("a");
			link.href = selectedResource.file_url;
			link.download = "";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
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
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -15 }}
								transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
							>
								{/* Premium Minimalist Card */}
								<div className="group relative h-full flex flex-col bg-white overflow-hidden rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1">
									{/* Top Header / Badges overlay */}
									<div className="flex flex-row items-center justify-between p-6 pb-2 z-10 relative">
										<div className="flex gap-2 flex-wrap flex-1">
											{resource.tags.map((tag) => (
												<span
													key={tag}
													className="text-[10px] font-semibold tracking-wider uppercase px-3 py-1 bg-gray-50 text-gray-600 rounded-full border border-gray-100 transition-colors group-hover:bg-chemonics-green/10 group-hover:text-chemonics-green group-hover:border-chemonics-green/20"
												>
													{tag}
												</span>
											))}
										</div>
										<button
											onClick={() => handleShare(resource)}
											className="h-8 w-8 ml-2 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-all hover:bg-chemonics-green hover:text-white"
											aria-label="Share resource"
										>
											<Share2 className="h-4 w-4" />
										</button>
									</div>

									{/* Main Content Area */}
									<div className="flex-1 p-6 pt-4 relative z-10 flex flex-col">
										<div className="mb-4 text-chemonics-navy/20 transition-colors group-hover:text-chemonics-green/40">
											<FileText className="h-8 w-8 stroke-[1.5]" />
										</div>
										<h3 className="font-montserrat font-bold text-xl leading-tight mb-3 text-chemonics-navy group-hover:text-chemonics-green transition-colors duration-300">
											{resource.title}
										</h3>
										<p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-6">
											{resource.description}
										</p>

										{/* Bottom Action Footer */}
										<div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
											<span className="font-montserrat font-bold text-[15px] text-chemonics-navy">
												{resource.type === "free" ? "Free" : resource.cost}
											</span>

											{resource.type === "free" ? (
												<a
													href={resource.file_url || "#"}
													download
													onClick={(e) => handleDownloadClick(e, resource)}
													className="inline-flex items-center justify-center text-sm font-medium transition-colors text-chemonics-navy group-hover:text-chemonics-green"
												>
													<span className="mr-2">Download</span>
													<div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-chemonics-green/10 transition-transform group-hover:translate-x-1">
														<Download className="h-4 w-4" />
													</div>
												</a>
											) : (
												<a
													href={resource.link_url || "#"}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center justify-center text-sm font-medium transition-colors text-chemonics-navy group-hover:text-chemonics-green"
												>
													<span className="mr-2">Access</span>
													<div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-chemonics-green/10 transition-transform group-hover:translate-x-1">
														<ChevronRight className="h-4 w-4" />
													</div>
												</a>
											)}
										</div>
									</div>

									{/* Subtle hover background slide effect */}
									<div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none" />
								</div>
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

			{selectedResource && (
				<DownloadFormModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					resourceId={selectedResource.id}
					resourceTitle={selectedResource.title}
					onSuccess={handleModalSuccess}
				/>
			)}
		</section>
	);
}
