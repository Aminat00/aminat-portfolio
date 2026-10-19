"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { FADE, FILM_SEGMENTS, captionStrengths, crystalSwing, filmTimeAt, smoothToward, totalScreens, type CaptionId } from "@/lib/film/timeline";
import { CAPTIONS, LINKS } from "@/content/site";
import { ArrowIcon } from "@/components/icons";
import { createSeekGate, loadFilmBlob, unlockOnFirstTouch } from "./film-loader";

const FILM = {
  desktop: { video: "/film/desktop.mp4", poster: "/film/poster-desktop.webp", end: "/film/end-desktop.webp" },
  phone: { video: "/film/phone.mp4", poster: "/film/poster-phone.webp", end: "/film/end-phone.webp" },
};
// Phones and tall windows get phone.mp4, a centre crop, and the phone layout (the same
// query sits in globals.css). The film is picked once, at load: a resize never swaps it.
const PHONE = "(max-width: 760px), (max-aspect-ratio: 4/5)";
const REDUCED = "(prefers-reduced-motion: reduce)";
const REDUCED_PHONE = PHONE.split(", ").map((q) => `${REDUCED} and ${q}`).join(", ");
const RISE = 12; // px a caption rises while it fades in
const IDS = Object.keys(CAPTIONS) as CaptionId[];
const PINNED_SCREENS = totalScreens(); // the film's scroll, in screens; the stage is one screen longer
// The break, in film seconds: after the ownership hold, before the crystal's.
const BREAK = [FILM_SEGMENTS.find((s) => s.caption === "ownership")!.to, FILM_SEGMENTS.find((s) => s.caption === "delivery")!.from];

const fireReady = () => {
  (window as Window & { __ready?: boolean }).__ready = true;
};

/**
 * The opening film, full screen, and the crystal behind the rest of the page. One
 * loop owns everything: the scroll, smoothed, becomes screens into the stage;
 * screens become a film time (sent through the seek gate) and one strength per
 * caption (opacity and a small rise). Past the stage the film layer stays fixed
 * behind the sections (globals.css) and the rest of the page swings the crystal's
 * last seconds (crystalSwing). The loop runs only while the smoothed scroll is
 * still catching up.
 */
