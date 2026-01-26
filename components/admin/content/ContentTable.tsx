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
import { getEventRegistrations } from "@/app/actions/events";
import Image from "next/image";
import { Users, Download, Lock, LockOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface ContentTableProps {
	type: "project" | "story" | "event";
}

export function ContentTable({ type }: ContentTableProps) {
	const [items, setItems] = useState<ContentItem[]>([]);
	const [years, setYears] = useState<string[]>([]);
	const [filterYear, setFilterYear] = useState<string>("all");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	// Dialog State
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);

	// Form State
	const [formData, setFormData] = useState<{
		id: string;
		title: string;
		slug: string;
		summary: string;
		content: string;
		image_url: string;
		published_date: string;
		category?: "event" | "training";
		status?: "open" | "closed";
	}>({
		id: "",
		title: "",
		slug: "",
		summary: "",
		content: "",
		image_url: "",
		published_date: new Date().toISOString().split("T")[0],
		status: "open",
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
			const response = await fetch(
				`/api/upload?filename=${encodeURIComponent(file.name)}`,
				{
					method: "POST",
					body: file,
				},
			);

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
			category: "event", // Default for type=event
			status: "open",
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
			category: item.category,
			status: item.status,
		});
		setIsDialogOpen(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			// Prepare data, ensuring category/status are only sent for events
			const itemData = {
				title: formData.title,
				slug: formData.slug,
				summary: formData.summary,
				content: formData.content,
				image_url: formData.image_url,
				published_date: formData.published_date,
				category: type === "event" ? formData.category : undefined,
				status: type === "event" ? formData.status : undefined,
			};

			let res;
			if (isEdit) {
				res = await updateItem(formData.id, itemData);
			} else {
				res = await createItem({
					type,
					...itemData,
				});
			}

			if (res.success) {
				toast.success(isEdit ? "Updated successfully" : "Created successfully");
				setIsDialogOpen(false);
				loadData();
			} else {
				toast.error(res.error || "Operation failed");
			}
		} catch (error) {
			console.error(error);
			const message =
				error instanceof Error ? error.message : "Operation failed";
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		if (!deleteId) return;
		setIsLoading(true);
		try {
			const res = await deleteItem(deleteId);
			if (res.success) {
				toast.success("Deleted successfully");
				setDeleteId(null);
				loadData();
			} else {
				toast.error(res.error || "Failed to delete");
			}
		} catch (error) {
			toast.error("Failed to delete");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDownloadCSV = async (e: React.MouseEvent, eventId: string) => {
		e.stopPropagation();
		try {
			toast.info("Preparing CSV...");
			const regs = await getEventRegistrations(eventId);
			if (!regs.length) {
				toast.warning("No registrations found for this event.");
				return;
			}

			const headers = ["First Name", "Last Name", "Email", "Phone", "Date"];
			const rows = regs.map((r) => [
				r.first_name,
				r.last_name,
				r.email,
				r.phone,
				new Date(r.created_at).toLocaleDateString(),
			]);

			const csvContent =
				"data:text/csv;charset=utf-8," +
				[headers, ...rows].map((e) => e.join(",")).join("\n");
			const encodedUri = encodeURI(csvContent);
			const link = document.createElement("a");
			link.setAttribute("href", encodedUri);
			link.setAttribute("download", `registrations-${eventId}.csv`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			toast.success("Download started");
		} catch (error) {
			toast.error("Failed to download CSV");
		}
	};

	const handleRowClick = (item: ContentItem) => {
		if (type === "event") {
			router.push(`/admin/dashboard/events/${item.id}`);
		} else {
			openEdit(item);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold tracking-tight capitalize">
					{type === "project"
						? "Projects"
						: type === "story"
							? "Success Stories"
							: "Events & Training"}
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
						{type === "project"
							? "Project"
							: type === "story"
								? "Story"
								: "Event"}
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
							{type === "event" && <TableHead>Status</TableHead>}
							{type === "event" && <TableHead>Registrants</TableHead>}
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={type === "event" ? 6 : 4}
									className="h-24 text-center"
								>
									No items found.
								</TableCell>
							</TableRow>
						) : (
							items.map((item) => (
								<TableRow
									key={item.id}
									className="cursor-pointer hover:bg-muted/50"
									onClick={() => handleRowClick(item)}
								>
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
									{type === "event" && (
										<TableCell>
											<Badge
												variant={
													item.status === "open" ? "default" : "secondary"
												}
											>
												{item.status === "open" ? (
													<LockOpen className="h-3 w-3 mr-1" />
												) : (
													<Lock className="h-3 w-3 mr-1" />
												)}
												{item.status}
											</Badge>
										</TableCell>
									)}
									{type === "event" && (
										<TableCell>
											<div className="flex items-center gap-1 font-medium">
												<Users className="h-3 w-3 text-muted-foreground" />
												{item.registration_count || 0}
											</div>
										</TableCell>
									)}
									<TableCell className="text-right">
										{type === "event" && (
											<Button
												variant="ghost"
												size="icon"
												title="Download Registrations CSV"
												onClick={(e) => handleDownloadCSV(e, item.id)}
											>
												<Download className="h-4 w-4" />
											</Button>
										)}
										<Button
											variant="ghost"
											size="icon"
											onClick={(e) => {
												e.stopPropagation();
												openEdit(item);
											}}
										>
											<Pencil className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											className="text-destructive hover:bg-destructive/10"
											onClick={(e) => {
												e.stopPropagation();
												setDeleteId(item.id);
											}}
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
							{isEdit ? "Edit" : "Create New"}{" "}
							{type === "project"
								? "Project"
								: type === "story"
									? "Success Story"
									: "Event"}
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

						{type === "event" && (
							<>
								<div className="space-y-2">
									<Label>Category</Label>
									<Select
										value={formData.category}
										onValueChange={(val: "event" | "training") =>
											setFormData({ ...formData, category: val })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select Category" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="event">Event</SelectItem>
											<SelectItem value="training">Training</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label>Status</Label>
									<Select
										value={formData.status}
										onValueChange={(val: "open" | "closed") =>
											setFormData({ ...formData, status: val })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select Status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="open">Open</SelectItem>
											<SelectItem value="closed">Closed</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</>
						)}

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
