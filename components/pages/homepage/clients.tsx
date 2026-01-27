import React from "react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

const logoCLoud = [
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/bmgf-logo.jpg",
		name: "Bill & Melinda Gates Foundation",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/usaid.jpg",
		name: "USAID",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/Department_for_Intenational_Development.jpg",
		name: "Department for International Development",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/TheGlobalFund.jpg",
		name: "The Global Fund",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/Afican_Risk_Capacity.png",
		name: "African Risk Capacity",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/Gavi.jpg",
		name: "Gavi",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/Malaria.jpg",
		name: "Malaria Consortium",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/CDC.jpg",
		name: "CDC",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/Federal_ministry_of_health_Nigeria.jpg",
		name: "Federal Ministry of Health Nigeria",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/Clinton_Health_Access_Initiative.jpg",
		name: "Clinton Health Access Initiative",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/Cristian_aid.jpg",
		name: "Christian Aid",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/Results_for_development.jpg",
		name: "Results for Development",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/Caritas.jpg",
		name: "Caritas Nigeria",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/HP.jpg",
		name: "Health Policy Plus",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/Intra_Health.jpg",
		name: "IntraHealth International",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/Maternal_and_child_Survival.jpg",
		name: "Maternal and Child Survival",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/Ministry_of_Health_Serra_Leone.png",
		name: "Ministry of Health Sierra Leone",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/Society_of_family_health.jpg",
		name: "Society for Family Health",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/NACA.jpg",
		name: "NACA",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/Unicef.jpg",
		name: "UNICEF",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/Pepfar.jpg",
		name: "PEPFAR",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/The_World_bank.jpg",
		name: "The World Bank",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/Unitaid.jpg",
		name: "UNITAID",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/Primary_Health.jpg",
		name: "National Primary Healthcare Development Agency",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/Privat_Sector.jpg",
		name: "Private Sector Health Alliance of Nigeria",
	},
	{
		url: "https://hscgroup.org/wp-content/uploads/2020/03/United_Nations.jpg",
		name: "United Nations Foundation",
	},
];
export default function Clients() {
	return (
		<section className="w-full relative overflow-hidden">
			<section className="bg-background pb-5 ">
				<div className="group relative m-auto max-w-6xl px-6">
					<div className="flex flex-col items-center md:flex-row">
						<div className="md:max-w-44 md:border-r md:pr-6">
							<p className="text-end text-sm">Our Clients</p>
						</div>
						<div className="relative py-6 md:w-[calc(100%-11rem)]">
							<InfiniteSlider speedOnHover={20} speed={40} gap={112}>
								{logoCLoud.map((item, index) => {
									return (
										<div key={index} className="flex">
											<img
												className="mx-auto h-12 w-fit dark:invert"
												src={item.url}
												alt={item.name}
												height="24"
												width="auto"
											/>
										</div>
									);
								})}
							</InfiniteSlider>

							<div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
							<div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
							<ProgressiveBlur
								className="pointer-events-none absolute left-0 top-0 h-full w-20"
								direction="left"
								blurIntensity={1}
							/>
							<ProgressiveBlur
								className="pointer-events-none absolute right-0 top-0 h-full w-20"
								direction="right"
								blurIntensity={1}
							/>
						</div>
					</div>
				</div>
			</section>
		</section>
	);
}
