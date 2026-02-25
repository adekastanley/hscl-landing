"use client";

import { useEffect, useState } from "react";
import {
	type ActiveNigeriaState,
	getActiveNigeriaStates,
	addActiveNigeriaState,
	updateActiveNigeriaState,
	deleteActiveNigeriaState,
	addProjectToNigeriaState,
	removeProjectFromNigeriaState,
} from "@/actions/landing/nigeriaMap";
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
import { Pencil, Trash2, Plus, X, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const NIGERIA_STATES = [
	"Abia",
	"Adamawa",
	"Akwa Ibom",
	"Anambra",
	"Bauchi",
	"Bayelsa",
	"Benue",
	"Borno",
	"Cross River",
	"Delta",
	"Ebonyi",
	"Edo",
	"Ekiti",
	"Enugu",
	"Federal Capital Territory",
	"Gombe",
	"Imo",
	"Jigawa",
	"Kaduna",
	"Kano",
	"Katsina",
	"Kebbi",
	"Kogi",
	"Kwara",
	"Lagos",
	"Nassarawa",
	"Niger",
	"Ogun",
	"Ondo",
	"Osun",
	"Oyo",
	"Plateau",
	"Rivers",
	"Sokoto",
	"Taraba",
	"Yobe",
	"Zamfara",
];

export default function NigeriaMapManager() {
	const [states, setStates] = useState<ActiveNigeriaState[]>([]);
	const [loading, setLoading] = useState(true);
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [selectedState, setSelectedState] = useState<ActiveNigeriaState | null>(
		null,
	);

	// Form states
	const [name, setName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Project form state
	const [projectTitle, setProjectTitle] = useState("");

	const fetchStates = async () => {
		setLoading(true);
		const data = await getActiveNigeriaStates();
		setStates(data);
		setLoading(false);
	};

	useEffect(() => {
		fetchStates();
	}, []);

	const handleAddState = async () => {
		if (!name) return;
		setIsSubmitting(true);
		const res = await addActiveNigeriaState({ name });
		if (res.success) {
			toast.success("State added successfully");
			setIsAddOpen(false);
			setName("");
			fetchStates();
		} else {
			toast.error("Failed to add state");
		}
		setIsSubmitting(false);
	};

	const handleDeleteState = async (id: string) => {
		if (!confirm("Are you sure you want to delete this state?")) return;
		const res = await deleteActiveNigeriaState(id);
		if (res.success) {
			toast.success("State deleted");
			fetchStates();
		} else {
			toast.error("Failed to delete state");
		}
	};

	const openEdit = (state: ActiveNigeriaState) => {
		setSelectedState(state);
		setIsEditOpen(true);
	};

	const handleAddProject = async () => {
		if (!selectedState || !projectTitle) return;
		const res = await addProjectToNigeriaState(selectedState.id, {
			title: projectTitle,
		});
		if (res.success) {
			toast.success("Project added");
			setProjectTitle("");
			// Refresh states to get updated projects
			fetchStates();
			// Also update selected state specifically for the view
			const updatedStates = await getActiveNigeriaStates();
			const updatedSelected = updatedStates.find(
				(c) => c.id === selectedState.id,
			);
			if (updatedSelected) setSelectedState(updatedSelected);
		} else {
			toast.error("Failed to add project");
		}
	};

	const handleRemoveProject = async (projectId: string) => {
		const res = await removeProjectFromNigeriaState(projectId);
		if (res.success) {
			toast.success("Project removed");
			fetchStates();
			const updatedStates = await getActiveNigeriaStates();
			const updatedSelected = updatedStates.find(
				(c) => c.id === selectedState?.id,
			);
			if (updatedSelected) setSelectedState(updatedSelected);
		} else {
			toast.error("Failed to remove project");
		}
	};

	// Filter available states for add dialog to avoid duplicates
	const availableStates = NIGERIA_STATES.filter(
		(c) => !states.some((existing) => existing.name === c),
	);

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="text-lg font-medium">Active Nigeria States</h3>
					<p className="text-sm text-muted-foreground">
						Manage states highlighted on the Nigeria map and their projects.
					</p>
				</div>
				<Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" /> Add State
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add Active State</DialogTitle>
							<DialogDescription>
								Select a state to be highlighted on the Nigeria map.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="name">State Name</Label>
								<Select value={name} onValueChange={setName}>
									<SelectTrigger>
										<SelectValue placeholder="Select a state" />
									</SelectTrigger>
									<SelectContent className="max-h-[300px]">
										{availableStates.map((c) => (
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
							<Button onClick={handleAddState} disabled={isSubmitting || !name}>
								Add State
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
								<TableHead>State</TableHead>
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
							) : states.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={3}
										className="text-center py-8 text-muted-foreground"
									>
										No active states found.
									</TableCell>
								</TableRow>
							) : (
								states.map((state) => (
									<TableRow key={state.id}>
										<TableCell className="font-medium flex items-center gap-2">
											<MapPin className="h-4 w-4 text-muted-foreground" />
											{state.name}
										</TableCell>
										<TableCell>
											{state.projects?.length || 0} Projects
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => openEdit(state)}
												>
													<Pencil className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="text-destructive"
													onClick={() => handleDeleteState(state.id)}
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
						<DialogTitle>Edit State: {selectedState?.name}</DialogTitle>
						<DialogDescription>
							Manage projects for this state.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-6 py-4">
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<h4 className="text-sm font-semibold">
									Projects in {selectedState?.name}
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
								{selectedState?.projects &&
								selectedState.projects.length > 0 ? (
									<div className="divide-y">
										{selectedState.projects.map((p) => (
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
