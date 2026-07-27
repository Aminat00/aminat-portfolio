"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowIcon } from "@/components/icons";

const heroTags = [
  "React Native",
  "TypeScript",
  "Next.js",
  "Node.js",
  "n8n",
  "Claude / MCP",
  "Playwright",
];

const CV_URL = "https://aminatmoldalieva.com/my-cv.pdf";

export const Hero = () => {
  const reduce = useReducedMotion();

  // Staggered rise for the supporting lines; the name gets its own clip reveal.
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  const clip = reduce
    ? {}
    : {
        initial: { clipPath: "inset(0 100% 0 0)" },
        animate: { clipPath: "inset(0 0% 0 0)" },
        transition: { duration: 0.9, delay: 0.22, ease: [0.77, 0, 0.18, 1] as const },
      };

  return (
    <section
      id="top"
      style={{
        maxWidth: 1120,
        margin: "0 auto",
        padding: "clamp(56px,10vw,120px) clamp(20px,5vw,64px) clamp(40px,7vw,72px)",
      }}
    >
      <motion.h6
        {...rise(0.08)}
        style={{ color: "var(--color-accent)", margin: "0 0 var(--space-4)", display: "flex", alignItems: "center", gap: 8 }}
      >
        <span style={{ width: 28, height: 1, background: "var(--color-accent)", display: "inline-block" }} />
        Software Engineer · Mobile & Automation
      </motion.h6>

      <motion.h1
        {...clip}
        style={{
          fontSize: "clamp(44px,7.6vw,96px)",
          lineHeight: 0.98,
          letterSpacing: "-0.04em",
          margin: "0 0 var(--space-4)",
          maxWidth: "14ch",
        }}
      >
        Aminat Moldalieva
      </motion.h1>

      <motion.p
        {...rise(0.5)}
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 500,
          fontSize: "clamp(21px,2.9vw,34px)",
          lineHeight: 1.25,
          letterSpacing: "-0.01em",
          maxWidth: "22ch",
          margin: "0 0 var(--space-6)",
        }}
      >
        I build mobile apps, and <span style={{ color: "var(--color-accent)" }}>the automation around them</span>.
      </motion.p>

      <motion.p
        {...rise(0.62)}
        className="text-muted"
        style={{ fontSize: "clamp(15px,1.5vw,18px)", lineHeight: 1.6, maxWidth: "54ch", margin: "0 0 var(--space-8)" }}
      >
        Software engineer, 5 years in React Native and TypeScript. Currently rebuilding a fintech app used
        in 100+ countries. I also tend to end up owning the parts next to the feature — test suites,
        release pipelines, agent workflows.
      </motion.p>

      <motion.div
        {...rise(0.74)}
        style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "center", marginBottom: "var(--space-8)" }}
      >
        <a href={CV_URL} className="btn btn-primary" style={{ fontSize: 15, padding: "10px 18px" }}>
          <ArrowIcon size={16} style={{ transform: "rotate(90deg)" }} /> Download CV
        </a>
        <a href="#work" className="btn btn-secondary" style={{ fontSize: 15, padding: "10px 18px" }}>
          View work <ArrowIcon size={16} style={{ transform: "rotate(45deg)" }} />
        </a>
        <div data-social-row="" style={{ display: "flex", gap: "var(--space-2)", marginLeft: "auto" }}>
          <a href="https://github.com/Aminat00" target="_blank" rel="noopener" className="btn btn-secondary" style={{ fontSize: 15, padding: "10px 16px" }}>
            GitHub <ArrowIcon size={13} style={{ opacity: 0.7, transform: "rotate(-45deg)" }} />
          </a>
          <a href="https://www.linkedin.com/in/aminatmoldalieva/" target="_blank" rel="noopener" className="btn btn-secondary" style={{ fontSize: 15, padding: "10px 16px" }}>
            LinkedIn <ArrowIcon size={13} style={{ opacity: 0.7, transform: "rotate(-45deg)" }} />
          </a>
        </div>
      </motion.div>

      <motion.div {...rise(0.86)} style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
        {heroTags.map((tag) => (
          <span key={tag} className="tag tag-outline">
            {tag}
          </span>
        ))}
      </motion.div>
    </section>
  );
};
