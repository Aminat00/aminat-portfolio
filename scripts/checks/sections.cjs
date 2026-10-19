// The sections below the film: Selected work (the three case cards on the home page) and the case
// pages behind them, the intro and the number strip, Experience, Projects, About and Contact, and the
// header, footer and page metadata. Runs at 1440x900 and 390x844, with JavaScript on and off (and once
// with reduced motion, for the number strip).
// Every check prints PASS or FAIL with its measured value; the process exits 1 if any check fails.
// Screenshots go to $CHECK_OUT.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { BASE, withPage, waitReady, scrollToScreens, captionStates } = require("./lib.cjs");
const { CASES, EXPERIENCE, LINKS, INTRO, NUMBERS, PROJECTS, ABOUT, CONTACT, NAV, META, FOOTER } = require("../../src/content/site.ts");
const { FILM_SEGMENTS } = require("../../src/lib/film/timeline.ts");

const PROFILES = [
  { tag: "1440x900", width: 1440, height: 900 },
  { tag: "390x844", width: 390, height: 844, mobile: true },
];
const HEADINGS = ["The problem", "What I did", "The key decision", "The result", "What I'd do next"];
const MIN_DIAGRAM_TEXT = 10.9; // px as rendered ("about 11")
const T = Number(process.env.CHECK_TIMEOUT) || 60000; // navigation timeout (ms); Next dev compiles a route on its first request
const OUT = process.env.CHECK_OUT || path.join(os.tmpdir(), "section-checks");
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

/** Elements under `sel` (and `sel` itself) that stick out past the viewport's left or right edge. */
const sidewaysBy = (page, sel) =>
  page.evaluate((sel) => {
    const W = document.documentElement.clientWidth;
    const bad = [];
    for (const el of document.querySelectorAll(`${sel}, ${sel} *`)) {
      const r = el.getBoundingClientRect();
      if (r.width && (r.right > W + 0.5 || r.left < -0.5)) bad.push(`${el.tagName.toLowerCase()} ${Math.round(r.left)}..${Math.round(r.right)}`);
    }
    return { W, scrollW: document.documentElement.scrollWidth, bad: bad.slice(0, 4) };
  }, sel);

/**
 * Text under `sel` that a reader could not see: hidden, laid out at zero size, or faded. With JavaScript, section
 * lines rise in as they come up the screen (Task 11, spec section 11: "fully readable by the time the block reaches
 * the middle of the screen"), so a faded line is brought to the middle of the screen (or as far as the page goes)
 * and looked at again; it only counts as seen if it is then fully there. The scroll is put back afterwards.
 */
const unseenText = (page, sel) =>
  page.evaluate(async (sel) => {
    const seen = (el) => {
      let opacity = 1;
      for (let p = el; p; p = p.parentElement) opacity *= Number(getComputedStyle(p).opacity);
      const r = el.getBoundingClientRect();
      return getComputedStyle(el).visibility !== "hidden" && opacity >= 0.95 && r.width && r.height;
    };
    const bad = [];
    const y0 = scrollY;
    for (const el of document.querySelectorAll(`${sel} *`)) {
      const own = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!own || seen(el)) continue;
      const r = el.getBoundingClientRect();
      window.scrollTo({ top: r.top + scrollY + r.height / 2 - innerHeight / 2, behavior: "instant" });
      await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(done, 50))));
      if (!seen(el)) bad.push(el.textContent.trim().slice(0, 30));
    }
    window.scrollTo({ top: y0, behavior: "instant" });
    return bad;
  }, sel);

// textContent, not innerText: the stack tags are drawn in capitals, the words in the page are not.
const textOf = (page, sel) => page.locator(sel).first().textContent();

