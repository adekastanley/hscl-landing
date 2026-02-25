"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Save, Loader2, Sparkles } from "lucide-react";
import { getSiteContent, updateSiteContent } from "@/actions/landing/about";
import {
	getAllPotentialFeaturedItems,
	getFeaturedInsightId,
	updateFeaturedInsightId,
} from "@/actions/landing/insights";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ContentItem } from "@/app/actions/content";

export default function InsightsManager() {
	const [headers, setHeaders] = useState({
		label: "",
		title1: "",
		title2: "",
	});
	const [featuredId, setFeaturedId] = useState<string>("latest");
	const [potentialItems, setPotentialItems] = useState<ContentItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		async function fetchData() {
			try {
				const [headerData, featId, items] = await Promise.all([
					getSiteContent("insights_headers"),
					getFeaturedInsightId(),
					getAllPotentialFeaturedItems(),
				]);

				if (headerData) {
					setHeaders(JSON.parse(headerData));
				}
				if (featId) {
					setFeaturedId(featId);
				}
				setPotentialItems(items);
			} catch (error) {
				console.error("Failed to fetch insights data", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchData();
	}, []);

	const handleSave = async () => {
		setIsSaving(true);
		try {
			const res1 = await updateSiteContent(
				"insights_headers",
				JSON.stringify(headers),
			);
			const res2 = await updateFeaturedInsightId(
				featuredId === "latest" ? null : featuredId,
			);

			if (res1.success && res2.success) {
				toast.success("Insights settings saved successfully");
			} else {
				throw new Error("Failed to save some settings");
			}
		} catch (error: any) {
			toast.error(error.message || "An error occurred");
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) return null;

	return (
		<Card className="border-chemonics-lime/20 shadow-md">
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle className="text-lg font-bold flex items-center gap-2">
						<Sparkles className="h-5 w-5 text-chemonics-lime" />
						Insights Section Manager
					</CardTitle>
					<CardDescription>
						Manage the headers and featured content for the Insights section.
					</CardDescription>
				</div>
				<Button onClick={handleSave} disabled={isSaving}>
					{isSaving ? (
						<Loader2 className="h-4 w-4 animate-spin mr-2" />
					) : (
						<Save className="h-4 w-4 mr-2" />
					)}
					Save Changes
				</Button>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid gap-4 md:grid-cols-3">
					<div className="grid gap-2">
						<Label className="text-xs uppercase text-muted-foreground font-bold">
							Label (Small Text)
						</Label>
						<Input
							placeholder="Our Insights"
							value={headers.label}
							onChange={(e) =>
								setHeaders({ ...headers, label: e.target.value })
							}
						/>
					</div>
					<div className="grid gap-2">
						<Label className="text-xs uppercase text-muted-foreground font-bold">
							Title Line 1
						</Label>
						<Input
							placeholder="Thinking Ahead"
							value={headers.title1}
							onChange={(e) =>
								setHeaders({ ...headers, title1: e.target.value })
							}
						/>
					</div>
					<div className="grid gap-2">
						<Label className="text-xs uppercase text-muted-foreground font-bold">
							Title Line 2
						</Label>
						<Input
							placeholder="In Healthcare & Development"
							value={headers.title2}
							onChange={(e) =>
								setHeaders({ ...headers, title2: e.target.value })
							}
						/>
					</div>
				</div>

				<div className="grid gap-2">
					<Label className="text-xs uppercase text-muted-foreground font-bold">
						Featured Item (Big Card)
					</Label>
					<Select value={featuredId} onValueChange={setFeaturedId}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select featured item" />
						</SelectTrigger>
						<SelectContent className="max-h-[300px]">
							<SelectItem value="latest">
								Default (Latest People Story)
							</SelectItem>
							{potentialItems.map((item) => (
								<SelectItem key={item.id} value={item.id}>
									<span className="flex items-center gap-2">
										<span className="text-[10px] bg-muted px-1.5 py-0.5 rounded uppercase font-bold text-muted-foreground">
											{item.type}
										</span>
										{item.title}
									</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<p className="text-[11px] text-muted-foreground italic">
						Currently selected:{" "}
						{featuredId === "latest"
							? "Default (Latest People Story)"
							: potentialItems.find((i) => i.id === featuredId)?.title ||
								"Unknown"}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
