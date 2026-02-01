"use client";

import { useEffect, useState } from "react";
import {
	type ActiveCountry,
	getActiveCountries,
	addActiveCountry,
	updateActiveCountry,
	deleteActiveCountry,
	addProjectToCountry,
	removeProjectFromCountry,
} from "@/actions/landing/map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VALID_COUNTRIES } from "@/lib/constants";

export default function MapManager() {
	const [countries, setCountries] = useState<ActiveCountry[]>([]);
	const [loading, setLoading] = useState(true);
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState<ActiveCountry | null>(
		null,
	);

	// Form states
	const [name, setName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Project form state
	const [projectTitle, setProjectTitle] = useState("");

	const fetchCountries = async () => {
		setLoading(true);
		const data = await getActiveCountries();
		setCountries(data);
		setLoading(false);
	};

	useEffect(() => {
		fetchCountries();
	}, []);

	const handleAddCountry = async () => {
		if (!name) return;
		setIsSubmitting(true);
		const res = await addActiveCountry({ name });
		if (res.success) {
			toast.success("Country added successfully");
			setIsAddOpen(false);
			setName("");
			fetchCountries();
		} else {
			toast.error("Failed to add country");
		}
		setIsSubmitting(false);
	};

	const handleDeleteCountry = async (id: string) => {
		if (!confirm("Are you sure you want to delete this country?")) return;
		const res = await deleteActiveCountry(id);
		if (res.success) {
			toast.success("Country deleted");
			fetchCountries();
		} else {
			toast.error("Failed to delete country");
		}
	};

	const openEdit = (country: ActiveCountry) => {
		setSelectedCountry(country);
		setIsEditOpen(true);
	};

	const handleAddProject = async () => {
		if (!selectedCountry || !projectTitle) return;
		const res = await addProjectToCountry(selectedCountry.id, {
			title: projectTitle,
		});
		if (res.success) {
			toast.success("Project added");
			setProjectTitle("");
			// Refresh countries to get updated projects
			fetchCountries();
			// Also update selected country specifically for the view
			const updatedCountries = await getActiveCountries();
			const updatedSelected = updatedCountries.find(
				(c) => c.id === selectedCountry.id,
			);
			if (updatedSelected) setSelectedCountry(updatedSelected);
		} else {
			toast.error("Failed to add project");
		}
	};

	const handleRemoveProject = async (projectId: string) => {
		const res = await removeProjectFromCountry(projectId);
		if (res.success) {
			toast.success("Project removed");
			fetchCountries();
			const updatedCountries = await getActiveCountries();
			const updatedSelected = updatedCountries.find(
				(c) => c.id === selectedCountry?.id,
			);
			if (updatedSelected) setSelectedCountry(updatedSelected);
		} else {
			toast.error("Failed to remove project");
		}
	};

	// Filter available countries for add dialog to avoid duplicates
	const availableCountries = VALID_COUNTRIES.filter(
		(c) => !countries.some((existing) => existing.name === c),
	);

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h3 className="text-lg font-medium">Active Countries</h3>
					<p className="text-sm text-muted-foreground">
						Manage countries highlighted on the map and their projects.
					</p>
				</div>
				<Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" /> Add Country
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add Active Country</DialogTitle>
							<DialogDescription>
								Select a country to be highlighted on the landing page map.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="name">Country Name</Label>
								<Select value={name} onValueChange={setName}>
									<SelectTrigger>
										<SelectValue placeholder="Select a country" />
									</SelectTrigger>
									<SelectContent className="max-h-[300px]">
										{availableCountries.map((c) => (
											<SelectItem key={c} value={c}>
												{c}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={() => setIsAddOpen(false)}>
								Cancel
							</Button>
							<Button
								onClick={handleAddCountry}
								disabled={isSubmitting || !name}
							>
								Add Country
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Country</TableHead>
								<TableHead>Projects</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={3} className="text-center py-8">
										Loading...
									</TableCell>
								</TableRow>
							) : countries.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={3}
										className="text-center py-8 text-muted-foreground"
									>
										No active countries found.
									</TableCell>
								</TableRow>
							) : (
								countries.map((country) => (
									<TableRow key={country.id}>
										<TableCell className="font-medium flex items-center gap-2">
											<Globe className="h-4 w-4 text-muted-foreground" />
											{country.name}
										</TableCell>
										<TableCell>
											{country.projects?.length || 0} Projects
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => openEdit(country)}
												>
													<Pencil className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="text-destructive"
													onClick={() => handleDeleteCountry(country.id)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Edit Dialog */}
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Edit Country: {selectedCountry?.name}</DialogTitle>
						<DialogDescription>
							Manage projects for this country.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-6 py-4">
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<h4 className="text-sm font-semibold">
									Projects in {selectedCountry?.name}
								</h4>
							</div>

							<div className="flex gap-2 items-end">
								<div className="grid gap-2 flex-1">
									<Label htmlFor="proj-title" className="text-xs">
										Project Title
									</Label>
									<Input
										id="proj-title"
										value={projectTitle}
										onChange={(e) => setProjectTitle(e.target.value)}
										placeholder="Project Name"
									/>
								</div>
								<Button onClick={handleAddProject} size="sm">
									<Plus className="h-4 w-4" />
								</Button>
							</div>

							<div className="rounded-md border">
								{selectedCountry?.projects &&
								selectedCountry.projects.length > 0 ? (
									<div className="divide-y">
										{selectedCountry.projects.map((p) => (
											<div
												key={p.id}
												className="p-3 flex justify-between items-center text-sm"
											>
												<div className="font-medium">{p.title}</div>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleRemoveProject(p.id)}
													className="text-destructive h-8 w-8 p-0"
												>
													<X className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>
								) : (
									<div className="p-4 text-center text-sm text-muted-foreground">
										No projects added yet.
									</div>
								)}
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
