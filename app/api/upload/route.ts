import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: Request): Promise<NextResponse> {
	try {
		const { searchParams } = new URL(request.url);
		const filename = searchParams.get("filename") || "file.bin";
		const folder = searchParams.get("folder") || "misc"; // Default folder

		if (!request.body) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		// Validate folder name to prevent directory traversal
		if (!/^[a-zA-Z0-9_-]+$/.test(folder)) {
			return NextResponse.json(
				{ error: "Invalid folder name" },
				{ status: 400 },
			);
		}

		const bytes = await request.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Ensure directory exists
		const uploadDir = join(process.cwd(), "public", "assets", folder);
		if (!existsSync(uploadDir)) {
			await mkdir(uploadDir, { recursive: true });
		}

		// Create unique filename to avoid overwrites (timestamp prefix)
		// actually, let's keep it simple or use UUID if we want.
		// User said "assets/logos/name.png", so maybe they want original names?
		// But collisions are bad. Let's prepend timestamp.
		const uniqueFilename = `${Date.now()}-${filename}`;
		const filePath = join(uploadDir, uniqueFilename);

		await writeFile(filePath, buffer);

		// Return the public URL
		// Assuming site is hosted at root. If subpath, this might need adjustment.
		const url = `/assets/${folder}/${uniqueFilename}`;

		return NextResponse.json({ url });
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{ error: `Upload failed: ${(error as Error).message}` },
			{ status: 500 },
		);
	}
}
