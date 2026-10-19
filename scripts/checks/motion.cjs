// Motion through the whole page (spec section 11).
//  1. The crystal stays: just past the stage the film is still on its last frame (no jump), and at the middle
//     of each section video.currentTime follows crystalSwing(progress) for the page progress after the stage.
//  2. With all text hidden the crystal shows in the centre third of the screen at the middle of each section,
//     and the lightest pixel behind every line of section text gives 4.5:1 against that text's colour.
//  3. Every ScrollReveal block is faint (each line under 0.2) with its top at 95% of the screen, fully in (1, no
//     transform, no filter) with its top at 50% (or at the page end when it cannot climb that far), and faint
//     again after scrolling back above it.
//  4. Each case diagram's main paths are undrawn before the diagram enters and drawn once it is past the middle
//     of the screen; the experience line grows with the scroll and each dot lights as the line reaches it.
//  5. JavaScript off: every reveal line at opacity 1 with no transform. Reduced motion: no film request, every
//     reveal line static at 1, the end still behind the sections.
//  6. A wheel sweep through the sections: median requestAnimationFrame interval 20 ms or less; cumulative
//     layout shift under 0.1.
// Runs at 1440x900 and 788x734 (the owner's pane), and the crystal, contrast, reveal and header checks at
// 390x844 too. Every check prints PASS or FAIL with its measured value; the process exits 1 if any check fails.
// Screenshots go to $CHECK_OUT (default: the OS temp dir).
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { BASE, withPage, waitReady } = require("./lib.cjs");
const timeline = require("../../src/lib/film/timeline.ts");
const { CASES } = require("../../src/content/site.ts");

const FILM_DURATION = timeline.FILM_DURATION;
const CRYSTAL_FROM = timeline.CRYSTAL_FROM ?? 17.8;
// Until timeline.ts exports it, the brief's formula stands in so the other checks still run (and its own check fails).
const crystalSwing =
  timeline.crystalSwing ?? ((p) => FILM_DURATION - (FILM_DURATION - CRYSTAL_FROM) * Math.sin(Math.PI * Math.min(1, Math.max(0, p))));

const SIZES = [
  { tag: "1440x900", width: 1440, height: 900, full: true },
  { tag: "788x734", width: 788, height: 734, full: true },
  { tag: "390x844", width: 390, height: 844, mobile: true },
];
const SECTIONS = ["#intro", ".proof-section", "#work", "#experience", "#projects", "#about", "#contact"];
const CONTRAST_MIN = 4.5;
const SWING_TOLERANCE = 0.15; // s
const HANDOFF_TOLERANCE = 0.2; // s
const LIFT = 4; // luma levels a pixel must gain from the film to count as crystal
// Crystal pixels behind a section must be at least this share of the crystal pixels in the same centre third
// on the bare end still (the stage's last frame, nothing over it). Calibrated on the first green run: open
// sections measure 43% to 76%, the work section (behind the cards' 60% panels) 16% to 28%; with no crystal
// behind the page (the code before Task 11) the intro and work sections measured 0% to 1%.
const CRYSTAL_SHARE = 0.12;
const OUT = process.env.CHECK_OUT || path.join(os.tmpdir(), "motion-checks");
fs.mkdirSync(OUT, { recursive: true });

const results = [];
function record(name, pass, detail) {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
}
async function check(name, fn) {
  try {
    const { pass, detail } = await fn();
    record(name, pass, detail);
  } catch (e) {
    record(name, false, String(e).split("\n")[0]);
  }
}

// Every word, decoration and caret invisible; the header and the film's captions off. Backgrounds stay.
const HIDE_TEXT =
  "*{color:transparent!important;text-shadow:none!important;text-decoration-color:transparent!important;caret-color:transparent!important}" +
  ".header,.film-captions{visibility:hidden!important}";
// The film's picture off: the moving film (or its poster) behind the sections; under reduced motion, the end
// still that .env carries. Only the picture: the page's other paint stays, so it is not counted as crystal.
const HIDE_FILM = ".film-video,.film-poster{visibility:hidden!important}";
const HIDE_STILL = ".env{background-image:none!important}";

