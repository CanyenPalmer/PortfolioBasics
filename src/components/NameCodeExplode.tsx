"use client";

import * as React from "react";
import { motion } from "framer-motion";

type Props = {
  text?: string;
  className?: string;

  // Motion + layout knobs
  intensity?: number;            // how far letters + code slide (px)
  stagger?: number;              // per-letter stagger (s)
  opacityClass?: string;         // code color (e.g., "text-white/25")
  laneHeightEm?: number;         // lane height (vertical spacing)
  laneWidthCh?: number;          // lane width (clips long horizontal lines)
  lanesGapEm?: number;           // extra gap between lanes

  // Typing timing
  typeSpeedChPerSec?: number;    // characters per second for "typing"
  deleteSpeedChPerSec?: number;  // characters per second for "deleting"
  slideMs?: number;              // slide duration (ms) for the off/on movement
};

// Long, linear lines (match your data‑science vibe)
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

/** Build a keyframed animation spec that:
 *  - types in → deletes while sliding outward (hover=true),
 *  - types in → deletes while sliding inward (hover=false).
 */
function buildKeyframes(opts: {
  n: number;                  // chars
  direction: "left" | "right" | "up" | "down";
  baseOffset: number;         // px slide distance
  typeSec: number;            // typing duration (s)
  deleteSec: number;          // deleting duration (s)
  slideSec: number;           // slide duration (s)
  hover: boolean;             // true = out, false = in
}) {
  const { n, direction, baseOffset, typeSec, deleteSec, slideSec, hover } = opts;

  const offsetX = direction === "left" ? -baseOffset : direction === "right" ? baseOffset : 0;
  const offsetY = direction === "up" ? -baseOffset : direction === "down" ? baseOffset : 0;

  // Timeline proportions (typing → deleting → slide)
  const total = typeSec + deleteSec + slideSec;
  const t1 = typeSec / total;
  const t2 = (typeSec + deleteSec) / total;

  // Keyframes for width (simulate typing/deleting)
  const widthFrames = ["0ch", `${n}ch`, "0ch"];

  // Slide direction depends on hover:
  //  - hover=true: center → offscreen
  //  - hover=false: offscreen → center
  const xFrames = hover ? [0, 0, offsetX] : [offsetX, 0, 0];
  const yFrames = hover ? [0, 0, offsetY] : [offsetY, 0, 0];

  // Opacity: visible during type/delete, fades on final slide leg
  const opacityFrames = hover ? [1, 1, 0] : [0, 1, 0];

  return {
    width: widthFrames,
    x: xFrames,
    y: yFrames,
    opacity: opacityFrames,
    transition: {
      ease: "linear",
      duration: total,
      times: [0, t1, t2], // aligns width, slide, opacity
    },
  };
}