async function homeChecks(page, tag, profile, js) {
  const ids = CASES.map((c) => `case-${c.slug}`);
  await check(`${tag}  #work is a section holding the three case cards, in order`, async () => {
    const tagName = await page.$eval("#work", (el) => el.tagName).catch(() => "none");
    const got = await page.$$eval('#work article[id^="case-"]', (els) => els.map((e) => e.id));
    return { pass: tagName === "SECTION" && JSON.stringify(got) === JSON.stringify(ids), detail: `${tagName}: ${got.join(", ") || "no cards"}` };
  });
  for (const c of CASES) {
    await check(`${tag}  card ${c.slug}: title, facts, summary, link`, async () => {
      const card = page.locator(`#case-${c.slug}`);
      const title = await card.locator("h3").first().innerText();
      const text = await card.textContent();
      const missing = [c.company, c.role, c.year, c.result, c.summary, ...c.stack].filter((s) => !text.includes(s));
      const link = card.getByRole("link", { name: /Read the case/ });
      const n = await link.count();
      const href = n === 1 ? await link.getAttribute("href") : null;
      const word = n === 1 ? (await link.textContent()).trim() : "";
      return {
        pass: title === c.title && !missing.length && href === `/work/${c.slug}` && word === "Read the case",
        detail: `h3 "${title}"; missing [${missing.join(" | ")}]; ${n} link(s) to ${href} reading "${word}"`,
      };
    });
    await check(`${tag}  card ${c.slug}: "Read the case" answers HTTP 200`, async () => {
      const res = await page.request.get(`${BASE}/work/${c.slug}`, { timeout: T });
      return { pass: res.status() === 200, detail: String(res.status()) };
    });
  }
  await check(`${tag}  every word in the section is visible${js ? "" : " with JavaScript off"}`, async () => {
    const bad = await unseenText(page, "#work");
    return { pass: bad.length === 0, detail: bad.length ? `unseen: ${bad.join(" | ")}` : "all visible" };
  });
  await check(`${tag}  no sideways scroll, nothing past the edges in the section`, async () => {
    const o = await sidewaysBy(page, "#work");
    return { pass: o.bad.length === 0 && o.scrollW <= o.W, detail: `scrollWidth ${o.scrollW} / ${o.W}; past: ${o.bad.join(", ") || "none"}` };
  });
  await check(`${tag}  no em dashes in the section`, async () => {
    const t = await textOf(page, "#work");
    return { pass: !t.includes("—"), detail: "" };
  });
  if (js) {
    await page.locator("#work").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.locator("#work").screenshot({ path: path.join(OUT, `work-${profile.tag}.png`) });
  }
}

/** Screenshot one section, if it exists (a missing one already fails its own checks). */
async function shot(page, sel, file) {
  const el = page.locator(sel).first();
  if (!(await el.count())) return;
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await el.screenshot({ path: path.join(OUT, file) });
}

/** Every word visible, nothing past the edges, no em dashes: the same three rules for every section. */
async function plainChecks(page, tag, sel, js) {
  await check(`${tag}  ${sel}: every word visible${js ? "" : " with JavaScript off"}, no sideways scroll, no em dashes`, async () => {
    if (!(await page.locator(sel).count())) return { pass: false, detail: "no such element" };
    const bad = await unseenText(page, sel);
    const o = await sidewaysBy(page, sel);
    const t = await textOf(page, sel);
    return {
      pass: bad.length === 0 && o.bad.length === 0 && o.scrollW <= o.W && !t.includes("—"),
      detail: `unseen [${bad.join(" | ")}]; scrollWidth ${o.scrollW} / ${o.W}; past [${o.bad.join(", ")}]`,
    };
  });
}

// What each number should read once counted: prefix and suffix carry their own spaces.
const NUMBER_TEXT = NUMBERS.map((n) => `${n.prefix ?? ""}${n.value}${n.suffix ?? ""}`);
const STRIP = ".proof-section";

