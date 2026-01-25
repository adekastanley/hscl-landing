import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const authToken = request.cookies.get("auth_token");
	const { pathname } = request.nextUrl;

	// Case 1: User is already logged in and tries to access the login page
	if (pathname === "/admin" && authToken) {
		return NextResponse.redirect(new URL("/admin/dashboard", request.url));
	}

	// Case 2: User is NOT logged in and tries to access protected routes
	if (pathname.startsWith("/admin/dashboard") && !authToken) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin", "/admin/dashboard/:path*"],
};
