"use client";
import NavLink from "next/link";

import { Logo } from "./logo";
import NewsLetterButton from "./ui/newsletter";
import {
	IconBrandInstagram,
	IconBrandFacebook,
	IconBrandX,
	IconBrandLinkedin,
} from "@tabler/icons-react";
// import { Logo } from "./logo";

const navLinks = {
	siteLinks: [
		{
			title: "Home",
			link: "/",
		},
		{
			title: "Who We Are",
			link: "/about",
		},
		{
			title: "What We Do",
			link: "/our-work",
		},
		{
			title: "Our Impact",
			link: "/projects",
		},
		{
			title: "Careers",
			link: "/careers",
		},
	],
};
export function SiteFooter() {
	return (
		<footer className="bg-chemonics-navy-dark px-6 py-16 text-white">
			<div className="container mx-auto">
				<div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
					{/* Brand Column */}
					<div className="space-y-4">
						<div className="flex items-center gap-2 mb-4">
							<Logo />
						</div>
						<p className="font-montserrat text-sm text-gray-400">
							Health Systems Consult Limited (HSCL). Providing innovative
							solutions for health and development in Africa.
						</p>
						<NewsLetterButton />
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="mb-4 font-montserrat text-lg font-bold text-chemonics-lime">
							Quick Links
						</h3>
						<ul className="space-y-2 text-sm text-gray-300">
							{navLinks.siteLinks.map((link, index) => (
								<li key={index}>
									<NavLink href={link.link}>{link.title}</NavLink>
								</li>
							))}
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className="mb-4 font-montserrat text-lg font-bold text-chemonics-lime">
							Contact
						</h3>
						<ul className="space-y-4 text-sm text-gray-300">
							<ul className="space-y-4">
								<li>
									<span className="block font-semibold text-white">
										Office:
									</span>
								</li>
								<li>
									<h6>
										Plot 871 Ojimadu Nwaeze Crescent, off Olu Awotesu cresent
										Jabi
									</h6>
									<div>
										<span className="block font-semibold text-white">
											Phone:
										</span>
										<p>+234 903 025 0139</p>
										<span className="block font-semibold text-white">
											Email:
										</span>
										<p> info@hscgroup.org</p>
									</div>
								</li>
								<li>
									<h6>Plot 104 Mountain Cut Freetown, Sierra Leone.</h6>
									<div>
										<span className="block font-semibold text-white">
											Phone:
										</span>
										<p>+23230366991, +23278180445</p>
									</div>
								</li>
								<li>
									<h6>
										Plot No 207/208 Kajenge Road, Kinondoni Municipality, Dar Es
										Salaam Tanzania.
									</h6>
									<div>
										<span className="block font-semibold text-white">
											Phone:
										</span>
										<p>+255758770077, +255784510994</p>
									</div>
								</li>
								<li>
									<h6>Plot No. 2 Off Vubu Road, Emmasdale, Lusaka Zambia.</h6>
									<div>
										<span className="block font-semibold text-white">
											Phone:
										</span>
										<p>+27828027302</p>
									</div>
								</li>
							</ul>
						</ul>
					</div>

					{/* Legal / Social */}
					<div>
						<h3 className="mb-4 font-montserrat text-lg font-bold text-chemonics-lime">
							Follow Us
						</h3>
						<div className="flex gap-4">
							<a
								href="https://web.facebook.com/HsclNigeria/"
								target="_blank"
								rel="noopener noreferrer"
								className="flex h-10 w-10 items-center justify-center bg-white/10 text-white transition-colors hover:bg-chemonics-lime hover:text-chemonics-navy"
							>
								<IconBrandFacebook className="h-5 w-5" />
							</a>
							<a
								href="https://x.com/HSCLimited/"
								target="_blank"
								rel="noopener noreferrer"
								className="flex h-10 w-10 items-center justify-center bg-white/10 text-white transition-colors hover:bg-chemonics-lime hover:text-chemonics-navy"
							>
								<IconBrandX className="h-5 w-5" />
							</a>
							<a
								href="https://www.linkedin.com/company/health-systems-consult-limited/"
								target="_blank"
								rel="noopener noreferrer"
								className="flex h-10 w-10 items-center justify-center bg-white/10 text-white transition-colors hover:bg-chemonics-lime hover:text-chemonics-navy"
							>
								<IconBrandLinkedin className="h-5 w-5" />
							</a>
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="flex h-10 w-10 items-center justify-center bg-white/10 text-white transition-colors hover:bg-chemonics-lime hover:text-chemonics-navy"
							>
								<IconBrandInstagram className="h-5 w-5" />
							</a>
						</div>
					</div>
				</div>

				<div className="mt-16 border-t border-white/10 pt-8 text-center text-xs text-gray-500">
					<p>© {new Date().getFullYear()} HSCL. All Rights Reserved.</p>
				</div>
			</div>
		</footer>
	);
}
