"use client";

import {
	motion,
	useInView,
	useAnimation,
	useSpring,
	useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

interface CounterProps {
	value: number;
	label: string;
	suffix?: string;
}

function AnimatedCounter({ value, label, suffix = "" }: CounterProps) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, amount: 0.5 });
	const springValue = useSpring(0, {
		bounce: 0,
		duration: 2500,
	});

	const displayValue = useTransform(springValue, (current) =>
		Math.floor(current),
	);

	useEffect(() => {
		if (isInView) {
			springValue.set(value);
		}
	}, [isInView, springValue, value]);

	return (
		<div
			ref={ref}
			className="flex flex-col items-center justify-center p-6 text-center"
		>
			<div className="flex items-baseline justify-center mb-2">
				<motion.span className="text-5xl md:text-6xl font-bold font-montserrat text-chemonics-lime">
					{displayValue}
				</motion.span>
				<span className="text-4xl md:text-5xl font-bold font-montserrat text-chemonics-lime ml-1">
					{suffix}
				</span>
			</div>
			<p className="text-lg md:text-xl font-medium text-white">{label}</p>
		</div>
	);
}

export function AnimatedImpactCounters() {
	const stats = [
		{ value: 12, label: "Countries", suffix: "+" },
		{ value: 40, label: "Engagements", suffix: "+" },
		{ value: 8, label: "Development Partners", suffix: "+" },
		{ value: 15, label: "Years of Experience", suffix: "+" },
	];

	return (
		<section className="py-20 bg-chemonics-navy relative overflow-hidden">
			{/* Decorative background elements */}
			<div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
				<div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-chemonics-teal blur-3xl mix-blend-screen" />
				<div className="absolute bottom-0 right-0 w-full h-1/2 bg-linear-to-t from-chemonics-navy-dark to-transparent" />
			</div>

			<div className="container mx-auto px-6 relative z-10">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
					{stats.map((stat, index) => (
						<AnimatedCounter
							key={index}
							value={stat.value}
							label={stat.label}
							suffix={stat.suffix}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
