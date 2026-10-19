import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { CASES, type Case } from "@/content/site";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

/** Company, role, year, stack and result: the same row on a card and at the top of a case page. */
export function CaseFacts({ c }: { c: Case }) {
  return (
    <dl className="facts">
      <div>
        <dt>Company</dt>
        <dd>{c.company}</dd>
      </div>
      <div>
        <dt>Role</dt>
        <dd>{c.role}</dd>
      </div>
      <div>
        <dt>Year</dt>
        <dd>{c.year}</dd>
      </div>
      <div>
        <dt>Stack</dt>
        <dd>
          <ul className="facts-stack">
            {c.stack.map((s) => (
              <li className="tag" key={s}>
                {s}
              </li>
            ))}
          </ul>
        </dd>
      </div>
      <div>
        <dt>Result</dt>
        <dd>{c.result}</dd>
      </div>
    </dl>
  );
}

// Plain markup, readable with JavaScript off. The whole card is one link (see .case-link::after). With
// JavaScript each card rises in whole as it comes up the screen: the card already anchors that stretched
// link, so moving the card moves nothing inside it (moving the link alone would shift its click area).
export function SelectedWork() {
  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <div className="section-inner">
        <ScrollReveal className="section-head">
          <h2 id="work-title">Selected work</h2>
        </ScrollReveal>
        <div className="cases">
          {CASES.map((c) => (
            <ScrollReveal className="case-slot" key={c.slug}>
              <article id={`case-${c.slug}`} className="case-card">
                <h3>{c.title}</h3>
                <CaseFacts c={c} />
                <p className="case-summary">{c.summary}</p>
                <Link href={`/work/${c.slug}`} className="case-link" aria-label={`Read the case: ${c.title}`}>
                  Read the case <ArrowIcon size={13} />
                </Link>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
