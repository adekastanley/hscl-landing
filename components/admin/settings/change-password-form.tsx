"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const initialState = {
	error: "",
	success: false,
};

export function ChangePasswordForm({ userId }: { userId?: string }) {
	const [state, action, isPending] = useActionState(
		changePasswordAction,
		initialState,
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Change Password</CardTitle>
				<CardDescription>
					Update your password to keep your account secure.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form action={action} className="space-y-4 max-w-md">
					<input type="hidden" name="userId" value={userId} />
					<div className="space-y-2">
						<Label htmlFor="currentPassword">Current Password</Label>
						<Input
							id="currentPassword"
							name="currentPassword"
							type="password"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="newPassword">New Password</Label>
						<Input
							id="newPassword"
							name="newPassword"
							type="password"
							required
							minLength={6}
						/>
					</div>

					{state.error && (
						<p className="text-sm text-destructive">{state.error}</p>
					)}
					{state.success && (
						<p className="text-sm text-green-600">
							Password updated successfully!
						</p>
					)}

					<Button type="submit" disabled={isPending}>
						{isPending ? "Updating..." : "Update Password"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
