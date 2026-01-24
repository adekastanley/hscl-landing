import { TextGradientScroll } from "@/components/ui/scrollingText";
// import { MoveRight } from "lucide-react";

// const sectionOneLinks = [
// 	{
// 		title: "Why We Exist",
// 		link: "#why-we-exist",
// 		icon: "",
// 	},
// 	{
// 		title: "Our Mission",
// 		link: "#our-mission",
// 		icon: "",
// 	},
// 	{
// 		title: "Our Vision",
// 		link: "#our-vision",
// 		icon: "",
// 	},
// ];

export default function SectionOne() {
	const whyWeExist = `At HSCL, our cross-cutting and varied experience in providing solutions provides us 
	with a holistic and deep knowledge of the health and development sector in Africa.`;

	return (
		<section className="text-center min-h-[80vh] justify-center lg:px-[20rem] mx-auto flex-col  flex  w-full  bg-white px-5">
			<div className="flex  w-full  mx-auto  ">
				<div className=" text-black max-w-7xl lg:px-42 mx-auto  h-full">
					<TextGradientScroll
						text={whyWeExist}
						className="max-w-7xl lg:px-42 mx-auto text-center font-sans text-2xl md:text-3xl lg:text-4xl font-light justify-center "
						type="word"
						textOpacity="soft"
					/>
				</div>
				{/* <div className="lg:w-[20vw]  h-full w-full    relative min-h-20 border-t-2 border-chemonics-navy-light  flex-1 bg-red-90">
					<ul className="flex flex-col">
						{sectionOneLinks.map((link, i) => {
							return (
								<li className="text-black flex gap-5 items-center group w-full    lg:min-w-[10rem]">
									<a
										className="group-hover:text-chemonics-lime-hover font-bold text-lg leading-10"
										href={link.link}
										key={i}
									>
										{link.title}
									</a>
									<span className=" group-hover:text-chemonics-lime-hover lg:opacity-25 group-hover:opacity-100 transition-opacity">
										<MoveRight />
									</span>
								</li>
							);
						})}
					</ul>
				
				</div> */}
			</div>
		</section>
	);
}
