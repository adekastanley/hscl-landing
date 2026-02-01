"use client";

import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import { ActiveCountry } from "@/actions/landing/map";
import Link from "next/link"; // Import Link for routing

const geoUrl = "/world-countries.json";

interface MapProps {
	activeCountries: ActiveCountry[];
}

export default function Map({ activeCountries = [] }: MapProps) {
	const [content, setContent] = useState<React.ReactNode>("");

	return (
		<section className="py-16 bg-white">
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
									const countryName = geo.properties.name;
									// Check if country is active (case-insensitive check might be safer, but start with exact)
									const activeCountry = activeCountries.find(
										(c) => c.name === countryName,
									);
									const isActive = !!activeCountry;

									return (
										<Geography
											key={geo.rsmKey}
											geography={geo}
											data-tooltip-id="my-tooltip"
											// We can't pass complex objects easily to data-tooltip-content usually,
											// providing unique ID or handling content via onMouseEnter is better.
											// But react-tooltip v5 allows declarative content via the Tooltip component children implicitly?
											// Actually best to set content state.
											onMouseEnter={() => {
												if (activeCountry) {
													setContent(
														<div className="text-left">
															<div className="font-bold mb-1">
																{countryName}
															</div>
															{activeCountry.projects &&
															activeCountry.projects.length > 0 ? (
																<ul className="list-disc pl-4 text-xs">
																	{activeCountry.projects.map((p) => (
																		<li key={p.id}>
																			<Link
																				href="/our-work"
																				className="hover:text-blue-200 hover:underline"
																			>
																				{p.title}
																			</Link>
																		</li>
																	))}
																</ul>
															) : (
																<div className="text-xs italic">
																	Active Presence
																</div>
															)}
														</div>,
													);
												} else {
													setContent(countryName);
												}
											}}
											onMouseLeave={() => {
												setContent("");
											}}
											style={{
												default: {
													fill: isActive ? "#000" : "#E5E7EB",
													outline: "none",
													stroke: "#ffffff",
													strokeWidth: 0.5,
												},
												hover: {
													fill: isActive ? "#4c956c" : "#D1D5DB",
													outline: "none",
													stroke: "#ffffff",
													strokeWidth: 0.75,
													cursor: isActive ? "pointer" : "default",
												},
												pressed: {
													fill: isActive ? "#16425b" : "#9CA3AF",
													outline: "none",
												},
											}}
										/>
									);
								})
							}
						</Geographies>
					</ComposableMap>
					<Tooltip
						id="my-tooltip"
						style={{ backgroundColor: "#1e293b", color: "#fff", zIndex: 50 }}
					>
						{content}
					</Tooltip>

					{/* Legend */}
					<div className="absolute bottom-6 left-6 bg-white/90 p-4 rounded-lg shadow-sm border text-xs">
						<div className="flex items-center gap-2 mb-2">
							<div className="w-3 h-3 bg-black rounded-full"></div>
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
