import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Normalizes an image URL by stripping legacy domains and ensuring it's a relative path if it's our own asset.
 * @param url The URL to normalize
 */
export function normalizeImageUrl(url?: string | null): string {
	if (!url) return "";

	// If it's already a relative path, return as is
	if (url.startsWith("/")) return url;

	try {
		const urlObj = new URL(url);
		// Check if it's our legacy domain or current domain
		if (
			urlObj.hostname === "hscgroup.org" ||
			urlObj.hostname === "www.hscgroup.org" ||
			urlObj.hostname === "hscgroup.com" ||
			urlObj.hostname === "www.hscgroup.com"
		) {
			return urlObj.pathname + urlObj.search;
		}
	} catch (e) {
		// Not a valid absolute URL, return as is
	}

	return url;
}
