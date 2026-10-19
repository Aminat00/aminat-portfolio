# Cinematic portfolio playbook

For: aminatmoldalieva.com rebuild. Brand: "noise becomes signal", canvas #070d16, ice blue #8fd3ff, rare amber #ffb454. Abstract imagery only. No photo of her.

Revision 2, 2026-10-18. This version folds in measurements of her own rejected builds, live Higgsfield price checks on her account, a cut scan of 21 Higgsfield sites, the Claude Motion research, and a text handover prototype.

How to read this: facts come from the sources below. **(guess)** marks my reading. **(unverified)** marks a claim a source made that nobody checked.

## Bottom line

- Her two earlier attempts did not fail on playback engineering. Both already had a full-screen stage, an eased playhead and a scrim. The Kling hero also had Blob loading and a keyframe every 8 frames (M-post).
- They failed on footage, composition and timing. The subject sat off to one side. A heavy one-sided dark wash covered the words' side. Words and picture changed at the same moment. Each finished image got too little scroll (M-post).
- So the new build keeps her engine and changes the footage, the composition and the timing. Section 3 turns this into rules with numbers. Section 2, Step 8 turns them into checks.
- Film: one continuous Seedance 2.5 take at 1080p, or a film rendered in code with Claude Code (Concept D). Test before paying. A 480p draft costs 45 credits for 15 s. She has 829.5 (HF-MCP).

## Source key

Evidence folders are under `/private/tmp/claude-501/-Users-aminatmoldalieva-side-projects-aminat-portfolio-aminat-portfolio/128392aa-e19a-4050-9f2e-d3b8e972eb75/scratchpad/research/`.

| Key | Source |
|---|---|
| HF | Higgsfield's official website skill docs (github.com/higgsfield-ai/skills, website-builder-flow: scroll-scrub.md, scroll-scrub-asset-video.md, scroll-scrub-asset-react.md, scroll-scrub-asset-css.md, website-flow.md, design-taste-frontend.md, review-rubric.md, runtime-and-infra.md) |
| HF-MCP | Live Higgsfield MCP calls on her account, 2026-10-18: models_explore (seedance_2_5), balance, show_plans_and_credits, generate_video with get_cost:true. Free checks only. Nothing was generated or bought. |
| V1 | Hyperautomation Labs, "This FREE Claude Code Skill Turns Any Brand Into a 3D World (scroll-world)", https://www.youtube.com/watch?v=Src-a8GJR20 |
| V2 | Yashica Jain, "How I Build $10K CINEMATIC Websites With Claude Code", https://www.youtube.com/watch?v=ubH1ulaK-t4 (Higgsfield-sponsored) |
| V3 | Chase AI, "Claude Code + Nano Banana 2 = Insane 3D Websites", https://www.youtube.com/watch?v=QutvJAP06-A |
| V4 | Kyle Skelly, "Claude Code + Seedance 2.5 = Insane Websites", https://www.youtube.com/watch?v=YUWBku1cNEA (Higgsfield-sponsored) |
| V5 | Vika Taylor, "Claude Design + Seedance 2.5 = 3D Scroll Websites", https://www.youtube.com/watch?v=ftDOGn13dME |
| V6 | Tech2AI, "I Built a Cinematic Motion Website with Claude Code + Higgsfield MCP", https://www.youtube.com/watch?v=8qYGux2aQ7k |
| V7 | Tristen O'Brien, "Claude + Higgsfield = INSANE Cinematic Websites", https://www.youtube.com/watch?v=UwgkkE5Fows (sponsored) |
| V8 | Creative Pad Media, "Seedance 2.0 + GPT 2 IMAGE Storyboard", https://www.youtube.com/watch?v=Xcx3N7H9ctU |
| V9 | Anthropic, official Claude Motion video (82 s), https://www.youtube.com/watch?v=en0GuyhieQk |
| V10 | Higgsfield AI, "Claude Opus 5.5 + Higgsfield Make Insane Motion Graphics! (Claude Motion)", https://www.youtube.com/watch?v=5HYYXYYCrL4 (sponsored; screen recordings sped up) |
| W-eden | https://edenstarz.higgsfield.app/ (inspected: DOM, network, clips, frames) |
| W-corte | https://corte-editor.higgsfield.app/ (inspected) |
| W-igloo | https://www.igloo.inc/ (inspected) |
| W-oryzo | https://oryzo.ai/ (inspected) |
| SW | github.com/oso95/scroll-world, `skills/scroll-world/references/scrub-engine.js` (commit 71cc36d), MIT license |
| Segmind | Segmind's Seedance 2.5 draft-final test, https://blog.segmind.com/seedance-2-5-draft-final-5-clips-tested-and-the-real-cost-math/ |
| M-post | Measurements of her own builds: the Kling hero (8ecd5d7), the rejected field build (reconstructed) and 38beba7. Headless Chrome at 1440x900 and 390x844, frame analysis, her Loom. Folder `postmortem/`. |
| M-film | ffprobe and a cut scan (frame-to-frame scene score) of the clips on 21 Higgsfield scroll-scrub sites. Folder `film-method/`. |
| M-text | Text handover measurements: the scroll-world engine, corte, eden, her live dev site, and a prototype built on her `field-stage.tsx` playhead. Folder `text-handover/`. |
| M-cm | Claude Motion research: help article, launch blog, frames from V9 and V10. Folder `claude-motion/`. |

All ten videos were watched with /watch:watch (transcripts plus frames). V9 used auto-translated captions because YouTube rate-limited the English track. Frame sampling was 1 fps or slower, so exact easing curves in the videos are not measured.

---

## 1. What these sites are

A "cinematic website" is a normal web page with a pre-rendered film pinned full screen behind it. Scroll position becomes the video's playhead. Scroll down and the film plays forward. Scroll up and it plays backward. Stop and it holds on a still frame. Nothing animates in real time, so there is nothing to stutter (V1). The film is one slow, continuous camera move. On Higgsfield sites it is either one long take or a short chain of clips joined on matching frames. Of 21 Higgsfield scroll-scrub sites measured, 10 use one take of 12 to 17 s (most exactly 15.04 s), and none of those 10 has a hard cut. The other 10 chain 2 to 6 short clips; edenstarz and corte-editor each use 4 clips of 3.8 s (M-film). All the words are ordinary HTML chapters on top of the film, in the empty space the film leaves for them (HF). After the film, the page continues as normal sections. "Higgsfield plus Claude" means Claude Code drives Higgsfield's image and video models through the Higgsfield MCP to make the stills and the film, then writes the page around it (HF, V2, V6).

The three best examples:

