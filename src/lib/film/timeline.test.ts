import { test } from "node:test";
import assert from "node:assert/strict";
import { FILM_SEGMENTS as S, FILM_DURATION, CRYSTAL_FROM, totalScreens, filmTimeAt, captionStrengths, smoothToward, crystalSwing } from "./timeline.ts";

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

test("the crystal swing starts and ends on the film's last frame and never leaves the crystal", () => {
  assert.equal(crystalSwing(0), FILM_DURATION);
  assert.equal(crystalSwing(1), FILM_DURATION);
  assert.ok(Math.abs(crystalSwing(0.5) - CRYSTAL_FROM) < 1e-9);
  for (let p = -0.5; p <= 1.5; p += 0.01) {
    const t = crystalSwing(p);
    assert.ok(t >= CRYSTAL_FROM - 1e-9 && t <= FILM_DURATION + 1e-9);
  }
});
