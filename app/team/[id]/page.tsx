import { getTeamMemberById } from "@/app/actions/team";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function TeamMemberPage({ params }: PageProps) {
	// Await params first as per Next.js 15+ requirements
	const { id } = await params;
	const member = await getTeamMemberById(id);

	if (!member) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-background p-6 md:p-12">
			<div className="mx-auto max-w-4xl space-y-8">
				{/* Back Button */}
				<Link
					href="/about"
					className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Team
				</Link>

				<div className="grid gap-8 md:grid-cols-[300px_1fr]">
					{/* Sidebar / Photo */}
					<div className="space-y-6">
						<div className="aspect-square relative overflow-hidden rounded-xl border bg-muted">
							<Avatar className="h-full w-full rounded-xl">
								<AvatarImage
									src={member.image_url}
									alt={member.name}
									className="object-cover"
								/>
								<AvatarFallback className="text-4xl">
									{member.name.charAt(0)}
								</AvatarFallback>
							</Avatar>
						</div>

						{/* Contact Links */}
						{(member.linkedin || member.twitter || member.email) && (
							<Card>
								<CardHeader>
									<h3 className="font-semibold">Connect</h3>
								</CardHeader>
								<CardContent className="space-y-2">
									{member.linkedin && (
										<Button
											variant="outline"
											className="w-full justify-start"
											asChild
										>
											<Link
												href={member.linkedin}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Linkedin className="mr-2 h-4 w-4" />
												LinkedIn
											</Link>
										</Button>
									)}
									{member.twitter && (
										<Button
											variant="outline"
											className="w-full justify-start"
											asChild
										>
											<Link
												href={member.twitter}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Twitter className="mr-2 h-4 w-4" />
												Twitter
											</Link>
										</Button>
									)}
									{member.email && (
										<Button
											variant="outline"
											className="w-full justify-start"
											asChild
										>
											<Link href={`mailto:${member.email}`}>
												<Mail className="mr-2 h-4 w-4" />
												Email
											</Link>
										</Button>
									)}
								</CardContent>
							</Card>
						)}
					</div>

					{/* Main Content */}
					<div className="space-y-6">
						<div>
							<h1 className="text-4xl font-bold tracking-tight">
								{member.name}
							</h1>
							<p className="text-xl text-muted-foreground mt-2">
								{member.role}
							</p>
							<div className="mt-4 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 capitalize">
								{member.category} Member
							</div>
						</div>

						<div className="prose dark:prose-invert max-w-none">
							<h3 className="text-lg font-semibold mb-2">Biography</h3>
							<p className="whitespace-pre-wrap leading-relaxed">
								{member.bio}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
