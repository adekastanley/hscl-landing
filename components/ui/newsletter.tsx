"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "./input";

export default function NewsLetterButton() {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (email) {
			setIsSubmitted(true);
			console.log("Newsletter signup:", email);
		}
	};

	return (
		<div className="opacity-0 animate-fade-in-up animate-delay-400 ">
			{!isSubmitted ? (
				<form onSubmit={handleSubmit} className="max-w-sm mx-auto">
					<div className="flex p-1 bg-white/12 backdrop-blur-md rounded-full border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.1)] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none relative gap-3 shadow hover:bg-white/16 hover:border-white/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.18),0_4px_12px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-500 ease-out hover:scale-[1.02]">
						<Input
							type="email"
							placeholder="Subscribe"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="flex-1 border-0 bg-transparent text-white placeholder:text-white/70 focus-visible:ring-0 focus-visible:ring-offset-0 px-6 py-3 text-base hover:placeholder:text-white/85 transition-all duration-300"
						/>
						<Button
							type="submit"
							className="bg-white/95 text-black hover:bg-slate-500/90 hover:text-white rounded-full px-8 py-3 transition-all duration-300 font-medium shadow-[0_4px_16px_rgba(0,0,0,0.15),0_1px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_6px_20px_rgba(71,85,105,0.3),0_2px_8px_rgba(71,85,105,0.2)] relative before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none hover:before:from-slate-400/20"
						>
							→
						</Button>
					</div>
					<p className="text-xs text-white/60 mt-6 font-light">
						Important information • No spam • Unsubscribe anytime
					</p>
				</form>
			) : (
				<div className="max-w-sm mx-auto">
					<div className="p-8 bg-white/12 backdrop-blur-md rounded-3xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.15),0_4px_16px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.05)] relative before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-white/8 before:via-transparent before:to-black/5 before:pointer-events-none">
						<h3 className="font-serif text-3xl text-white mb-4 font-light">
							Welcome!
						</h3>
						<p className="text-white/85 leading-relaxed">
							Thank you for joining Heritage Roots. Your first newsletter will
							arrive soon with stories from the heartland.
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
