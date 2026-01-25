"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";

interface JobApplicationFormProps {
	jobTitle: string;
}

export function JobApplicationForm({ jobTitle }: JobApplicationFormProps) {
	const [file, setFile] = useState<File | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate API call
		console.log("Submitting application for", jobTitle);
		await new Promise((resolve) => setTimeout(resolve, 2000));

		setIsSubmitting(false);
		alert("Application submitted successfully!");
		// Reset form or redirect
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Apply for this position</CardTitle>
				<CardDescription>
					Please fill out the form below to apply for {jobTitle}.
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Full Name</Label>
						<Input id="name" placeholder="John Doe" required />
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="john@example.com"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="expertise">Area of Expertise</Label>
						<Input
							id="expertise"
							placeholder="e.g. Product Design, Marketing, etc."
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="cv">CV / Resume</Label>
						<div className="flex items-center justify-center w-full">
							<label
								htmlFor="cv-upload"
								className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
							>
								<div className="flex flex-col items-center justify-center pt-5 pb-6">
									<Upload className="w-8 h-8 mb-2 text-muted-foreground" />
									<p className="mb-2 text-sm text-muted-foreground">
										<span className="font-semibold">Click to upload</span> or
										drag and drop
									</p>
									<p className="text-xs text-muted-foreground">
										PDF, DOC, DOCX (Max 5MB)
									</p>
								</div>
								<input
									id="cv-upload"
									type="file"
									className="hidden"
									accept=".pdf,.doc,.docx"
									onChange={(e) => setFile(e.target.files?.[0] || null)}
									required
								/>
							</label>
						</div>
						{file && (
							<p className="text-sm text-muted-foreground mt-2">
								Selected file:{" "}
								<span className="font-medium text-foreground">{file.name}</span>
							</p>
						)}
					</div>
				</CardContent>
				<CardFooter>
					<Button
						type="submit"
						className="w-full bg-chemonics-teal hover:bg-chemonics-teal/90"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Submitting..." : "Submit Application"}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
