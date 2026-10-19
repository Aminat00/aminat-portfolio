// The hand-off from the film to the sections, and the header over the film.
//  1. No seam. Since Task 11 the film does not end at the stage's bottom edge: the film layer stays fixed and the
//     sections rise over the crystal, dimming it (main's background fades from clear to the dim). With the stage's
//     edge at the middle of the screen and all text hidden: no pixel row in the 120px around the edge steps by more
//     than 3 levels from the row above, over the real crystal and again over a flat bright field in place of the
//     film (the dim's own fade, whatever the frame shows); and with the film's picture off, a 40px band above the
//     edge and one below it have the same mean colour (3 levels per channel), so the dim is the film's own edge
//     colour and no tinted band starts where the sections do.
//  2. The header paints no bar over the film (no background, no border, no blur), nothing in it paints a
//     box (no fill, no blur: the "Email" button is text and a hairline outline), and it does not darken
//     the film under it: at the middle of each caption hold, at five points in the break (film seconds 12.5
//     to 17) and at two points while the sections rise over it, the top 90px is shot with the header shown and
//     with it hidden, and at most 150 pixels outside the words' glyph boxes (each text node's line boxes,
//     plus 3px) may lose more than 25% of their luminance. This catches any box, pool, pill or wash the
//     header might paint on the stone.
//  3. At the middle of each hold the header words are readable (4.5:1 against the lightest pixel behind each).
//  4. A screen after the film has gone, the page has no sideways scroll.
// Runs at 1440x900 (words beside the stone), 788x734 (stacked) and 390x844 (phone).
// Every check prints PASS or FAIL with its measured value; the process exits 1 if any check fails.
// Screenshots go to $CHECK_OUT (default: the OS temp dir).
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { withPage, waitReady, scrollToScreens } = require("./lib.cjs");
const { FILM_SEGMENTS } = require("../../src/lib/film/timeline.ts");

const SIZES = [
  { tag: "1440x900", width: 1440, height: 900 },
  { tag: "788x734", width: 788, height: 734 },
  { tag: "390x844", width: 390, height: 844, mobile: true },
];
const BAND = 40; // px of the band compared on each side of the edge
const AROUND = 60; // px above and below the edge whose rows are checked for steps
const LEVELS = 3; // largest allowed mean difference or row step, per channel (0-255)
const CONTRAST_MIN = 4.5;
const HEADER_SHOT = 90; // px from the top of the screen compared with and without the header
const MARGIN = 3; // px around each word's box that are left out of the comparison
const DROP = 0.25; // a pixel that loses more than this share of its luminance counts as darkened
const DARKENED_MAX = 150; // darkened pixels allowed per screenshot
const BREAK_TIMES = [12.5, 13.75, 15, 16, 17]; // film seconds in the break
const AWAY = [0.75, 0.45]; // where the stage's bottom edge sits (share of the screen height) while the sections rise
const OUT = process.env.CHECK_OUT || path.join(os.tmpdir(), "handoff-checks");
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

// The middle of each caption hold, in screens into the stage.
const HOLDS = [];
{
  let start = 0;
  for (const s of FILM_SEGMENTS) {
    if (s.caption) HOLDS.push({ id: s.caption, mid: start + s.screens / 2 });
    start += s.screens;
  }
}

// Screens into the stage at which the film shows second `t` (the inverse of filmTimeAt).
const screensAt = (t) => {
  let start = 0;
  for (const s of FILM_SEGMENTS) {
    if (t <= s.to) return start + (s.screens * (t - s.from)) / (s.to - s.from);
    start += s.screens;
  }
  return start;
};

// All text invisible and the film's captions and header off, backgrounds left as they are.
const HIDE_TEXT = "*{color:transparent!important;text-shadow:none!important}.header,.film-captions{visibility:hidden!important}";
// The film's picture off: what is left behind the edge is the layer's and the sections' own paint.
const HIDE_PICTURE = ".film-video,.film-poster{visibility:hidden!important}";
// A flat bright field in place of the film (its edge fades off too), so the dim's fade shows on its own.
const FLAT_FIELD = HIDE_PICTURE + ".film-layer{background:#808080!important}.film-layer::before,.film-layer::after{display:none!important}";
// The header's own words invisible; its background, border, blur and the film under it stay.
const HIDE_HEADER_WORDS = ".header *{color:transparent!important}";

async function withStyle(page, css, fn) {
  const tag = await page.addStyleTag({ content: css });
  await page.waitForTimeout(100);
  try {
    return await fn();
  } finally {
    await tag.evaluate((el) => el.remove());
  }
}

