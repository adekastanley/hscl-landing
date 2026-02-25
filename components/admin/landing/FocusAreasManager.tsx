"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Save, Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { getSiteContent, updateSiteContent } from "@/actions/landing/about";
import RichTextEditor from "@/components/ui/RichTextEditor";

export interface FocusArea {
	id: string; // Add an ID for easy tracking in dynamic lists
	year: string;
	title: string;
	description: string;
}

export default function FocusAreasManager() {
	const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	const [formData, setFormData] = useState({
		year: "",
		title: "",
		description: "",
	});

	const fetchFocusAreas = async () => {
		try {
			setIsLoading(true);
			const content = await getSiteContent("focus_areas");
			if (content) {
				const parsed = JSON.parse(content);
				if (Array.isArray(parsed)) {
					// Ensure existing data has an ID for React keys if coming from the old structure
					const mapped = parsed.map((item: any, idx) => ({
						id: item.id || `fa-${Date.now()}-${idx}`,
						year: item.year || "",
						title: item.title || "",
						description: item.description || "",
					}));
					setFocusAreas(mapped);
				}
			}
		} catch (error) {
			console.error("Failed to fetch focus areas", error);
			toast.error("Failed to load Focus Areas.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchFocusAreas();
	}, []);

	// Save the entire array to the database
	const saveArrayToDb = async (newArray: FocusArea[]) => {
		setIsSaving(true);
		try {
			const res = await updateSiteContent(
				"focus_areas",
				JSON.stringify(newArray),
			);
			if (res.success) {
				setFocusAreas(newArray);
				toast.success("Focus Areas updated successfully!");
				setIsDialogOpen(false);
			} else {
				throw new Error(res.error || "Failed to save to database");
			}
		} catch (error: any) {
			toast.error(error.message || "An error occurred");
		} finally {
			setIsSaving(false);
		}
	};

	const handleOpenDialog = (area?: FocusArea) => {
		if (area) {
			setEditingId(area.id);
			setFormData({
				year: area.year,
				title: area.title,
				description: area.description,
			});
		} else {
			setEditingId(null);
			setFormData({
				year: "",
				title: "",
				description: "",
			});
		}
		setIsDialogOpen(true);
	};

	const handleDelete = async (id: string) => {
		if (confirm("Are you sure you want to delete this focus area?")) {
			const newArray = focusAreas.filter((a) => a.id !== id);
			await saveArrayToDb(newArray);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.title) {
			toast.error("Please provide a Title.");
			return;
		}
		if (!formData.description) {
			toast.error("Please provide a Description.");
			return;
		}

		let newArray = [...focusAreas];

		if (editingId) {
			// Update existing
			newArray = newArray.map((area) =>
				area.id === editingId ? { ...area, ...formData } : area,
			);
		} else {
			// Add new
			const newItem: FocusArea = {
				id: `fa-${Date.now()}`,
				...formData,
			};
			newArray.push(newItem);
		}

		await saveArrayToDb(newArray);
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
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>Focus Areas</CardTitle>
					<CardDescription>
						Manage the timeline-style expertise areas shown on the homepage.
					</CardDescription>
				</div>
				<Button onClick={() => handleOpenDialog()}>
					<Plus className="h-4 w-4 mr-2" /> Add Focus Area
				</Button>
			</CardHeader>
			<CardContent>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">Tag/Year</TableHead>
								<TableHead>Title</TableHead>
								<TableHead className="hidden md:table-cell">
									Description
								</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{focusAreas.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={4}
										className="h-24 text-center text-muted-foreground"
									>
										No focus areas added.
									</TableCell>
								</TableRow>
							) : (
								focusAreas.map((area) => (
									<TableRow key={area.id}>
										<TableCell className="font-medium align-top">
											{area.year || "-"}
										</TableCell>
										<TableCell className="align-top font-medium">
											{area.title}
										</TableCell>
										<TableCell className="hidden md:table-cell align-top text-sm text-muted-foreground max-w-[300px] truncate">
											{/* Strip simple HTML tags for preview */}
											{area.description.replace(/<[^>]*>?/gm, "")}
										</TableCell>
										<TableCell className="text-right align-top">
											<div className="flex items-center justify-end gap-2">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleOpenDialog(area)}
												>
													<Pencil className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="text-destructive hover:bg-destructive/10"
													onClick={() => handleDelete(area.id)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>

			{/* Add/Edit Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{editingId ? "Edit Focus Area" : "Add Focus Area"}
						</DialogTitle>
						<DialogDescription>
							Format the description using the rich text tools.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit} className="space-y-6 py-4">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<div className="space-y-2 md:col-span-1">
								<Label htmlFor="year">Tag / Number</Label>
								<Input
									id="year"
									placeholder="e.g. 01 or 2024"
									value={formData.year}
									onChange={(e) =>
										setFormData({ ...formData, year: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2 md:col-span-3">
								<Label htmlFor="title">Title</Label>
								<Input
									id="title"
									placeholder="e.g. Health Systems Strengthening"
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									required
								/>
							</div>
						</div>

						<div className="space-y-2 mt-4">
							<Label>Description</Label>
							<RichTextEditor
								value={formData.description}
								onChange={(val) =>
									setFormData({ ...formData, description: val })
								}
							/>
						</div>

						<div className="flex justify-end gap-2 mt-6">
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSaving}>
								{isSaving ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
									</>
								) : (
									"Save Area"
								)}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</Card>
	);
}