async function introChecks(page, tag, js) {
  await check(`${tag}  #intro comes first after the film, the number strip right after it`, async () => {
    const order = await page.evaluate(() => {
      const main = document.querySelector(".film + main");
      return main ? Array.from(main.children).slice(0, 2).map((el) => el.id || el.className) : [];
    });
    return { pass: order[0] === "intro" && /proof-section/.test(order[1] || ""), detail: order.join(" → ") || "no main after the film" };
  });
  await check(`${tag}  #intro: the full intro text and links to email, résumé, LinkedIn and GitHub`, async () => {
    const tagName = await page.$eval("#intro", (el) => el.tagName).catch(() => "none");
    const text = tagName === "none" ? "" : (await textOf(page, "#intro")).replace(/\s+/g, " ");
    const hrefs = await page.$$eval("#intro a", (as) => as.map((a) => a.getAttribute("href")));
    const want = [LINKS.email, LINKS.resume, LINKS.linkedin, LINKS.github];
    return { pass: tagName === "SECTION" && text.includes(INTRO.text) && JSON.stringify(hrefs) === JSON.stringify(want), detail: `${tagName}; text ${text.includes(INTRO.text) ? "complete" : "missing"}; links ${hrefs.join(", ") || "none"}` };
  });
  await check(`${tag}  number strip: four links, labels and values from NUMBERS, each href landing on an element`, async () => {
    if (!(await page.locator(STRIP).count())) return { pass: false, detail: "no number strip" };
    await page.locator(STRIP).scrollIntoViewIfNeeded();
    if (js) await page.waitForTimeout(2000); // the count-up runs 1.6 s once the strip is in view
    const items = await page.$$eval(`${STRIP} .proof-item`, (els) =>
      els.map((el) => ({
        tag: el.tagName,
        href: el.getAttribute("href"),
        lands: !!document.getElementById((el.getAttribute("href") || "#").slice(1)),
        value: el.querySelector(".proof-num")?.textContent.replace(/\s+/g, " ").trim(),
        label: el.querySelector(".proof-label")?.textContent.trim(),
      })),
    );
    const bad = NUMBERS.map((n, i) => {
      const it = items[i];
      if (!it) return `item ${i + 1} missing`;
      return it.tag === "A" && it.href === n.href && it.lands && it.label === n.label && it.value === NUMBER_TEXT[i] ? null : `item ${i + 1}: ${it.tag} ${it.href} lands ${it.lands}, "${it.value}" / "${it.label}"`;
    }).filter(Boolean);
    return { pass: items.length === NUMBERS.length && !bad.length && items.at(-1)?.value === "Days to minutes", detail: `${items.length} items; ${bad.join("; ") || items.map((i) => `"${i.value}"`).join(", ")}` };
  });
  await check(`${tag}  number strip: no inline padding style`, async () => {
    const styles = await page.$$eval(`${STRIP}, ${STRIP} *`, (els) => els.map((el) => el.getAttribute("style")).filter((s) => s && /padding/.test(s)));
    return { pass: styles.length === 0, detail: styles.join(" | ") || "none" };
  });
}

/** Reduced motion: the strip shows its final values at once, with no count-up. */
async function reducedMotionStrip(profile) {
  const tag = `${profile.tag} reduced`;
  await withPage({ ...profile, reducedMotion: true }, async (page) => {
    await check(`${tag}  number strip shows its final values at once`, async () => {
      if (!(await page.locator(STRIP).count())) return { pass: false, detail: "no number strip" };
      await page.locator(STRIP).scrollIntoViewIfNeeded();
      const seen = [];
      for (let i = 0; i < 6; i++) {
        seen.push((await page.$$eval(`${STRIP} .proof-num`, (els) => els.map((e) => e.textContent.replace(/\s+/g, " ").trim()))).join(" / "));
        await page.waitForTimeout(150);
      }
      const want = NUMBER_TEXT.join(" / ");
      return { pass: seen.every((s) => s === want), detail: [...new Set(seen)].join(" ; ") };
    });
  }).catch((e) => record(`${tag}  page run`, false, String(e).split("\n")[0]));
}

