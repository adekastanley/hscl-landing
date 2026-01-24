export function MissionSection() {
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
					<h2 className="font-montserrat text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
						Turning{" "}
						<span className="text-chemonics-lime">Data into Decisions</span> and
						Decisions into <span className="text-chemonics-lime">Impact</span>
					</h2>
				</div>
			</div>
		</section>
	);
}
