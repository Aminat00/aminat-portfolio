import type { CSSProperties } from "react";

/**
 * The AM mark as a signal line. Three faint dots (noise) lead into one
 * continuous stroke: one peak for the A, with its crossbar in amber, and two
 * peaks for the M. The same shape is the favicon.
 */
export const Mark = ({ style }: { style?: CSSProperties }) => (
  <svg viewBox="0 0 68 40" aria-hidden="true" style={style}>
    <g fill="currentColor">
      <circle cx="3" cy="26" r="1.4" opacity="0.35" />
      <circle cx="9" cy="16" r="1.6" opacity="0.55" />
      <circle cx="14" cy="30" r="1.8" opacity="0.8" />
    </g>
    <path
      d="M18 33 L26 7 L34 33 L42 7 L50 33 L58 7 L66 33"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M22.2 22 L29.8 22" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

/** The section divider: dots on the left resolve into a single thread on the right. */
export const SignalDivider = () => (
  // No viewBox: px coordinates keep the dots round at every width, and the thread runs to the edge.
  <svg width="100%" height="24" aria-hidden="true">
    <g className="dots" fill="var(--signal)">
      <circle cx="4" cy="18" r="1.6" opacity=".35" />
      <circle cx="22" cy="6" r="1.8" opacity=".45" />
      <circle cx="42" cy="14" r="1.5" opacity=".5" />
      <circle cx="64" cy="20" r="2" opacity=".6" />
      <circle cx="88" cy="8" r="1.6" opacity=".7" />
      <circle cx="112" cy="16" r="2" opacity=".8" />
      <circle cx="136" cy="11" r="1.7" opacity=".9" />
      <circle cx="160" cy="13" r="2" />
    </g>
    <line className="thread" x1="172" y1="12" x2="100%" y2="12" stroke="var(--signal)" strokeWidth="1" pathLength={1} opacity=".6" />
  </svg>
);
