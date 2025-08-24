"use client";

import * as React from "react";
import { motion, useAnimationControls } from "framer-motion";

type Props = {
  text?: string;
  className?: string;
  intensity?: number;       // how far letters + slide travel (px)
  stagger?: number;         // letter staggering (s)
  opacityClass?: string;    // code color, e.g. "text-white/25"
  laneHeightEm?: number;    // lane height for clipping
  laneWidthCh?: number;     // lane width for clipping (characters)
  typeSpeedChPerSec?: number; // typing speed (characters per second)
  holdAfterTypeMs?: number; // small pause before sliding out
};

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

/** A typed line that:
 *  1) types from width 0ch -> Nch (steps),
 *  2) holds briefly,
 *  3) then slides outward and fades,
 *  4) resets when hovered=false.
 */
function TypingLine({
  text,
  direction,         // "left" | "right" | "up" | "down"
  baseOffset,        // pixels to slide off after typing
  laneHeightEm,
  laneWidthCh,
  opacityClass,
  typeSpeedChPerSec,
  holdAfterTypeMs,
  hover,
  delay = 0,         // optional start delay in seconds
  vertical = false,  // if true, render vertical-rl
}: {
  text: string;
  direction: "left" | "right" | "up" | "down";
  baseOffset: number;
  laneHeightEm: number;
  laneWidthCh: number;
  opacityClass: string;
  typeSpeedChPerSec: number;
  holdAfterTypeMs: number;
  hover: boolean;
  delay?: number;
  vertical?: boolean;
}) {
  const controls = useAnimationControls();
  const N = text.length;
  const typeDuration = Math.max(0.15, N / typeSpeedChPerSec); // seconds
  const slideVector =
    direction === "left" ? { x: -baseOffset, y: 0 } :
    direction === "right" ? { x:  baseOffset, y: 0 } :
    direction === "up" ? { x: 0, y: -baseOffset } :
    { x: 0, y: baseOffset };

  // Kick off / reset timeline whenever hover changes
  React.useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;

    const run = async () => {
      if (!hover) {
        // Reset to start: invisible, no width, centered
        await controls.set({ x: 0, y: 0, opacity: 0, width: "0ch" });
        return;
      }

      // 1) start hidden at center with width 0ch
      await controls.set({ x: 0, y: 0, opacity: 0, width: "0ch" });

      // small entrance fade to make caret visible
      await controls.start({
        opacity: 1,
        transition: { duration: 0.12, delay }
      });

      // 2) type to full width using steps (looks like true typing)
      await controls.start({
        width: `${N}ch`,
        transition: {
          duration: typeDuration,
          ease: "linear",
          // Step effect via keyframes—framer approximates; monospace makes it convincing
        }
      });

      // 3) hold briefly, then slide outward + fade
      t = setTimeout(() => {
        controls.start({
          ...slideVector,
          opacity: 0,
          transition: { duration: 0.35, ease: "easeIn" }
        });
      }, holdAfterTypeMs);
    };

    run();

    return () => { if (t) clearTimeout(t); };
  }, [hover, controls, typeDuration, holdAfterTypeMs, slideVector, delay, N]);

  // Lane clip
  const laneStyle: React.CSSProperties = vertical
    ? { height: `${laneHeightEm}em`, width: `${Math.min(laneWidthCh, 10)}ch`, overflow: "hidden" }
    : { height: `${laneHeightEm}em`, maxWidth: `${laneWidthCh}ch`, overflow: "hidden" };

  return (
    <div style={laneStyle}>
      <motion.span
        animate={controls}
        initial={{ x: 0, y: 0, opacity: 0, width: "0ch" }}
        className={`inline-flex items-center font-mono ${opacityClass} text-[0.32em] md:text-[0.28em] ${vertical ? "" : "whitespace-nowrap"}`}
        style={{ writingMode: vertical ? ("vertical-rl" as any) : undefined }}
        aria-hidden
      >
        {/* visible text area (clipped by width) */}
        <span className="sr-only">{text}</span>
        <span aria-hidden className={`${vertical ? "" : "whitespace-nowrap"}`}>{text}</span>
        {/* caret */}
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
  intensity = 70,
  stagger = 0.014,
  opacityClass = "text-white/25",
  laneHeightEm = 1.45,
  laneWidthCh = 44,
  typeSpeedChPerSec = 28,
  holdAfterTypeMs = 300,
}: Props) {
  const [hovered, setHovered] = React.useState(false);

  // Letters: strictly cardinal motion (R, L, Up, Down). No rotation -> matches your gutters.
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
  const pad = Math.round(intensity + 16);

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
      {/* Base name keeps layout stable */}
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

      {/* Clip box for typing code lines (no overlap, no spill) */}
      <div
        className="pointer-events-none absolute"
        style={{ left: -pad, right: -pad, top: -pad, bottom: -pad, overflow: "hidden" }}
      >
        {/* Horizontal lanes (stacked vertically) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-2">
          {HORIZ_LINES.map((line, i) => (
            <TypingLine
              key={`h-${i}`}
              text={line}
              direction={i % 2 === 0 ? "right" : "left"}
              baseOffset={intensity * 1.25}
              laneHeightEm={laneHeightEm}
              laneWidthCh={laneWidthCh}
              opacityClass={opacityClass}
              typeSpeedChPerSec={typeSpeedChPerSec}
              holdAfterTypeMs={holdAfterTypeMs}
              hover={hovered}
              delay={i * 0.05}
              vertical={false}
            />
          ))}
        </div>

        {/* Vertical lanes (laid out horizontally) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-3">
          {VERT_LINES.map((line, i) => (
            <TypingLine
              key={`v-${i}`}
              text={line}
              direction={i % 2 === 0 ? "up" : "down"}
              baseOffset={intensity * 1.25}
              laneHeightEm={laneHeightEm}
              laneWidthCh={laneWidthCh}
              opacityClass={opacityClass}
              typeSpeedChPerSec={typeSpeedChPerSec}
              holdAfterTypeMs={holdAfterTypeMs}
              hover={hovered}
              delay={i * 0.05}
              vertical
            />
          ))}
        </div>
      </div>
    </div>
  );
}
