import {
	MessageCircle,
	MapPin,
	Phone,
	Facebook,
	Twitter,
	Linkedin,
	Instagram,
} from "lucide-react";

export function ContactSection() {
	return (
		<section className="py-20 px-6 bg-white">
			<div className="container mx-auto">
				<div className="overflow-hidden rounded-[3rem] border border-gray-200 bg-white shadow-xl lg:flex">
					{/* Left Column: Contact Info */}
					<div className="p-12 lg:w-5/12 lg:p-16">
						<div className="mb-8">
							<h3 className="mb-6 text-2xl font-bold text-chemonics-navy-dark">
								HSCL
							</h3>
						</div>

						<div className="space-y-8">
							{/* Chat */}
							<div className="flex gap-4">
								<MessageCircle className="h-6 w-6 text-gray-600" />
								<div>
									<h4 className="font-bold text-gray-900">Email us</h4>
									<p className="text-gray-600">
										Our friendly team is here to help.
									</p>
									<a
										href="mailto:info@hscgroup.org"
										className="font-semibold text-gray-900"
									>
										info@hscgroup.org
									</a>
								</div>
							</div>

							{/* Visit */}
							<div className="flex gap-4">
								<MapPin className="h-6 w-6 text-gray-600" />
								<div>
									<h4 className="font-bold text-gray-900">Visit us</h4>
									<p className="text-gray-600">
										Come say hello at our office HQ.
									</p>
									<p className="font-semibold text-gray-900">
										Plot 871 Ojimadu Nwaeze Crescent,
										<br />
										off Olu Awotesu cresent Jabi District,
										<br />
										Abuja, Nigeria.
									</p>
								</div>
							</div>

							{/* Call */}
							<div className="flex gap-4">
								<Phone className="h-6 w-6 text-gray-600" />
								<div>
									<h4 className="font-bold text-gray-900">Call us</h4>
									<p className="text-gray-600">Mon-Fri from 8am to 5pm.</p>
									<a
										href="tel:+2349030250139"
										className="font-semibold text-gray-900"
									>
										+234 903 025 0139
									</a>
								</div>
							</div>
						</div>

						{/* Social Icons */}
						<div className="mt-12 flex gap-4">
							<a href="#" className="text-gray-400 hover:text-gray-600">
								<Facebook className="h-5 w-5" />
							</a>
							<a href="#" className="text-gray-400 hover:text-gray-600">
								<Twitter className="h-5 w-5" />
							</a>
							<a href="#" className="text-gray-400 hover:text-gray-600">
								<Linkedin className="h-5 w-5" />
							</a>
							<a href="#" className="text-gray-400 hover:text-gray-600">
								<Instagram className="h-5 w-5" />
							</a>
						</div>
					</div>

					{/* Right Column: Form */}
					<div className="bg-chemonics-lime p-12 lg:w-7/12 lg:p-16">
						<div className="mb-12">
							<h2 className="mb-4 text-4xl font-bold text-chemonics-navy-dark">
								Partner with us for better health outcomes.
							</h2>
							<p className="text-lg text-chemonics-navy-dark">
								Tell us more about your organization and how we can collaborate.
							</p>
						</div>

						<form className="space-y-6">
							<div>
								<input
									type="text"
									placeholder="Your name"
									className="w-full border-b border-chemonics-navy-dark/20 bg-transparent py-2 text-chemonics-navy-dark placeholder-chemonics-navy-dark/60 outline-none focus:border-chemonics-navy-dark"
								/>
							</div>
							<div>
								<input
									type="email"
									placeholder="you@organization.org"
									className="w-full border-b border-chemonics-navy-dark/20 bg-transparent py-2 text-chemonics-navy-dark placeholder-chemonics-navy-dark/60 outline-none focus:border-chemonics-navy-dark"
								/>
							</div>
							<div>
								<textarea
									rows={2}
									placeholder="Tell us a little about the project..."
									className="w-full resize-none border-b border-chemonics-navy-dark/20 bg-transparent py-2 text-chemonics-navy-dark placeholder-chemonics-navy-dark/60 outline-none focus:border-chemonics-navy-dark"
								/>
							</div>

							<div className="pt-4">
								<p className="mb-4 font-semibold text-chemonics-navy-dark">
									How can we help?
								</p>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<label className="flex items-center gap-3 cursor-pointer">
										<input
											type="checkbox"
											className="h-5 w-5 rounded border-chemonics-navy-dark text-chemonics-navy-dark focus:ring-chemonics-navy-dark"
										/>
										<span className="text-chemonics-navy-dark">
											Health Systems Strengthening
										</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer">
										<input
											type="checkbox"
											className="h-5 w-5 rounded border-chemonics-navy-dark text-chemonics-navy-dark focus:ring-chemonics-navy-dark"
										/>
										<span className="text-chemonics-navy-dark">
											Monitoring & Evaluation
										</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer">
										<input
											type="checkbox"
											className="h-5 w-5 rounded border-chemonics-navy-dark text-chemonics-navy-dark focus:ring-chemonics-navy-dark"
										/>
										<span className="text-chemonics-navy-dark">
											Public Health Policy
										</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer">
										<input
											type="checkbox"
											className="h-5 w-5 rounded border-chemonics-navy-dark text-chemonics-navy-dark focus:ring-chemonics-navy-dark"
										/>
										<span className="text-chemonics-navy-dark">Research</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer">
										<input
											type="checkbox"
											className="h-5 w-5 rounded border-chemonics-navy-dark text-chemonics-navy-dark focus:ring-chemonics-navy-dark"
										/>
										<span className="text-chemonics-navy-dark">Governance</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer">
										<input
											type="checkbox"
											className="h-5 w-5 rounded border-chemonics-navy-dark text-chemonics-navy-dark focus:ring-chemonics-navy-dark"
										/>
										<span className="text-chemonics-navy-dark">Other</span>
									</label>
								</div>
							</div>

							<button
								type="submit"
								className="mt-8 w-full rounded-lg bg-chemonics-navy-dark py-4 font-bold text-white transition-opacity hover:opacity-90"
							>
								Send Message
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
