// The film stage on a phone and when things are missing: reduced motion, JavaScript off,
// a film that never arrives (blocked) or never decodes (corrupt), a window resized from
// desktop to phone width, and keyboard focus. Every check prints PASS or FAIL with its
// measured value; the process exits 1 if any check fails. Screenshots go to $CHECK_OUT.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { withPage, waitReady, scrollToScreens, captionStates } = require("./lib.cjs");
const { FILM_SEGMENTS } = require("../../src/lib/film/timeline.ts");

const PHONE = { width: 390, height: 844, mobile: true };
const DESKTOP = { width: 1440, height: 900 };
// Ruling 7 (as narrowed by Ruling 8): the lit stone or crystal is at least this share of the viewport height
// at the middle of each caption hold, where the picture has settled. 40% from 360px wide up, 38% on 320px phones.
const stoneMin = (W) => (W < 360 ? 0.38 : 0.4);
const BOX_MAX = 0.6; // the phone video box ends at or above this share of the viewport height
const LIT = 24; // luma above this is the stone or crystal; the film's background peaks near 14
const FILM_RE = /\/film\/.*\.mp4/;
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
const run = (tag, opts, fn) => withPage(opts, (page, ctx) => fn(page, ctx)).catch((e) => record(`${tag} page run`, false, String(e).split("\n")[0]));

// Each caption hold, in screens: half faded in, the middle, half faded out.
const HOLDS = [];
{
  let start = 0;
  for (const s of FILM_SEGMENTS) {
    if (s.caption) HOLDS.push({ id: s.caption, mid: start + s.screens / 2, points: [start + 0.25, start + s.screens / 2, start + s.screens - 0.25] });
    start += s.screens;
  }
}
const GRIT_MID = HOLDS.find((h) => h.id === "grit").mid;

const HIDE_ALL = ".film-caption,.header{visibility:hidden!important}";
const HIDE_OVERLAY = HIDE_ALL + ".film-layer::before,.film-layer::after{display:none!important}";

async function withStyle(page, css, fn) {
  const tag = await page.addStyleTag({ content: css });
  await page.waitForTimeout(100);
  try {
    return await fn();
  } finally {
    await tag.evaluate((el) => el.remove());
  }
}

/** Luma per pixel of a viewport screenshot, decoded in the page. */
async function lumas(page, file) {
  const buf = await page.screenshot({ path: file ? path.join(OUT, file) : undefined });
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    const out = new Array(c.width * c.height);
    for (let i = 0; i < out.length; i++) out[i] = 0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2];
    return { w: c.width, h: c.height, l: out };
  }, buf.toString("base64"));
}

/** Bounds of the lit pixels. */
function litBounds({ w, h, l }) {
  let top = Infinity, bottom = -Infinity, left = Infinity, right = -Infinity;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (l[y * w + x] > LIT) {
        if (y < top) top = y;
        bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
  return { top, bottom, left, right };
}

const rectOf = (page, sel) => page.evaluate((s) => { const el = document.querySelector(s); return el ? el.getBoundingClientRect().toJSON() : null; }, sel);
const noSideScroll = (page) => page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
const filmState = (page) => page.evaluate(() => { const v = document.querySelector(".film video"); return v ? { t: v.currentTime, seeking: v.seeking, paused: v.paused } : null; });

/** Is `sel` (or every match of it) really on screen: opaque, visible, and the top element at its centre once scrolled to? */
const visibility = (page, sel) =>
  page.evaluate((s) =>
    Array.from(document.querySelectorAll(s)).map((el) => {
      el.scrollIntoView({ block: "center", behavior: "instant" });
      const r = el.getBoundingClientRect();
      let o = 1;
      for (let n = el; n; n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return {
        id: el.dataset.caption || el.textContent.trim().slice(0, 16),
        opacity: o,
        hidden: getComputedStyle(el).visibility !== "visible" || r.width === 0 || r.height === 0,
        onTop: !!hit && (el === hit || el.contains(hit)),
        top: r.top + scrollY,
        bottom: r.bottom + scrollY,
      };
    }), sel);

/** The poster or still image: which file, loaded, painted, in the first screen. */
const stillState = (page) =>
  page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const img = document.querySelector(".film-poster");
    if (!img) return null;
    const r = img.getBoundingClientRect();
    const cs = getComputedStyle(img);
    return {
      file: (img.currentSrc || "").split("/").pop(),
      loaded: img.complete && img.naturalWidth > 0,
      opacity: Number(cs.opacity),
      shown: cs.display !== "none" && cs.visibility === "visible" && r.width > 0 && r.bottom > 0 && r.top < innerHeight,
    };
  });

