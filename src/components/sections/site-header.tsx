"use client";

import { useEffect, useState } from "react";

const navLinks = [
  { href: "#about", id: "about", label: "About" },
  { href: "#agentic", id: "agentic", label: "Nidham" },
  { href: "#work", id: "work", label: "Work" },
  { href: "#experience", id: "experience", label: "Experience" },
];

export const SiteHeader = () => {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    // A thin band across the upper-middle of the viewport marks the "current" section.
    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top) setActive(top.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--color-bg)",
        borderBottom: "1px solid var(--color-divider)",
      }}
    >
      <nav
        className="nav"
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          width: "100%",
          paddingLeft: "clamp(20px,5vw,64px)",
          paddingRight: "clamp(20px,5vw,64px)",
        }}
      >
        <a href="#top" className="nav-brand" style={{ color: "var(--color-text)" }}>
          aminat<span style={{ color: "var(--color-accent)" }}>.</span>
        </a>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            data-navlink=""
            aria-current={active === link.id ? "page" : undefined}
          >
            {link.label}
          </a>
        ))}
        <a href="#contact" className="btn btn-primary" style={{ marginLeft: "var(--space-2)" }}>
          Get in touch
        </a>
      </nav>
    </header>
  );
};
