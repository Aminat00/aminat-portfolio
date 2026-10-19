"use client";

import { useEffect, useRef } from "react";
import { ArrowIcon } from "@/components/icons";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { useScrollProgress } from "@/components/motion/use-scroll-progress";
import { EXPERIENCE, LINKS } from "@/content/site";

// The line's tip rides at this share of the screen height: the line grows from the timeline's top
// reaching it until its bottom does, so its progress runs over the timeline's own height.
const TIP = 0.6;
const lineEnd = (el: Element) => TIP - (el as HTMLElement).offsetHeight / window.innerHeight;

type Role = (typeof EXPERIENCE)[number];

// Consecutive roles at one company form a group: LaunchGood's three roles sit under one heading,
// every other role is a row that names its own company.
const groups: Role[][] = [];
for (const e of EXPERIENCE) {
  const last = groups[groups.length - 1];
  if (last && last[0].company === e.company) last.push(e);
  else groups.push([e]);
}

function RoleRow({ e, grouped }: { e: Role; grouped: boolean }) {
  const Title = grouped ? "h4" : "h3";
  return (
    <li className="timeline-role">
      <p className="timeline-when">{e.when}</p>
      <span className="timeline-dot" aria-hidden="true" />
      <div className="timeline-body">
        <Title className="timeline-title">{e.role}</Title>
        {!grouped && <p className="timeline-co">{e.company}</p>}
        <p className="timeline-text">{e.line}</p>
        <ul className="timeline-tags" aria-label="Stack">
          {e.tags.map((t) => (
            <li className="tag" key={t}>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

// Plain markup, readable with JavaScript off. With it the line grows down the page with the scroll, and each
// role's dot lights (loses .is-off) as the line's tip reaches it. At rest the line is whole and every dot lit.
export function Experience() {
  const timeline = useRef<HTMLDivElement>(null);
  const dots = useRef<{ el: HTMLElement; at: number }[]>([]);
  // Where each dot sits down the line, as a share of its length.
  useEffect(() => {
    const el = timeline.current;
    if (!el) return;
    const measure = () => {
      const top = el.getBoundingClientRect().top;
      dots.current = Array.from(el.querySelectorAll<HTMLElement>(".timeline-dot"), (d) => {
        const r = d.getBoundingClientRect();
        return { el: d, at: (r.top + r.height / 2 - top) / el.offsetHeight };
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useScrollProgress(timeline, TIP, lineEnd, (p) => {
    timeline.current?.querySelector<HTMLElement>(".timeline-line")?.style.setProperty("transform", `scaleY(${p.toFixed(4)})`);
    for (const d of dots.current) d.el.classList.toggle("is-off", p < d.at);
  });

  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="section-inner">
        <ScrollReveal className="section-head">
          <h2 id="experience-title">Experience</h2>
        </ScrollReveal>
        <div className="timeline" ref={timeline}>
          <span className="timeline-line" aria-hidden="true" />
          <ol className="timeline-groups">
            {groups.map((g) => (
              <li className="timeline-group" key={g[0].company + g[0].when}>
                {g.length > 1 && <h3 className="timeline-company">{g[0].company}</h3>}
                <ol className="timeline-roles">
                  {g.map((e) => (
                    <RoleRow key={e.when} e={e} grouped={g.length > 1} />
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </div>
        <a href={LINKS.resume} className="text-link">
          View full résumé (PDF) <ArrowIcon size={13} style={{ transform: "rotate(90deg)" }} />
        </a>
      </div>
    </section>
  );
}
