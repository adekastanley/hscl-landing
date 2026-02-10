import { getSession } from "@/lib/auth";
import { deleteAdminAction } from "@/app/actions/auth";
import db from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { AddAdminForm } from "@/components/admin/settings/add-admin-form";
import { ChangePasswordForm } from "@/components/admin/settings/change-password-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { revalidatePath } from "next/cache";

export default async function SettingsPage() {
	const session = await getSession();
	const isSuperAdmin = session?.role === "super_admin";

	// Fetch all admins if super admin
	let admins: any[] = [];
	if (isSuperAdmin) {
		const res = await db.execute(
			"SELECT id, name, email, role, created_at FROM admins ORDER BY created_at DESC",
		);
		admins = res.rows;
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
				<p className="text-muted-foreground">
					Manage your account and system preferences.
				</p>
			</div>

			<Tabs defaultValue="account" className="space-y-4">
				<TabsList>
					<TabsTrigger value="account">Account</TabsTrigger>
					{isSuperAdmin && (
						<TabsTrigger value="admins">Manage Admins</TabsTrigger>
					)}
				</TabsList>

				<TabsContent value="account" className="space-y-4">
					<ChangePasswordForm userId={session?.id} />
				</TabsContent>

				{isSuperAdmin && (
					<TabsContent value="admins" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Admins</CardTitle>
								<CardDescription>
									Manage administrators who have access to the dashboard.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="rounded-md border">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Name</TableHead>
												<TableHead>Email</TableHead>
												<TableHead>Role</TableHead>
												<TableHead className="text-right">Actions</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{admins.map((admin) => (
												<TableRow key={admin.id}>
													<TableCell className="font-medium">
														{admin.name}
													</TableCell>
													<TableCell>{admin.email}</TableCell>
													<TableCell>
														<Badge
															variant={
																admin.role === "super_admin"
																	? "default"
																	: "secondary"
															}
														>
															{admin.role === "super_admin"
																? "Super Admin"
																: "Admin"}
														</Badge>
													</TableCell>
													<TableCell className="text-right">
														{admin.id !== session?.id && (
															<form
																action={async () => {
																	"use server";
																	await deleteAdminAction(admin.id);
																}}
															>
																<Button
																	variant="ghost"
																	size="icon"
																	className="text-destructive"
																>
																	<Trash2 className="h-4 w-4" />
																</Button>
															</form>
														)}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</CardContent>
						</Card>

						<AddAdminForm />
					</TabsContent>
				)}
			</Tabs>
		</div>
	);
}
