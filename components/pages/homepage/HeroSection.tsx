import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { useContentful } from "@/hooks/useContentful";

export function HeroSection() {
	// const { data } = useContentful();

	// const heroVideo = data?.items[0].fields.background.fields.file;
	// console.log(heroVideo);
	return (
		<main className="relative h-[85vh]  w-full overflow-hidden bg-chemonics-navy-dark min-h-screen">
			{/* Background Image/Video */}
			<div className="absolute inset-0 z-0">
				<video
					autoPlay
					loop
					muted
					playsInline
					className="h-full w-full object-cover "
				>
					<source
						// src="https://videos.pexels.com/video-files/3191572/3191572-uhd_2560_1440_25fps.mp4"
						// src={heroVideo}
						src="/hlsc.mp4"
						type="video/mp4"
					/>
					Your browser does not support the video tag.
				</video>
				{/* <img
					src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
					alt="Healthcare professionals"
					className="h-full w-full object-cover opacity-80"
				/> */}
			</div>

			{/* Chevron/Arrow Content Container */}

			{/* Chevron/Arrow Background Layer */}
			<div className="absolute inset-0 z-10 hidden md:block pointer-events-none">
				<svg
					viewBox="0 0 1440 800"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="absolute top-0 left-0 w-full h-full object-cover"
					preserveAspectRatio="xMinYMid slice"
				>
					<path
						d="M-10 4 H 610 Q 650 4, 664 41 L 783 353 Q 800 400, 774 442 L 571 762 Q 550 796, 510 796 H -10 Z"
						className="fill-chemonics-navy/95 stroke-white/80"
						strokeWidth="4"
						vectorEffect="non-scaling-stroke"
					/>
				</svg>
			</div>

			{/* Mobile Background Layer (Full width, no clip) */}
			<div className="absolute inset-0 z-10 bg-chemonics-navy/80 md:hidden" />

			{/* Content Container */}
			<div className="relative z-20 container mx-auto h-full flex items-center px-6 md:px-12">
				<div className="max-w-xl py-12 lg:pl-8">
					<h1 className="mb-6 font-montserrat text-2xl font-bold leading-tight text-white md:text-4xl">
						We strengthen <br />
						<span className="text-chemonics-lime">health systems </span> and
						healthcare businesses across Africa through <br />
						<span className="mr-2 text-chemonics-lime">
							strategic business advisory
						</span>
						and{" "}
						<span className=" text-chemonics-lime">implementation support</span>
					</h1>
					{/* <p className="mb-8 max-w-xl font-montserrat text-lg text-gray-200 md:text-xl">

					</p> */}
					<div className="mt-8">
						<Link href="/our-work">
							<Button
								size="lg"
								className="rounded-full bg-chemonics-lime text-chemonics-navy font-bold hover:bg-chemonics-lime-hover"
							>
								Learn More
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