| Site | Why it works |
|---|---|
| https://edenstarz.higgsfield.app/ | The closest match to her brief. Dark canvas, glass shards drift, then gather into one crystal star. That is "noise becomes signal" as a film. One accent (#ff3d6e) that matches the glow inside the film, so page and film feel like one piece. Page, stage and video background are the same #0a0e14, so the film has no edge. Four 3.8 s clips joined on matching frames read as one shot. Weak spots: copy handovers overlap for about half a screen, and the headline sits over the centered star in the later scenes (W-eden, M-text). |
| https://corte-editor.higgsfield.app/ | The textbook "footage contract". One tactile subject on dark slate, one slow push-in toward a climax. Four clips with seam similarity of 0.92 to 0.98 (SSIM, a 0 to 1 image match score), so the code hard-swaps layers and nobody sees a cut. Copy sits in a mostly empty left lane and flips right when the subject moves left. Weak spot: two copy blocks share the screen for about 0.3 screens at each handover (W-corte, M-text). |
| https://www.igloo.inc/ | The quality bar, not a recipe. Awwwards Site of the Year 2024. Custom real-time 3D by a studio, no AI video. Worth studying for the rules: one full-screen world, subject always in the center 50 to 60%, tiny text pinned to the corners, double-smoothed scroll with a speed limit, one signature transition, and a "noise to signal" vocabulary (random lines resolve into the igloo, letters scramble then lock) (W-igloo). |

A note on "Cloud Motion". Two readings:

- **Claude plus Higgsfield "motion websites".** Most likely. Higgsfield's own docs make the scroll-scrubbed "animated website" the default for every website build (HF). Secondary write-ups (AlphaSignal, an X post, a Higgsfield Notion page) also describe a Higgsfield "Motion Website Generator" Claude skill from June 2026, with text animation from Higgsfield "Vibe Motion", reportedly built on Claude and Remotion. **(unverified)** None of that is in Higgsfield's own docs.
- **Anthropic's Claude Motion.** A real product, launched in beta on Oct 8 to 9, 2026. It turns prompts into code-built animations and exports MP4 (M-cm).
  - It is for Team and Enterprise plans only: on by default for Team, off by default for Enterprise.
  - Export resolution, frame rate and maximum length are not published anywhere. The official demo film is 38 s long (V9, M-cm).
  - Her account's artifact types (Dashboard, Design, Design System, Docs, Slides) include no Motion type. **(guess)** She does not have it. Only she can confirm.
  - The 1080p films in Higgsfield's Claude Motion video were not made with Motion's export button. Claude Code rendered them in a local project: a 75.5 s film at 1920x1080 and 30 fps, then 20 s and 30 s films at 1080p and 60 fps, plus a three.js scene with its own MP4 export (V10, M-cm). That path is open to her today. It becomes Concept D in section 6.

---

## 2. The exact recipe, step by step

This is written for route (b), her own Next.js site (see section 5). Her repo today is Next.js 14.2, React 18, Tailwind and framer-motion. It already contains two scrub engines (M-post, M-text):

- `src/components/hero/scrub-hero.tsx` (commit 8ecd5d7): Blob loading, a lerp loop, one seek in flight, phone scrubbing.
- `src/components/hero/field-stage.tsx` (current branch): a smoothed playhead with chapter stops, a caption fade and a scrim.

Nothing in the recipe needs a new dependency.

### Step 1. Concept and brief (half a page, before any generation)

- Write one sentence on who the site is for and the mood. Name a concept spine, one idea that threads the page (HF website-flow). For her: "noise becomes signal".
- Write the journey: chapters mapped to moments in the ONE film. Each chapter gets a focal point, one short headline, one sentence and 0 to 3 proof tags (HF).
- **Chapter count follows film length.** Give each chapter at least 3.8 s of footage. corte and eden use 3.8 s per chapter; V4 and V5 use 5 s. Her Kling hero gave each chapter about 2 s and failed (M-post). So a 15 s film holds 4 chapters and a 20 s film holds 5. **(guess, derived from those numbers)**
- Write the world grammar once: one style paragraph (materials, lens, light direction, palette hexes, background behavior). Paste it word for word into every image and video prompt. That repetition is what makes everything look like one place (V1, HF).
- Sketch the composition for every chapter before touching any AI tool (V5). On desktop the subject's light stays within 10% of screen center, left or right. Copy sits beside it in a box no wider than about 440px. See section 3, rules 3 and 21.
- Decide the story beats before generating, so the payoff happens once (V2).
- Set budgets now: all desktop clips at or under 32 MiB, all mobile clips at or under 16 MiB (HF).

### Step 2. Keyframes

- **Higgsfield's method:** ONE 16:9 image, a 6-panel grid showing 6 keyframes of a single continuous move. The prompt says it is not six different scenes, and there is no text anywhere (HF scroll-scrub.md). The film call gets it as a general image reference.
- **Risk: nobody has shown this works.** No inspected site is known to have been built this way. edenstarz and corte chain 4 clips (M-film).
  - In the only real test found, 9-panel grids were passed whole as a reference to Seedance 2.0. No grid lines or panel borders showed up in the output. But every 15 s output cut between shots that followed the panels. Those prompts did ask for cuts, with "Cut to..." visible on screen (V8).
  - Nobody has shown a grid plus "one continuous move, no cuts" giving one unbroken take. One LinkedIn post reportedly says Seedance may animate the grid boxes themselves. **(unverified)** It could not be opened.
  - So test the grid with one cheap draft (Step 3) before committing to it.
- **Fallback if the draft cuts:** pass one plain still of the subject, or 2 to 3 separate keyframe stills, and say "one continuous camera move, no cuts". This is what V4 (one finished-state render) and V5 (one still) did. Which reference the 10 clean single-take sites used is not public.
- Image model: gpt_image_2 with quality set to high. Its default is LOW, so ask for high. Or nano_banana_pro for photoreal (HF).
- The background must be exactly the site background, #070d16. Otherwise the edge of the frame shows on the page (V3).
- Re-roll budget: 2 (HF).

### Step 3. Film generation

- **Model: Seedance 2.5** (HF-MCP live schema):
  - 4 to 30 s, at 480p, 720p or 1080p.
  - The general reference role is `image_references` with `mode: omni_reference`. The schema lists no limit on how many references.
  - `draft: true` renders a 480p draft. `draft_job_id` finalizes it within 7 days, and only to 1080p.
  - Seedance 2.0 also works, at 4 to 15 s (HF).
