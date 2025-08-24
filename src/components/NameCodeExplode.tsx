"use client";

import * as React from "react";
import { motion, useAnimationControls } from "framer-motion";

type Props = {
  text?: string;
  className?: string;
  intensity?: number;            // distance letters slide (px) & code slides off-screen
  stagger?: number;              // per-letter stagger (seconds)
  opacityClass?: string;         // color of code lines (e.g., "text-white/25")
  laneHeightEm?: number;         // lane height (controls vertical spacing)
  laneWidthCh?: number;          // lane width (clips long horizontal lines)
  typeSpeedChPerSec?: number;    // typing speed for code lines
  holdAfterTypeMs?: number;      // pause before code slides away
  lanesGapEm?: number;           // gap between lanes
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

// Typed line component: types → optional hold → slides off in its lane
function TypingLine({
  text,
  direction,          // 'left' | 'right' | 'up' | 'down'
  baseOffset,         // slide distance in px
  laneHeightEm,
  laneWidthCh,
  opacityClass,
  typeSpeedChPerSec,
  holdAfterTypeMs,
  hover,              // sync with letters: true when letters disperse
  startDelay = 0,     // small lane staggering if desired
  vertical = false,
  lanesGapEm = 0.5,
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
  startDelay?: number;
  vertical?: boolean;
  lanesGapEm?: number;
}) {
  const controls = useAnimationControls();
  const N = text.length;
  const typeDuration = Math.max(0.12, N / typeSpeedChPerSec); // seconds

  const slideVector =
    direction === "left" ? { x: -baseOffset, y: 0 } :
    direction === "right" ? { x:  baseOffset, y: 0 } :
    direction === "up" ? { x: 0, y: -baseOffset } :
                         { x: 0, y:  baseOffset };

  React.useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;

    const run = async () => {
      if (!hover) {
        // reset immediately when mouse leaves (so name can reform)
        await controls.set({ x: 0, y: 0, opacity: 0, width: "0ch" });
        return;
      }

      // start aligned with letters dispersing
      await controls.set({ x: 0, y: 0, opacity: 0, width: "0ch" });

      // tiny fade-in so caret isn’t jarring
      await controls.start({
        opacity: 1,
        transition: { duration: 0.1, delay: startDelay },
      });

      // “type” to full width (monospace makes this convincing)
      await controls.start({
        width: `${N}ch`,
        transition: {
          duration: typeDuration,
          ease: "linear",
          delay: startDelay,
        },
      });

      // hold briefly, then slide off in lane direction
      t = setTimeout(() => {
        controls.start({
          ...slideVector,
          opacity: 0,
          transition: { duration: 0.35, ease: "easeIn" },
        });
      }, holdAfterTypeMs);
    };

    run();
    return () => { if (t) clearTimeout(t); };
  }, [hover, controls, typeDuration, holdAfterTypeMs, slideVector, startDelay, N]);

  const laneStyle: React.CSSProperties = vertical
    ? { height: `${laneHeightEm}em`, width: `${Math.min(laneWidthCh, 10)}ch`, overflow: "hidden", margin: `${lanesGapEm/2}em` }
    : { height: `${laneHeightEm}em`, maxWidth: `${laneWidthCh}ch`, overflow: "hidden", margin: `${lanesGapEm/2}em 0` };

  return (
    <div style={laneStyle}>
      <motion.span
        animate={controls}
        initial={{ x: 0, y: 0, opacity: 0, width: "0ch" }}
        className={`inline-flex items-center font-mono ${opacityClass} text-[0.32em] md:text-[0.28em] ${vertical ? "" : "whitespace-nowrap"}`}
        style={{ writingMode: vertical ? ("vertical-rl" as any) : undefined }}
        aria-hidden
      >
        {/* visible text (clipped by width) */}
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
  intensity = 72,
  stagger = 0.014,
  opacityClass = "text-white/25",
  laneHeightEm = 1.5,
  laneWidthCh = 46,
  typeSpeedChPerSec = 30,
  holdAfterTypeMs = 250,
  lanesGapEm = 0.6,
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

      {/* CLIP BOX ensures code never overlaps itself or other text */}
      <div
        className="pointer-events-none absolute"
        style={{ left: -pad, right: -pad, top: -pad, bottom: -pad, overflow: "hidden" }}
      >
        {/* Horizontal lanes (stacked vertically, centered). Start immediately on hover. */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
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
              hover={hovered}                   // <-- sync start with letters
              startDelay={0}                    // no delay: appears with letters
              vertical={false}
              lanesGapEm={lanesGapEm}
            />
          ))}
        </div>

        {/* Vertical lanes (laid out horizontally, centered). Start immediately on hover. */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
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
              hover={hovered}                   // <-- sync start with letters
              startDelay={0}
              vertical
              lanesGapEm={lanesGapEm}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
