"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { getSiteContent, updateSiteContent } from "@/actions/landing/about";

export interface FocusArea {
	year: string;
	title: string;
	description: string;
}

const defaultFocusAreas: FocusArea[] = [
	{ year: "01", title: "", description: "" },
	{ year: "02", title: "", description: "" },
	{ year: "03", title: "", description: "" },
	{ year: "04", title: "", description: "" },
];

export default function FocusAreasManager() {
	const [focusAreas, setFocusAreas] = useState<FocusArea[]>(defaultFocusAreas);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		async function fetchFocusAreas() {
			try {
				const content = await getSiteContent("focus_areas");
				if (content) {
					const parsed = JSON.parse(content);
					if (Array.isArray(parsed) && parsed.length > 0) {
						// Ensure we always have exactly 4 items for the UI
						const loaded = [...defaultFocusAreas];
						parsed.forEach((item, index) => {
							if (index < 4) loaded[index] = { ...loaded[index], ...item };
						});
						setFocusAreas(loaded);
					}
				}
			} catch (error) {
				console.error("Failed to parse focus areas", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchFocusAreas();
	}, []);

	const handleAreaChange = (
		index: number,
		field: keyof FocusArea,
		value: string,
	) => {
		const newAreas = [...focusAreas];
		newAreas[index] = { ...newAreas[index], [field]: value };
		setFocusAreas(newAreas);
	};

	const handleSave = async () => {
		setIsSaving(true);
		try {
			// Validation: Ensure all 4 have a title at minimum if they are partially filled
			for (let i = 0; i < focusAreas.length; i++) {
				if (!focusAreas[i].title && focusAreas[i].description) {
					throw new Error(
						`Focus Area ${i + 1} has a description but is missing a title.`,
					);
				}
			}

			const res = await updateSiteContent(
				"focus_areas",
				JSON.stringify(focusAreas),
			);
			if (res.success) {
				toast.success("Focus Areas saved successfully");
			} else {
				throw new Error(res.error || "Failed to save");
			}
		} catch (error: any) {
			toast.error(error.message || "An error occurred");
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Focus Areas</CardTitle>
					<CardDescription>Loading content...</CardDescription>
				</CardHeader>
				<CardContent className="flex justify-center py-8">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-start justify-between">
				<div>
					<CardTitle>Focus Areas</CardTitle>
					<CardDescription>
						Update the four core expertise areas displayed on the homepage.
					</CardDescription>
				</div>
				<Button onClick={handleSave} disabled={isSaving}>
					{isSaving ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
						</>
					) : (
						<>
							<Save className="mr-2 h-4 w-4" /> Save Content
						</>
					)}
				</Button>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{focusAreas.map((area, index) => (
						<div
							key={index}
							className="space-y-4 p-4 border rounded-lg bg-slate-50 relative"
						>
							<div className="absolute top-2 right-4 text-xs font-bold text-muted-foreground">
								#{index + 1}
							</div>
							<div className="space-y-2">
								<Label>Number / Tag (Optional)</Label>
								<Input
									placeholder="e.g. 01"
									value={area.year}
									onChange={(e) =>
										handleAreaChange(index, "year", e.target.value)
									}
									className="max-w-[100px]"
								/>
							</div>
							<div className="space-y-2">
								<Label>Title</Label>
								<Input
									placeholder={`Focus Area ${index + 1} Title`}
									value={area.title}
									onChange={(e) =>
										handleAreaChange(index, "title", e.target.value)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label>Description</Label>
								<Textarea
									placeholder="Short descriptive text..."
									value={area.description}
									onChange={(e) =>
										handleAreaChange(index, "description", e.target.value)
									}
									className="resize-none h-24"
								/>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
