"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger offset in seconds. */
  delay?: number;
  /** Rise distance in px. */
  y?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Fade + rise once, when scrolled into view. Honors prefers-reduced-motion by
 * rendering the content statically. Exponential ease-out from an already-legible
 * default — used only where a stagger reads as intentional (collections, grids,
 * the timeline), never as a blanket entrance on every section.
 */
export function Reveal({ children, delay = 0, y = 16, className, style }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
