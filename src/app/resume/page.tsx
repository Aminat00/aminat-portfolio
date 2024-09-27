"use client";

import { FaJs, FaReact, FaNodeJs, FaPython, FaGithub } from "react-icons/fa";
import { HiMiniArrowTopRightOnSquare } from "react-icons/hi2";

import {
	SiTailwindcss,
	SiNextdotjs,
	SiNestjs,
	SiMicrosoftazure,
	SiPostgresql,
	SiTypescript,
	SiMongodb,
} from "react-icons/si";

// about data
const about = {
	title: "About me",
	info: [
		{
			fieldName: "Full Name",
			fieldValue: "Aminat Moldalieva",
		},
		{
			fieldName: "Phone",
			fieldValue: "(+48) 788 680207",
		},
		{
			fieldName: "Experience",
			fieldValue: "4+ Years",
		},
		{
			fieldName: "Email",
			fieldValue: "moldalievaaminat@gmail.com",
		},
		{
			fieldName: "Freelance",
			fieldValue: "Available",
		},
		{
			fieldName: "Languages",
			fieldValue: `English, Turkish, \n Polish, Russian`,
		},
	],
};

// experience data
const experience = {
	icon: "/assets/resume/badge.svg",
	title: "My experience",
	description:
		"With over 4 years of experience, I have improved load times for over 2 million users and streamlined development processes to save my team hours. My expertise lies in leveraging modern technologies like React, React Native, Node.js, and Python to enhance user engagement.",
	items: [
		{
			company: "Aurem",
			position: "Mobile & Full-Stack Engineer",
			duration: "December 2022 – Present",
			location: "Abu Dhabi, UAE [Remote]",
			description: [
				"Executed migration of the website frontend from Chakra UI to Tailwind CSS, which led to 30% reduction in developer time spent on styling tasks and a 25% improvement in page load speed",
				"Automated build of Mobile App in Expo Go which saved 7 hours of work effort",
				"Refactored existing Node.js and Nest.js code on the company website, resulting in a 10% improvement in server efficiency",
				"Engineered and deployed robust user registration and authentication system utilizing NestJS, resulting in a 40% reduction in unauthorized access attempts and a 25% increase in user sign-ups",
			],
		},
		{
			company: "HCL Technologies",
			position: "Front-End Engineer",
			duration: "September 2021 – December 2022",
			location: "Warsaw, Poland",
			description: [
				"Contributed to improving the performance of settings-> my account section for 2M+ users by implementing Micro-Frontends with Single-SPA",
				"Supported coordination of demos and workshops, clarifying technical aspects for stakeholders, leading to a 30% increase in buy-in and a 25% faster implementation rate",
				"Contributed to reducing website loading times by 30% for over 2 million users.",
			],
		},
		{
			company: "proceedit",
			position: "Junior Full-Stack Engineer",
			duration: "August 2020 – September 2021",
			location: "Barcelona, Spain [Remote]",
			description: [
				"Implemented RESTful APIs and services using Python and Flask, enhancing backend functionality and integration with frontend applications.",
				"Developed data processing scripts in Python to automate routine tasks, improving efficiency and accuracy by 25%.",
				"Worked on the website's dashboard, implementing new features and optimizing existing ones to enhance user experience for over 1000 users.",
			],
		},
	],
};

// education data
const education = {
	icon: "/assets/resume/cap.svg",
	title: "My education",
	description:
		"Ambitious lifelong learner with a passion for continuous education, having completed numerous courses. Currently focusing on mastering the latest AI technologies and cloud computing - Azure fundamentals. ",
	items: [
		{
			institution: "Scrimba",
			degree: "The AI Engineer Path",
			duration: "2024",
			status: "In Progress",
		},
		{
			institution: "Microsoft",
			degree: "Azure Fundamentals",
			duration: "2024",
			status: "In Progress",
		},
		{
			institution: "CodeSignal",
			degree: "Algorithms and Data Structures in JS",
			duration: "2024",
			status: "Completed",
			path: "https://learn.codesignal.com/certificates/clymtof16001c68l5ap4ahi5x/course-paths/10",
		},
		{
			institution: "APMG International",
			degree: "AgilePM® Foundation",
			duration: "2021",
			status: "Completed",
			path: "https://www.credly.com/badges/8662fa43-32be-4c8a-b874-304222ac2bf3?source=linked_in_profile",
		},
		{
			institution: "Collabera | Cognixia",
			degree: "ReactJS",
			duration: "2022",
			status: "Completed",
			path: "https://drive.google.com/file/d/1AGFkslp4dMMeC5Ak1b0UhjmTg1zGIeIT/view?usp=sharing",
		},
		{
			institution: "Vistula University",
			degree: "Bachelor Degree in Computer Engineering",
			duration: "2019-2022",
			status: "Graduated",
			path: "https://drive.google.com/file/d/1mUZ1HDNnAhfzEKBEBd2olOKJg6HafvRt/view?usp=sharing",
		},
	],
};

// skills data
const skills = {
	title: "My skills",
	skillList: [
		{
			icon: <FaJs />,
			name: "Javascript",
		},
		{
			icon: <FaReact />,
			name: "React.js",
		},
		{
			icon: <SiNextdotjs />,
			name: "next.js",
		},
		{
			icon: <FaPython />,
			name: "Python",
		},
		{
			icon: <SiNestjs />,
			name: "NestJS",
		},

		{
			icon: <SiTailwindcss />,
			name: "Tailwind.css",
		},
		{
			icon: <FaNodeJs />,
			name: "Node.js",
		},
		{
			icon: <FaGithub />,
			name: "GitHub",
		},
		{
			icon: <SiMicrosoftazure />,
			name: "Microsoft Azure",
		},
		{ icon: <SiPostgresql />, name: "PostGreSQL" },
		{ icon: <SiMongodb />, name: "MongoDB" },
		{ icon: <SiTypescript />, name: "Typescript" },
	],
};

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import Link from "next/link";

