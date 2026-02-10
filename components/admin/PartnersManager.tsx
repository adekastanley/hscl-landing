"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { getPartners, createPartner, deletePartner } from "@/actions/partners";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Partner {
	id: string;
	name: string;
	logo_url: string;
	created_at: string;
}

export function PartnersManager() {
	const [partners, setPartners] = useState<Partner[]>([]);
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		name: "",
		logo_url: "",
	});

	const inputFileRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		loadPartners();
	}, []);

	const loadPartners = async () => {
		const data = await getPartners();
		// map the data to match Partner interface if needed, but db returns objects matching schema
		setPartners(data as any as Partner[]);
	};

	const resetForm = () => {
		setFormData({
			name: "",
			logo_url: "",
		});
		if (inputFileRef.current) inputFileRef.current.value = "";
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			let logoUrl = formData.logo_url;

			// Handle File Upload if a file is selected
			if (inputFileRef.current?.files?.length) {
				const file = inputFileRef.current.files[0];
				// Basic validation
				if (file.size > 5 * 1024 * 1024) {
					toast.error("File size too large (max 5MB)");
					setIsLoading(false);
					return;
				}

				const response = await fetch(`/api/upload?filename=${file.name}`, {
					method: "POST",
					body: file,
				});

				if (!response.ok) {
					throw new Error("Upload failed");
				}

				const newBlob = await response.json();
				logoUrl = newBlob.url;
			}

			if (!logoUrl) {
				toast.error("Please upload a logo");
				setIsLoading(false);
				return;
			}

			const formDataToSend = new FormData();
			formDataToSend.append("name", formData.name);
			formDataToSend.append("logo_url", logoUrl);

			const result = await createPartner(formDataToSend);

			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Partner added successfully");
				setIsAddOpen(false);
				resetForm();
				loadPartners();
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to add partner");
		} finally {
			setIsLoading(false);
		}
	};

	const confirmDelete = async (id: string) => {
		setIsLoading(true);
		try {
			await deletePartner(id);
			toast.success("Partner deleted");
			setDeleteId(null);
			loadPartners();
		} catch (error) {
			toast.error("Failed to delete partner");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-lg md:text-2xl font-bold tracking-tight">
						Partners
					</h2>
					<p className="text-muted-foreground text-xs md:text-base">
						Manage your partners and their logos here.
					</p>
				</div>
				<Button
					className="gap-2 bg-chemonics-teal hover:bg-chemonics-teal/90"
					onClick={() => {
						resetForm();
						setIsAddOpen(true);
					}}
				>
					<Plus className="h-4 w-4" /> Add Partner
				</Button>
			</div>

			<div className="border rounded-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Logo</TableHead>
							<TableHead>Name</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{partners.length === 0 ? (
							<TableRow>
								<TableCell colSpan={3} className="h-24 text-center">
									No partners found.
								</TableCell>
							</TableRow>
						) : (
							partners.map((partner) => (
								<TableRow key={partner.id}>
									<TableCell>
										<div className="h-10 w-20 relative flex items-center justify-center bg-gray-100 rounded p-1 dark:bg-gray-800">
											<img
												src={partner.logo_url}
												alt={partner.name}
												className="max-h-full max-w-full object-contain"
											/>
										</div>
									</TableCell>
									<TableCell className="font-medium">{partner.name}</TableCell>
									<TableCell className="text-right">
										<Button
											variant="ghost"
											size="icon"
											className="text-destructive hover:bg-destructive/10"
											onClick={() => setDeleteId(partner.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<Dialog
				open={isAddOpen}
				onOpenChange={(open) => {
					if (!open) setIsAddOpen(false);
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Partner</DialogTitle>
						<DialogDescription>
							Upload the partner's logo and enter their name.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={onSubmit}>
						<div className="grid gap-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="name">Partner Name</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									required
									placeholder="e.g. Acme Corp"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="logo">Logo</Label>
								<div className="flex items-center gap-4">
									{/* Preview logic could go here but skipping for brevity */}
									<Input
										id="logo"
										type="file"
										ref={inputFileRef}
										accept="image/*"
										required
									/>
								</div>
								<p className="text-xs text-muted-foreground">
									Recommended: SVG or PNG with transparent background.
								</p>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Saving..." : "Save Partner"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog
				open={!!deleteId}
				onOpenChange={(open) => !open && setDeleteId(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Partner</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this partner?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteId(null)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() => deleteId && confirmDelete(deleteId)}
							disabled={isLoading}
						>
							{isLoading ? "Deleting..." : "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