// ── Phone: the film in the upper part, words below it ─────────────────────
// The full set at 390x844; the layout and stone checks also at the narrower phones (full = false).
async function phoneChecks(size, full) {
  const { width: W, height: H } = size;
  const tag = `phone ${W}x${H}`;
  const STONE_MIN = stoneMin(W);
  await run(tag, size, async (page, { errors, requests }) => {
    await check(`${tag} ready within 20 s`, async () => {
      const t0 = Date.now();
      await waitReady(page);
      return { pass: true, detail: `${Date.now() - t0} ms after load` };
    });
    await check(`${tag} loads phone.mp4 and poster-phone.webp only`, async () => {
      // Unique names: dev mode mounts twice, so the first fetch is aborted and repeated.
      const films = [...new Set(requests.filter((u) => FILM_RE.test(u)).map((u) => u.split("/").pop()))];
      const posters = [...new Set(requests.filter((u) => /\/film\/(poster|end)-/.test(u)).map((u) => u.split("/").pop()))];
      return { pass: films.join() === "phone.mp4" && posters.join() === "poster-phone.webp", detail: `films ${films.join() || "none"}, posters ${posters.join() || "none"}` };
    });

    for (const hold of HOLDS) {
      const rows = [];
      let placePass = true;
      let stonePass = true;
      let darkPass = true;
      const stoneRows = [];
      const darkRows = [];
      for (const s of hold.points) {
        await scrollToScreens(page, s);
        const cap = (await captionStates(page)).find((c) => c.id === hold.id);
        const box = await rectOf(page, ".film-video");
        const { sw, iw } = await noSideScroll(page);
        const ok = cap && cap.opacity >= 0.3 && box && box.bottom <= BOX_MAX * H + 0.5 && cap.rect.top >= box.bottom - 0.5 && sw === iw;
        if (!ok) placePass = false;
        rows.push(`${s.toFixed(2)}: box bottom ${box ? box.bottom.toFixed(1) : "none"} (max ${(BOX_MAX * H).toFixed(1)}), caption top ${cap ? cap.rect.top.toFixed(1) : "none"} at opacity ${cap ? cap.opacity.toFixed(2) : "-"}, scrollWidth ${sw}/${iw}`);

        // The stone, from the film alone (captions, header and edge overlays hidden): large, whole, above the words.
        const isMid = s === hold.mid;
        const raw = await withStyle(page, HIDE_OVERLAY, () => lumas(page, isMid ? `phone-${W}-hold-${hold.id}-bare.png` : undefined));
        const b = litBounds(raw);
        const height = b.bottom - b.top + 1;
        const whole = b.top > box.top + 1 && b.bottom < box.bottom - 1 && b.left > 0 && b.right < W - 1;
        // Height at the middle of the hold only (Ruling 8): the crystal still grows while its caption fades in.
        if (!whole || (isMid && height < STONE_MIN * H)) stonePass = false;
        stoneRows.push(`${s.toFixed(2)}: ${height} px (${((height / H) * 100).toFixed(1)}%), rows ${b.top}-${b.bottom} in box ${box.top.toFixed(0)}-${box.bottom.toFixed(0)}, cols ${b.left}-${b.right} of ${W}, caption ${cap ? (cap.rect.top - b.bottom - 1).toFixed(0) : "-"} px below`);

        // Ruling 5's edge fade melts the box's bottom edge without dimming the stone.
        const lay = await withStyle(page, HIDE_ALL, () => lumas(page));
        let lit = 0;
        let darker = 0;
        for (let i = 0; i < raw.l.length; i++) {
          if (raw.l[i] <= LIT) continue;
          lit++;
          if (raw.l[i] - lay.l[i] > 2) darker++;
        }
        if (darker > 0) darkPass = false;
        darkRows.push(`${s.toFixed(2)}: ${darker} of ${lit}`);
        if (isMid) await page.screenshot({ path: path.join(OUT, `phone-${W}-hold-${hold.id}.png`) });
      }
      record(`${tag} ${hold.id} hold: video box ends at or above 60% of the height, caption starts below it, no sideways scroll (3 points)`, placePass, rows.join("; "));
      record(`${tag} ${hold.id} hold: lit stone at least ${Math.round(STONE_MIN * 100)}% of the height at the middle, never cropped (3 points)`, stonePass, stoneRows.join("; "));
      record(`${tag} ${hold.id} hold: the bottom edge fade darkens no lit stone pixel (3 points)`, darkPass, darkRows.join("; "));
    }

    if (!full) return record(`${tag} no console errors`, errors.length === 0, errors.length ? errors.slice(0, 5).join(" | ") : "0 errors");
    // The break, for the eye: rocks leave through the box's bottom edge (Ruling 5).
    for (const s of [7.4, 8.0, 8.6, 9.4]) {
      await scrollToScreens(page, s);
      await page.screenshot({ path: path.join(OUT, `phone-break-${s}.png`) });
    }
    await scrollToScreens(page, 0);
    await page.screenshot({ path: path.join(OUT, "phone-top.png") });

    // The iOS unlock plays, then pauses, on the first touch: the film must end where it was.
    await check(`${tag} first touch (play/pause unlock) leaves the film on its frame`, async () => {
      await scrollToScreens(page, GRIT_MID);
      const before = await filmState(page);
      await page.touchscreen.tap(W / 2, H * 0.35);
      await page.waitForTimeout(1500);
      const after = await filmState(page);
      const drift = Math.abs(after.t - before.t);
      return { pass: drift <= 0.001 && after.paused && !after.seeking, detail: `currentTime ${before.t.toFixed(4)} before, ${after.t.toFixed(4)} after, paused ${after.paused}` };
    });
    record(`${tag} no console errors`, errors.length === 0, errors.length ? errors.slice(0, 5).join(" | ") : "0 errors");
  });
}

