interface MissionSectionProps {
	content?: string | null;
}

export function MissionSection({ content }: MissionSectionProps) {
	return (
		<section className="relative h-[600px] overflow-hidden bg-chemonics-navy-dark">
			{/* Background Video/Image Layer */}
			{/* <div
				style={{ backgroundImage: "url(/assets/samg.webp)" }}
				className="absolute inset-0 z-0 opacity-40 bg-fixed bg-no-repeat bg-center  bg-cover"
			></div> */}
			<div
				style={{ backgroundImage: "url(/assets/samg.webp)" }}
				className="absolute inset-0 z-0 opacity-40 bg-no-repeat bg-center bg-cover 
               lg:bg-fixed"
			></div>

			{/* Overlay Content */}
			<div className="relative z-10 flex h-full items-center justify-center px-6">
				<div className="max-w-4xl text-center">
					<div
						className="font-montserrat text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl [&_span]:text-chemonics-lime"
						dangerouslySetInnerHTML={{
							__html:
								content ||
								`We use evidence to strengthen systems, improve decisions, and deliver measurable outcomes.`,
						}}
					/>
				</div>
			</div>
		</section>
	);
}
