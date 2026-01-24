// import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NavHoverContentProps {
	overview: {
		title: string;
		description: string;
	};
	links: {
		title: string;
		items: Array<{ label: string; href: string }>;
	};
	inFocus: {
		title: string;
		image: string;
		articleTitle: string;
		articleDescription: string;
		articleLink: string;
		buttonText?: string;
	};
}

export default function NavHoverContent({
	overview,
	links,
	inFocus,
}: NavHoverContentProps) {
	return (
		<div className="flex rounded-3xlgit  w-[800px] bg-chemonics-lime text-white shadow-xl">
			{/* Left Column - Description */}
			<div className="w-1/3 border-r border-white/20 p-8">
				<h3 className="mb-4 font-montserrat text-2xl font-bold">
					{overview.title}
				</h3>
				<p className="font-montserrat text-sm leading-relaxed text-white/90">
					{overview.description}
				</p>
			</div>

			{/* Middle Column - Links */}
			<div className="w-1/3 border-r border-white/20 p-8">
				<h4 className="mb-6 font-montserrat text-xs font-bold uppercase tracking-wider text-white/70">
					{links.title}
				</h4>
				<ul className="space-y-4">
					{links.items.map((item) => (
						<li
							key={item.label}
							className="border-b border-white/20 pb-2 last:border-0"
						>
							<a
								href={item.href}
								className="block font-montserrat text-sm font-medium hover:text-chemonics-lime transition-colors"
							>
								{item.label}
							</a>
						</li>
					))}
				</ul>
			</div>

			{/* Right Column - In Focus */}
			<div className="w-1/3 p-8">
				<h4 className="mb-6 font-montserrat text-xs font-bold uppercase tracking-wider text-white/70">
					{inFocus.title}
				</h4>
				<div className="group cursor-pointer">
					<div className="mb-4 overflow-hidden rounded-none">
						<img
							src={inFocus.image}
							alt={inFocus.articleTitle}
							className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					</div>
					<h3 className="mb-2 font-montserrat text-lg font-bold leading-tight">
						{inFocus.articleTitle}
					</h3>
					<p className="mb-4 text-xs text-white/80 line-clamp-3">
						{inFocus.articleDescription}
					</p>
					<Button
						variant="outline"
						className="border-white text-chemonics-lime hover:bg-white hover:text-chemonics-teal rounded-full text-xs px-6"
						asChild
					>
						<a href={inFocus.articleLink}>
							{inFocus.buttonText || "Read More"}
						</a>
					</Button>
				</div>
			</div>
		</div>
	);
}
