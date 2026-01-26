"use client";

import { Button } from "@/components/ui/button";
import { fixDatabaseSchema } from "@/app/actions/schema";
import { toast } from "sonner";
import { useState } from "react";

export function FixSchemaButton() {
	const [isLoading, setIsLoading] = useState(false);

	const handleFix = async () => {
		setIsLoading(true);
		try {
			const res = await fixDatabaseSchema();
			if (res.success) {
				toast.success("Database schema fixed successfully!");
			} else {
				toast.error("Failed to fix schema: " + res.error);
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button onClick={handleFix} disabled={isLoading} variant="destructive">
			{isLoading ? "Fixing..." : "Fix 'Event' Constraint Issue"}
		</Button>
	);
}
