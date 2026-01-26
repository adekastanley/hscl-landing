"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface EventRegistration {
	id: string;
	event_id: string;
	name: string;
	email: string;
	created_at: string;
}

export async function registerForEvent(
	eventId: string,
	name: string,
	email: string,
) {
	const id = Math.random().toString(36).substring(2, 15);
	try {
		// Check if event is open
		const eventRes = await db.execute({
			sql: "SELECT status FROM content_items WHERE id = ?",
			args: [eventId],
		});

		const event = eventRes.rows[0];
		if (!event) throw new Error("Event not found");
		if (event.status === "closed") throw new Error("Event is closed");

		// Check duplicate email for this event
		const existing = await db.execute({
			sql: "SELECT id FROM event_registrations WHERE event_id = ? AND email = ?",
			args: [eventId, email],
		});

		if (existing.rows.length > 0) {
			return {
				success: false,
				message: "You have already registered for this event.",
			};
		}

		await db.execute({
			sql: "INSERT INTO event_registrations (id, event_id, name, email) VALUES (?, ?, ?, ?)",
			args: [id, eventId, name, email],
		});

		return { success: true, message: "Registration successful!" };
	} catch (error) {
		console.error("Registration failed:", error);
		if (error instanceof Error) {
			return { success: false, message: error.message };
		}
		return { success: false, message: "Something went wrong." };
	}
}

export async function getEventRegistrations(
	eventId: string,
): Promise<EventRegistration[]> {
	try {
		const result = await db.execute({
			sql: "SELECT * FROM event_registrations WHERE event_id = ? ORDER BY created_at DESC",
			args: [eventId],
		});
		return result.rows.map((row) => ({
			id: row.id as string,
			event_id: row.event_id as string,
			name: row.name as string,
			email: row.email as string,
			created_at: String(row.created_at),
		}));
	} catch (error) {
		console.error("Failed to get registrations:", error);
		return [];
	}
}
