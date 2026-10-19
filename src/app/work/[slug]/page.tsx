import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import { CaseDiagram } from "@/components/diagrams/case-diagram";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { CaseFacts } from "@/components/sections/selected-work";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { CASES } from "@/content/site";

// Only the three known cases exist; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = CASES.find((x) => x.slug === params.slug);
  return c ? { title: `${c.title} · Aminat Moldalieva`, description: c.summary } : {};
}

export default function CasePage({ params }: { params: { slug: string } }) {
  const c = CASES.find((x) => x.slug === params.slug);
  if (!c) notFound();

  const back = (
    <Link href="/#work" className="case-back">
      <ArrowIcon size={13} style={{ transform: "rotate(180deg)" }} /> Back to selected work
    </Link>
  );

  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="case-page">
        <article className="case">
          {back}
          {/* At the top of the page, so always in; each block below rises in as it comes up the screen. */}
          <ScrollReveal as="header" className="case-head">
            <h1>{c.title}</h1>
            <CaseFacts c={c} />
          </ScrollReveal>
          <div className="case-body">
            <ScrollReveal as="section" className="case-block">
              <h2>The problem</h2>
              <p>{c.problem}</p>
            </ScrollReveal>
            <ScrollReveal as="section" className="case-block">
              <h2>What I did</h2>
              <ul>
                {c.did.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal as="section" className="case-block">
              <h2>The key decision</h2>
              <p>{c.decision}</p>
            </ScrollReveal>
            <ScrollReveal as="section" className="case-block case-result">
              <h2>The result</h2>
              <p>{c.outcome}</p>
            </ScrollReveal>
            <ScrollReveal as="section" className="case-block">
              <h2>{"What I'd do next"}</h2>
              <p>{c.next}</p>
            </ScrollReveal>
          </div>
          <figure className="case-figure">
            <CaseDiagram slug={c.slug} />
          </figure>
          {back}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
