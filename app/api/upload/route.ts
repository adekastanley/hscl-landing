import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

function slugifyFilename(filename: string): string {
	const lastDot = filename.lastIndexOf(".");
	const ext = lastDot !== -1 ? filename.slice(lastDot) : "";
	const name = lastDot !== -1 ? filename.slice(0, lastDot) : filename;
	const slug = name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
	return `${slug}${ext}`;
}

export async function POST(request: Request): Promise<NextResponse> {
	try {
		const { searchParams } = new URL(request.url);
		const rawFilename = searchParams.get("filename") || "file.bin";
		const filename = slugifyFilename(rawFilename);
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
		const uploadDir = join(process.cwd(), "public", folder);
		if (!existsSync(uploadDir)) {
			await mkdir(uploadDir, { recursive: true });
		}

		// Create unique filename to avoid overwrites (timestamp prefix)
		const uniqueFilename = `${Date.now()}-${filename}`;
		const filePath = join(uploadDir, uniqueFilename);

		await writeFile(filePath, buffer);

		// Return the public URL
		const url = `/${folder}/${uniqueFilename}`;

		return NextResponse.json({ url });
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{ error: `Upload failed: ${(error as Error).message}` },
			{ status: 500 },
		);
	}
}
