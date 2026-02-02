"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getSiteContent, updateSiteContent } from "@/actions/landing/about";

export default function MissionManager() {
	const [text, setText] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	useEffect(() => {
		async function loadContent() {
			const data = await getSiteContent("mission");
			if (data) {
				try {
					const parsed = JSON.parse(data);
					setText(parsed.text || "");
					setImageUrl(parsed.image || "");
				} catch (e) {
					// Fallback for legacy plain text
					setText(data);
				}
			}
			setIsLoading(false);
		}
		loadContent();
	}, []);

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.length) return;
		setIsUploading(true);
		const file = e.target.files[0];

		try {
			const response = await fetch(
				`/api/upload?filename=${encodeURIComponent(file.name)}`,
				{ method: "POST", body: file },
			);
			if (!response.ok) throw new Error("Upload failed");
			const blob = await response.json();
			setImageUrl(blob.url);
			toast.success("Image uploaded");
		} catch (error) {
			console.error(error);
			toast.error("Failed to upload image");
		} finally {
			setIsUploading(false);
		}
	};

	const handleSave = async () => {
		setIsSaving(true);
		const content = JSON.stringify({ text, image: imageUrl });
		const res = await updateSiteContent("mission", content);
		if (res.success) {
			toast.success("Mission updated successfully");
		} else {
			toast.error("Failed to update mission");
		}
		setIsSaving(false);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Our Mission</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="mission">Mission Statement</Label>
					<Textarea
						id="mission"
						placeholder="Enter your mission statement here..."
						value={text}
						onChange={(e) => setText(e.target.value)}
						className="min-h-[150px]"
						disabled={isLoading}
					/>
				</div>

				<div className="space-y-2">
					<Label>Side Image</Label>
					<div className="flex gap-4 items-start">
						{imageUrl ? (
							<div className="relative w-32 h-20 rounded-md overflow-hidden border">
								<img
									src={imageUrl}
									alt="Mission"
									className="w-full h-full object-cover"
								/>
							</div>
						) : (
							<div className="w-32 h-20 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
								No Image
							</div>
						)}
						<div className="space-y-1">
							<Input
								type="file"
								accept="image/*"
								onChange={handleImageUpload}
								disabled={isLoading || isUploading}
							/>
							<p className="text-xs text-muted-foreground">
								Upload an image to display alongside the mission text.
							</p>
						</div>
					</div>
				</div>

				<Button
					onClick={handleSave}
					disabled={isLoading || isSaving || isUploading}
				>
					{isSaving ? "Saving..." : "Save Mission"}
				</Button>
			</CardContent>
		</Card>
	);
}
