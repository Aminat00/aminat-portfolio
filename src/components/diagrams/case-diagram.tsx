"use client";

import { useRef, type ReactNode } from "react";
import { useScrollProgress } from "@/components/motion/use-scroll-progress";

// One small drawing per case: thin ice-blue lines and nodes on the dark page, labels in the
// code font, general terms only. Each drawing is sized so its labels stay near 11px or more
// on a 390px screen. The flow lines carry `case-diagram-path` (pathLength 1) and draw
// themselves as the drawing comes up the screen; the arrowheads (`.cd-head`) arrive as the
// lines finish. With JavaScript off or reduced motion the drawing is simply whole. Styles: globals.css.

// Label size is 16 drawing units (.cd-text in globals.css). The code font advances 0.6 em, so
// a label of n characters is about 9.6n units wide; each box below leaves 8 or more either side.

function Drawing({ w, h, label, children }: { w: number; h: number; label: string; children: ReactNode }) {
  const ref = useRef<SVGSVGElement>(null);
  useScrollProgress(ref, 0.9, 0.5, (p) => {
    const svg = ref.current;
    if (!svg) return;
    // pathLength 1: a dash one unit long, offset by what is still to draw.
    svg.querySelectorAll<SVGPathElement>(".case-diagram-path").forEach((path) => {
      path.style.strokeDasharray = "1";
      path.style.strokeDashoffset = (1 - p).toFixed(4);
    });
    const heads = svg.querySelector<SVGGElement>(".cd-heads");
    if (heads) heads.style.opacity = Math.min(1, Math.max(0, (p - 0.85) / 0.15)).toFixed(3);
  });
  // maxWidth keeps the labels near 18px on a wide screen instead of growing with the column.
  return (
    <svg ref={ref} className="case-diagram" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label} style={{ maxWidth: w * 1.15 }}>
      {children}
    </svg>
  );
}

/** A labelled box centred on (cx, cy). */
function Node({ cx, cy, w, text, strong, h = 52 }: { cx: number; cy: number; w: number; text: string; strong?: boolean; h?: number }) {
  return (
    <g>
      <rect className={strong ? "cd-box cd-box-strong" : "cd-box"} x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={10} />
      <text className="cd-text" x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
        {text}
      </text>
    </g>
  );
}

/** An arrowhead whose tip is at (x, y); deg 0 points right, 90 down, 180 left, 270 up. */
const Head = ({ x, y, deg }: { x: number; y: number; deg: number }) => (
  <path className="cd-head" d="M-7 -6 L0 0 L-7 6" transform={`translate(${x} ${y}) rotate(${deg})`} />
);

const Flow = ({ d }: { d: string }) => <path className="case-diagram-path" pathLength={1} d={d} />;

/**
 * Website, one workflow, three outputs, and the status creators see.
 * Columns (left to right): Website 0-90, workflow 140-270, outputs 320-480.
 */
function DaysToMinutes() {
  return (
    <Drawing w={480} h={280} label="From a website, through one workflow, to a payment link, a customer system and a finance task, with status for creators">
      <Flow d="M90 94 H138 M270 94 C295 94 295 24 318 24 M270 94 H318 M270 94 C295 94 295 164 318 164" />
      <path className="cd-quiet" d="M205 120 V222" />
      <g className="cd-heads">
        <Head x={138} y={94} deg={0} />
        <Head x={318} y={24} deg={0} />
        <Head x={318} y={94} deg={0} />
        <Head x={318} y={164} deg={0} />
        <Head x={205} y={224} deg={90} />
      </g>
      <Node cx={45} cy={94} w={90} text="Website" />
      <Node cx={205} cy={94} w={130} text="One workflow" strong />
      <Node cx={400} cy={24} w={160} text="Payment link" h={48} />
      <Node cx={400} cy={94} w={160} text="Customer system" h={48} />
      <Node cx={400} cy={164} w={160} text="Finance task" h={48} />
      <Node cx={205} cy={252} w={206} text="Status for creators" />
    </Drawing>
  );
}

/** A check that repeats, against production, with an alert when it fails. */
function UnderFiveMinutes() {
  return (
    <Drawing w={480} h={160} label="A loop: check every 5 minutes against production, with an alert on failure">
      <Flow d="M135 52 V106 M60 134 H22 Q2 134 2 114 V46 Q2 26 22 26 H38" />
      <Flow d="M210 134 H288" />
      <g className="cd-heads">
        <Head x={135} y={106} deg={90} />
        <Head x={38} y={26} deg={0} />
        <Head x={288} y={134} deg={0} />
      </g>
      <Node cx={135} cy={26} w={190} text="Check every 5 min" />
      <Node cx={135} cy={134} w={150} text="Production" />
      <Node cx={380} cy={134} w={180} text="Alert on failure" strong />
    </Drawing>
  );
}

/** Three screens, each finished with its tests before it goes out, then on to release. */
function MobileRebuild() {
  const xs = [68, 240, 412]; // screen centres
  return (
    <Drawing w={480} h={212} label="Three screens, each shipped with its tests, one by one to release">
      <Flow d={xs.map((x) => `M${x} 112 V158`).join(" ")} />
      <g className="cd-heads">
        {xs.map((x) => (
          <Head key={x} x={x} y={160} deg={90} />
        ))}
      </g>
      {xs.map((x, i) => (
        <g key={x}>
          <rect className="cd-box" x={x - 68} y={0} width={136} height={112} rx={14} />
          <rect className="cd-notch" x={x - 12} y={10} width={24} height={4} rx={2} />
          <text className="cd-text" x={x} y={46} textAnchor="middle" dominantBaseline="central">
            {`Screen ${i + 1}`}
          </text>
          <g transform={`translate(${x - 29} 86)`}>
            <circle className="cd-tick-ring" r={10} />
            <path className="cd-tick" d="M-4.5 0.5 L-1.5 3.5 L4.5 -3.5" />
          </g>
          <text className="cd-text" x={x - 14} y={86} dominantBaseline="central">
            Tests
          </text>
        </g>
      ))}
      <rect className="cd-box cd-box-strong" x={0} y={162} width={480} height={50} rx={10} />
      <text className="cd-text" x={240} y={187} textAnchor="middle" dominantBaseline="central">
        Release
      </text>
    </Drawing>
  );
}

const DRAWINGS: Record<string, () => JSX.Element> = {
  "days-to-minutes": DaysToMinutes,
  "under-five-minutes": UnderFiveMinutes,
  "mobile-rebuild": MobileRebuild,
};

export function CaseDiagram({ slug }: { slug: string }) {
  const Drawn = DRAWINGS[slug];
  return Drawn ? <Drawn /> : <></>;
}
