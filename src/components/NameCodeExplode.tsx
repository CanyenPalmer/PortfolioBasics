"use client";

import * as React from "react";
import { motion } from "framer-motion";

type Props = {
  text?: string;
  className?: string;

  // Motion
  intensity?: number;      // how far everything flies (px)
  durationMs?: number;     // total time for explode OR implode (ms)
  ease?: string;           // easing name for both letters and code
  opacityClass?: string;   // color for code lines (e.g. "text-white/25")

  // Visuals
  codeScale?: number;      // how long code shards look (multiplier)
};

// Long-ish code strings to look like flares
const HORIZ_LINES = [
  "import pandas as pd    df = pd.read_csv('golf_stats.csv')",
  "X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2)",
  "model = RandomForestClassifier(n_estimators=300, random_state=42)",
  "y_prob = model.predict_proba(X_te)[:,1]    auc = roc_auc_score(y_te, y_prob)",
];

const VERT_LINES = [
  "df.groupby('hole')['strokes'].mean()",
  "statsmodels.api.OLS(y, X).fit().summary()",
  "precision_at_k(y_te, y_prob, k=0.10)",
  "pandas.merge(a,b,on='id',how='inner')",
];

export default function NameCodeExplode({
  text = "Canyen Palmer",
  className = "text-5xl md:text-7xl font-extrabold tracking-tight",
  intensity = 90,
  durationMs = 320,
  ease = "easeInOut",
  opacityClass = "text-white/25",
  codeScale = 1.0,
}: Props) {
  const [hovered, setHovered] = React.useState(false);
  const [burstId, setBurstId] = React.useState(0);

  // Remount everything on each enter/leave so the whole burst starts the same frame
  React.useEffect(() => {
    setBurstId((n) => n + 1);
  }, [hovered]);

  // Letters: alternate LEFT / UP so motion mirrors code directions
  const letterOffsets = React.useMemo(() => {
    return [...text].map((_, i) => (i % 2 === 0 ? { x: -intensity, y: 0 } : { x: 0, y: -intensity }));
  }, [text, intensity]);

  // SHARED TIMING / OPACITY (perfect sync)
  const animFrom = { x: 0, y: 0, opacity: 1 };
  const animTo   = { x: 0, y: 0, opacity: 0 };

  // Code shards configs (no clip — allowed to overlap text; only move left or up)
  // Horizontal: slide LEFT, scaleX to feel like a streak; Vertical: slide UP, scaleY.
  const codeTransition = { duration: durationMs / 1000, ease };

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
      {/* NAME — letters explode/implode in EXACT sync w/ code */}
      <span aria-hidden className="relative inline-block">
        {[...text].map((ch, i) =>
          ch === " " ? (
            <span key={`sp-${i}`} className="inline-block w-[0.4em]" />
          ) : (
            <motion.span
              key={`ch-${i}-${ch}-${burstId}`}
              className="inline-block"
              initial={animFrom}
              animate={
                hovered
                  ? { x: letterOffsets[i].x, y: letterOffsets[i].y, opacity: 0 }
                  : animFrom
              }
              transition={codeTransition}
            >
              {ch}
            </motion.span>
          )
        )}
      </span>

      {/* CODE FLARE — synchronized with letters, no clipping, only LEFT / UP */}
      {/* Horizontal lines (LEFT) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-2">
          {HORIZ_LINES.map((line, i) => (
            <motion.span
              key={`h-${i}-${burstId}`}
              className={`font-mono ${opacityClass} text-[0.32em] md:text-[0.28em] whitespace-nowrap`}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scaleX: 1,
              }}
              animate={
                hovered
                  ? { x: -intensity, y: 0, opacity: 0, scaleX: 1 + 0.35 * codeScale }
                  : { x: 0, y: 0, opacity: 1, scaleX: 1 }
              }
              transition={codeTransition}
              aria-hidden
            >
              {line}
            </motion.span>
          ))}
        </div>

        {/* Vertical lines (UP) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-3">
          {VERT_LINES.map((line, i) => (
            <motion.span
              key={`v-${i}-${burstId}`}
              className={`font-mono ${opacityClass} text-[0.32em] md:text-[0.28em]`}
              style={{ writingMode: "vertical-rl" as any }}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scaleY: 1,
              }}
              animate={
                hovered
                  ? { x: 0, y: -intensity, opacity: 0, scaleY: 1 + 0.35 * codeScale }
                  : { x: 0, y: 0, opacity: 1, scaleY: 1 }
              }
              transition={codeTransition}
              aria-hidden
            >
              {line}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
