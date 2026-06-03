import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * Safely deletes a file from the local public directory if it exists.
 * @param url The public URL of the file.
 *   Accepts both:
 *     - Legacy format:  /folder/filename.jpg
 *     - New API format: /api/files/folder/filename.jpg
 */
export async function deleteLocalFile(url?: string | null) {
	if (!url) return;

	// Normalise: strip the /api/files prefix so we always work with /folder/filename
	let normalised = url;
	if (url.startsWith("/api/files/")) {
		normalised = url.slice("/api/files".length); // → /folder/filename
	}

	if (!normalised.startsWith("/")) return;

	try {
		// Split the path to get folder and filename
		const parts = normalised.split("/").filter(Boolean);
		if (parts.length < 2) return; // Need at least /folder/filename

		const folderName = parts[0];
		const filename = parts.slice(1).join("/");

		// Extra safety: make sure there are no path segments that could traverse up
		if (filename.includes("..")) {
			console.warn(`Suspicious file deletion attempt: ${url}`);
			return;
		}

		// Restricted list of folders we allow deletion from for safety
		const allowedFolders = [
			"siteimages",
			"resources",
			"projects",
			"stories",
			"people_stories",
			"events",
			"partners",
			"team",
			"leadership",
			"mission",
			"services",
			"ourwork",
			"documents",
			"logos",
			"misc",
		];

		if (!allowedFolders.includes(folderName)) {
			console.log(`Deletion not allowed from folder: ${folderName}`);
			return;
		}

		const uploadDir = join(process.cwd(), "public", folderName);
		const filePath = join(uploadDir, filename);

		if (existsSync(filePath)) {
			await unlink(filePath);
			console.log(`Successfully deleted local file: ${filePath}`);
		} else {
			console.log(`File for deletion not found on disk: ${filePath}`);
		}
	} catch (error) {
		console.error(`Failed to delete local file for url ${url}:`, error);
	}
}
