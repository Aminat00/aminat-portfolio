# Cinematic portfolio: design

Date: 2026-10-18. Branch: `redesign-signal`. Owner: Aminat Moldalieva.
Sources: `docs/research/2026-10-18-cinematic-site-playbook.md` (how scroll-film sites are built, and why the last two attempts failed) and `docs/research/2026-10-18-portfolio-pattern.md` (what the best engineer portfolios cover).

## 1. Intent

A portfolio that shows what kind of engineer Aminat is before it lists what she has done. She takes the hard part, owns the whole outcome, and delivers. She wants it cinematic, like the scroll-film sites people build with Higgsfield and Claude, but abstract: never her photo.

Two readers, in this order:

1. **The recruiter.** Spends seconds. Needs her name, current role, company and a way to reach her, readable at once, even while the film plays.
2. **The hiring manager.** Spends minutes. Needs proof: a few pieces of real work with clear results, a dated timeline, the résumé.

The film carries the feeling (grit, ownership, delivery). The sections below carry the proof.

## 2. Goals, non-goals, anti-goals

**Goals**
- The opening film reads as one smooth story, with words and picture taking turns, across the whole screen.
- Name, role and LaunchGood are readable on the first screen and stay reachable during the film.
- Three short case studies, a dated experience timeline, the résumé and a plain email, each one click away.
- Works on a phone, with reduced motion, and with JavaScript off.

**Non-goals**
- A blog or writing section (only if she publishes posts later).
- A skills section, testimonials, awards or a contact form.
- A native portrait (9:16) film. Phones get a centre crop of the desktop film.
- Higgsfield's own website builder. The site stays on her domain, in this Next.js repo.

**Anti-goals** (any of these makes it a failure even if it technically works)
- Text and picture changing at the same moment, or words sitting on the stone.
- The film living on one side of the screen, or a dark wash over the words' side.
- Sharp, quick transitions: a shape forms and is gone before it can be seen.
- A click gate, a preloader, or any content that only exists after an animation.
- "Coming soon" sections, dead demos, an old résumé.
- Company internals on the page: no vendor or tool names for current LaunchGood work, no internal process steps.
- Motion that hides or delays the recruiter's facts (name, titles, companies, dates) or makes the page feel like two different websites: a moving top and a static rest.

## 3. Constraints

- **Stack:** the existing app. Next.js 14.2, React 18, Tailwind, framer-motion. No new dependencies.
- **Layout style:** flex and gap for spacing, not margin or padding offsets, wherever gap can do the job (her global rule).
- **Brand:** canvas `#070d16`, ice blue `#8fd3ff` (`--signal`), amber `#ffb454` (`--accent`) only on the primary call to action. Fonts already wired in `src/app/layout.tsx`: Syne (display), Instrument Sans (body), JetBrains Mono (labels). Tokens live in `src/app/globals.css`.
- **Copy:** short, plain sentences. No em dashes in visible copy. LaunchGood is named. Current work is described in general terms. No invented numbers.
- **Budgets:** desktop film at or under 32 MiB, phone film at or under 16 MiB (the final 1080p source is 5.6 MB, so this is easy). LCP under 2.5 s, CLS under 0.1.
- **Accessibility:** every caption is real HTML, in reading order, readable with JavaScript off. Reduced motion downloads no video.

## 4. What she decided

- **AI footage**, not a film drawn in code.
- **The film**, final and paid for: `side_projects/aminat-portfolio/review/seam/final-1080p.mp4` (outside the repo). 1920x1080, 24 fps, 20.04 s, one continuous take, no cuts. Higgsfield job `e24d2aae-c5f4-4b0a-83fa-5b29be0b6847`.
- **The story**, second by second:

| Film seconds | Picture | Meaning |
|---|---|---|
| 0 to 3 | A dark, rough, cracked stone floats centred. The camera starts circling. | The hard problem |
| 3 to 7 | A thin blue light appears in the deepest crack and starts to spread. | Grit: start where it's hardest |
| 7 to 12 | The light spreads crack by crack, front and back, until every crack glows. | Ownership: the whole thing, not just her part |
| 12 to 17 | The shell splits into about eight solid pieces that tumble outward and leave the frame. The crystal shows through. | Breaking through |
| 17 to 20 | A clean, faceted crystal floats alone, glowing blue from inside. | Delivery: the finished result |