async function withStyle(page, css, fn) {
  const tag = await page.addStyleTag({ content: css });
  await page.waitForTimeout(120);
  try {
    return await fn();
  } finally {
    await tag.evaluate((el) => el.remove());
  }
}

const jump = (page, y) => page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
/** Lets one scroll land: the reveal hooks run on the next frame. */
const frames = (page) => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 60)))));
/** Lets the smoothed playhead (about 150 ms) and its one seek in flight finish. */
async function settle(page) {
  await page.waitForTimeout(900);
  await page.waitForFunction(() => !document.querySelector(".film video")?.seeking, null, { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(150);
}

/** Where the stage ends (the film's last frame) and the page ends, in scroll px, and the film's time now. */
const geometry = (page) =>
  page.evaluate(() => {
    const film = document.querySelector(".film");
    const layer = document.querySelector(".film-layer");
    const v = document.querySelector(".film video");
    const stageEnd = film.getBoundingClientRect().bottom + scrollY - (layer.offsetHeight || innerHeight);
    return { stageEnd, max: document.documentElement.scrollHeight - innerHeight, y: scrollY, vh: innerHeight, W: innerWidth, t: v ? v.currentTime : NaN };
  });

/** Scroll px that puts the middle of `sel` at the middle of the screen (inside the page). */
const middleOf = (page, sel) =>
  page.evaluate((sel) => {
    const r = document.querySelector(sel).getBoundingClientRect();
    const max = document.documentElement.scrollHeight - innerHeight;
    return Math.min(max, Math.max(0, r.top + scrollY + r.height / 2 - innerHeight / 2));
  }, sel);

/** Decodes a screenshot in the page and returns its pixels as a flat RGBA array plus size. */
async function shotPixels(page, clip) {
  const buf = await page.screenshot({ clip });
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return { w: c.width, h: c.height, data: Array.from(ctx.getImageData(0, 0, c.width, c.height).data) };
  }, buf.toString("base64"));
}

const luma = (d, i) => 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const relLum = (r, g, b) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const rgbOf = (css) => (css.match(/[\d.]+/g) || []).slice(0, 3).map(Number);

/** Crystal pixels in the centre third: text hidden, compared with the same shot with the film's picture off. */
async function crystalPixels(page, W, H, hide = HIDE_FILM) {
  const clip = { x: Math.round(W / 3), y: Math.round(H / 3), width: Math.round(W / 3), height: Math.round(H / 3) };
  return withStyle(page, HIDE_TEXT, async () => {
    const shown = await shotPixels(page, clip);
    const bare = await withStyle(page, hide, () => shotPixels(page, clip));
    let n = 0;
    for (let i = 0; i < shown.data.length; i += 4) if (luma(shown.data, i) - luma(bare.data, i) >= LIFT) n++;
    return n;
  });
}

/**
 * Every line of text in `main` that is on screen below the header: the client rects of each text node (the line
 * boxes the glyphs sit in), with the text's colour. Dark text on a light fill (the amber button) is left out.
 */
const textBoxes = (page) =>
  page.evaluate(() => {
    const head = document.querySelector(".header").getBoundingClientRect().bottom;
    const out = [];
    const walker = document.createTreeWalker(document.querySelector("main"), NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent.trim()) continue;
      const el = n.parentElement;
      const s = getComputedStyle(el);
      if (s.visibility === "hidden") continue;
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) {
        if (r.width < 2 || r.height < 2 || r.top < head || r.bottom > innerHeight || r.left < 0 || r.right > innerWidth) continue;
        out.push({ text: n.textContent.trim().slice(0, 24), color: s.color, rect: { x: r.left, y: r.top, w: r.width, h: r.height } });
      }
    }
    return out;
  });