async function experienceChecks(page, tag) {
  await check(`${tag}  #experience: six role rows in order, each with its exact dates, role, line and tags`, async () => {
    const tagName = await page.$eval("#experience", (el) => el.tagName).catch(() => "none");
    const rows = await page.$$eval("#experience .timeline-role", (els) =>
      els.map((el) => ({ when: el.querySelector(".timeline-when")?.textContent.trim(), title: el.querySelector(".timeline-title")?.textContent.trim(), text: el.textContent })),
    );
    const wrong = EXPERIENCE.map((e, i) => {
      const r = rows[i];
      if (!r) return `row ${i + 1} missing`;
      const missing = [e.line, ...e.tags].filter((s) => !r.text.includes(s));
      return r.when === e.when && r.title === e.role && !missing.length ? null : `row ${i + 1}: "${r.when}" / "${r.title}" missing [${missing.join(" | ")}]`;
    }).filter(Boolean);
    return { pass: tagName === "SECTION" && rows.length === EXPERIENCE.length && !wrong.length, detail: `${tagName}, ${rows.length} rows; ${wrong.join("; ") || "all match"}` };
  });
  await check(`${tag}  #experience: "LaunchGood" is one company heading above its three rows; other rows name their company`, async () => {
    const r = await page.evaluate(() => {
      const sec = document.getElementById("experience");
      if (!sec) return { n: 0 };
      const n = sec.textContent.split("LaunchGood").length - 1;
      const head = Array.from(sec.querySelectorAll("h3, h4")).find((h) => h.textContent.trim() === "LaunchGood");
      const group = head?.closest(".timeline-group");
      const rows = group ? Array.from(group.querySelectorAll(".timeline-role")) : [];
      const above = head && rows.length ? head.getBoundingClientRect().bottom <= rows[0].getBoundingClientRect().top + 1 : false;
      const others = Array.from(sec.querySelectorAll(".timeline-role")).filter((row) => !group?.contains(row)).map((row) => row.textContent);
      return { n, head: head?.tagName, rows: rows.length, above, others };
    });
    const others = EXPERIENCE.filter((e) => e.company !== "LaunchGood");
    const named = others.filter((e, i) => (r.others?.[i] || "").includes(e.company)).length;
    return {
      pass: r.n === 1 && !!r.head && r.rows === 3 && r.above && named === others.length && r.others.length === others.length,
      detail: `"LaunchGood" ${r.n}x, heading ${r.head}, ${r.rows} rows in its group, heading above: ${r.above}; ${named}/${others.length} other rows name their company`,
    };
  });
  await check(`${tag}  #experience: one timeline line and a dot per role (Task 11 animates them)`, async () => {
    const lines = await page.locator("#experience .timeline-line").count();
    const dots = await page.locator("#experience .timeline-role .timeline-dot").count();
    return { pass: lines === 1 && dots === EXPERIENCE.length, detail: `${lines} line, ${dots} dots` };
  });
  await check(`${tag}  #experience ends with "View full résumé (PDF)", a PDF answering HTTP 200`, async () => {
    const link = page.locator(`#experience a[href="${LINKS.resume}"]`);
    const n = await link.count();
    const word = n ? (await link.last().textContent()).trim() : "";
    const last = await page.$$eval("#experience a", (as) => as.at(-1)?.getAttribute("href")).catch(() => null);
    const res = await page.request.get(`${BASE}${LINKS.resume}`, { timeout: T });
    const type = res.headers()["content-type"] || "";
    return { pass: n === 1 && word === "View full résumé (PDF)" && last === LINKS.resume && res.status() === 200 && type.startsWith("application/pdf"), detail: `${n} link(s) reading "${word}", last link ${last}; ${res.status()} ${type}` };
  });
}

// The sections under the film, in page order (the number strip has no id).
const ORDER = ["intro", "proof-section", "work", "experience", "projects", "about", "contact"];

