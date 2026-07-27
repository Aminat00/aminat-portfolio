import { ArrowIcon } from "@/components/icons";

const CV_URL = "https://aminatmoldalieva.com/my-cv.pdf";

const meta = [
  {
    term: "Currently",
    detail: (
      <>
        Rebuilding a fintech app at <span style={{ color: "var(--color-text)" }}>LaunchGood</span>
      </>
    ),
  },
  { term: "Focus", detail: <>React Native · TypeScript · Automation</> },
  { term: "Location", detail: <>Remote · EMEA</> },
  { term: "Languages", detail: <>English · Kyrgyz · Turkish · Russian · Polish</> },
  {
    term: "Education",
    detail: (
      <>
        B.Eng Computer Engineering
        <br />
        <span className="text-muted">Vistula University, Warsaw</span>
      </>
    ),
  },
  {
    term: "Status",
    detail: (
      <>
        <span style={{ color: "var(--color-accent-300)" }}>●</span> Open to full-time roles
      </>
    ),
  },
];

export const About = () => (
  <section id="about" className="section">
    <h6 className="eyebrow">01 — About</h6>
    <div className="about-grid">
      <div>
        <h2
          style={{
            fontSize: "clamp(26px,3.4vw,40px)",
            letterSpacing: "-0.02em",
            maxWidth: "18ch",
            margin: "0 0 var(--space-6)",
          }}
        >
          I end up owning the parts next to the feature.
        </h2>
        <p className="text-muted" style={{ fontSize: 16, lineHeight: 1.65, maxWidth: "58ch", margin: "0 0 var(--space-4)" }}>
          Most of my work is React Native and TypeScript — right now, rebuilding screens for a fintech app used
          in 100+ countries. But the work I&apos;ve been most useful for usually sits beside the feature itself.
          At LaunchGood I built the company&apos;s first Playwright end-to-end suite from scratch and put it on a
          five-minute CI cron with Slack alerts, so breakages surface before a user reports them. At Aurem I
          automated the Expo release pipeline and took about seven hours a week of manual work off the team, and
          migrated the frontend from Chakra to Tailwind. At HCL I worked on micro-frontends inside a shared
          shell serving two million users.
        </p>
        <p className="text-muted" style={{ fontSize: 16, lineHeight: 1.65, maxWidth: "58ch", margin: "0 0 var(--space-4)" }}>
          I use AI tooling heavily and deliberately. Coding agents drive the first pass on feature work and I
          review what comes back against real devices and real edge cases — which is most of why work that used
          to take weeks now lands in days. Nidham was the clearest test of that: a full React Native app and a
          three-agent n8n backend, designed and shipped in 48 hours.
        </p>
        <p className="text-muted" style={{ fontSize: 16, lineHeight: 1.65, maxWidth: "58ch", margin: 0 }}>
          Almost everything on this page started as something a project needed and I hadn&apos;t done before —
          NestJS, Playwright, micro-frontends, n8n. I learn it while shipping it. That&apos;s the pattern, and
          it&apos;s the part I&apos;d want a team to hire.
        </p>
      </div>

      <div className="card elev-sm about-meta" style={{ padding: "var(--space-6)" }}>
        <div className="card-kicker" style={{ marginBottom: "var(--space-1)" }}>At a glance</div>
        <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "auto 1fr", gap: "var(--space-4) var(--space-6)" }}>
          {meta.map((row) => (
            <div key={row.term} style={{ display: "contents" }}>
              <dt className="text-muted" style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {row.term}
              </dt>
              <dd style={{ margin: 0, fontSize: 15 }}>{row.detail}</dd>
            </div>
          ))}
        </dl>
        <div className="hr" style={{ margin: "var(--space-3) 0 var(--space-2)" }} />
        <a href={CV_URL} className="btn btn-secondary btn-block" style={{ fontSize: 14 }}>
          <ArrowIcon size={15} style={{ transform: "rotate(90deg)" }} /> Download CV
        </a>
      </div>
    </div>
  </section>
);
