"use client";
import React from "react";
import { motion } from "framer-motion";

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.5, // Delay between animations of each child
		},
	},
};

// Define different animations for child elements

const fadeUp = {
	hidden: { opacity: 0, y: 50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { type: "spring", duration: 3, ease: "easeOut" },
	},
};

// Define the scale up animation for h1
const scaleUp = {
	hidden: { opacity: 0, scale: 0.5 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			ease: "linear",
			duration: 2,
		},
	},
};

const rotateIn = {
	hidden: { opacity: 0, rotate: -180 },
	visible: {
		opacity: 1,
		rotate: 0,
		transition: { duration: 1.3, ease: "easeInOut" },
	},
};

// Define each block animation
const blockAnimation = {
	hidden: { opacity: 0, y: 50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { type: "spring", duration: 2, ease: "easeOut" },
	},
};

const Services = () => {
	const [startAnimation, setStartAnimation] = React.useState(false);

	// Wait for transitions to complete before starting page animations
	React.useEffect(() => {
		// Delay matches the duration of StairTransition + PageTransition (example: 1500ms)
		const timeout = setTimeout(() => setStartAnimation(true), 1500);

		// Cleanup the timeout on component unmount
		return () => clearTimeout(timeout);
	}, []);
	return (
		<section className="min-h-[80vh] flex items-center justify-center mx-10 py-12 xl:py-0">
			<div className="container mx-auto text-center">
				<motion.div
					initial="hidden" // Start with opacity 0 and positioned below
					animate={startAnimation ? "visible" : "hidden"}
					variants={staggerContainer}
					className="flex-1 justify-center items-center">
					<motion.h1
						variants={scaleUp}
						className="text-3xl font-bold text-accent m-2">
						My Mission
					</motion.h1>

					{/* Main Mission Statement */}
					<motion.p
						variants={fadeUp}
						className="text-2xl  leading-relaxed font-bold">
						<strong>I seek Allah&apos;s [God&apos;s] boundless love</strong>{" "}
						through uplifting the Ummah [Humanity] with <br />
						<span className="text-accent">innovative digital products 💻</span>
					</motion.p>

					{/* Paragraph for depth */}
					{/* <motion.div className="p-6"> */}
					<motion.div variants={rotateIn}>
						<p className="text-2xl font-bold text-white m-4">
							💡 Driven by Faith & Values
						</p>
					</motion.div>

					{/* Inspired by Islam */}
					<motion.div
						variants={blockAnimation}
						className="bg-green-100 p-4 rounded-lg my-4">
						<p className="text-xl text-primary leading-loose mb-4">
							Inspired by the teachings of Islam:{" "}
							<em>“The best of you are those who are beneficial to others.”</em>{" "}
							<br />
							<strong>
								I enjoy working on challenges that make people&apos;s lives
								easier.
							</strong>
						</p>
					</motion.div>

					{/* No Pressure, No Diamond */}
					<motion.div
						className="bg-red-100 p-4 rounded-lg text-center my-4"
						variants={blockAnimation}>
						<p className="text-2xl font-bold text-green-800 mb-2">
							&quot; No pressure, no diamond &quot;
						</p>
						<p className="text-xl text-primary">
							I understand that success is not possible without hard work, and I
							strongly hold on to this universal learning.
						</p>
					</motion.div>

					{/* Inspired by Kindness and Teamwork */}
					<motion.div
						variants={blockAnimation}
						className="bg-blue-100 p-4 rounded-lg">
						<p className="text-xl leading-loose text-primary">
							Inspired by the Hadith: <br />
							<em>
								“A true Muslim does not harm others with their hands or tongue.”
							</em>{" "}
							<br />
							<strong>
								I believe in supporting others and helping as much as possible,
								valuing teamwork to achieve shared success.
							</strong>
						</p>
					</motion.div>
					{/* </motion.div> */}

					{/* Call to Action Button
					<motion.button
						whileHover={{ scale: 1.1, rotate: 5 }}
						whileTap={{ scale: 0.9, rotate: -5 }}
						variants={childVariants}
						className="px-6 py-3 bg-accent text-white rounded-lg shadow-lg hover:bg-accent-dark transition-all">
						Let’s Connect!
					</motion.button> */}
				</motion.div>
			</div>
		</section>
	);
};

export default Services;
