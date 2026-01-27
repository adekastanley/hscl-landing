"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Pencil, Upload, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import {
	getTeamMembers,
	addTeamMember,
	deleteTeamMember,
	updateTeamMember,
	type TeamMember,
} from "@/app/actions/team";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { put } from "@vercel/blob";

interface TeamManagerProps {
	category?: "team" | "leadership";
	title?: string;
}

export function TeamManager({
	category = "team",
	title = "Team Members",
}: TeamManagerProps) {
	const [members, setMembers] = useState<TeamMember[]>([]);
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// State for forms
	const [formData, setFormData] = useState<Partial<TeamMember>>({
		name: "",
		role: "",
		bio: "",
		category,
		image_url: "",
		linkedin: "",
		twitter: "",
		email: "",
	});
	const [editingId, setEditingId] = useState<string | null>(null);
	const [deleteId, setDeleteId] = useState<string | null>(null);

	const inputFileRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		loadMembers();
	}, [category]);

	const loadMembers = async () => {
		const data = await getTeamMembers(category);
		setMembers(data);
	};

	const resetForm = () => {
		setFormData({
			name: "",
			role: "",
			bio: "",
			category,
			image_url: "",
			linkedin: "",
			twitter: "",
			email: "",
		});
		setEditingId(null);
		if (inputFileRef.current) inputFileRef.current.value = "";
	};

	const openEditModal = (member: TeamMember) => {
		setFormData({ ...member });
		setEditingId(member.id);
		setIsEditOpen(true);
	};

	const handleFileUpload = async (file: File) => {
		try {
			// In a real app, this should be done via a server action or an authorized API route
			// to prevent unauthorized uploads. For direct client upload, we need a token or server proxy.
			// However, standard Vercel Blob pattern often uses a server action to get a token or handle the upload.
			// Let's assume we implement a simple upload handler or just store the file object for the server action.
			// Actually best practice: upload to blob, get URL, save URL.
			// We will use a trusted client token if available, or better, server action.
			// Re-visiting: `put` from @vercel/blob needs a token.
			// We should probably handle the file upload in the `addTeamMember` server action if we pass FormData,
			// but we are passing JSON.
			// Simpler: Use a separate server action `uploadImage` or client-side upload to an api route `/api/upload`.

			// For now, let's just simulate the URL or implement the /api/upload route later.
			// Wait, user asked for Vercel Blob.
			// I'll create a simple /api/upload/route.ts later. For now, let's assume valid URL string input or skip actual blob implementation details until next step.
			// Actually, let's stick to the plan: I need to Implement Blob Integration.

			// Let's try to upload directly if we have the token exposed (bad practice) or use server action wrapper.
			// I'll leave the actual upload logic for the "Vercel Blob Integration" verification step.
			// For now, I will modify the UI to accept the file and we'll implement the upload logic properly.

			// TEMPORARY: Just manual URL input or placeholder until we set up the upload route.
			// User asked for "update team to now accept picture".

			return "https://placehold.co/400";
		} catch (error) {
			console.error("Upload failed", error);
			return "";
		}
	};

	// Real implementation with server action for upload:
	// I'll add `uploadImage` to team.ts? No, server actions can't accept File objects directly in early Next.js versions easily without FormData.
	// I'll use `upload` from `@vercel/blob/client` which hits `/api/upload`.

	const confirmDelete = async (id: string) => {
		setIsLoading(true);
		try {
			await deleteTeamMember(id);
			toast.success("Member deleted");
			setDeleteId(null);
			loadMembers();
		} catch (error) {
			toast.error("Failed to delete member");
		} finally {
			setIsLoading(false);
		}
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			let imageUrl = formData.image_url;

			// Handle File Upload if a file is selected
			if (inputFileRef.current?.files?.length) {
				const file = inputFileRef.current.files[0];
				const response = await fetch(`/api/upload?filename=${file.name}`, {
					method: "POST",
					body: file,
				});
				const newBlob = await response.json();
				imageUrl = newBlob.url;
			}

			const dataToSave = {
				...formData,
				image_url: imageUrl,
				category: category,
			} as Omit<TeamMember, "id">;

			if (editingId) {
				await updateTeamMember(editingId, dataToSave);
				toast.success("Member updated successfully");
				setIsEditOpen(false);
			} else {
				await addTeamMember(dataToSave);
				toast.success("Member added successfully");
				setIsAddOpen(false);
			}
			resetForm();
			loadMembers();
		} catch (error) {
			toast.error(
				editingId ? "Failed to update member" : "Failed to add member",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">{title}</h2>
					<p className="text-muted-foreground">
						Manage your {category} members here.
					</p>
				</div>
				<Button
					className="gap-2 bg-chemonics-teal hover:bg-chemonics-teal/90"
					onClick={() => {
						resetForm();
						setIsAddOpen(true);
					}}
				>
					<Plus className="h-4 w-4" /> Add Member
				</Button>
			</div>

			<div className="border rounded-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Member</TableHead>
							<TableHead className="hidden md:table-cell">Role</TableHead>
							<TableHead className="hidden md:table-cell">Bio</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{members.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} className="h-24 text-center">
									No members found.
								</TableCell>
							</TableRow>
						) : (
							members.map((member) => (
								<TableRow key={member.id}>
									<TableCell className="font-medium">
										<div className="flex items-center gap-3">
											<Avatar className="h-10 w-10">
												<AvatarImage src={member.image_url} alt={member.name} />
												<AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
											</Avatar>
											<div className="flex flex-col gap-1">
												<div className="font-bold">{member.name}</div>
												<div className="text-sm text-muted-foreground md:hidden">
													{member.role}
												</div>
												<div className="text-xs text-muted-foreground/80 md:hidden line-clamp-2">
													{member.bio}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell className="hidden md:table-cell">
										{member.role}
									</TableCell>
									<TableCell
										className="hidden md:table-cell max-w-xs truncate"
										title={member.bio}
									>
										{member.bio}
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Button variant="ghost" size="icon" asChild>
												<a
													href={`/team/${member.id}`}
													target="_blank"
													rel="noreferrer"
												>
													<Eye className="h-4 w-4" />
												</a>
											</Button>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => openEditModal(member)}
											>
												<Pencil className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="text-destructive hover:bg-destructive/10"
												onClick={() => setDeleteId(member.id)}
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

			{/* Shared Dialog Form */}
			<Dialog
				open={isAddOpen || isEditOpen}
				onOpenChange={(open) => {
					if (!open) {
						setIsAddOpen(false);
						setIsEditOpen(false);
					}
				}}
			>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>
							{editingId ? "Edit Member" : "Add New Member"}
						</DialogTitle>
						<DialogDescription>
							{editingId
								? "Update details for this member."
								: "Add a new member to the list."}
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={onSubmit}>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="role">Role</Label>
									<Input
										id="role"
										value={formData.role}
										onChange={(e) =>
											setFormData({ ...formData, role: e.target.value })
										}
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="bio">Bio</Label>
								<Textarea
									id="bio"
									value={formData.bio}
									onChange={(e) =>
										setFormData({ ...formData, bio: e.target.value })
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="image">Profile Photo</Label>
								<div className="flex items-center gap-4">
									{formData.image_url && (
										<Avatar className="h-16 w-16 border">
											<AvatarImage src={formData.image_url} />
											<AvatarFallback>IMG</AvatarFallback>
										</Avatar>
									)}
									<Input
										id="image"
										type="file"
										ref={inputFileRef}
										accept="image/*"
									/>
								</div>
							</div>

							<div className="grid grid-cols-3 gap-4">
								<div className="space-y-2">
									<Label htmlFor="linkedin">LinkedIn URL</Label>
									<Input
										id="linkedin"
										value={formData.linkedin || ""}
										onChange={(e) =>
											setFormData({ ...formData, linkedin: e.target.value })
										}
										placeholder="https://linkedin.com/in/..."
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="twitter">Twitter/X URL</Label>
									<Input
										id="twitter"
										value={formData.twitter || ""}
										onChange={(e) =>
											setFormData({ ...formData, twitter: e.target.value })
										}
										placeholder="https://x.com/..."
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										value={formData.email || ""}
										onChange={(e) =>
											setFormData({ ...formData, email: e.target.value })
										}
										placeholder="email@example.com"
									/>
								</div>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Saving..." : "Save"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog
				open={!!deleteId}
				onOpenChange={(open) => !open && setDeleteId(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Member</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this member? This action cannot be
							undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteId(null)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() => deleteId && confirmDelete(deleteId)}
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
