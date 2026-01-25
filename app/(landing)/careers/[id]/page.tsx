import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { JOBS } from "@/lib/dummy-jobs";
import { JobApplicationForm } from "@/components/JobApplicationForm";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function JobPage({ params }: PageProps) {
	const { id } = await params;

	let job;

	if (id === "general-application") {
		job = {
			id: "general-application",
			title: "General Application",
			department: "Talent Pipeline",
			location: "Remote",
			type: "Always Open",
			description:
				"Don't see a role that fits your profile? We are always looking for exceptional talent to join our team. Register your interest here to be considered for future opportunities.",
			requirements: [
				"Passion for our mission",
				"Strong professional background",
				"Desire to make an impact",
			],
		};
	} else {
		job = JOBS.find((j) => j.id === id);
	}

	if (!job) {
		notFound();
	}

	return (
		<div className="flex flex-col min-h-screen bg-muted/30">
			<div className="container px-4 md:px-6 py-12 md:py-16 max-w-6xl mx-auto">
				<div className="mb-8">
					<Button
						asChild
						variant="ghost"
						className="gap-2 pl-0 hover:pl-2 transition-all"
					>
						<Link href="/careers">
							<ArrowLeft className="h-4 w-4" />
							Back to Open Positions
						</Link>
					</Button>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Job Details Column */}
					<div className="lg:col-span-2 space-y-8">
						<div className="space-y-4">
							<h1 className="text-3xl md:text-4xl font-bold text-chemonics-navy">
								{job.title}
							</h1>
							<div className="flex flex-wrap gap-3">
								<Badge variant="secondary" className="gap-1 px-3 py-1">
									<Briefcase className="h-3.5 w-3.5" />
									{job.department}
								</Badge>
								<Badge variant="outline" className="gap-1 px-3 py-1 bg-white">
									<MapPin className="h-3.5 w-3.5" />
									{job.location}
								</Badge>
								<Badge variant="outline" className="gap-1 px-3 py-1 bg-white">
									<Clock className="h-3.5 w-3.5" />
									{job.type}
								</Badge>
							</div>
						</div>

						<Separator />

						<div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
							<div className="space-y-4">
								<h2 className="text-xl font-semibold text-foreground">
									About the Role
								</h2>
								<p>{job.description}</p>
							</div>

							{job.requirements && job.requirements.length > 0 && (
								<div className="space-y-4">
									<h2 className="text-xl font-semibold text-foreground">
										Requirements
									</h2>
									<ul className="list-disc pl-5 space-y-2">
										{job.requirements.map((req, index) => (
											<li key={index}>{req}</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>

					{/* Application Form Column */}
					<div className="lg:col-span-1">
						<div className="sticky top-24">
							<JobApplicationForm jobTitle={job.title} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