/**
 * Screenshot `clip` and decode it in the page.
 * mode "rows": the mean [r, g, b] of every pixel row. mode "light": the highest WCAG relative luminance of any pixel.
 */
async function analyse(page, clip, mode, file) {
  const buf = await page.screenshot({ clip, path: file ? path.join(OUT, file) : undefined });
  return page.evaluate(
    async ({ b64, mode }) => {
      const img = new Image();
      img.src = "data:image/png;base64," + b64;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      if (mode === "rows") {
        const rows = [];
        for (let y = 0; y < c.height; y++) {
          let r = 0;
          let g = 0;
          let b = 0;
          for (let x = 0; x < c.width; x++) {
            const i = (y * c.width + x) * 4;
            r += d[i];
            g += d[i + 1];
            b += d[i + 2];
          }
          rows.push([r / c.width, g / c.width, b / c.width]);
        }
        return rows;
      }
      const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      let max = 0;
      for (let i = 0; i < d.length; i += 4) {
        const L = 0.2126 * lin(d[i] / 255) + 0.7152 * lin(d[i + 1] / 255) + 0.0722 * lin(d[i + 2] / 255);
        if (L > max) max = L;
      }
      return max;
    },
    { b64: buf.toString("base64"), mode },
  );
}

const luminance = ([r, g, b]) => {
  const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
};
const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const rgbOf = (css) => (css.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
const alphaOf = (css) => (css === "transparent" ? 0 : css.startsWith("rgba") || css.startsWith("color(") ? Number((css.match(/[\d.]+/g) || [])[3] ?? 1) : 1);

/** Every visible element in the nav bar that carries its own words: its text colour and box. */
const headerWords = (page) =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll(".header .nav *"))
      .filter((el) => Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim()))
      .map((el) => ({ text: el.textContent.trim(), color: getComputedStyle(el).color, visibility: getComputedStyle(el).visibility, rect: el.getBoundingClientRect().toJSON() }))
      .filter((w) => w.rect.width > 0 && w.rect.height > 0 && w.visibility !== "hidden"),
  );

/** The boxes the header's words are drawn in: the client rects of every visible text node, one per line. */
const headerGlyphBoxes = (page) =>
  page.evaluate(() => {
    const boxes = [];
    const walker = document.createTreeWalker(document.querySelector(".header .nav"), NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent.trim() || getComputedStyle(n.parentElement).visibility === "hidden") continue;
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) if (r.width > 0 && r.height > 0) boxes.push(r.toJSON());
    }
    return boxes;
  });

/** The header paints no bar: no background colour or image, no border, no blur. Nothing inside it paints a box either. */
async function headerPaint(page, name) {
  const paint = await page.evaluate(() => {
    const s = getComputedStyle(document.querySelector(".header"));
    return { bg: s.backgroundColor, image: s.backgroundImage, borderW: s.borderBottomWidth, borderC: s.borderBottomColor, blur: s.backdropFilter || s.webkitBackdropFilter || "none" };
  });
  await check(`${name}: header paints no bar (no background, no border, no blur)`, async () => {
    const bgOk = alphaOf(paint.bg) === 0 && paint.image === "none";
    const borderOk = parseFloat(paint.borderW) === 0 || alphaOf(paint.borderC) === 0;
    return { pass: bgOk && borderOk && paint.blur === "none", detail: `background ${paint.bg} / ${paint.image}, border-bottom ${paint.borderW} ${paint.borderC}, backdrop-filter ${paint.blur}` };
  });
  const inside = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".header *"))
      // Painted somewhere: a box with area left after every clipping ancestor (the closed phone menu clips to 0px).
      .filter((el) => {
        let { left, top, right, bottom } = el.getBoundingClientRect();
        for (let p = el.parentElement; p && right > left && bottom > top; p = p.parentElement) {
          if (getComputedStyle(p).overflow === "visible") continue;
          const c = p.getBoundingClientRect();
          [left, top, right, bottom] = [Math.max(left, c.left), Math.max(top, c.top), Math.min(right, c.right), Math.min(bottom, c.bottom)];
        }
        return right > left && bottom > top;
      })
      .map((el) => {
        const s = getComputedStyle(el);
        return { el: `${el.tagName.toLowerCase()}.${String(el.className.baseVal ?? el.className).split(" ")[0]}`, bg: s.backgroundColor, image: s.backgroundImage, blur: s.backdropFilter || s.webkitBackdropFilter || "none" };
      }),
  );
  const boxes = inside.filter((b) => alphaOf(b.bg) > 0 || b.image !== "none" || b.blur !== "none");
  await check(`${name}: nothing in the header paints a box (no fill, no blur)`, async () => ({
    pass: boxes.length === 0,
    detail: boxes.length ? boxes.map((b) => `${b.el}: ${b.bg} / ${b.image} / ${b.blur}`).join("; ") : `${inside.length} elements, none filled or blurred`,
  }));
}

