import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const SECRET_KEY = process.env.AUTH_SECRET || "your-secret-key-change-in-prod";
const key = new TextEncoder().encode(SECRET_KEY);

export async function encrypt(payload: any) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("24h") // Session expires in 24 hours
		.sign(key);
}

export async function decrypt(input: string): Promise<any> {
	try {
		const { payload } = await jwtVerify(input, key, {
			algorithms: ["HS256"],
		});
		return payload;
	} catch (error) {
		return null;
	}
}

export async function getSession() {
	const cookieStore = await cookies();
	const session = cookieStore.get("session")?.value;
	if (!session) return null;
	return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
	const session = request.cookies.get("session")?.value;
	if (!session) return;

	// Refresh expiration on each request if valid
	const parsed = await decrypt(session);
	if (!parsed) return;

	parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // +24 hours
	const res = NextResponse.next();
	res.cookies.set({
		name: "session",
		value: await encrypt(parsed),
		httpOnly: true,
		expires: parsed.expires,
	});
	return res;
}

export async function login(userData: any) {
	// Create session
	const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
	const session = await encrypt({ user: userData, expires });

	// Set cookie
	const cookieStore = await cookies();
	cookieStore.set("session", session, { expires, httpOnly: true });
}

export async function logout() {
	const cookieStore = await cookies();
	cookieStore.set("session", "", { expires: new Date(0) });
}

// Password Utilities
export async function hashPassword(password: string) {
	return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
	return await bcrypt.compare(password, hash);
}
