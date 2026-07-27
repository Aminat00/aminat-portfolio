"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import CountUp from "react-countup";

const stats = [
  { value: 5, prefix: "", suffix: "", label: "Years engineering" },
  { value: 100, prefix: "", suffix: "+", label: "Countries served" },
  { value: 5, prefix: "", suffix: " min", label: "Synthetic test cadence" },
  { value: 7, prefix: "~", suffix: " hrs", label: "Weekly manual work removed" },
];

export const StatBand = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // Fires on mount if already in view; counts once when the band is reached.
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  return (
    <section className="section-band" style={{ margin: "clamp(24px,4vw,48px) 0" }}>
      <div
        ref={ref}
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "clamp(40px,6vw,72px) clamp(20px,5vw,64px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: "clamp(24px,4vw,48px)",
        }}
      >
        {stats.map((stat) => (
          <div key={stat.label}>
            <div
              style={{
                fontSize: "clamp(40px,6vw,72px)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                fontFamily: "var(--font-heading)",
                fontWeight: 500,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {stat.prefix}
              {reduce || !inView ? (
                stat.value
              ) : (
                <CountUp start={0} end={stat.value} duration={1.8} />
              )}
              {stat.suffix && <span style={{ color: "var(--color-accent-300)" }}>{stat.suffix}</span>}
            </div>
            <div className="stat-band-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
