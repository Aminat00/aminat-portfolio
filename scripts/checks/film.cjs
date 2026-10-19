// The film stage on desktop. Layout checks run at five window sizes: words beside the stone
// at 1440x900, words stacked under it on the squarer and narrower ones (788x734 is the owner's
// browser pane). Playback checks run at 1440x900, the scroll sweep also at 788x734. Every check
// prints PASS or FAIL with its measured value; the process exits 1 if any check fails.
// Screenshots go to $CHECK_OUT (default: the OS temp dir).
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { withPage, waitReady, stageY, scrollToScreens, captionStates } = require("./lib.cjs");
const { FILM_SEGMENTS, FILM_DURATION, totalScreens, filmTimeAt } = require("../../src/lib/film/timeline.ts");

// [width, height, the layout the CSS should pick there]
const SIZES = [
  [1440, 900, "side"],
  [1280, 1024, "stacked"],
  [1024, 768, "stacked"],
  [800, 900, "stacked"],
  [788, 734, "stacked"],
];
const STONE_MIN = 0.45; // the lit stone or crystal is at least this share of the viewport height
const CRYSTAL_MIN_STACKED = 0.42; // stacked delivery crystal: 42% (Ruling 12, crystal is naturally smaller than the stone)
const LIT = 24; // luma above this is the stone or crystal; the film's background peaks near 14
const OUT = process.env.CHECK_OUT || path.join(os.tmpdir(), "film-checks");
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

// Each caption hold, in screens: where the caption is half in, the middle, where it is half out.
const HOLDS = [];
{
  let start = 0;
  for (const s of FILM_SEGMENTS) {
    if (s.caption) HOLDS.push({ id: s.caption, mid: start + s.screens / 2, points: [start + 0.25, start + s.screens / 2, start + s.screens - 0.25] });
    start += s.screens;
  }
}

// Captions and header hidden: only the film is left.
const HIDE_ALL = ".film-caption,.header{visibility:hidden!important}";
// The same, without the edge-colour overlays that melt the stacked film's edges (::after always, ::before in the break).
const HIDE_OVERLAY = HIDE_ALL + ".film-layer::before,.film-layer::after{display:none!important}";
// Text hidden, the caption's own scrim (its ::before) still painted.
const HIDE_TEXT = ".film-caption>*{visibility:hidden!important}";

async function withStyle(page, css, fn) {
  const tag = await page.addStyleTag({ content: css });
  await page.waitForTimeout(100);
  try {
    return await fn();
  } finally {
    await tag.evaluate((el) => el.remove());
  }
}

const boxOf = (rect, W, H) => {
  const x = Math.max(0, Math.floor(rect.left));
  const y = Math.max(0, Math.floor(rect.top));
  return { x, y, width: Math.min(W, Math.ceil(rect.right)) - x, height: Math.min(H, Math.ceil(rect.bottom)) - y };
};

/**
 * Screenshot `clip`, decode it in the page, and measure it. With `box` (in clip coordinates):
 * lit pixels inside it, and the leftmost lit pixel anywhere in its rows.
 */
async function measure(page, clip, file, box) {
  const buf = await page.screenshot({ clip, path: file ? path.join(OUT, file) : undefined });
  return page.evaluate(
    async ({ b64, box, LIT }) => {
      const img = new Image();
      img.src = "data:image/png;base64," + b64;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      let maxL = 0;
      let bx = 0;
      let bn = 0;
      const third = Math.floor(c.width / 3);
      let left = 0;
      let right = 0;
      let ln = 0;
      let rn = 0;
      let litIn = 0;
      let litLeft = Infinity;
      let litAbove = -Infinity;
      let litTop = Infinity;
      let litBottom = -Infinity;
      for (let y = 0; y < c.height; y++) {
        const inRows = box && y >= box.y && y < box.y + box.height;
        const aboveBox = box && y < box.y;
        for (let x = 0; x < c.width; x++) {
          const i = (y * c.width + x) * 4;
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          const L = 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
          if (L > maxL) maxL = L;
          if (luma > 40) {
            bx += x;
            bn++;
          }
          if (luma > LIT) {
            if (y < litTop) litTop = y;
            litBottom = y;
            if (aboveBox && x >= box.x && x < box.x + box.width) litAbove = y;
          }
          if (inRows && luma > LIT) {
            if (x < litLeft) litLeft = x;
            if (x >= box.x && x < box.x + box.width) litIn++;
          }
          if (x < third) {
            left += luma;
            ln++;
          } else if (x >= c.width - third) {
            right += luma;
            rn++;
          }
        }
      }
      return { maxL, centroid: bn ? bx / bn / c.width : NaN, bright: bn, left: left / ln, right: right / rn, litIn, litLeft, litAbove, litTop, litBottom };
    },
    { b64: buf.toString("base64"), box, LIT },
  );
}

