"use server";

import db, { ensureDbInitialized } from "@/lib/db";
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
	role_interest?: string;
	message?: string;
	status: "pending" | "review" | "accepted" | "rejected" | "reserved";
	created_at: string;
	job_title?: string; // For display
	job_current_status?: string;
}

// --- Jobs ---

// --- Jobs ---

export async function getJobListings(openOnly = false): Promise<JobListing[]> {
	try {
		// ... (sql construction)
		let sql = "SELECT * FROM job_listings WHERE status != 'deleted'";
		if (openOnly) {
			sql += " AND status = 'open'";
		}
		sql += " ORDER BY created_at DESC";

		const result = await db.execute(sql);
		// Map to plain objects to avoid "Only plain objects can be passed..." error
		return result.rows.map((row) => ({ ...row })) as unknown as JobListing[];
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
		return (result.rows[0]
			? { ...result.rows[0] }
			: null) as unknown as JobListing;
	} catch (error) {
		console.error("Failed to get job:", error);
		return null;
	}
}
// ... (restored functions)

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

export async function updateJob(
	id: string,
	data: Partial<Omit<JobListing, "id" | "created_at">>,
) {
	try {
		// Only update fields that are present
		const fields = [];
		const args = [];

		if (data.title) {
			fields.push("title = ?");
			args.push(data.title);
		}
		if (data.description) {
			fields.push("description = ?");
			args.push(data.description);
		}
		if (data.location) {
			fields.push("location = ?");
			args.push(data.location);
		}
		if (data.type) {
			fields.push("type = ?");
			args.push(data.type);
		}
		if (data.status) {
			fields.push("status = ?");
			args.push(data.status);
		}

		if (fields.length === 0) return;

		args.push(id);
		const sql = `UPDATE job_listings SET ${fields.join(", ")} WHERE id = ?`;

		await db.execute({ sql, args });
		revalidatePath("/careers");
		revalidatePath("/admin/dashboard/careers");
	} catch (error) {
		console.error("Failed to update job:", error);
		throw error;
	}
}

export async function updateJobStatus(id: string, status: "open" | "closed") {
	return updateJob(id, { status });
}

export async function deleteJob(id: string) {
	try {
		// Soft delete
		await db.execute({
			sql: "UPDATE job_listings SET status = 'deleted' WHERE id = ?",
			args: [id],
		});

		// Do NOT delete applications, they remain linked.

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
	role_interest?: string;
	message?: string;
}) {
	await ensureDbInitialized();
	const id = Math.random().toString(36).substring(2, 15);

	// Ensure the job exists if it's the general application
	if (data.job_id === "general-application") {
		const job = await getJobById("general-application");
		if (!job) {
			await createJob({
				title: "General Application",
				description: "General Talent Pipeline",
				location: "Remote/Various",
				type: "General",
			});
			// createJob generates a random ID, but we need strictly "general-application"
			// So actually we should manually insert it or fix createJob.
			// Let's manually insert it here to be safe and precise.
			await db.execute({
				sql: "INSERT OR IGNORE INTO job_listings (id, title, description, location, type, status) VALUES ('general-application', 'General Application', 'General Talent Pipeline', 'Remote/Various', 'General', 'open')",
				args: [],
			});
		}
	}

	try {
		await db.execute({
			sql: "INSERT INTO job_applications (id, job_id, applicant_name, email, resume_url, role_interest, message, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')",
			args: [
				id,
				data.job_id,
				data.applicant_name,
				data.email,
				data.resume_url,
				data.role_interest || null,
				data.message || null,
			],
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
		// Join with jobs to get title and status
		let sql = `
			SELECT ja.*, jl.title as job_title, jl.status as job_current_status
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
		return result.rows.map((row) => ({
			...row,
		})) as unknown as JobApplication[];
	} catch (error) {
		// ...
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

export async function deleteApplication(id: string) {
	try {
		await db.execute({
			sql: "DELETE FROM job_applications WHERE id = ?",
			args: [id],
		});
		revalidatePath("/admin/dashboard/careers");
	} catch (error) {
		console.error("Failed to delete application:", error);
		throw error;
	}
}
