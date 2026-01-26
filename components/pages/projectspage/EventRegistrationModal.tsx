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
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		console.log("Submitting form data:", formData);
		try {
			const result = await registerForEvent(
				eventId,
				formData.firstName,
				formData.lastName,
				formData.email,
				formData.phone,
			);

			if (result.success) {
				toast.success(result.message);
				onClose();
				setFormData({ firstName: "", lastName: "", email: "", phone: "" });
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
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="firstName">First Name</Label>
							<Input
								id="firstName"
								placeholder="John"
								value={formData.firstName}
								onChange={(e) =>
									setFormData({ ...formData, firstName: e.target.value })
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="lastName">Last Name</Label>
							<Input
								id="lastName"
								placeholder="Doe"
								value={formData.lastName}
								onChange={(e) =>
									setFormData({ ...formData, lastName: e.target.value })
								}
								required
							/>
						</div>
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
					<div className="space-y-2">
						<Label htmlFor="phone">Phone Number</Label>
						<Input
							id="phone"
							type="tel"
							placeholder="+1 (555) 000-0000"
							value={formData.phone}
							onChange={(e) =>
								setFormData({ ...formData, phone: e.target.value })
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
