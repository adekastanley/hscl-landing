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
		title: "",
		description: "",
		location: "",
		type: "Full-time",
	});
	const [deleteId, setDeleteId] = useState<string | null>(null);

	useEffect(() => {
		loadJobs();
	}, []);

	const loadJobs = async () => {
		const data = await getJobListings(); // fetch all
		setJobs(data);
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await createJob(formData);
			toast.success("Job created successfully");
			setIsAddOpen(false);
			setFormData({
				title: "",
				description: "",
				location: "",
				type: "Full-time",
			});
			loadJobs();
		} catch (error) {
			toast.error("Failed to create job");
		} finally {
			setIsLoading(false);
		}
	};

	const handleStatusToggle = async (job: JobListing) => {
		const newStatus = job.status === "open" ? "closed" : "open";
		try {
			await updateJobStatus(job.id, newStatus);
			toast.success(`Job marked as ${newStatus}`);
			loadJobs();
		} catch (error) {
			toast.error("Failed to update status");
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
					onClick={() => setIsAddOpen(true)}
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
										<Badge
											variant={job.status === "open" ? "default" : "secondary"}
										>
											{job.status}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleStatusToggle(job)}
											>
												{job.status === "open" ? "Close" : "Reopen"}
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
						<DialogTitle>Post a New Job</DialogTitle>
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
								{isLoading ? "Posting..." : "Post Job"}
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