// ── Reduced motion: no video, the end still, every caption ────────────────
async function reducedMotionChecks(opts, label) {
  const tag = `reduced motion ${label}`;
  const still = opts.mobile ? "end-phone.webp" : "end-desktop.webp";
  await run(tag, { ...opts, reducedMotion: true }, async (page, { errors, requests }) => {
    await check(`${tag} ready within 20 s`, async () => {
      const t0 = Date.now();
      await waitReady(page);
      return { pass: true, detail: `${Date.now() - t0} ms after load` };
    });
    // The film would start 4 s after load at the latest (the poster timer): wait past it.
    await page.waitForTimeout(5000);
    await check(`${tag} no film request`, async () => {
      const films = requests.filter((u) => FILM_RE.test(u));
      return { pass: films.length === 0, detail: `${films.length} requests${films.length ? ": " + films.join(", ") : ""}` };
    });
    await check(`${tag} the end still (${still}) is showing`, async () => {
      const s = await stillState(page);
      return { pass: !!s && s.file === still && s.loaded && s.opacity === 1 && s.shown, detail: JSON.stringify(s) };
    });
    await check(`${tag} all four captions at opacity 1, in order, not pinned`, async () => {
      const caps = await visibility(page, ".film-caption");
      const pinned = await page.evaluate(() => getComputedStyle(document.querySelector(".film-layer")).position);
      const inOrder = caps.every((c, i) => i === 0 || c.top >= caps[i - 1].bottom);
      return {
        pass: caps.length === 4 && caps.every((c) => c.opacity === 1 && !c.hidden && c.onTop) && inOrder && pinned !== "sticky",
        detail: `${caps.map((c) => `${c.id} ${c.opacity}${c.onTop ? "" : " covered"}`).join(", ")}; in order ${inOrder}; layer ${pinned}`,
      };
    });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({ path: path.join(OUT, `reduced-${label}-top.png`) });
    await page.screenshot({ path: path.join(OUT, `reduced-${label}-full.png`), fullPage: true });
    record(`${tag} no console errors`, errors.length === 0, errors.length ? errors.slice(0, 5).join(" | ") : "0 errors");
  });
}

