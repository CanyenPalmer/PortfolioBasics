"use client";

import * as React from "react";
import { motion } from "framer-motion";

type Props = {
  text?: string;
  className?: string;

  // Motion / layout
  intensity?: number;            // how far letters + code slide (px)
  opacityClass?: string;         // code color (e.g., "text-white/25")
  laneHeightEm?: number;         // lane height (vertical spacing)
  laneWidthCh?: number;          // lane width (clips long horizontal lines)
  lanesGapEm?: number;           // extra gap between lanes

  // Timing
  typeSpeedChPerSec?: number;    // typing speed
  deleteSpeedChPerSec?: number;  // deleting speed
  slideMs?: number;              // slide duration (ms)
  letterMs?: number;             // letter fly duration (ms)
};

// Long linear lines (DS-flavored)
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

// Build a keyframed spec: type → delete → slide (left or up).
function buildKeyframes(opts: {
  n: number;
  direction: "left" | "up";
  baseOffset: number;
  typeSec: number;
  deleteSec: number;
  slideSec: number;
  exploding: boolean; // true on hover (explode out), false on unhover (implode in)
}) {
  const { n, direction, baseOffset, typeSec, deleteSec, slideSec, exploding } = opts;

  const offsetX = direction === "left" ? -baseOffset : 0;
  const offsetY = direction === "up" ? -baseOffset : 0;

  // timeline parts: type → delete → slide
  const total = typeSec + deleteSec + slideSec;
  const t1 = typeSec / total;
  const t2 = (typeSec + deleteSec) / total;

  const width = ["0ch", `${n}ch`, "0ch"];
  const x = exploding ? [0, 0, offsetX] : [offsetX, 0, 0];
  const y = exploding ? [0, 0, offsetY] : [offsetY, 0, 0];
  // visible during type/delete; fade on slide leg
  const opacity = exploding ? [1, 1, 0] : [0, 1, 0];

  return {
    width,
    x,
    y,
    opacity,
    transition: { duration: total, times: [0, t1, t2], ease: "linear" },
  };
}

function TypingDeletingLine({
  text,
  direction, // "left" | "up"
  baseOffset,
  laneHeightEm,
  laneWidthCh,
  opacityClass,
  typeSpeedChPerSec,
  deleteSpeedChPerSec,
  slideMs,
  exploding,   // true on hover, false on unhover
  vertical = false,
  laneMarginEm,
  burstId,     // ensures perfect sync on re-mount
}: {
  text: string;
  direction: "left" | "up";
  baseOffset: number;
  laneHeightEm: number;
  laneWidthCh: number;
  opacityClass: string;
  typeSpeedChPerSec: number;
  deleteSpeedChPerSec: number;
  slideMs: number;
  exploding: boolean;
  vertical?: boolean;
  laneMarginEm: number;
  burstId: number;
}) {
  const n = text.length;
  const typeSec = Math.max(0.12, n / typeSpeedChPerSec);
  const deleteSec = Math.max(0.10, n / deleteSpeedChPerSec);
  const slideSec = Math.max(0.18, slideMs / 1000);

  const kf = buildKeyframes({
    n,
    direction,
    baseOffset,
    typeSec,
    deleteSec,
    slideSec,
    exploding,
  });

  const laneStyle: React.CSSProperties = vertical
    ? { height: `${laneHeightEm}em`, width: `${Math.min(laneWidthCh, 10)}ch`, overflow: "hidden", margin: `${laneMarginEm}em` }
    : { height: `${laneHeightEm}em`, maxWidth: `${laneWidthCh}ch`, overflow: "hidden", margin: `${laneMarginEm}em 0` };

  return (
    <div style={laneStyle}>
      <motion.span
        key={burstId} // remount on every burst flip to sync start frame
        animate={kf}
        initial={{ x: 0, y: 0, opacity: exploding ? 1 : 0, width: "0ch" }}
        className={`inline-flex items-center font-mono ${opacityClass} text-[0.32em] md:text-[0.28em] ${vertical ? "" : "whitespace-nowrap"}`}
        style={{ writingMode: vertical ? ("vertical-rl" as any) : undefined }}
        aria-hidden
      >
        <span aria-hidden className={`${vertical ? "" : "whitespace-nowrap"}`}>{text}</span>
        <span
          aria-hidden
          className="ml-[1px] inline-block h-[1.15em] w-[0.55ch] align-text-bottom bg-current opacity-70"
          style={{ translate: "0 0.08em" }}
        />
      </motion.span>
    </div>
  );
}

export default function NameCodeExplode({
  text = "Canyen Palmer",
  className = "text-5xl md:text-7xl font-extrabold tracking-tight",
  intensity = 72,
  opacityClass = "text-white/25",
  laneHeightEm = 1.5,
  laneWidthCh = 46,
  lanesGapEm = 0.6,
  typeSpeedChPerSec = 34,
  deleteSpeedChPerSec = 48,
  slideMs = 320,
  letterMs = 320,
}: Props) {
  const [hovered, setHovered] = React.useState(false);
  const [burstId, setBurstId] = React.useState(0);

  // flip burstId so ALL children remount and start at the same frame
  React.useEffect(() => {
    setBurstId((n) => n + 1);
  }, [hovered]);

  // Letters explode only LEFT or UP (matches code directions)
  const letterOffsets = React.useMemo(() => {
    return [...text].map((_, i) => (i % 2 === 0 ? { x: -intensity, y: 0 } : { x: 0, y: -intensity }));
  }, [text, intensity]);

  // Clip padding so typing/slide never hits neighbors
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
      {/* NAME (letters explode/implode in perfect sync via key) */}
      <span aria-hidden className="relative inline-block">
        {[...text].map((ch, i) =>
          ch === " " ? (
            <span key={`sp-${i}`} className="inline-block w-[0.4em]" />
          ) : (
            <motion.span
              key={`ch-${i}-${ch}-${burstId}`} // remount per burst
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

      {/* CODE CLIP BOX — left/up only, no overlap, synced start */}
      <div
        className="pointer-events-none absolute"
        style={{ left: -pad, right: -pad, top: -pad, bottom: -pad, overflow: "hidden" }}
      >
        {/* Horizontal (LEFT) lanes — stacked vertically */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
          {HORIZ_LINES.map((line, i) => (
            <TypingDeletingLine
              key={`h-${i}`}
              text={line}
              direction="left"
              baseOffset={intensity * 1.25}
              laneHeightEm={laneHeightEm}
              laneWidthCh={laneWidthCh}
              opacityClass={opacityClass}
              typeSpeedChPerSec={typeSpeedChPerSec}
              deleteSpeedChPerSec={deleteSpeedChPerSec}
              slideMs={slideMs}
              exploding={hovered}
              vertical={false}
              laneMarginEm={lanesGapEm}
              burstId={burstId}
            />
          ))}
        </div>

        {/* Vertical (UP) lanes — laid out horizontally */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          {VERT_LINES.map((line, i) => (
            <TypingDeletingLine
              key={`v-${i}`}
              text={line}
              direction="up"
              baseOffset={intensity * 1.25}
              laneHeightEm={laneHeightEm}
              laneWidthCh={laneWidthCh}
              opacityClass={opacityClass}
              typeSpeedChPerSec={typeSpeedChPerSec}
              deleteSpeedChPerSec={deleteSpeedChPerSec}
              slideMs={slideMs}
              exploding={hovered}
              vertical
              laneMarginEm={lanesGapEm}
              burstId={burstId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
