"use client";

import * as React from "react";
import { motion, Variants } from "framer-motion";

type Props = {
  text?: string;
  className?: string;

  // Motion & feel
  intensity?: number;        // how far code shards fly (px)
  durationMs?: number;       // explosion duration (ms) for both layers
  ease?: string;             // easing curve name
  returnSpring?: { stiffness: number; damping: number }; // warp-back spring

  // Visuals
  opacityClass?: string;     // code color (e.g. "text-white/25")
  shardScale?: number;       // extra streakiness (0..1.2)
  shardsPerLetter?: number;  // how many code shards per letter
};

// Short code tokens used as particles
const CODE_FRAGMENTS = [
  "import", "def", "return", "if", "else", "for", "while",
  "SELECT *", "JOIN", "GROUP BY", "=>", "lambda",
  "fit()", "predict()", "ROC", "AUC", "mean()", "std()",
  "pd.read_csv()", "groupby()", "merge()", "plt.plot()", "{ }", "< />"
];

// deterministic-ish pseudo-random (so SSR/CSR match)
function seeded(n: number) {
  let x = Math.sin(n * 99991) * 10000;
  return x - Math.floor(x);
}

export default function NameCodeExplode({
  text = "Canyen Palmer",
  className = "text-5xl md:text-7xl font-extrabold tracking-tight",
  intensity = 140,
  durationMs = 260,
  ease = "easeInOut",
  returnSpring = { stiffness: 360, damping: 32 },
  opacityClass = "text-white/25",
  shardScale = 0.45,
  shardsPerLetter = 6,
}: Props) {
  // Build shard data once (stable across renders)
  const shards = React.useMemo(() => {
    const chars = [...text];
    const out: Array<{
      id: string;
      token: string;
      // target offsets for the explosion (left/up only)
      dx: number;
      dy: number;
      rot: number;
      vertical?: boolean;
    }> = [];

    let gid = 0;
    chars.forEach((ch, ci) => {
      if (ch === " ") return; // skip spaces
      for (let s = 0; s < shardsPerLetter; s++) {
        const seed = ci * 1000 + s * 7 + 13;
        const r1 = seeded(seed);
        const r2 = seeded(seed + 1);
        const r3 = seeded(seed + 2);

        // Angle biased toward LEFT/UP so it doesn't go into the image (no right/down)
        // Range: -170°..-10° (mostly up-left)
        const angleDeg = -170 + r1 * 160;
        const angle = (angleDeg * Math.PI) / 180;

        // Range multiplier so some shards go farther
        const mag = intensity * (0.6 + 0.6 * r2);

        const dx = Math.cos(angle) * mag;
        const dy = Math.sin(angle) * mag;

        // Some shards vertical-rl to look more "codey"
        const vertical = r3 > 0.6;

        const token = CODE_FRAGMENTS[(ci + s) % CODE_FRAGMENTS.length];

        out.push({
          id: `shard-${gid++}`,
          token,
          dx,
          dy,
          rot: (-20 + 40 * seeded(seed + 3)), // small twist
          vertical,
        });
      }
    });
    return out;
  }, [text, intensity, shardsPerLetter]);

  // Shared transitions
  const TRANS = React.useMemo(
    () => ({ duration: durationMs / 1000, ease }),
    [durationMs, ease]
  );

  // LETTERS: visible at rest, fade to 0 on explode; fade back on return
  const letterVariants: Variants = {
    rest: { opacity: 1, transition: TRANS },
    explode: { opacity: 0, transition: TRANS },
    implode: { opacity: 1, transition: { type: "spring", ...returnSpring } },
  };

  // SHARDS: hidden at rest; on explode they appear + fly away (left/up only) with streak scale;
  // on implode they warp (spring) back to center and fade out immediately (no slide-in).
  const shardVariants: Variants = {
    rest: { x: 0, y: 0, opacity: 0, rotate: 0, scale: 1 },
    explode: (p: { dx: number; dy: number; rot: number; vertical?: boolean }) => ({
      x: p.dx,
      y: p.dy,
      rotate: p.rot,
      opacity: 1,
      scaleX: p.vertical ? 1 : 1 + shardScale,
      scaleY: p.vertical ? 1 + shardScale : 1,
      transition: TRANS,
    }),
    implode: {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 0,
      scaleX: 1,
      scaleY: 1,
      transition: { type: "spring", ...returnSpring },
    },
  };

  // Parent drives one timeline for EVERYTHING -> perfect sync
  const [state, setState] = React.useState<"rest" | "explode" | "implode">("rest");

  return (
    <motion.div
      className={`relative inline-block select-none ${className}`}
      initial="rest"
      animate={state}
      onHoverStart={() => setState("explode")}
      onHoverEnd={() => setState("implode")}
      role="img"
      aria-label={text}
      tabIndex={0}
    >
      {/* NAME (fades out/in exactly with shard timeline) */}
      <span aria-hidden className="relative inline-block">
        {[...text].map((ch, i) =>
          ch === " " ? (
            <span key={`sp-${i}`} className="inline-block w-[0.4em]" />
          ) : (
            <motion.span
              key={`ch-${i}-${ch}`}
              className="inline-block"
              variants={letterVariants}
            >
              {ch}
            </motion.span>
          )
        )}
      </span>

      {/* CODE EXPLOSION (behind the letters; allowed to overlap text) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* We render all shards centered on the name block; they blast left/up only */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {shards.map((p) => (
            <motion.span
              key={p.id}
              custom={{ dx: p.dx, dy: p.dy, rot: p.rot, vertical: p.vertical }}
              variants={shardVariants}
              className={`absolute font-mono ${opacityClass} text-[0.34em] md:text-[0.30em]`}
              style={{ writingMode: p.vertical ? ("vertical-rl" as any) : undefined }}
              aria-hidden
            >
              {p.token}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
