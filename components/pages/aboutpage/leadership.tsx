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

export default function LeadershipSection() {
	const [leadershipTeam, setLeadershipTeam] = useState<TeamMember[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchLeadership() {
			try {
				const members = await getTeamMembers("leadership");
				setLeadershipTeam(members);
			} catch (error) {
				console.error("Failed to fetch leadership members", error);
			} finally {
				setLoading(false);
			}
		}
		fetchLeadership();
	}, []);

	if (loading) {
		return (
			<section id="leadership" className="scroll-mt-32">
				<div className="text-center mb-12">
					<Skeleton className="h-10 w-64 mx-auto mb-4" />
					<Skeleton className="h-1 w-20 mx-auto mb-6" />
				</div>
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-[250px] w-full rounded-xl" />
					))}
				</div>
			</section>
		);
	}

	if (leadershipTeam.length === 0) return null;

	return (
		<section id="leadership" className="scroll-mt-32">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				className="text-center mb-12"
			>
				<h2 className="text-3xl font-bold text-chemonics-navy mb-4">
					Our Leadership
				</h2>
				<div className="w-20 h-1 bg-chemonics-lime mx-auto mb-6" />
				<p className="text-muted-foreground max-w-2xl mx-auto">
					Guided by a Board of Directors and Management Team with extensive
					experience in international development and public health.
				</p>
			</motion.div>

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{leadershipTeam.map((leader, idx) => (
					<motion.div
						key={leader.id}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: idx * 0.05 }}
					>
						<Link href={`/team/${leader.id}`} className="block h-full">
							<Card className="h-full overflow-hidden group hover:shadow-lg transition-all duration-300 border-chemonics-navy/5">
								<div className="aspect-4/3 bg-muted relative overflow-hidden">
									<Avatar className="h-full w-full rounded-none">
										<AvatarImage
											src={leader.image_url}
											alt={leader.name}
											className="object-cover transition-transform duration-500 group-hover:scale-105"
										/>
										<AvatarFallback className="rounded-none text-4xl bg-chemonics-navy/5 text-chemonics-navy/30">
											{leader.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
								</div>
								<CardHeader>
									<CardTitle className="text-lg text-chemonics-navy group-hover:text-chemonics-lime transition-colors">
										{leader.name}
									</CardTitle>
									<CardDescription className="font-medium text-primary">
										{leader.role}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground line-clamp-3">
										{leader.bio}
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
