/**
 * Client helpers for the scroll film: load the whole file into memory, keep one
 * seek in flight, and unlock seeking on iOS.
 */

/** Fetches the whole film and returns an object URL, so seeking never depends on byte-range support. */
export async function loadFilmBlob(url: string, signal: AbortSignal): Promise<string> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`film fetch failed: ${res.status}`);
  const blob = await res.blob();
  signal.throwIfAborted();
  return URL.createObjectURL(blob);
}

/**
 * The one writer of `video.currentTime`. One seek in flight at a time; while it
 * runs, only the newest target is kept. Targets closer than `minDelta` seconds
 * to the last one are ignored. A seek asked for before the metadata loads is
 * held until it does. Aborting `signal` removes its listeners.
 */
export function createSeekGate(video: HTMLVideoElement, minDelta: number, signal?: AbortSignal): (time: number) => void {
  let busy = false;
  let pending: number | null = null;
  let last = NaN;

  const seek = (time: number) => {
    if (busy || video.readyState < HTMLMediaElement.HAVE_METADATA) {
      pending = time;
      return;
    }
    const t = Number.isFinite(video.duration) ? Math.min(Math.max(0, time), video.duration - 0.02) : Math.max(0, time);
    if (Math.abs(t - last) < minDelta) return;
    busy = true;
    last = t;
    video.currentTime = t;
  };
  const flush = () => {
    busy = false;
    if (pending === null) return;
    const t = pending;
    pending = null;
    seek(t);
  };
  const opts = { signal };
  video.addEventListener("loadedmetadata", flush, opts);
  video.addEventListener("seeked", flush, opts);
  video.addEventListener(
    "error",
    () => {
      busy = false;
      pending = null;
    },
    opts,
  );
  // Playback (the iOS unlock plays, then pauses) moves currentTime behind the
  // gate's back: forget the last target, so it is written again, and go back to it.
  video.addEventListener(
    "pause",
    () => {
      const t = pending ?? last;
      last = NaN;
      if (!Number.isNaN(t)) seek(t);
    },
    opts,
  );
  return seek;
}

/** iOS only allows seeking after playback was started by a gesture: play, then pause, on the first touch. */
export function unlockOnFirstTouch(video: HTMLVideoElement): () => void {
  const onTouch = () => {
    window.removeEventListener("touchstart", onTouch);
    video
      .play()
      .then(() => video.pause())
      .catch(() => {});
  };
  window.addEventListener("touchstart", onTouch, { passive: true });
  return () => window.removeEventListener("touchstart", onTouch);
}
