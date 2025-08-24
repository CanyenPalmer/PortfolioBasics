"use client";

import * as React from "react";
import { motion } from "framer-motion";

type Props = {
  text?: string;
  className?: string;
  intensity?: number;     // how far characters/code fly (px)
  stagger?: number;       // letter staggering (s)
  opacityClass?: string;  // match your code color, default text-white/25
  laneHeightEm?: number;  // per-line lane height
  laneWidthCh?: number;   // per-line lane width (characters)
};

const CODE_TOKENS = [
  "import", "def", "SELECT *", "lambda", "Σ", "JOIN",
  "fit()", "=>", "while", "return", "from", "if",
  "else", "ROC", "∇", "groupby()", "mean()", "{ }", "< />"
];

export default function NameCodeExplode({
  text = "Canyen Palmer",
  className = "text-5xl md:text-7xl font-extrabold tracking-tight",
  intensity = 60,
  stagger = 0.014,
  opacityClass = "text-white/25",
  laneHeightEm = 1.35,
  laneWidthCh = 38,
}: Props) {
  const [hovered, setHovered] = React.useState(false);

  // Letters: move only in cardinal directions (R, L, Up, Down)
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

  // Code shards: split into horizontal and vertical lanes (no diagonals)
  const horizTokens = React.useMemo(
    () => CODE_TOKENS.slice(0, 6), // small set → cleaner, non-overlapping
    []
  );
  const vertTokens = React.useMemo(
    () => CODE_TOKENS.slice(6, 12),
    []
  );

  // Padding for the invisible clip box (bigger than intensity so we never spill)
  const pad = Math.round(intensity + 12);

  // Reusable lane wrapper: strictly clipped box for one token
  const Lane = ({ children }: { children: React.ReactNode }) => (
    <div
      className="overflow-hidden"
      style={{ height: `${laneHeightEm}em`, maxWidth: `${laneWidthCh}ch` }}
    >
      {children}
    </div>
  );

  const codeClass = `font-mono ${opacityClass} text-[0.32em] md:text-[0.28em] whitespace-pre`;

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
      {/* Base inline text: layout size is stable; letters fade/move but don't collapse */}
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
              transition={{
                type: "tween",
                duration: hovered ? 0.35 : 0.5,
                delay: i * (stagger ?? 0),
              }}
            >
              {ch}
            </motion.span>
          )
        )}
      </span>

      {/* CLIP BOX for code shards (doesn't affect layout). Expands beyond text via negative inset. */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: -pad,
          right: -pad,
          top: -pad,
          bottom: -pad,
          overflow: "hidden",
        }}
      >
        {/* Horizontal lanes (left/right) — stacked vertically, centered */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-2">
          {horizTokens.map((tok, i) => {
            const dirRight = i % 2 === 0;
            return (
              <Lane key={`hx-${i}`}>
                <motion.span
                  className={codeClass}
                  initial={{ x: 0, opacity: 0 }}
                  animate={
                    hovered
                      ? { x: dirRight ? +intensity * 1.15 : -intensity * 1.15, opacity: 1 }
                      : { x: 0, opacity: 0 }
                  }
                  transition={{ type: "tween", duration: 0.32, delay: hovered ? i * 0.05 : 0 }}
                  aria-hidden
                >
                  {tok}
                </motion.span>
              </Lane>
            );
          })}
        </div>

        {/* Vertical lanes (up/down) — laid out horizontally, centered */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-3">
          {vertTokens.map((tok, i) => {
            const dirUp = i % 2 === 0;
            return (
              <div key={`vy-${i}`} style={{ width: `${Math.min(laneWidthCh, 10)}ch` }}>
                <div
                  className="overflow-hidden"
                  style={{ height: `${laneHeightEm}em` }}
                >
                  <motion.span
                    className={codeClass}
                    initial={{ y: 0, opacity: 0 }}
                    animate={
                      hovered
                        ? { y: dirUp ? -intensity * 1.15 : +intensity * 1.15, opacity: 1 }
                        : { y: 0, opacity: 0 }
                    }
                    transition={{ type: "tween", duration: 0.32, delay: hovered ? i * 0.05 : 0 }}
                    aria-hidden
                  >
                    {tok}
                  </motion.span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
