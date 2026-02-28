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
import { toast } from "sonner";
import { Save, Loader2, ListChecks } from "lucide-react";
import { getSiteContent, updateSiteContent } from "@/actions/landing/about";
import { getItems, ContentItem } from "@/app/actions/content";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function SelectedEngagementsManager() {
	const [selectedIds, setSelectedIds] = useState<string[]>(["", "", ""]);
	const [projects, setProjects] = useState<ContentItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		async function fetchData() {
			try {
				const [savedData, allProjects] = await Promise.all([
					getSiteContent("selected_engagements_projects"),
					getItems("project", 100), // Fetch a good number of projects to select from
				]);

				setProjects(allProjects);

				if (savedData) {
					const parsed = JSON.parse(savedData);
					if (Array.isArray(parsed) && parsed.length === 3) {
						setSelectedIds(parsed);
					}
				}
			} catch (error) {
				console.error("Failed to fetch selected engagements data", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchData();
	}, []);

	const handleSelect = (index: number, value: string) => {
		const newIds = [...selectedIds];
		newIds[index] = value;
		setSelectedIds(newIds);
	};

	const handleSave = async () => {
		setIsSaving(true);
		try {
			const res = await updateSiteContent(
				"selected_engagements_projects",
				JSON.stringify(selectedIds),
			);

			if (res.success) {
				toast.success("Selected engagements saved successfully");
			} else {
				throw new Error("Failed to save settings");
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
						<ListChecks className="h-5 w-5 text-chemonics-lime" />
						Selected Engagements Manager
					</CardTitle>
					<CardDescription>
						Select 3 specific projects to feature in the Selected Engagements
						section on the homepage. If left empty, the latest 3 projects will
						be shown.
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
				<div className="grid gap-6 md:grid-cols-3">
					{[0, 1, 2].map((index) => (
						<div key={index} className="grid gap-2">
							<Label className="text-xs uppercase text-muted-foreground font-bold">
								Project {index + 1}
							</Label>
							<Select
								value={selectedIds[index]}
								onValueChange={(val) => handleSelect(index, val)}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a project" />
								</SelectTrigger>
								<SelectContent className="max-h-[300px]">
									<SelectItem value="none">
										<span className="text-muted-foreground italic">
											None (Use Default)
										</span>
									</SelectItem>
									{projects.map((project) => (
										<SelectItem key={project.id} value={project.id}>
											{project.title}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
