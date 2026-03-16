"use client";
import React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const pathname = usePathname();
	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={pathname}
				initial={{ opacity: 0 }}
				animate={{
					opacity: 1,
					transition: { duration: 0.4, ease: "easeOut" },
				}}
				exit={{
					opacity: 0,
					transition: { duration: 0.2, ease: "easeIn" },
				}}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
};
