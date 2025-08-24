"use client";

import * as React from "react";
import { motion } from "framer-motion";

type Props = {
  text?: string;
  className?: string;

  // Motion / layout
  intensity?: number;            // travel distance (px) for letters + code
  opacityClass?: string;         // code color (e.g., "text-white/25")
  laneHeightEm?: number;         // lane height (vertical spacing)
  laneWidthCh?: number;          // lane width (clips long horizontal lines)
  lanesGapEm?: number;           // extra gap between lanes

  // Timing
  typeSpeedChPerSec?: number;    // typing speed (chars/sec)
  deleteSpeedChPerSec?: number;  // deleting speed (chars/sec)
  slideMs?: number;              // slide leg duration (ms)
  letterMs?: number;             // letter explode/implode duration (ms)
};

// Long, linear lines (DS-flavored)
const HORIZ_LINES = [
  "import pandas as pd    df = pd.read_csv('golf_stats.csv')",
  "X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2)",
  "model = RandomForestClassifier(n_estimators=300, random_state=42)",
];

const VERT_LINES = [
  "df.groupby('hole')['strokes'].mean()",
  "statsmodels.api.OLS(y, X).fit().summary()",
  "precision_at_k(y_te, y_prob, k=0.10)",
];

/**
 * Build keyframes so the visible segment:
 *   - "types" (grows), then "backspaces" (shrinks) at equal rate,
 *   - while sliding LEFT (horizontal) or UP (vertical).
 * The caret is kept at the leading edge via flex-reverse / column-reverse.
 */
function buildTrackKF(opts: {
  n: number;                 // characters in the line
  direction: "left" | "up";  // one-way directions
  baseOffset: number;        // px slide distance
  typeSec: number;           // typing duration (s)
  deleteSec: number;         // deleting duration (s)
  slideSec: number;          // slide duration (s)
  exploding: boolean;        // hover=true explode out, false implode in
}) {
  const { n, direction, baseOffset, typeSec, deleteSec, slideSec, exploding } = opts;

  // Slide targets
  const offsetX = direction === "left" ? -baseOffset : 0;
  const offsetY = direction === "up" ? -baseOffset : 0;

  // Timeline: type → delete → slide
  const total = typeSec + deleteSec + slideSec;
  const t1 = typeSec / total;               // end of type
  const t2 = (typeSec + deleteSec) / total; // end of delete

  // The "visible length" keyframes (in ch), regardless of direction:
  const sizeFrames = ["0ch", `${n}ch`, "0ch"];

  // Position over time. For explosion: center→off; for implosion: off→center.
  const xFrames = exploding ? [0, 0, offsetX] : [offsetX, 0, 0];
  const yFrames = exploding ? [0, 0, offsetY] : [offsetY, 0, 0];

  // Visible during type+delete; fade on slide leg.
  const opacityFrames = exploding ? [1, 1, 0] : [0, 1, 0];

  return {
    sizeFrames,
    xFrames,
    yFrames,
    opacityFrames,
    times: [0, t1, t2],
    duration: total,
  };
}

/**
 * A single lane that renders a line which:
 *  - grows (types) then shrinks (deletes) at equal rate,
 *  - slides along the lane (left/up),
 *  - caret is on the leading edge of motion,
 *  - clipped so it won't overlap neighbors.
 */
function TrackLine({
  text,
  direction,              // "left" | "up"
  baseOffset,
  laneHeightEm,
  laneWidthCh,
  lanesGapEm,
  opacityClass,
  typeSpeedChPerSec,
  deleteSpeedChPerSec,
  slideMs,
  exploding,
  vertical,
  burstId,                // remount sync token
}: {
  text: string;
  direction: "left" | "up";
  baseOffset: number;
  laneHeightEm: number;
  laneWidthCh: number;
  lanesGapEm: number;
  opacityClass: string;
  typeSpeedChPerSec: number;
  deleteSpeedChPerSec: number;
  slideMs: number;
  exploding: boolean;
  vertical: boolean;
  burstId: number;
}) {
  const n = text.length;
  const typeSec   = Math.max(0.12, n / typeSpeedChPerSec);
  const deleteSec = Math.max(0.12, n / deleteSpeedChPerSec);
  const slideSec  = Math.max(0.18, slideMs / 1000);

  const { sizeFrames, xFrames, yFrames, opacityFrames, times, duration } = buildTrackKF({
    n,
    direction,
    baseOffset,
    typeSec,
    deleteSec,
    slideSec,
    exploding,
  });

  const laneStyle: React.CSSProperties = vertical
    ? { height: `${laneHeightEm}em`, width: `${Math.min(laneWidthCh, 10)}ch`, overflow: "hidden", margin: `${lanesGapEm}em` }
    : { height: `${laneHeightEm}em`, maxWidth: `${laneWidthCh}ch`, overflow: "hidden", margin: `${lanesGapEm}em 0` };

  // Flex-reverse keeps the caret on the leading edge of motion.
  const flexDir =
    direction === "left" ? "flex-row-reverse" : "flex-col-reverse";

  // Animate width for horizontal, height for vertical.
  const sizeProp = vertical ? "height" : "width";

  return (
    <div style={laneStyle}>
      <motion.span
        key={burstId} // remount for perfect sync
        className={`inline-flex ${flexDir} items-center font-mono ${opacityClass} text-[0.32em] md:text-[0.28em] ${vertical ? "" : "whitespace-nowrap"}`}
        style={{ writingMode: vertical ? ("vertical-rl" as any) : undefined }}
        initial={{ x: 0, y: 0, opacity: exploding ? 1 : 0, [sizeProp]: "0ch" } as any}
        animate={{
          x: xFrames,
          y: yFrames,
          opacity: opacityFrames,
          [sizeProp]: sizeFrames,
        } as any}
        transition={{ duration, times, ease: "linear" }}
        aria-hidden
      >
        {/* Visible content clipped by size */}
        <span aria-hidden className={`${vertical ? "" : "whitespace-nowrap"}`}>{text}</span>
        {/* Leading-edge caret */}
        <span
          aria-hidden
          className={`inline-block bg-current opacity-70 ${vertical ? "w-[0.55ch] h-[1.15em]" : "h-[1.15em] w-[0.55ch]"}`}
          style={vertical ? { translate: "0 0.08em" } : { translate: "0 0.08em" }}
        />
      </motion.span>
    </div>
  );
}

