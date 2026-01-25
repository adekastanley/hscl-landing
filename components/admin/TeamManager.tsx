"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
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
	type TeamMember,
} from "@/app/actions/team";
import { toast } from "sonner";

export function TeamManager() {
	const [members, setMembers] = useState<TeamMember[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [newMember, setNewMember] = useState({ name: "", role: "", bio: "" });

	useEffect(() => {
		loadMembers();
	}, []);

	const loadMembers = async () => {
		const data = await getTeamMembers();
		setMembers(data);
	};

	const handleAddMember = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await addTeamMember(newMember);
			setNewMember({ name: "", role: "", bio: "" });
			setIsOpen(false);
			toast.success("Team member added successfully");
			loadMembers();
		} catch (error) {
			toast.error("Failed to add team member");
		} finally {
			setIsLoading(false);
		}
	};

	const [deleteId, setDeleteId] = useState<string | null>(null);

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
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger asChild>
						<Button className="gap-2 bg-chemonics-teal hover:bg-chemonics-teal/90">
							<Plus className="h-4 w-4" /> Add Member
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add New Team Member</DialogTitle>
							<DialogDescription>
								Add a new member to display on the "Our Team" section.
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleAddMember}>
							<div className="grid gap-4 py-4">
								<div className="grid gap-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										value={newMember.name}
										onChange={(e) =>
											setNewMember({ ...newMember, name: e.target.value })
										}
										placeholder="e.g. Jane Doe"
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="role">Role</Label>
									<Input
										id="role"
										value={newMember.role}
										onChange={(e) =>
											setNewMember({ ...newMember, role: e.target.value })
										}
										placeholder="e.g. Project Manager"
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="bio">Bio</Label>
									<Textarea
										id="bio"
										value={newMember.bio}
										onChange={(e) =>
											setNewMember({ ...newMember, bio: e.target.value })
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
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{members.map((member) => (
					<Card key={member.id} className="overflow-hidden">
						<CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
							<div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold">
								{member.name.charAt(0)}
							</div>
							<div className="flex-1 overflow-hidden">
								<CardTitle className="text-base truncate">
									{member.name}
								</CardTitle>
								<CardDescription className="truncate">
									{member.role}
								</CardDescription>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
								onClick={() => setDeleteId(member.id)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground line-clamp-3">
								{member.bio}
							</p>
						</CardContent>
					</Card>
				))}

				{members.length === 0 && (
					<div className="col-span-full flex flex-col items-center justify-center p-12 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/20">
						<User className="h-12 w-12 mb-4 opacity-20" />
						<p className="text-lg font-medium">No team members yet</p>
						<p className="text-sm">Click "Add Member" to get started</p>
					</div>
				)}
			</div>

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
