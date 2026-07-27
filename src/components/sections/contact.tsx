import { ArrowIcon } from "@/components/icons";

const CV_URL = "https://aminatmoldalieva.com/my-cv.pdf";

export const Contact = () => (
  <section id="contact" className="section-band" style={{ marginTop: "clamp(24px,4vw,48px)" }}>
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "clamp(56px,9vw,120px) clamp(20px,5vw,64px)" }}>
      <h6 style={{ color: "var(--color-accent-300)", margin: "0 0 var(--space-3)" }}>05 — Contact</h6>
      <h2 style={{ fontSize: "clamp(32px,5vw,60px)", letterSpacing: "-0.02em", maxWidth: "16ch", margin: "0 0 var(--space-6)" }}>
        Open to full-time opportunities.
      </h2>
      <p
        style={{
          fontSize: 17,
          lineHeight: 1.6,
          maxWidth: "48ch",
          margin: "0 0 var(--space-8)",
          color: "color-mix(in srgb, var(--color-text) 80%, transparent)",
        }}
      >
        If you&apos;re building something where mobile and automation both matter, I&apos;d like to hear about it.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "center" }}>
        <a
          href="https://www.linkedin.com/in/aminatmoldalieva/"
          target="_blank"
          rel="noopener"
          className="btn btn-primary"
          style={{ fontSize: 15, padding: "11px 20px", borderColor: "var(--color-accent-300)", color: "var(--color-accent-100)" }}
        >
          Connect on LinkedIn <ArrowIcon size={14} style={{ opacity: 0.7, transform: "rotate(-45deg)" }} />
        </a>
        <a
          href={CV_URL}
          className="btn btn-secondary"
          style={{ fontSize: 15, padding: "11px 20px", borderColor: "color-mix(in srgb, var(--color-text) 30%, transparent)" }}
        >
          <ArrowIcon size={16} style={{ transform: "rotate(90deg)" }} /> Download CV
        </a>
        <a
          href="https://github.com/Aminat00"
          target="_blank"
          rel="noopener"
          className="btn btn-secondary"
          style={{ fontSize: 15, padding: "11px 20px", borderColor: "color-mix(in srgb, var(--color-text) 30%, transparent)" }}
        >
          GitHub <ArrowIcon size={14} style={{ opacity: 0.7, transform: "rotate(-45deg)" }} />
        </a>
      </div>
    </div>
  </section>
);
