// Shared helpers for the browser checks. Run against `pnpm dev` on :3000.
// NODE_PATH must point at a node_modules that has playwright (see the plan's Global Constraints).
const { chromium } = require("playwright");

const BASE = process.env.BASE_URL || "http://localhost:3000";

/**
 * Opens a fresh browser on the home page and hands `fn` the page.
 * opts: { width, height, mobile?, javaScriptEnabled?, reducedMotion?, blockFilm?, corruptFilm?, query? }
 * `mobile` emulates a touch phone; `blockFilm` aborts the film request; `corruptFilm` answers it with bytes no decoder takes.
 * `fn(page, { errors, pageErrors, requests })`: `errors` collects console errors and uncaught page errors,
 * `pageErrors` only the uncaught ones (a blocked request logs a console error by itself), `requests` every request URL.
 */
async function withPage(opts, fn) {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      viewport: { width: opts.width, height: opts.height },
      isMobile: !!opts.mobile,
      hasTouch: !!opts.mobile,
      javaScriptEnabled: opts.javaScriptEnabled !== false,
      reducedMotion: opts.reducedMotion ? "reduce" : "no-preference",
    });
    const page = await context.newPage();
    const errors = [];
    const pageErrors = [];
    const requests = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => {
      errors.push(String(e));
      pageErrors.push(String(e));
    });
    page.on("request", (r) => requests.push(r.url()));
    if (opts.blockFilm) await page.route(/\/film\/.*\.mp4/, (route) => route.abort());
    if (opts.corruptFilm) await page.route(/\/film\/.*\.mp4/, (route) => route.fulfill({ status: 200, contentType: "video/mp4", body: "not a film" }));
    // Next dev compiles on first request and never reaches networkidle (HMR socket).
    await page.goto(BASE + "/" + (opts.query || ""), { waitUntil: "load", timeout: 60000 });
    return await fn(page, { errors, pageErrors, requests });
  } finally {
    await browser.close();
  }
}

/** Waits for the dev contract: the first film frame (or the poster) is showing. */
async function waitReady(page, timeout = 20000) {
  await page.waitForFunction(() => window.__ready === true, null, { timeout });
}

/** Scroll position (px) of `screens` screens into the film stage. Screens are the pinned layer's height. */
function stageY(page, screens) {
  return page.evaluate((s) => {
    const film = document.querySelector(".film");
    const layer = document.querySelector(".film-layer");
    const vh = (layer && layer.offsetHeight) || innerHeight;
    return film.getBoundingClientRect().top + scrollY + s * vh;
  }, screens);
}

/** Jumps (no smooth scroll) to `screens` screens into the stage, then waits 1.5 s to settle. */
async function scrollToScreens(page, screens) {
  const y = await stageY(page, screens);
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.waitForTimeout(1500);
}

/** [{ id, opacity, rect }] for every caption, in DOM order. */
function captionStates(page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll(".film-caption")).map((el) => ({
      id: el.dataset.caption,
      opacity: Number(getComputedStyle(el).opacity),
      rect: el.getBoundingClientRect().toJSON(),
    })),
  );
}

module.exports = { BASE, withPage, waitReady, stageY, scrollToScreens, captionStates };
