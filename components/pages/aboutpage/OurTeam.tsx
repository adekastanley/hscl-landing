import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
export default function TeamSection() {
	const team = [
		{
			name: "Team member 1",
			role: "Role of team member",
			bio: "Ream description",
		},
		{
			name: "Team member 2",
			role: "Role of team member",
			bio: "Ream description",
		},
		{
			name: "Team member 3",
			role: "Role of team member",
			bio: "Ream description",
		},
	];

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
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae,
					modi?
				</p>
			</motion.div>

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{team.map((team, idx) => (
					<motion.div
						key={idx}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: idx * 0.05 }}
					>
						<Card className="h-full overflow-hidden group">
							<div className="aspect-[4/3] bg-muted relative overflow-hidden">
								{/* Using a placeholder service since we don't have real photos. In a real app we'd map these to assets. */}
								<div className="absolute inset-0 flex items-center justify-center bg-chemonics-navy/10 text-chemonics-navy/30 font-bold text-4xl">
									{team.name.charAt(0)}
								</div>
							</div>
							<CardHeader>
								<CardTitle className="text-lg text-chemonics-navy group-hover:text-chemonics-lime transition-colors">
									{team.name}
								</CardTitle>
								<CardDescription className="font-medium text-primary">
									{team.role}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground line-clamp-4">
									{team.bio}
								</p>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>
		</section>
	);
}
