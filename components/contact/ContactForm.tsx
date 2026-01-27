"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ContactFormProps {
	theme?: "light" | "dark";
	className?: string;
}

export function ContactForm({ theme = "light", className }: ContactFormProps) {
	const isDark = theme === "dark";

	// Styles based on theme
	const labelClass = cn(
		"text-sm font-medium uppercase tracking-wider",
		isDark ? "text-gray-300" : "text-gray-500",
	);

	const inputClass = cn(
		"border-0 border-b rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-chemonics-lime text-lg bg-transparent transition-colors",
		isDark
			? "border-gray-600 text-white placeholder:text-gray-500 hover:border-gray-500"
			: "border-gray-300 text-gray-900 placeholder:text-gray-300 hover:border-gray-400",
	);

	const selectTriggerClass = cn(
		"border-0 border-b rounded-none px-0 py-2 focus:ring-0 focus:border-chemonics-lime text-lg font-normal shadow-none bg-transparent transition-colors",
		isDark
			? "border-gray-600 text-gray-500 hover:border-gray-500"
			: "border-gray-300 text-gray-500 hover:border-gray-400",
	);

	return (
		<div className={className}>
			<form className="space-y-8">
				<div className="grid md:grid-cols-2 gap-8">
					<div className="space-y-2">
						<label className={labelClass}>Name (Required)</label>
						<Input placeholder="First Name" className={inputClass} />
					</div>
					<div className="space-y-2">
						<label className={cn(labelClass, "opacity-0 md:opacity-100")}>
							Last Name
						</label>
						<Input placeholder="Last Name" className={inputClass} />
					</div>
				</div>

				<div className="space-y-2">
					<label className={labelClass}>Email (Required)</label>
					<Input
						type="email"
						placeholder="you@company.com"
						className={inputClass}
					/>
				</div>

				<div className="space-y-2">
					<label className={labelClass}>Service Interest</label>
					<Select>
						<SelectTrigger className={selectTriggerClass}>
							<SelectValue placeholder="Select a service..." />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="health-systems">
								Health Systems Strengthening
							</SelectItem>
							<SelectItem value="monitoring">
								Monitoring & Evaluation
							</SelectItem>
							<SelectItem value="public-health">
								Public Health Policy
							</SelectItem>
							<SelectItem value="research">Research</SelectItem>
							<SelectItem value="other">Other</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<label className={labelClass}>Project Description</label>
					<Textarea
						placeholder="Tell us about your project..."
						className={cn(inputClass, "resize-none min-h-[100px]")}
					/>
				</div>

				<div className="pt-4">
					<Button
						size="lg"
						className={cn(
							"rounded-full px-10 py-6 text-lg font-bold transition-all w-full md:w-auto",
							isDark
								? "bg-chemonics-lime text-chemonics-navy hover:bg-chemonics-lime-hover"
								: "bg-chemonics-navy text-white hover:bg-chemonics-navy-light",
						)}
					>
						Submit Message
					</Button>
				</div>
			</form>
		</div>
	);
}
