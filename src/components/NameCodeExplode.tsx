"use client";

import * as React from "react";
import { motion, Variants } from "framer-motion";

type Props = {
  text?: string;
  className?: string;

  // Explosion feel
  intensity?: number;              // base distance if viewport not known (px)
  durationMs?: number;             // explode duration
  ease?: string;                   // easing for explode
  returnSpring?: { stiffness: number; damping: number }; // warp-back spring

  // Visuals
  opacityClass?: string;           // color for code shards (e.g., "text-white/25")
  letterClassName?: string;        // class for name at rest
  shardScale?: number;             // stretch shards a bit (0..1.2)
  codeShardsPerLetter?: number;    // how many code shards per letter
};

// Code tokens used as particles
const CODE_FRAGMENTS = [
  "import", "def", "return", "if", "else", "for", "while",
  "SELECT *", "JOIN", "GROUP BY", "=>", "lambda",
  "fit()", "predict()", "ROC", "AUC", "mean()", "std()",
  "pd.read_csv()", "groupby()", "merge()", "plt.plot()", "{ }", "< />"
];

// deterministic-ish PRNG so SSR/CSR match
function seeded(n: number) {
  let x = Math.sin(n * 99991) * 10000;
  return x - Math.floor(x);
}

export default function NameCodeExplode({
  text = "Canyen Palmer",
  className = "text-5xl md:text-7xl font-extrabold tracking-tight",
  intensity = 200, // base; we’ll scale it with viewport to go off-screen
  durationMs = 260,
  ease = "easeInOut",
  returnSpring = { stiffness: 420, damping: 32 },
  opacityClass = "text-white/25",
  letterClassName = "",
  shardScale = 0.5,
  codeShardsPerLetter = 6,
}: Props) {
  // Compute a viewport-scaled magnitude so shards fly OFF-SCREEN
  const [mag, setMag] = React.useState(intensity);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const diag = Math.hypot(window.innerWidth, window.innerHeight);
      // ~60% of diagonal tends to exit viewport in left/up quadrants
      setMag(Math.max(intensity, diag * 0.6));
    }
  }, [intensity]);

  // Build shard payloads once (stable)
  const { codeShards, letterShards } = React.useMemo(() => {
    const chars = [...text];
    const code: Array<{
      id: string; token: string; dx: number; dy: number; rot: number; vertical?: boolean;
    }> = [];
    const letterParts: Array<{
      id: string; char: string; dx: number; dy: number; rot: number;
    }> = [];

    let gid = 0;

    chars.forEach((ch, ci) => {
      if (ch !== " ") {
        // Make the letter itself a shard (it will fly away)
        {
          const s0 = ci * 777 + 3;
          // Bias angles to LEFT/UP only so we avoid the headshot
          // Angle range: -175°..-5° (up-left sector)
          const angDeg = -175 + seeded(s0) * 170;
          const ang = (angDeg * Math.PI) / 180;
          const mult = 0.9 + 0.4 * seeded(s0 + 1);   // some further than others
          letterParts.push({
            id: `L-${gid++}`,
            char: ch,
            dx: Math.cos(ang) * mag * mult,
            dy: Math.sin(ang) * mag * mult,
            rot: (-30 + 60 * seeded(s0 + 2)),
          });
        }

        // Additional code shards around each letter
        for (let s = 0; s < codeShardsPerLetter; s++) {
          const seed = ci * 1000 + s * 17 + 11;
          const r1 = seeded(seed);
          const r2 = seeded(seed + 1);
          const r3 = seeded(seed + 2);

          // Up-left sector again
          const angleDeg = -175 + r1 * 170;
          const angle = (angleDeg * Math.PI) / 180;

          // Push many off-screen
          const mult = 1.0 + 1.0 * r2; // 1.0..2.0
          const dx = Math.cos(angle) * mag * mult;
          const dy = Math.sin(angle) * mag * mult;

          const vertical = r3 > 0.6;
          const token = CODE_FRAGMENTS[(ci + s) % CODE_FRAGMENTS.length];

          code.push({
            id: `C-${gid++}`,
            token,
            dx,
            dy,
            rot: (-20 + 40 * seeded(seed + 3)),
            vertical,
          });
        }
      }
    });

    return { codeShards: code, letterShards: letterParts };
  }, [text, mag, codeShardsPerLetter]);

  // Shared transitions (ONE CLOCK)
  const TRANS = React.useMemo(
    () => ({ duration: durationMs / 1000, ease }),
    [durationMs, ease]
  );

  // Parent drives everything
  const [state, setState] = React.useState<"rest" | "explode" | "implode">("rest");

  // LETTERS at rest (visible); on explode they **become shards** (fly the glyphs),
  // then on implode they warp back and the base name fades in.
  const nameVariants: Variants = {
    rest:    { opacity: 1, transition: TRANS },
    explode: { opacity: 0, transition: TRANS }, // hidden while shards fly
    implode: { opacity: 1, transition: { type: "spring", ...returnSpring } },
  };

  // Each LETTER SHARD (glyph) flies like code shards
  const letterShardVariants: Variants = {
    rest: { x: 0, y: 0, opacity: 0, rotate: 0, scale: 1 },
    explode: (p: { dx: number; dy: number; rot: number }) => ({
      x: p.dx, y: p.dy, rotate: p.rot, opacity: 1,
      scale: 1 + shardScale * 0.25,
      transition: TRANS,
    }),
    implode: {
      x: 0, y: 0, rotate: 0, opacity: 0, scale: 1,
      transition: { type: "spring", ...returnSpring },
    },
  };

  // CODE SHARDS — same behavior
  const codeShardVariants: Variants = {
    rest: { x: 0, y: 0, opacity: 0, rotate: 0, scaleX: 1, scaleY: 1 },
    explode: (p: { dx: number; dy: number; rot: number; vertical?: boolean }) => ({
      x: p.dx, y: p.dy, rotate: p.rot, opacity: 1,
      scaleX: p.vertical ? 1 : 1 + shardScale,
      scaleY: p.vertical ? 1 + shardScale : 1,
      transition: TRANS,
    }),
    implode: {
      x: 0, y: 0, rotate: 0, opacity: 0, scaleX: 1, scaleY: 1,
      transition: { type: "spring", ...returnSpring },
    },
  };

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
      {/* NAME at rest (visible) */}
      <motion.span variants={nameVariants} className={`relative inline-block ${letterClassName}`}>
        {text}
      </motion.span>

      {/* EXPLOSION LAYER — centered behind the name */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Letter shards (glyphs) */}
          {letterShards.map((p) => (
            <motion.span
              key={p.id}
              custom={{ dx: p.dx, dy: p.dy, rot: p.rot }}
              variants={letterShardVariants}
              className="absolute font-bold"
              aria-hidden
            >
              {p.char}
            </motion.span>
          ))}

          {/* Code shards (tokens) */}
          {codeShards.map((p) => (
            <motion.span
              key={p.id}
              custom={{ dx: p.dx, dy: p.dy, rot: p.rot, vertical: p.vertical }}
              variants={codeShardVariants}
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
