"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
	Search,
	X,
	Loader2,
	FileText,
	Calendar,
	Building2,
	Briefcase,
	Map,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	globalSearch,
	type SearchResult,
	type SearchResultType,
} from "@/app/actions/search";

interface GlobalSearchProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	useEffect(() => {
		if (isOpen) {
			setQuery("");
			setResults([]);
			document.body.style.overflow = "hidden";
			// Small timeout to ensure the element is painted before focusing
			setTimeout(() => inputRef.current?.focus(), 100);
		} else {
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isOpen]);

	useEffect(() => {
		const debounceTimeout = setTimeout(async () => {
			if (query.trim().length >= 2) {
				setIsSearching(true);
				try {
					const data = await globalSearch(query);
					setResults(data);
				} catch (error) {
					console.error("Search failed:", error);
				} finally {
					setIsSearching(false);
				}
			} else {
				setResults([]);
			}
		}, 300); // 300ms debounce

		return () => clearTimeout(debounceTimeout);
	}, [query]);

	const getIconForType = (type: SearchResultType) => {
		switch (type) {
			case "Project":
				return <Briefcase className="h-5 w-5 text-chemonics-lime" />;
			case "Story":
				return <FileText className="h-5 w-5 text-blue-400" />;
			case "Event":
				return <Calendar className="h-5 w-5 text-purple-400" />;
			case "Service":
				return <Building2 className="h-5 w-5 text-emerald-400" />;
			case "Page":
				return <Map className="h-5 w-5 text-amber-500" />;
		}
	};

	const handleResultClick = (url: string) => {
		router.push(url);
		onClose();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4"
					onClick={onClose}
				>
					<motion.div
						initial={{ scale: 0.95, y: -20, opacity: 0 }}
						animate={{ scale: 1, y: 0, opacity: 1 }}
						exit={{ scale: 0.95, y: -20, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Search Input Bar */}
						<div className="flex items-center gap-4 px-6 py-4 border-b">
							<Search className="h-6 w-6 text-gray-400 shrink-0" />
							<input
								ref={inputRef}
								type="text"
								placeholder="Search for projects, events, services..."
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								className="flex-1 bg-transparent text-xl font-medium outline-none placeholder:text-gray-400 text-chemonics-navy"
							/>
							{isSearching && (
								<Loader2 className="h-5 w-5 text-chemonics-lime animate-spin shrink-0" />
							)}
							<button
								onClick={onClose}
								className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
							>
								<X className="h-5 w-5 text-gray-500" />
							</button>
						</div>

						{/* Results Area */}
						<div className="max-h-[60vh] overflow-y-auto">
							{query.trim().length >= 2 ? (
								results.length > 0 ? (
									<div className="p-4 space-y-2">
										{results.map((result) => (
											<button
												key={`${result.type}-${result.id}`}
												onClick={() => handleResultClick(result.url)}
												className="w-full text-left flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
											>
												<div className="p-3 bg-slate-100 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all shrink-0">
													{getIconForType(result.type)}
												</div>
												<div>
													<div className="flex items-center gap-2 mb-1">
														<span className="text-xs font-bold uppercase tracking-wider text-gray-500">
															{result.type}
														</span>
													</div>
													<h4 className="font-semibold text-chemonics-navy line-clamp-1 mb-1 group-hover:text-chemonics-lime transition-colors">
														{result.title}
													</h4>
													<p className="text-sm text-gray-500 line-clamp-2">
														{result.description}
													</p>
												</div>
											</button>
										))}
									</div>
								) : (
									!isSearching && (
										<div className="px-6 py-12 text-center text-gray-500">
											<p className="text-lg">No results found for "{query}"</p>
											<p className="text-sm mt-2">
												Try checking your spelling or using different keywords.
											</p>
										</div>
									)
								)
							) : (
								<div className="px-6 py-12 text-center text-gray-400">
									<Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
									<p>Type at least 2 characters to search.</p>
								</div>
							)}
						</div>

						{/* Footer Note */}
						<div className="px-6 py-3 bg-slate-50 border-t flex items-center justify-between text-xs text-gray-500">
							<span>Search across our entire portfolio</span>
							<span className="hidden sm:inline-flex items-center gap-1">
								Press{" "}
								<kbd className="px-2 py-1 bg-white border rounded font-mono shadow-sm">
									esc
								</kbd>{" "}
								to close
							</span>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
