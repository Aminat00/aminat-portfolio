import { ArrowIcon, CaptureIcon, ResearchIcon, ScheduleIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";

const agents = [
  {
    kicker: "Agent 01",
    title: "Capture",
    body: "Classifies each task and cleans messy input into a single well-formed intent.",
    Icon: CaptureIcon,
  },
  {
    kicker: "Agent 02 · Tavily",
    title: "Research",
    body: "Decomposes large goals into concrete, day-sized steps, grounded in live search.",
    Icon: ResearchIcon,
  },
  {
    kicker: "Agent 03",
    title: "Schedule",
    body: "Places each step around the five daily prayer windows and honest daily capacity.",
    Icon: ScheduleIcon,
  },
];

const FlowNode = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div
    style={{
      width: "100%",
      maxWidth: 560,
      border: `1px solid ${accent ? "var(--color-accent)" : "var(--color-divider)"}`,
      borderRadius: "var(--radius-md)",
      padding: "var(--space-4) var(--space-6)",
      textAlign: "center",
      background: accent
        ? "color-mix(in srgb, var(--color-accent) 10%, transparent)"
        : "color-mix(in srgb, var(--color-surface) 60%, transparent)",
    }}
  >
    <div
      className={accent ? undefined : "text-muted"}
      style={{
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: 4,
        color: accent ? "var(--color-accent-300)" : undefined,
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 16, fontFamily: accent ? "var(--font-heading)" : undefined, fontWeight: accent ? 500 : undefined }}>
      {value}
    </div>
  </div>
);

const FlowArrow = () => (
  <ArrowIcon size={22} style={{ color: "var(--color-accent)", margin: "var(--space-3) 0", transform: "rotate(90deg)" }} />
);

export const Agentic = () => (
  <section id="agentic" className="section">
    <h6 className="eyebrow">02 — Agentic systems</h6>
    <h2 style={{ fontSize: "clamp(28px,4.2vw,48px)", letterSpacing: "-0.02em", maxWidth: "20ch", margin: "0 0 var(--space-4)" }}>
      Nidham (نظام) — a planner for Muslims with ADHD
    </h2>
    <p className="text-muted" style={{ fontSize: 16, lineHeight: 1.65, maxWidth: "60ch", margin: "0 0 var(--space-8)" }}>
      For people with ADHD the hardest part of a task is the pre-work: deciding what to do, when to do it, and
      how to start. That barrier is where most planners lose their users — they demand exactly the input the
      user can&apos;t produce. Nidham takes a plain-language brain-dump and moves the burden of sorting,
      sequencing and scheduling off the user and onto an agent. I designed and built it end to end in 48
      hours: React Native and Expo on the front, Supabase for auth and sync, and an n8n backend doing the
      thinking.
    </p>

    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      <FlowNode label="Input" value="A plain-language brain-dump" />
      <FlowArrow />

      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "var(--space-4)",
        }}
      >
        {agents.map(({ kicker, title, body, Icon }, i) => (
          <Reveal key={kicker} delay={i * 0.09} style={{ height: "100%" }}>
            <div
              className="card elev-sm card-hover"
              style={{ borderTop: "2px solid var(--color-accent)", gap: "var(--space-3)", height: "100%" }}
            >
              <Icon size={26} style={{ color: "var(--color-accent)" }} />
              <div className="card-kicker">{kicker}</div>
              <div className="card-title">{title}</div>
              <p className="card-body">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <FlowArrow />
      <FlowNode label="Output" value="A prioritized, sequenced, scheduled list" accent />
    </div>

    {/* The thin-client design principle */}
    <p
      className="text-muted"
      style={{ fontSize: 14, lineHeight: 1.6, maxWidth: "60ch", margin: "var(--space-8) 0 0", fontStyle: "italic" }}
    >
      Design principle: keep the client thin, put the intelligence in orchestrated agents. The product gets
      smarter by improving the workflow, not by shipping a heavier app.
    </p>
  </section>
);