/** Lit stone pixels (luma > LIT without the overlay) that the overlay makes darker by more than 2 levels. */
async function overlayDarkening(page, clip) {
  const withOverlay = await withStyle(page, HIDE_ALL, () => page.screenshot({ clip }));
  const without = await withStyle(page, HIDE_OVERLAY, () => page.screenshot({ clip }));
  return page.evaluate(
    async ({ a, b, LIT }) => {
      const pixels = async (b64) => {
        const img = new Image();
        img.src = "data:image/png;base64," + b64;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, c.width, c.height).data;
      };
      const [d1, d0] = [await pixels(a), await pixels(b)];
      const luma = (d, i) => 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      let lit = 0;
      let darker = 0;
      let worst = 0;
      for (let i = 0; i < d0.length; i += 4) {
        const l0 = luma(d0, i);
        if (l0 <= LIT) continue;
        lit++;
        const drop = l0 - luma(d1, i);
        if (drop > 2) darker++;
        if (drop > worst) worst = drop;
      }
      return { lit, darker, worst };
    },
    { a: withOverlay.toString("base64"), b: without.toString("base64"), LIT },
  );
}

const TEXT_L = (() => {
  const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = [0xea, 0xf3, 0xfb].map((v) => lin(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
})();
const contrast = (L) => (TEXT_L + 0.05) / (L + 0.05);

const filmState = (page) =>
  page.evaluate(() => {
    const v = document.querySelector(".film video");
    return v ? { t: v.currentTime, seeking: v.seeking, ready: v.readyState } : null;
  });

/** Caption placement, readability, stone size and balance at one window size. */
async function layoutChecks(page, W, H, mode) {
  const tag = `${W}x${H}`;

  // ── Captions: one at a time, never in the centre band ────────────────
  let samples = [];
  await check(`${tag} sampling every 0.05 screens: at most one caption above 0.01`, async () => {
    const ys = [];
    for (let s = 0; s <= totalScreens() + 1e-9; s += 0.05) ys.push({ s, y: await stageY(page, s) });
    samples = await page.evaluate(async (ys) => {
      const frames = (n) => new Promise((r) => { const f = () => (--n ? requestAnimationFrame(f) : r()); requestAnimationFrame(f); });
      const out = [];
      for (const { s, y } of ys) {
        window.scrollTo({ top: y, behavior: "instant" });
        await frames(10);
        const caps = Array.from(document.querySelectorAll(".film-caption")).map((el) => ({
          id: el.dataset.caption,
          opacity: Number(getComputedStyle(el).opacity),
          rect: el.getBoundingClientRect().toJSON(),
        }));
        out.push({ s, caps });
      }
      return out;
    }, ys);
    if (samples.length === 0 || samples[0].caps.length !== 4) return { pass: false, detail: `found ${samples[0] ? samples[0].caps.length : 0} captions, want 4` };
    const bad = samples.filter((x) => x.caps.filter((c) => c.opacity > 0.01).length > 1);
    const seen = new Set(samples.flatMap((x) => x.caps.filter((c) => c.opacity > 0.99).map((c) => c.id)));
    return {
      pass: bad.length === 0 && seen.size === 4,
      detail: `${samples.length} samples, ${bad.length} with two captions, captions seen at full strength: ${[...seen].join(",")}`,
    };
  });

  // Words beside the stone: never in the centre band. (Stacked: checked after the holds, below.)
  if (mode === "side") await check(`${tag} a showing caption never overlaps 35% to 65% of the width`, async () => {
    const lo = 0.35 * W;
    const hi = 0.65 * W;
    let shown = 0;
    let worst = -Infinity;
    const bad = [];
    for (const x of samples)
      for (const c of x.caps) {
        if (c.opacity <= 0.01) continue;
        shown++;
        worst = Math.max(worst, c.rect.right);
        if (c.rect.right > lo && c.rect.left < hi) bad.push(`${c.id}@${x.s.toFixed(2)}`);
      }
    return { pass: shown > 0 && bad.length === 0, detail: `${bad.length} overlaps in ${shown} showing samples, rightmost edge ${worst.toFixed(0)} px vs band start ${lo.toFixed(0)} px` };
  });

  // ── Each hold: words beside the stone, readable; subject centred, no wash ──
  const full = { x: 0, y: 0, width: W, height: H };
  let stoneBottom = -Infinity; // lowest lit row over every hold point
  const headerBottom = await page.evaluate(() => document.querySelector(".header").getBoundingClientRect().bottom);
  for (const hold of HOLDS) {
    const stone = [];
    const contrasts = [];
    const overlay = [];
    let stonePass = true;
    let contrastPass = true;
    let overlayPass = true;
    for (const s of hold.points) {
      await scrollToScreens(page, s);
      const cap = (await captionStates(page)).find((c) => c.id === hold.id);
      if (!cap || cap.opacity < 0.3) {
        stonePass = contrastPass = false;
        stone.push(`${s.toFixed(2)}: caption opacity ${cap ? cap.opacity.toFixed(2) : "missing"}`);
        continue;
      }
      const box = boxOf(cap.rect, W, H);
      const isMid = s === hold.mid;
      const bare = await withStyle(page, HIDE_ALL, () => measure(page, full, isMid ? `${tag}-hold-${hold.id}-bare.png` : undefined, box));
      if (bare.litIn > 0) stonePass = false;
      stoneBottom = Math.max(stoneBottom, bare.litBottom);
      const gap =
        mode === "side"
          ? bare.litLeft === Infinity ? "none lit in its rows" : `${(bare.litLeft - (box.x + box.width)).toFixed(0)} px to the right`
          : bare.litAbove === -Infinity ? "none lit above it" : `${(box.y - bare.litAbove - 1).toFixed(0)} px above`;
      stone.push(`${s.toFixed(2)}: ${bare.litIn} lit px in box, gap ${gap}`);
      const dark = await overlayDarkening(page, full);
      if (dark.darker > 0) overlayPass = false;
      overlay.push(`${s.toFixed(2)}: ${dark.darker} of ${dark.lit} lit px darker, worst drop ${dark.worst.toFixed(1)}`);
      const under = await withStyle(page, HIDE_TEXT, () => measure(page, box, isMid ? `${tag}-hold-${hold.id}-box.png` : undefined));
      const cr = contrast(under.maxL);
      if (cr < 4.5) contrastPass = false;
      contrasts.push(`${s.toFixed(2)}: ${cr.toFixed(2)}:1`);
      if (isMid) {
        await measure(page, full, `${tag}-hold-${hold.id}.png`);
        const stoneMin = mode === "stacked" && hold.id === "delivery" ? CRYSTAL_MIN_STACKED : STONE_MIN;
        record(
          `${tag} ${hold.id} hold: lit stone at least ${Math.round(stoneMin * 100)}% of the viewport height`,
          bare.litBottom - bare.litTop + 1 >= stoneMin * H,
          `${bare.litBottom - bare.litTop + 1} px of ${H} (${(((bare.litBottom - bare.litTop + 1) / H) * 100).toFixed(1)}%), rows ${bare.litTop} to ${bare.litBottom}, header ends at ${headerBottom.toFixed(0)}`,
        );
        await check(`${tag} ${hold.id} hold: bright centroid between 40% and 60%`, async () => ({
          pass: bare.centroid >= 0.4 && bare.centroid <= 0.6,
          detail: `centroid ${(bare.centroid * 100).toFixed(1)}% of width, ${bare.bright} bright px`,
        }));
        await check(`${tag} ${hold.id} hold: left and right thirds within 1.5x brightness`, async () => {
          const m = await withStyle(page, HIDE_TEXT, () => measure(page, full, `${tag}-hold-${hold.id}-scrim.png`));
          const ratio = Math.max(m.left, m.right) / Math.min(m.left, m.right);
          return { pass: ratio <= 1.5, detail: `left ${m.left.toFixed(2)}, right ${m.right.toFixed(2)}, ratio ${ratio.toFixed(3)}` };
        });
      }
    }
    record(`${tag} ${hold.id} hold: caption box never on the lit stone (3 points)`, stonePass, stone.join("; "));
    record(`${tag} ${hold.id} hold: contrast under the text box at least 4.5:1 (3 points)`, contrastPass, contrasts.join("; "));
    record(`${tag} ${hold.id} hold: the edge overlay darkens no lit stone pixel (3 points)`, overlayPass, overlay.join("; "));
  }

  // Words stacked under the stone: a showing caption never rises above the stone's lowest lit row.
  if (mode === "stacked")
    record(`${tag} a showing caption always starts below the lit stone`, ...(() => {
      let shown = 0;
      let minGap = Infinity;
      const bad = [];
      for (const x of samples)
        for (const c of x.caps) {
          if (c.opacity <= 0.01) continue;
          shown++;
          minGap = Math.min(minGap, c.rect.top - stoneBottom - 1);
          if (c.rect.top <= stoneBottom) bad.push(`${c.id}@${x.s.toFixed(2)}`);
        }
      return [shown > 0 && bad.length === 0, `${bad.length} above in ${shown} showing samples, lowest lit row ${stoneBottom}, smallest gap ${minGap.toFixed(0)} px`];
    })());
}

/** Smoothness: a wheel sweep through the whole stage. */
function sweepCheck(page, W, H) {
  return check(`${W}x${H} scroll sweep: median requestAnimationFrame interval 20 ms or less`, async () => {
    await scrollToScreens(page, 0);
    await page.mouse.move(W / 2, H / 2);
    const end = await stageY(page, totalScreens());
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
    for (let y = 0; y < end; y += 120) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(16);
    }
    await page.waitForTimeout(500);
    const frames = await page.evaluate(() => {
      window.__rec = false;
      return window.__frames.slice(1);
    });
    const sorted = [...frames].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const y = await page.evaluate(() => scrollY);
    return { pass: median <= 20 && y >= end * 0.95, detail: `median ${median.toFixed(1)} ms, p95 ${p95.toFixed(1)} ms over ${frames.length} frames, swept to ${y.toFixed(0)} of ${end.toFixed(0)} px` };
  });
}

/** Playback: both directions, a jump to the end, and a reload mid-film. */
async function playbackChecks(page) {

  await check("forward to 3 positions then back: currentTime within 0.1 s", async () => {
    const rows = [];
    let pass = true;
    for (const s of [2.0, 4.7, 8.2, 4.7, 2.0]) {
      await scrollToScreens(page, s);
      const f = await filmState(page);
      const want = filmTimeAt(s);
      const diff = f ? Math.abs(f.t - want) : Infinity;
      if (!(diff <= 0.1) || !f || f.seeking) pass = false;
      rows.push(`${s}->${f ? f.t.toFixed(3) : "none"} (want ${want.toFixed(3)})`);
    }
    return { pass, detail: rows.join(", ") };
  });

  // Review Focus 1: a jump lands at once.
  await check("End from the top: past the stage and currentTime within 0.2 s of 20.04 inside 1 s", async () => {
    await scrollToScreens(page, 0);
    const t0 = Date.now();
    await page.keyboard.press("End");
    let elapsed = Infinity;
    let last = null;
    while (Date.now() - t0 < 3000) {
      last = await page.evaluate(() => {
        const v = document.querySelector(".film video");
        return {
          past: document.querySelector(".film").getBoundingClientRect().bottom <= 0,
          t: v ? v.currentTime : NaN,
          seeking: v ? v.seeking : true,
        };
      });
      if (last.past && Math.abs(last.t - FILM_DURATION) <= 0.2 && !last.seeking) {
        elapsed = Date.now() - t0;
        break;
      }
      await page.waitForTimeout(25);
    }
    // Let the browser's own smooth scroll finish, so the next check starts from rest.
    await page.waitForTimeout(1500);
    return { pass: elapsed <= 1000, detail: `${elapsed === Infinity ? "not reached in 3 s" : `${elapsed} ms`}, last ${JSON.stringify(last)}` };
  });

  // Review Focus 4: reload mid-film.
  await check("reload at 6 screens: currentTime within 0.15 s of filmTimeAt(6) at ready", async () => {
    await scrollToScreens(page, 6);
    const before = await page.evaluate(() => scrollY);
    await page.reload({ waitUntil: "load", timeout: 60000 });
    await waitReady(page);
    const f = await filmState(page);
    const want = filmTimeAt(6);
    const diff = f ? Math.abs(f.t - want) : Infinity;
    const y = await page.evaluate(() => scrollY);
    return { pass: diff <= 0.15, detail: `currentTime ${f ? f.t.toFixed(3) : "none"}, want ${want.toFixed(3)}, delta ${diff.toFixed(3)} s, scrollY ${before} before reload, ${y} after` };
  });
}

(async () => {
  console.log(`film checks, screenshots in ${OUT}`);
  for (const [W, H, mode] of SIZES) {
    const tag = `${W}x${H}`;
    await withPage({ width: W, height: H }, async (page, { errors }) => {
      await check(`${tag} ready within 20 s`, async () => {
        const t0 = Date.now();
        await waitReady(page);
        return { pass: true, detail: `${Date.now() - t0} ms after load` };
      });
      await page.mouse.move(W / 2, H / 2);
      await layoutChecks(page, W, H, mode);
      if (W === 1440 || W === 788) await sweepCheck(page, W, H);
      if (W === 1440) await playbackChecks(page);
      record(`${tag} no console errors`, errors.length === 0, errors.length ? errors.slice(0, 5).join(" | ") : "0 errors");
    }).catch((e) => record(`${tag} page run`, false, String(e).split("\n")[0]));
  }

  const failed = results.filter((r) => !r.pass).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exit(failed ? 1 : 0);
})();
