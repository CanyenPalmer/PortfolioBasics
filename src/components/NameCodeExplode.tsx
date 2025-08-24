"use client";

import * as React from "react";
import { motion } from "framer-motion";

type Props = {
  text?: string;               // default: "Canyen Palmer"
  className?: string;          // font-size, weight, color (Tailwind)
  intensity?: number;          // how far letters/code fly (px)
  stagger?: number;            // letter staggering (s)
};

const CODE_TOKENS = [
  "{", "}", "<div/>", "SELECT", "df =", "pd.read_csv()", "λ", "Σ", "fit()", "ROC", "→",
  "let", "const", "←", "JOIN", "WHERE", "mean()", "σ", "∇", "groupby()", "/>", "</>"
];

export default function NameCodeExplode({
  text = "Canyen Palmer",
  className = "text-5xl md:text-7xl font-extrabold tracking-tight",
  intensity = 60,
  stagger = 0.014,
}: Props) {
  const [hovered, setHovered] = React.useState(false);

  // deterministic per-letter offsets
  const letterOffsets = React.useMemo(() => {
    const rand = (seed: number) => {
      let t = seed + 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    return [...text].map((_, i) => {
      const r1 = rand(i * 3 + 11);
      const r2 = rand(i * 7 + 19);
      const r3 = rand(i * 13 + 29);
      const angle = r1 * Math.PI * 2;
      const dist = (0.45 + r2 * 0.55) * intensity; // 45%..100% * intensity
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      const rot = r3 * 60 - 30; // -30..+30 deg
      return { x, y, rot };
    });
  }, [text, intensity]);

  // code token shards
  const tokens = React.useMemo(() => {
    const max = Math.min(CODE_TOKENS.length, Math.max(10, Math.ceil(text.length * 0.8)));
    return new Array(max).fill(0).map((_, i) => {
      const seed = 1000 + i;
      const r = (n: number) => {
        let t = seed + n;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
      const idx = Math.floor(r(1) * CODE_TOKENS.length);
      const angle = r(2) * Math.PI * 2;
      const dist = (0.5 + r(3) * 1.0) * (intensity * 1.2);
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      const rot = r(4) * 100 - 50;
      const delay = r(5) * 0.08;
      return { text: CODE_TOKENS[idx], x, y, rot, delay };
    });
  }, [text, intensity]);

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
      {/* Base letters */}
      <span aria-hidden className="relative inline-block">
        {[...text].map((ch, i) => {
          if (ch === " ") return <span key={`sp-${i}`} className="inline-block w-[0.4em]" />;
          const { x, y, rot } = letterOffsets[i];
          return (
            <motion.span
              key={`ch-${i}-${ch}`}
              className="inline-block"
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={hovered ? { x, y, rotate: rot, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
              transition={{
                type: hovered ? "tween" : "spring",
                stiffness: hovered ? 80 : 260,
                damping: hovered ? 20 : 18,
                duration: hovered ? 0.45 : 0.65,
                delay: i * stagger,
              }}
            >
              {ch}
            </motion.span>
          );
        })}
      </span>

      {/* Code shards layer */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {tokens.map((t, i) => (
          <motion.span
            key={`tok-${i}-${t.text}`}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[0.32em] md:text-[0.28em] font-mono text-cyan-300/30"
            initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
            animate={hovered ? { x: t.x, y: t.y, rotate: t.rot, opacity: 1 } : { x: 0, y: 0, rotate: 0, opacity: 0 }}
            transition={{ type: hovered ? "tween" : "spring", duration: hovered ? 0.35 : 0.5, delay: hovered ? t.delay : 0, stiffness: 180, damping: 22 }}
            aria-hidden
          >
            {t.text}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