- **Avoid Kling v3.0 for this.** It only takes start and end frames, so a storyboard becomes the literal first frame, not a style reference (HF). Her Kling take also went soft as it played: fine detail dropped 60% from the first 2 s to the last 2 s (M-post). One creator also found Kling's 1080p soft on big screens (V3, one source).
- **One take, one call, 15 or 20 s.** Ten of 21 Higgsfield sites ship one long take with no hard cut (M-film). V4 is the proof against chains: four separate 8 s clips drifted (floor plan and roof changed between them), and one continuous 20 s clip fixed it. V5 cut one 15 s take into three 5 s chapters. Multi-clip chains are only for stories that truly travel between different worlds (HF).
- **Reference role.** Pass the storyboard or still as a general image reference, never as `start_image`. HF's docs say a start frame makes the page open frozen on the storyboard for a second or two. **(unverified by us; HF docs only)**
- **Prompt rules** (HF unless marked):
  - One unbroken camera move in the prompt (slow orbit, push-in, rise, glide). No cuts.
  - When the grid is the reference, add: one continuous shot, do not reproduce the grid or its panels (M-film recommendation).
  - Name the grade and the exact hex colors.
  - Restate every time: no cuts, no camera shake, slow steady motion, locked exposure and white balance, no flicker, minimal motion blur, no on-screen text, logos or watermarks.
  - One hero subject, centered, with dark low-detail empty space around it. A bright busy background behind body copy is the most common reason a good film is unusable.
  - Constant speed, with gentle easing only in the first and last second. The scroll supplies the pacing.
  - The camera must always be moving. V5 needed three runs: run 2 froze on some frames, and the fix was asking for the camera to always move, with slight light movement.
  - First frame is the establishing shot, last frame is the closing beauty shot. Start must differ from end, or the scrub has no payoff.
  - Use simplified forms and reduced micro-detail (V4's prompt wording). Fine detail is what flickers.
  - If both start and end are defined, match their lighting. V6's end frame was lit differently, and the background brightened mid-clip.
  - Set generate_audio to false. It defaults to true (HF).
  - Turn off any "enhance prompt" option (V3).
  - Content filter false positives: drop mood words like "ambient" or "intimate" and describe it as a plain product film (HF). If still blocked, re-roll, then add the words empty, unoccupied and architectural (V1).
- **Draft, check, then finalize.**
  - Draft at the final length, so a good draft can be finalized directly: 45 credits for 15 s, 60 for 20 s (HF-MCP).
  - Run the cut checker on the draft (`film-method/scripts/takes.sh`). Finalize only if no frame-to-frame scene score is above 0.3 (M-film).
  - Does finalizing keep the draft's motion? Segmind tested 5 clips: draft and final matched at 0.95 to 0.99 frame correlation, and a cut landed on the same frame in both. A direct 1080p render with the same seed was a different take (0.257) (Segmind). ByteDance, reported second-hand, calls the final a re-render with the same seed, prompt and references, where small textures can change. **(guess)** Higgsfield passes straight through to ByteDance's draft-final step, so the draft approves the motion and composition. Not tested on Higgsfield.
  - Drafting only saves money if she rejects at least one draft. One draft plus a finalize costs 285 credits at 15 s. One direct 1080p take costs 240 (HF-MCP).
  - If the final comes out off-grade, allow ONE re-roll, then color-grade the better take toward the palette with ffmpeg (HF).
- **Upscale is not needed** if the final is a native 1080p finalize. `upscale_video` offers no price check, so its cost is unknown (HF-MCP). For contrast: V5's 720p draft looked cheap until upscaled to 2K, and W-eden's 1600x900 looks soft on large screens.
- **Cost on her account** (HF-MCP, 16:9, sound off):

| Case | 15 s | 20 s |
|---|---|---|
| 480p draft | 45 | 60 |
| 720p | 105 | not priced |
| 1080p, also the finalize price returned | 240 | 320 |

  - That is 3, 7 and 16 credits per second. Sound on, high bitrate and omni_reference mode did not change the price. The omni_reference check had no image attached.
  - The finalize check used a made-up draft id and returned 240. The server may have ignored the fake id. Segmind also found finalize costs the same as a direct 1080p render.
  - Her account: Plus plan, 829.5 credits. Top-up packs give 17 to 19 credits per dollar, so about 5.5 cents per credit.
  - **Budget:** 15 s with three drafts plus one finalize = 135 + 240 = 375 credits (about $21). 20 s = 180 + 320 = 500 credits (about $27). Storyboard images were not re-priced; V1 saw about 15 credits per GPT Image 2 still (July 2026). Either budget fits her balance.
  - V6 found the price check does not reveal plan blocks; only a real submit does.

### Step 4. Frame extraction and encoding

- A single take means NO frame sequence. The browser scrubs the MP4 directly (HF). Thousands of WebP frames on a canvas is the older method (V3: about 160 frames, about 19 MB for 6 s). It is heavier, and one decoded 1080p frame costs about 7.9 MiB of memory (SaaS Master guide).
- A short keyframe interval (GOP) makes backward scrubbing cheap, because every seek lands near a keyframe (HF). Note: her Kling clip already had a keyframe every 8 frames (M-post). This step is necessary, but it is not what makes a site look good.
- Desktop encode (HF scroll-scrub-asset-video.md):

```bash
ffmpeg -i film.mp4 -an -vf "unsharp=5:5:0.8" -c:v libx264 -preset slow -crf 20 \
  -pix_fmt yuv420p -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart public/film/desktop.mp4
```

- Mobile encode: height capped at 720, softer sharpen, CRF 23, keyframe every 4 frames (HF):

```bash
ffmpeg -i film.mp4 -an -vf "scale=-2:720,unsharp=5:5:0.6" -c:v libx264 -preset slow -crf 23 \
  -pix_fmt yuv420p -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart public/film/mobile.mp4
```

- Other creators used denser keyframes: -g 1 at 1440px (V2), -g 5 (V4), GOP 6 (V6). Start with HF's numbers and only go denser if backward scrub steps.
- Posters: take frame 1 of the ENCODED clips, not the raw file, so first paint matches playback (HF): `ffmpeg -ss 0 -i public/film/desktop.mp4 -frames:v 1 -q:v 2 poster.jpg`. Same for mobile. Then convert to WebP or AVIF. W-corte ships 1 MB PNG posters (4.3 MB wasted) and W-eden about 10 MB of PNGs.
- A film rendered in code (Concept D) goes through the same encode.
- Keep raw clips and rejects out of public/. Check totals against 32/16 MiB. Visited clips stay in memory for smooth reverse scroll, so bytes also cost RAM (HF).

### Step 5. The scrub engine: start from her own code

- **Base: her `field-stage.tsx` playhead.** It already has a smoothed scroll (about 150 ms), chapter stops, a caption fade and a scrim. In a prototype, replacing the field drawing with writes to `video.currentTime` took about 10 lines (M-text; prototype at `text-handover/site/fs.html`).
- **Add the loading and hardening pieces.** Take them from her own `scrub-hero.tsx` (8ecd5d7), or from the HF engine or scroll-world. Both outside repos are MIT (GitHub API; SW LICENSE file). The pieces:
  - fetch() the whole MP4 and turn it into a Blob URL in a muted, playsinline video. Seeking then never depends on server byte-range support. V2's build got stuck on frame 0 without it; V1 warns about the same bug.
  - Start loading when the film is within 1.5 viewports (HF).
  - Keep the poster visible until the first `seeked` event, so there is never a black flash (HF).
  - On the first touch, call play() then pause() to unlock seeking on iOS (HF).
  - Keep one seek in flight. Write `currentTime` only when the change is above 0.008 s on desktop or 0.02 s on mobile (HF).
  - Under prefers-reduced-motion, download no video at all (HF).
- **Loop.** A passive scroll listener only sets a dirty flag. A requestAnimationFrame loop does the work. Each frame, ease toward the target: `current += (target - current) * k`. HF uses k = 0.2; her Kling hero used 0.16. Both are fine. Smoothing was not the difference between her rejected and fixed builds (158 ms vs 150 ms) (M-post).
- **Layout.** Her field-stage is a fixed full-viewport layer behind the whole page. Keep that. **(guess)** Fade or hide it when the last film chapter ends, so the sections below sit on plain background. HF's alternative is a sticky stage with the story column pulled over it by `margin-top: -100dvh`. Her style rule prefers flex and gap over margins. **(guess, untested)** Putting stage and story in one grid cell (`grid-area: 1 / 1` on both) gives the same overlay.
- **Linger (optional).** Slows the middle of a chapter without moving its first or last frame: `(1 - L) * x + L * (4 * (x - 0.5)^3 + 0.5)`, with L from 0 to 0.6 (HF).
- **Hard rules** (HF): init only inside useEffect (SSR safety); keep the chapter array a module constant; never push per-frame values through React state; only one thing owns video time; tear down on unmount (cancel rAF, remove listeners, abort fetches, revoke Blob URLs); if she has a CSP, `media-src` must allow `blob:`.
- **GSAP gotcha** if she ever adds it: GSAP cannot tween `video.currentTime` directly; it silently does nothing. Tween a proxy object instead (V2). Simpler: don't add GSAP. framer-motion, already installed, covers the chrome.

### Step 6. Text on top

- All type is HTML. Never bake words into the film (HF).
- Per chapter: one headline of 8 words or fewer (2 lines max), one sentence of 25 words or fewer, 0 to 3 tags. Hero: at most 4 text elements (HF).
- Engine default type scale, a good start: title `clamp(2.75rem, 6vw, 6.75rem)`, weight 700, line-height 0.94, letter-spacing -0.045em, max 13ch, `text-wrap: balance`; body `clamp(1rem, 1.35vw, 1.2rem)`, line-height 1.55, max 42ch, muted color (HF, live on W-eden).
- **Copy box width for a centered film:** about 440px at 1440px wide, roughly 35vw minus the gutter. **(guess)** A 640px box covered the center 30% of the screen in 76 to 100% of text frames on corte, eden and her prototype. scroll-world's 460px box never did (M-text).
- **Handover rule (decided): use her playhead fade.** The old caption is fully gone before the new one starts. Do not use HF's default, where copy scrolls 1:1 with the page and never fades.
  - Her fade, measured: 0 screens with two captions at once on desktop and phone. Readable hold of 1.41 to 1.53 screens on desktop and 1.23 to 1.34 on phone. About 0.2 screens with no text at each handover (M-text).
  - HF style, measured on the same prototype: 0.44 screens (desktop) and 0.38 (phone) of two captions at once, back to back (M-text).
  - In HF style the overlap equals the height of the copy block. More scroll weight only lengthens the hold. It never removes the overlap (corte: 0.28 to 0.33 screens per handover; eden: 0.49 to 0.53) (M-text).
- **Fade length:** 0.3 to 0.5 screens in and out, the range oryzo uses (W-oryzo). Her Kling captions faded over only 45 to 90 px and popped (M-post).
- **Timing against the film:** the words arrive after the film reaches its chapter moment and leave before the next one. The caption's fade and the film's main change should share at most 25% of their scroll range (M-post target). scroll-world works this way: a middle title peaks around 0.45 of its clip and is at zero during connecting clips (SW).
- **Make the fade safe without JavaScript.** HF bans scroll-linked opacity-to-zero, because a full-page headless screenshot must show every section (HF website-flow.md, rubric 9b). Her live site breaks this today: with JavaScript off, all six captions, including her name and contact links, sit at opacity 0. The cause is `.band { opacity: 0 }` in `globals.css` (M-text). Fix: captions are visible by default in CSS, and the fade switches on only through a class an inline script sets before first paint.
- **Still open:** how a caption hands over to the normal content sections below the film. On her live site, captions and content sections share the screen for 1.68 screens in total, and for 0.30 to 0.38 screens each time on phone (M-text).
- Copy is always in the DOM in reading order (HF).
- No "scroll to explore" hint, no em dashes in visible copy (HF; V2 removed them because they read as AI-written).
- Chrome: a 2px accent progress bar and a chapter nav (HF). Build her own header and do not let it cover the chapter nav. W-eden has that bug: its nav is hidden after the first 73px of scroll.

### Step 7. Mobile

- Separate 720p encode with keyframes every 4 frames, and its own poster (HF). Phones are picked by `(hover: none) and (pointer: coarse)` or width at or under 860px (HF).
- A 16:9 film cropped to portrait shows only about a quarter of its width. On W-corte the knife is nearly cropped out on phones. So keep the subject dead center and treat the edges as expendable (HF, W-corte). Her rejected field build was fine on phones for exactly this reason: shape centered at 48 to 56% (M-post).
- Copy goes bottom-left, width `min(100%, 36rem)`, with a bottom-up gradient scrim and the safe-area inset in the bottom padding (HF).
- Ignore resize events that only change height, so the phone URL bar does not trigger re-layout (HF).
- Option: a native 9:16 second film. Better framing, but it roughly doubles video cost (V1). Option: drop the pin below 860px and stack captions over one still (V5). Start with the cropped single film.
- **(unverified)** All phone results in this research come from headless Chromium emulation. Blob seeking on real iOS Safari, and memory use at the 16 MiB budget, are untested. Test on a real iPhone.

### Step 8. Performance and checks

- Budget: 32 MiB desktop clips, 16 MiB mobile (HF). W-corte and W-eden land at 9.3 and 6.9 MB of desktop video.
- Preload the first poster with high fetch priority. Targets: LCP under 2.5 s, INP under 200 ms, CLS under 0.1 (HF taste list).
- prefers-reduced-motion: zero video downloads, posters only, every chapter at least 100dvh, hard layer switches (HF).
- Grain or noise, if any, goes on one fixed `pointer-events: none` layer (HF).
- **Measure these before showing her anything.** Use the scripts from this research: `postmortem/` (`measure-field.js`, `analyze.py`) and `text-handover/scripts/` (`run.js`, `score.js`, `nojs.js`). Her older audit scripts (`walk.js`, `legib2.js`) are gone.

| Check | Pass | Her failed builds |
|---|---|---|
| Subject's light center at every hold, desktop | within 10% of screen center | 64% (Kling), 76 to 83% (field) |
| Brightness of the words' side vs the other side | close; no one-sided wash | 1.65x darker (Kling), 3x to 6x darker (field) |
| Caption fade vs film change, shared scroll range | 25% or less | 100% in 5 of 6 chapters (field) |
| Hold on each finished shot | 1.2 screens or more | 0.8 screens (field) |
| Footage per chapter | 3.8 s or more | about 2 s (Kling) |
| Frames with two captions on screen | 0 | 0 on her fade; HF style 0.38 to 0.44 screens |
| Copy box inside the center 30% of the screen | never | 76 to 100% of frames with a 640px box |
| JavaScript off | every caption visible | all six at opacity 0 (live site) |

- HF's own process has no browser check. Do one. V2 had Claude verify forward scroll, backward scroll, hold with no drift, and 60 fps (16.7 ms median frame time).
- If she ever chains clips, measure the seams. W-corte's seams scored SSIM 0.92 to 0.98; the 0.92 seam showed a small reframing jump.

---

## 3. What makes the good ones feel smooth and unified

### Unified across the whole screen

1. **One full-viewport stage behind everything.** The film fills every edge at all times, and text overlays it (HF, W-eden, W-corte, W-igloo). Necessary, not enough: both of her attempts already had this (M-post).
2. **Page background equals film background, exactly.** W-eden uses #0a0e14 for page, stage and video, so the film has no edge. For her: #070d16 in every prompt and in CSS (V3, W-eden). **(guess)** Video compression can shift very dark colors slightly. Sample a corner pixel of the encoded poster and match the page to it if needed.
3. **One subject, centered, in the same spot.** On desktop keep the subject's light center within 10% of screen center, left or right (M-post target). W-igloo keeps its subject in the center 50 to 60%. W-oryzo keeps its coaster in the same center spot through almost every chapter, so the eye never hunts.
4. **No one-sided wash.** A soft dark pool behind the words is enough (rules 23 and 24). Both of her attempts had a 97° wash from the left, 86 to 95% dark (M-post).
5. **One style paragraph for every generation**, word for word (V1).
6. **The accent color lives in the film's light and in the UI.** W-corte's hot pink is the glowing cut and the progress bar. W-eden's red is the star's core and the buttons. For her: ice blue as the light in the film and the UI accent; amber once or twice as a single glint.
7. **One theme, one accent, one corner radius, one type pairing** (HF design contract).

### Smooth

8. **One continuous camera move, no cuts.** If clips are chained, each must start on the actual last rendered frame of the one before, and the camera must never reverse across a seam (V1, HF).
9. **The camera moves; the world does not morph.** V1's best results are camera flights through solid, static scenes (V1; my reading). This applies to AI video. A film rendered in code (Concept D) can morph, because every frame is drawn exactly.
10. **Constant slow speed, easing only at the ends** (HF). The playhead is eased on top, about 20% of the remaining gap per frame, catching up in roughly 150 to 200 ms (HF, W-corte).
11. **Enough footage and enough scroll per chapter.**

| Source | Scroll per chapter | Footage per chapter | Felt |
|---|---|---|---|
| HF engine default | 1.4 viewports | any | baseline |
| W-corte | 1.4 to 1.5 viewports | 3.8 s, about 15 px per frame | calm |
| W-eden | 2.2 to 2.4 viewports | 3.8 s, about 22 px per frame | very slow in the holds |
| V5 | 1.5 viewports | 5 s | smooth |
| V4 | 2 viewports | 5 s | smooth |
| V2 | 2.8 viewports | about 6 s | smooth |
| V3 | 5 viewports | 6 s | too long, about 8 heavy scrolls |
| Her Kling hero | 0.7 to 0.8 screens of readable caption | about 2 s | rejected |

   Rules: 1.4 to 2 viewports per chapter, at least 3.8 s of footage per chapter. **(guess, from W-corte and W-eden)** About 15 to 22 px of scroll per film frame at 24 fps. Her Kling hero ran 18.6 px per frame on desktop and still failed, so scroll per frame alone does not make it smooth (M-post).

12. **Hold each finished shot for at least 1.2 screens** (M-post target). Her field build held each finished shape for only 0.8 screens, formed it over 0.5 screens, and burst to about 500 px of noise between every pair (M-post).
13. **Short keyframe interval** (GOP 4 to 8) and Blob-loaded video (HF, V2, V4).
14. **Seek coalescing.** One seek in flight; ignore changes under 8 ms (desktop) or 20 ms (mobile) (HF).
15. **Crossfade between clips** (only if chained): smoothstep over 10% of the viewport height, about 90px (HF, W-eden).
16. **Smooth scroll is optional, with care.** W-igloo double-lerps the scroll (0.075, then 0.15), caps how far input can run ahead (0.56 screens), and snaps to a rest point after 1.4 s idle. W-oryzo eases with a coefficient of 12 (about 0.4 s to settle). Both take over native scroll and have no reduced-motion handling. W-corte and W-eden use native scroll plus the eased playhead, which is the safer default.

### Text and motion take turns

17. **Only one thing moves at a time.** The film moves. The text holds still, then fades on the playhead. It never slides against the film (W-eden, W-corte, SW).
18. **The picture settles first, then the words come in.** Caption fade and film change share at most 25% of their scroll range (M-post target). In her field build they shared 100% in 5 of 6 chapters (M-post). V1's demo shows the same rhythm: the headline fades in about 1 s after a scene settles and fades out before the next one.
19. **One text idea on screen at a time.** Use her playhead fade: 0 screens of overlap, versus 0.38 to 0.44 for HF's 1:1 default. Fades of 0.3 to 0.5 screens (M-text, W-oryzo).
20. **Captions are visible without JavaScript** (HF rubric 9b, M-text).
21. **Copy lives in the empty space**, never on the subject's core. Cap the copy box at about 440px for a centered film **(guess)** (M-text). V5's brief says text never sits over a face.
22. **Fades are tied to scroll, not to timers.** W-oryzo computes each letter's blur and opacity from chapter progress, so scrolling back runs it in reverse.

### Scrims

23. **Desktop:** a radial ellipse behind the copy in the page color: about 88% at the center, 58% at the middle, transparent by 76%, reaching 3rem above and below and 5rem to each side (HF, live on W-eden and W-corte). Fix W-corte's bug: its ellipse is still about 20% opaque at the box edge, so a rectangle shows over bright frames. Use a `closest-side` ellipse, or a mask that reaches 0 well inside the box.
24. **Mobile:** a bottom-up linear gradient that fades to 0 at both ends. W-eden's has a hard, fully opaque bottom edge that looks like a dark panel sliding over the film.
25. **Never a full dark overlay, never a heavy wash across one side** of the film (V5, M-post).

### Story shape and exits

26. **Still, gather, resolve, still.** W-eden puts its two busy scenes in the middle, framed by quiet holds. Start must differ from end (HF).
27. **Let the last frame land before the stage lets go.** W-corte's stage scrolls away when the last clip is only 33% done, and W-eden ends with a hard edge into flat cards. Both feel abrupt. Give the last chapter enough weight or linger. V2 dips to the background color before the next section rises.
28. **Pinned film, then normal scroll.** Don't make the whole site one pinned video (V2). One film at the top, then plain sections, is the pattern on W-eden and W-corte.

---

## 4. Why her two earlier attempts failed

This section is rewritten from measurements of her own builds (M-post). The first draft of this playbook guessed two causes that turned out wrong: "stepped scrubbing" (the Kling clip had a keyframe every 8 frames) and "a canvas in one half of the page" (the field canvas covered the full viewport).

### Attempt 1: Kling scroll-scrubbed hero (8ecd5d7)

What happened, in order:

- Take 1 had the dots-to-lines morph (`review/hero-raw.mp4`). She turned it down on 2026-09-22, before it shipped: the lines came in crooked and the dots suddenly became an unclean line.
- Take 2 shipped as `public/hero/hero-scrub.mp4`: particles only, no morph. It matches `review/hero-v2-raw.mp4` at 43.7 dB PSNR, against 19.8 dB for take 1. She rejected it on 2026-10-05 as low quality and asked for something clear.

The engine was fine. 1728x976, 24 fps, 145 frames, 6.04 s, a keyframe every 8 frames. Blob loading, a lerp (k = 0.16), one seek in flight, phones scrubbing a portrait cut. 18.6 px of scroll per frame on desktop, inside the target range.

| Symptom | Measured cause | Rules broken |
|---|---|---|
| "Not clean, lines crooked" (take 1) | The dots-to-lines morph. Diffusion video redraws fine detail every frame, so a morph of tiny dots has no stable shape in between. Lines appear around 2.5 to 3 s. | 9 |
| "Not good quality, want clear" (take 2) | Fine detail drops 60% across the clip (high-pass mean 5.17 to 2.08), so it goes soft as it plays. There is no subject: the sharp detail sits around 64% of the width, and only 9% of it falls in the left 45%, where the words are. | 3, 8 |
| Too little film per idea | About 34 to 39 frames, roughly 2 s of footage, per chapter, against 3.8 to 6 s on the good sites. | 11 |
| Captions pop | Captions fade in and out over only about 45 to 90 px. | 19 |
| Words feel boxed in | A 97° wash from the left, 95% dark at the left edge and 86% at mid-screen. During captions the left side is about 40% darker than the right (mean gray 9.5 vs 15.7). | 4, 25 |

### Attempt 2: WebGL stroke field (rejected first cut, reconstructed)

What happened: she rejected the first cut on 2026-10-08 at 10:19Z with a 53 s Loom (https://www.loom.com/share/9327a1c8923c433e9f20cd6b2ccd4215). That build was never committed. The fix landed at 11:01Z in 38beba7. It was rebuilt for measurement from 52519ee plus the 8 edits recorded in the session log, and its frames match her Loom (M-post).

What was already right: a fixed canvas covering the full viewport, a scrim, smoothing of about 158 ms, 1.8 screens per chapter (inside the 1.4 to 2 range), and a balanced phone layout.

| Symptom | Measured cause | Rules broken |
|---|---|---|
| "Only built on the right side" | Every shape was hard-coded to the right (x 1.85 to 2.15). The shape's light center sat at 76 to 83% of the width, and 0% of its light landed in the left half (6% for Contact). A lane guard dimmed strokes by 94% across the left 52% while a caption was on. The same 97° left wash from the Kling hero sat on top. With the page hidden, the left half showed plain background only; with the page showing, it was 3x to 6x darker than the right. | 3, 4, 25 |
| "Text and animation colliding" | Caption opacity was set to the same value as the shape's morph. Their scroll ranges overlapped 100% going in and coming out in 5 of 6 chapters (90 to 100% on phone). At the boundaries the numbers were identical: caption 0.58 / shape 0.58, then 1 / 1, then 0.30 / 0.30. | 17, 18 |
| "Very short, quick" | Each chapter got 1.8 screens, but a finished shape held for only 0.8 screens (720 px). Shapes formed over 495 px, left over 450 px, and about 500 px of noise sat between every pair. | 12, 26 |
| "Half-finished" | The words' side was blanked by design, so half of every desktop frame was empty background. **(guess)** That empty half is what read as unfinished. | 1, 3, 4 |

### What this means

- Playback engineering did not fail in either attempt. Choreography and art direction did: subject placement, the one-sided wash, the lane guard, the shared timing and the morph window. All of them were choices written into code (M-post).
- The current build, 38beba7, has not been reviewed by her yet, and it still splits the screen. On desktop the shape's light center sits at 71 to 80% (or 22 to 24% on flipped chapters), and only 0 to 9% of its light falls on the words' side. Words and shape still overlap 50 to 92% going in and 33 to 54% coming out (M-post). Expect the same objection if she reviews it as "fixed".
- Not measured: smoothness on a real GPU (all renders were headless), and the Kling hero in motion (no recording exists; "quality" rests on her words plus the detail measurement).

---

## 5. Two build routes, compared honestly

| | (a) Higgsfield website builder, scroll-scrub template | (b) Her own Next.js site with Higgsfield or code-built footage |
|---|---|---|
| Where it lives | `<name>.higgsfield.app`, one Cloudflare Worker running React 19 + TanStack Start (HF runtime-and-infra) | aminatmoldalieva.com on her current host |
| Custom domain | Not documented. Absence of evidence, so treat as unconfirmed. | Yes |
| Code ownership | Code sits in a Higgsfield-hosted git repo, reached by direct clone or a brokered sandbox with 15-minute edit leases. Vendored Higgsfield packages must stay. The live build carries Higgsfield's design-inspector editing bridge. Export to another host is not documented (HF). | Full |
| Licensing | The github.com/higgsfield-ai/skills repo is MIT (GitHub API). Not checked: whether the engine copy shipped inside the website template carries the same license. | Her own code, plus MIT pieces from scroll-world or the HF skills repo if she wants them |
| Engine | Pre-built. Do not rewrite it (HF). | Already in her repo twice. The field-stage playhead plus a video swap of about 10 lines worked in a prototype (M-text). |
| Text handover | HF default: copy scrolls 1:1 and never fades, so two blocks share the screen for 0.28 to 0.53 screens per handover (M-text). HF's rules also ban scroll-tied opacity fades (HF rubric 9b). | Her playhead fade: 0 overlap, measured (M-text) |
| Effort | Lowest. One intake round, then the agent runs the phases. **(guess)** A few hours. | **(guess)** 1 to 3 days. Most of it is composition, mobile and the checks in Step 8. The engine is the small part. |
| Deploy | One deploy_website call ships straight to live. No preview copy (HF). | Her normal preview and deploy flow |
| Verification | Code and assets only. No browser or screenshot step (HF review rubric). | Real browser, real phone, and the Step 8 checks |
| Taste rules | Strong gates, mostly good ones. Her brand trips two palette bans (near-black + neon blue, near-black + amber) and the one-accent rule, so she must defend it in writing as her own brand. HF also caps accent saturation under 80%. #8fd3ff is 100% in HSL but about 44% in HSV, and HF does not say which model it means (HF). | Her call. Same advice, as taste, not a gate. |
| Quality ceiling | Same as W-eden and W-corte. Good, but template-shaped. | Higher. She controls scrims, the film-to-page exit, mobile, content depth, case studies and résumé. |
| Cost | Generation credits plus a Higgsfield plan. Hosting price not documented. | Same generation credits: 375 to 500 for the film (HF-MCP). Her Plus plan and 829.5 credits cover it. Concept D costs no credits. Hosting as today. |
| Main risk | Template overlap at handovers, public the moment it deploys. | Rebuilding the same composition and timing as before. Then she rejects it for the same reasons. The Step 8 checks exist to stop this. |
| Fit with her story | Shows taste. | **(guess)** The site itself proves "owns the parts next to the feature": encode pipeline, engine, mobile, accessibility and performance are all hers. |

Nothing in the recipe needs Higgsfield at runtime. The output is an MP4, posters and a small React component (HF). Route (b) loses nothing on quality and wins on ownership.

**My recommendation: route (b).** Use the Higgsfield MCP only for the stills and the one film, or skip it entirely with Concept D. Skip route (a) as a "quick test": it goes public the moment it deploys, and footage can be tested locally just as fast.

---

## 6. Four abstract film concepts

Concepts A, B and C are AI video. They follow the AI-video constraints: one continuous camera move, a few large solid forms, no swarms of tiny particles, no lines morphing into other shapes, no text in frame, everything on #070d16. Concept D is rendered in code, so the particle ban does not apply to it.

All four map to five chapters of her story. That needs a 20 s film at 4 s per chapter (Step 1). A cheaper option: a 15 s film with chapters 1 to 4, and Contact as a normal section below the film.

1. Who she is (establishing shot)
2. The messy multi-team process (noise)
3. Owning the parts next to the feature
4. One automated system (signal)
5. Contact (closing beauty shot)

### Concept A: "The Seam" (safest AI film)

- **Picture.** One dark machined sculpture, about eight interlocking blocks of graphite metal and frosted glass, floating centered in a near-black void.
- **Camera.** One slow quarter-turn orbit while pushing in, from wide and low to a close three-quarter beauty shot.
- **Story through light only.** At the start, cold scattered rim lights catch random edges, so the object reads as a jumble (noise). As the camera moves, a thin ice-blue light travels along the seams and joins part to part (owning the edges). At the end, every seam is lit as one continuous line and one small amber point glows at the core (signal).
- **Chapter map (20 s).** 0 to 4 s wide and shadowed; 4 to 8 s cold scattered glints; 8 to 12 s ice-blue light travels along the seams; 12 to 16 s all seams joined; 16 to 20 s beauty shot with the amber core.
- **Why diffusion can hold it.** Only the camera and the light move. The object never changes shape. That is HF's top scrub subject (a product slowly orbiting on black) and V1's "camera moves, world doesn't morph" rule. The moving light keeps every frame alive, which cured V5's frozen frames. The object stays centered, which passes the composition check.
- **Risk.** The traveling light must stay local, not pump the whole exposure. Say "locked exposure" and keep the light thin.

### Concept B: "The Long Surface"

- **Picture.** A low macro glide along one long slab of dark glass and brushed metal, shallow depth of field.
- **Story in space, not in time.** The surface changes along its length. It starts fractured, with a few large loose chips and scattered cold glints. It ends polished and unbroken, with one ice-blue reflection line and an amber point at the far end.
- **Camera.** One slow lateral glide from the rough end to the clean end. Chapters are 4 s stretches of the surface.
- **Why diffusion can hold it.** The world is static; only the camera travels. That is HF's "macro detail traveling along a surface" subject. It also crops well to portrait, because the slab is a horizontal band through the center.
- **Risk.** Macro texture can shimmer. Ask for simplified forms and reduced micro-detail. Keep the chips few and large.

### Concept C: "Gather"

- **Picture.** Six to nine large parts (glass plates, a metal ring, a core) float apart in dark space.
- **Camera.** A slow push-in with an eighth-turn orbit while the parts glide inward and lock into one clean unit. A final amber glint appears at the last joint.
- **Why it can work.** It is the most literal "many messy parts become one smooth system". W-eden proves the move (glass shards gather into one crystal star), and HF lists exploded-view assembly as scrub-friendly.
- **Risk.** Highest of the AI concepts. Shapes can drift while they move. W-eden made the move with 4 chained clips, not one take. Keep the part count low, define start and end in the reference, and expect re-rolls.

### Concept D: "Noise to Line", rendered in code

- **Picture.** A few hundred short ice-blue strokes scattered across the full frame, drifting slowly. Over the film they turn, align and gather into one clean horizontal line through screen center. One amber point lights at its middle. The camera pushes in slowly. Full frame, centered, on #070d16.
- **How.** Claude Code in a local project, with three.js or a 2D canvas. Fixed random seeds, so every render is identical. Render 1920x1080 frames, then encode with the Step 4 settings. The scrub engine does not care where the MP4 came from.
  - V10 showed this path: Claude Code rendered 1920x1080 films of 20 s and 30 s at 60 fps, and one of 75.5 s at 30 fps, from a local project (M-cm).
  - **(guess)** 24 or 30 fps is enough for a scrubbed film. 60 fps doubles frames and bytes.
  - **(guess)** Her `field-stage.tsx` already draws ice-blue strokes in WebGL. Rendering it offline, re-composed centered and timed by section 3, may be the fastest version of D.
- **Why it can work.** No diffusion, so no flicker, no softening and no crooked morphs. Exact brand colors. She can edit any frame. It costs no credits. It is the only concept that keeps "noise becomes signal" literal.
- **Risks.**
  - She may read it as the rejected field again. Her field was rejected on composition and timing, not technique (M-post), but the look is close.
  - **(guess, untested)** Compression can shift very dark colors, so the film may not blend into #070d16 exactly. Sample the encoded poster and match the page.
  - All the composition and timing rules still apply.
  - It is not AI footage, if the Higgsfield look itself matters to her.
- **Claude Motion instead?** Only if she has a Team or Enterprise plan. Its export resolution, frame rate and length are unpublished, so export a 15 s test on #070d16 and check it with ffprobe first (M-cm).

### Which is safest

- **Safest AI film: A.** One solid object, only the camera and light move, subject always centered.
- **Cheapest to test: D.** No credits, fully repeatable, and the only literal "noise becomes signal". Its risk is taste, not technique.
- Test both side by side: one A draft (45 or 60 credits) and one D render (free). Pick by eye.

### Draft prompts for Concept A

My own wording, built from HF's prompt rules.

Storyboard (gpt_image_2, quality high, 16:9). Use only if the grid test passes (Step 2):

```
One 16:9 image, a 6-panel grid showing 6 keyframes of ONE continuous camera move, not six different scenes.
Subject: a single dark machined sculpture of about eight interlocking blocks of graphite metal and frosted glass,
floating centered in a seamless near-black void, background exactly #070d16.
Panel 1: wide and low, the object mostly in shadow, a few cold scattered rim lights catch random edges.
Panels 2 to 5: the camera slowly orbits a quarter turn and pushes in; a thin ice-blue light (#8fd3ff) travels
along the seams, joining part to part.
Panel 6: close three-quarter beauty shot, every seam lit as one continuous ice-blue line, one small warm amber
point (#ffb454) at the core.
Same lens, same light direction, same materials in every panel. Simplified forms, reduced micro-detail,
generous dark empty space left and right. No text, no logos, no watermark.
```

Fallback still (if the grid draft cuts): the same subject as one plain 16:9 image of the panel 1 state, centered, on #070d16.

Film (Seedance 2.5, `image_references` with `mode: omni_reference`, 20 s, 16:9, audio off, `draft: true` first):

```
Plain product film. One continuous shot with no cuts. Do not reproduce the grid or its panels.
The camera starts wide and low on a single dark machined sculpture of about eight interlocking graphite and
frosted-glass blocks, centered in a seamless near-black void (#070d16). The camera slowly orbits a quarter turn
to the right while pushing in, at a constant slow speed, easing only in the first and last second. The camera is
always moving. The sculpture never changes shape. A thin ice-blue light (#8fd3ff) travels along the seams between
the blocks, joining them one by one. The shot ends on a calm close three-quarter view with every seam lit and one
small warm amber point (#ffb454) at the core. Cool low-key grade. Locked exposure and white balance, no flicker,
no camera shake, minimal motion blur. Subject stays centered with dark empty space around it.
No text, no logos, no watermark.
```

Optional side asset: a short animated diagram of her real multi-team process, before and after, for the case-study section below the film. A small SVG animation does this. Keep it out of the hero.

---

## 7. Open questions only she can answer

1. Which Claude plan does she have? Does she see a "Motion" option under Output or in the Artifacts tab? And did "Cloud Motion" mean that product, or Claude plus Higgsfield motion websites?
2. OK to spend 45 credits (15 s) or 60 credits (20 s) on one 480p test draft, with the grid as reference?
3. Route (a) or (b)? Is owning the code on her own domain part of the message?
4. Which concept feels like her: A (one object, light joins it), B (a surface going from rough to polished), C (parts gathering) or D (strokes in code aligning into one line)? Does she want AI footage specifically, or is a code-built film fine? Would D feel too close to the rejected field?
5. Film length: 20 s with 5 chapters, or 15 s with 4 chapters and Contact below the film?
6. Keep two accents (ice blue and amber), or make amber appear only inside the film as a single glint? Is she open to a slightly less saturated ice blue?
7. What real facts about the automation can the site state? How many teams, what the process was before, what it is now. No invented stats.
8. What comes after the film: case study, résumé, contact? And how should the last caption hand over to those sections?
9. Mobile: accept a center crop of the desktop film (cheaper), or pay for a native 9:16 second film (about double the video cost)?
10. Has she seen 38beba7? Should the stroke field be retired, while its playhead stays on as the scrub engine?
11. Which fonts? HF's safe pairings include Geist + Geist Mono and Satoshi + JetBrains Mono, but her type may already be decided.

---

## Recommendation and next action

Build route (b): her own Next.js site. Keep her `field-stage.tsx` playhead as the engine, swap the field drawing for one scrubbed MP4, and add the loading pieces from `scrub-hero.tsx`. Then fix what actually failed: a centered subject, no one-sided wash, the picture settling before the words, at least 1.2 screens per finished shot, and at least 3.8 s of footage per chapter. Run the Step 8 checks before she sees anything.

For the film, test two options side by side: one Concept A draft at 480p (45 or 60 credits, cut-checked before any finalize) and one Concept D render in Claude Code (free). Finalize only a clean take.

Next action: ask her questions 1, 2, 4 and 5. Two free fixes can go ahead in the meantime: make captions visible without JavaScript, and cap the copy box width for a centered film.

### Still not verified

- Whether a grid reference plus a continuous-move prompt gives one unbroken take (needs the test draft).
- Whether Higgsfield's finalize keeps the draft's motion, and its real price there.
- How many references `image_references` accepts, and what `upscale_video` costs.
- Claude Motion's export resolution, frame rate and maximum length, and whether her plan includes it.
- Whether the engine copy inside the Higgsfield website template is MIT like the skills repo.
- Custom domains on Higgsfield hosting (not documented).
- Blob seeking and memory on real iOS Safari. All phone tests were headless emulation.
- Smoothness on a real GPU. All renders were headless.
- That HF's `start_image` warning (a frozen first second or two) happens in practice.
- The grid-cell overlay as a replacement for `margin-top: -100dvh`.
- Higgsfield's "Motion Website Generator" (June 2026) and "Vibe Motion powered by Claude and Remotion". Secondary write-ups only.
- How dark colors shift in compression for a #070d16 film.
- The effort estimates in section 5.
- Kling's softness on big screens and "twisting motion loses crispness". One creator each (V3).
