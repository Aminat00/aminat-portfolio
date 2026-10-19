# Cinematic Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the WebGL stroke-field hero with the approved 20-second scroll film and four captions, followed by plain recruiter-first sections (intro, three case studies with their own pages, experience, projects, about, contact).

**Architecture:** One pure timeline module maps scroll (in screens) to film time and caption strengths; it is unit-tested with Node's built-in runner. One client component pins a full-viewport video, seeks it from a smoothed playhead, and fades the four HTML captions from the timeline. All copy lives in one typed content module that every section renders and a copy-rules test guards. Browser behaviour is proven by Playwright check scripts against the dev server.

**Tech Stack:** Next.js 14.2.12 (app router), React 18, TypeScript, CSS in `src/app/globals.css`, ffmpeg + cwebp for assets, `node --test` for unit tests, Playwright (from the playwright-skill plugin) for browser checks.

**Spec:** `docs/superpowers/specs/2026-10-18-cinematic-portfolio-design.md`. Supporting research: `docs/research/2026-10-18-cinematic-site-playbook.md`, `docs/research/2026-10-18-portfolio-pattern.md`.

## Global Constraints

- No new dependencies, runtime or dev. Unit tests run with `node --test` (Node 22.18 strips TypeScript types natively).
- Browser checks are CommonJS files run as `NODE_PATH=/Users/aminatmoldalieva/.claude/plugins/cache/playwright-skill/playwright-skill/4.1.0/skills/playwright-skill/node_modules node scripts/checks/<name>.cjs`, against `pnpm dev` at `http://localhost:3000` (start it with the `portfolio-dev` preview config). Use `.cjs` and `require`: `NODE_PATH` does not apply to ES module imports. In the commands below, `<playwright node_modules>` stands for that `NODE_PATH` value.
- Spacing: flex and gap, not margin or padding offsets, wherever gap can do the job.
- Brand tokens (already in `src/app/globals.css`): `--canvas: #070d16`, `--signal: #8fd3ff`, `--accent: #ffb454`. Amber only on the primary call to action. Fonts: `--font-display` (Syne), `--font-text` (Instrument Sans), `--font-code` (JetBrains Mono).
- Copy: short, plain sentences. No em dashes (`—`) in visible copy. LaunchGood is named. No vendor or tool names for current LaunchGood work. No invented numbers. The approval process is "multi-department". Experience is "5 years".
- Budgets: desktop film at or under 32 MiB, phone film at or under 16 MiB. LCP under 2.5 s, CLS under 0.1.
- Accessibility: every caption is real HTML in reading order; every caption is visible with JavaScript off; reduced motion downloads no video; text contrast under captions 4.5:1 or better at the worst frame.
- Film source: `/Users/aminatmoldalieva/side_projects/aminat-portfolio/review/seam/final-1080p.mp4` (HEVC 10-bit, 1920x1080, 24 fps, 20.04 s, 481 frames). It is outside the repo and is never copied raw into `public/`.
- Timing: never more than one caption visible; caption fades happen only inside their own hold segment; every hold is at least 1.2 screens; fades are 0.3 screens.
- Keep the dev contract the checks rely on: `?jump=<px>` scrolls there on load without the intro ramp, and `window.__ready = true` is set once the first film frame (or the poster, when no video loads) is showing.

## Review Focus

1. **Jumping across the film** (Home/End keys, a header anchor link, a fast flick): the page lands on the target at once and the film shows the matching frame within a second; it must not crawl through 12 screens of film. Pinned by the snap test in Task 1 and the End-key check in Task 4.
2. **The film fails or loads slowly** (network error, blocked request, slow connection): the poster stays, captions still follow the scroll, no uncaught errors. Pinned by the blocked-video check in Task 5.
3. **Resize or rotate mid-film:** stage length and caption positions recompute; still never more than one caption; no sideways scroll. Pinned by the resize check in Task 5.
4. **Reload or back-navigation mid-film:** the film shows the frame that matches the restored scroll position. Pinned by the reload check in Task 4.
5. **Keyboard and screen-reader users:** a caption that is not showing cannot take focus, so Tab never lands on an invisible button. Pinned by the focus check in Task 5.

---

## File structure

| File | Responsibility |
|---|---|
| `src/lib/film/timeline.ts` | Pure: segments table, scroll-to-film-time, caption strengths, playhead smoothing |
| `src/lib/film/timeline.test.ts` | Unit tests for the timeline rules |
| `src/content/site.ts` | All visible copy and links, typed |
| `src/content/site.test.ts` | Copy rules (forbidden words, required facts) |
| `scripts/encode-film.sh` | Encodes the film, posters, end stills, share image; prints the edge colour |
| `public/film/*` | `desktop.mp4`, `phone.mp4`, `poster-desktop.webp`, `poster-phone.webp`, `end-desktop.webp`, `end-phone.webp` |
| `src/components/film/film-stage.tsx` | Client: pinned stage, video, captions, playhead loop |
| `src/components/film/film-loader.ts` | Client helpers: Blob fetch, gated seeks, iOS unlock |
| `src/components/sections/selected-work.tsx` | Three case cards |
| `src/app/work/[slug]/page.tsx` | One case page per case |
| `src/components/diagrams/case-diagram.tsx` | Three simple SVG diagrams, one per case |
| `src/components/sections/intro.tsx` | Intro sentences and links |
| `src/components/sections/proof.tsx` | Number strip (modified) |
| `src/components/sections/experience.tsx` | Dated timeline (rewritten) |
| `src/components/sections/projects.tsx`, `about.tsx`, `contact.tsx` | Plain sections |
| `src/components/sections/site-header.tsx`, `site-footer.tsx` | Modified |
| `scripts/checks/lib.cjs` | Shared browser-check helpers |
| `scripts/checks/film.cjs`, `film-fallbacks.cjs`, `sections.cjs`, `motion.cjs`, `perf.cjs` | Browser checks |
| `src/components/motion/scroll-reveal.tsx`, `use-scroll-progress.ts` | Scroll-driven reveals for every section (Task 11) |

Retired along the way: `src/components/hero/field.ts`, `field-stage.tsx`, `chapter.tsx` (Task 4); `src/components/sections/work.tsx` (Task 6); `src/components/sections/nidham.tsx` (Task 9).

---

### Task 1: Unit-test runner and the film timeline

