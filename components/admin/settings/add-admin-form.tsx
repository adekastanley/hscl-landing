"use client";

import { useActionState } from "react";
import { createAdminAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { UserPlus } from "lucide-react";

const initialState = {
	error: "",
	success: false,
};

export function AddAdminForm() {
	const [state, action, isPending] = useActionState(
		createAdminAction,
		initialState,
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add New Admin</CardTitle>
				<CardDescription>Create a new administrator account.</CardDescription>
			</CardHeader>
			<CardContent>
				<form action={action} className="space-y-4 max-w-md">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input id="name" name="name" required />
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" name="email" type="email" required />
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Initial Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							required
							minLength={6}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="role">Role</Label>
						<Select name="role" defaultValue="admin">
							<SelectTrigger>
								<SelectValue placeholder="Select role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="admin">Admin</SelectItem>
								<SelectItem value="super_admin">Super Admin</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{state.error && (
						<p className="text-sm text-destructive">{state.error}</p>
					)}
					{state.success && (
						<p className="text-sm text-green-600">
							Admin created successfully!
						</p>
					)}

					<Button type="submit" disabled={isPending}>
						<UserPlus className="mr-2 h-4 w-4" />
						{isPending ? "Creating..." : "Create Admin"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
