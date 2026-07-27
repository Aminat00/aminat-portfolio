import { ArrowIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";

const Tag = ({ label, variant = "neutral" }: { label: string; variant?: "accent" | "neutral" | "outline" }) => (
  <span className={`tag tag-${variant}`}>{label}</span>
);

const cardBase = { padding: "var(--space-6)", gap: "var(--space-4)", height: "100%" } as const;

// TODO: add public/nidham-workflow.png (an n8n canvas screenshot), then flip this to true.
const HAS_NIDHAM_WORKFLOW = false;

export const Work = () => (
  <section id="work" className="section">
    <h6 className="eyebrow">03 — Selected work</h6>
    <h2 style={{ fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-0.02em", maxWidth: "16ch", margin: "0 0 var(--space-8)" }}>
      Things I&apos;ve built and shipped
    </h2>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "var(--space-4)" }}>
      {/* 1 — Nidham. Image slot wired to /nidham-workflow.png; renders once HAS_NIDHAM_WORKFLOW is flipped. */}
      <Reveal delay={0} style={{ height: "100%" }}>
        <div className="card elev-sm card-hover" style={cardBase}>
          {HAS_NIDHAM_WORKFLOW && (
            <figure style={{ margin: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/nidham-workflow.png"
                alt="Nidham n8n workflow canvas — three agents wired in sequence"
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  objectFit: "cover",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-divider)",
                }}
              />
            </figure>
          )}
          <div className="card-kicker">n8n · Claude · Tavily</div>
          <div className="card-title">Nidham (نظام)</div>
          <p className="card-body">
            A planner for Muslims with ADHD. A plain-language brain-dump goes through three n8n agents — capture,
            research, schedule — and comes back as a prioritized list placed around the five daily prayers. Built
            in 48 hours.
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Tag label="n8n" variant="accent" />
            <Tag label="Claude" />
            <Tag label="Tavily" />
            <Tag label="React Native" />
            <Tag label="Supabase" />
          </div>
          <div style={{ display: "flex", gap: "var(--space-6)", flexWrap: "wrap", marginTop: "var(--space-1)" }}>
            <a href="#agentic" className="card-meta" style={{ color: "var(--color-accent)" }}>
              See how it works <ArrowIcon size={15} />
            </a>
            <a
              href="https://try.ka.nz/ai/aminatmoldalieva"
              target="_blank"
              rel="noopener"
              className="card-meta"
              style={{ color: "var(--color-accent)" }}
            >
              Read the case study <ArrowIcon size={15} style={{ transform: "rotate(-45deg)" }} />
            </a>
          </div>
        </div>
      </Reveal>

      {/* 2 — LaunchGood */}
      <Reveal delay={0.06} style={{ height: "100%" }}>
        <div className="card elev-sm card-hover" style={cardBase}>
          <div className="card-kicker">React Native · Fintech</div>
          <div className="card-title">LaunchGood mobile redesign</div>
          <p className="card-body">
            Rebuilt key screens and components for a fintech app serving millions across 100+ countries, shipping
            each screen end to end — API integration, state, UI and Jest component tests — with coding agents
            driving the first pass and me reviewing against real devices.
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Tag label="React Native" />
            <Tag label="TypeScript" />
            <Tag label="Jest" />
          </div>
        </div>
      </Reveal>

      {/* 3 — Synthetic QA */}
      <Reveal delay={0.12} style={{ height: "100%" }}>
        <div className="card elev-sm card-hover" style={cardBase}>
          <div className="card-kicker">Playwright · GitHub Actions</div>
          <div className="card-title">Synthetic QA at 5-minute cadence</div>
          <p className="card-body">
            Built a Playwright automation suite from scratch with reusable helpers, CI cron tests every 5 minutes,
            and instant Slack failure alerts — sharpening incident response.
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Tag label="Playwright" />
            <Tag label="CI/CD" />
            <Tag label="Slack" />
          </div>
        </div>
      </Reveal>

      {/* 4 — Freelance platforms */}
      <Reveal delay={0.18} style={{ height: "100%" }}>
        <div className="card elev-sm card-hover" style={cardBase}>
          <div className="card-kicker">Full-stack · Freelance</div>
          <div className="card-title">AI-driven mobile &amp; web platforms</div>
          <p className="card-body">
            Shipped OpenAI-powered mobile features and full-stack web platforms with Next.js, Supabase, tRPC and
            Prisma — plus a headless Shopify storefront.
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Tag label="Next.js" />
            <Tag label="OpenAI" />
            <Tag label="Supabase" />
          </div>
        </div>
      </Reveal>

      {/* 5 — AI Interview Coach (prototype). TODO: embed demo.mp4 once the 60s screen capture is recorded. */}
      <Reveal delay={0.24} style={{ height: "100%" }}>
        <div className="card elev-sm card-hover" style={cardBase}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-2)" }}>
            <div className="card-kicker">ElevenLabs · HeyGen · LiveKit</div>
            <Tag label="PROTOTYPE" variant="outline" />
          </div>
          <div className="card-title">AI Interview Coach</div>
          <p className="card-body">
            A voice-driven mock interviewer. An ElevenLabs conversational agent is wired to a HeyGen LiveAvatar
            over LiveKit, so you speak and a lip-synced video interviewer answers in real time. Working
            end-to-end demo.
          </p>
        </div>
      </Reveal>
    </div>
  </section>
);