/** The worst contrast between any on-screen line of text and the lightest pixel behind it (text hidden). */
async function worstContrast(page, W, H) {
  const boxes = (await textBoxes(page)).filter((b) => relLum(...rgbOf(b.color)) >= 0.2);
  if (!boxes.length) return { ratio: Infinity, lines: 0, worst: "no text on screen" };
  const px = await withStyle(page, HIDE_TEXT, () => shotPixels(page, { x: 0, y: 0, width: W, height: H }));
  let worst = { ratio: Infinity };
  for (const b of boxes) {
    let max = 0;
    const x0 = Math.max(0, Math.floor(b.rect.x));
    const x1 = Math.min(px.w, Math.ceil(b.rect.x + b.rect.w));
    const y0 = Math.max(0, Math.floor(b.rect.y));
    const y1 = Math.min(px.h, Math.ceil(b.rect.y + b.rect.h));
    for (let y = y0; y < y1; y++)
      for (let x = x0; x < x1; x++) {
        const i = (y * px.w + x) * 4;
        const L = relLum(px.data[i], px.data[i + 1], px.data[i + 2]);
        if (L > max) max = L;
      }
    const ratio = contrast(relLum(...rgbOf(b.color)), max);
    if (ratio < worst.ratio) worst = { ratio, text: b.text, color: b.color, bg: max };
  }
  return { ratio: worst.ratio, lines: boxes.length, worst: `"${worst.text}" ${worst.color} on L ${worst.bg?.toFixed(4)}` };
}

/** Each .reveal block's lines: computed opacity, transform and filter, with the block's top. */
const revealStates = (page) =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll(".reveal")).map((b, i) => ({
      i,
      name: (b.id || b.className.replace("reveal", "").trim() || b.tagName.toLowerCase()) + ` #${i}`,
      docTop: b.getBoundingClientRect().top + scrollY,
      lines: Array.from(b.children).map((l) => {
        const s = getComputedStyle(l);
        return { opacity: Number(s.opacity), transform: s.transform, filter: s.filter };
      }),
    })),
  );

/** Faint at 95%, in at 50% (or the page end), faint again after scrolling back above it: every block. */
async function revealChecks(page, tag) {
  const blocks = await revealStates(page);
  await check(`${tag} the page has ScrollReveal blocks`, async () => ({ pass: blocks.length >= 6, detail: `${blocks.length} blocks` }));
  const { vh, max } = await geometry(page).catch(async () => page.evaluate(() => ({ vh: innerHeight, max: document.documentElement.scrollHeight - innerHeight })));
  const bad = [];
  let faintTested = 0;
  for (const b of blocks) {
    const at = async (frac) => {
      const y = Math.min(max, Math.max(0, b.docTop - frac * vh));
      await jump(page, y);
      await frames(page);
      return { y, placed: Math.abs(b.docTop - y - frac * vh) < 2, lines: (await revealStates(page))[b.i].lines };
    };
    const low = await at(0.95);
    if (low.placed) {
      faintTested++;
      const top = Math.max(...low.lines.map((l) => l.opacity));
      if (!(top < 0.2)) bad.push(`${b.name} at 95%: opacity ${top.toFixed(2)}`);
    }
    const mid = await at(0.5);
    const lowest = Math.min(...mid.lines.map((l) => l.opacity));
    const moved = mid.lines.filter((l) => l.transform !== "none" || l.filter !== "none").length;
    if (!(lowest >= 0.99) || moved) bad.push(`${b.name} at ${mid.placed ? "50%" : "page end"}: opacity ${lowest.toFixed(2)}, ${moved} line(s) still moved`);
    if (low.placed) {
      const back = await at(0.95);
      const top = Math.max(...back.lines.map((l) => l.opacity));
      if (!(top < 0.2)) bad.push(`${b.name} back at 95%: opacity ${top.toFixed(2)}`);
    }
  }
  record(
    `${tag} every reveal: faint at 95%, fully in at 50%, faint again after scrolling back`,
    blocks.length > 0 && bad.length === 0,
    `${blocks.length} blocks, ${faintTested} placeable at 95%; ${bad.join("; ") || "all as expected"}`,
  );
}