async function closingChecks(page, tag) {
  await check(`${tag}  the sections under the film come in the final order`, async () => {
    const got = await page.evaluate(() => {
      const main = document.querySelector(".film + main");
      return main ? Array.from(main.children).map((el) => el.id || (el.classList.contains("proof-section") ? "proof-section" : el.tagName.toLowerCase())) : [];
    });
    return { pass: JSON.stringify(got) === JSON.stringify(ORDER), detail: got.join(" → ") || "no main after the film" };
  });
  await check(`${tag}  #projects: one row per project; Nidham's "See the demo" opens the demo in a new tab; no "Coming soon"`, async () => {
    const tagName = await page.$eval("#projects", (el) => el.tagName).catch(() => "none");
    if (tagName === "none") return { pass: false, detail: "no #projects" };
    const text = await textOf(page, "#projects");
    const rows = await page.$$eval("#projects .project", (els) => els.map((el) => el.textContent));
    const wrong = PROJECTS.filter((p, i) => !(rows[i] || "").includes(p.name) || !(rows[i] || "").includes(p.line)).map((p) => p.name);
    const demo = await page.$$eval(`#projects a[href="${LINKS.nidhamDemo}"]`, (as) => as.map((a) => ({ text: a.textContent.trim(), target: a.target, rel: a.rel, row: a.closest(".project")?.querySelector("h3")?.textContent })));
    const d = demo[0];
    const ok = demo.length === 1 && d.text === "See the demo" && d.target === "_blank" && /\bnoopener\b/.test(d.rel) && d.row === "Nidham";
    return {
      pass: tagName === "SECTION" && rows.length === PROJECTS.length && !wrong.length && ok && !/coming soon/i.test(text),
      detail: `${rows.length} rows, wrong [${wrong.join(", ")}]; demo link: ${demo.length ? JSON.stringify(d) : "none"}; coming soon: ${/coming soon/i.test(text)}`,
    };
  });
  await check(`${tag}  #about: every line, no image`, async () => {
    const tagName = await page.$eval("#about", (el) => el.tagName).catch(() => "none");
    if (tagName === "none") return { pass: false, detail: "no #about" };
    const text = await textOf(page, "#about");
    const missing = ABOUT.lines.filter((l) => !text.includes(l));
    const imgs = await page.locator("#about img, #about picture, #about svg image").count();
    return { pass: tagName === "SECTION" && !missing.length && imgs === 0, detail: `missing ${missing.length}; ${imgs} image(s)` };
  });
  await check(`${tag}  #contact: the email first (showing the address), then LinkedIn, GitHub, résumé, then the availability line`, async () => {
    const tagName = await page.$eval("#contact", (el) => el.tagName).catch(() => "none");
    if (tagName === "none") return { pass: false, detail: "no #contact" };
    const links = await page.$$eval("#contact a", (as) => as.map((a) => ({ href: a.getAttribute("href"), text: a.textContent.trim() })));
    const hrefs = links.map((l) => l.href);
    const want = [LINKS.email, LINKS.linkedin, LINKS.github, LINKS.resume];
    const avail = await page.evaluate((line) => {
      const sec = document.getElementById("contact");
      const p = Array.from(sec.querySelectorAll("p")).find((el) => el.textContent.trim() === line);
      const last = Array.from(sec.querySelectorAll("a")).at(-1);
      return !!p && !!last && !!(last.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING);
    }, CONTACT.availability);
    return {
      pass: tagName === "SECTION" && links[0]?.href?.startsWith("mailto:") && links[0].text === LINKS.emailText && JSON.stringify(hrefs) === JSON.stringify(want) && avail,
      detail: `links ${hrefs.join(", ")}; first reads "${links[0]?.text}"; availability after the links: ${avail}`,
    };
  });
  await check(`${tag}  the page has no form`, async () => {
    const n = await page.locator("form").count();
    return { pass: n === 0, detail: `${n} form(s)` };
  });
}

// The middle of each caption hold, in screens into the stage.
const HOLDS = [];
{
  let start = 0;
  for (const seg of FILM_SEGMENTS) {
    if (seg.caption) HOLDS.push({ id: seg.caption, mid: start + seg.screens / 2 });
    start += seg.screens;
  }
}

const visible = (page, sel) =>
  page.$$eval(sel, (els) =>
    els.filter((el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
    }).length,
  );

const toWork = async (page) => {
  await page.evaluate(() => window.scrollTo({ top: document.getElementById("work").getBoundingClientRect().top + scrollY, behavior: "instant" }));
  await page.waitForTimeout(600);
};
const toTop = async (page) => {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(600);
};

