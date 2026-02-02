"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
	getCoreValues,
	addCoreValue,
	updateCoreValue,
	deleteCoreValue,
	type CoreValue,
} from "@/actions/landing/about";

export default function ValuesManager() {
	const [values, setValues] = useState<CoreValue[]>([]);
	const [loading, setLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
	});

	const fetchValues = async () => {
		setLoading(true);
		const data = await getCoreValues();
		setValues(data);
		setLoading(false);
	};

	useEffect(() => {
		fetchValues();
	}, []);

	const handleOpenDialog = (value?: CoreValue) => {
		if (value) {
			setEditingId(value.id);
			setFormData({ title: value.title, description: value.description });
		} else {
			setEditingId(null);
			setFormData({ title: "", description: "" });
		}
		setIsDialogOpen(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.title || !formData.description) {
			toast.error("Please fill in all fields");
			return;
		}

		setIsSubmitting(true);
		try {
			let res;
			if (editingId) {
				res = await updateCoreValue(editingId, formData);
			} else {
				res = await addCoreValue(formData);
			}

			if (res.success) {
				toast.success(
					editingId ? "Value updated successfully" : "Value added successfully",
				);
				setIsDialogOpen(false);
				fetchValues();
			} else {
				toast.error(res.error || "Operation failed");
			}
		} catch (error) {
			toast.error("An error occurred");
		}
		setIsSubmitting(false);
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this value?")) return;

		try {
			const res = await deleteCoreValue(id);
			if (res.success) {
				toast.success("Value deleted successfully");
				fetchValues();
			} else {
				toast.error("Failed to delete value");
			}
		} catch (error) {
			toast.error("An error occurred");
		}
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
				<CardTitle>Core Values</CardTitle>
				<Button onClick={() => handleOpenDialog()} size="sm">
					<Plus className="mr-2 h-4 w-4" /> Add Value
				</Button>
			</CardHeader>
			<CardContent>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Title</TableHead>
								<TableHead>Description</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={3} className="text-center h-24">
										Loading...
									</TableCell>
								</TableRow>
							) : values.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={3}
										className="text-center h-24 text-muted-foreground"
									>
										No core values added yet.
									</TableCell>
								</TableRow>
							) : (
								values.map((val) => (
									<TableRow key={val.id}>
										<TableCell className="font-medium align-top whitespace-nowrap">
											{val.title}
										</TableCell>
										<TableCell className="align-top">
											{val.description}
										</TableCell>
										<TableCell className="text-right align-top">
											<div className="flex justify-end gap-2">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleOpenDialog(val)}
												>
													<Pencil className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="text-destructive hover:bg-destructive/10"
													onClick={() => handleDelete(val.id)}
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
				</div>
			</CardContent>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{editingId ? "Edit Value" : "Add Core Value"}
						</DialogTitle>
						<DialogDescription>
							Define a core value that drives your organization.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit} className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								placeholder="e.g. Integrity"
								value={formData.title}
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								placeholder="Brief explanation..."
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								required
							/>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Saving..." : "Save"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</Card>
	);
}
