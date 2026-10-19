import { ArrowIcon } from "@/components/icons";
import { CONTACT, LINKS } from "@/content/site";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

const out = <ArrowIcon size={13} style={{ transform: "rotate(-45deg)" }} />;

// The email first, as plain text a reader can copy, then the other ways in. No form.
export function Contact() {
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="section-inner">
        <ScrollReveal className="section-head">
          <h2 id="contact-title">Contact</h2>
        </ScrollReveal>
        <ScrollReveal className="contact">
          <a href={LINKS.email} className="contact-email">
            {/* When it has to wrap, it wraps after the @, never inside a word. */}
            {LINKS.emailText.split("@")[0]}@<wbr />
            {LINKS.emailText.split("@")[1]}
          </a>
          <div className="contact-links">
            <a href={LINKS.linkedin} target="_blank" rel="noopener" className="btn btn-secondary">
              LinkedIn {out}
            </a>
            <a href={LINKS.github} target="_blank" rel="noopener" className="btn btn-secondary">
              GitHub {out}
            </a>
            <a href={LINKS.resume} className="btn btn-secondary">
              Résumé
            </a>
          </div>
          <p className="contact-note">{CONTACT.availability}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