// ── JavaScript off: every caption and both buttons visible, the poster shows ──
async function noScriptChecks(opts, label) {
  const tag = `JavaScript off ${label}`;
  await run(tag, { ...opts, javaScriptEnabled: false }, async (page) => {
    await check(`${tag} all four captions visible, in order`, async () => {
      const caps = await visibility(page, ".film-caption");
      const inOrder = caps.every((c, i) => i === 0 || c.top >= caps[i - 1].bottom);
      return { pass: caps.length === 4 && caps.every((c) => c.opacity === 1 && !c.hidden && c.onTop) && inOrder, detail: `${caps.map((c) => `${c.id} ${c.opacity}${c.onTop ? "" : " covered"}`).join(", ")}; in order ${inOrder}` };
    });
    await check(`${tag} both caption buttons visible`, async () => {
      const btns = await visibility(page, ".film-caption .film-ctas a");
      return { pass: btns.length === 2 && btns.every((b) => b.opacity === 1 && !b.hidden && b.onTop), detail: btns.map((b) => `${b.id} ${b.opacity}${b.onTop ? "" : " covered"}`).join(", ") || "none" };
    });
    await check(`${tag} the poster shows`, async () => {
      const s = await stillState(page);
      return { pass: !!s && /^poster-/.test(s.file) && s.loaded && s.opacity === 1 && s.shown, detail: JSON.stringify(s) };
    });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({ path: path.join(OUT, `nojs-${label}-top.png`) });
    await page.screenshot({ path: path.join(OUT, `nojs-${label}-full.png`), fullPage: true });
  });
}

// ── The film never arrives, or never decodes ─────────────────────────────
async function failureChecks(kind) {
  const tag = `${kind} film 1440x900`;
  await run(tag, { ...DESKTOP, [kind === "blocked" ? "blockFilm" : "corruptFilm"]: true }, async (page, { pageErrors }) => {
    await check(`${tag} ready within 20 s`, async () => {
      const t0 = Date.now();
      await waitReady(page);
      return { pass: true, detail: `${Date.now() - t0} ms after load` };
    });
    await check(`${tag} the poster stays and the caption follows the scroll (first and third holds)`, async () => {
      const seen = [];
      let posterPass = true;
      for (const hold of [HOLDS[0], HOLDS[2]]) {
        await scrollToScreens(page, hold.mid);
        const s = await page.evaluate(() => Number(getComputedStyle(document.querySelector(".film-poster")).opacity));
        if (s !== 1) posterPass = false;
        const top = (await captionStates(page)).filter((c) => c.opacity > 0.5).map((c) => c.id);
        seen.push(`${hold.id} hold: caption ${top.join("+") || "none"}, poster opacity ${s}`);
        if (top.join() !== hold.id) posterPass = false;
      }
      return { pass: posterPass, detail: seen.join("; ") };
    });
    record(`${tag} no page errors`, pageErrors.length === 0, pageErrors.length ? pageErrors.slice(0, 5).join(" | ") : "0 page errors");
  });
}

// ── Review Focus 3: desktop to phone width mid-film ──────────────────────
async function resizeCheck() {
  const tag = "resize 1440x900 to 390x844";
  await run(tag, DESKTOP, async (page, { requests }) => {
    await waitReady(page);
    await scrollToScreens(page, GRIT_MID);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(1000);
    await check(`${tag} at the grit hold: at most one caption above 0.01, no sideways scroll, no source swap`, async () => {
      const shown = (await captionStates(page)).filter((c) => c.opacity > 0.01);
      const { sw, iw } = await noSideScroll(page);
      const films = [...new Set(requests.filter((u) => FILM_RE.test(u)).map((u) => u.split("/").pop()))];
      return { pass: shown.length <= 1 && sw === iw && films.join() === "desktop.mp4", detail: `${shown.map((c) => `${c.id} ${c.opacity}`).join(", ") || "no caption"}; scrollWidth ${sw}/${iw}; films ${films.join()}` };
    });
    await page.screenshot({ path: path.join(OUT, "resize-grit.png") });
  });
}

