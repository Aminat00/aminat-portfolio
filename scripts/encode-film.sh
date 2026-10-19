#!/usr/bin/env bash
# Encodes the master film into web files. Run from the repo root: bash scripts/encode-film.sh
# Needs ffmpeg (libx264) and cwebp. Safe to re-run: every output is overwritten.
set -euo pipefail

SRC="${SRC:-../review/seam/final-1080p.mp4}"
OUT=public/film
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

[ -f "$SRC" ] || { echo "master film not found: $SRC" >&2; exit 1; }
mkdir -p "$OUT"

ff() { ffmpeg -hide_banner -loglevel error -y "$@"; }

# Dense keyframes (-g) so the browser can seek backward cheaply while scrolling.
enc() { # <vf> <crf> <gop> <out>
  ff -i "$SRC" -an -vf "$1" -c:v libx264 -preset slow -crf "$2" -pix_fmt yuv420p \
    -g "$3" -keyint_min "$3" -sc_threshold 0 -movflags +faststart "$4"
}
enc "unsharp=5:5:0.8" 20 8 "$OUT/desktop.mp4"
enc "crop=1344:1080,scale=720:-2,unsharp=5:5:0.6" 23 4 "$OUT/phone.mp4"

# A still from a video, written as WebP: <video> <ffmpeg seek args, or "-"> <out.webp>
still() {
  if [ "$2" = "-" ]; then
    ff -i "$1" -frames:v 1 "$TMP/f.png"
  else
    ff -sseof -0.1 -i "$1" -update 1 "$TMP/f.png" # keeps overwriting, so the last frame wins
  fi
  cwebp -quiet -q 82 "$TMP/f.png" -o "$3"
  rm -f "$TMP/f.png"
}
still "$OUT/desktop.mp4" - "$OUT/poster-desktop.webp"
still "$OUT/phone.mp4"   - "$OUT/poster-phone.webp"
still "$OUT/desktop.mp4" end "$OUT/end-desktop.webp"
still "$OUT/phone.mp4"   end "$OUT/end-phone.webp"

# Share image: last desktop frame, centre-cropped to 1200:630 ratio.
ff -sseof -0.1 -i "$OUT/desktop.mp4" -update 1 \
  -vf "crop=1920:1008,scale=1200:630" -q:v 3 public/og.jpg

# Edge colour: the poster's outer 16 px frame, averaged to one pixel. The page uses
# this as its background so the film has no visible border. Left/right strips are
# transposed so all four share a height of 16 and can be stacked side by side.
rgb="$(ff -i "$OUT/poster-desktop.webp" -filter_complex "
  [0]split=4[a][b][c][d];
  [a]crop=1920:16:0:0[top];
  [b]crop=1920:16:0:1064[bot];
  [c]crop=16:1048:0:16,transpose=1[left];
  [d]crop=16:1048:1904:16,transpose=1[right];
  [top][bot][left][right]hstack=inputs=4,scale=1:1:flags=area" \
  -frames:v 1 -f rawvideo -pix_fmt rgb24 - | od -An -tx1 | tr -d ' \n')"
echo "edge #$rgb"
