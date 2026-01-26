"use client";

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Download, Mail, Phone, Calendar } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Registration {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	created_at: string;
}

interface PageProps {
	event: any; // Type from DB query
	registrations: Registration[];
}

export default function RegistrantsClientPage({
	event,
	registrations,
}: PageProps) {
	const downloadCSV = () => {
		if (!registrations.length) {
			toast.info("No registrations to export.");
			return;
		}

		const headers = ["First Name", "Last Name", "Email", "Phone", "Date"];
		const rows = registrations.map((r) => [
			r.first_name,
			r.last_name,
			r.email,
			r.phone,
			new Date(r.created_at).toLocaleDateString(),
		]);

		const csvContent =
			"data:text/csv;charset=utf-8," +
			[headers, ...rows].map((e) => e.join(",")).join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `${event.slug}-registrants.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("CSV Export started");
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4">
				<Link
					href="/admin/dashboard/events"
					className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Events
				</Link>

				<div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
						<p className="text-muted-foreground mt-1">
							Manage registrations for this {event.category || "event"}.
						</p>
					</div>
					<Button
						onClick={downloadCSV}
						className="bg-chemonics-teal hover:bg-chemonics-teal/90"
					>
						<Download className="mr-2 h-4 w-4" /> Export CSV
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
					<div className="flex flex-row items-center justify-between space-y-0 pb-2">
						<h3 className="tracking-tight text-sm font-medium">
							Total Registrations
						</h3>
					</div>
					<div className="text-2xl font-bold">{registrations.length}</div>
				</div>
			</div>

			{/* Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>First Name</TableHead>
							<TableHead>Last Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Phone</TableHead>
							<TableHead>Registered</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{registrations.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="text-center py-12 text-muted-foreground"
								>
									No registrations found for this event.
								</TableCell>
							</TableRow>
						) : (
							registrations.map((reg) => (
								<TableRow key={reg.id}>
									<TableCell className="font-medium">
										{reg.first_name}
									</TableCell>
									<TableCell className="font-medium">{reg.last_name}</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<Mail className="h-3 w-3 text-muted-foreground" />
											{reg.email}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<Phone className="h-3 w-3 text-muted-foreground" />
											{reg.phone}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<Calendar className="h-3 w-3 text-muted-foreground" />
											{new Date(reg.created_at).toLocaleDateString()}
										</div>
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
