import { getJobById } from "@/app/actions/careers";
import { JobApplicationForm } from "@/components/careers/JobApplicationForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function JobPage({ params }: PageProps) {
	const { id } = await params;
	const job = await getJobById(id);

	if (!job) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-background pt-24 pb-12">
			<div className="container px-4 md:px-6 max-w-4xl mx-auto space-y-8">
				{/* Back Link */}
				<Link
					href="/careers"
					className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-chemonics-teal transition-colors"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Careers
				</Link>

				{/* Header */}
				<div className="space-y-4">
					<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
						<h1 className="text-3xl md:text-4xl font-bold tracking-tight text-chemonics-navy">
							{job.title}
						</h1>
						{job.status === "closed" && (
							<Badge variant="secondary">Closed</Badge>
						)}
					</div>

					<div className="flex flex-wrap gap-4 text-muted-foreground">
						<div className="flex items-center gap-1.5">
							<MapPin className="h-4 w-4" />
							<span>{job.location}</span>
						</div>
						<div className="flex items-center gap-1.5">
							<Clock className="h-4 w-4" />
							<span>{job.type}</span>
						</div>
						<div className="text-sm">
							Posted {new Date(job.created_at).toLocaleDateString()}
						</div>
					</div>
				</div>

				<Separator />

				{/* Description */}
				<div className="prose dark:prose-invert max-w-none">
					<h3 className="text-xl font-semibold mb-3">About the Role</h3>
					<div className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
						{job.description}
					</div>
				</div>

				<Separator />

				{/* Action */}
				<div className="flex flex-col items-center justify-center space-y-4 py-8 bg-muted/30 rounded-lg">
					<h3 className="text-xl font-semibold">Interested in this role?</h3>
					{job.status === "open" ? (
						<JobApplicationForm jobId={job.id} jobTitle={job.title} />
					) : (
						<Button disabled variant="outline">
							Positions Closed
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