/**
 * The header does not darken the film: shoot the top 90px with the header shown and with it hidden, and count the
 * pixels outside the words' glyph boxes (plus 3px) that lose more than 25% of their luminance.
 */
async function headerDarkening(page, name, W) {
  const glyphs = await headerGlyphBoxes(page);
  const boxes = glyphs.map((g) => ({ l: g.left - MARGIN, t: g.top - MARGIN, r: g.right + MARGIN, b: g.bottom + MARGIN }));
  const clip = { x: 0, y: 0, width: W, height: HEADER_SHOT };
  const shown = (await page.screenshot({ clip, path: path.join(OUT, `${name.replace(/\s+/g, "-")}-header.png`) })).toString("base64");
  const hidden = (await withStyle(page, ".header{visibility:hidden!important}", () => page.screenshot({ clip }))).toString("base64");
  const count = await page.evaluate(
    async ({ shown, hidden, boxes, DROP }) => {
      const read = async (b64) => {
        const img = new Image();
        img.src = "data:image/png;base64," + b64;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, c.width, c.height);
      };
      const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      const lum = (d, i) => 0.2126 * lin(d[i] / 255) + 0.7152 * lin(d[i + 1] / 255) + 0.0722 * lin(d[i + 2] / 255);
      const a = await read(shown);
      const b = await read(hidden);
      let n = 0;
      for (let y = 0; y < a.height; y++) {
        for (let x = 0; x < a.width; x++) {
          if (boxes.some((q) => x + 0.5 >= q.l && x + 0.5 <= q.r && y + 0.5 >= q.t && y + 0.5 <= q.b)) continue;
          const i = (y * a.width + x) * 4;
          const before = lum(b.data, i);
          if (before > 0 && lum(a.data, i) < before * (1 - DROP)) n++;
        }
      }
      return n;
    },
    { shown, hidden, boxes, DROP },
  );
  await check(`${name}: header darkens at most ${DARKENED_MAX} film pixels by more than ${DROP * 100}% (outside its glyph boxes)`, async () => ({ pass: count <= DARKENED_MAX, detail: `${count} pixels` }));
}

/** At a hold's middle: the header words are readable against the lightest pixel behind each. */
async function headerContrast(page, name, W, H) {
  const words = await headerWords(page);
  await check(`${name}: header words readable (4.5:1 against the lightest pixel behind each)`, async () => {
    if (!words.length) return { pass: false, detail: "no header words found" };
    const lines = [];
    let worst = Infinity;
    await withStyle(page, HIDE_HEADER_WORDS, async () => {
      for (const w of words) {
        const x = Math.max(0, Math.floor(w.rect.left));
        const y = Math.max(0, Math.floor(w.rect.top));
        const clip = { x, y, width: Math.min(W, Math.ceil(w.rect.right)) - x, height: Math.min(H, Math.ceil(w.rect.bottom)) - y };
        const ratio = contrast(luminance(rgbOf(w.color)), await analyse(page, clip, "light"));
        worst = Math.min(worst, ratio);
        lines.push(`"${w.text.slice(0, 12)}" ${ratio.toFixed(1)}`);
      }
    });
    return { pass: worst >= CONTRAST_MIN, detail: lines.join(", ") };
  });
}

/** Jumps so the film's bottom edge sits `frac` of the way down the screen, then waits 1.5 s to settle. */
async function scrollToEdge(page, frac) {
  const y = await page.evaluate((f) => document.querySelector(".film").getBoundingClientRect().bottom + scrollY - innerHeight * f, frac);
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.waitForTimeout(1500);
}

/** The largest change in mean colour between neighbouring pixel rows, and where it is (px from the edge). */
const largestStep = (rows) => {
  let worst = { step: 0, at: 0 };
  for (let i = 1; i < rows.length; i++) {
    const step = Math.max(...rows[i].map((v, c) => Math.abs(v - rows[i - 1][c])));
    if (step > worst.step) worst = { step, at: i - AROUND };
  }
  return worst;
};

