"use client";

import { useEffect, useState } from "react";
import { MenuIcon, CloseIcon } from "@/components/icons";

const navLinks = [
  { href: "#about", id: "about", label: "About" },
  { href: "#agentic", id: "agentic", label: "Nidham" },
  { href: "#work", id: "work", label: "Work" },
  { href: "#experience", id: "experience", label: "Experience" },
];

export const SiteHeader = () => {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Scroll-spy: light the nav item for the section currently in the upper-middle band.
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

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

  // Close the mobile menu on Escape and once the viewport grows back to desktop.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 700 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const close = () => setOpen(false);

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
          paddingLeft: "max(clamp(20px,5vw,64px), env(safe-area-inset-left))",
          paddingRight: "max(clamp(20px,5vw,64px), env(safe-area-inset-right))",
        }}
      >
        <a href="#top" className="nav-brand" style={{ color: "var(--color-text)" }} onClick={close}>
          aminat<span style={{ color: "var(--color-accent)" }}>.</span>
        </a>

        {navLinks.map((link) => (
          <a key={link.href} href={link.href} data-navlink="" aria-current={active === link.id ? "page" : undefined}>
            {link.label}
          </a>
        ))}

        <a href="#contact" className="btn btn-primary" data-navcta="" style={{ marginLeft: "var(--space-2)" }}>
          Get in touch
        </a>

        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
        </button>
      </nav>

      <div id="mobile-menu" className="nav-mobile" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="nav-mobile-inner">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={close} aria-current={active === link.id ? "page" : undefined}>
              {link.label}
            </a>
          ))}
          <a href="#contact" className="btn btn-primary btn-block" onClick={close}>
            Get in touch
          </a>
        </div>
      </div>
    </header>
  );
};
