import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
	try {
		const { searchParams } = new URL(request.url);
		const filename = searchParams.get("filename") || "file.bin";

		if (!request.body) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		if (!process.env.BLOB_READ_WRITE_TOKEN) {
			console.error("BLOB_READ_WRITE_TOKEN is missing");
			return NextResponse.json(
				{ error: "Server configuration error: Missing Blob Token" },
				{ status: 500 },
			);
		}

		const blob = await put(filename, request.body, {
			access: "public",
			token: process.env.BLOB_READ_WRITE_TOKEN,
			addRandomSuffix: true,
		});

		return NextResponse.json(blob);
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{ error: `Upload failed: ${(error as Error).message}` },
			{ status: 500 },
		);
	}
}
