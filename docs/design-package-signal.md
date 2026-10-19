# Design package: Signal (live WebGL field)

## 1. Brand premise

**Signal.** Aminat's work follows one pattern: messy input goes in, order comes out. A brain-dump becomes a scheduled list (Nidham). A silent breakage becomes a Slack alert in five minutes (Playwright). Seven manual hours become one pipeline (Aurem). Every section teaches that one idea: noise becomes signal.

Signature element: the **noise-to-signal line**. Scattered dots that resolve into one clean thread. It appears in the hero footage, the AM mark, the work-card glyphs, the section dividers, and the hold interaction.

## 2. Palette (direction; final values sampled from approved footage)

```css
:root{
  --canvas:#070d16;        /* ink blue-black, tinted to the footage */
  --panel:#0e1826;
  --accent:#ffb454;        /* amber, CTA and rare emphasis only */
  --accent-hover:#ffc577;
  --accent-muted:#ffb45433;
  --signal:#8fd3ff;        /* ice-blue light from the footage */
  --text-secondary:#9fb2c8;
  --text-primary:#eaf3fb;
}
```

Deviation said out loud: the skill lists near-black plus amber plus a serif as a default AI look. This build keeps amber only as a rare accent, uses no serif, and the dominant color is the footage's own ice blue.

## 3. Type trio

- Display: **Syne** 600, 700
- Body: **Instrument Sans** 400, 500, 600
- Mono labels: **JetBrains Mono** 400, 500

## 4. The field (replaces the filmed hero, 2026-10-05)

The hero is real-time code, not footage: `src/components/hero/field.ts` draws ~22,000 short
strokes of ice-blue light as WebGL point sprites (9,000 on phones) and morphs them between
target shapes as the visitor scrolls. Sequence: noise cloud → globe of flow lines → phone
outline → network graph → the AM monogram → one straight line with a single amber pulse →
a dim ambient cloud that stays behind every section of the page. Each morph eases per
particle with a stagger and an outward swing; the camera swings a little mid-morph and
returns to a front view at every hold. Reduced motion draws one still frame (the line).
Zero generation credits. The earlier AI footage (particles, Noise Floor keyframes) is unused.

## 4b. Band map (hero 560vh desktop, 640svh phones)

| Band | Range (starting point) | Footage moment | Copy (verbatim) | Entrance |
|---|---|---|---|---|
| 1 | 0.00 to 0.30 | chaotic swirling particles | Kicker: "Software engineer. Mobile, web and automation." Headline: "Aminat Moldalieva" Sub: "I build mobile and web apps, and the automation around them." | Scatter (letters gather like the particles), load ramp |
| 2 | 0.36 to 0.64 | particles slowing, spreading out | "Messy input goes in. Order comes out." | Drift-settle (words sink into place as the particles slow) |
| 3 | 0.70 to 1.00 | calm, evenly spaced still field | Headline: "Signal, shipped." Sub: "Five years of React Native and TypeScript. Now rebuilding a fintech app used in 100+ countries." CTA: "Message me on LinkedIn" / "See the work" | Word-by-word rise into staged settle |

Text lives in the calm left third. Action lane center-right stays clear.

## 5. Static hero copy (phones, reduced motion)

Kicker: "Software engineer. Mobile, web and automation."
Headline: "Aminat Moldalieva"
Sub: "I build mobile and web apps, and the automation around them."
CTA: "Message me on LinkedIn" / "See the work"
Over the ending frame.

## 6. Below the fold

1. **Proof** (numbers row): "5 years engineering" / "100+ countries served" / "5 min from breakage to alert" / "~7 hrs of manual work removed weekly"
2. **Nidham, the interactive moment** (`#nidham`): Kicker "Try it". Headline "Hold to sort the noise." Sub "Nidham is a planner for Muslims with ADHD. You brain-dump. Three agents capture, research, and schedule it around the five daily prayers. Built in 48 hours." Button "Press and hold". Done state: "Sorted. That is the whole product." Tag: "Coming soon".
   Noise chips: "call mom", "taxes??", "gym, maybe", "finish the deck", "buy rice", "email landlord". Sorted rows: "After Fajr · Finish the deck", "After Dhuhr · Email landlord", "After Dhuhr · Taxes, step one", "After Asr · Gym", "After Maghrib · Call mom", "Tomorrow · Buy rice".
3. **Work** (`#work`): Headline "Noise in. Signal out." Four cards, each Before / After:
   - LaunchGood, mobile: "Before: an aging app in 100+ countries." "After: core screens rebuilt, tested, shipped." Tags: React Native, TypeScript, Jest
   - LaunchGood, QA: "Before: users found the bugs first." "After: a Slack alert in under five minutes." Tags: Playwright, GitHub Actions, Slack
   - Aurem: "Before: seven hours of manual builds a week." "After: one pipeline. Zero clicks." Tags: Expo, GitHub Actions, NestJS
   - AI Interview Coach (prototype): "Before: practicing interviews alone." "After: a video interviewer that talks back." Tags: ElevenLabs, HeyGen, LiveKit
4. **Path** (`#path`): Headline "Six years, one direction." Rows: role, company, period, one line.
5. **About** (`#about`): "I end up owning the parts next to the feature." Body: "Tests, release pipelines, agent workflows. Coding agents do my first pass, and I check it against real devices. I learn the new thing while shipping it." Meta: Remote · EMEA / English · Kyrgyz · Turkish · Russian · Polish / B.Eng Computer Engineering.
6. **Closing CTA** (`#contact`): "Got noise?" "Let's find the signal." Sub: "Open to full-time roles where mobile, web and automation meet." CTA "Message me on LinkedIn". Secondary: "Download CV", "GitHub".
7. Footer: AM mark, "© year Aminat Moldalieva", "Hero imagery is AI generated."

No form. CTA links straight to LinkedIn.

## 7. Vector layer

- AM monogram: scattered dots resolving into one stroke (favicon, nav, footer).
- Section dividers: a self-drawing line that starts as dots and ends as a solid thread.
- Work-card glyphs: four small hand-drawn SVGs, left half scattered, right half ordered.
- Fixed environment layer: soft ice-blue glow drifting at 90s, plus grain.
- Reduced motion: all final states, no drives.

## 8. Engineering list

Blob fetch (clip under 8 MB, plain form) with poster first, dt-normalized lerp, gated seeks, delta-gated DOM writes, band pacing with flick test, four-layer legibility, five static-hero gates live, complete without video, quality floor. Ported into a React client component; logic stays vanilla inside one effect.

## 9. Copy gate

Every line above ships verbatim. Zero em dashes, zero stock words, AI-tell sweep. Designed devices that stay: "Noise in. Signal out.", Before / After pairs, "One pipeline. Zero clicks."
