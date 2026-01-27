"use client";

import { useState, useEffect } from "react";
import {
	Download,
	ExternalLink,
	Filter,
	Calendar as CalendarIcon,
	Trash2,
	Eye,
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
	type JobApplication,
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const roles = [
	"Health Systems Strengthening",
	"Monitoring & Evaluation",
	"Public Health",
	"Human Resources for Health",
	"Program Management",
	"Finance & Administration",
	"Information Technology",
];

export function GeneralApplicationsTable() {
	const [applications, setApplications] = useState<JobApplication[]>([]);
	const [filterRole, setFilterRole] = useState<string>("all");
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [dateRange, setDateRange] = useState<DateRange | undefined>();
	const [isLoading, setIsLoading] = useState(false);
	const [deleteAppId, setDeleteAppId] = useState<string | null>(null);
	const [viewApp, setViewApp] = useState<JobApplication | null>(null);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		// Fetch jobs with job_id='general-application'
		// Note: The getApplications call needs to support filtering or we filter client side if backend returns all.
		// Current getApplications supports jobId filtering.
		const appsData = await getApplications("general-application");
		setApplications(appsData);
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
		if (filterRole !== "all" && app.role_interest !== filterRole) return false;
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

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "pending":
				return <Badge variant="secondary">Hold</Badge>;
			case "review":
				return (
					<Badge className="bg-blue-500 hover:bg-blue-600">Consideration</Badge>
				);
			case "accepted":
				return (
					<Badge className="bg-green-500 hover:bg-green-600">Accepted</Badge>
				);
			case "rejected":
				return <Badge variant="destructive">Rejected</Badge>;
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
				<h3 className="text-lg font-medium">
					General Applications ({filteredApplications.length})
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

					<Select value={filterRole} onValueChange={setFilterRole}>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="Filter by Role Interest" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Roles</SelectItem>
							{roles.map((role) => (
								<SelectItem key={role} value={role}>
									{role}
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
							<SelectItem value="pending">Hold</SelectItem>
							<SelectItem value="review">Consideration</SelectItem>
							<SelectItem value="accepted">Accepted</SelectItem>
							<SelectItem value="rejected">Rejected</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="border rounded-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Applicant</TableHead>
							<TableHead>Role Interest</TableHead>
							<TableHead>Applied At</TableHead>
							<TableHead>Resume</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredApplications.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="h-24 text-center">
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
									<TableCell>{app.role_interest || "Unspecified"}</TableCell>
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
												<Download className="h-4 w-4" /> Link
											</a>
										</Button>
									</TableCell>
									<TableCell>
										{/* Status Dropdown inside table cell or custom rendering? User asked for dropdown. */}
										{/* Let's reuse the dropdown pattern but with custom labels */}
										<Select
											value={app.status}
											onValueChange={(val) => handleStatusChange(app.id, val)}
										>
											<SelectTrigger className="w-[140px] h-8">
												<SelectValue>{getStatusBadge(app.status)}</SelectValue>
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="pending">Hold</SelectItem>
												<SelectItem value="review">Consideration</SelectItem>
												<SelectItem value="accepted">Accepted</SelectItem>
												<SelectItem value="rejected">Rejected</SelectItem>
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => setViewApp(app)}
											>
												<Eye className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="text-destructive hover:bg-destructive/10"
												onClick={() => setDeleteAppId(app.id)}
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

			{/* Delete Dialog */}
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

			{/* View Details Dialog */}
			<Dialog
				open={!!viewApp}
				onOpenChange={(open) => !open && setViewApp(null)}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Application Details</DialogTitle>
					</DialogHeader>
					{viewApp && (
						<div className="space-y-4 py-2">
							<div className="grid grid-cols-2 gap-2">
								<div className="font-medium text-sm text-muted-foreground">
									Name
								</div>
								<div>{viewApp.applicant_name}</div>

								<div className="font-medium text-sm text-muted-foreground">
									Email
								</div>
								<div>{viewApp.email}</div>

								<div className="font-medium text-sm text-muted-foreground">
									Role Interest
								</div>
								<div>{viewApp.role_interest}</div>

								<div className="font-medium text-sm text-muted-foreground">
									Applied Date
								</div>
								<div>{new Date(viewApp.created_at).toLocaleString()}</div>

								<div className="font-medium text-sm text-muted-foreground">
									Resume
								</div>
								<div>
									<a
										href={viewApp.resume_url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 hover:underline flex items-center gap-1"
									>
										Open Link <ExternalLink className="h-3 w-3" />
									</a>
								</div>

								<div className="font-medium text-sm text-muted-foreground">
									Status
								</div>
								<div>{getStatusBadge(viewApp.status)}</div>

								{viewApp.message && (
									<>
										<div className="font-medium text-sm text-muted-foreground col-span-2 mt-2">
											Message
										</div>
										<div className="col-span-2 text-sm bg-muted/50 p-3 rounded-md whitespace-pre-wrap">
											{viewApp.message}
										</div>
									</>
								)}
							</div>
						</div>
					)}
					<DialogFooter>
						<Button variant="outline" onClick={() => setViewApp(null)}>
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