/** The header turns solid and shows its section links once the stage is gone, though the film layer stays. */
async function headerAfterStage(page, tag, W) {
  await check(`${tag} once the stage is gone the header is solid and its section links (or menu button) show`, async () => {
    const y = await page.evaluate(() => document.querySelector(".film").getBoundingClientRect().bottom + scrollY);
    await jump(page, y);
    await page.waitForTimeout(500);
    const h = await page.evaluate(() => {
      const el = document.querySelector(".header");
      const shown = Array.from(el.querySelectorAll(".nav-link, .nav-toggle")).filter((x) => {
        const s = getComputedStyle(x);
        return x.getBoundingClientRect().width > 0 && s.display !== "none" && s.visibility !== "hidden" && Number(s.opacity) > 0.9;
      });
      return { cls: el.className, shown: shown.length };
    });
    const want = W > 760 ? 4 : 1;
    return { pass: /\bsolid\b/.test(h.cls) && !/over-film/.test(h.cls) && h.shown >= want, detail: `class "${h.cls}", ${h.shown} link(s) or button shown` };
  });
}

async function motionRun(size) {
  const { tag, width: W, height: H, full } = size;
  await withPage(size, async (page, { errors }) => {
    await waitReady(page);
    // The video has to be live (not the poster) for the swing checks.
    await page.waitForFunction(() => document.querySelector(".film")?.classList.contains("is-live"), null, { timeout: 20000 }).catch(() => {});

    // ── 1. The hand-off: the end still, no jump ──────────────────────────
    const g0 = await geometry(page);
    await jump(page, g0.stageEnd);
    await settle(page);
    const endStill = await crystalPixels(page, W, H);
    await page.screenshot({ path: path.join(OUT, `${tag}-stage-end.png`) });
    await check(`${tag} the end still shows the crystal in the centre third (calibration)`, async () => ({ pass: endStill > 1000, detail: `${endStill} crystal pixels` }));

    const handoff = [];
    for (let k = -6; k <= 6; k++) {
      await jump(page, g0.stageEnd + k * 0.05 * g0.vh);
      await settle(page);
      handoff.push((await geometry(page)).t);
    }
    await check(`${tag} across the hand-off (0.3 screens either side, 0.05 apart) the film never jumps`, async () => {
      const steps = handoff.slice(1).map((t, i) => Math.abs(t - handoff[i]));
      const big = Math.max(...steps);
      return { pass: big <= 0.15 && handoff.every(Number.isFinite), detail: `largest step ${big.toFixed(3)} s; times ${handoff.map((t) => t.toFixed(2)).join(" ")}` };
    });
    await jump(page, g0.stageEnd + 0.1 * g0.vh);
    await settle(page);
    const past = await geometry(page);
    await check(`${tag} just past the stage the film is within ${HANDOFF_TOLERANCE} s of ${FILM_DURATION}`, async () => ({
      pass: Math.abs(past.t - FILM_DURATION) <= HANDOFF_TOLERANCE,
      detail: `currentTime ${past.t.toFixed(3)}`,
    }));
    await page.screenshot({ path: path.join(OUT, `${tag}-just-past-film.png`) });
    await headerAfterStage(page, tag, W);

    // ── 2. Each section: the swing, the crystal, contrast ───────────────
    await check(`${tag} timeline.ts exports crystalSwing and CRYSTAL_FROM`, async () => ({
      pass: typeof timeline.crystalSwing === "function" && timeline.CRYSTAL_FROM === 17.8,
      detail: `crystalSwing ${typeof timeline.crystalSwing}, CRYSTAL_FROM ${timeline.CRYSTAL_FROM}`,
    }));
    for (const sel of SECTIONS) {
      await jump(page, await middleOf(page, sel));
      await settle(page);
      const g = await geometry(page);
      const p = (g.y - g.stageEnd) / (g.max - g.stageEnd);
      const want = crystalSwing(p);
      await check(`${tag} ${sel} middle: film within ${SWING_TOLERANCE} s of crystalSwing(${p.toFixed(3)}) and inside the crystal's seconds`, async () => ({
        pass: Math.abs(g.t - want) <= SWING_TOLERANCE && g.t >= CRYSTAL_FROM - 0.05 && g.t <= FILM_DURATION + 0.01,
        detail: `currentTime ${g.t.toFixed(3)}, want ${want.toFixed(3)}`,
      }));
      const n = await crystalPixels(page, W, H);
      await check(`${tag} ${sel} middle: the crystal shows behind the section (text hidden)`, async () => ({
        pass: n >= CRYSTAL_SHARE * endStill,
        detail: `${n} crystal pixels in the centre third, ${((100 * n) / Math.max(1, endStill)).toFixed(0)}% of the end still's ${endStill}`,
      }));
      const c = await worstContrast(page, W, H);
      await check(`${tag} ${sel} middle: every line of text 4.5:1 against the lightest pixel behind it`, async () => ({
        pass: c.ratio >= CONTRAST_MIN,
        detail: `worst ${c.ratio.toFixed(2)} over ${c.lines} lines: ${c.worst}`,
      }));
      const side = await page.evaluate(() => ({ W: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth }));
      await check(`${tag} ${sel} middle: no sideways scroll`, async () => ({ pass: side.sw <= side.W, detail: `scrollWidth ${side.sw} / ${side.W}` }));
      await page.screenshot({ path: path.join(OUT, `${tag}-${sel.replace(/[#.]/g, "")}.png`) });
    }

    // ── 3. Reveals on the home page ──────────────────────────────────────
    await revealChecks(page, `${tag} home`);

    // ── 4. The experience line ───────────────────────────────────────────
    await check(`${tag} the experience line grows with the scroll and lights each dot as it reaches it`, async () => {
      const rows = [];
      let pass = true;
      let last = -1;
      for (const [label, edge, frac] of [
        ["top at 85%", "top", 0.85],
        ["top at 45%", "top", 0.45],
        ["top at 10%", "top", 0.1],
        ["bottom at 40%", "bottom", 0.4],
      ]) {
        const y = await page.evaluate(
          ({ edge, frac }) => {
            const r = document.querySelector(".timeline").getBoundingClientRect();
            return (edge === "top" ? r.top : r.bottom) + scrollY - frac * innerHeight;
          },
          { edge, frac },
        );
        await jump(page, y);
        await frames(page);
        const s = await page.evaluate(() => {
          const line = document.querySelector(".timeline-line");
          const m = getComputedStyle(line).transform;
          const scale = m === "none" ? 1 : Number(m.match(/matrix\(([^)]+)\)/)[1].split(",")[3]);
          const tip = line.getBoundingClientRect().bottom;
          const dots = Array.from(document.querySelectorAll(".timeline-dot")).map((d) => {
            const r = d.getBoundingClientRect();
            return { mid: r.top + r.height / 2, off: d.classList.contains("is-off") };
          });
          const wrong = dots.filter((d) => (d.mid < tip - 2 && d.off) || (d.mid > tip + 2 && !d.off)).length;
          return { scale, lit: dots.filter((d) => !d.off).length, wrong };
        });
        if (s.scale < last - 1e-6 || s.wrong) pass = false;
        last = s.scale;
        rows.push(`${label}: scale ${s.scale.toFixed(2)}, ${s.lit} lit, ${s.wrong} wrong`);
      }
      const first = Number(rows[0].match(/scale ([\d.]+)/)[1]);
      if (!(first <= 0.02 && last >= 0.98)) pass = false;
      return { pass, detail: rows.join("; ") };
    });

    // ── 6. Smoothness and layout shift (wide sizes) ──────────────────────
    if (full) {
      await check(`${tag} sweep through the sections: median requestAnimationFrame interval 20 ms or less`, async () => {
        const g = await geometry(page);
        await jump(page, g.stageEnd);
        await settle(page);
        await page.mouse.move(W / 2, H / 2);
        await page.evaluate(() => {
          window.__frames = [];
          window.__rec = true;
          let last = performance.now();
          const f = (t) => {
            window.__frames.push(t - last);
            last = t;
            if (window.__rec) requestAnimationFrame(f);
          };
          requestAnimationFrame(f);
        });
        for (let y = g.stageEnd; y < g.max; y += 120) {
          await page.mouse.wheel(0, 120);
          await page.waitForTimeout(16);
        }
        await page.waitForTimeout(500);
        const fr = await page.evaluate(() => {
          window.__rec = false;
          return window.__frames.slice(1);
        });
        const sorted = [...fr].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        const p95 = sorted[Math.floor(sorted.length * 0.95)];
        const y = await page.evaluate(() => scrollY);
        return { pass: median <= 20 && y >= g.max * 0.95, detail: `median ${median.toFixed(1)} ms, p95 ${p95.toFixed(1)} ms over ${fr.length} frames, swept to ${y.toFixed(0)} of ${g.max.toFixed(0)} px` };
      });
      await check(`${tag} cumulative layout shift under 0.1 (load, film and sweep)`, async () => {
        const cls = await page.evaluate(
          () =>
            new Promise((resolve) => {
              let sum = 0;
              new PerformanceObserver((list) => {
                for (const e of list.getEntries()) if (!e.hadRecentInput) sum += e.value;
              }).observe({ type: "layout-shift", buffered: true });
              setTimeout(() => resolve(sum), 300);
            }),
        );
        return { pass: cls < 0.1, detail: `CLS ${cls.toFixed(4)}` };
      });
    }
    await jump(page, 0);
    await page.waitForTimeout(300);
    record(`${tag} no console errors`, errors.length === 0, errors.length ? errors.slice(0, 5).join(" | ") : "0 errors");
  }).catch((e) => record(`${tag} page run`, false, String(e).split("\n")[0]));
}

