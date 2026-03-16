"use client";

import { motion } from "framer-motion";
import { FaJs, FaReact, FaNodeJs, FaPython, FaGithub } from "react-icons/fa";
import {
  SiTailwindcss,
  SiNextdotjs,
  SiNestjs,
  SiPostgresql,
  SiTypescript,
  SiGraphql,
} from "react-icons/si";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const experience = [
  {
    title: "Mobile Software Engineer",
    company: "LaunchGood",
    duration: "Aug 2025 – Present",
    location: "Remote, United States",
    bullets: [
      "Rebuilt key screens and components for the React Native app redesign using AI coding agents while applying deep product judgment on UI quality and edge cases",
      "Integrated AI-assisted workflows with Claude MCP connections for design handoff and test automation",
      "Implemented new features end-to-end with backend/API integrations and Jest component tests",
    ],
  },
  {
    title: "QA Automation Engineer",
    company: "LaunchGood",
    duration: "Feb 2025 – Aug 2025",
    location: "Remote, United States",
    bullets: [
      "Built comprehensive Playwright automation suite from scratch with reusable components and helpers",
      "Implemented GitHub Actions CI/CD pipelines with cron-scheduled synthetic tests every 5 minutes",
      "Integrated Slack webhook notifications for instant failure alerts, improving incident response",
    ],
  },
  {
    title: "Freelance Full-Stack Mobile Engineer",
    company: "Self-Employed",
    duration: "Aug 2024 – Feb 2025",
    location: "Remote",
    bullets: [
      "Developed mobile app integrated with OpenAI API for AI-driven user features",
      "Built full-stack web platform using Next.js, Supabase, tRPC, and Prisma",
      "Created e-commerce website with Next.js and Shopify Headless Storefront API",
    ],
  },
  {
    title: "Full-Stack Mobile Engineer",
    company: "Aurem",
    duration: "Dec 2022 – Aug 2024",
    location: "Abu Dhabi, UAE",
    bullets: [
      "Migrated frontend from Chakra UI to Tailwind CSS, reducing styling time by 30%",
      "Automated Expo build process with GitHub Actions, saving 7 hours of manual effort weekly",
      "Designed and implemented backend APIs with NestJS including models, entities, and queries",
    ],
  },
  {
    title: "Frontend Engineer",
    company: "HCL Technologies",
    duration: "Jan 2022 – Dec 2022",
    location: "Warsaw, Poland",
    bullets: [
      "Developed Micro-Frontends using Single-SPA for 'My Account' section supporting 2M+ users",
      "Initiated and led peer knowledge-sharing sessions, improving team expertise",
    ],
  },
  {
    title: "Full-Stack Engineer Intern",
    company: "proceedit",
    duration: "Jul 2021 – Jan 2022",
    location: "Barcelona, Spain",
    bullets: [
      "Migrated company WordPress website to AWS, enhancing scalability",
      "Developed and maintained Flutter-based website for cross-platform functionality",
    ],
  },
];

const education = {
  degree: "Bachelor of Engineering, Computer Engineering",
  university: "Vistula University",
  years: "2019 – 2022",
  location: "Warsaw, Poland",
};

const certifications = ["AgilePM® Foundation", "ReactJS", "Flutter Puzzle Hack"];

const skills = [
  { icon: <SiTypescript />, name: "TypeScript" },
  { icon: <FaReact />, name: "React / React Native" },
  { icon: <SiNextdotjs />, name: "Next.js" },
  { icon: <FaNodeJs />, name: "Node.js" },
  { icon: <SiNestjs />, name: "NestJS" },
  { icon: <SiTailwindcss />, name: "Tailwind CSS" },
  { icon: <FaJs />, name: "JavaScript" },
  { icon: <SiGraphql />, name: "GraphQL" },
  { icon: <SiPostgresql />, name: "PostgreSQL" },
  { icon: <FaGithub />, name: "GitHub Actions" },
  { icon: <FaPython />, name: "Python" },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const Resume = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 1.5, duration: 0.4, ease: "easeIn" },
      }}
      className="min-h-[80vh] py-12"
    >
      <div className="container mx-auto flex flex-col gap-20">
        {/* Experience Section */}
        <div className="flex flex-col gap-8">
          <motion.h2
            {...fadeInUp}
            className="text-3xl xl:text-4xl font-extrabold text-heading"
          >
            Experience
          </motion.h2>

          {/* Timeline */}
          <div className="relative flex flex-col gap-8">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-border hidden xl:block" />

            {experience.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: index * 0.1,
                }}
                className="flex gap-6"
              >
                {/* Timeline dot */}
                <div className="hidden xl:flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-primary border-4 border-background z-10 flex-shrink-0" />
                </div>

                {/* Card */}
                <div className="flex-1 bg-white border border-border rounded-xl p-6 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-1">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg font-bold text-heading">
                        {item.title}
                      </h3>
                      <span className="text-primary font-semibold text-sm">
                        {item.company}
                      </span>
                    </div>
                    <div className="flex flex-col xl:items-end gap-0.5">
                      <span className="text-sm text-muted">{item.duration}</span>
                      <span className="text-sm text-muted">{item.location}</span>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {item.bullets.map((bullet, bIndex) => (
                      <li
                        key={bIndex}
                        className="text-body text-sm leading-relaxed flex gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education & Certifications */}
        <motion.div {...fadeInUp} className="flex flex-col gap-8">
          <h2 className="text-3xl xl:text-4xl font-extrabold text-heading">
            Education
          </h2>
          <div className="bg-white border border-border rounded-xl p-6 flex flex-col gap-2">
            <h3 className="text-lg font-bold text-heading">
              {education.degree}
            </h3>
            <span className="text-primary font-semibold text-sm">
              {education.university}
            </span>
            <span className="text-sm text-muted">
              {education.years} · {education.location}
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {certifications.map((cert, index) => (
              <span
                key={index}
                className="px-4 py-2 text-sm font-semibold rounded-full bg-surface text-primary border border-border"
              >
                {cert}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div {...fadeInUp} className="flex flex-col gap-8">
          <h2 className="text-3xl xl:text-4xl font-extrabold text-heading">
            Skills
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {skills.map((skill, index) => (
              <TooltipProvider delayDuration={100} key={index}>
                <Tooltip>
                  <TooltipTrigger className="h-[80px] bg-white border border-border rounded-xl flex justify-center items-center group cursor-pointer hover:border-primary hover:shadow-sm transition-all duration-200">
                    <div className="text-3xl text-body group-hover:text-primary transition-colors duration-200">
                      {skill.icon}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{skill.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Resume;
