"use client";

import { useActionState, useState } from "react";
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
import {
	IconInnerShadowTop,
	IconMail,
	IconLock,
	IconEye,
	IconEyeOff,
} from "@tabler/icons-react";

import { Logo } from "@/components/logo";

const initialState = {
	error: "",
};

export default function LoginPage() {
	const [state, action, isPending] = useActionState(loginAction, initialState);
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 bg-[url('/assets/cloud.jpg')] bg-cover bg-center">
			<Card className="w-full mx-auto max-w-[420px] border border-white/60 bg-white/40 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[2rem] p-4 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
				<CardHeader className="text-center pt-8 pb-6 relative z-10">
					<div className="flex justify-center mb-4">
						<div className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-white shadow-sm text-black ring-1 ring-black/5">
							{/* <IconInnerShadowTop className="size-7" /> */}
							<Logo />
						</div>
					</div>
					<CardTitle className="text-[28px] font-semibold mt-2 text-gray-900 tracking-tight">
						Admin Login
					</CardTitle>
					<CardDescription className="text-gray-600 mt-2 font-medium text-[15px]">
						Enter your email and password to access the dashboard.
					</CardDescription>
				</CardHeader>
				<form action={action} className="relative z-10">
					<CardContent className="space-y-4 px-4 sm:px-6">
						<div className="space-y-1">
							<Label htmlFor="email" className="sr-only">
								Email
							</Label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
									<IconMail className="size-[22px]" stroke={1.8} />
								</div>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="Email"
									required
									className="pl-[46px] pr-4 bg-white/50 border border-white/60 hover:bg-white/60 rounded-xl h-14 focus-visible:ring-2 focus-visible:ring-black/10 transition-all text-gray-900 placeholder:text-gray-500 shadow-sm text-base block w-full outline-none"
								/>
							</div>
						</div>
						<div className="space-y-1">
							<Label htmlFor="password" className="sr-only">
								Password
							</Label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
									<IconLock className="size-[22px]" stroke={1.8} />
								</div>
								<Input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									placeholder="Password"
									required
									className="pl-[46px] pr-12 bg-white/50 border border-white/60 hover:bg-white/60 rounded-xl h-14 focus-visible:ring-2 focus-visible:ring-black/10 transition-all text-gray-900 placeholder:text-gray-500 shadow-sm text-base block w-full outline-none"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-700 transition-colors"
								>
									{showPassword ? (
										<IconEye className="size-[22px]" stroke={1.8} />
									) : (
										<IconEyeOff className="size-[22px]" stroke={1.8} />
									)}
								</button>
							</div>
						</div>
						{state?.error && (
							<p className="text-sm text-red-500 font-medium text-center">
								{state.error}
							</p>
						)}
						<div className="flex justify-end pt-2">
							<a
								href="#"
								className="text-[14px] text-gray-600 hover:text-gray-900 transition-colors font-medium"
							>
								Forgot password?
							</a>
						</div>
					</CardContent>
					<CardFooter className="px-4 sm:px-6 pb-8 pt-4">
						<Button
							className="w-full h-14 rounded-xl bg-[#1c1c1c] hover:bg-black text-white shadow-xl transition-all font-medium text-[16px]"
							type="submit"
							disabled={isPending}
						>
							{isPending ? "Signing in..." : "Log In"}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
