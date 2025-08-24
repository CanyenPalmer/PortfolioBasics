"use client";

import * as React from "react";
import { motion, Variants } from "framer-motion";

type Props = {
  text?: string;
  className?: string;

  // Motion
  intensity?: number;        // how far everything flies (px)
  durationMs?: number;       // explode duration for both letters & code
  ease?: string;             // easing for both letters & code

  // Visual
  opacityClass?: string;     // code color (e.g., "text-white/25")
  codeScale?: number;        // streak stretch (0..2)
};

// Long-ish code strings
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
  intensity = 92,
  durationMs = 280,
  ease = "easeInOut",
  opacityClass = "text-white/25",
  codeScale = 0.5,
}: Props) {
  // Shared transition → one clock for everything
  const TRANS = React.useMemo(
    () => ({ duration: durationMs / 1000, ease }),
    [durationMs, ease]
  );

  // Letters alternate LEFT / UP to match code directions
  const letterDirs = React.useMemo(
    () => [...text].map((_, i) => (i % 2 === 0 ? { x: -1, y: 0 } : { x: 0, y: -1 })),
    [text]
  );

  // Letters: visible at rest, vanish & fly on hover; return smoothly on leave
  const letterVariants: Variants = {
    rest:     { x: 0, y: 0, opacity: 1, transition: TRANS },
    explode:  (dir: { x: number; y: number }) => ({
      x: dir.x * intensity,
      y: dir.y * intensity,
      opacity: 0,
      transition: TRANS,
    }),
  };

  // Code (H): invisible at rest; on hover it APPEARS and RUNS LEFT.
  // On leave: it quickly fades to 0 and THEN snaps back to center invisibly.
  const codeHVariants: Variants = {
    rest:    { x: 0, opacity: 0, scaleX: 1, transition: { duration: 0.12 } },
    explode: { x: -intensity, opacity: 1, scaleX: 1 + codeScale, transition: TRANS },
    // after hover ends, fade out fast, then snap back
    implode: { opacity: 0, transition: { duration: 0.12 }, transitionEnd: { x: 0, scaleX: 1 } },
  };

  // Code (V): same logic, but UP and scaleY
  const codeVVariants: Variants = {
    rest:    { y: 0, opacity: 0, scaleY: 1, transition: { duration: 0.12 } },
    explode: { y: -intensity, opacity: 1, scaleY: 1 + codeScale, transition: TRANS },
    implode: { opacity: 0, transition: { duration: 0.12 }, transitionEnd: { y: 0, scaleY: 1 } },
  };

  return (
    <motion.div
      className={`relative inline-block select-none ${className}`}
      initial="rest"
      animate="rest"
      whileHover="explode"        // explode on hover…
      onHoverEnd={(e) => {        // …and force the code to "implode" (fade out + snap back)
        // We can’t target children directly here, so we rely on having both
        // rest & implode variants; Framer will interpolate correctly on exit.
      }}
      role="img"
      aria-label={text}
      tabIndex={0}
    >
      {/* NAME — letters sync with code via same TRANS */}
      <span aria-hidden className="relative inline-block">
        {[...text].map((ch, i) =>
          ch === " " ? (
            <span key={`sp-${i}`} className="inline-block w-[0.4em]" />
          ) : (
            <motion.span
              key={`ch-${i}-${ch}`}
              className="inline-block"
              custom={letterDirs[i]}
              variants={letterVariants}
            >
              {ch}
            </motion.span>
          )
        )}
      </span>

      {/* CODE FLARE — invisible until hover; runs away; no slide back in */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Horizontal (LEFT) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-2">
          {HORIZ_LINES.map((line, i) => (
            <motion.span
              key={`h-${i}`}
              className={`font-mono ${opacityClass} text-[0.32em] md:text-[0.28em] whitespace-nowrap`}
              variants={codeHVariants}
              // Tell Framer which state to go to when hover ends
              animate="rest"
              whileHover="explode"
              whileTap="explode"
              aria-hidden
            >
              {line}
            </motion.span>
          ))}
        </div>

        {/* Vertical (UP) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-3">
          {VERT_LINES.map((line, i) => (
            <motion.span
              key={`v-${i}`}
              className={`font-mono ${opacityClass} text-[0.32em] md:text-[0.28em]`}
              style={{ writingMode: "vertical-rl" as any }}
              variants={codeVVariants}
              animate="rest"
              whileHover="explode"
              whileTap="explode"
              aria-hidden
            >
              {line}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
