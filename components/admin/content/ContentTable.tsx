"use client";

import { useState, useEffect, useRef } from "react";
import {
	Plus,
	Pencil,
	Trash2,
	Calendar as CalendarIcon,
	Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
	getItems,
	createItem,
	updateItem,
	deleteItem,
	getYears,
	type ContentItem,
} from "@/app/actions/content";
import Image from "next/image";

interface ContentTableProps {
	type: "project" | "story";
}

export function ContentTable({ type }: ContentTableProps) {
	const [items, setItems] = useState<ContentItem[]>([]);
	const [years, setYears] = useState<string[]>([]);
	const [filterYear, setFilterYear] = useState<string>("all");
	const [isLoading, setIsLoading] = useState(false);

	// Dialog State
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);

	// Form State
	const [formData, setFormData] = useState({
		id: "",
		title: "",
		slug: "",
		summary: "",
		content: "",
		image_url: "",
		published_date: new Date().toISOString().split("T")[0],
	});

	const inputFileRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);

	useEffect(() => {
		loadData();
	}, [filterYear]); // Reload when filter changes

	const loadData = async () => {
		const [itemsData, yearsData] = await Promise.all([
			getItems(type, 100, 1, filterYear),
			getYears(type),
		]);
		setItems(itemsData);
		setYears(yearsData);
	};

	const generateSlug = (title: string) => {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const title = e.target.value;
		// Only auto-generate slug if not editing an existing item (or maybe we allow it?)
		// Let's allow manual slug editing but auto-fill on creation title change
		if (!isEdit) {
			setFormData((prev) => ({ ...prev, title, slug: generateSlug(title) }));
		} else {
			setFormData((prev) => ({ ...prev, title }));
		}
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.length) return;

		setIsUploading(true);
		const file = e.target.files[0];

		try {
			const response = await fetch(`/api/upload?filename=${file.name}`, {
				method: "POST",
				body: file,
			});

			if (!response.ok) throw new Error("Upload failed");

			const blob = await response.json();
			setFormData((prev) => ({ ...prev, image_url: blob.url }));
			toast.success("Image uploaded");
		} catch (error) {
			console.error(error);
			toast.error("Failed to upload image");
		} finally {
			setIsUploading(false);
		}
	};

	const openCreate = () => {
		setIsEdit(false);
		setFormData({
			id: "",
			title: "",
			slug: "",
			summary: "",
			content: "",
			image_url: "",
			published_date: new Date().toISOString().split("T")[0],
		});
		setIsDialogOpen(true);
	};

	const openEdit = (item: ContentItem) => {
		setIsEdit(true);
		setFormData({
			id: item.id,
			title: item.title,
			slug: item.slug,
			summary: item.summary,
			content: item.content,
			image_url: item.image_url,
			published_date: item.published_date,
		});
		setIsDialogOpen(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			if (isEdit) {
				await updateItem(formData.id, {
					title: formData.title,
					slug: formData.slug,
					summary: formData.summary,
					content: formData.content,
					image_url: formData.image_url,
					published_date: formData.published_date,
				});
				toast.success("Updated successfully");
			} else {
				await createItem({
					type,
					title: formData.title,
					slug: formData.slug,
					summary: formData.summary,
					content: formData.content,
					image_url: formData.image_url,
					published_date: formData.published_date,
				});
				toast.success("Created successfully");
			}
			setIsDialogOpen(false);
			loadData();
		} catch (error) {
			toast.error("Operation failed");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		if (!deleteId) return;
		setIsLoading(true);
		try {
			await deleteItem(deleteId);
			toast.success("Deleted successfully");
			setDeleteId(null);
			loadData();
		} catch (error) {
			toast.error("Failed to delete");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold tracking-tight capitalize">
					{type === "project" ? "Projects" : "Success Stories"}
				</h2>
				<div className="flex items-center gap-2">
					{type === "project" && (
						<Select value={filterYear} onValueChange={setFilterYear}>
							<SelectTrigger className="w-[120px]">
								<SelectValue placeholder="All Years" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Years</SelectItem>
								{years.map((year) => (
									<SelectItem key={year} value={year}>
										{year}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
					<Button
						onClick={openCreate}
						className="bg-chemonics-teal hover:bg-chemonics-teal/90"
					>
						<Plus className="mr-2 h-4 w-4" /> Add{" "}
						{type === "project" ? "Project" : "Story"}
					</Button>
				</div>
			</div>

			<div className="border rounded-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[80px]">Image</TableHead>
							<TableHead>Title</TableHead>
							<TableHead>Date</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} className="h-24 text-center">
									No items found.
								</TableCell>
							</TableRow>
						) : (
							items.map((item) => (
								<TableRow key={item.id}>
									<TableCell>
										{item.image_url ? (
											<div className="relative h-10 w-16 overflow-hidden rounded">
												<Image
													src={item.image_url}
													alt={item.title}
													fill
													className="object-cover"
												/>
											</div>
										) : (
											<div className="h-10 w-16 bg-muted rounded flex items-center justify-center text-xs">
												No Img
											</div>
										)}
									</TableCell>
									<TableCell className="font-medium">
										{item.title}
										<div className="text-xs text-muted-foreground truncate max-w-[300px]">
											{item.slug}
										</div>
									</TableCell>
									<TableCell>{item.published_date}</TableCell>
									<TableCell className="text-right">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => openEdit(item)}
										>
											<Pencil className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											className="text-destructive hover:bg-destructive/10"
											onClick={() => setDeleteId(item.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Create/Edit Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{isEdit ? "Edit Item" : "Create New Item"}
						</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit} className="space-y-4 py-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="title">Title</Label>
								<Input
									id="title"
									value={formData.title}
									onChange={handleTitleChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="slug">Slug</Label>
								<Input
									id="slug"
									value={formData.slug}
									onChange={(e) =>
										setFormData({ ...formData, slug: e.target.value })
									}
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="date">Published Date</Label>
							<Input
								type="date"
								id="date"
								value={formData.published_date}
								onChange={(e) =>
									setFormData({ ...formData, published_date: e.target.value })
								}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label>Cover Image</Label>
							<div className="flex gap-4 items-center">
								{formData.image_url && (
									<div className="relative h-20 w-32 rounded overflow-hidden border">
										<Image
											src={formData.image_url}
											alt="Preview"
											fill
											className="object-cover"
										/>
									</div>
								)}
								<div className="flex-1">
									<Input
										type="file"
										accept="image/*"
										onChange={handleImageUpload}
										disabled={isUploading}
									/>
									{isUploading && (
										<p className="text-xs text-muted-foreground mt-1">
											Uploading...
										</p>
									)}
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="summary">
								Summary (Short description for cards)
							</Label>
							<Textarea
								id="summary"
								value={formData.summary}
								onChange={(e) =>
									setFormData({ ...formData, summary: e.target.value })
								}
								rows={3}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="content">Main Content (Detailed article)</Label>
							<Textarea
								id="content"
								value={formData.content}
								onChange={(e) =>
									setFormData({ ...formData, content: e.target.value })
								}
								className="min-h-[200px]"
							/>
							<p className="text-xs text-muted-foreground">
								HTML or plain text supported.
							</p>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading || isUploading}>
								{isLoading ? "Saving..." : "Save Item"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation */}
			<Dialog
				open={!!deleteId}
				onOpenChange={(open) => !open && setDeleteId(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Delete</DialogTitle>
					</DialogHeader>
					<p>
						Are you sure you want to delete this item? This action cannot be
						undone.
					</p>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteId(null)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={isLoading}
						>
							{isLoading ? "Deleting..." : "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