/** A case page: its reveals, and the diagram drawing itself. */
async function caseRun(size) {
  const { tag, width: W } = size;
  await withPage({ ...size, query: `work/${CASES[0].slug}` }, async (page) => {
    for (const [i, c] of CASES.entries()) {
      if (i > 0) await page.goto(`${BASE}/work/${c.slug}`, { waitUntil: "load", timeout: 60000 });
      await page.waitForSelector("main figure svg .case-diagram-path", { timeout: 30000 });
      if (i === 0) await revealChecks(page, `${tag} /work/${c.slug}`);
      await check(`${tag} /work/${c.slug}: the diagram's main paths are undrawn before it enters and drawn past the middle`, async () => {
        const read = () =>
          page.evaluate(() =>
            Array.from(document.querySelectorAll("main figure .case-diagram-path")).map((p) => {
              const s = getComputedStyle(p);
              return { dash: s.strokeDasharray, offset: parseFloat(s.strokeDashoffset) || 0 };
            }),
          );
        const place = async (frac) => {
          const y = await page.evaluate((f) => {
            const r = document.querySelector("main figure").getBoundingClientRect();
            const max = document.documentElement.scrollHeight - innerHeight;
            return Math.min(max, Math.max(0, r.top + scrollY - f * innerHeight));
          }, frac);
          await jump(page, y);
          await frames(page);
        };
        await place(1.05);
        const before = await read();
        await place(0.45);
        const after = await read();
        const ok = before.length > 0 && before.every((p) => p.dash !== "none" && p.offset >= 0.9) && after.every((p) => p.offset <= 0.05);
        await page.screenshot({ path: path.join(OUT, `${tag}-case-${c.slug}-drawn.png`) });
        return { pass: ok, detail: `before: ${before.map((p) => `${p.dash}/${p.offset.toFixed(2)}`).join(", ")}; past the middle: ${after.map((p) => p.offset.toFixed(2)).join(", ")}` };
      });
      const side = await page.evaluate(() => ({ W: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth }));
      record(`${tag} /work/${c.slug}: no sideways scroll`, side.sw <= side.W, `scrollWidth ${side.sw} / ${side.W}`);
    }
    void W;
  }).catch((e) => record(`${tag} case run`, false, String(e).split("\n")[0]));
}

