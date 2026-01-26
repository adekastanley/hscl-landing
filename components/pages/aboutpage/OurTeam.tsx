import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { getTeamMembers, type TeamMember } from "@/app/actions/team";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TeamSection() {
	const [team, setTeam] = useState<TeamMember[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchTeam() {
			try {
				const members = await getTeamMembers("team");
				setTeam(members);
			} catch (error) {
				console.error("Failed to fetch team members", error);
			} finally {
				setLoading(false);
			}
		}
		fetchTeam();
	}, []);

	if (loading) {
		return (
			<section id="team" className="scroll-mt-32">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold text-chemonics-navy mb-4">
						Our Team
					</h2>
					<div className="w-20 h-1 bg-chemonics-lime mx-auto mb-6" />
				</div>
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-full space-y-3">
							<Skeleton className="h-[250px] w-full rounded-xl" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-[250px]" />
								<Skeleton className="h-4 w-[200px]" />
							</div>
						</div>
					))}
				</div>
			</section>
		);
	}

	if (team.length === 0) {
		return null;
	}

	return (
		<section id="team" className="scroll-mt-32">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				className="text-center mb-12"
			>
				<h2 className="text-3xl font-bold text-chemonics-navy mb-4">
					Our Team
				</h2>
				<div className="w-20 h-1 bg-chemonics-lime mx-auto mb-6" />
				<p className="text-muted-foreground max-w-2xl mx-auto">
					Meet the talented individuals driving our mission forward.
				</p>
			</motion.div>

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{team.map((member, idx) => (
					<motion.div
						key={member.id}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: idx * 0.05 }}
					>
						<Link href={`/team/${member.id}`} className="block h-full">
							<Card className="h-full overflow-hidden group hover:shadow-lg transition-all duration-300 border-chemonics-navy/5">
								<div className="aspect-4/3 bg-muted relative overflow-hidden">
									<Avatar className="h-full w-full rounded-none">
										<AvatarImage
											src={member.image_url}
											alt={member.name}
											className="object-cover transition-transform duration-500 group-hover:scale-105"
										/>
										<AvatarFallback className="rounded-none text-4xl bg-chemonics-navy/5 text-chemonics-navy/30">
											{member.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
								</div>
								<CardHeader>
									<CardTitle className="text-lg text-chemonics-navy group-hover:text-chemonics-lime transition-colors">
										{member.name}
									</CardTitle>
									<CardDescription className="font-medium text-primary">
										{member.role}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground line-clamp-4">
										{member.bio}
									</p>
								</CardContent>
							</Card>
						</Link>
					</motion.div>
				))}
			</div>
		</section>
	);
}
