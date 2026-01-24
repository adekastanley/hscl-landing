import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
export default function CoreValues() {
	const coreValues = [
		{
			title: "Excellence",
			description:
				"We strive to give our clients the very best work, ensuring that we infuse the work that we do with a sincere passion for sustainable solutions to our clients' needs.",
		},
		{
			title: "Integrity",
			description:
				"We ensure that you get value for money even as we maintain the highest levels of ethics in our work.",
		},
		{
			title: "Inclusiveness",
			description:
				"At HSCL, clients from all over the world are welcome. We have a rich and diverse workforce. We work with all and we work for all.",
		},
		{
			title: "Efficiency",
			description:
				"You can expect that we will deliver when we should, using the best means possible.",
		},
		{
			title: "Learning",
			description:
				"HSCL is a hub of innovative minds where we are able to constantly raise the bar to meet the needs of an ever-changing world.",
		},
	];
	return (
		<section id="values" className="scroll-mt-32">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				className="text-center mb-12"
			>
				<h2 className="text-3xl font-bold text-chemonics-navy mb-4">
					Our Core Values
				</h2>
				<div className="w-20 h-1 bg-chemonics-lime mx-auto" />
			</motion.div>

			<div className="grid md:grid-cols-3 gap-6">
				{coreValues.map((value, idx) => (
					<motion.div
						key={idx}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: idx * 0.1 }}
					>
						<Card className="h-full hover:shadow-lg transition-shadow border-t-4 border-t-chemonics-lime">
							<CardHeader>
								<CardTitle className="text-xl text-chemonics-navy">
									{value.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">{value.description}</p>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>
		</section>
	);
}
