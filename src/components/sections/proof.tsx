"use client";

import { useEffect, useRef } from "react";
import { NUMBERS } from "@/content/site";

/** Counts a number up once, when it enters view. Reduced motion shows the final value. */
function Count({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / 1600);
          const eased = 1 - Math.pow(1 - t, 3);
          const next = String(Math.round(eased * value));
          if (el.textContent !== next) el.textContent = next;
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return <span ref={ref}>{value}</span>;
}

// Four numbers, each a link to the case (or the timeline) it comes from. Words, like
// "Days to minutes", are not counted and sit at a smaller size.
export function Proof() {
  return (
    <section className="section proof-section" aria-label="In numbers">
      <div className="section-inner">
        <ul className="proof">
          {NUMBERS.map((n) => (
            <li key={n.label}>
              <a href={n.href} className="proof-item">
                <span className={`proof-num${typeof n.value === "string" ? " proof-num-words" : ""}`}>
                  {n.prefix && <small className="proof-prefix">{n.prefix}</small>}
                  {typeof n.value === "number" ? <Count value={n.value} /> : n.value}
                  {n.suffix && <small>{n.suffix}</small>}
                </span>
                <span className="proof-label">{n.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
