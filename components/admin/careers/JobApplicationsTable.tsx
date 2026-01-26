"use client";

import { useState, useEffect } from "react";
import { Download, ExternalLink, Filter } from "lucide-react";
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
	getApplications,
	updateApplicationStatus,
	getJobListings,
	type JobApplication,
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
import { Input } from "@/components/ui/input";

export function JobApplicationsTable() {
	const [applications, setApplications] = useState<JobApplication[]>([]);
	const [jobs, setJobs] = useState<JobListing[]>([]);
	const [filterJobId, setFilterJobId] = useState<string>("all");
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		const [appsData, jobsData] = await Promise.all([
			getApplications(),
			getJobListings(),
		]);
		setApplications(appsData);
		setJobs(jobsData);
	};

	const handleStatusChange = async (id: string, newStatus: string) => {
		try {
			// Optimistic update
			setApplications((prev) =>
				prev.map((app) =>
					app.id === id ? { ...app, status: newStatus as any } : app,
				),
			);

			await updateApplicationStatus(id, newStatus);
			toast.success("Status updated");
		} catch (error) {
			toast.error("Failed to update status");
			loadData(); // Revert
		}
	};

	const filteredApplications = applications.filter((app) => {
		if (filterJobId !== "all" && app.job_id !== filterJobId) return false;
		if (filterStatus !== "all" && app.status !== filterStatus) return false;
		return true;
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case "pending":
				return "secondary";
			case "review":
				return "default"; // blue-ish usually
			case "accepted":
				return "secondary"; // green-ish via custom class maybe? using secondary for now or handled via text color
			case "rejected":
				return "destructive";
			case "reserved":
				return "outline";
			default:
				return "secondary";
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
				<h3 className="text-lg font-medium">
					Applications ({filteredApplications.length})
				</h3>
				<div className="flex gap-2 w-full md:w-auto">
					<Select value={filterJobId} onValueChange={setFilterJobId}>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="Filter by Job" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Jobs</SelectItem>
							{jobs.map((job) => (
								<SelectItem key={job.id} value={job.id}>
									{job.title}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={filterStatus} onValueChange={setFilterStatus}>
						<SelectTrigger className="w-[150px]">
							<SelectValue placeholder="Filter Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Statuses</SelectItem>
							<SelectItem value="pending">Pending</SelectItem>
							<SelectItem value="review">In Review</SelectItem>
							<SelectItem value="accepted">Accepted</SelectItem>
							<SelectItem value="rejected">Rejected</SelectItem>
							<SelectItem value="reserved">Reserved</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="border rounded-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Applicant</TableHead>
							<TableHead>Applied For</TableHead>
							<TableHead>Applied At</TableHead>
							<TableHead>Resume</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredApplications.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="h-24 text-center">
									No applications found.
								</TableCell>
							</TableRow>
						) : (
							filteredApplications.map((app) => (
								<TableRow key={app.id}>
									<TableCell>
										<div className="font-medium">{app.applicant_name}</div>
										<div className="text-sm text-muted-foreground">
											{app.email}
										</div>
									</TableCell>
									<TableCell>{app.job_title || "Unknown Job"}</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{new Date(app.created_at).toLocaleDateString()}
									</TableCell>
									<TableCell>
										<Button
											variant="outline"
											size="sm"
											asChild
											className="gap-2"
										>
											<a
												href={app.resume_url}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Download className="h-4 w-4" /> Download PDF
											</a>
										</Button>
									</TableCell>
									<TableCell>
										<Select
											value={app.status}
											onValueChange={(val) => handleStatusChange(app.id, val)}
										>
											<SelectTrigger className="w-[130px] h-8">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="pending">Pending</SelectItem>
												<SelectItem value="review">In Review</SelectItem>
												<SelectItem value="accepted">Accepted</SelectItem>
												<SelectItem value="rejected">Rejected</SelectItem>
												<SelectItem value="reserved">Reserved</SelectItem>
											</SelectContent>
										</Select>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
