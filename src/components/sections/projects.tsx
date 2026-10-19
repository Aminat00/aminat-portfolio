import { ArrowIcon } from "@/components/icons";
import { PROJECTS } from "@/content/site";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

// One row per project: name, one line, and a link when there is something to try.
export function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="section-inner">
        <ScrollReveal className="section-head">
          <h2 id="projects-title">Projects</h2>
        </ScrollReveal>
        <ScrollReveal as="ul" className="projects">
          {PROJECTS.map((p) => (
            <li className="project" key={p.name}>
              <h3>{p.name}</h3>
              <p>{p.line}</p>
              {p.href && (
                <a href={p.href} target="_blank" rel="noopener" className="text-link">
                  {p.linkLabel} <ArrowIcon size={13} style={{ transform: "rotate(-45deg)" }} />
                </a>
              )}
            </li>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