export function FilmStage() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const layer = root.querySelector<HTMLElement>(".film-layer")!;
    const video = root.querySelector("video")!;
    const poster = root.querySelector<HTMLImageElement>(".film-poster")!;
    const html = document.documentElement;

    // ── Reduced motion: layout.tsx sets film-js only when motion is allowed. The
    // still (the end frame, picked by <picture>) and every caption stay as the CSS
    // shows them: no film request, no loop. Ready once the still shows.
    if (!html.classList.contains("film-js")) {
      if (poster.complete) fireReady();
      poster.addEventListener("load", fireReady, { once: true });
      poster.addEventListener("error", fireReady, { once: true });
      return () => {
        poster.removeEventListener("load", fireReady);
        poster.removeEventListener("error", fireReady);
      };
    }

    // The film is picked here, once. data-src keys the film box to it in globals.css,
    // and the poster is pinned to the same file: <picture> alone would re-pick it on
    // resize. (The sources are switched off, not removed, so React's nodes stay put.)
    const film = window.matchMedia(PHONE).matches ? FILM.phone : FILM.desktop;
    root.dataset.src = film === FILM.phone ? "phone" : "desktop";
    root.querySelectorAll("picture > source").forEach((s) => ((s as HTMLSourceElement).media = "not all"));
    poster.src = film.poster;
    const ctrl = new AbortController();
    const caps = IDS.map((id) => ({ id, el: root.querySelector<HTMLElement>(`[data-caption="${id}"]`)!, k: -1 }));
    const seek = createSeekGate(video, film === FILM.phone ? 0.02 : 0.008, ctrl.signal);

    // ── Where the stage is, and where the page ends ─────────────────────
    let top = 0;
    let screen = 1;
    let pageEnd = 1;
    let breaking: boolean | null = null;
    const layout = () => {
      top = root.getBoundingClientRect().top + window.scrollY;
      screen = layer.offsetHeight || window.innerHeight;
      pageEnd = document.documentElement.scrollHeight - window.innerHeight;
    };

    const render = (y: number) => {
      const screens = (y - top) / screen;
      // The stage plays the film to its last frame; the page after it swings the crystal,
      // starting and ending on that same frame (crystalSwing(0) is the film's end).
      const filmEnd = top + PINNED_SCREENS * screen;
      const t = screens < PINNED_SCREENS ? filmTimeAt(screens) : crystalSwing((y - filmEnd) / Math.max(1, pageEnd - filmEnd));
      seek(t);
      // In the break the stacked film's bottom edge gets a taller fade (globals.css).
      const brk = t > BREAK[0] && t < BREAK[1];
      if (brk !== breaking) {
        breaking = brk;
        root.classList.toggle("in-break", brk);
      }
      const k = captionStrengths(screens);
      // The name is readable on the first screen: the intro starts at full
      // strength instead of fading in over the first 0.4 screens.
      if (screens < FADE.lead + FADE.length) k.intro = 1;
      for (const c of caps) {
        const v = Math.round(k[c.id] * 1000) / 1000;
        if (v === c.k) continue;
        c.k = v;
        c.el.style.opacity = String(v);
        c.el.style.transform = `translate3d(0, ${((1 - v) * RISE).toFixed(2)}px, 0)`;
        c.el.toggleAttribute("inert", v === 0);
        if (v === 0) c.el.setAttribute("aria-hidden", "true");
        else c.el.removeAttribute("aria-hidden");
      }
    };

    // ── Dev contract: ?jump=<px> lands there at once ─────────────────────
    const jump = new URLSearchParams(window.location.search).get("jump");
    if (jump !== null) {
      history.scrollRestoration = "manual";
      window.scrollTo({ top: Number(jump) || 0, behavior: "instant" });
    }

    // ── The loop: wakes on scroll, sleeps once the playhead has caught up ─
    let smooth = window.scrollY;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(100, now - last) : 16;
      last = now;
      smooth = smoothToward(smooth, window.scrollY, dt, 150, 2 * window.innerHeight);
      render(smooth);
      if (smooth !== window.scrollY) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    const wake = () => {
      if (!raf && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const sleep = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    };
    const onResize = () => {
      layout();
      wake();
    };
    const onVisibility = () => (document.hidden ? sleep() : wake());

    layout();
    render(smooth);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    // Fonts landing late change the page's length, and so the swing's.
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    // The film layer covers the screen from here on, so the fixed .env glow behind it is
    // never seen: hidden, it is not repainted under every new film frame.
    html.classList.add("film-covers");

    // ── Loading: poster first, then the whole film as a Blob ────────────
    let objectUrl: string | null = null;
    let unlock = () => {};
    let started = false;
    const onFirstFrame = () => {
      root.classList.add("is-live");
      fireReady();
    };
    // A film that will not decode: the poster comes back and stays, and the
    // captions keep following the scroll.
    const onFilmError = () => {
      root.classList.remove("is-live");
      fireReady();
    };
    video.addEventListener("error", onFilmError);
    const startFilm = () => {
      window.clearTimeout(posterTimer);
      if (started) return;
      started = true;
      loadFilmBlob(film.video, ctrl.signal)
        .then((url) => {
          if (ctrl.signal.aborted) return URL.revokeObjectURL(url);
          objectUrl = url;
          video.addEventListener("seeked", onFirstFrame, { once: true });
          video.src = url;
          unlock = unlockOnFirstTouch(video);
        })
        .catch(() => {
          // The poster stays and the captions keep following the scroll.
          if (!ctrl.signal.aborted) fireReady();
        });
    };
    const posterTimer = window.setTimeout(startFilm, 4000);
    if (poster.complete) startFilm();
    else {
      poster.addEventListener("load", startFilm, { once: true });
      poster.addEventListener("error", startFilm, { once: true });
    }

    return () => {
      ctrl.abort();
      window.clearTimeout(posterTimer);
      poster.removeEventListener("load", startFilm);
      poster.removeEventListener("error", startFilm);
      sleep();
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      video.removeEventListener("seeked", onFirstFrame);
      video.removeEventListener("error", onFilmError);
      unlock();
      html.classList.remove("film-covers");
      if (objectUrl) {
        video.removeAttribute("src");
        video.load();
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  return (
    <section
      id="top"
      className="film"
      ref={rootRef}
      aria-label="Intro"
      style={{ "--film-screens": PINNED_SCREENS + 1 } as CSSProperties}
    >
      <div className="film-layer">
        <video className="film-video" muted playsInline preload="auto" disablePictureInPicture aria-hidden="true" tabIndex={-1} />
        {/* A plain img: the poster must paint first, at high priority, under the caption layer.
            Reduced motion shows the end frame instead; phones get their own crop. */}
        <picture>
          <source media={REDUCED_PHONE} srcSet={FILM.phone.end} />
          <source media={REDUCED} srcSet={FILM.desktop.end} />
          <source media={PHONE} srcSet={FILM.phone.poster} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="film-poster" src={FILM.desktop.poster} alt="" width={1920} height={1080} fetchPriority="high" />
        </picture>
        <div className="film-captions">
          {IDS.map((id) => {
            const c = CAPTIONS[id];
            const Title = id === "intro" ? "h1" : "h2";
            return (
              <div className="film-caption" data-caption={id} key={id}>
                {c.eyebrow && (
                  <p className="eyebrow">
                    {/* Wraps after the dot, never inside "AI & Workflow Automation". */}
                    {c.eyebrow.split(/(?<=·) /).map((part, i) => (
                      <Fragment key={i}>
                        {i > 0 && " "}
                        <span>{part}</span>
                      </Fragment>
                    ))}
                  </p>
                )}
                <Title className={`film-title film-title-${id === "intro" ? "name" : "line"}`}>
                  {/* Each sentence wraps as one unit: "Many messy parts." / "One system that works." */}
                  {c.title.split(/(?<=\.) /).map((sentence, i) => (
                    <Fragment key={i}>
                      {i > 0 && " "}
                      <span>{sentence}</span>
                    </Fragment>
                  ))}
                </Title>
                {c.line && <p className="film-line">{c.line}</p>}
                {c.ctas && (
                  <div className="film-ctas">
                    <a href={LINKS.email} className="btn btn-primary">
                      Email me
                    </a>
                    <a href={LINKS.resume} className="btn btn-secondary">
                      Résumé
                    </a>
                  </div>
                )}
                {c.proofLink && (
                  <a href="#work" className="film-proof">
                    See the proof <ArrowIcon size={13} style={{ transform: "rotate(90deg)" }} />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