**Files:**
- Modify: `tsconfig.json` (add `"allowImportingTsExtensions": true` to `compilerOptions`)
- Modify: `package.json` (add `"test": "node --test \"src/**/*.test.ts\""` to `scripts`)
- Create: `src/lib/film/timeline.ts`
- Test: `src/lib/film/timeline.test.ts`

**Interfaces:**
- Produces:
  - `export type CaptionId = "intro" | "grit" | "ownership" | "delivery"`
  - `export type Segment = { from: number; to: number; screens: number; caption?: CaptionId }` (film seconds, scroll length in screens)
  - `export const FILM_DURATION = 20.04`
  - `export const FADE = { lead: 0.1, length: 0.3 }` (screens)
  - `export const FILM_SEGMENTS: readonly Segment[]`
  - `export function totalScreens(segments?: readonly Segment[]): number`
  - `export function filmTimeAt(screens: number, segments?: readonly Segment[]): number`
  - `export function captionStrengths(screens: number, segments?: readonly Segment[]): Record<CaptionId, number>`
  - `export function smoothToward(current: number, target: number, dtMs: number, tauMs?: number, snapDistance?: number): number`

- [ ] **Step 1: Write the failing tests** in `src/lib/film/timeline.test.ts`, importing from `./timeline.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { FILM_SEGMENTS as S, FILM_DURATION, FADE, totalScreens, filmTimeAt, captionStrengths, smoothToward } from "./timeline.ts";

test("segments cover the whole film without gaps", () => {
  assert.equal(S[0].from, 0);
  assert.equal(S[S.length - 1].to, FILM_DURATION);
  for (let i = 1; i < S.length; i++) assert.equal(S[i].from, S[i - 1].to);
});

test("four captions, in story order, each on a hold of at least 1.2 screens", () => {
  const caps = S.filter((s) => s.caption);
  assert.deepEqual(caps.map((s) => s.caption), ["intro", "grit", "ownership", "delivery"]);
  for (const c of caps) assert.ok(c.screens >= 1.2, `${c.caption} hold is ${c.screens}`);
});

test("the break (12.2 to 17.4 s) has no caption", () => {
  for (const s of S) if (s.from < 17.4 && s.to > 12.2) assert.equal(s.caption, undefined);
});

test("never more than one caption visible, and none outside its hold", () => {
  const total = totalScreens();
  for (let x = 0; x <= total; x += 0.01) {
    const on = Object.values(captionStrengths(x)).filter((v) => v > 0);
    assert.ok(on.length <= 1, `two captions at ${x.toFixed(2)}`);
  }
  let start = 0;
  for (const seg of S) {
    if (!seg.caption) {
      for (let x = start + 0.001; x < start + seg.screens; x += 0.05)
        assert.ok(Object.values(captionStrengths(x)).every((v) => v === 0), `caption on a moving segment at ${x}`);
    }
    start += seg.screens;
  }
});

test("each caption reaches full strength and stays readable for at least 1.0 screen", () => {
  for (const id of ["intro", "grit", "ownership", "delivery"] as const) {
    let readable = 0, peak = 0;
    for (let x = 0; x <= totalScreens(); x += 0.01) {
      const v = captionStrengths(x)[id];
      peak = Math.max(peak, v);
      if (v >= 0.5) readable += 0.01;
    }
    assert.equal(peak, 1);
    assert.ok(readable >= 1.0, `${id} readable for ${readable.toFixed(2)}`);
  }
});

test("the break gets at least the film-wide scroll per second, and its tail more than its start", () => {
  const density = (from: number, to: number) => {
    const segs = S.filter((s) => s.from >= from && s.to <= to);
    return segs.reduce((a, s) => a + s.screens, 0) / (to - from);
  };
  const average = totalScreens() / FILM_DURATION;
  assert.ok(density(12.2, 17.4) >= average);
  assert.ok(density(15.4, 17.4) > density(12.2, 15.4));
});

test("filmTimeAt maps the ends, clamps, and never runs backwards", () => {
  assert.equal(filmTimeAt(0), 0);
  assert.equal(filmTimeAt(totalScreens()), FILM_DURATION);
  assert.equal(filmTimeAt(-5), 0);
  assert.equal(filmTimeAt(totalScreens() + 5), FILM_DURATION);
  let last = 0;
  for (let x = 0; x <= totalScreens(); x += 0.01) {
    const t = filmTimeAt(x);
    assert.ok(t >= last);
    last = t;
  }
});

test("smoothToward eases, settles, and snaps across big jumps", () => {
  const a = smoothToward(0, 1000, 16, 150);
  assert.ok(a > 0 && a < 1000);
  assert.equal(smoothToward(999.97, 1000, 16, 150), 1000);
  assert.equal(smoothToward(0, 5000, 16, 150, 1800), 5000);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test`
Expected: FAIL, module `./timeline.ts` not found.

- [ ] **Step 3: Implement `src/lib/film/timeline.ts`**

`FILM_SEGMENTS`, exactly (total 12.2 screens):

| from (s) | to (s) | screens | caption |
|---|---|---|---|
| 0 | 1.8 | 1.6 | intro |
| 1.8 | 4.0 | 0.8 | |
| 4.0 | 6.2 | 1.6 | grit |
| 6.2 | 10.4 | 1.4 | |
| 10.4 | 12.2 | 1.6 | ownership |
| 12.2 | 15.4 | 2.0 | |
| 15.4 | 17.4 | 1.6 | |
| 17.4 | 20.04 | 1.6 | delivery |

