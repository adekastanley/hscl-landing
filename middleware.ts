import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;

	// Protect /admin routes
	if (path.startsWith("/admin")) {
		const session = request.cookies.get("session")?.value;
		const user = session ? await decrypt(session) : null;

		if (!user) {
			// Redirect to login if accessing admin without session
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	// Redirect authenticated users away from login page
	if (path === "/login") {
		const session = request.cookies.get("session")?.value;
		const user = session ? await decrypt(session) : null;
		if (user) {
			return NextResponse.redirect(new URL("/admin/dashboard", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*", "/login"],
};