function TypingDeletingLine({
  text,
  direction,
  baseOffset,
  laneHeightEm,
  laneWidthCh,
  opacityClass,
  typeSpeedChPerSec,
  deleteSpeedChPerSec,
  slideMs,
  hover,
  vertical = false,
  laneMarginEm,
}: {
  text: string;
  direction: "left" | "right" | "up" | "down";
  baseOffset: number;
  laneHeightEm: number;
  laneWidthCh: number;
  opacityClass: string;
  typeSpeedChPerSec: number;
  deleteSpeedChPerSec: number;
  slideMs: number;
  hover: boolean;
  vertical?: boolean;
  laneMarginEm: number;
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
    hover,
  });

  const laneStyle: React.CSSProperties = vertical
    ? { height: `${laneHeightEm}em`, width: `${Math.min(laneWidthCh, 10)}ch`, overflow: "hidden", margin: `${laneMarginEm}em` }
    : { height: `${laneHeightEm}em`, maxWidth: `${laneWidthCh}ch`, overflow: "hidden", margin: `${laneMarginEm}em 0` };

  return (
    <div style={laneStyle}>
      <motion.span
        // re-run animation when hover flips
        animate={kf}
        initial={{ x: 0, y: 0, opacity: 0, width: "0ch" }}
        className={`inline-flex items-center font-mono ${opacityClass} text-[0.32em] md:text-[0.28em] ${vertical ? "" : "whitespace-nowrap"}`}
        style={{ writingMode: vertical ? ("vertical-rl" as any) : undefined }}
        aria-hidden
      >
        {/* visible text area (width is keyframed) */}
        <span aria-hidden className={`${vertical ? "" : "whitespace-nowrap"}`}>{text}</span>
        {/* caret block */}
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
  stagger = 0.014,
  opacityClass = "text-white/25",
  laneHeightEm = 1.5,
  laneWidthCh = 46,
  lanesGapEm = 0.6,
  typeSpeedChPerSec = 30,
  deleteSpeedChPerSec = 42,
  slideMs = 360,
}: Props) {
  const [hovered, setHovered] = React.useState(false);

  // Letters disperse only in cardinal directions; start immediately on hover
  const letterOffsets = React.useMemo(() => {
    return [...text].map((_, i) => {
      const dir = i % 4;
      switch (dir) {
        case 0: return { x: +intensity, y: 0 };   // right
        case 1: return { x: -intensity, y: 0 };   // left
        case 2: return { x: 0, y: -intensity };   // up
        default: return { x: 0, y: +intensity };  // down
      }
    });
  }, [text, intensity]);

  // Extra clip padding so typing/slide never touches nearby content
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
      {/* Base name keeps layout stable; letters disperse with small stagger */}
      <span aria-hidden className="relative inline-block">
        {[...text].map((ch, i) =>
          ch === " " ? (
            <span key={`sp-${i}`} className="inline-block w-[0.4em]" />
          ) : (
            <motion.span
              key={`ch-${i}-${ch}`}
              className="inline-block"
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={
                hovered
                  ? { x: letterOffsets[i].x, y: letterOffsets[i].y, opacity: 0 }
                  : { x: 0, y: 0, opacity: 1 }
              }
              transition={{ type: "tween", duration: hovered ? 0.35 : 0.55, delay: i * (stagger ?? 0) }}
            >
              {ch}
            </motion.span>
          )
        )}
      </span>

      {/* CLIP BOX ensures code never overlaps itself or nearby text */}
      <div
        className="pointer-events-none absolute"
        style={{ left: -pad, right: -pad, top: -pad, bottom: -pad, overflow: "hidden" }}
      >
        {/* Horizontal code lanes — stacked vertically, centered */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
          {HORIZ_LINES.map((line, i) => (
            <TypingDeletingLine
              key={`h-${i}`}
              text={line}
              direction={i % 2 === 0 ? "right" : "left"}
              baseOffset={intensity * 1.25}
              laneHeightEm={laneHeightEm}
              laneWidthCh={laneWidthCh}
              opacityClass={opacityClass}
              typeSpeedChPerSec={typeSpeedChPerSec}
              deleteSpeedChPerSec={deleteSpeedChPerSec}
              slideMs={slideMs}
              hover={hovered}               // start exactly with letters
              vertical={false}
              laneMarginEm={lanesGapEm}
            />
          ))}
        </div>

        {/* Vertical code lanes — laid out horizontally, centered */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          {VERT_LINES.map((line, i) => (
            <TypingDeletingLine
              key={`v-${i}`}
              text={line}
              direction={i % 2 === 0 ? "up" : "down"}
              baseOffset={intensity * 1.25}
              laneHeightEm={laneHeightEm}
              laneWidthCh={laneWidthCh}
              opacityClass={opacityClass}
              typeSpeedChPerSec={typeSpeedChPerSec}
              deleteSpeedChPerSec={deleteSpeedChPerSec}
              slideMs={slideMs}
              hover={hovered}               // start exactly with letters
              vertical
              laneMarginEm={lanesGapEm}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
