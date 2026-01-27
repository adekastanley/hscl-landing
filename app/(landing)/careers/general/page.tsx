"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitApplication } from "@/app/actions/careers";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

// Since we don't have a real file upload service setup in this context yet (like Uploadthing or S3),
// we will simulate file upload or use a placeholder.
// Ideally, this should upload to a storage bucket and return a URL.
// For now, let's assume the user inputs a URL or we handle a basic file read to base64 (not recommended for large files)
// OR we just ask for a Link to Resume (Google Drive, LinkedIn, etc.) as often easier without complex backend.
// User requirement: "submit there cv".
// Let's implement a simple file input that converts to base64 string for now to store in DB text field,
// or better, just a "Link to Resume" field if simple.
// BUT user said "submit there cv", implying upload.
// Given constraints, I will implement a "Resume Link" field as fallback if no storage provider.
// Wait, I can't easily add a storage provider now. I'll stick to "Link to Resume / Portfolio" for simplicity and robustness,
// or try to implement a simple local file upload if I had a route for it.
// Let's go with "Resume URL" (Link) for now to ensure it works reliably without extra infrastructure.
// Wait, if I use a "file" input, I need an upload handler.
// I'll stick to "Link" for safety, OR if I really want to impress, I'd need an upload route.
// Let's do "Link to CV/Resume (Google Drive, Dropbox, etc.)" to be safe.

const formSchema = z.object({
	first_name: z.string().min(2, "First name must be at least 2 characters"),
	last_name: z.string().min(2, "Last name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	role_interest: z.string().min(1, "Please select a role of interest"),
	// resume_url will be handled separately via file upload logic, but we can keep it in schema if we want to validte it exists
	// OR we just validate file presence manually like in JobApplicationForm. Let's keep it clean.
	message: z.string().optional(),
});

const roles = [
	"General / Unspecified",
	"Health Systems Strengthening",
	"Monitoring & Evaluation",
	"Public Health",
	"Human Resources for Health",
	"Program Management",
	"Finance & Administration",
	"Information Technology",
];

export default function GeneralApplicationPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const inputFileRef = useRef<HTMLInputElement>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			email: "",
			role_interest: "",
			message: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true);
		try {
			// 1. Handle File Upload
			if (!inputFileRef.current?.files?.length) {
				toast.error("Please upload your resume (PDF)");
				setIsSubmitting(false);
				return;
			}

			const file = inputFileRef.current.files[0];
			if (file.size > 5 * 1024 * 1024) {
				// 5MB
				toast.error("File too large (max 5MB)");
				setIsSubmitting(false);
				return;
			}

			const uploadResponse = await fetch(`/api/upload?filename=${file.name}`, {
				method: "POST",
				body: file,
			});

			if (!uploadResponse.ok) {
				throw new Error("Upload failed");
			}

			const blob = await uploadResponse.json();

			// 2. Submit Application
			await submitApplication({
				job_id: "general-application", // Special ID for general applications
				applicant_name: `${values.first_name} ${values.last_name}`,
				email: values.email,
				resume_url: blob.url,
				role_interest: values.role_interest,
				message: values.message,
			});

			toast("Application Submitted", {
				description:
					"We have received your details. Thank you for your interest!",
			});

			form.reset();
			if (inputFileRef.current) {
				inputFileRef.current.value = "";
			}
			// Optionally redirect
			// router.push("/careers");
		} catch (error) {
			console.error(error);
			toast.error("Error", {
				description: "Something went wrong. Please try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="flex flex-col min-h-screen">
			<section className="bg-chemonics-navy py-12 md:py-20 text-white">
				<div className="container px-4 text-center">
					<h1 className="text-3xl md:text-5xl font-bold mb-4">
						Join Our Talent Pipeline
					</h1>
					<p className="max-w-2xl mx-auto text-gray-300">
						Don't see a matching role? Submit your details to be considered for
						future opportunities that match your skills and interests.
					</p>
				</div>
			</section>

			<div className="container max-w-2xl px-4 py-12">
				<div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="first_name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name</FormLabel>
											<FormControl>
												<Input placeholder="Jane" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="last_name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last Name</FormLabel>
											<FormControl>
												<Input placeholder="Doe" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email Address</FormLabel>
										<FormControl>
											<Input
												placeholder="john@example.com"
												type="email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="role_interest"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Role of Interest</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a role..." />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{roles.map((role) => (
													<SelectItem key={role} value={role}>
														{role}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Manual File Input */}
							<div className="space-y-2">
								<FormLabel>Resume (PDF)</FormLabel>
								<div className="flex items-center gap-2">
									<Input
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

							<FormField
								control={form.control}
								name="message"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Additional Message (Optional)</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Tell us a bit about yourself and what you're looking for..."
												className="resize-none"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								type="submit"
								className="w-full bg-chemonics-teal hover:bg-chemonics-teal/90"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Submitting...
									</>
								) : (
									"Submit Application"
								)}
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
