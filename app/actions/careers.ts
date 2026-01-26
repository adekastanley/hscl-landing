"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface JobListing {
	id: string;
	title: string;
	description: string;
	location: string;
	type: string;
	status: "open" | "closed";
	created_at: string;
}

export interface JobApplication {
	id: string;
	job_id: string;
	applicant_name: string;
	email: string;
	resume_url: string;
	status: "pending" | "review" | "accepted" | "rejected" | "reserved";
	created_at: string;
	job_title?: string; // For display
}

// --- Jobs ---

export async function getJobListings(openOnly = false): Promise<JobListing[]> {
	try {
		const sql = openOnly
			? "SELECT * FROM job_listings WHERE status = 'open' ORDER BY created_at DESC"
			: "SELECT * FROM job_listings ORDER BY created_at DESC";

		const result = await db.execute(sql);
		return result.rows as unknown as JobListing[];
	} catch (error) {
		console.error("Failed to get jobs:", error);
		return [];
	}
}

export async function getJobById(id: string): Promise<JobListing | null> {
	try {
		const result = await db.execute({
			sql: "SELECT * FROM job_listings WHERE id = ? LIMIT 1",
			args: [id],
		});
		return (result.rows[0] as unknown as JobListing) || null;
	} catch (error) {
		console.error("Failed to get job:", error);
		return null;
	}
}

export async function createJob(
	data: Omit<JobListing, "id" | "status" | "created_at">,
) {
	const id = Math.random().toString(36).substring(2, 15);
	try {
		await db.execute({
			sql: "INSERT INTO job_listings (id, title, description, location, type, status) VALUES (?, ?, ?, ?, ?, 'open')",
			args: [id, data.title, data.description, data.location, data.type],
		});
		revalidatePath("/careers");
		revalidatePath("/admin/dashboard/careers");
		return { id, ...data };
	} catch (error) {
		console.error("Failed to create job:", error);
		throw error;
	}
}

export async function updateJobStatus(id: string, status: "open" | "closed") {
	try {
		await db.execute({
			sql: "UPDATE job_listings SET status = ? WHERE id = ?",
			args: [status, id],
		});
		revalidatePath("/careers");
		revalidatePath("/admin/dashboard/careers");
	} catch (error) {
		console.error("Failed to update job status:", error);
		throw error;
	}
}

export async function deleteJob(id: string) {
	try {
		await db.execute({
			sql: "DELETE FROM job_listings WHERE id = ?",
			args: [id],
		});
		// Also delete applications? For now, we keep them or DB might error if FK constraint.
		// SQLite default FK usually doesn't cascade unless specified.
		// Let's assume we might need to delete applications too or allow it to fail.
		// Safe bet: Delete applications first.
		await db.execute({
			sql: "DELETE FROM job_applications WHERE job_id = ?",
			args: [id],
		});

		revalidatePath("/careers");
		revalidatePath("/admin/dashboard/careers");
	} catch (error) {
		console.error("Failed to delete job:", error);
		throw error;
	}
}

// --- Applications ---

export async function submitApplication(data: {
	job_id: string;
	applicant_name: string;
	email: string;
	resume_url: string;
}) {
	const id = Math.random().toString(36).substring(2, 15);
	try {
		await db.execute({
			sql: "INSERT INTO job_applications (id, job_id, applicant_name, email, resume_url, status) VALUES (?, ?, ?, ?, ?, 'pending')",
			args: [id, data.job_id, data.applicant_name, data.email, data.resume_url],
		});
		revalidatePath("/admin/dashboard/careers");
		return { id };
	} catch (error) {
		console.error("Failed to submit application:", error);
		throw error;
	}
}

export async function getApplications(
	jobId?: string,
): Promise<JobApplication[]> {
	try {
		// Join with jobs to get title
		let sql = `
			SELECT ja.*, jl.title as job_title 
			FROM job_applications ja
			LEFT JOIN job_listings jl ON ja.job_id = jl.id
		`;
		const args = [];

		if (jobId) {
			sql += " WHERE ja.job_id = ?";
			args.push(jobId);
		}

		sql += " ORDER BY ja.created_at DESC";

		const result = await db.execute({ sql, args });
		return result.rows as unknown as JobApplication[];
	} catch (error) {
		console.error("Failed to get applications:", error);
		return [];
	}
}

export async function updateApplicationStatus(id: string, status: string) {
	try {
		await db.execute({
			sql: "UPDATE job_applications SET status = ? WHERE id = ?",
			args: [status, id],
		});
		revalidatePath("/admin/dashboard/careers");
	} catch (error) {
		console.error("Failed to update application status:", error);
		throw error;
	}
}