- **No amber in the film.** The amber dot was dropped as meaningless. Amber stays on the primary button only.
- **Sections** follow the research pattern, with two edits from her: Aurem's release automation is not shown anywhere on the site (it stays on the résumé), and the mobile role keeps its own line.
- **LaunchGood is named on the site.**
- **LaunchGood roles:** QA Automation Engineer (Feb 2025 to Aug 2025), Mobile Software Engineer (Aug 2025 to Jul 2026), Software Engineer (Jul 2026 to now). The web role always says "automation" and "multi-department".
- **Résumé:** `resume/resume.html` is the source; `public/my-cv.pdf` is the served file. Already updated.

## 5. My calls (she can override)

- **Route:** her own Next.js site, not Higgsfield's builder. Reason: her domain, full control of text timing and mobile, and the site itself becomes proof of the work.
- **Engine:** reuse the smoothed playhead in `src/components/hero/field-stage.tsx` (chapter stops, eased scroll, caption fades), swap the WebGL drawing for writes to `video.currentTime`, and retire `src/components/hero/field.ts`. Take the loading pieces (Blob fetch, first-seek poster, one seek in flight, iOS unlock) from the deleted `src/components/hero/scrub-hero.tsx`, which is in commit `8ecd5d7`.
- **Case studies get two layers:** a short card on the home page, and the full write-up on its own page (`/work/<slug>`), one click away.
- **The fourth number** in the strip becomes "days to minutes" (the approval turnaround), replacing Aurem's "about 7 hours a week".
- **The third case study** is the mobile rebuild, shown with a simple drawn diagram, never app screenshots.
- **The film's last caption hands over to the proof** instead of asking for contact. Contact lives at the end of the page.
- **Four captions, not five (she agreed).** The break, 12 to 17 s, has no clean frame for words: rock pieces cover both sides of the screen. So the break plays with no words, and the old captions 4 and 5 merge on the crystal.
- **Case pages ship with the first version.** I draft each one from her own account of the work (the résumé lines plus what she told me about the approval automation), in general terms. She approves every page before launch. No "coming soon" links.
- **Phones show a centre crop of the film, scaled into the upper part of the screen**, with the captions below it on plain background. A full-height crop would make the stone fill the screen and put the words on it. The film's dark edges blend into the page, so the crop has no visible border.
- **The Nidham "hold to sort" demo is retired.** Nidham becomes a one-line project.
- **Email:** the Gmail address already on the résumé.

## 6. The film section

### Layout
- One full-viewport stage behind the opening chapters, the film filling every edge. After the last caption the crystal stays behind the rest of the page (see section 11). The page background matches the film's edge colour exactly: sample the encoded poster's corners (the source reads about `#030814` to `#070c17`, darker than `#070d16`) and use that value behind the stage, so the film has no visible edge.
- The stone and crystal stay centred. Words sit beside them in the empty space, in a copy box no wider than about 440px on desktop. On phones the film sits in the upper part of the screen and the words sit below it, on plain background (see section 5).
- Scrims: a soft radial pool behind the words only, fading to transparent well inside its own box. No full overlay. No one-sided wash.
- The header stays visible during the film: her name (home link), the section links, and an "Email" button. It must not cover any caption.

### Timing (the rules that fix the last two attempts)
- The scroll drives the film directly. Scroll down plays forward, scroll up plays backward, stopping holds a still.
- **One thing moves at a time.** In each chapter the picture settles first, then the caption fades in. The caption fades out before the next big change in the film. A caption's fade and the film's main change share at most 25% of their scroll range.
- **One caption on screen at a time.** Zero overlap between captions. Fades take 0.3 to 0.5 screens of scroll.
- **Enough scroll per chapter:** 1.4 to 2 screens each, and each finished picture holds for at least 1.2 screens.
- **The break gets extra scroll.** The 12 to 17 s window, and especially the last pieces leaving around 15.5 to 17 s, gets more scroll per second of film than the rest, so it never feels quick.
- **Let the last frame land** before the stage scrolls away: the crystal holds, then the page rises.

### Captions (draft copy, hers to approve)

