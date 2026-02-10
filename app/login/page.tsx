"use client";

import { useActionState } from "react";
import { loginAction } from "../actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { IconInnerShadowTop } from "@tabler/icons-react";

const initialState = {
	error: "",
};

export default function LoginPage() {
	const [state, action, isPending] = useActionState(loginAction, initialState);

	return (
		<div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
			<Card className="w-full max-w-sm">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4">
						<div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<IconInnerShadowTop className="size-6" />
						</div>
					</div>
					<CardTitle className="text-2xl">Admin Login</CardTitle>
					<CardDescription>
						Enter your email and password to access the dashboard.
					</CardDescription>
				</CardHeader>
				<form action={action}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="admin@example.com"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input id="password" name="password" type="password" required />
						</div>
						{state?.error && (
							<p className="text-sm text-destructive text-center">
								{state.error}
							</p>
						)}
					</CardContent>
					<CardFooter>
						<Button className="w-full" type="submit" disabled={isPending}>
							{isPending ? "Signing in..." : "Sign in"}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
