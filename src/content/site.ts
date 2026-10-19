import type { CaptionId } from "../lib/film/timeline.ts";

export const LINKS: {
  email: string;
  emailText: string;
  resume: string;
  linkedin: string;
  github: string;
  nidhamDemo: string;
} = {
  email: "mailto:moldalievaaminat@gmail.com",
  emailText: "moldalievaaminat@gmail.com",
  resume: "/my-cv.pdf",
  linkedin: "https://www.linkedin.com/in/aminatmoldalieva/",
  github: "https://github.com/Aminat00",
  nidhamDemo: "https://try.ka.nz/ai/aminatmoldalieva",
};

export const CAPTIONS: Record<
  CaptionId,
  { eyebrow?: string; title: string; line?: string; ctas?: boolean; proofLink?: boolean }
> = {
  intro: {
    eyebrow: "Software Engineer · AI & Workflow Automation",
    title: "Aminat Moldalieva",
    line: "I take the hard part, and I finish it.",
    ctas: true,
  },
  grit: {
    title: "I start where it's hardest.",
    line: "And I stay until it works.",
  },
  ownership: {
    title: "I own the whole outcome.",
    line: "Not just my ticket. The parts next to it too.",
  },
  delivery: {
    title: "Many messy parts. One system that works.",
    line: "At LaunchGood I automated a multi-department process from days to minutes.",
    proofLink: true,
  },
};

export const INTRO: { text: string } = {
  text: "Software engineer with 5 years across mobile, front‑end and full‑stack. Today I build LaunchGood's web platform, used in 100+ countries, and the AI workflow automation behind it. Before that, its mobile app and its first test automation, and earlier a fintech mobile app at Aurem.",
};

export const NUMBERS: {
  value: number | string;
  prefix?: string;
  suffix?: string;
  label: string;
  href: string;
}[] = [
  { value: 5, label: "Years engineering", href: "#experience" },
  { value: 100, suffix: "+", label: "Countries served", href: "#case-mobile-rebuild" },
  { value: 5, prefix: "under ", suffix: " min", label: "From breakage to alert", href: "#case-under-five-minutes" },
  { value: "Days to minutes", label: "Approval turnaround", href: "#case-days-to-minutes" },
];

export type Case = {
  slug: string;
  title: string;
  company: string;
  role: string;
  year: string;
  stack: string[];
  result: string;
  summary: string;
  problem: string;
  did: string[];
  decision: string;
  outcome: string;
  next: string;
};

export const CASES: Case[] = [
  {
    slug: "days-to-minutes",
    title: "From days to minutes",
    company: "LaunchGood",
    role: "Software Engineer",
    year: "2026",
    stack: ["Next.js", "TypeScript", "Workflow automation", "Third-party APIs"],
    result: "Approval turnaround from days to minutes",
    summary: "A manual approval that crossed several departments now runs as one automated workflow.",
    problem:
      "Campaign creators applied through a form outside the website. Staff then looked up the campaign details by hand and passed the request between departments, so every application took days.",
    did: [
      "Moved the application into the website, so every request starts with the right campaign details.",
      "Built one workflow that creates the payment link, opens the deal in the customer system and the task for finance, with no manual step.",
      "Listened for the payment and moved every record forward on its own, so creators always see which stage they are in.",
    ],
    decision:
      "Keep the application inside the website and let one workflow do every hand-off. Each department still works in its own tool, but nobody copies details between them anymore.",
    outcome:
      "A multi-department process that took days now takes minutes, and campaign creators can see where their request stands at any time.",
    next: "Bring the results of each campaign into the same view, so creators see what their spend achieved.",
  },
  {
    slug: "under-five-minutes",
    title: "Breakages found in under five minutes",
    company: "LaunchGood",
    role: "QA Automation Engineer",
    year: "2025",
    stack: ["Playwright", "GitHub Actions", "Slack"],
    result: "Detection from hours to under five minutes",
    summary: "The company's first end-to-end test suite, running every five minutes as a live check.",
    problem: "Users found breakages in production before the team did, often hours after they started.",
    did: [
      "Built the company's first Playwright end-to-end suite from scratch, with reusable page helpers other engineers extended.",
      "Ran it every five minutes against production on a schedule.",
      "Sent a Slack alert the moment a check failed.",
    ],
    decision:
      "Run the suite on a timer against production, not only on code changes, so it catches breakages from any cause: a deploy, a third party, or bad data.",
    outcome: "Breakage detection went from hours to under five minutes.",
    next: "Group alerts by user journey, so one outage sends one clear alert.",
  },
  {
    slug: "mobile-rebuild",
    title: "Core screens rebuilt for an app used in 100+ countries",
    company: "LaunchGood",
    role: "Mobile Software Engineer",
    year: "2025 to 2026",
    stack: ["React Native", "TypeScript", "Jest"],
    result: "Core screens rebuilt, tested, shipped",
    summary: "Core screens of the LaunchGood app rebuilt end to end as part of an app-wide refresh.",
    problem: "Core screens of an app used in more than 100 countries needed a full refresh without slowing releases.",
    did: [
      "Rebuilt each screen end to end: data, state, interface and component tests.",
      "Brought Claude into the team's workflow for design handoff and test writing.",
    ],
    decision:
      "Ship each screen complete with its tests before starting the next, so the refresh could go out screen by screen instead of in one risky release.",
    outcome: "Core screens rebuilt, tested and shipped as part of the app-wide refresh.",
    next: "Add visual checks on real devices, so layout changes are caught before release.",
  },
];