| Chapter | Film seconds | Caption |
|---|---|---|
| 1 | 0 to 3 (dark stone) | Eyebrow: "Software Engineer at LaunchGood". Title: "Aminat Moldalieva". Line: "I take the hard part, and I finish it." Buttons: "Email me" (amber), "Résumé". |
| 2 | 3 to 7 (first crack lights) | "I start where it's hardest." / "And I stay until it works." |
| 3 | 7 to 12 (every crack glows) | "I own the whole outcome." / "Not just my ticket. The parts next to it too." |
| None | 12 to 17 (the break) | No words. The film has the whole screen. |
| 4 | 17 to 20 (the crystal) | "Many messy parts. One system that works." / "At LaunchGood I automated a multi-department process from days to minutes." A small "See the proof" link leads to Selected work. |

Each caption shows only once its picture has settled: caption 3 on the fully lit stone just before the split, caption 4 once the last piece has left and the crystal is alone.

### Loading and fallbacks
- Encode from the final source with the playbook settings (Step 4): desktop 1080p, CRF about 20, a keyframe every 8 frames, no audio, faststart. Phone 720p, CRF about 23, a keyframe every 4 frames. Raw files stay out of `public/`.
- Posters from frame 1 of each encoded file, as WebP or AVIF, so the first paint matches playback. Preload the desktop poster with high priority.
- Fetch the film as a whole file into a Blob URL once the stage is within 1.5 screens. Keep the poster until the first seek lands. Unlock seeking on iOS at the first touch.
- **Reduced motion:** no video download. Show the end frame (the crystal) as a still, and every caption stacked and visible.
- **JavaScript off:** every caption is visible by default in CSS. The fade only switches on through a class an inline script sets before first paint. (Today's branch hides all captions at `opacity: 0` with JavaScript off. That must not survive.)

## 7. The sections below the film

Order: Intro, Selected work, Experience, Projects, About, Contact. Each entry type uses one small template, so the page scans fast.

### Intro
- Two or three plain sentences in a "today, before" pattern. Draft: "Software engineer, 5 years in TypeScript. Today I build the web side of LaunchGood, a crowdfunding platform used in 100+ countries, and automate the processes behind it. Before that, its mobile app and its first test automation."
- Links: email, résumé, LinkedIn, GitHub.
- The number strip: **5** years engineering · **100+** countries served · **under 5 min** from breakage to alert · **days to minutes** approval turnaround. Each number links to the case it comes from.

### Selected work (three cases)
Card on the home page: a title that states the result, then a fact row (company, role, year, stack, result), then two lines and a "Read the case" link. The full case page has: the problem (2 lines), what she did (3 to 4 lines), one key decision and why, the result with its number, what she'd do next, and one simple drawn diagram.

1. **"From days to minutes."** LaunchGood, Software Engineer, 2026. A manual approval process that crossed several departments now runs as one automated workflow, connecting the website to the payment, customer and task tools. General terms only: no tool or vendor names, no internal steps.
2. **"Breakages found in under five minutes."** LaunchGood, QA Automation Engineer, 2025. The company's first Playwright end-to-end suite, run every five minutes as a live check with an alert on failure. Detection went from hours to under five minutes.
3. **"Core screens rebuilt for an app used in 100+ countries."** LaunchGood, Mobile Software Engineer, 2025 to 2026. React Native screens rebuilt end to end with tests, as part of an app-wide refresh. A drawn diagram, no app screenshots.

### Experience
- A dated timeline in the recruiter's format: dates, title and company, one line with one number, tech tags. LaunchGood is grouped as one company with each role on its own line.

| When | Role | Line |
|---|---|---|
| Jul 2026 to now | Software Engineer, LaunchGood | Automated a multi-department approval process, days to minutes. Building results views for campaign creators. |
| Aug 2025 to Jul 2026 | Mobile Software Engineer, LaunchGood | Rebuilt core screens of a React Native app used in 100+ countries, with tests. |
| Feb 2025 to Aug 2025 | QA Automation Engineer, LaunchGood | First Playwright suite. Breakage detection from hours to under 5 minutes. |
| Aug 2024 to Feb 2025 | Full-Stack Mobile Engineer, Freelance | A mobile app with AI features, a full-stack web platform, a headless store. |
| Dec 2022 to Aug 2024 | Full-Stack Mobile Engineer, Aurem | NestJS backend APIs, and a styling migration that cut styling time by 30%. (No release automation, per her.) |
| Jan 2022 to Dec 2022 | Frontend Engineer, HCL Technologies | Micro-frontends for a platform with 2M+ users. |

- Ends with "View full résumé (PDF)". The 2021 internship stays on the résumé only.

### Projects (one line each)
- **Nidham:** an agentic planner for Muslims with ADHD, built end to end in 48 hours. Link: "See the demo", to https://try.ka.nz/ai/aminatmoldalieva (she confirmed this is Nidham's demo). The "Coming soon" tag goes.
- **This site:** one line on how the film works.
- **The AI Interview Coach is not on the site for now** (no working demo). It stays on the résumé.

### About
Two to five lines after the work: she owns the parts next to the feature, works remote from EMEA, speaks English, Kyrgyz, Turkish, Russian and Polish, B.Eng. in Computer Engineering. No photo.

### Contact
A plain email first, then LinkedIn, GitHub and the résumé, and the one-line availability note ("Open to full-time roles where web, mobile and automation meet"). No form. The footer keeps a one-line note that the film is AI-generated.

## 8. What to retire from the current branch

- The WebGL stroke field (`src/components/hero/field.ts`) and its six shapes.
- The four mid-page shape chapters (Nidham, Work, Path, About as pinned film chapters). Those sections become plain sections below the film.
- The "Six years" copy (the true number is 5) and the "Coming soon" tag.

## 9. Checks before she sees it

Run in a real browser at 1440x900 and 390x844, plus one real iPhone if possible.

| Check | Pass |
|---|---|
| Stone and crystal centre, desktop | within 10% of screen centre at every hold |
| Words' side vs the other side | about equally bright, no one-sided wash |
| Caption fade vs film change | share 25% or less of their scroll range |
| Hold on each finished picture | 1.2 screens or more |
| Captions on screen at once | never more than one |
| Copy box | never inside the centre 30% of the screen on desktop |
| JavaScript off | every caption and link visible |
| Reduced motion | no video request, end still shown, all captions visible |
| Scroll forward, backward, stop | no jumps, no drift, about 60 fps |
| Contrast under captions | 4.5:1 or better at the worst frame |
| Phone | film in the upper part, captions below it and never on the stone, no sideways scroll |
| Crystal behind the sections | visible at every section, film time continuous from the stage (no jump), text contrast 4.5:1 or better |
| Reveals | a block's lines are faint when it enters and fully readable by the middle of the screen; scrolling back reverses them |

## 11. Motion through the whole page (added 2026-10-18, approved by her)

She wants motion from the beginning to the end, like oryzo.ai, not only in the opening film. Claude Motion is not on her plan (Team and Enterprise only), so the motion is built in code. The rules from section 6 still hold everywhere: motion follows the scroll (never a timer), runs backward when she scrolls back, and only one thing moves at a time.

- **The crystal stays.** After the stage's last caption the film layer stays fixed behind every section. The rest of the page drives the crystal's last seconds, from 20.04 s back to 17.8 s and forward to 20.04 s again as a smooth swing, so it keeps turning gently and never jumps. (17.8 s is after the last rock has left the frame.) Behind section text it is dimmed enough for 4.5:1 contrast. On phones the same crystal stays behind the sections.
- **Headlines and lead lines rise out of a soft blur, whole lines at a time** (never letter by letter, which she rejected before), driven by each block's position in the viewport, and fully readable by the time the block reaches the middle of the screen.
- **Case diagrams draw themselves** as you scroll past them; **the experience timeline's line grows** down the page and each role's dot lights as the line reaches it; the number strip keeps its count-up.
- **Fallbacks:** with JavaScript off every word is visible and nothing moves; with reduced motion nothing moves, no video loads, and the crystal is a still image behind the page.
- **Performance:** transform, opacity and filter only; frame interval median 20 ms or less while scrolling through the sections; no layout shift from reveals.
- **Later upgrade (optional):** a continuation clip from Higgsfield (about 285 credits) or Claude Motion clips for the case studies can replace or add to this without layout changes.

## 12. Left to the builder

- Exact scroll length per chapter, within 1.4 to 2 screens, and the extra weight on the break.
- Easing constants, within the playbook's range (playhead catching up in about 150 to 200 ms).
- Component and file structure, and how the case pages are routed.
- Encode fine-tuning within the stated budgets.
- The drawn diagrams for the three case studies, in the brand palette.
- Type scale within the existing brand tokens.
