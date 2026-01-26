"use server";

import db, { ensureDbInitialized } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface EventRegistration {
	id: string;
	event_id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	created_at: string;
}

export async function registerForEvent(
	eventId: string,
	firstName: string,
	lastName: string,
	email: string,
	phone: string,
) {
	const id = Math.random().toString(36).substring(2, 15);
	try {
		await ensureDbInitialized();
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
			sql: "INSERT INTO event_registrations (id, event_id, first_name, last_name, email, phone) VALUES (:id, :eventId, :firstName, :lastName, :email, :phone)",
			args: { id, eventId, firstName, lastName, email, phone },
		});

		// Explicit path revalidation might not be enough for dynamic subpages,
		// but ensures the list count updates.
		revalidatePath("/admin/dashboard/events");
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
		await ensureDbInitialized();
		const result = await db.execute({
			sql: "SELECT * FROM event_registrations WHERE event_id = ? ORDER BY created_at DESC",
			args: [eventId],
		});
		return result.rows.map((row) => ({
			id: row.id as string,
			event_id: row.event_id as string,
			first_name: row.first_name as string,
			last_name: row.last_name as string,
			email: row.email as string,
			phone: row.phone as string,
			created_at: String(row.created_at),
		}));
	} catch (error) {
		console.error("Failed to get registrations:", error);
		return [];
	}
}

export async function getEventRegistrationCount(
	eventId: string,
): Promise<number> {
	try {
		await ensureDbInitialized();
		const result = await db.execute({
			sql: "SELECT COUNT(*) as count FROM event_registrations WHERE event_id = ?",
			args: [eventId],
		});
		return Number(result.rows[0].count);
	} catch (error) {
		console.error("Failed to get registration count:", error);
		return 0;
	}
}
