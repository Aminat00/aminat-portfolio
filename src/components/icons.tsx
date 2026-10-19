import type { CSSProperties } from "react";

type IconProps = {
  size?: number;
  className?: string;
  style?: CSSProperties;
};

/** Arrow — the design's single directional glyph, rotated per use-site. */
export const ArrowIcon = ({ size = 16, className, style }: IconProps) => (
  <svg
    viewBox="0 0 256 256"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
    className={className}
    style={style}
  >
    <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
  </svg>
);

/** Hamburger — mobile menu open. */
export const MenuIcon = ({ size = 22, className, style }: IconProps) => (
  <svg viewBox="0 0 256 256" width={size} height={size} fill="currentColor" aria-hidden="true" className={className} style={style}>
    <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
  </svg>
);

/** Close — mobile menu close. */
export const CloseIcon = ({ size = 22, className, style }: IconProps) => (
  <svg viewBox="0 0 256 256" width={size} height={size} fill="currentColor" aria-hidden="true" className={className} style={style}>
    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
  </svg>
);