// ── A rotated tablet: the film is picked at load, the layout follows the window ──
// Load at one size, resize to the other, then at the intro and delivery holds the stone
// is whole inside the film box and no showing caption overlaps it.
async function rotateCheck(from, to) {
  const tag = `rotate ${from.width}x${from.height} to ${to.width}x${to.height}`;
  await run(tag, from, async (page, { requests, pageErrors }) => {
    await waitReady(page);
    await page.setViewportSize(to);
    await page.waitForTimeout(1000);
    const { width: W, height: H } = to;
    const films = [...new Set(requests.filter((u) => FILM_RE.test(u)).map((u) => u.split("/").pop()))];
    for (const hold of [HOLDS[0], HOLDS[3]]) {
      await check(`${tag} ${hold.id} hold: stone whole inside the film box, no caption on it (film ${films.join()})`, async () => {
        await scrollToScreens(page, hold.mid);
        const box = await rectOf(page, ".film-video");
        const cap = (await captionStates(page)).find((c) => c.id === hold.id);
        const raw = await withStyle(page, HIDE_OVERLAY, () => lumas(page, `rotate-${from.width}-${to.width}-${hold.id}-bare.png`));
        await page.screenshot({ path: path.join(OUT, `rotate-${from.width}-${to.width}-${hold.id}.png`) });
        const b = litBounds(raw);
        const whole = b.top > Math.max(0, box.top) + 1 && b.bottom < Math.min(H, box.bottom) - 1 && b.left > Math.max(0, box.left) + 1 && b.right < Math.min(W, box.right) - 2;
        const clear = cap && cap.opacity > 0.3 && cap.rect.top > b.bottom;
        const { sw, iw } = await noSideScroll(page);
        // The poster stays on the film picked at load (<picture> would re-pick it on resize).
        const posterFile = await page.evaluate(() => document.querySelector(".film-poster").currentSrc.split("/").pop());
        const posterOk = posterFile === (films.join() === "phone.mp4" ? "poster-phone.webp" : "poster-desktop.webp");
        return {
          pass: whole && clear && posterOk && sw === iw && pageErrors.length === 0,
          detail: `poster ${posterFile}; lit rows ${b.top}-${b.bottom} in box ${box.top.toFixed(0)}-${box.bottom.toFixed(0)}, cols ${b.left}-${b.right} in box ${box.left.toFixed(0)}-${box.right.toFixed(0)} of ${W}; caption top ${cap ? cap.rect.top.toFixed(0) : "-"} at opacity ${cap ? cap.opacity.toFixed(2) : "-"}; scrollWidth ${sw}/${iw}; ${pageErrors.length} page errors`,
        };
      });
    }
  });
}

// ── Review Focus 5: Tab never lands in a hidden caption ──────────────────
async function focusCheck(opts, label) {
  const tag = `focus ${label}`;
  await run(tag, opts, async (page) => {
    await waitReady(page);
    await scrollToScreens(page, GRIT_MID);
    await check(`${tag} ten Tabs from the top at the grit hold never focus a caption at opacity 0`, async () => {
      await page.evaluate(() => document.activeElement && document.activeElement.blur());
      const path_ = [];
      const bad = [];
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press("Tab");
        const f = await page.evaluate(() => {
          const a = document.activeElement;
          const cap = a && a.closest(".film-caption");
          const name = !a || a === document.body ? "body" : `${a.tagName.toLowerCase()}:${(a.getAttribute("aria-label") || a.textContent || "").trim().slice(0, 14)}`;
          return { name, cap: cap ? cap.dataset.caption : null, opacity: cap ? Number(getComputedStyle(cap).opacity) : null };
        });
        path_.push(f.cap ? `${f.name} [${f.cap} ${f.opacity}]` : f.name);
        if (f.cap && f.opacity === 0) bad.push(f.name);
      }
      return { pass: bad.length === 0, detail: path_.join(" > ") };
    });
  });
}

(async () => {
  console.log(`film fallback checks, screenshots in ${OUT}`);
  await phoneChecks(PHONE, true);
  await phoneChecks({ width: 360, height: 800, mobile: true }, false);
  await phoneChecks({ width: 320, height: 568, mobile: true }, false);
  await reducedMotionChecks(DESKTOP, "1440x900");
  await reducedMotionChecks(PHONE, "390x844");
  await noScriptChecks(DESKTOP, "1440x900");
  await noScriptChecks(PHONE, "390x844");
  await failureChecks("blocked");
  await failureChecks("corrupt");
  await resizeCheck();
  await rotateCheck({ width: 768, height: 1024 }, { width: 1024, height: 768 });
  await rotateCheck({ width: 1024, height: 768 }, { width: 768, height: 1024 });
  await focusCheck(DESKTOP, "1440x900");
  await focusCheck(PHONE, "390x844");

  const failed = results.filter((r) => !r.pass).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exit(failed ? 1 : 0);
})();
