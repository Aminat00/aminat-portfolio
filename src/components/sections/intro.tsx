import { ArrowIcon } from "@/components/icons";
import { INTRO, LINKS } from "@/content/site";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

const out = <ArrowIcon size={13} style={{ transform: "rotate(-45deg)" }} />;

// The first plain section after the film: who she is in two sentences, then the ways to reach her.
// The two lines rise in as the section comes up over the crystal.
export function Intro() {
  return (
    <section id="intro" className="section intro" aria-label="Introduction">
      <ScrollReveal className="section-inner">
        <p className="intro-text">{INTRO.text}</p>
        <div className="intro-links">
          <a href={LINKS.email} className="btn btn-primary">
            Email me
          </a>
          <a href={LINKS.resume} className="btn btn-secondary">
            Résumé
          </a>
          <a href={LINKS.linkedin} target="_blank" rel="noopener" className="btn btn-ghost">
            LinkedIn {out}
          </a>
          <a href={LINKS.github} target="_blank" rel="noopener" className="btn btn-ghost">
            GitHub {out}
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
