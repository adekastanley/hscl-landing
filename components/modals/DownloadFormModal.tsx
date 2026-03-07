"use client";

import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "motion/react";
import { IconDownload, IconX, IconCheck } from "@tabler/icons-react";
import { trackResourceDownload } from "@/app/actions/resources";
import { toast } from "sonner";

interface DownloadFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	resourceId: string;
	resourceTitle: string;
	onSuccess: (userData: UserData) => void;
}

export interface UserData {
	fullName: string;
	email: string;
	industry: string;
}

const INDUSTRIES = [
	"Healthcare Provider",
	"Government / Public Sector",
	"Development Partner / NGO",
	"Pharmaceutical / Life Sciences",
	"Health Insurance / Payer",
	"Consulting / Professional Services",
	"Technology / Digital Health",
	"Academic / Research Institution",
];

export function DownloadFormModal({
	isOpen,
	onClose,
	resourceId,
	resourceTitle,
	onSuccess,
}: DownloadFormModalProps) {
	const [formData, setFormData] = useState<UserData>({
		fullName: "",
		email: "",
		industry: "",
	});
	const [status, setStatus] = useState<"idle" | "submitting" | "success">(
		"idle",
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.fullName || !formData.email || !formData.industry) {
			toast.error("Please fill in all fields");
			return;
		}

		setStatus("submitting");
		try {
			const result = await trackResourceDownload({
				resource_id: resourceId,
				full_name: formData.fullName,
				email: formData.email,
				industry: formData.industry,
			});

			if (result.success) {
				setStatus("success");
				// Save to localStorage
				localStorage.setItem("hscl_user_info", JSON.stringify(formData));

				setTimeout(() => {
					onSuccess(formData);
					onClose();
					setStatus("idle");
				}, 1500);
			} else {
				toast.error("Failed to submit form. Please try again.");
				setStatus("idle");
			}
		} catch (error) {
			toast.error("An error occurred. Please try again.");
			setStatus("idle");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-5xl p-0 overflow-hidden border-none bg-white rounded-3xl shadow-2xl">
				<div className="relative flex flex-col md:flex-row min-h-[500px]">
					{/* Left Side: Aesthetic Backdrop */}
					<div className="hidden md:flex md:w-2/5 bg-chemonics-navy p-8 flex-col justify-between relative overflow-hidden">
						<div className="absolute top-0 right-0 w-64 h-64 bg-chemonics-lime/10 rounded-full -mr-32 -mt-32 blur-3xl" />
						<div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-3xl" />

						<div className="relative z-10">
							<div className="w-12 h-12 bg-chemonics-lime rounded-xl flex items-center justify-center mb-6">
								<IconDownload className="text-chemonics-navy" size={24} />
							</div>
							<h3 className="text-white font-montserrat font-bold text-2xl leading-tight">
								Unlock Full Access
							</h3>
						</div>

						<div className="relative z-10">
							<p className="text-gray-400 text-sm leading-relaxed mb-4">
								Gain exclusive insights into {resourceTitle}.
							</p>
							<div className="flex items-center gap-2 text-chemonics-lime text-xs font-bold uppercase tracking-widest">
								<span>HSCL Knowledge Hub</span>
							</div>
						</div>
					</div>

					{/* Right Side: Form */}
					<div className="flex-1 p-8 md:p-12 relative">
						<button
							onClick={onClose}
							className="absolute top-6 right-6 text-gray-400 hover:text-chemonics-navy transition-colors"
						>
							{/* <IconX size={24} /> */}
						</button>

						<AnimatePresence mode="wait">
							{status === "success" ? (
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 1.1 }}
									className="h-full flex flex-col items-center justify-center text-center space-y-4"
								>
									{/* <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
										<IconCheck size={40} stroke={3} />
									</div> */}
									<h2 className="text-2xl font-bold text-chemonics-navy font-montserrat">
										Thank You!
									</h2>
									<p className="text-gray-500">
										Your download is starting now...
									</p>
								</motion.div>
							) : (
								<motion.div
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -20 }}
									className="space-y-8"
								>
									<div>
										<h2 className="text-3xl font-bold text-chemonics-navy font-montserrat mb-2">
											Resource Access
										</h2>
										<p className="text-gray-500 text-sm">
											Please provide your details to continue with the download.
										</p>
									</div>

									<form onSubmit={handleSubmit} className="space-y-6">
										<div className="space-y-2">
											<label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">
												Full Name
											</label>
											<Input
												placeholder="John Doe"
												value={formData.fullName}
												onChange={(e) =>
													setFormData({ ...formData, fullName: e.target.value })
												}
												className="h-14 bg-gray-50 border-none rounded-2xl px-6 focus-visible:ring-2 focus-visible:ring-chemonics-lime text-chemonics-navy font-medium text-lg placeholder:text-gray-300 transition-all"
												required
											/>
										</div>

										<div className="space-y-2">
											<label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">
												Work Email Address
											</label>
											<Input
												type="email"
												placeholder="john@company.com"
												value={formData.email}
												onChange={(e) =>
													setFormData({ ...formData, email: e.target.value })
												}
												className="h-14 bg-gray-50 border-none rounded-2xl px-6 focus-visible:ring-2 focus-visible:ring-chemonics-lime text-chemonics-navy font-medium text-lg placeholder:text-gray-300 transition-all"
												required
											/>
										</div>

										<div className="space-y-2">
											<label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">
												Industry
											</label>
											<Select
												value={formData.industry}
												onValueChange={(val) =>
													setFormData({ ...formData, industry: val })
												}
												required
											>
												<SelectTrigger className="h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-chemonics-lime text-chemonics-navy font-medium text-lg text-left transition-all">
													<SelectValue placeholder="Select your industry" />
												</SelectTrigger>
												<SelectContent className="rounded-2xl border-none shadow-xl bg-white p-2">
													{INDUSTRIES.map((industry) => (
														<SelectItem
															key={industry}
															value={industry}
															className="rounded-xl py-3 focus:bg-chemonics-lime/10 focus:text-chemonics-navy cursor-pointer transition-colors"
														>
															{industry}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<Button
											type="submit"
											disabled={status === "submitting"}
											className="w-full h-16 bg-chemonics-navy hover:bg-black text-white rounded-2xl font-bold text-lg shadow-lg shadow-chemonics-navy/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
										>
											{status === "submitting" ? (
												<div className="flex items-center gap-2">
													<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
													<span>Securing Access...</span>
												</div>
											) : (
												<div className="flex items-center justify-between w-full px-4">
													<span>Download Now</span>
													<IconDownload className="group-hover:translate-y-0.5 transition-transform" />
												</div>
											)}
										</Button>
									</form>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
