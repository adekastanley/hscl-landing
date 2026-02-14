import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/Navbar";

import { SiteFooter } from "@/components/SiteFooter";
import { getItems } from "@/app/actions/content";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title:
		"HSCL | Health Systems Consult Limited - Innovative Health & Development Solutions",
	description:
		"Leading development consulting firm providing strategic health system solutions, data-driven decisions, and sustainable impact across Africa.",
};

import { getNavbarData } from "@/actions/landing/navbar";

// ... existing imports

export default async function LandingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const latestPeopleStories = await getItems("people_story", 1);
	const latestPeopleStory = latestPeopleStories[0];

	const latestSuccessStories = await getItems("story", 1);
	const latestSuccessStory = latestSuccessStories[0];

	const navbarData = await getNavbarData();

	return (
		<>
			<Navbar
				latestPeopleStory={latestPeopleStory}
				latestSuccessStory={latestSuccessStory}
				navbarData={navbarData}
			/>
			{children}
			<SiteFooter />
		</>
	);
}
