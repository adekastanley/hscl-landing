"use client";

import { useState, useEffect } from "react";
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
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import {
	getOurWorkItems,
	addOurWorkItem,
	updateOurWorkItem,
	deleteOurWorkItem,
	type OurWorkItem,
} from "@/actions/landing/ourWork";

export default function OurWorkItemsManager() {
	const [items, setItems] = useState<OurWorkItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	const [formData, setFormData] = useState({
		title: "",
		slug: "",
		content: "",
		image_url: "",
	});

	const fetchItems = async () => {
		setLoading(true);
		const data = await getOurWorkItems();
		setItems(data);
		setLoading(false);
	};

	useEffect(() => {
		fetchItems();
	}, []);

	const handleOpenDialog = (item?: OurWorkItem) => {
		if (item) {
			setEditingId(item.id);
			setFormData({
				title: item.title,
				slug: item.slug || "",
				content: item.content,
				image_url: item.image_url,
			});
		} else {
			setEditingId(null);
			setFormData({
				title: "",
				slug: "",
				content: "",
				image_url: "",
			});
		}
		setIsDialogOpen(true);
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.length) return;
		setIsUploading(true);
		const file = e.target.files[0];

		try {
			const response = await fetch(
				`/api/upload?filename=${encodeURIComponent(file.name)}`,
				{ method: "POST", body: file },
			);
			if (!response.ok) throw new Error("Upload failed");
			const blob = await response.json();
			setFormData({ ...formData, image_url: blob.url });
			toast.success("Image uploaded");
		} catch (error) {
			console.error(error);
			toast.error("Failed to upload image");
		} finally {
			setIsUploading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.title || !formData.slug || !formData.content) {
			toast.error("Please fill in all required fields");
			return;
		}

		setIsSubmitting(true);
		try {
			let res;
			if (editingId) {
				res = await updateOurWorkItem(editingId, formData);
			} else {
				res = await addOurWorkItem(formData);
			}

			if (res.success) {
				toast.success(
					editingId ? "Item updated successfully" : "Item added successfully",
				);
				setIsDialogOpen(false);
				fetchItems();
			} else {
				toast.error(res.error || "Operation failed");
			}
		} catch (error) {
			toast.error("An error occurred");
		}
		setIsSubmitting(false);
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this item?")) return;

		try {
			const res = await deleteOurWorkItem(id);
			if (res.success) {
				toast.success("Item deleted successfully");
				fetchItems();
			} else {
				toast.error("Failed to delete item");
			}
		} catch (error) {
			toast.error("An error occurred");
		}
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
				<CardTitle>Our Work Items</CardTitle>
				<Button onClick={() => handleOpenDialog()} size="sm">
					<Plus className="mr-2 h-4 w-4" /> Add Item
				</Button>
			</CardHeader>
			<CardContent>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Title</TableHead>
								<TableHead>Description</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={3} className="text-center h-24">
										Loading...
									</TableCell>
								</TableRow>
							) : items.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={3}
										className="text-center h-24 text-muted-foreground"
									>
										No items added yet.
									</TableCell>
								</TableRow>
							) : (
								items.map((item) => (
									<TableRow key={item.id}>
										<TableCell className="font-medium align-top">
											{item.title}
										</TableCell>
										<TableCell className="align-top whitespace-pre-wrap max-w-xs md:max-w-md">
											<div
												className="line-clamp-3 text-muted-foreground text-sm"
												dangerouslySetInnerHTML={{ __html: item.content }}
											/>
										</TableCell>
										<TableCell className="text-right align-top">
											<div className="flex justify-end gap-2">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleOpenDialog(item)}
												>
													<Pencil className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="text-destructive hover:bg-destructive/10"
													onClick={() => handleDelete(item.id)}
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

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>{editingId ? "Edit Item" : "Add Item"}</DialogTitle>
						<DialogDescription>
							Add details about a specific item for the Our Work page.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit} className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								placeholder="e.g. Health Systems Strengthening"
								value={formData.title}
								onChange={(e) => {
									const title = e.target.value;
									const slug = title
										.toLowerCase()
										.replace(/[^a-z0-9]+/g, "-")
										.replace(/(^-|-$)/g, "");
									setFormData({ ...formData, title, slug });
								}}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label>Description</Label>
							<RichTextEditor
								value={formData.content}
								onChange={(val) => setFormData({ ...formData, content: val })}
								placeholder="Enter details about this area of work..."
							/>
						</div>

						<div className="space-y-2">
							<Label>Image</Label>
							<div className="flex gap-4 items-start">
								{formData.image_url ? (
									<div className="relative w-32 h-20 rounded-md overflow-hidden border">
										<img
											src={formData.image_url}
											alt="Service"
											className="w-full h-full object-cover"
										/>
									</div>
								) : (
									<div className="w-32 h-20 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
										No Image
									</div>
								)}
								<div className="space-y-1">
									<Input
										type="file"
										accept="image/*"
										onChange={handleImageUpload}
										disabled={isUploading}
									/>
								</div>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting || isUploading}>
								{isSubmitting ? "Saving..." : "Save"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</Card>
	);
}
