"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, User } from "lucide-react";
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
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	getTeamMembers,
	addTeamMember,
	deleteTeamMember,
	updateTeamMember,
	type TeamMember,
} from "@/app/actions/team";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TeamManager() {
	const [members, setMembers] = useState<TeamMember[]>([]);
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// State for forms
	const [formData, setFormData] = useState({ name: "", role: "", bio: "" });
	const [editingId, setEditingId] = useState<string | null>(null);
	const [deleteId, setDeleteId] = useState<string | null>(null);

	useEffect(() => {
		loadMembers();
	}, []);

	const loadMembers = async () => {
		const data = await getTeamMembers();
		setMembers(data);
	};

	const resetForm = () => {
		setFormData({ name: "", role: "", bio: "" });
		setEditingId(null);
	};

	const openEditModal = (member: TeamMember) => {
		setFormData({ name: member.name, role: member.role, bio: member.bio });
		setEditingId(member.id);
		setIsEditOpen(true);
	};

	const handleSaveMember = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			if (editingId) {
				await updateTeamMember(editingId, formData);
				toast.success("Team member updated successfully");
				setIsEditOpen(false);
			} else {
				await addTeamMember(formData);
				toast.success("Team member added successfully");
				setIsAddOpen(false);
			}
			resetForm();
			loadMembers();
		} catch (error) {
			toast.error(
				editingId
					? "Failed to update team member"
					: "Failed to add team member",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const confirmDelete = async (id: string) => {
		setIsLoading(true);
		try {
			await deleteTeamMember(id);
			toast.success("Team member deleted");
			setDeleteId(null);
			loadMembers();
		} catch (error) {
			toast.error("Failed to delete team member");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Team Members</h2>
					<p className="text-muted-foreground">
						Manage your team members, their roles, and bios.
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
							<TableHead>Name</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Bio</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{members.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} className="h-24 text-center">
									No team members found.
								</TableCell>
							</TableRow>
						) : (
							members.map((member) => (
								<TableRow key={member.id}>
									<TableCell className="font-medium">
										<div className="flex items-center gap-3">
											<Avatar className="h-8 w-8">
												<AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
											</Avatar>
											{member.name}
										</div>
									</TableCell>
									<TableCell>{member.role}</TableCell>
									<TableCell className="max-w-md truncate" title={member.bio}>
										{member.bio}
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8"
												onClick={() => openEditModal(member)}
											>
												<Pencil className="h-4 w-4" />
												<span className="sr-only">Edit</span>
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
												onClick={() => setDeleteId(member.id)}
											>
												<Trash2 className="h-4 w-4" />
												<span className="sr-only">Delete</span>
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Add Member Dialog */}
			<Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Team Member</DialogTitle>
						<DialogDescription>
							Add a new member to display on the "Our Team" section.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSaveMember}>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="add-name">Name</Label>
								<Input
									id="add-name"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									placeholder="e.g. Jane Doe"
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="add-role">Role</Label>
								<Input
									id="add-role"
									value={formData.role}
									onChange={(e) =>
										setFormData({ ...formData, role: e.target.value })
									}
									placeholder="e.g. Project Manager"
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="add-bio">Bio</Label>
								<Textarea
									id="add-bio"
									value={formData.bio}
									onChange={(e) =>
										setFormData({ ...formData, bio: e.target.value })
									}
									placeholder="Short bio description..."
									required
								/>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Saving..." : "Save Member"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Edit Member Dialog */}
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Team Member</DialogTitle>
						<DialogDescription>
							Update details for this team member.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSaveMember}>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="edit-name">Name</Label>
								<Input
									id="edit-name"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									placeholder="e.g. Jane Doe"
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-role">Role</Label>
								<Input
									id="edit-role"
									value={formData.role}
									onChange={(e) =>
										setFormData({ ...formData, role: e.target.value })
									}
									placeholder="e.g. Project Manager"
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-bio">Bio</Label>
								<Textarea
									id="edit-bio"
									value={formData.bio}
									onChange={(e) =>
										setFormData({ ...formData, bio: e.target.value })
									}
									placeholder="Short bio description..."
									required
								/>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Saving..." : "Save Changes"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={!!deleteId}
				onOpenChange={(open) => !open && setDeleteId(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Team Member</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this team member? This action
							cannot be undone.
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
