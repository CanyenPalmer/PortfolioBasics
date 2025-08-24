"use client";

import * as React from "react";
import { motion, Variants } from "framer-motion";

type Props = {
  text?: string;
  className?: string;

  // Explosion feel
  intensity?: number;              // base distance; auto-scales to go off-screen
  durationMs?: number;             // explode duration (higher = slower)
  ease?: string;                   // easing for explode
  returnSpring?: { stiffness: number; damping: number }; // warp-back spring

  // Visuals
  opacityClass?: string;           // color for code shards (e.g., "text-white/25")
  letterClassName?: string;        // class for the name at rest
  shardScale?: number;             // stretch shards a bit (0..1.2)
  codeShardsPerLetter?: number;    // how many code shards per letter
};

const CODE_FRAGMENTS = [
  "import","def","return","if","else","for","while",
  "SELECT *","JOIN","GROUP BY","=>","lambda",
  "fit()","predict()","ROC","AUC","mean()","std()",
  "pd.read_csv()","groupby()","merge()","plt.plot()","{ }","< />"
];

function seeded(n: number) {
  let x = Math.sin(n * 99991) * 10000;
  return x - Math.floor(x);
}

export default function NameCodeExplode({
  text = "Canyen Palmer",
  className = "text-5xl md:text-7xl font-extrabold tracking-tight",
  intensity = 200,
  durationMs = 520, // ⬅️ doubled vs before → ~half speed
  ease = "easeInOut",
  returnSpring = { stiffness: 420, damping: 32 },
  opacityClass = "text-white/25",
  letterClassName = "",
  shardScale = 0.5,
  codeShardsPerLetter = 6,
}: Props) {
  // Compute viewport-scaled throw so shards go OFF-SCREEN
  const [mag, setMag] = React.useState(intensity);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const diag = Math.hypot(window.innerWidth, window.innerHeight);
      setMag(Math.max(intensity, diag * 0.75)); // more than before → bigger blast
    }
  }, [intensity]);

  // Build shards (stable)
  const { codeShards, letterShards } = React.useMemo(() => {
    const chars = [...text];
    const code: Array<{ id: string; token: string; dx: number; dy: number; rot: number; vertical?: boolean; }> = [];
    const letters: Array<{ id: string; char: string; dx: number; dy: number; rot: number; }> = [];
    let gid = 0;

    chars.forEach((ch, ci) => {
      if (ch !== " ") {
        // Letter shard (glyph flies)
        const s0 = ci * 777 + 3;
        const angDegL = -175 + seeded(s0) * 170; // up-left sector only
        const angL = (angDegL * Math.PI) / 180;
        const multL = 1.0 + 0.6 * seeded(s0 + 1);
        letters.push({
          id: `L-${gid++}`,
          char: ch,
          dx: Math.cos(angL) * mag * multL,
          dy: Math.sin(angL) * mag * multL,
          rot: -30 + 60 * seeded(s0 + 2),
        });

        // Code shards around each letter
        for (let s = 0; s < codeShardsPerLetter; s++) {
          const seed = ci * 1000 + s * 17 + 11;
          const r1 = seeded(seed);
          const r2 = seeded(seed + 1);
          const r3 = seeded(seed + 2);
          const angleDeg = -175 + r1 * 170;        // up-left
          const angle = (angleDeg * Math.PI) / 180;
          const mult = 1.2 + 1.3 * r2;             // many go way off-screen
          const dx = Math.cos(angle) * mag * mult;
          const dy = Math.sin(angle) * mag * mult;
          const vertical = r3 > 0.6;
          const token = CODE_FRAGMENTS[(ci + s) % CODE_FRAGMENTS.length];

          code.push({
            id: `C-${gid++}`,
            token, dx, dy,
            rot: -20 + 40 * seeded(seed + 3),
            vertical,
          });
        }
      }
    });

    return { codeShards: code, letterShards: letters };
  }, [text, mag, codeShardsPerLetter]);

  // One clock
  const TRANS = React.useMemo(() => ({ duration: durationMs / 1000, ease }), [durationMs, ease]);
  const [state, setState] = React.useState<"rest" | "explode" | "implode">("rest");

  // Base name: no visible fade — instantly hide at explode start; instantly show at end of implode spring.
  const nameVariants: Variants = {
    rest:    { opacity: 1 },
    explode: { opacity: 0, transition: { duration: 0.001 } },                  // instant handoff
    implode: { opacity: 1, transition: { type: "spring", ...returnSpring } },  // pop back
  };

  // Letter glyph shards
  const letterShardVariants: Variants = {
    rest:    { x: 0, y: 0, opacity: 0, rotate: 0, scale: 1 },
    explode: (p: { dx: number; dy: number; rot: number }) => ({
      x: p.dx, y: p.dy, rotate: p.rot, opacity: 1,
      scale: 1 + shardScale * 0.25,
      // opacity shows immediately so there is no visible cross-fade
      transition: { ...TRANS, opacity: { duration: 0.001 } },
    }),
    implode: { x: 0, y: 0, rotate: 0, opacity: 0, scale: 1, transition: { type: "spring", ...returnSpring } },
  };

  // Code shards
  const codeShardVariants: Variants = {
    rest:    { x: 0, y: 0, opacity: 0, rotate: 0, scaleX: 1, scaleY: 1 },
    explode: (p: { dx: number; dy: number; rot: number; vertical?: boolean }) => ({
      x: p.dx, y: p.dy, rotate: p.rot, opacity: 1,
      scaleX: p.vertical ? 1 : 1 + shardScale,
      scaleY: p.vertical ? 1 + shardScale : 1,
      transition: { ...TRANS, opacity: { duration: 0.001 } }, // appear instantly, then fly
    }),
    implode: { x: 0, y: 0, rotate: 0, opacity: 0, scaleX: 1, scaleY: 1, transition: { type: "spring", ...returnSpring } },
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
      {/* NAME at rest (visible). On explode: instantly hidden (no fade). */}
      <motion.span variants={nameVariants} className={`relative inline-block ${letterClassName}`}>
        {text}
      </motion.span>

      {/* EXPLOSION LAYER — centered on the name; shards blast up-left only */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Letter glyph shards */}
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

          {/* Code shards */}
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