const Resume = () => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{
				opacity: 1,
				transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
			}}
			className="min-h-[80vh] flex items-center justify-center py-12 xl:py-0">
			<div className="container mx-auto">
				<Tabs
					defaultValue="experience"
					className="flex flex-col xl:flex-row gap-[60px]">
					<TabsList className="flex flex-col w-full max-w-[380px] mx-auto xl:mx-0 gap-6">
						<TabsTrigger value="experience">Experience</TabsTrigger>
						<TabsTrigger value="education">Education</TabsTrigger>
						<TabsTrigger value="skills">Skills</TabsTrigger>
						<TabsTrigger value="about">About me</TabsTrigger>
					</TabsList>

					{/* content */}
					<div className="min-h-[70vh] w-full">
						{/* experience */}
						<TabsContent value="experience" className="w-full">
							<div className="flex flex-col gap-[30px] text-center xl:text-left">
								<h3 className="text-4xl font-bold">{experience.title}</h3>
								<p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">
									{experience.description}
								</p>
								<ScrollArea className="min-h-[400px]">
									<ul className="grid grid-cols-1  gap-[30px]">
										{experience.items.map((item, index) => {
											return (
												<li
													key={index}
													className="bg-[#232329] py-6 px-10 rounded-xl flex flex-col  items-center lg:items-start gap-1">
													<div className="flex justify-between w-full">
														<div className="flex-col">
															<span className="text-accent">
																{item.duration}
															</span>
															<h3 className="text-xl max-w-[260px] min-h-[60px] text-center lg:text-left">
																{item.position}
															</h3>
														</div>
														<div className="flex-col">
															<span className="text-accent">
																{item.company}
															</span>
															<h3 className="text-xl max-w-[260px] min-h-[60px] text-center lg:text-left">
																{item.location}
															</h3>
														</div>
													</div>

													{/* Bullet points with accent color */}
													<ul className="mt-2 text-white/60 list-disc marker:text-accent list-outside">
														{item?.description?.map((desc, descIndex) => (
															<li key={descIndex}> {desc}</li>
														))}
													</ul>
												</li>
											);
										})}
									</ul>
								</ScrollArea>
							</div>
						</TabsContent>

						{/* education */}
						<TabsContent value="education" className="w-full">
							<div className="flex flex-col gap-[30px] text-center xl:text-left">
								<h3 className="text-4xl font-bold">{education.title}</h3>
								<p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">
									{education.description}
								</p>
								<ScrollArea className="h-[400px] overflow-y-auto">
									<ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
										{education.items.map((item, index) => {
											return (
												<li
													key={index}
													className="bg-[#232329] h-[184px] py-6 px-10 rounded-xl flex flex-col justify-center items-center lg:items-start gap-1">
													<div className="flex justify-between w-full">
														<span className="text-white">{item.duration}</span>
														<div className="flex justify-between gap-2 items-center">
															<Link
																href={item.path ?? ""}
																passHref
																legacyBehavior>
																<a
																	target="_blank"
																	rel="noopener noreferrer"
																	className="text-accent">
																	{item.status}
																</a>
															</Link>
															{item.path && (
																<HiMiniArrowTopRightOnSquare color="#00FF99" />
															)}
														</div>
													</div>

													<h3 className="text-xl max-w-[260px] min-h-[60px] text-center lg:text-left">
														{item.degree}
													</h3>
													<div className="flex items-center gap-3">
														{/* dot */}
														<span className="w-[6px] h-[6px] rounded-full bg-accent"></span>
														<p className="text-white/60">{item.institution}</p>
													</div>
												</li>
											);
										})}
									</ul>
								</ScrollArea>
							</div>
						</TabsContent>

						{/* skills */}
						<TabsContent value="skills" className="w-full h-full">
							<div className="flex flex-col gap-[30px]">
								<div className="flex flex-col gap-[30px] text-center xl:text-left">
									<h3 className="text-4xl font-bold">{skills.title}</h3>
								</div>
								<ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 xl:gap-[30px]">
									{skills.skillList.map((skill, index) => {
										return (
											<li key={index}>
												<TooltipProvider delayDuration={100}>
													<Tooltip>
														<TooltipTrigger className="w-full h-[100px] bg-[#232329] rounded-xl flex justify-center items-center group">
															<div className="text-5xl group-hover:text-accent transition-all duration-300">
																{skill.icon}
															</div>
														</TooltipTrigger>
														<TooltipContent>
															<p className="capitalize">{skill.name}</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</li>
										);
									})}
								</ul>
							</div>
						</TabsContent>

						{/* about */}
						<TabsContent
							value="about"
							className="w-full text-center xl:text-left">
							<div className="flex flex-col gap-[30px]">
								<h3 className="text-4xl font-bold">{about.title}</h3>

								<ul className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 gap-x-2 max-w-[620px] mx-auto xl:mx-0">
									{about.info.map((item, index) => {
										return (
											<li
												key={index}
												className="flex items-center justify-center xl:justify-start gap-3">
												<span className="text-white/60">{item.fieldName}</span>
												<span className="text-xl">{item.fieldValue}</span>
											</li>
										);
									})}
								</ul>
							</div>
						</TabsContent>
					</div>
				</Tabs>
			</div>
		</motion.div>
	);
};

export default Resume;