- `filmTimeAt`: piecewise linear inside each segment, clamped to `[0, FILM_DURATION]`.
- `captionStrengths`: all four ids present, 0 by default. Inside a caption's hold of length `L` at offset `x`: 0 before `FADE.lead`, smoothstep from 0 to 1 over `[lead, lead + length]`, 1, smoothstep from 1 to 0 over `[L - lead - length, L - lead]`, 0 after.
- `smoothToward`: `current + (target - current) * (1 - exp(-dtMs / tauMs))`, `tauMs` default 150; return `target` when `|target - current| < 0.05` or `> snapDistance` (default `Infinity`).

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test` and `npx tsc --noEmit -p .`
Expected: 8 tests PASS; tsc prints nothing.

- [ ] **Step 5: Commit**

```bash
git add tsconfig.json package.json src/lib/film/timeline.ts src/lib/film/timeline.test.ts
git commit -m "feat: film timeline maps scroll to film time and caption strength"
```

---

### Task 2: Site content and copy rules

**Files:**
- Create: `src/content/site.ts`
- Test: `src/content/site.test.ts`

**Interfaces:**
- Consumes: `CaptionId` from `src/lib/film/timeline.ts`.
- Produces (all `export const`, typed):
  - `LINKS: { email: string; emailText: string; resume: string; linkedin: string; github: string; nidhamDemo: string }`
  - `CAPTIONS: Record<CaptionId, { eyebrow?: string; title: string; line?: string; ctas?: boolean; proofLink?: boolean }>`
  - `INTRO: { text: string }`
  - `NUMBERS: { value: number | string; prefix?: string; suffix?: string; label: string; href: string }[]`
  - `CASES: Case[]` where `type Case = { slug: string; title: string; company: string; role: string; year: string; stack: string[]; result: string; summary: string; problem: string; did: string[]; decision: string; outcome: string; next: string }`
  - `EXPERIENCE: { when: string; role: string; company: string; line: string; tags: string[] }[]`
  - `PROJECTS: { name: string; line: string; href?: string; linkLabel?: string }[]`
  - `ABOUT: { lines: string[] }`
  - `CONTACT: { availability: string }`
  - `NAV: { href: string; label: string }[]`
  - `META: { title: string; description: string }`
  - `FOOTER: { note: string }`

- [ ] **Step 1: Write the failing tests** in `src/content/site.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import * as site from "./site.ts";

const all = JSON.stringify(site);

test("no em dashes, vendor names, retired copy or removed projects", () => {
  for (const bad of ["—", "n8n", "Six years", "Coming soon", "Interview Coach", "7 hours", "7 hrs", "release automation"])
    assert.ok(!all.includes(bad), `found "${bad}"`);
});

test("LaunchGood is named in the first caption and on every case", () => {
  assert.match(site.CAPTIONS.intro.eyebrow ?? "", /LaunchGood/);
  for (const c of site.CASES) assert.equal(c.company, "LaunchGood");
});

test("three cases with fixed slugs and complete pages", () => {
  assert.deepEqual(site.CASES.map((c) => c.slug), ["days-to-minutes", "under-five-minutes", "mobile-rebuild"]);
  for (const c of site.CASES) for (const k of ["problem", "decision", "outcome", "next"] as const) assert.ok(c[k].length > 20, `${c.slug}.${k}`);
  assert.match(JSON.stringify(site.CASES[0]), /multi-department/);
});

test("LaunchGood roles and dates", () => {
  const lg = site.EXPERIENCE.filter((e) => e.company === "LaunchGood").map((e) => [e.role, e.when]);
  assert.deepEqual(lg, [
    ["Software Engineer", "Jul 2026 to now"],
    ["Mobile Software Engineer", "Aug 2025 to Jul 2026"],
    ["QA Automation Engineer", "Feb 2025 to Aug 2025"],
  ]);
});

