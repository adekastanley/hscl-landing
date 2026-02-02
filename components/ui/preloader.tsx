"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export function Preloader() {
	const [textVisible, setTextVisible] = useState(true);
	const [exitAnimation, setExitAnimation] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		// 1. Text fills for 3 seconds
		// 2. Text fades out at 3.2s
		const textTimer = setTimeout(() => {
			setTextVisible(false);
		}, 3200);

		// 3. Start exit swipes shortly after text fade starts
		const exitTimer = setTimeout(() => {
			setExitAnimation(true);
		}, 3500);

		return () => {
			clearTimeout(textTimer);
			clearTimeout(exitTimer);
		};
	}, []);

	if (!mounted) return null;

	return (
		<AnimatePresence>
			{/* Main Container - Navy Background (First Layer) */}
			{!exitAnimation && (
				<motion.div
					key="layer-navy"
					className="fixed inset-0 z-50 flex items-center justify-center bg-chemonics-navy overflow-hidden"
					exit={{
						x: "100%",
						transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
					}}
				>
					{/* Text Container */}
					<AnimatePresence>
						{textVisible && (
							<motion.div
								key="preloader-text"
								className="relative"
								initial={{ opacity: 1 }}
								exit={{ opacity: 0, transition: { duration: 0.5 } }}
							>
								{/* Background Faded Text */}
								<h1 className="text-6xl md:text-9xl font-bold font-montserrat text-white/20">
									HSCL
								</h1>

								{/* Foreground Fill Text */}
								<h1 className="absolute top-0 left-0 text-6xl md:text-9xl font-bold font-montserrat text-white overflow-hidden">
									<motion.span
										initial={{ width: "0%" }}
										animate={{ width: "100%" }}
										transition={{ duration: 3, ease: "easeInOut" }}
										className="block overflow-hidden whitespace-nowrap"
									>
										HSCL
									</motion.span>
								</h1>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			)}

			{/* Second Layer - Teal */}
			{!exitAnimation && (
				<motion.div
					key="layer-teal"
					className="fixed inset-0 z-40 bg-chemonics-teal"
					exit={{
						x: "100%",
						transition: {
							duration: 0.8,
							ease: [0.76, 0, 0.24, 1],
							delay: 0.1,
						},
					}}
				/>
			)}

			{/* Third Layer - Lime */}
			{!exitAnimation && (
				<motion.div
					key="layer-lime"
					className="fixed inset-0 z-30 bg-chemonics-lime"
					exit={{
						x: "100%",
						transition: {
							duration: 0.8,
							ease: [0.76, 0, 0.24, 1],
							delay: 0.2,
						},
					}}
				/>
			)}
		</AnimatePresence>
	);
}
