import { Fragment } from "react";
import { Reveal } from "@/components/motion/reveal";

const roles = [
  {
    role: "Mobile Software Engineer",
    company: "LaunchGood",
    accent: true,
    period: "Aug 2025 – Present · Remote, US",
    bullets: [
      "Rebuilt core screens of a React Native app serving 100+ countries as part of a full redesign — shipping each feature end to end across API integration, state, UI and Jest component tests.",
      "Integrated Claude via MCP into the team's workflow for design handoff and test authoring.",
      "Ran coding agents through feature work with a spec → generate → diff-review → test loop, catching device-specific edge cases the generated output missed.",
    ],
  },
  {
    role: "QA Automation Engineer",
    company: "LaunchGood",
    period: "Feb 2025 – Aug 2025 · Remote, US",
    bullets: [
      "Built the company's first Playwright end-to-end suite from scratch, with reusable page-object helpers other engineers extended.",
      "Put it on a five-minute GitHub Actions cron as synthetic monitoring, with Slack webhook alerts on failure.",
      "Brought detection of production breakages down from hours to under five minutes.",
    ],
  },
  {
    role: "Freelance Full-Stack Mobile Engineer",
    company: "Self-Employed",
    period: "Aug 2024 – Feb 2025 · Remote",
    bullets: [
      "Developed a mobile app integrated with the OpenAI API for AI-driven user features.",
      "Built a full-stack web platform with Next.js, Supabase, tRPC and Prisma.",
      "Created an e-commerce site with Next.js and the Shopify Headless Storefront API.",
    ],
  },
  {
    role: "Full-Stack Mobile Engineer",
    company: "Aurem",
    period: "Dec 2022 – Aug 2024 · Abu Dhabi, UAE",
    bullets: [
      "Migrated the frontend from Chakra UI to Tailwind CSS, cutting styling time by 30%.",
      "Automated the Expo build with GitHub Actions, saving 7 hours of manual effort weekly.",
      "Designed and implemented backend APIs with NestJS — models, entities and queries.",
    ],
  },
  {
    role: "Frontend Engineer",
    company: "HCL Technologies",
    period: "Jan 2022 – Dec 2022 · Warsaw, Poland",
    bullets: [
      "Developed Micro-Frontends with Single-SPA for the 'My Account' section supporting 2M+ users.",
      "Started and ran a recurring peer knowledge-sharing session for the frontend team.",
    ],
  },
  {
    role: "Full-Stack Engineer Intern",
    company: "proceedit",
    period: "Jul 2021 – Jan 2022 · Barcelona, Spain",
    bullets: [
      "Migrated the company WordPress site to AWS.",
      "Developed and maintained a Flutter-based website for cross-platform reach.",
    ],
  },
];

const skillGroups = [
  {
    title: "Mobile & Frontend",
    variant: "neutral" as const,
    items: ["React Native", "Expo", "TypeScript", "Next.js", "React", "Flutter", "Tailwind"],
  },
  {
    title: "AI & Automation",
    variant: "accent" as const,
    items: ["n8n", "Claude / MCP", "Tavily", "OpenAI API", "AI coding agents"],
  },
  {
    title: "Backend",
    variant: "neutral" as const,
    items: ["Node.js", "NestJS", "tRPC", "Prisma", "Supabase"],
  },
  {
    title: "Testing & CI",
    variant: "neutral" as const,
    items: ["Playwright", "Jest", "GitHub Actions"],
  },
];

export const Experience = () => (
  <Fragment>
    <section id="experience" className="section">
      <h6 className="eyebrow">04 — Experience</h6>
      <h2 style={{ fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-0.02em", maxWidth: "16ch", margin: "0 0 var(--space-8)" }}>
        Where I&apos;ve worked
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        {roles.map((role, i) => (
          <Reveal key={`${role.role}-${role.period}`} delay={i * 0.05}>
          <div
            style={{
              display: "grid",
              gap: "var(--space-3)",
              borderLeft: "1px solid var(--color-divider)",
              paddingLeft: "var(--space-6)",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: -4,
                top: 6,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: role.accent ? "var(--color-accent)" : "var(--color-neutral-500)",
              }}
            />
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "var(--space-2)", alignItems: "baseline" }}>
              <h4 style={{ margin: 0 }}>
                {role.role} ·{" "}
                <span style={role.accent ? { color: "var(--color-accent)" } : undefined}>{role.company}</span>
              </h4>
              <span className="text-muted" style={{ fontSize: 13 }}>
                {role.period}
              </span>
            </div>
            <ul
              className="text-muted"
              style={{ margin: 0, paddingLeft: "1.1em", fontSize: 14, lineHeight: 1.6, display: "flex", flexDirection: "column", gap: 4 }}
            >
              {role.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          </div>
          </Reveal>
        ))}
      </div>
    </section>

    {/* Skills — visual continuation of Experience, reduced top padding */}
    <section
      className="section"
      style={{ paddingTop: 0, paddingBottom: "clamp(40px,7vw,80px)" }}
      aria-label="Skills"
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "var(--space-6)" }}>
        {skillGroups.map((group) => (
          <div key={group.title}>
            <h6 className="eyebrow" style={{ margin: "0 0 var(--space-4)" }}>
              {group.title}
            </h6>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {group.items.map((item) => (
                <span key={item} className={`tag tag-${group.variant}`}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  </Fragment>
);
