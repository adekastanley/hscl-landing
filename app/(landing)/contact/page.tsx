"use client";

import { motion } from "motion/react";
import {
	Facebook,
	Twitter,
	Linkedin,
	Instagram,
	Mail,
	Phone,
	MapPin,
} from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export default function ContactPage() {
	return (
		<main className="min-h-screen bg-white pt-24 pb-12 px-6 font-sans">
			<div className="container mx-auto max-w-7xl">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="mb-16"
				>
					<h1 className="text-6xl md:text-9xl font-bold font-montserrat tracking-tight text-chemonics-navy leading-none mb-6">
						Contact <span className="text-chemonics-lime">Us</span>
					</h1>
				</motion.div>

				<div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
					{/* Contact Form Section */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="space-y-8"
					>
						<div>
							<h2 className="text-xl font-semibold mb-8 text-gray-800">
								Send a Message
							</h2>
							<ContactForm theme="light" />
						</div>
					</motion.div>

					{/* Contact Details Section */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="flex flex-col justify-between h-full space-y-12 lg:space-y-0"
					>
						<div>
							<h2 className="text-xl font-semibold mb-8 text-gray-800">
								Contact Info
							</h2>
							<div className="grid gap-8">
								<div className="space-y-1">
									<p className="text-sm text-gray-500 uppercase tracking-wider">
										Email
									</p>
									<a
										href="mailto:info@hscgroup.org"
										className="text-2xl md:text-3xl font-bold text-chemonics-navy hover:text-chemonics-lime transition-colors"
									>
										info@hscgroup.org
									</a>
								</div>
								<div className="space-y-1">
									<p className="text-sm text-gray-500 uppercase tracking-wider">
										Phone
									</p>
									<a
										href="tel:+2349030250139"
										className="text-2xl md:text-3xl font-bold text-chemonics-navy hover:text-chemonics-lime transition-colors"
									>
										(+234) 903 025 0139
									</a>
								</div>
								<div className="space-y-1">
									<p className="text-sm text-gray-500 uppercase tracking-wider">
										Address
									</p>
									<p className="text-lg text-gray-800 leading-relaxed max-w-sm">
										Plot 871 Ojimadu Nwaeze Crescent,
										<br />
										off Olu Awotesu Crescent, Jabi District,
										<br />
										Abuja, Nigeria.
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-4 pt-12 lg:pt-0">
							<div className="flex gap-6 items-center">
								<p className="text-sm font-medium text-gray-500">Follow Us</p>
								<div className="flex gap-4">
									<a
										href="#"
										className="p-2 bg-gray-100 rounded-full text-chemonics-navy hover:bg-chemonics-navy hover:text-white transition-all"
									>
										<Facebook size={20} />
									</a>
									<a
										href="#"
										className="p-2 bg-gray-100 rounded-full text-chemonics-navy hover:bg-chemonics-navy hover:text-white transition-all"
									>
										<Twitter size={20} />
									</a>
									<a
										href="#"
										className="p-2 bg-gray-100 rounded-full text-chemonics-navy hover:bg-chemonics-navy hover:text-white transition-all"
									>
										<Linkedin size={20} />
									</a>
									<a
										href="#"
										className="p-2 bg-gray-100 rounded-full text-chemonics-navy hover:bg-chemonics-navy hover:text-white transition-all"
									>
										<Instagram size={20} />
									</a>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4 text-xs text-gray-400 pt-4 border-t border-gray-100">
								<p>© {new Date().getFullYear()} HSCL. All rights reserved.</p>
								<p className="text-right">Privacy Policy</p>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</main>
	);
}