/** The stage's bottom edge at mid screen, text hidden: look for a step, and compare the bands with the picture off. */
async function seamChecks(page, tag, W) {
  const y = await page.evaluate(() => document.querySelector(".film").getBoundingClientRect().bottom + scrollY - innerHeight / 2);
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.waitForTimeout(1500);
  const edge = await page.evaluate(() => Math.round(document.querySelector(".film").getBoundingClientRect().bottom));
  await page.screenshot({ path: path.join(OUT, `${tag}-seam.png`) });
  const clip = { x: 0, y: edge - AROUND, width: W, height: 2 * AROUND };
  const rows = await withStyle(page, HIDE_TEXT, async () => {
    await page.screenshot({ path: path.join(OUT, `${tag}-seam-bare.png`) });
    return analyse(page, clip, "rows", `${tag}-seam-band.png`);
  });
  const flat = await withStyle(page, HIDE_TEXT + FLAT_FIELD, () => analyse(page, clip, "rows", `${tag}-seam-flat.png`));
  const plain = await withStyle(page, HIDE_TEXT + HIDE_PICTURE, () => analyse(page, clip, "rows", `${tag}-seam-plain.png`));
  const mean = (from, to) => [0, 1, 2].map((c) => plain.slice(from, to).reduce((s, r) => s + r[c], 0) / (to - from));
  const above = mean(AROUND - BAND, AROUND);
  const below = mean(AROUND, AROUND + BAND);
  const f = (v) => v.map((n) => n.toFixed(1)).join(",");
  await check(`${tag} seam: with the film's picture off, the 40px bands above and below the stage's edge are the same colour`, async () => {
    const diff = above.map((v, c) => Math.abs(v - below[c]));
    return { pass: Math.max(...diff) <= LEVELS, detail: `above rgb(${f(above)}), below rgb(${f(below)}), largest channel difference ${Math.max(...diff).toFixed(1)}` };
  });
  await check(`${tag} seam: over the crystal, no pixel row steps by more than ${LEVELS} levels in the ${2 * AROUND}px around the edge`, async () => {
    const worst = largestStep(rows);
    return { pass: worst.step <= LEVELS, detail: `largest step ${worst.step.toFixed(1)} levels, ${worst.at}px from the edge` };
  });
  await check(`${tag} seam: over a flat bright field, the dim fades in with no row step over ${LEVELS} levels`, async () => {
    const worst = largestStep(flat);
    const span = Math.max(...flat[0].map((v, c) => Math.abs(v - flat[flat.length - 1][c])));
    return { pass: worst.step <= LEVELS && span > 10, detail: `largest step ${worst.step.toFixed(1)} levels, ${worst.at}px from the edge; the field darkens ${span.toFixed(0)} levels across the band` };
  });
}

async function run({ tag, width, height, mobile }) {
  await withPage({ width, height, mobile }, async (page) => {
    await waitReady(page);
    for (const hold of HOLDS) {
      const name = `${tag} ${hold.id} hold`;
      await scrollToScreens(page, hold.mid);
      await headerPaint(page, name);
      await headerContrast(page, name, width, height);
      await headerDarkening(page, name, width);
    }
    for (const t of BREAK_TIMES) {
      const name = `${tag} break at film second ${t}`;
      await scrollToScreens(page, screensAt(t));
      await headerPaint(page, name);
      await headerDarkening(page, name, width);
    }
    for (const frac of AWAY) {
      const name = `${tag} sections rising, stage edge at ${frac * 100}% of the screen`;
      await scrollToEdge(page, frac);
      await headerPaint(page, name);
      await headerDarkening(page, name, width);
    }
    await seamChecks(page, tag, width);

    // One screen after the film has gone.
    const y = await page.evaluate(() => document.querySelector(".film").getBoundingClientRect().bottom + scrollY + innerHeight);
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT, `${tag}-after.png`) });
    const after = await page.evaluate(() => ({ W: innerWidth, html: document.documentElement.scrollWidth, body: document.body.scrollWidth, header: getComputedStyle(document.querySelector(".header")).backgroundColor }));
    await check(`${tag} a screen after the film: no sideways scroll`, async () => ({
      pass: after.html <= after.W && after.body <= after.W,
      detail: `viewport ${after.W}, html ${after.html}, body ${after.body}; header background ${after.header} (not asserted)`,
    }));
  });
}

(async () => {
  for (const size of SIZES) await run(size);
  const failed = results.filter((r) => !r.pass).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed. Screenshots: ${OUT}`);
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
