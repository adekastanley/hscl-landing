"use client";

import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	IconDownload,
	IconSearch,
	IconFileSpreadsheet,
} from "@tabler/icons-react";
import { format } from "date-fns";

interface DownloadRecord {
	id: string;
	resource_id: string;
	full_name: string;
	email: string;
	industry: string;
	created_at: string;
	resource_title: string;
}

interface DownloadsTableProps {
	data: DownloadRecord[];
}

export function DownloadsTable({ data }: DownloadsTableProps) {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredData = data.filter(
		(record) =>
			record.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			record.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			record.resource_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			record.industry.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const exportToCSV = () => {
		const headers = ["Full Name", "Email", "Industry", "Resource", "Date"];
		const rows = filteredData.map((record) => [
			record.full_name,
			record.email,
			record.industry,
			record.resource_title || "Unknown Resource",
			format(new Date(record.created_at), "yyyy-MM-dd HH:mm:ss"),
		]);

		const csvContent =
			"data:text/csv;charset=utf-8," +
			[headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute(
			"download",
			`hscl_downloads_${format(new Date(), "yyyy-MM-dd")}.csv`,
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div className="relative w-full md:w-96">
					<IconSearch
						className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
						size={18}
					/>
					<Input
						placeholder="Search by name, email, or resource..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10 h-11 bg-white border-gray-200 rounded-xl"
					/>
				</div>
				<Button
					onClick={exportToCSV}
					className="bg-chemonics-navy hover:bg-black text-white rounded-xl h-11 px-6 flex items-center gap-2"
				>
					<IconFileSpreadsheet size={18} />
					<span>Export CSV</span>
				</Button>
			</div>

			<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
				<Table>
					<TableHeader className="bg-gray-50/50">
						<TableRow className="hover:bg-transparent border-gray-100">
							<TableHead className="font-bold text-chemonics-navy py-4">
								Full Name
							</TableHead>
							<TableHead className="font-bold text-chemonics-navy py-4">
								Email
							</TableHead>
							<TableHead className="font-bold text-chemonics-navy py-4">
								Industry
							</TableHead>
							<TableHead className="font-bold text-chemonics-navy py-4">
								Resource
							</TableHead>
							<TableHead className="font-bold text-chemonics-navy py-4">
								Date
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredData.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="h-32 text-center text-gray-500"
								>
									No download records found.
								</TableCell>
							</TableRow>
						) : (
							filteredData.map((record) => (
								<TableRow
									key={record.id}
									className="hover:bg-gray-50/30 border-gray-50 transition-colors"
								>
									<TableCell className="font-medium text-chemonics-navy py-4">
										{record.full_name}
									</TableCell>
									<TableCell className="text-gray-600 py-4">
										{record.email}
									</TableCell>
									<TableCell className="py-4">
										<span className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
											{record.industry}
										</span>
									</TableCell>
									<TableCell className="font-medium text-chemonics-navy py-4">
										{record.resource_title || "Deleted Resource"}
									</TableCell>
									<TableCell className="text-gray-400 py-4">
										{format(new Date(record.created_at), "dd MMM yyyy, HH:mm")}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<div className="text-sm text-gray-400 px-2">
				Showing {filteredData.length} of {data.length} records
			</div>
		</div>
	);
}
