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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { getSiteContent, updateSiteContent } from "@/actions/landing/about";

interface SectionHeaderProps {
	contentKey: string;
	title: string;
	description: string;
	defaultHeading: string;
	defaultSubtext: string;
}

export default function SectionHeaderManager({
	contentKey,
	title,
	description,
	defaultHeading,
	defaultSubtext,
}: SectionHeaderProps) {
	const [heading, setHeading] = useState("");
	const [subtext, setSubtext] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		async function fetchContent() {
			try {
				const data = await getSiteContent(contentKey);
				if (data) {
					const parsed = JSON.parse(data);
					setHeading(parsed.heading || "");
					setSubtext(parsed.subtext || "");
				}
			} catch (error) {
				console.error(`Failed to fetch ${contentKey}`, error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchContent();
	}, [contentKey]);

	const handleSave = async () => {
		setIsSaving(true);
		try {
			const res = await updateSiteContent(
				contentKey,
				JSON.stringify({ heading, subtext }),
			);
			if (res.success) {
				toast.success(`${title} headers saved successfully`);
			} else {
				throw new Error(res.error || "Failed to save");
			}
		} catch (error: any) {
			toast.error(error.message || "An error occurred");
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) return null;

	return (
		<Card className="border-chemonics-lime/20 shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
						{title} Headers
					</CardTitle>
					<CardDescription>{description}</CardDescription>
				</div>
				<Button size="sm" onClick={handleSave} disabled={isSaving}>
					{isSaving ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Save className="h-4 w-4 mr-2" />
					)}
					Save Headers
				</Button>
			</CardHeader>
			<CardContent className="grid gap-4">
				<div className="grid gap-2">
					<Label className="text-xs uppercase text-chemonics-lime">
						Small Upper Text
					</Label>
					<Input
						placeholder={defaultHeading}
						value={heading}
						onChange={(e) => setHeading(e.target.value)}
					/>
				</div>
				<div className="grid gap-2">
					<Label className="text-xs uppercase text-chemonics-lime">
						Main Heading
					</Label>
					<Input
						placeholder={defaultSubtext}
						value={subtext}
						onChange={(e) => setSubtext(e.target.value)}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
