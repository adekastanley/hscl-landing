"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { submitApplication } from "@/app/actions/careers";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export function JobApplicationForm({
	jobId,
	jobTitle,
}: {
	jobId: string;
	jobTitle: string;
}) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({ name: "", email: "" });
	const inputFileRef = useRef<HTMLInputElement>(null);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (!inputFileRef.current?.files?.length) {
				toast.error("Please upload your resume (PDF)");
				setIsLoading(false);
				return;
			}

			const file = inputFileRef.current.files[0];
			if (file.size > 5 * 1024 * 1024) {
				// 5MB
				toast.error("File too large (max 5MB)");
				setIsLoading(false);
				return;
			}

			// Upload to Blob
			const response = await fetch(`/api/upload?filename=${file.name}`, {
				method: "POST",
				body: file,
			});

			if (!response.ok) {
				throw new Error("Upload failed");
			}

			const blob = await response.json();

			// Submit Application
			await submitApplication({
				job_id: jobId,
				applicant_name: formData.name,
				email: formData.email,
				resume_url: blob.url,
			});

			toast.success("Application submitted successfully!");
			setOpen(false);
			setFormData({ name: "", email: "" });
		} catch (error) {
			console.error(error);
			toast.error("Failed to submit application. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					size="lg"
					className="bg-chemonics-teal hover:bg-chemonics-teal/90"
				>
					Apply for this Position
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Apply for {jobTitle}</DialogTitle>
					<DialogDescription>
						Please fill out the form below and attach your resume.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={onSubmit} className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="name">Full Name</Label>
						<Input
							id="name"
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							required
							placeholder="Jane Doe"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email Address</Label>
						<Input
							id="email"
							type="email"
							value={formData.email}
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
							required
							placeholder="jane@example.com"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="resume">Resume (PDF)</Label>
						<div className="flex items-center gap-2">
							<Input
								id="resume"
								type="file"
								ref={inputFileRef}
								accept=".pdf"
								required
								className="cursor-pointer"
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							Max file size: 5MB. PDF only.
						</p>
					</div>
					<DialogFooter>
						<Button type="submit" disabled={isLoading} className="w-full">
							{isLoading ? "Submitting..." : "Submit Application"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
