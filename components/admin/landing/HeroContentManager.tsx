"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { getSiteContent, updateSiteContent } from "@/actions/landing/about";
import RichTextEditor from "@/components/ui/RichTextEditor";

export default function HeroContentManager() {
	const [content, setContent] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		async function fetchContent() {
			try {
				const data = await getSiteContent("hero_text");
				if (data) setContent(data);
			} catch (error) {
				console.error("Failed to fetch hero content", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchContent();
	}, []);

	const handleSave = async () => {
		setIsSaving(true);
		try {
			const res = await updateSiteContent("hero_text", content);
			if (res.success) {
				toast.success("Hero content saved successfully");
			} else {
				throw new Error(res.error || "Failed to save");
			}
		} catch (error: any) {
			toast.error(error.message || "An error occurred");
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Hero Section Content</CardTitle>
					<CardDescription>Loading...</CardDescription>
				</CardHeader>
				<CardContent className="flex justify-center py-8">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>Hero Section Content</CardTitle>
					<CardDescription>
						Update the main headline on the homepage hero section.
					</CardDescription>
				</div>
				<Button onClick={handleSave} disabled={isSaving}>
					{isSaving ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
						</>
					) : (
						<>
							<Save className="mr-2 h-4 w-4" /> Save Changes
						</>
					)}
				</Button>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<RichTextEditor
						value={content}
						onChange={setContent}
						placeholder="E.g. We strengthen health systems..."
					/>
					<p className="text-xs text-muted-foreground">
						Tip: Use the color picker to highlight certain words (like in the
						original design).
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
