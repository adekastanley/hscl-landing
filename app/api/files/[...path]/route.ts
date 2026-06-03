import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join, extname } from "path";
import { existsSync } from "fs";

// Simple MIME type map for common image/document types
const MIME_TYPES: Record<string, string> = {
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".png": "image/png",
	".gif": "image/gif",
	".webp": "image/webp",
	".svg": "image/svg+xml",
	".ico": "image/x-icon",
	".avif": "image/avif",
	".pdf": "application/pdf",
	".mp4": "video/mp4",
	".webm": "video/webm",
};

// Folders we allow to be served via this route (mirrors deleteLocalFile allowlist)
const ALLOWED_FOLDERS = [
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

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
	try {
		const { path: pathSegments } = await params;

		if (!pathSegments || pathSegments.length < 2) {
			return NextResponse.json({ error: "Invalid path" }, { status: 400 });
		}

		const folder = pathSegments[0];
		const filename = pathSegments.slice(1).join("/");

		// Security: only allow whitelisted folders
		if (!ALLOWED_FOLDERS.includes(folder)) {
			return NextResponse.json(
				{ error: "Folder not allowed" },
				{ status: 403 },
			);
		}

		// Security: prevent path traversal
		if (filename.includes("..") || folder.includes("..")) {
			return NextResponse.json(
				{ error: "Invalid file path" },
				{ status: 400 },
			);
		}

		const filePath = join(process.cwd(), "public", folder, filename);

		if (!existsSync(filePath)) {
			return NextResponse.json({ error: "File not found" }, { status: 404 });
		}

		const fileBuffer = await readFile(filePath);
		const ext = extname(filename).toLowerCase();
		const mimeType = MIME_TYPES[ext] || "application/octet-stream";

		return new NextResponse(fileBuffer, {
			status: 200,
			headers: {
				"Content-Type": mimeType,
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		});
	} catch (error) {
		console.error("File serving error:", error);
		return NextResponse.json(
			{ error: "Failed to serve file" },
			{ status: 500 },
		);
	}
}
