"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FiDownload } from "react-icons/fi";
import { Social, Stats } from "@/components";

const techStack = [
  "React Native",
  "TypeScript",
  "Next.js",
  "Node.js",
  "AI Tools",
  "Playwright",
];

const staggerDelay = 0.1;
const baseDelay = 0.2;

const fadeUp = (index: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      delay: baseDelay + index * staggerDelay,
      duration: 0.5,
      ease: "easeOut",
    },
  },
});

const Home = () => {
  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-20 -left-20 w-[300px] h-[300px] bg-accent/10 rounded-full blur-3xl animate-orb-drift pointer-events-none" />
      <div className="absolute bottom-20 -right-20 w-[250px] h-[250px] bg-soft/20 rounded-full blur-3xl animate-orb-drift-slow pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center text-center gap-6 py-12">
          {/* Role label */}
          <motion.span
            {...fadeUp(0)}
            className="text-xs xl:text-sm font-semibold text-primary uppercase tracking-[3px]"
          >
            Software Engineer
          </motion.span>

          {/* Name — Clip Reveal */}
          <div className="flex flex-col items-center gap-3">
            <motion.h1
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{
                delay: baseDelay + 0.2,
                duration: 0.9,
                ease: [0.77, 0, 0.18, 1],
              }}
              className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-heading leading-tight tracking-tight"
            >
              Aminat{" "}
              <span className="text-primary">Moldalieva</span>
            </motion.h1>

            {/* Gradient underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: baseDelay + 1.0,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-[3px] w-48 xl:w-64 rounded-full origin-left"
              style={{
                background: "linear-gradient(90deg, #0f766e, #2dd4bf, #b2dfdb)",
              }}
            />
          </div>

          {/* Headline */}
          <motion.p
            {...fadeUp(3)}
            className="text-lg xl:text-xl font-medium text-heading/80 max-w-[550px]"
          >
            Building the future with{" "}
            <span className="text-primary font-bold">AI + Human Judgment</span>
          </motion.p>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(4)}
            className="max-w-[500px] text-body leading-relaxed"
          >
            I build mobile apps and web platforms using React Native, TypeScript,
            and Node.js. Currently serving millions of users across 100+ countries.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div {...fadeUp(5)} className="flex gap-4">
            <a href="/my-cv.pdf" download>
              <Button variant="default" size="lg" className="flex items-center gap-2">
                <span>Download CV</span>
                <FiDownload className="text-lg" />
              </Button>
            </a>
            <Social
              containerStyles="flex gap-3"
              iconStyles="w-11 h-11 border-2 border-border rounded-full flex justify-center items-center text-body text-lg hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 cursor-pointer"
            />
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeUp(6)} className="w-full max-w-[500px] border-t border-border pt-6">
            <Stats />
          </motion.div>

          {/* Tech stack pills */}
          <motion.div {...fadeUp(7)} className="flex flex-wrap justify-center gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-xs font-semibold rounded-full bg-surface text-primary border border-border"
              >
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Home;
