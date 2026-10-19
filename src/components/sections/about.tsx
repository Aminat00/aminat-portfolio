import { ABOUT } from "@/content/site";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

// A few plain lines after the work. No photo.
export function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="section-inner">
        <ScrollReveal className="section-head">
          <h2 id="about-title">About</h2>
        </ScrollReveal>
        <ScrollReveal className="about">
          {ABOUT.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
