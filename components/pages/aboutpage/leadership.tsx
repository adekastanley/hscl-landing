import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
export default function LeadershipSection() {
	const leadershipTeam = [
		{
			name: "Dr. Pat Youri",
			role: "Board Chairman",
			bio: "Medical Doctor with specialist qualifications in Paediatrics and Public Health, possessing over three decades of professional experience in Sub-Sahara Africa and the United Kingdom.",
		},
		{
			name: "Dr. Nkata Chuku",
			role: "Founding Partner / Board Secretary",
			bio: "Medical Doctor and Public Health Expert with over 15 years of experience in health systems strengthening, specialized in health economics and policy.",
		},
		{
			name: "Dr. Alozie Ananaba",
			role: "Managing Partner",
			bio: "Qualified Physician and Public Health expert with over 25 years of operational and management experience in Public Health.",
		},
		{
			name: "Pharm. Rosemary Silaa",
			role: "Board Member",
			bio: "Experienced Public Health professional with a degree in Pharmacy, an advanced diploma in Procurement and Supply Chain Management, and an MBA.",
		},
		{
			name: "Victor Kamara",
			role: "Board Member",
			bio: "Development expert with a Public Health background, having worked with various organizations at regional, national, and international levels.",
		},
		{
			name: "Dr. Kiitan Bolajoko",
			role: "Chief Operating Officer",
			bio: "Ensures operational excellence across all HSCL projects and initiatives.",
		},
		{
			name: "Dr. Rotimi Oduloju",
			role: "Director of Public Health",
			bio: "Leads public health strategies and interventions.",
		},
		{
			name: "Ejiofor Nathaniel Uchenna",
			role: "Director of Finance & Admin",
			bio: "Oversees financial health and administrative operations.",
		},
		{
			name: "Precious Nwadire",
			role: "Associate Director, Technicals",
			bio: "Drives technical excellence and project implementation standards.",
		},
	];

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
									{leader.name.charAt(0)}
								</div>
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
								<p className="text-sm text-muted-foreground line-clamp-4">
									{leader.bio}
								</p>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>
		</section>
	);
}
