"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export function Preloader() {
	const [complete, setComplete] = useState(false);

	useEffect(() => {
		// Total animation time roughly 3-4s before revealing
		const timer = setTimeout(() => {
			setComplete(true);
		}, 3500);
		return () => clearTimeout(timer);
	}, []);

	return (
		<AnimatePresence>
			{!complete && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center bg-chemonics-navy text-white overflow-hidden"
					initial={{ x: 0 }}
					exit={{
						x: "-100%",
						transition: { duration: 0.8, ease: "easeInOut" },
					}}
				>
					{/* Breathing Text Container */}
					<motion.div
						className="relative"
						// animate={{ scale: [1, 1.05, 1] }}
						// transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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
				</motion.div>
			)}
		</AnimatePresence>
	);
}