/** Every reveal line on the page right now: opacity 1, no transform, no filter. */
async function allStatic(page, tag, label) {
  const lines = (await revealStates(page)).flatMap((b) => b.lines.map((l) => ({ ...l, b: b.name })));
  const bad = lines.filter((l) => l.opacity !== 1 || l.transform !== "none" || l.filter !== "none");
  record(`${tag} ${label}: every reveal line at opacity 1, no transform, no filter`, lines.length > 0 && bad.length === 0, `${lines.length} lines; ${bad.slice(0, 4).map((l) => `${l.b} ${l.opacity} ${l.transform} ${l.filter}`).join("; ") || "all static"}`);
}

async function noScriptRun(size) {
  const tag = `${size.tag} JavaScript off`;
  await withPage({ ...size, javaScriptEnabled: false }, async (page) => {
    await allStatic(page, tag, "top of the page");
    await page.evaluate(() => window.scrollTo({ top: document.querySelector("#experience").getBoundingClientRect().top + scrollY - innerHeight * 0.95, behavior: "instant" }));
    await page.waitForTimeout(200);
    await allStatic(page, tag, "experience entering");
    const line = await page.evaluate(() => getComputedStyle(document.querySelector(".timeline-line")).transform);
    record(`${tag}: the experience line is whole`, line === "none", `transform ${line}`);
  }).catch((e) => record(`${tag} page run`, false, String(e).split("\n")[0]));
  await withPage({ ...size, javaScriptEnabled: false, query: `work/${CASES[0].slug}` }, async (page) => {
    await allStatic(page, tag, `/work/${CASES[0].slug}`);
    const paths = await page.evaluate(() => Array.from(document.querySelectorAll(".case-diagram-path")).map((p) => getComputedStyle(p).strokeDasharray));
    record(`${tag} /work/${CASES[0].slug}: the diagram is drawn`, paths.length > 0 && paths.every((d) => d === "none"), `dasharray ${paths.join(", ")}`);
  }).catch((e) => record(`${tag} case page run`, false, String(e).split("\n")[0]));
}

