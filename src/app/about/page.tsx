"use client";

import { motion } from "framer-motion";

const info = [
  { label: "Name", value: "Aminat Moldalieva" },
  { label: "Location", value: "Remote, EMEA" },
  { label: "Languages", value: "English, Kyrgyz, Turkish, Russian, Polish" },
  { label: "Education", value: "B.Eng Computer Engineering" },
  { label: "University", value: "Vistula University, Warsaw" },
  { label: "Status", value: "Open to opportunities" },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" },
};

const About = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 0.2, duration: 0.4, ease: "easeIn" },
      }}
      className="min-h-[80vh] flex items-center py-12"
    >
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-12 xl:gap-20">
          {/* Left column — intro */}
          <div className="flex-1 flex flex-col gap-8">
            <motion.div {...fadeInUp} className="flex flex-col gap-4">
              <h2 className="text-3xl xl:text-4xl font-extrabold text-heading">
                About Me
              </h2>
              <p className="text-body leading-relaxed">
                I&apos;m a software engineer with 4+ years of experience building
                mobile apps and web platforms. I use AI daily as a force multiplier
                — Claude AI with MCP connections for design handoff and test
                automation, AI coding agents for accelerating development, and
                OpenAI APIs in production features.
              </p>
              <p className="text-body leading-relaxed">
                Currently, I&apos;m building a React Native app for a fintech
                platform serving millions of users across 100+ countries. My
                product managers and teammates recognize me for a strong eye for
                detail and a product sense that ensures what ships is not just
                functional but genuinely good.
              </p>
            </motion.div>

            {/* Philosophy card */}
            <motion.div
              {...fadeInUp}
              className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-3"
            >
              <h3 className="text-lg font-bold text-heading">My Philosophy</h3>
              <p className="text-body leading-relaxed italic">
                &ldquo;I know where AI ends and engineering judgment begins. AI
                cannot catch the subtle UI inconsistency that breaks trust, the
                edge case that only shows up on a specific device, or the
                architectural decision that shapes how a codebase scales.&rdquo;
              </p>
            </motion.div>

            {/* Values */}
            <motion.div {...fadeInUp} className="flex flex-col gap-3">
              <h3 className="text-lg font-bold text-heading">What Drives Me</h3>
              <p className="text-body leading-relaxed">
                I believe in uplifting others through meaningful digital products.
                Success requires hard work, attention to detail, and supporting
                those around you. I value honesty, modesty, and continuous
                learning in everything I do.
              </p>
            </motion.div>
          </div>

          {/* Right column — info grid */}
          <motion.div
            {...fadeInUp}
            className="xl:w-[380px] flex flex-col gap-6"
          >
            <div className="bg-white border border-border rounded-xl p-6 flex flex-col gap-5">
              {info.map((item, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                    {item.label}
                  </span>
                  <span className="text-heading font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;