export const EXPERIENCE: {
  when: string;
  role: string;
  company: string;
  line: string;
  tags: string[];
}[] = [
  {
    when: "Jul 2026 to now",
    role: "Software Engineer",
    company: "LaunchGood",
    line: "Automated a multi-department approval process, from days to minutes. Building results views for campaign creators.",
    tags: ["Next.js", "TypeScript", "Workflow automation", "AI"],
  },
  {
    when: "Aug 2025 to Jul 2026",
    role: "Mobile Software Engineer",
    company: "LaunchGood",
    line: "Rebuilt core screens of a React Native app used in 100+ countries, with tests.",
    tags: ["React Native", "TypeScript", "Jest"],
  },
  {
    when: "Feb 2025 to Aug 2025",
    role: "QA Automation Engineer",
    company: "LaunchGood",
    line: "Built the first Playwright suite. Breakage detection from hours to under 5 minutes.",
    tags: ["Playwright", "GitHub Actions"],
  },
  {
    when: "Aug 2024 to Feb 2025",
    role: "Full-Stack Mobile Engineer",
    company: "Freelance",
    line: "A mobile app with AI features, a full-stack web platform and a headless store.",
    tags: ["React Native", "Next.js", "Supabase"],
  },
  {
    when: "Dec 2022 to Aug 2024",
    role: "Full-Stack Mobile Engineer",
    company: "Aurem",
    line: "Built NestJS backend APIs, and moved the frontend to Tailwind, cutting styling time by 30%.",
    tags: ["NestJS", "Expo", "Tailwind"],
  },
  {
    when: "Jan 2022 to Dec 2022",
    role: "Frontend Engineer",
    company: "HCL Technologies",
    line: "Micro-frontends for a platform with 2M+ users.",
    tags: ["Single-SPA", "React"],
  },
];

export const PROJECTS: { name: string; line: string; href?: string; linkLabel?: string }[] = [
  {
    name: "Nidham",
    line: "An agentic planner for Muslims with ADHD. Built end to end in 48 hours: three agents turn a brain-dump into a plan around the five daily prayers.",
    href: LINKS.nidhamDemo,
    linkLabel: "See the demo",
  },
];

export const ABOUT: { lines: string[] } = {
  lines: [
    "I end up owning the parts next to the feature: tests, release pipelines, workflow automation.",
    "Remote from EMEA.",
    "I speak English, Kyrgyz, Turkish, Russian and Polish.",
    "B.Eng. in Computer Engineering.",
  ],
};

export const CONTACT: { availability: string } = {
  availability: "Open to full-time roles where full-stack, AI and workflow automation meet.",
};

export const NAV: { href: string; label: string }[] = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export const META: { title: string; description: string } = {
  title: "Aminat Moldalieva · Software Engineer, AI & Workflow Automation",
  description: "Software engineer at LaunchGood. Mobile, front-end and full-stack, with AI and workflow automation.",
};

export const FOOTER: { note: string } = {
  note: "The film is AI-generated.",
};
