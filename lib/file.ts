import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * Safely deletes a file from the local public/siteimages directory if it exists.
 * @param url The public URL of the file (e.g., /siteimages/123-file.png)
 */
export async function deleteLocalFile(url?: string | null) {
	if (!url) return;

	try {
		// Only attempt to delete files that are in our designated upload directories
		if (url.startsWith("/siteimages/") || url.startsWith("/resources/")) {
			// Extract folder and filename
			const isSiteImage = url.startsWith("/siteimages/");
			const folderName = isSiteImage ? "siteimages" : "resources";
			const filename = url.replace(`/${folderName}/`, "");

			// Extra safety: make sure there are no path segments that could traverse up
			if (filename.includes("..") || filename.includes("/")) {
				console.warn(`Suspicious file deletion attempt: ${url}`);
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
		}
	} catch (error) {
		console.error(`Failed to delete local file for url ${url}:`, error);
	}
}