async function headerChecks(page, tag, profile, js) {
  await check(`${tag}  header: the section links are NAV, and every header link's hash lands on an element on the page`, async () => {
    const links = await page.$$eval(".header a", (as) => as.map((a) => ({ href: a.getAttribute("href"), hash: new URL(a.href).hash, nav: a.classList.contains("nav-link"), label: a.textContent.trim() })));
    const hashed = links.filter((l) => l.hash);
    const lost = await page.evaluate((hs) => hs.filter((h) => !document.getElementById(h.slice(1))), hashed.map((l) => l.hash));
    const nav = links.filter((l) => l.nav).map((l) => `${l.label} ${l.hash}`);
    const want = NAV.map((n) => `${n.label} ${n.href}`);
    return { pass: hashed.length >= NAV.length && !lost.length && JSON.stringify(nav) === JSON.stringify(want), detail: `nav [${nav.join(", ")}]; ${hashed.length} hash links, not on the page: [${lost.join(", ")}]` };
  });
  await check(`${tag}  header: shows "Aminat Moldalieva" and an email link`, async () => {
    // With JavaScript the phone menu button only arrives once the film is done, so look from the first section.
    if (js) await toWork(page);
    const brand = (await page.locator(".header .nav-brand").first().innerText().catch(() => "")).trim();
    const mail = await page.locator('.header a[href^="mailto:"]').count();
    let shown = await visible(page, '.header a[href^="mailto:"]');
    let how = "in the bar";
    if (!shown && js && (await visible(page, ".nav-toggle"))) {
      await page.locator(".nav-toggle").click();
      try {
        await page.waitForTimeout(500);
        shown = await visible(page, '#mobile-menu a[href^="mailto:"]');
        how = `in the open menu, reading "${(await page.$$eval('#mobile-menu a[href^="mailto:"]', (as) => as.map((a) => a.textContent.trim()))).join()}"`;
      } finally {
        await page.locator(".nav-toggle").click();
        await page.waitForTimeout(500);
      }
    }
    if (js) await toTop(page);
    const ok = brand === "Aminat Moldalieva" && mail >= 1 && (shown >= 1 || (!js && profile.width <= 760));
    return { pass: ok, detail: `brand "${brand}"; ${mail} mailto link(s), ${shown} visible ${shown ? how : ""}` };
  });
  await check(`${tag}  header: "Email" in the bar on wide screens, "Email me" in the menu`, async () => {
    const bar = await page.$$eval('.header .nav a[href^="mailto:"]', (as) => as.map((a) => a.textContent.trim()));
    const menu = await page.$$eval('#mobile-menu a[href^="mailto:"]', (as) => as.map((a) => `${a.textContent.trim()}${a.classList.contains("btn-primary") ? " (primary)" : ""}`));
    const menuNav = await page.$$eval("#mobile-menu a:not([href^='mailto:'])", (as) => as.map((a) => new URL(a.href).hash));
    return {
      pass: bar.join() === "Email" && menu.join() === "Email me (primary)" && JSON.stringify(menuNav) === JSON.stringify(NAV.map((n) => n.href)),
      detail: `bar [${bar.join(", ")}]; menu [${menu.join(", ")}], menu links [${menuNav.join(", ")}]`,
    };
  });
  await check(`${tag}  tab title is META.title; description and Open Graph from META, image /og.jpg`, async () => {
    const m = await page.evaluate(() => {
      const meta = (sel) => document.querySelector(sel)?.getAttribute("content");
      return { title: document.title, desc: meta('meta[name="description"]'), ogTitle: meta('meta[property="og:title"]'), ogDesc: meta('meta[property="og:description"]'), ogImage: meta('meta[property="og:image"]') };
    });
    return {
      pass: m.title === META.title && m.desc === META.description && m.ogTitle === META.title && m.ogDesc === META.description && /\/og\.jpg$/.test(m.ogImage || ""),
      detail: JSON.stringify(m),
    };
  });
  await check(`${tag}  footer carries the note that the film is AI-generated`, async () => {
    const t = await page.locator("footer").first().textContent().catch(() => "");
    return { pass: t.includes(FOOTER.note), detail: t.replace(/\s+/g, " ").trim() };
  });
  if (!js) {
    // Without JavaScript the bar never turns solid, so it must not ride over the sections' words.
    await check(`${tag}  header does not sit over section text with JavaScript off`, async () => {
      const r = await page.evaluate(() => {
        const el = document.getElementById("experience");
        window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + 120, behavior: "instant" });
        const h = document.querySelector(".header");
        const s = getComputedStyle(h);
        return { bottom: h.getBoundingClientRect().bottom, bg: s.backgroundColor };
      });
      const alpha = r.bg === "transparent" ? 0 : Number((r.bg.match(/[\d.]+/g) || [])[3] ?? 1);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      return { pass: r.bottom <= 0 || alpha >= 0.75, detail: `header bottom at ${Math.round(r.bottom)}px, background ${r.bg}` };
    });
    return;
  }
  await check(`${tag}  header: over the film only the name and "Email"; the section links arrive once the film is done`, async () => {
    const shown = () =>
      page.$$eval(".header .nav-link, .header .nav-toggle", (els) =>
        els
          .filter((el) => {
            const s = getComputedStyle(el);
            return el.getBoundingClientRect().width > 0 && s.display !== "none" && s.visibility !== "hidden";
          })
          .map((el) => el.textContent.trim() || "menu button"),
      );
    await toTop(page);
    const over = await shown();
    await toWork(page);
    const after = await shown();
    await toTop(page);
    const want = profile.width > 760 ? NAV.map((n) => n.label) : ["menu button"];
    return { pass: over.length === 0 && JSON.stringify(after) === JSON.stringify(want), detail: `over the film [${over.join(", ")}]; after it [${after.join(", ")}]` };
  });
  if (profile.width > 760)
    await check(`${tag}  header: the highlighted link follows the section at mid screen, none over the intro`, async () => {
      const seen = [];
      for (const n of [...NAV, { href: "#intro", label: "none" }]) {
        await page.evaluate((id) => {
          const el = document.getElementById(id);
          window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + 200 - innerHeight / 2, behavior: "instant" });
        }, n.href.slice(1));
        await page.waitForTimeout(400);
        const cur = await page.evaluate(() => document.querySelector('.nav-link[aria-current="page"]')?.textContent ?? "none");
        seen.push(`${n.href} ${cur}${cur === n.label ? "" : " (want " + n.label + ")"}`);
      }
      return { pass: seen.every((x) => !x.includes("want")), detail: seen.join(", ") };
    });
  await check(`${tag}  header never overlaps a showing caption at the middle of any hold`, async () => {
    await waitReady(page);
    const lines = [];
    let bad = 0;
    for (const h of HOLDS) {
      await scrollToScreens(page, h.mid);
      const head = await page.$eval(".header", (el) => el.getBoundingClientRect().toJSON());
      const caps = (await captionStates(page)).filter((c) => c.opacity > 0.01);
      const hit = caps.filter((c) => c.rect.top < head.bottom && c.rect.bottom > head.top && c.rect.left < head.right && c.rect.right > head.left);
      if (hit.length || !caps.length) bad++;
      lines.push(`${h.id}: header 0..${Math.round(head.bottom)}, caption ${caps.map((c) => `${c.id} ${Math.round(c.rect.top)}..${Math.round(c.rect.bottom)}`).join(" ") || "none showing"}`);
    }
    await page.screenshot({ path: path.join(OUT, `header-delivery-${profile.tag}.png`) });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    return { pass: bad === 0, detail: lines.join("; ") };
  });
}