async function reducedRun(size) {
  const { width: W, height: H } = size;
  const tag = `${size.tag} reduced motion`;
  await withPage({ ...size, reducedMotion: true }, async (page, { requests }) => {
    await waitReady(page);
    await page.waitForTimeout(5000); // past the 4 s poster timer, after which the film would load
    const films = requests.filter((u) => /\/film\/.*\.mp4/.test(u));
    record(`${tag}: no film request`, films.length === 0, `${films.length} requests`);
    for (const sel of ["#intro", "#experience", "#about"]) {
      await jump(page, await middleOf(page, sel));
      await page.waitForTimeout(300);
      await allStatic(page, tag, `${sel} middle`);
      const n = await crystalPixels(page, W, H, HIDE_STILL);
      const env = await page.evaluate(() => getComputedStyle(document.querySelector(".env")).backgroundImage);
      record(`${tag} ${sel} middle: the end still shows behind the section`, /end-(desktop|phone)\.webp/.test(env) && n > 500, `${n} crystal pixels; .env ${env.slice(0, 80)}`);
      const c = await worstContrast(page, W, H);
      record(`${tag} ${sel} middle: every line of text 4.5:1`, c.ratio >= CONTRAST_MIN, `worst ${c.ratio.toFixed(2)} over ${c.lines} lines: ${c.worst}`);
      await page.screenshot({ path: path.join(OUT, `${size.tag}-reduced-${sel.slice(1)}.png`) });
    }
    // Lines placed where a reveal would hide them stay put.
    const blocks = await revealStates(page);
    const b = blocks.find((x) => x.docTop > H);
    if (b) {
      await jump(page, b.docTop - 0.95 * H);
      await page.waitForTimeout(300);
      await allStatic(page, tag, `${b.name} at 95%`);
    }
    const line = await page.evaluate(() => getComputedStyle(document.querySelector(".timeline-line")).transform);
    record(`${tag}: the experience line is whole`, line === "none", `transform ${line}`);
  }).catch((e) => record(`${tag} page run`, false, String(e).split("\n")[0]));
}

(async () => {
  console.log(`motion checks, screenshots in ${OUT}`);
  for (const size of SIZES) await motionRun(size);
  for (const size of SIZES.filter((s) => s.full)) await caseRun(size);
  for (const size of SIZES.filter((s) => s.full)) await noScriptRun(size);
  for (const size of [SIZES[0], SIZES[2]]) await reducedRun(size);
  const failed = results.filter((r) => !r.pass).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed. Screenshots: ${OUT}`);
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
