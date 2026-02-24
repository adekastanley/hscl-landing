"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileUp, File, X, Trash2, Save } from "lucide-react";
import {
	getGlobalDocument,
	upsertGlobalDocument,
	GlobalDocument,
} from "@/app/actions/documents";

export default function DocumentManager() {
	const [document, setDocument] = useState<GlobalDocument | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [fileExt, setFileExt] = useState("");

	const title = "Capability Statement";
	const docKey = "capability_statement"; // The unique key for this document

	useEffect(() => {
		async function fetchDocument() {
			try {
				const doc = await getGlobalDocument(docKey);
				setDocument(doc);
				if (doc) {
					setFileExt(doc.file_url.split(".").pop() || "");
				}
			} catch (error) {
				console.error("Failed to fetch document", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchDocument();
	}, [docKey]);

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Optional: validate file type (e.g. PDF)
		if (file.type !== "application/pdf") {
			toast.error("Please upload a PDF file");
			return;
		}

		setIsSaving(true);
		try {
			toast.loading("Uploading document...");
			const response = await fetch(
				`/api/upload?filename=${encodeURIComponent(file.name)}`,
				{
					method: "POST",
					headers: { "Content-Type": file.type },
					body: file,
				},
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.error || "Upload failed");
			}

			const data = await response.json();
			const fileUrl = data.path || data.url;

			// Save to database
			await upsertGlobalDocument(docKey, title, fileUrl);

			setDocument({
				id: document?.id || "",
				key: docKey,
				title,
				file_url: fileUrl,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			});

			setFileExt(file.name.split(".").pop() || "");
			toast.dismiss();
			toast.success("Document uploaded successfully");
		} catch (error) {
			console.error("Upload error:", error);
			toast.dismiss();
			toast.error(
				error instanceof Error ? error.message : "Failed to upload document",
			);
		} finally {
			setIsSaving(false);
		}
	};

	const handleRemoveDocument = async () => {
		if (
			!confirm(
				"Are you sure you want to remove this document? It will disappear from the public website.",
			)
		) {
			return;
		}

		setIsSaving(true);
		try {
			await upsertGlobalDocument(docKey, title, null);
			setDocument(null);
			toast.success("Document removed successfully");
		} catch (error) {
			console.error("Failed to remove document:", error);
			toast.error("Failed to remove document");
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return <div className="p-4 border rounded-md">Loading...</div>;
	}

	return (
		<div className="p-4 border rounded-md">
			<h2 className="text-lg font-bold mb-4">{title}</h2>
			<p className="text-sm text-muted-foreground mb-4">
				Upload the {title} document below. This document will be available for
				download on the homepage map section.
			</p>

			<div className="space-y-4">
				{document ? (
					<div className="border rounded-md p-4 flex items-center justify-between bg-muted/20">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-primary/10 rounded-md text-primary">
								<File className="w-6 h-6" />
							</div>
							<div>
								<p className="font-medium text-sm">Current Document</p>
								<a
									href={document.file_url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-xs text-blue-500 hover:underline"
								>
									View {fileExt.toUpperCase()} File
								</a>
							</div>
						</div>
						<Button
							variant="destructive"
							size="sm"
							onClick={handleRemoveDocument}
							disabled={isSaving}
						>
							{isSaving ? "Removing..." : "Remove"}
							<Trash2 className="w-4 h-4 ml-2" />
						</Button>
					</div>
				) : (
					<div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
						<FileUp className="w-8 h-8 text-muted-foreground mb-2" />
						<p className="text-sm font-medium mb-1">No document uploaded</p>
						<p className="text-xs text-muted-foreground mb-4">
							Upload a PDF file to enable the download button.
						</p>

						<div>
							<Input
								type="file"
								accept="application/pdf"
								className="hidden"
								id="doc-upload"
								onChange={handleFileUpload}
								disabled={isSaving}
							/>
							<Label
								htmlFor="doc-upload"
								className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
							>
								{isSaving ? "Uploading..." : "Upload PDF"}
							</Label>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
