"use client";

import { useState, useEffect } from "react";
import {
	Download,
	ExternalLink,
	Filter,
	Calendar as CalendarIcon,
	Trash2,
} from "lucide-react";
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
	deleteApplication,
	getJobListings,
	type JobApplication,
	type JobListing,
} from "@/app/actions/careers";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function JobApplicationsTable() {
	const [applications, setApplications] = useState<JobApplication[]>([]);
	const [jobs, setJobs] = useState<JobListing[]>([]);
	const [filterJobId, setFilterJobId] = useState<string>("all");
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [dateRange, setDateRange] = useState<DateRange | undefined>();
	const [isLoading, setIsLoading] = useState(false);
	const [deleteAppId, setDeleteAppId] = useState<string | null>(null);

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

	const confirmDelete = async () => {
		if (!deleteAppId) return;
		setIsLoading(true);
		try {
			await deleteApplication(deleteAppId);
			toast.success("Application deleted");
			setDeleteAppId(null);
			loadData();
		} catch (error) {
			toast.error("Failed to delete application");
		} finally {
			setIsLoading(false);
		}
	};

	const filteredApplications = applications.filter((app) => {
		if (filterJobId !== "all" && app.job_id !== filterJobId) return false;
		if (filterStatus !== "all" && app.status !== filterStatus) return false;

		if (dateRange?.from) {
			const appDate = new Date(app.created_at);
			if (appDate < dateRange.from) return false;
			if (dateRange.to) {
				const endOfDay = new Date(dateRange.to);
				endOfDay.setHours(23, 59, 59, 999);
				if (appDate > endOfDay) return false;
			}
		}

		return true;
	});

	const getListingStatusBadge = (status?: string) => {
		if (!status) return <Badge variant="destructive">Deleted</Badge>; // If join failed or deleted
		if (status === "deleted")
			return <Badge variant="destructive">Deleted</Badge>;
		if (status === "closed") return <Badge variant="secondary">Closed</Badge>;
		return (
			<Badge variant="outline" className="border-green-500 text-green-600">
				Open
			</Badge>
		);
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
				<h3 className="text-lg font-medium">
					Applications ({filteredApplications.length})
				</h3>
				<div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant={"outline"}
								className={cn(
									"w-[240px] justify-start text-left font-normal",
									!dateRange && "text-muted-foreground",
								)}
							>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{dateRange?.from ? (
									dateRange.to ? (
										<>
											{format(dateRange.from, "LLL dd, y")} -{" "}
											{format(dateRange.to, "LLL dd, y")}
										</>
									) : (
										format(dateRange.from, "LLL dd, y")
									)
								) : (
									<span>Pick a date range</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="end">
							<Calendar
								initialFocus
								mode="range"
								defaultMonth={dateRange?.from}
								selected={dateRange}
								onSelect={setDateRange}
								numberOfMonths={2}
							/>
						</PopoverContent>
					</Popover>

					<Select value={filterJobId} onValueChange={setFilterJobId}>
						<SelectTrigger className="w-[180px]">
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
						<SelectTrigger className="w-[140px]">
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
							<TableHead>Listing Status</TableHead>
							<TableHead>Resume</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredApplications.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="h-24 text-center">
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
										{getListingStatusBadge(app.job_current_status)}
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
												<Download className="h-4 w-4" /> PDF
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
									<TableCell className="text-right">
										<Button
											variant="ghost"
											size="icon"
											className="text-destructive hover:bg-destructive/10"
											onClick={() => setDeleteAppId(app.id)}
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

			<Dialog
				open={!!deleteAppId}
				onOpenChange={(open) => !open && setDeleteAppId(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Application</DialogTitle>
						<DialogDescription>
							Are you sure? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteAppId(null)}>
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
