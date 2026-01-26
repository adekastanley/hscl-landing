import { NextResponse } from "next/server";

export async function GET() {
	const token = process.env.BLOB_READ_WRITE_TOKEN;
	return NextResponse.json({
		hasToken: !!token,
		tokenPreview: token ? `${token.substring(0, 5)}...` : "missing",
		envLength: Object.keys(process.env).length,
	});
}