export default function NameCodeExplode({
  text = "Canyen Palmer",
  className = "text-5xl md:text-7xl font-extrabold tracking-tight",
  intensity = 80,                 // bigger throw looks more explosive
  opacityClass = "text-white/25",
  laneHeightEm = 1.5,
  laneWidthCh = 46,
  lanesGapEm = 0.6,
  typeSpeedChPerSec = 34,
  deleteSpeedChPerSec = 34,       // same rate in/out
  slideMs = 300,                  // slide leg
  letterMs = 300,                 // letters timing matches slide by default
}: Props) {
  const [hovered, setHovered] = React.useState(false);
  const [burstId, setBurstId] = React.useState(0);

  // Flip key so ALL pieces restart in the same frame on every enter/leave
  React.useEffect(() => {
    setBurstId((n) => n + 1);
  }, [hovered]);

  // Letters explode only LEFT or UP to match tracks (alt: left, up, left, up…)
  const letterOffsets = React.useMemo(() => {
    return [...text].map((_, i) => (i % 2 === 0 ? { x: -intensity, y: 0 } : { x: 0, y: -intensity }));
  }, [text, intensity]);

  // Clip padding so nothing spills into neighbors
  const pad = Math.round(intensity + 18);

  return (
    <div
      className={`relative inline-block select-none ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      role="img"
      aria-label={text}
      tabIndex={0}
    >
      {/* NAME — letters explode/implode in exact sync */}
      <span aria-hidden className="relative inline-block">
        {[...text].map((ch, i) =>
          ch === " " ? (
            <span key={`sp-${i}`} className="inline-block w-[0.4em]" />
          ) : (
            <motion.span
              key={`ch-${i}-${ch}-${burstId}`}
              className="inline-block"
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={
                hovered
                  ? { x: letterOffsets[i].x, y: letterOffsets[i].y, opacity: 0 }
                  : { x: 0, y: 0, opacity: 1 }
              }
              transition={{ type: "tween", duration: letterMs / 1000 }}
            >
              {ch}
            </motion.span>
          )
        )}
      </span>

      {/* CODE FLARE — left (horizontal) + up (vertical), clipped & centered */}
      <div
        className="pointer-events-none absolute"
        style={{ left: -pad, right: -pad, top: -pad, bottom: -pad, overflow: "hidden" }}
      >
        {/* Horizontal LEFT lanes (stacked vertically) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
          {HORIZ_LINES.map((line, i) => (
            <TrackLine
              key={`h-${i}`}
              text={line}
              direction="left"
              baseOffset={intensity * 1.25}
              laneHeightEm={laneHeightEm}
              laneWidthCh={laneWidthCh}
              lanesGapEm={lanesGapEm}
              opacityClass={opacityClass}
              typeSpeedChPerSec={typeSpeedChPerSec}
              deleteSpeedChPerSec={deleteSpeedChPerSec}
              slideMs={slideMs}
              exploding={hovered}
              vertical={false}
              burstId={burstId}
            />
          ))}
        </div>

        {/* Vertical UP lanes (laid out horizontally) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          {VERT_LINES.map((line, i) => (
            <TrackLine
              key={`v-${i}`}
              text={line}
              direction="up"
              baseOffset={intensity * 1.25}
              laneHeightEm={laneHeightEm}
              laneWidthCh={laneWidthCh}
              lanesGapEm={lanesGapEm}
              opacityClass={opacityClass}
              typeSpeedChPerSec={typeSpeedChPerSec}
              deleteSpeedChPerSec={deleteSpeedChPerSec}
              slideMs={slideMs}
              exploding={hovered}
              vertical
              burstId={burstId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
