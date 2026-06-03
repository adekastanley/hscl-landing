import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Normalizes an image URL.
 * - Relative paths (starting with /) are returned as-is.
 * - Absolute URLs from any domain are returned as-is (the browser will load them directly).
 * - Previously this function stripped hscgroup.com URLs to relative paths which broke images
 *   because those relative paths don't exist on this server.
 * @param url The URL to normalize
 */
export function normalizeImageUrl(url?: string | null): string {
	if (!url) return "";
	// Return any URL (relative or absolute) directly — don't transform.
	return url;
}
