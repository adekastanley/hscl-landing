"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ClientShareButtonProps {
	title: string;
	text: string;
	url?: string;
	className?: string;
}

export function ClientShareButton({
	title,
	text,
	url,
	className,
}: ClientShareButtonProps) {
	const handleShare = async () => {
		const shareUrl = url || window.location.href;
		const shareData = {
			title,
			text,
			url: shareUrl,
		};

		if (navigator.share && navigator.canShare(shareData)) {
			try {
				await navigator.share(shareData);
			} catch (err) {
				console.error("Error sharing:", err);
			}
		} else {
			try {
				await navigator.clipboard.writeText(shareUrl);
				toast.success("Link copied to clipboard!");
			} catch (err) {
				console.error("Failed to copy:", err);
				toast.error("Failed to copy link.");
			}
		}
	};

	return (
		<Button
			variant="outline"
			onClick={handleShare}
			className={className || "justify-start w-full"}
		>
			<Share2 className="mr-2 h-4 w-4" /> Share Link
		</Button>
	);
}