async function caseChecks(page, c, tag, profile, shot) {
  const main = "main";
  await check(`${tag}  ${c.slug}: h1, tab title, fact row`, async () => {
    const h1 = await page.locator("h1").allInnerTexts();
    const title = await page.title();
    const text = await textOf(page, main);
    const missing = [c.company, c.role, c.year, c.result, ...c.stack].filter((s) => !text.includes(s));
    return {
      pass: h1.length === 1 && h1[0] === c.title && title === `${c.title} · Aminat Moldalieva` && !missing.length,
      detail: `h1 ${JSON.stringify(h1)}; title "${title}"; missing [${missing.join(" | ")}]`,
    };
  });
  await check(`${tag}  ${c.slug}: the five headings, in order, over the case copy`, async () => {
    const h2 = await page.locator(`${main} h2`).allInnerTexts();
    const text = await textOf(page, main);
    const items = await page.locator(`${main} section:has(> h2:text-is("What I did")) li`).allInnerTexts();
    const copy = [c.problem, c.decision, c.outcome, c.next, ...c.did];
    const missing = copy.filter((s) => !text.includes(s));
    const listOk = JSON.stringify(items) === JSON.stringify(c.did);
    return { pass: JSON.stringify(h2) === JSON.stringify(HEADINGS) && !missing.length && listOk, detail: `h2 ${JSON.stringify(h2)}; list ${items.length}/${c.did.length}; missing ${missing.length}` };
  });
  await check(`${tag}  ${c.slug}: one drawn diagram, a main path, readable text`, async () => {
    const d = await page.evaluate((min) => {
      const svgs = Array.from(document.querySelectorAll("main figure svg"));
      const svg = svgs[0];
      if (!svg) return { n: 0 };
      const sizes = Array.from(svg.querySelectorAll("text")).map((t) => parseFloat(getComputedStyle(t).fontSize) * t.getScreenCTM().a);
      const r = svg.getBoundingClientRect();
      return {
        n: svgs.length,
        role: svg.getAttribute("role"),
        label: (svg.getAttribute("aria-label") || "").length,
        paths: svg.querySelectorAll(".case-diagram-path").length,
        texts: sizes.length,
        smallest: Math.min(...sizes),
        height: r.height,
        pics: document.querySelectorAll("main img, main picture, main video").length,
      };
    });
    return {
      pass: d.n === 1 && d.role === "img" && d.label > 10 && d.paths >= 1 && d.texts >= 3 && d.smallest >= MIN_DIAGRAM_TEXT && d.height > 100 && d.pics === 0,
      detail: `${d.n} svg, role ${d.role}, label ${d.label} chars, ${d.paths} main path(s), ${d.texts} labels, smallest ${d.smallest?.toFixed?.(1)}px, ${Math.round(d.height)}px tall, ${d.pics} pictures`,
    };
  });
  await check(`${tag}  ${c.slug}: a link back to the work section`, async () => {
    const n = await page.locator(`${main} a[href="/#work"]`).count();
    return { pass: n >= 1, detail: `${n} link(s) to /#work` };
  });
  await check(`${tag}  ${c.slug}: every word visible, no sideways scroll, no em dashes`, async () => {
    const bad = await unseenText(page, main);
    const o = await sidewaysBy(page, main);
    const t = await textOf(page, main);
    return {
      pass: bad.length === 0 && o.bad.length === 0 && o.scrollW <= o.W && !t.includes("—"),
      detail: `unseen [${bad.join(" | ")}]; scrollWidth ${o.scrollW} / ${o.W}; past [${o.bad.join(", ")}]`,
    };
  });
  if (shot) await page.screenshot({ path: path.join(OUT, `case-${c.slug}-${profile.tag}.png`), fullPage: true });
}

