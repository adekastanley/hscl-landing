"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Plus,
	Pencil,
	Trash2,
	Loader2,
	Link as LinkIcon,
	Download,
} from "lucide-react";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Resource,
	createResource,
	updateResource,
	deleteResource,
} from "@/app/actions/resources";

export function ResourceManager({
	initialResources,
}: {
	initialResources: Resource[];
}) {
	const [resources, setResources] = useState<Resource[]>(initialResources);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editingResource, setEditingResource] = useState<Resource | null>(null);

	// Form State
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [type, setType] = useState<"free" | "paid">("free");
	const [cost, setCost] = useState("");
	const [tagsString, setTagsString] = useState("");
	const [fileUrl, setFileUrl] = useState("");
	const [linkUrl, setLinkUrl] = useState("");
	const [file, setFile] = useState<File | null>(null);

	const resetForm = () => {
		setTitle("");
		setDescription("");
		setType("free");
		setCost("Free");
		setTagsString("");
		setFileUrl("");
		setLinkUrl("");
		setFile(null);
		setEditingResource(null);
	};

	const handleOpenCreate = () => {
		resetForm();
		setIsCreateModalOpen(true);
	};

	const handleOpenEdit = (resource: Resource) => {
		setEditingResource(resource);
		setTitle(resource.title);
		setDescription(resource.description);
		setType(resource.type);
		setCost(resource.cost || "");
		setTagsString(resource.tags.join(", "));
		setFileUrl(resource.file_url || "");
		setLinkUrl(resource.link_url || "");
		setFile(null);
		setIsEditModalOpen(true);
	};

	const handleFileUpload = async (): Promise<string | null> => {
		if (!file) return null;
		const formData = new FormData();
		formData.append("file", file);

		const response = await fetch(
			`/api/upload?filename=${encodeURIComponent(file.name)}&folder=resources`,
			{
				method: "POST",
				body: formData, // No multi-part parsing needed, direct buffer in route
			},
		);

		// Correct upload route to handle modern Next.js file uploads
		// Actually, our route.ts expects the body to be an arrayBuffer, not FormData.
		// Let's use arrayBuffer for our bespoke api/upload
		const arrayBuffer = await file.arrayBuffer();
		const res2 = await fetch(
			`/api/upload?filename=${encodeURIComponent(file.name)}&folder=resources`,
			{
				method: "POST",
				body: arrayBuffer,
			},
		);

		if (!res2.ok) throw new Error("Upload failed");
		const data = await res2.json();
		return data.url;
	};

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			let finalFileUrl = fileUrl;

			if (type === "free" && file) {
				const uploadedUrl = await handleFileUpload();
				if (uploadedUrl) finalFileUrl = uploadedUrl;
			}

			const newResourceData = {
				title,
				description,
				type,
				cost: type === "free" ? "Free" : cost,
				tags: tagsString
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean),
				file_url: type === "free" ? finalFileUrl : null,
				link_url: type === "paid" ? linkUrl : null,
				image_url: null, // Omit for now unless needed
			};

			const result = await createResource(newResourceData);

			if (result.success) {
				toast.success("Resource created successfully");
				setIsCreateModalOpen(false);
				// Optimistic update
				setResources((prev) => [
					{
						...newResourceData,
						id: result.id!,
						created_at: new Date().toISOString(),
					},
					...prev,
				]);
			} else {
				throw new Error(result.error);
			}
		} catch (error) {
			toast.error("Failed to create resource");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingResource) return;
		setIsSubmitting(true);
		try {
			let finalFileUrl = fileUrl;

			if (type === "free" && file) {
				const uploadedUrl = await handleFileUpload();
				if (uploadedUrl) {
					finalFileUrl = uploadedUrl;
				}
			}

			const updateData = {
				title,
				description,
				type,
				cost: type === "free" ? "Free" : cost,
				tags: tagsString
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean),
				file_url: type === "free" ? finalFileUrl : null,
				link_url: type === "paid" ? linkUrl : null,
			};

			const result = await updateResource(editingResource.id, updateData);

			if (result.success) {
				toast.success("Resource updated successfully");
				setIsEditModalOpen(false);
				setResources((prev) =>
					prev.map((r) =>
						r.id === editingResource.id ? { ...r, ...updateData } : r,
					),
				);
			} else {
				throw new Error(result.error);
			}
		} catch (error) {
			toast.error("Failed to update resource");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this resource?")) return;
		try {
			const result = await deleteResource(id);
			if (result.success) {
				toast.success("Resource deleted successfully");
				setResources((prev) => prev.filter((r) => r.id !== id));
			} else {
				throw new Error(result.error);
			}
		} catch (error) {
			toast.error("Failed to delete resource");
		}
	};

	const renderForm = (onSubmit: (e: React.FormEvent) => void) => (
		<form onSubmit={onSubmit} className="space-y-4">
			<div>
				<Label>Title</Label>
				<Input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>
			</div>

			<div>
				<Label>Description</Label>
				<Textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					required
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label>Type</Label>
					<Select
						value={type}
						onValueChange={(val: "free" | "paid") => {
							setType(val);
							if (val === "free") setCost("Free");
							else setCost("");
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="free">Free</SelectItem>
							<SelectItem value="paid">Paid</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label>Cost</Label>
					<Input
						value={type === "free" ? "Free" : cost}
						onChange={(e) => setCost(e.target.value)}
						disabled={type === "free"}
						required
					/>
				</div>
			</div>

			<div>
				<Label>Tags (comma separated)</Label>
				<Input
					value={tagsString}
					onChange={(e) => setTagsString(e.target.value)}
					placeholder="PDF, Guide, Course"
					required
				/>
			</div>

			{type === "free" ? (
				<div className="space-y-2">
					{fileUrl && (
						<div className="mb-4">
							<Label className="text-muted-foreground">
								Currently Uploaded File:
							</Label>
							<p className="text-sm font-mono border p-2 rounded bg-muted/50 break-all cursor-not-allowed">
								{fileUrl}
							</p>
						</div>
					)}
					<Label>Upload New File for Resource</Label>
					<Input
						type="file"
						onChange={(e) => setFile(e.target.files?.[0] || null)}
						accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
					/>
				</div>
			) : (
				<div>
					<Label>Link URL to Purchase / Register</Label>
					<Input
						type="url"
						value={linkUrl}
						onChange={(e) => setLinkUrl(e.target.value)}
						placeholder="https://example.com/course"
						required
					/>
				</div>
			)}

			<Button type="submit" disabled={isSubmitting} className="w-full">
				{isSubmitting ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Saving...
					</>
				) : (
					"Save Resource"
				)}
			</Button>
		</form>
	);

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Resources</h2>
				<Button onClick={handleOpenCreate}>
					<Plus className="h-4 w-4 mr-2" />
					Add Resource
				</Button>
			</div>

			<div className="border rounded-lg">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Cost</TableHead>
							<TableHead>Link/File</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{resources.map((resource) => (
							<TableRow key={resource.id}>
								<TableCell className="font-medium">{resource.title}</TableCell>
								<TableCell className="capitalize">{resource.type}</TableCell>
								<TableCell>{resource.cost}</TableCell>
								<TableCell>
									{resource.type === "free" ? (
										resource.file_url ? (
											<a
												href={resource.file_url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-500 hover:underline flex items-center"
											>
												<Download className="h-3 w-3 mr-1" /> File
											</a>
										) : (
											<span className="text-muted-foreground">No File</span>
										)
									) : resource.link_url ? (
										<a
											href={resource.link_url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-500 hover:underline flex items-center"
										>
											<LinkIcon className="h-3 w-3 mr-1" /> Link
										</a>
									) : (
										<span className="text-muted-foreground">No Link</span>
									)}
								</TableCell>
								<TableCell className="text-right">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleOpenEdit(resource)}
									>
										<Pencil className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="text-red-500"
										onClick={() => handleDelete(resource.id)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
						{resources.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={5}
									className="text-center text-muted-foreground"
								>
									No resources found. Create one above!
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
				<DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Add New Resource</DialogTitle>
					</DialogHeader>
					{renderForm(handleCreate)}
				</DialogContent>
			</Dialog>

			<Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
				<DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Edit Resource</DialogTitle>
					</DialogHeader>
					{renderForm(handleUpdate)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
