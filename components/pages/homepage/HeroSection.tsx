import { Button } from "@/components/ui/button";
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

			<div className="relative  z-10 flex h-full w-full items-center max-sm:from-chemonics-navy/10 bg-linear-to-r from-chemonics-navy/95 to-chemonics-navy/90 md:w-[65%] md:[clip-path:polygon(0_0,_100%_0,_85%_50%,_100%_100%,_0_100%)] lg:w-[55%]">
				<div className=" px-6 py-12 md:px-16 lg:px-24">
					<h1 className="mb-6 font-montserrat text-5xl font-bold leading-tight text-white md:text-7xl">
						Providing Innovative <br />
						<span className="text-chemonics-lime">Solutions</span> for Health &
						Development
					</h1>
					<p className="mb-8 max-w-2xl font-montserrat text-lg text-gray-200 md:text-xl">
						Designing Health Systems That Work for People & Places
					</p>
					<div className="mt-8">
						<Button
							size="lg"
							className="rounded-full bg-chemonics-lime text-chemonics-navy font-bold hover:bg-chemonics-lime-hover"
						>
							Learn More
						</Button>
					</div>
				</div>
			</div>
		</main>
	);
}
