"use client";

import * as React from "react";
import { motion } from "framer-motion";

type Props = {
  text?: string;
  className?: string;
  intensity?: number; // how far characters fly
  stagger?: number;
};

const CODE_TOKENS = [
  "import", "def", "SELECT *", "lambda", "Σ", "JOIN", "fit()", "=>", "while", "return",
  "from", "if", "else", "ROC", "∇", "groupby()", "mean()", "{ }", "< />"
];

export default function NameCodeExplode({
  text = "Canyen Palmer",
  className = "text-5xl md:text-7xl font-extrabold tracking-tight",
  intensity = 60,
  stagger = 0.014,
}: Props) {
  const [hovered, setHovered] = React.useState(false);

  // horizontal / vertical offsets only
  const letterOffsets = React.useMemo(() => {
    return [...text].map((_, i) => {
      const dir = i % 4; // alternate directions
      switch (dir) {
        case 0: return { x: intensity, y: 0, rot: 0 };   // right
        case 1: return { x: -intensity, y: 0, rot: 0 };  // left
        case 2: return { x: 0, y: -intensity, rot: 0 };  // up
        default: return { x: 0, y: intensity, rot: 0 };  // down
      }
    });
  }, [text, intensity]);

  // code shards with vertical/horizontal motion
  const tokens = React.useMemo(() => {
    return new Array(10).fill(0).map((_, i) => {
      const dir = i % 4;
      let x = 0, y = 0;
      if (dir === 0) x = intensity * 1.2;
      if (dir === 1) x = -intensity * 1.2;
      if (dir === 2) y = -intensity * 1.2;
      if (dir === 3) y = intensity * 1.2;
      const idx = i % CODE_TOKENS.length;
      return { text: CODE_TOKENS[idx], x, y, rot: 0, delay: i * 0.05 };
    });
  }, [intensity]);

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
      {/* Letters */}
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
              transition={{
                type: "tween",
                duration: hovered ? 0.35 : 0.5,
                delay: i * stagger,
              }}
            >
              {ch}
            </motion.span>
          )
        )}
      </span>

      {/* Code shards */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {tokens.map((t, i) => (
          <motion.span
            key={`tok-${i}`}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[0.32em] md:text-[0.28em] font-mono text-white/25"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={hovered ? { x: t.x, y: t.y, opacity: 1 } : { x: 0, y: 0, opacity: 0 }}
            transition={{ type: "tween", duration: 0.35, delay: hovered ? t.delay : 0 }}
            aria-hidden
          >
            {t.text}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
