import { test } from "node:test";
import assert from "node:assert/strict";
import * as site from "./site.ts";

const all = JSON.stringify(site);

test("no em dashes, vendor names, retired copy or removed projects", () => {
  for (const bad of ["—", "n8n", "Six years", "Coming soon", "Interview Coach", "7 hours", "7 hrs", "release automation"])
    assert.ok(!all.includes(bad), `found "${bad}"`);
});

test("LaunchGood is named in the intro, the delivery caption and on every case", () => {
  assert.match(site.INTRO.text, /LaunchGood/);
  assert.match(site.CAPTIONS.delivery.line ?? "", /LaunchGood/);
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
