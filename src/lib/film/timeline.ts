export type CaptionId = "intro" | "grit" | "ownership" | "delivery";

/** `from`/`to` are film seconds; `screens` is how much scroll the segment takes. */
export type Segment = { from: number; to: number; screens: number; caption?: CaptionId };

export const FILM_DURATION = 20.04;

/** Caption fade timing, in screens: wait `lead` after the hold starts, then fade over `length`. */
export const FADE = { lead: 0.05, length: 0.25 };

export const FILM_SEGMENTS: readonly Segment[] = [
  { from: 0, to: 1.8, screens: 1.8, caption: "intro" },
  { from: 1.8, to: 4.0, screens: 0.8 },
  { from: 4.0, to: 6.2, screens: 2.2, caption: "grit" },
  { from: 6.2, to: 10.4, screens: 1.4 },
  { from: 10.4, to: 12.2, screens: 2.2, caption: "ownership" },
  { from: 12.2, to: 15.4, screens: 2.2 },
  { from: 15.4, to: 17.4, screens: 1.8 },
  { from: 17.4, to: 20.04, screens: 2.6, caption: "delivery" },
];

/** The crystal's seconds: from here on the last rock has left the frame. */
export const CRYSTAL_FROM = 17.8;

/**
 * Film time behind the sections, for `progress` 0 to 1 through the page after the stage: from the
 * last frame back to CRYSTAL_FROM at the middle and forward to the last frame at the end, so the
 * crystal keeps turning gently and meets the stage's last frame without a jump.
 */
export function crystalSwing(progress: number): number {
  const p = Math.min(1, Math.max(0, progress));
  return FILM_DURATION - (FILM_DURATION - CRYSTAL_FROM) * Math.sin(Math.PI * p);
}

export function totalScreens(segments: readonly Segment[] = FILM_SEGMENTS): number {
  return segments.reduce((sum, s) => sum + s.screens, 0);
}

export function filmTimeAt(screens: number, segments: readonly Segment[] = FILM_SEGMENTS): number {
  const end = segments[segments.length - 1].to;
  if (screens <= 0) return segments[0].from;
  let start = 0;
  for (const s of segments) {
    if (screens < start + s.screens) {
      const t = s.from + ((s.to - s.from) * (screens - start)) / s.screens;
      return Math.min(s.to, t);
    }
    start += s.screens;
  }
  return end;
}

const smoothstep = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

/** 0 to 1 per caption. Only the caption whose hold contains `screens` can be above 0. */
export function captionStrengths(
  screens: number,
  segments: readonly Segment[] = FILM_SEGMENTS,
): Record<CaptionId, number> {
  const out: Record<CaptionId, number> = { intro: 0, grit: 0, ownership: 0, delivery: 0 };
  const { lead, length } = FADE;
  let start = 0;
  for (const s of segments) {
    const x = screens - start;
    if (x < s.screens || s === segments[segments.length - 1]) {
      if (s.caption && x >= 0) {
        const fadeIn = smoothstep((x - lead) / length);
        const fadeOut = smoothstep((s.screens - lead - x) / length);
        out[s.caption] = Math.min(fadeIn, fadeOut);
      }
      break;
    }
    start += s.screens;
  }
  return out;
}

/** Frame-rate independent easing. Snaps when nearly there, or when the jump is too big to animate. */
export function smoothToward(
  current: number,
  target: number,
  dtMs: number,
  tauMs = 150,
  snapDistance = Infinity,
): number {
  const gap = Math.abs(target - current);
  if (gap < 0.05 || gap > snapDistance) return target;
  return current + (target - current) * (1 - Math.exp(-dtMs / tauMs));
}
