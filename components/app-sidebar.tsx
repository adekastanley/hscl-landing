"use client";

import * as React from "react";
import {
	IconCamera,
	IconChartBar,
	IconDashboard,
	IconDatabase,
	IconFileAi,
	IconFileDescription,
	IconFileWord,
	IconFolder,
	IconHelp,
	IconInnerShadowTop,
	IconListDetails,
	IconReport,
	IconSearch,
	IconSettings,
	IconUsers,
	IconCalendarEvent,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar({
	user,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	user: { name: string; email: string; avatar: string; role?: string };
}) {
	const navMain = [
		{
			title: "Dashboard",
			url: "/admin/dashboard",
			icon: IconDashboard,
		},
		{
			title: "Landing Page",
			url: "/admin/dashboard/landing",
			icon: IconListDetails,
		},
		{
			title: "Careers",
			url: "/admin/dashboard/careers",
			icon: IconChartBar,
		},
		{
			title: "Projects",
			url: "/admin/dashboard/projects",
			icon: IconFolder,
		},
		{
			title: "Team",
			url: "/admin/dashboard/team",
			icon: IconUsers,
		},
		{
			title: "Leadership",
			url: "/admin/dashboard/leadership",
			icon: IconUsers,
		},
		{
			title: "Stories",
			url: "/admin/dashboard/stories",
			icon: IconReport,
		},
		{
			title: "People's Stories",
			url: "/admin/dashboard/people-stories",
			icon: IconReport,
		},
		{
			title: "Events",
			url: "/admin/dashboard/events",
			icon: IconCalendarEvent,
		},
		{
			title: "Partners",
			url: "/admin/dashboard/partners",
			icon: IconUsers,
		},
	];

	const navSecondary = [
		{
			title: "Settings",
			url: "/admin/dashboard/settings",
			icon: IconSettings,
		},
	];

	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<a href="#">
								<IconInnerShadowTop className="!size-5" />
								<span className="text-base font-semibold">HSCL</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMain} />
				<NavSecondary items={navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}
