import Link from "next/link";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getJobListings } from "@/app/actions/careers";

export const dynamic = "force-dynamic";

export default async function CareersPage() {
	const jobs = await getJobListings(true);

	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-muted/30">
				<div className="container px-4 md:px-6">
					<div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
						<Badge
							variant="secondary"
							className="px-4 py-2 rounded-full text-sm font-medium"
						>
							We're hiring!
						</Badge>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-chemonics-navy">
							Be part of our mission
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
							We're looking for passionate people to join us on our mission. We
							value flat hierarchies, clear communication, and full ownership
							and responsibility.
						</p>
					</div>
				</div>
			</section>

			{/* Talent Pipeline / General Application */}
			<section className="py-12 bg-white">
				<div className="container px-4 md:px-6 max-w-5xl mx-auto">
					<Card className="border-chemonics-teal/20 bg-chemonics-teal/5 shadow-md">
						<CardHeader>
							<CardTitle className="text-2xl font-bold text-chemonics-navy">
								Don't see the right role?
							</CardTitle>
							<CardDescription className="text-base text-muted-foreground">
								Register to be considered for future opportunities. We are
								always looking for talented individuals to join our talent
								pipeline.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								asChild
								size="lg"
								className="bg-chemonics-teal hover:bg-chemonics-teal/90 text-white font-semibold"
							>
								<Link href="/careers/general">
									Register for Future Opportunities
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Job Listings */}
			<section className="py-12 md:py-20">
				<div className="container px-4 md:px-6 max-w-5xl mx-auto">
					<div className="flex flex-col space-y-8">
						<div className="flex flex-col space-y-2">
							<h2 className="text-3xl font-bold tracking-tight text-chemonics-navy">
								Open Positions
							</h2>
							<Separator />
						</div>

						<div className="grid gap-6">
							{jobs.length === 0 ? (
								<div className="text-center py-12 text-muted-foreground">
									No open positions at the moment. Please check back later.
								</div>
							) : (
								jobs.map((job) => (
									<div
										key={job.id}
										className="group relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 hover:border-chemonics-teal/30"
									>
										<div className="space-y-3">
											<div className="space-y-1">
												<h3 className="text-xl font-semibold text-chemonics-navy group-hover:text-chemonics-teal transition-colors">
													{job.title}
												</h3>
												{/* <p className="text-muted-foreground">{job.department}</p> */}
											</div>
											<div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
												<div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
													<MapPin className="h-3.5 w-3.5" />
													<span>{job.location}</span>
												</div>
												<div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
													<Clock className="h-3.5 w-3.5" />
													<span>{job.type}</span>
												</div>
											</div>
										</div>

										<div className="flex items-center">
											<Button
												asChild
												variant="ghost"
												className="gap-2 group-hover:bg-chemonics-teal/10 group-hover:text-chemonics-teal"
											>
												<Link href={`/careers/${job.id}`}>
													View Details
													<ArrowUpRight className="h-4 w-4" />
												</Link>
											</Button>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
