"use client";

import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";

const geoUrl = "/world-countries.json";

// Placeholder list of active countries
// TODO: Fetch this from a database or config
const activeCountries = [
	"Nigeria",
	"Kenya",
	"South Africa",
	"Ghana",
	"Rwanda",
	"Uganda",
	"Zambia",
	"Ethiopia",
	"Tanzania",
	"Senegal",
];

export default function Map() {
	const [content, setContent] = useState("");

	return (
		<section className="py-16  bg-white">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold text-chemonics-navy mb-4">
						Our Footprint
					</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						We have a strong presence across the African continent, delivering
						impactful health systems strengthening projects.
					</p>
				</div>

				<div className="w-full max-w-4xl mx-auto h-[600px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
					<ComposableMap
						projection="geoMercator"
						projectionConfig={{
							scale: 400,
							center: [20, 0], // Center roughly on Central Africa
						}}
						style={{ width: "100%", height: "100%" }}
					>
						<Geographies geography={geoUrl}>
							{({ geographies }: { geographies: any[] }) =>
								geographies.map((geo: any) => {
									// Filter to show only Africa (Region 002) roughly,
									// or just rely on the viewport cropping.
									// But showing the whole world cropped is fine.
									// Alternatively, check if the country is in Africa list to color "gray" vs "transparent" if outside

									const countryName = geo.properties.name;
									const isActive = activeCountries.includes(countryName);

									return (
										<Geography
											key={geo.rsmKey}
											geography={geo}
											data-tooltip-id="my-tooltip"
											data-tooltip-content={countryName}
											onMouseEnter={() => {
												setContent(countryName);
											}}
											onMouseLeave={() => {
												setContent("");
											}}
											style={{
												default: {
													fill: isActive ? "#D1282E" : "#E5E7EB", // Chemonics Red or similiar vs Gray-200
													outline: "none",
													stroke: "#ffffff",
													strokeWidth: 0.5,
												},
												hover: {
													fill: isActive ? "#A81E23" : "#D1D5DB", // Darker Red vs Darker Gray
													outline: "none",
													stroke: "#ffffff",
													strokeWidth: 0.75,
													cursor: isActive ? "pointer" : "default",
												},
												pressed: {
													fill: isActive ? "#7F161A" : "#9CA3AF",
													outline: "none",
												},
											}}
										/>
									);
								})
							}
						</Geographies>
					</ComposableMap>
					<Tooltip id="my-tooltip" />

					{/* Legend */}
					<div className="absolute bottom-6 left-6 bg-white/90 p-4 rounded-lg shadow-sm border text-xs">
						<div className="flex items-center gap-2 mb-2">
							<div className="w-3 h-3 bg-[#D1282E] rounded-full"></div>
							<span className="font-medium text-chemonics-navy">
								Active Presence
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-gray-200 rounded-full"></div>
							<span className="text-muted-foreground">Other Regions</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