async function pageRun(profile, js) {
  const tag = `${profile.tag} js=${js ? "on " : "off"}`;
  await withPage({ ...profile, javaScriptEnabled: js }, async (page) => {
    page.setDefaultTimeout(T);
    await homeChecks(page, tag, profile, js);
    await headerChecks(page, tag, profile, js);
    await introChecks(page, tag, js);
    await plainChecks(page, tag, "#intro", js);
    await plainChecks(page, tag, STRIP, js);
    if (js) await shot(page, "#intro", `intro-${profile.tag}.png`);
    if (js) await shot(page, STRIP, `numbers-${profile.tag}.png`);
    await experienceChecks(page, tag);
    await plainChecks(page, tag, "#experience", js);
    await closingChecks(page, tag);
    for (const id of ["#projects", "#about", "#contact"]) {
      await plainChecks(page, tag, id, js);
      if (js) await shot(page, id, `${id.slice(1)}-${profile.tag}.png`);
    }
    if (js) await shot(page, "#experience", `experience-${profile.tag}.png`);

    // Real navigation: click the first card's link, land on its page.
    const first = CASES[0];
    await check(`${tag}  clicking "Read the case" opens /work/${first.slug}`, async () => {
      await page.locator(`#case-${first.slug}`).getByRole("link", { name: /Read the case/ }).click();
      await page.waitForURL(`**/work/${first.slug}`, { timeout: T });
      await page.waitForSelector("main h1", { timeout: T });
      return { pass: true, detail: page.url() };
    });
    for (const [i, c] of CASES.entries()) {
      if (i > 0) {
        const res = await page.goto(`${BASE}/work/${c.slug}`, { waitUntil: "load", timeout: T });
        if (res.status() !== 200) record(`${tag}  ${c.slug}: page status`, false, String(res.status()));
      }
      await caseChecks(page, c, tag, profile, js && i === 0);
    }
    if (js) {
      await check(`${tag}  the back link returns to #work`, async () => {
        await page.locator('main a[href="/#work"]').first().click();
        await page.waitForURL("**/#work", { timeout: T });
        await page.waitForFunction(() => document.getElementById("work")?.getBoundingClientRect().top < 160, null, { timeout: 8000 });
        return { pass: true, detail: page.url() };
      });
    }
    await check(`${tag}  /work/unknown answers HTTP 404`, async () => {
      const res = await page.goto(`${BASE}/work/unknown`, { waitUntil: "load", timeout: T });
      return { pass: res.status() === 404, detail: String(res.status()) };
    });
  }).catch((e) => record(`${tag}  page run`, false, String(e).split("\n")[0]));
}

(async () => {
  console.log(`section checks, screenshots in ${OUT}`);
  for (const profile of PROFILES) {
    await pageRun(profile, true);
    await pageRun(profile, false);
    await reducedMotionStrip(profile);
  }
  const failed = results.filter((r) => !r.pass).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exit(failed ? 1 : 0);
})();
