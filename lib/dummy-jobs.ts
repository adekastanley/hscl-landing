export interface Job {
	id: string;
	title: string;
	department: string;
	location: string;
	type: string;
	description: string;
	requirements: string[];
}

export const JOBS: Job[] = [
	{
		id: "product-designer",
		title: "Product Designer",
		department: "Design",
		location: "Remote",
		type: "Full-time",
		description:
			"We are looking for a mid-level product designer to join our team. You will be responsible for designing user-centric interfaces and experiences...",
		requirements: [
			"3+ years of experience in product design",
			"Proficiency in Figma and prototyping tools",
			"Strong understanding of UI/UX principles",
			"Experience working in an agile environment",
		],
	},
	{
		id: "engineering-manager",
		title: "Engineering Manager",
		department: "Engineering",
		location: "Remote",
		type: "Full-time",
		description:
			"We are looking for an experienced engineering manager to lead our development team...",
		requirements: [
			"5+ years of experience in software engineering",
			"2+ years of experience in management",
			"Strong leadership and communication skills",
			"Experience with React and Node.js",
		],
	},
	{
		id: "customer-success-manager",
		title: "Customer Success Manager",
		department: "Customer Success",
		location: "Remote",
		type: "Full-time",
		description:
			"We are looking for a customer success manager to join our team and help our customers succeed...",
		requirements: [
			"3+ years of experience in customer success",
			"Strong communication and problem-solving skills",
			"Experience with CRM software",
			"Ability to work in a fast-paced environment",
		],
	},
	{
		id: "account-executive",
		title: "Account Executive",
		department: "Sales",
		location: "Remote",
		type: "Full-time",
		description:
			"We are looking for an account executive to join our sales team...",
		requirements: [
			"3+ years of experience in sales",
			"Proven track record of exceeding quotas",
			"Strong negotiation and presentation skills",
			"Experience with Salesforce",
		],
	},
	{
		id: "seo-marketing-manager",
		title: "SEO Marketing Manager",
		department: "Marketing",
		location: "Remote",
		type: "Full-time",
		description:
			"We are looking for an experienced SEO marketing manager to join our team...",
		requirements: [
			"3+ years of experience in SEO",
			"Strong understanding of SEO best practices",
			"Experience with Google Analytics and Search Console",
			"Ability to create and execute SEO strategies",
		],
	},
];
