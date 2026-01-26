"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerForEvent } from "@/app/actions/events";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EventRegistrationModalProps {
	isOpen: boolean;
	onClose: () => void;
	eventId: string;
	eventTitle: string;
}

export function EventRegistrationModal({
	isOpen,
	onClose,
	eventId,
	eventTitle,
}: EventRegistrationModalProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const result = await registerForEvent(
				eventId,
				formData.name,
				formData.email,
			);

			if (result.success) {
				toast.success(result.message);
				onClose();
				setFormData({ name: "", email: "" });
			} else {
				toast.error(result.message);
			}
		} catch (error) {
			toast.error("Failed to register. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Register for {eventTitle}</DialogTitle>
					<DialogDescription>
						Enter your details to sign up for this event.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="name">Full Name</Label>
						<Input
							id="name"
							placeholder="John Doe"
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email Address</Label>
						<Input
							id="email"
							type="email"
							placeholder="john@example.com"
							value={formData.email}
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
							required
						/>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Register
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