test("numbers, links and nav", () => {
  assert.deepEqual(site.NUMBERS.map((n) => n.label), ["Years engineering", "Countries served", "From breakage to alert", "Approval turnaround"]);
  for (const n of site.NUMBERS) assert.match(n.href, /^#case-|^#experience$/);
  assert.equal(site.LINKS.email, "mailto:moldalievaaminat@gmail.com");
  assert.equal(site.LINKS.nidhamDemo, "https://try.ka.nz/ai/aminatmoldalieva");
  assert.deepEqual(site.NAV.map((n) => n.href), ["#work", "#experience", "#projects", "#about", "#contact"]);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test`
Expected: FAIL, module `./site.ts` not found.

- [ ] **Step 3: Write `src/content/site.ts` with this exact copy**

- `LINKS`: email `mailto:moldalievaaminat@gmail.com` (text `moldalievaaminat@gmail.com`), resume `/my-cv.pdf`, linkedin `https://www.linkedin.com/in/aminatmoldalieva/`, github `https://github.com/Aminat00`, nidhamDemo `https://try.ka.nz/ai/aminatmoldalieva`.
- `CAPTIONS`:
  - intro: eyebrow "Software Engineer at LaunchGood", title "Aminat Moldalieva", line "I take the hard part, and I finish it.", ctas true.
  - grit: title "I start where it's hardest.", line "And I stay until it works."
  - ownership: title "I own the whole outcome.", line "Not just my ticket. The parts next to it too."
  - delivery: title "Many messy parts. One system that works.", line "At LaunchGood I automated a multi-department process from days to minutes.", proofLink true.
- `INTRO.text`: "Software engineer, 5 years in TypeScript. Today I build the web side of LaunchGood, a crowdfunding platform used in 100+ countries, and automate the processes behind it. Before that, its mobile app and its first test automation."
- `NUMBERS`: `{ value: 5, label: "Years engineering", href: "#experience" }`, `{ value: 100, suffix: "+", label: "Countries served", href: "#case-mobile-rebuild" }`, `{ value: 5, prefix: "under ", suffix: " min", label: "From breakage to alert", href: "#case-under-five-minutes" }`, `{ value: "Days to minutes", label: "Approval turnaround", href: "#case-days-to-minutes" }`.
- `CASES` (drafts; Aminat approves them in Task 11):
  1. slug `days-to-minutes`; title "From days to minutes"; role "Software Engineer"; year "2026"; stack ["Next.js", "TypeScript", "Workflow automation", "Third-party APIs"]; result "Approval turnaround from days to minutes"; summary "A manual approval that crossed several departments now runs as one automated workflow."; problem "Campaign creators applied through a form outside the website. Staff then looked up the campaign details by hand and passed the request between departments, so every application took days."; did ["Moved the application into the website, so every request starts with the right campaign details.", "Built one workflow that creates the payment link, opens the deal in the customer system and the task for finance, with no manual step.", "Listened for the payment and moved every record forward on its own, so creators always see which stage they are in."]; decision "Keep the application inside the website and let one workflow do every hand-off. Each department still works in its own tool, but nobody copies details between them anymore."; outcome "A multi-department process that took days now takes minutes, and campaign creators can see where their request stands at any time."; next "Bring the results of each campaign into the same view, so creators see what their spend achieved."
  2. slug `under-five-minutes`; title "Breakages found in under five minutes"; role "QA Automation Engineer"; year "2025"; stack ["Playwright", "GitHub Actions", "Slack"]; result "Detection from hours to under five minutes"; summary "The company's first end-to-end test suite, running every five minutes as a live check."; problem "Users found breakages in production before the team did, often hours after they started."; did ["Built the company's first Playwright end-to-end suite from scratch, with reusable page helpers other engineers extended.", "Ran it every five minutes against production on a schedule.", "Sent a Slack alert the moment a check failed."]; decision "Run the suite on a timer against production, not only on code changes, so it catches breakages from any cause: a deploy, a third party, or bad data."; outcome "Breakage detection went from hours to under five minutes."; next "Group alerts by user journey, so one outage sends one clear alert."
  3. slug `mobile-rebuild`; title "Core screens rebuilt for an app used in 100+ countries"; role "Mobile Software Engineer"; year "2025 to 2026"; stack ["React Native", "TypeScript", "Jest"]; result "Core screens rebuilt, tested, shipped"; summary "Core screens of the LaunchGood app rebuilt end to end as part of an app-wide refresh."; problem "Core screens of an app used in more than 100 countries needed a full refresh without slowing releases."; did ["Rebuilt each screen end to end: data, state, interface and component tests.", "Brought Claude into the team's workflow for design handoff and test writing."]; decision "Ship each screen complete with its tests before starting the next, so the refresh could go out screen by screen instead of in one risky release."; outcome "Core screens rebuilt, tested and shipped as part of the app-wide refresh."; next "Add visual checks on real devices, so layout changes are caught before release."
- `EXPERIENCE` (in this order): Software Engineer / LaunchGood / "Jul 2026 to now" / "Automated a multi-department approval process, from days to minutes. Building results views for campaign creators." / ["Next.js", "TypeScript", "Automation"]; Mobile Software Engineer / LaunchGood / "Aug 2025 to Jul 2026" / "Rebuilt core screens of a React Native app used in 100+ countries, with tests." / ["React Native", "TypeScript", "Jest"]; QA Automation Engineer / LaunchGood / "Feb 2025 to Aug 2025" / "Built the first Playwright suite. Breakage detection from hours to under 5 minutes." / ["Playwright", "GitHub Actions"]; Full-Stack Mobile Engineer / Freelance / "Aug 2024 to Feb 2025" / "A mobile app with AI features, a full-stack web platform and a headless store." / ["React Native", "Next.js", "Supabase"]; Full-Stack Mobile Engineer / Aurem / "Dec 2022 to Aug 2024" / "Built NestJS backend APIs, and moved the frontend to Tailwind, cutting styling time by 30%." / ["NestJS", "Expo", "Tailwind"]; Frontend Engineer / HCL Technologies / "Jan 2022 to Dec 2022" / "Micro-frontends for a platform with 2M+ users." / ["Single-SPA", "React"].
- `PROJECTS`: Nidham, line "An agentic planner for Muslims with ADHD. Built end to end in 48 hours: three agents turn a brain-dump into a plan around the five daily prayers.", href `LINKS.nidhamDemo`, linkLabel "See the demo"; "This site", line "A 20-second film that plays as you scroll, generated with AI and driven frame by frame by the page."
- `ABOUT.lines`: ["I end up owning the parts next to the feature: tests, release pipelines, automation.", "Remote from EMEA. English, Kyrgyz, Turkish, Russian and Polish.", "B.Eng. in Computer Engineering."]
- `CONTACT.availability`: "Open to full-time roles where web, mobile and automation meet."
- `NAV`: Work `#work`, Experience `#experience`, Projects `#projects`, About `#about`, Contact `#contact`.
- `META`: title "Aminat Moldalieva · Software Engineer", description "Software engineer at LaunchGood. Web, mobile and the automation behind them."
- `FOOTER.note`: "The film is AI-generated."

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test`
Expected: all timeline and content tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content/site.ts src/content/site.test.ts
git commit -m "feat: all site copy in one module, guarded by copy-rule tests"
```

---

### Task 3: Film assets

**Files:**
- Create: `scripts/encode-film.sh`
- Create (generated): `public/film/desktop.mp4`, `public/film/phone.mp4`, `public/film/poster-desktop.webp`, `public/film/poster-phone.webp`, `public/film/end-desktop.webp`, `public/film/end-phone.webp`
- Modify (generated): `public/og.jpg`

**Interfaces:**
- Produces: the six files above (paths used by Task 4 and 5), `public/og.jpg` at 1200x630, and one printed line `edge #rrggbb` (the mean colour of the outer 16 px of the desktop poster), which Task 4 uses as `--film-edge`.

- [ ] **Step 1: Write `scripts/encode-film.sh`** (bash, `set -euo pipefail`, `SRC` defaults to `../review/seam/final-1080p.mp4`, run from the repo root):
  - desktop: `ffmpeg -y -i "$SRC" -an -vf "unsharp=5:5:0.8" -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart public/film/desktop.mp4`
  - phone (centre crop, then scale): same, with `-vf "crop=1344:1080,scale=720:-2,unsharp=5:5:0.6" -crf 23 -g 4 -keyint_min 4`
  - posters: frame 0 of each encoded file to PNG with ffmpeg, then `cwebp -q 82`; end stills: the last frame (`-sseof -0.1`) of each encoded file, same way.
  - share image: the last frame of the desktop file, centre-cropped to 1920x1008 and scaled to 1200x630, to `public/og.jpg` at `-q:v 3`.
  - print `edge #rrggbb`: the desktop poster with its centre masked out, scaled to 1x1 (ffmpeg `crop` four 16 px strips, `hstack`, `scale=1:1`, rawvideo rgb24).

- [ ] **Step 2: Run it**

Run: `bash scripts/encode-film.sh`
Expected: six files in `public/film/`, a new `public/og.jpg`, and one `edge #......` line. Write the colour down.

- [ ] **Step 3: Verify the outputs**

Run: `ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,pix_fmt,width,height,nb_frames -of csv=p=0 public/film/desktop.mp4 public/film/phone.mp4 && ls -l public/film && ffprobe -v error -skip_frame nokey -select_streams v:0 -count_frames -show_entries stream=nb_read_frames -of csv=p=0 public/film/desktop.mp4`
Expected: `h264,yuv420p,1920,1080,481` and `h264,yuv420p,720,578,481` (height may differ by 2); desktop under 33554432 bytes, phone under 16777216 bytes; at least 60 keyframes in the desktop file.

- [ ] **Step 4: Commit**

```bash
git add scripts/encode-film.sh public/film public/og.jpg
git commit -m "feat: encoded film, posters, end stills and share image"
```

---

### Task 4: The film stage on desktop

**Files:**
- Create: `src/components/film/film-loader.ts`, `src/components/film/film-stage.tsx`
- Create: `scripts/checks/lib.cjs`, `scripts/checks/film.cjs`
- Modify: `src/app/page.tsx` (FilmStage replaces `FieldStage` and the `top` Chapter; the other sections stay as plain sections for now, with their `Chapter` wrappers and `data-chapter` removed)
- Modify: `src/app/layout.tsx` (an inline script in `<head>` that adds the class `film-js` to `<html>` before first paint)
- Modify: `src/app/globals.css` (delete the chapter, stage, field, band, scrim, hud, cue, ring and `field-static` blocks, lines 148 to 267 today; add the film block)
- Delete: `src/components/hero/field.ts`, `src/components/hero/field-stage.tsx`, `src/components/hero/chapter.tsx`

**Interfaces:**
- Consumes: `FILM_SEGMENTS`, `totalScreens`, `filmTimeAt`, `captionStrengths`, `smoothToward` (Task 1); `CAPTIONS`, `LINKS` (Task 2); `/film/*` files and the edge colour (Task 3).
- Produces:
  - `export function FilmStage(): JSX.Element` with root `<section id="top" className="film">`.
  - `film-loader.ts`: `export async function loadFilmBlob(url: string, signal: AbortSignal): Promise<string>` (object URL); `export function createSeekGate(video: HTMLVideoElement, minDelta: number): (time: number) => void` (one seek in flight, newest target wins, ignores changes below `minDelta`, resets on `seeked` and `error`); `export function unlockOnFirstTouch(video: HTMLVideoElement): () => void` (play then pause on the first `touchstart`, returns cleanup).
  - `scripts/checks/lib.cjs`: `withPage(opts, fn)` where `opts = { width, height, javaScriptEnabled?, reducedMotion?, blockFilm?, query? }`; `waitReady(page)`; `scrollToScreens(page, screens)` (scrolls to that many screens into the film stage and waits 1.5 s); `captionStates(page)` returning `[{ id, opacity, rect }]`.

Behaviour (from the spec, section 6):
- Stage height `(totalScreens() + 1) * 100svh`; a sticky full-viewport layer holds the poster, the video (`object-fit: cover`) and the captions. `--film-edge` (Task 3 colour) is the background behind the stage.
- The caption box sits left, vertically centred, at most 440px wide. Its scrim is a radial pool behind the box only (`closest-side`, transparent before its own edge). No full overlay, no one-sided wash.
- Each frame: smoothed scroll in px via `smoothToward(current, scrollY, dt, 150, 2 * innerHeight)`, converted to screens inside the stage, then `filmTimeAt` drives the seek gate and `captionStrengths` sets each caption's `opacity` and a rise of at most 12px. A caption at strength 0 gets `inert` and `aria-hidden="true"`.
- Loading: poster as a high-priority image first; `loadFilmBlob` starts once the poster has loaded or after 4 s; the poster stays until the first `seeked`; `createSeekGate(video, 0.008)`; `unlockOnFirstTouch`. Teardown aborts the fetch, revokes the object URL, cancels the frame loop and removes listeners.
- `?jump=<px>` and `window.__ready` as in Global Constraints.

- [ ] **Step 1: Write the failing check** `scripts/checks/film.cjs` (desktop 1440x900), asserting:
  - ready within 20 s, no console errors;
  - sampling every 0.05 screens across the stage: at most one caption with opacity above 0.01;
  - whenever a caption's opacity is above 0.01, its rect does not overlap the band from 35% to 65% of the viewport width;
  - at the middle of each caption hold, with captions hidden, the bright-pixel centroid of a screenshot lies between 40% and 60% of the width;
  - at the middle of each hold, the lightest pixel behind each caption's text box gives a contrast of 4.5:1 or more against `#eaf3fb`;
  - at the middle of each hold, with captions hidden and the scrim showing, the mean brightness of the left third and the right third of the screenshot are within a factor of 1.5 of each other (no one-sided wash);
  - during a scripted scroll sweep through the whole stage, the median `requestAnimationFrame` interval is 20 ms or less;
  - forward to 3 positions then back: after settling, `video.currentTime` is within 0.1 s of the expected film time;
  - **(Review Focus 1)** pressing End from the top: within 1 s the page is past the stage and `video.currentTime` is within 0.2 s of 20.04;
  - **(Review Focus 4)** reload at 6 screens in: after ready, `video.currentTime` is within 0.15 s of `filmTimeAt(6)` (11.08 s by the segment table: 6 screens is 0.6 into the ownership hold).

- [ ] **Step 2: Run it to verify it fails**

Run (dev server up): `NODE_PATH=<playwright node_modules> node scripts/checks/film.cjs`
Expected: FAIL (no `.film` section yet).

- [ ] **Step 3: Implement `film-loader.ts` and `film-stage.tsx`**, update `page.tsx`, `layout.tsx` and `globals.css`, and delete the three hero files. Reuse the patterns, not the code, of `field-stage.tsx` (frame loop, visibility pause) and of `scrub-hero.tsx` in commit `8ecd5d7` (Blob loader, gated seeks).

- [ ] **Step 4: Run all checks to verify they pass**

Run: `pnpm test && npx tsc --noEmit -p . && pnpm lint && NODE_PATH=<playwright node_modules> node scripts/checks/film.cjs`
Expected: tests PASS, no type or lint errors, every film check PASS.

- [ ] **Step 5: Commit**

```bash
git add -A src/components/film src/components/hero src/app/page.tsx src/app/layout.tsx src/app/globals.css scripts/checks/lib.cjs scripts/checks/film.cjs
git commit -m "feat: scroll film stage with four captions replaces the stroke field"
```

---

### Task 5: Phone layout and fallbacks

**Files:**
- Modify: `src/components/film/film-stage.tsx`, `src/app/globals.css`
- Create: `scripts/checks/film-fallbacks.cjs`

**Interfaces:**
- Consumes: Task 4's `FilmStage`, `lib.cjs`.
- Produces: phone source selection by `(max-width: 760px), (max-aspect-ratio: 4/5)` at load (no source swap on resize); reduced-motion and failure behaviour below.

Behaviour (spec sections 5 and 6):
- Phone: `phone.mp4` and `poster-phone.webp`, the video box in the upper part of the screen at its own aspect ratio, captions below it on plain background; `createSeekGate(video, 0.02)`.
- Reduced motion (`prefers-reduced-motion: reduce`): no video request at all; `end-desktop.webp` or `end-phone.webp` shown as a still; the stage is not pinned; all four captions visible in order; `window.__ready` set once the still shows.
- JavaScript off: all four captions visible in order (CSS default, since `film-js` is absent); the poster still shows.
- Video failure (fetch error or `error` event): the poster stays, captions keep following the scroll, no uncaught errors.

- [ ] **Step 1: Write the failing check** `scripts/checks/film-fallbacks.cjs`, asserting:
  - phone 390x844, at each caption hold: the video box bottom is at or above 60% of the viewport height and the visible caption's top is at or below the video box bottom; `document.documentElement.scrollWidth === innerWidth`;
  - reduced motion (desktop and phone): zero requests matching `/film/.*\.mp4`; the end still is visible; all four captions have opacity 1;
  - JavaScript disabled: all four captions and both caption buttons are visible;
  - **(Review Focus 2)** `blockFilm: true`: the poster stays visible, the visible caption changes between the first and third holds, and no page errors are logged;
  - **(Review Focus 3)** scroll to the middle of the grit hold at 1440x900, resize to 390x844, wait 1 s: at most one caption above 0.01 opacity and no sideways scroll;
  - **(Review Focus 5)** at the middle of the grit hold, pressing Tab ten times from the top of the page never focuses an element inside a caption whose opacity is 0.

- [ ] **Step 2: Run it to verify it fails**

Run: `NODE_PATH=<playwright node_modules> node scripts/checks/film-fallbacks.cjs`
Expected: FAIL on the phone layout and reduced-motion assertions.

- [ ] **Step 3: Implement the phone layout, reduced motion, JS-off defaults and failure path** in `film-stage.tsx` and `globals.css`.

- [ ] **Step 4: Run both film checks to verify they pass**

Run: `NODE_PATH=<playwright node_modules> node scripts/checks/film.cjs && NODE_PATH=<playwright node_modules> node scripts/checks/film-fallbacks.cjs`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/film/film-stage.tsx src/app/globals.css scripts/checks/film-fallbacks.cjs
git commit -m "feat: phone film layout, reduced motion, no-JS and failure fallbacks"
```

---

### Task 6: Selected work and the case pages

**Files:**
- Create: `src/components/sections/selected-work.tsx`, `src/app/work/[slug]/page.tsx`, `src/components/diagrams/case-diagram.tsx`, `scripts/checks/sections.cjs`
- Modify: `src/app/page.tsx` (SelectedWork replaces Work), `src/app/globals.css` (case card and case page styles; remove `work-*`, `ba-*` and `glyph` rules)
- Delete: `src/components/sections/work.tsx`

**Interfaces:**
- Consumes: `CASES`, `LINKS` (Task 2).
- Produces: `export function SelectedWork(): JSX.Element` with root `<section id="work">` and one `<article id="case-<slug>">` per case; route `/work/[slug]` with `generateStaticParams()` over `CASES`, `generateMetadata()` (title "<case title> · Aminat Moldalieva"), and `notFound()` for an unknown slug; `export function CaseDiagram({ slug }: { slug: string }): JSX.Element` (inline SVG per slug, brand colours, labels in general terms, no screenshots).

Card: title, a fact row (company, role, year, stack, result), the summary, and a "Read the case" link to `/work/<slug>`. Case page: title, fact row, then "The problem", "What I did" (list), "The key decision", "The result", "What I'd do next", the diagram, and a link back to `/#work`.

- [ ] **Step 1: Write the failing check** `scripts/checks/sections.cjs` (works with JavaScript disabled, at 1440x900 and 390x844), asserting for now: `#work` holds three `article[id^="case-"]` in the `CASES` order; each card's "Read the case" link returns HTTP 200 and its page shows the five headings above and an `svg`; `/work/unknown` returns 404; no sideways scroll at 390px.

- [ ] **Step 2: Run it to verify it fails**

Run: `NODE_PATH=<playwright node_modules> node scripts/checks/sections.cjs`
Expected: FAIL, `#work` has no `article[id^="case-"]`.

- [ ] **Step 3: Implement** `selected-work.tsx`, the case route, `case-diagram.tsx` (three diagrams: the approval flow from website to one workflow to payment, customer system and finance task; the five-minute check loop with its alert; screen-by-screen rebuild with tests), the page change and the styles. Delete `work.tsx`.

- [ ] **Step 4: Run the checks to verify they pass**

Run: `pnpm test && npx tsc --noEmit -p . && NODE_PATH=<playwright node_modules> node scripts/checks/sections.cjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A src/components/sections src/app/work src/components/diagrams src/app/page.tsx src/app/globals.css scripts/checks/sections.cjs
git commit -m "feat: three case cards with their own case pages"
```

---

### Task 7: Experience timeline

**Files:**
- Modify: `src/components/sections/experience.tsx` (rewrite from `EXPERIENCE`), `src/app/globals.css` (timeline styles replace the `path`, `rail` and `stop` rules), `scripts/checks/sections.cjs`

**Interfaces:**
- Consumes: `EXPERIENCE`, `LINKS` (Task 2).
- Produces: `export function Experience(): JSX.Element` with root `<section id="experience">`. LaunchGood appears once as a company heading with its three roles as separate rows; every other entry is one row. Each row: dates, role, one line, tags. The section ends with a "View full résumé (PDF)" link to `LINKS.resume`.

- [ ] **Step 1: Add the failing assertions** to `sections.cjs`: `#experience` contains six role rows in the `EXPERIENCE` order with their exact dates; the text "LaunchGood" appears as one company heading above three rows; the résumé link returns HTTP 200 with content type `application/pdf`.

- [ ] **Step 2: Run it to verify it fails**

Run: `NODE_PATH=<playwright node_modules> node scripts/checks/sections.cjs`
Expected: FAIL on the role rows.

- [ ] **Step 3: Implement** the rewrite and styles.

- [ ] **Step 4: Run the checks to verify they pass**

Run: `pnpm test && npx tsc --noEmit -p . && NODE_PATH=<playwright node_modules> node scripts/checks/sections.cjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/experience.tsx src/app/globals.css scripts/checks/sections.cjs
git commit -m "feat: dated experience timeline with the three LaunchGood roles"
```

---

### Task 8: Intro and the number strip

**Files:**
- Create: `src/components/sections/intro.tsx`
- Modify: `src/components/sections/proof.tsx` (data from `NUMBERS`; each item is a link to its `href`; count-up only for numeric values, reduced motion shows the final value; no inline padding style), `src/app/page.tsx` (Intro then Proof directly after the film), `scripts/checks/sections.cjs`

**Interfaces:**
- Consumes: `INTRO`, `LINKS`, `NUMBERS` (Task 2); `#case-<slug>` anchors (Task 6); `#experience` (Task 7).
- Produces: `export function Intro(): JSX.Element` with root `<section id="intro">`: the intro text, then links to email, résumé, LinkedIn and GitHub.

- [ ] **Step 1: Add the failing assertions** to `sections.cjs`: `#intro` contains the full `INTRO.text` and four links with the `LINKS` hrefs; the number strip shows four items whose labels match `NUMBERS` and whose hrefs each resolve to an element on the page; the last item reads "Days to minutes".

- [ ] **Step 2: Run it to verify it fails**

Run: `NODE_PATH=<playwright node_modules> node scripts/checks/sections.cjs`
Expected: FAIL on `#intro`.

- [ ] **Step 3: Implement** `intro.tsx`, the `proof.tsx` changes and the page order.

- [ ] **Step 4: Run the checks to verify they pass**

Run: `pnpm test && npx tsc --noEmit -p . && NODE_PATH=<playwright node_modules> node scripts/checks/sections.cjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/intro.tsx src/components/sections/proof.tsx src/app/page.tsx scripts/checks/sections.cjs
git commit -m "feat: intro and linked number strip after the film"
```

---

### Task 9: Projects, About and Contact

**Files:**
- Create: `src/components/sections/projects.tsx`, `src/components/sections/about.tsx`, `src/components/sections/contact.tsx`
- Modify: `src/app/page.tsx` (final order: FilmStage, then in `<main id="main">`: Intro, Proof, SelectedWork, Experience, Projects, About, Contact), `src/app/globals.css` (remove the `nidham`, `hold`, `sorter`, `chips` and `rows` rules), `scripts/checks/sections.cjs`
- Delete: `src/components/sections/nidham.tsx`

**Interfaces:**
- Consumes: `PROJECTS`, `ABOUT`, `CONTACT`, `LINKS` (Task 2).
- Produces: `Projects` (`<section id="projects">`, one row per project, Nidham with its "See the demo" link opening in a new tab with `rel="noopener"`), `About` (`<section id="about">`, the three lines, no image), `Contact` (`<section id="contact">`: the email as the first link, showing `LINKS.emailText`, then LinkedIn, GitHub, résumé, then the availability line). No form.

- [ ] **Step 1: Add the failing assertions** to `sections.cjs`: the page sections appear in the final order; `#projects` has the Nidham demo link with the exact `LINKS.nidhamDemo` href and no "Coming soon" text; `#about` has no `img`; the first link in `#contact` is the `mailto:` link; the page has no `form` element.

- [ ] **Step 2: Run it to verify it fails**

Run: `NODE_PATH=<playwright node_modules> node scripts/checks/sections.cjs`
Expected: FAIL on `#projects`.

- [ ] **Step 3: Implement** the three sections, the page order and the style clean-up; delete `nidham.tsx`.

- [ ] **Step 4: Run the checks to verify they pass**

Run: `pnpm test && npx tsc --noEmit -p . && pnpm lint && NODE_PATH=<playwright node_modules> node scripts/checks/sections.cjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A src/components/sections src/app/page.tsx src/app/globals.css scripts/checks/sections.cjs
git commit -m "feat: projects, about and contact; Nidham demo section retired"
```

---

### Task 10: Header, footer and metadata

**Files:**
- Modify: `src/components/sections/site-header.tsx` (links from `NAV`; brand text "Aminat Moldalieva"; the header button is "Email" linking to `LINKS.email`; the mobile menu uses the same links and an "Email me" primary button), `src/components/sections/site-footer.tsx` (`FOOTER.note`), `src/app/layout.tsx` (`metadata.title` and `description` from `META`; Open Graph title and description from `META`, image `/og.jpg`), `scripts/checks/sections.cjs`

**Interfaces:**
- Consumes: `NAV`, `LINKS`, `META`, `FOOTER` (Task 2); every section id (Tasks 4 to 9).

- [ ] **Step 1: Add the failing assertions** to `sections.cjs`: every header link's hash matches an element id on the page; the header shows "Aminat Moldalieva" and an `a[href^="mailto:"]`; the header never overlaps a visible caption's rect during the film (sample each hold at 1440x900 and 390x844); `document.title` equals `META.title`; the footer contains `FOOTER.note`.

- [ ] **Step 2: Run it to verify it fails**

Run: `NODE_PATH=<playwright node_modules> node scripts/checks/sections.cjs`
Expected: FAIL on the header links.

- [ ] **Step 3: Implement** the header, footer and metadata changes.

- [ ] **Step 4: Run the checks to verify they pass**

Run: `pnpm test && npx tsc --noEmit -p . && pnpm lint && NODE_PATH=<playwright node_modules> node scripts/checks/sections.cjs && NODE_PATH=<playwright node_modules> node scripts/checks/film.cjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/site-header.tsx src/components/sections/site-footer.tsx src/app/layout.tsx scripts/checks/sections.cjs
git commit -m "feat: header, footer and metadata for the new site"
```

---

### Task 11: Motion through the whole page

**Files:**
- Modify: `src/lib/film/timeline.ts`, `src/lib/film/timeline.test.ts` (the crystal swing)
- Modify: `src/components/film/film-stage.tsx` (the film layer stays fixed behind the sections and follows the swing; dim behind section text), `src/app/globals.css`
- Create: `src/components/motion/scroll-reveal.tsx`, `src/components/motion/use-scroll-progress.ts`
- Modify: `src/components/sections/intro.tsx`, `selected-work.tsx`, `experience.tsx`, `projects.tsx`, `about.tsx`, `contact.tsx`, `src/components/diagrams/case-diagram.tsx`, `src/app/work/[slug]/page.tsx` (use ScrollReveal; diagrams draw; timeline grows)
- Delete: `src/components/motion/reveal.tsx` once nothing imports it
- Create: `scripts/checks/motion.cjs`

**Interfaces:**
- Consumes: `FILM_DURATION`, `filmTimeAt`, `totalScreens` (Task 1); `FilmStage` (Tasks 4 and 5); every section (Tasks 6 to 10).
- Produces:
  - `export const CRYSTAL_FROM = 17.8` and `export function crystalSwing(progress: number): number` in `timeline.ts`: `FILM_DURATION - (FILM_DURATION - CRYSTAL_FROM) * sin(PI * clamp(progress, 0, 1))` (20.04 at 0 and 1, 17.8 at 0.5).
  - `export function useScrollProgress(ref: RefObject<HTMLElement>, start?: number, end?: number): MutableRefObject<number>` (0 to 1 as the element's top moves from `start` to `end` of the viewport height, defaults 0.9 and 0.5; one passive scroll listener plus rAF; no React state per frame).
  - `export function ScrollReveal({ children, className, as }: { children: ReactNode; className?: string; as?: "div" | "section" | "header" }): JSX.Element` (each direct child is one line; lines rise up to 16px and sharpen from a 6px blur to 0 with staggered windows inside the progress; reversible; visible by default without JavaScript; static under reduced motion).

Behaviour: spec section 11.

- [ ] **Step 1: Write the failing unit tests** in `timeline.test.ts`:

```ts
test("the crystal swing starts and ends on the film's last frame and never leaves the crystal", () => {
  assert.equal(crystalSwing(0), FILM_DURATION);
  assert.equal(crystalSwing(1), FILM_DURATION);
  assert.ok(Math.abs(crystalSwing(0.5) - CRYSTAL_FROM) < 1e-9);
  for (let p = -0.5; p <= 1.5; p += 0.01) {
    const t = crystalSwing(p);
    assert.ok(t >= CRYSTAL_FROM - 1e-9 && t <= FILM_DURATION + 1e-9);
  }
});
```

- [ ] **Step 2: Write the failing browser check** `scripts/checks/motion.cjs` (1440x900 and 788x734), asserting:
  - just past the stage, `video.currentTime` is within 0.2 s of 20.04 (no jump from the stage);
  - at the middle of each section, `video.currentTime` is within 0.15 s of `crystalSwing(progress)` for the page progress after the stage, and between 17.8 and 20.04;
  - at the middle of each section, with section text hidden, the crystal is visible (bright pixels in the centre third of the screen above a threshold you calibrate on the end still);
  - the lightest pixel behind each section heading and paragraph box gives 4.5:1 or more against the text colour;
  - each `ScrollReveal` block: line opacity under 0.2 when its top is at 95% of the viewport height, 1 when it is at 50%; after scrolling back above it, under 0.2 again;
  - each case diagram's main path has `stroke-dashoffset` near its full length before the diagram enters and near 0 once it is past the middle of the screen; the experience line's scale grows with scroll;
  - JavaScript disabled: every reveal line has opacity 1 and no transform;
  - reduced motion: zero `/film/*.mp4` requests, reveal lines static at opacity 1, the end still visible behind the sections;
  - the median `requestAnimationFrame` interval during a sweep through the sections is 20 ms or less, and cumulative layout shift stays under 0.1.

- [ ] **Step 3: Run both to verify they fail**

Run: `pnpm test` and `NODE_PATH=<playwright node_modules> node scripts/checks/motion.cjs`
Expected: FAIL (`crystalSwing` not exported; no reveals yet).

- [ ] **Step 4: Implement** `crystalSwing`, the film layer staying behind the sections, the dimming, `use-scroll-progress.ts`, `scroll-reveal.tsx`, and the section, diagram and timeline changes. Delete `reveal.tsx` when unused.

- [ ] **Step 5: Run everything to verify it passes**

Run: `pnpm test && npx tsc --noEmit -p . && pnpm lint` and all four check scripts (`film.cjs`, `film-fallbacks.cjs`, `sections.cjs`, `motion.cjs`, with `NODE_PATH=<playwright node_modules>`).
Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/film src/components/film src/components/motion src/components/sections src/components/diagrams src/app/work src/app/globals.css scripts/checks/motion.cjs
git commit -m "feat: motion through the whole page; the crystal stays behind every section"
```

---

### Task 12: Final verification and copy approval

**Files:**
- Create: `scripts/checks/perf.cjs`

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: Write `scripts/checks/perf.cjs`**, asserting against `pnpm build && pnpm start` (port 3000): largest contentful paint under 2500 ms and cumulative layout shift under 0.1 at 1440x900 and at 390x844 with 4x CPU slowdown (`PerformanceObserver` for `largest-contentful-paint` and `layout-shift`); the total bytes of `/film/*.mp4` requests stay under the Global Constraints budgets.

- [ ] **Step 2: Run the full suite on a production build**

Run: `pnpm test && npx tsc --noEmit -p . && pnpm lint && pnpm build && pnpm start` (in the background), then all five check scripts (`film.cjs`, `film-fallbacks.cjs`, `sections.cjs`, `motion.cjs`, `perf.cjs`) with `NODE_PATH=<playwright node_modules>`.
Expected: everything PASS. Fix any failure in the task that owns the code, then re-run the whole suite.

- [ ] **Step 3: Record what could not be verified here**: a real iPhone (Blob seeking and memory in iOS Safari) and a real GPU frame rate. Write both into the hand-off message as untested.

- [ ] **Step 4: Ask Aminat to approve the drafted copy** before anything merges or deploys: the four captions, the intro, and the three case pages (problem, what she did, key decision, result, what next). Apply her edits in `src/content/site.ts`, then run `pnpm test` and `sections.cjs` again.

- [ ] **Step 5: Commit**

```bash
git add scripts/checks/perf.cjs src/content/site.ts
git commit -m "test: performance checks; copy approved"
```
