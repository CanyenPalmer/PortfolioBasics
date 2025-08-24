"use client";

import * as React from "react";
import { motion } from "framer-motion";

type Props = {
  text?: string;
  className?: string;
  intensity?: number;     // how far the break travels (px)
  stagger?: number;       // letter staggering (s)
  opacityClass?: string;  // match your code color (default: text-white/25)
  laneHeightEm?: number;  // lane height for clipping
  laneWidthCh?: number;   // lane width (characters) for clipping
};

const HORIZ_LINES = [
  "import pandas as pd    df = pd.read_csv('golf_stats.csv')",
  "X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2)",
  "model = RandomForestClassifier(n_estimators=300, random_state=42)",
  "y_prob = model.predict_proba(X_te)[:, 1]      auc = roc_auc_score(y_te, y_prob)",
  "SELECT hole, AVG(strokes) AS avg_strokes FROM rounds GROUP BY hole;",
  "precision_at_k(y_te, y_prob, k=0.10)     recall_at_k(y_te, y_prob, k=0.10)",
];

const VERT_LINES = [
  "df.groupby('hole')['strokes'].mean()",
  "sns.barplot(data=df, x='hole', y='strokes')",
  "statsmodels.api.OLS(y, X).fit().summary()",
  "plt.figure(figsize=(8,5)); plt.plot(y_prob)",
  "tidyverse::mutate(score = scale(x))",
  "pandas.merge(left=a, right=b, on='id', how='inner')",
];

export default function NameCodeExplode({
  text = "Canyen Palmer",
  className = "text-5xl md:text-7xl font-extrabold tracking-tight",
  intensity = 60,
  stagger = 0.014,
  opacityClass = "text-white/25",
  laneHeightEm = 1.45,
  laneWidthCh = 44,
}: Props) {
  const [hovered, setHovered] = React.useState(false);

  // Letters: only cardinal motion (R, L, Up, Down)
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

  // Clip padding so moving code never spills into neighbors
  const pad = Math.round(intensity + 12);

  // Lane wrappers (clip area)
  const LaneH = ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-hidden" style={{ height: `${laneHeightEm}em`, maxWidth: `${laneWidthCh}ch` }}>
      {children}
    </div>
  );
  const LaneV = ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-hidden" style={{ height: `${laneHeightEm}em`, width: `${Math.min(laneWidthCh, 10)}ch` }}>
      {children}
    </div>
  );

  const codeClass = `font-mono ${opacityClass} text-[0.32em] md:text-[0.28em] whitespace-nowrap`;

  // Small ping‑pong oscillation for code while hovered
  const osc = Math.max(8, Math.min(18, intensity * 0.22));

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
      {/* Base name (keeps layout size; letters move/fade but container stays) */}
      <span aria-hidden className="relative inline-block">
        {[...text].map((ch, i) =>
          ch === " " ? (
            <span key={`sp-${i}`} className="inline-block w-[0.4em]" />
          ) : (
            <motion.span
              key={`ch-${i}-${ch}`}
              className="inline-block"
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={hovered ? { x: letterOffsets[i].x, y: letterOffsets[i].y, opacity: 0 } : { x: 0, y: 0, opacity: 1 }}
              transition={{ type: "tween", duration: hovered ? 0.35 : 0.5, delay: i * (stagger ?? 0) }}
            >
              {ch}
            </motion.span>
          )
        )}
      </span>

      {/* Clip box for long linear code lines */}
      <div
        className="pointer-events-none absolute"
        style={{ left: -pad, right: -pad, top: -pad, bottom: -pad, overflow: "hidden" }}
      >
        {/* Horizontal code lanes — stacked vertically, centered */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-2">
          {HORIZ_LINES.map((line, i) => {
            const dirRight = i % 2 === 0;
            const baseX = (dirRight ? +1 : -1) * intensity * 1.12;
            return (
              <LaneH key={`h-${i}`}>
                <motion.span
                  className={codeClass}
                  initial={{ x: 0, opacity: 0 }}
                  animate={
                    hovered
                      ? { x: [baseX - osc, baseX + osc, baseX - osc], opacity: 1 }
                      : { x: 0, opacity: 0 }
                  }
                  transition={
                    hovered
                      ? { duration: 1.6, ease: "easeInOut", repeat: Infinity, delay: i * 0.04 }
                      : { duration: 0.25 }
                  }
                  aria-hidden
                >
                  {line}
                </motion.span>
              </LaneH>
            );
          })}
        </div>

        {/* Vertical code lanes — laid out horizontally, centered (vertical writing mode) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-3">
          {VERT_LINES.map((line, i) => {
            const dirUp = i % 2 === 0;
            const baseY = (dirUp ? -1 : +1) * intensity * 1.12;
            return (
              <LaneV key={`v-${i}`}>
                <motion.span
                  className={`${codeClass}`}
                  style={{ writingMode: "vertical-rl" as any }}
                  initial={{ y: 0, opacity: 0 }}
                  animate={
                    hovered
                      ? { y: [baseY - osc, baseY + osc, baseY - osc], opacity: 1 }
                      : { y: 0, opacity: 0 }
                  }
                  transition={
                    hovered
                      ? { duration: 1.6, ease: "easeInOut", repeat: Infinity, delay: i * 0.04 }
                      : { duration: 0.25 }
                  }
                  aria-hidden
                >
                  {line}
                </motion.span>
              </LaneV>
            );
          })}
        </div>
      </div>
    </div>
  );
}
