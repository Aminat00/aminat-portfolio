"use client";

import { createElement, useRef, type ReactNode } from "react";
import { useScrollProgress } from "./use-scroll-progress";

const RISE = 16; // px a line rises
const BLUR = 6; // px of blur a line sharpens from
const WINDOW = 0.55; // share of the block's progress one line takes, when there are several; the rest staggers them

const smoothstep = (x: number) => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
};

/**
 * Each direct child is one line. As the block's top moves from 90% to 50% of the screen its lines,
 * one after another, rise up to 16px and sharpen from a 6px blur; scrolling back sinks them again.
 * A line at rest carries no style at all, so with JavaScript off, under reduced motion and once
 * it has arrived it is plain markup. Transform, opacity and filter only: nothing shifts the layout.
 * A line holding focus always shows (globals.css).
 */
export function ScrollReveal({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "ul";
}): JSX.Element {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref, 0.9, 0.5, (p) => {
    const lines = ref.current?.children;
    if (!lines) return;
    const n = lines.length;
    const span = n > 1 ? WINDOW : 1;
    const step = n > 1 ? (1 - WINDOW) / (n - 1) : 0;
    for (let i = 0; i < n; i++) {
      const k = smoothstep((p - i * step) / span);
      const s = (lines[i] as HTMLElement).style;
      // Within 1% of either end a line is at rest: scroll positions land on whole pixels, so the
      // last hundredth would otherwise leave a sub-pixel transform on an arrived line.
      if (k >= 0.99 || k <= 0.01) {
        s.opacity = k >= 0.99 ? "" : "0";
        s.transform = "";
        s.filter = "";
      } else {
        s.opacity = k.toFixed(3);
        s.transform = `translate3d(0, ${((1 - k) * RISE).toFixed(2)}px, 0)`;
        s.filter = `blur(${((1 - k) * BLUR).toFixed(2)}px)`;
      }
    }
  });
  return createElement(as, { ref, className: className ? `reveal ${className}` : "reveal" }, children);
}
