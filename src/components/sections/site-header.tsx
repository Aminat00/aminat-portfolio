"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Mark } from "@/components/brand/mark";
import { MenuIcon, CloseIcon } from "@/components/icons";
import { LINKS, NAV } from "@/content/site";

export const SiteHeader = () => {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  // On a case page the section links lead back to the home page.
  const home = usePathname() === "/";
  const base = home ? "" : "/";

  // Scroll-spy for the nav, and the header turns solid once the page leaves the top: on the home
  // page once the film is out from under the header (a solid bar would cover the stone), elsewhere
  // after 40px.
  useEffect(() => {
    const ids = NAV.map((l) => l.href.slice(1));
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);

    // The link whose section crosses the band at mid screen; none over the film, the intro or the numbers.
    const inBand = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inBand.add(e.target.id);
          else inBand.delete(e.target.id);
        }
        setActive(ids.find((id) => inBand.has(id)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));

    // Only the scroll-driven film keeps the bar clear; reduced motion shows a still that scrolls like any page.
    const film = document.documentElement.classList.contains("film-js") ? document.querySelector(".film") : null;
    let last = false;
    const onScroll = () => {
      const next = film ? film.getBoundingClientRect().bottom <= (navRef.current?.offsetHeight ?? 0) : window.scrollY > 40;
      if (next !== last) {
        last = next;
        setSolid(next);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 760 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`header${solid || open ? " solid" : home ? " over-film" : ""}`}>
      <nav className="nav" aria-label="Primary" ref={navRef}>
        <a href={home ? "#top" : "/"} className="nav-brand" onClick={close} aria-label="Aminat Moldalieva, home">
          <Mark style={{ color: "var(--signal)" }} />
          <span>Aminat Moldalieva</span>
        </a>

        {NAV.map((link) => (
          <a key={link.href} href={base + link.href} className="nav-link" aria-current={active === link.href.slice(1) ? "page" : undefined}>
            {link.label}
          </a>
        ))}

        <a href={LINKS.email} className="btn btn-secondary nav-email">
          Email
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

      <div id="mobile-menu" className={`nav-mobile${open ? " open" : ""}`}>
        <div className="nav-mobile-inner">
          {NAV.map((link) => (
            <a key={link.href} href={base + link.href} onClick={close} aria-current={active === link.href.slice(1) ? "page" : undefined}>
              {link.label}
            </a>
          ))}
          <a href={LINKS.email} className="btn btn-primary" onClick={close}>
            Email me
          </a>
        </div>
      </div>
    </header>
  );
};
