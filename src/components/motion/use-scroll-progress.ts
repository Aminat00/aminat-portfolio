"use client";

import { useEffect, useRef, type MutableRefObject, type RefObject } from "react";

/**
 * One element's scroll progress, 0 to 1, as its top moves from `start` to `end` of the viewport
 * height (fractions; `end` can also be worked out from the element, as the experience line does).
 * One passive scroll listener and at most one frame per scroll; no React state, so nothing
 * re-renders. Positions are measured once (and again on resize), never per frame.
 *
 * The range bends to fit the page: an element already past `start` at the top of the page is
 * always in (it never starts hidden), and one whose top cannot climb to `end` reaches 1 at the
 * bottom of the page. Without film-js (JavaScript off, or reduced motion: layout.tsx) nothing
 * runs, `onChange` is never called and the value stays 1.
 */
export function useScrollProgress(
  ref: RefObject<Element>,
  start = 0.9,
  end: number | ((el: Element) => number) = 0.5,
  onChange?: (progress: number) => void,
): MutableRefObject<number> {
  const progress = useRef(1);
  const changed = useRef(onChange);
  changed.current = onChange;

  useEffect(() => {
    const el = ref.current;
    if (!el || !document.documentElement.classList.contains("film-js")) return;
    let from = 0; // scrollY at progress 0
    let to = 1; // scrollY at progress 1
    let always = false;
    let raf = 0;

    const update = () => {
      raf = 0;
      const p = always ? 1 : Math.min(1, Math.max(0, (window.scrollY - from) / (to - from)));
      if (p === progress.current) return;
      progress.current = p;
      changed.current?.(p);
    };
    const layout = () => {
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const max = document.documentElement.scrollHeight - vh;
      to = Math.min(top - (typeof end === "function" ? end(el) : end) * vh, max);
      from = Math.min(top - start * vh, to - 0.2 * vh);
      always = top - start * vh < 0;
      update();
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    layout();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", layout);
    // Fonts and images that land late move everything below them.
    const ro = new ResizeObserver(layout);
    ro.observe(document.body);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", layout);
      ro.disconnect();
    };
  }, [ref, start, end]);

  return progress;
}
