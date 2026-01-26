"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, X, Check } from "lucide-react";
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
	getJobListings,
	createJob,
	updateJob,
	updateJobStatus,
	deleteJob,
	type JobListing,
} from "@/app/actions/careers";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function JobListingsTable() {
	const [jobs, setJobs] = useState<JobListing[]>([]);
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [formData, setFormData] = useState({
		id: "",
		title: "",
		description: "",
		location: "",
		type: "Full-time",
	});
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [isEdit, setIsEdit] = useState(false);

	useEffect(() => {
		loadJobs();
	}, []);

	const loadJobs = async () => {
		const data = await getJobListings(); // fetch all
		setJobs(data);
	};

	const openAddModal = () => {
		setIsEdit(false);
		setFormData({
			id: "",
			title: "",
			description: "",
			location: "",
			type: "Full-time",
		});
		setIsAddOpen(true);
	};

	const openEditModal = (job: JobListing) => {
		setIsEdit(true);
		setFormData({
			id: job.id,
			title: job.title,
			description: job.description,
			location: job.location,
			type: job.type,
		});
		setIsAddOpen(true);
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			if (isEdit) {
				await updateJob(formData.id, {
					title: formData.title,
					description: formData.description,
					location: formData.location,
					type: formData.type,
				});
				toast.success("Job updated successfully");
			} else {
				await createJob({
					title: formData.title,
					description: formData.description,
					location: formData.location,
					type: formData.type,
				});
				toast.success("Job created successfully");
			}
			setIsAddOpen(false);
			loadJobs();
		} catch (error) {
			toast.error(isEdit ? "Failed to update job" : "Failed to create job");
		} finally {
			setIsLoading(false);
		}
	};

	const handleStatusChange = async (
		jobId: string,
		newStatus: "open" | "closed",
	) => {
		try {
			// Optimistic
			setJobs((prev) =>
				prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j)),
			);
			await updateJobStatus(jobId, newStatus);
			toast.success(`Job marked as ${newStatus}`);
		} catch (error) {
			toast.error("Failed to update status");
			loadJobs(); // Revert
		}
	};

	const confirmDelete = async () => {
		if (!deleteId) return;
		setIsLoading(true);
		try {
			await deleteJob(deleteId);
			toast.success("Job deleted");
			setDeleteId(null);
			loadJobs();
		} catch (error) {
			toast.error("Failed to delete job");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-medium">Active Job Postings</h3>
				<Button
					onClick={openAddModal}
					className="gap-2 bg-chemonics-teal hover:bg-chemonics-teal/90"
				>
					<Plus className="h-4 w-4" /> Post Job
				</Button>
			</div>

			<div className="border rounded-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Location</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{jobs.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="h-24 text-center">
									No job listings found.
								</TableCell>
							</TableRow>
						) : (
							jobs.map((job) => (
								<TableRow key={job.id}>
									<TableCell className="font-medium">{job.title}</TableCell>
									<TableCell>{job.type}</TableCell>
									<TableCell>{job.location}</TableCell>
									<TableCell>
										<Select
											value={job.status}
											onValueChange={(val) =>
												handleStatusChange(job.id, val as "open" | "closed")
											}
										>
											<SelectTrigger className="w-[100px] h-8">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="open">Open</SelectItem>
												<SelectItem value="closed">Closed</SelectItem>
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => openEditModal(job)}
											>
												<Pencil className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="text-destructive hover:bg-destructive/10"
												onClick={() => setDeleteId(job.id)}
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

			<Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>{isEdit ? "Edit Job" : "Post a New Job"}</DialogTitle>
					</DialogHeader>
					<form onSubmit={onSubmit}>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Job Title</Label>
									<Input
										required
										value={formData.title}
										onChange={(e) =>
											setFormData({ ...formData, title: e.target.value })
										}
									/>
								</div>
								<div className="space-y-2">
									<Label>Employment Type</Label>
									<Select
										value={formData.type}
										onValueChange={(val) =>
											setFormData({ ...formData, type: val })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Full-time">Full-time</SelectItem>
											<SelectItem value="Part-time">Part-time</SelectItem>
											<SelectItem value="Contract">Contract</SelectItem>
											<SelectItem value="Internship">Internship</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="space-y-2">
								<Label>Location</Label>
								<Input
									required
									placeholder="e.g. Abuja, Remote"
									value={formData.location}
									onChange={(e) =>
										setFormData({ ...formData, location: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label>Description</Label>
								<Textarea
									required
									className="min-h-[150px]"
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Saving..." : isEdit ? "Save Changes" : "Post Job"}
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
						<DialogTitle>Delete Job Listing</DialogTitle>
						<DialogDescription>
							Are you sure? This will delete the job listing AND all associated
							applications.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteId(null)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={confirmDelete}
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
