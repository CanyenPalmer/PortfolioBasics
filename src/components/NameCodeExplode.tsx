"use client";

import * as React from "react";
import { motion, Variants } from "framer-motion";

type Props = {
  text?: string;
  className?: string;

  // Explosion feel
  intensity?: number;               // base distance; auto-scales to go off-screen
  durationMs?: number;              // explode duration (higher = slower)
  ease?: string;                    // easing for explode
  returnSpring?: { stiffness: number; damping: number }; // warp-back spring

  // Visuals
  opacityClass?: string;            // color for code shards (e.g., "text-white/25")
  letterClassName?: string;         // class for the name at rest
  shardScale?: number;              // stretch shards a bit (0..1.2)
  codeShardsPerLetter?: number;     // how many code shards per letter

  // Timing: how long to let shards “settle” on letters before snapping to clean text
  reformHoldMs?: number;
};

const CODE_FRAGMENTS = [
  "import","def","return","if","else","for","while",
  "SELECT *","JOIN","GROUP BY","=>","lambda",
  "fit()","predict()","ROC","AUC","mean()","std()",
  "pd.read_csv()","groupby()","merge()","plt.plot()","{ }","< />"
];

// Cheap stable PRNG in [0,1)
function seeded(n: number) {
  let x = Math.sin(n * 99991) * 10000;
  return x - Math.floor(x);
}

type LetterShard = {
  id: string; char: string;
  dx: number; dy: number; rot: number;
  tx: number; ty: number;                // target offsets for reform (computed from DOM)
};

type CodeShard = {
  id: string; token: string;
  dx: number; dy: number; rot: number;
  vertical?: boolean;
};

export default function NameCodeExplode({
  text = "Canyen Palmer",
  className = "text-5xl md:text-7xl font-extrabold tracking-tight",
  intensity = 200,
  durationMs = 520, // slower blast per your last request
  ease = "easeInOut",
  returnSpring = { stiffness: 420, damping: 32 },
  opacityClass = "text-white/25",
  letterClassName = "",
  shardScale = 0.5,
  codeShardsPerLetter = 6,
  reformHoldMs = 140, // brief moment to *see* the shards form the letters
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const probeRef = React.useRef<HTMLDivElement>(null);
  const [mag, setMag] = React.useState(intensity);
  const chars = React.useMemo(() => [...text], [text]);

  // Compute viewport-scaled magnitude so shards go off-screen
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const diag = Math.hypot(window.innerWidth, window.innerHeight);
      setMag(Math.max(intensity, diag * 0.75));
    }
  }, [intensity]);

  // Measure per-letter target offsets so shards can “reform” the name precisely
  const [targets, setTargets] = React.useState<Array<{ x: number; y: number }>>([]);
  const measureTargets = React.useCallback(() => {
    const container = containerRef.current;
    const probe = probeRef.current;
    if (!container || !probe) return;

    const cbox = container.getBoundingClientRect();
    // The explosion origin is at the *center* (we center an inner box)
    const originX = cbox.left + cbox.width / 2;
    const originY = cbox.top + cbox.height / 2;

    const spans = Array.from(probe.querySelectorAll<HTMLSpanElement>("[data-letter-idx]"));
    const out: Array<{ x: number; y: number }> = [];

    spans.forEach((el) => {
      const idx = Number(el.dataset.letterIdx);
      const r = el.getBoundingClientRect();
      // Use the center of each glyph box
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      out[idx] = { x: cx - originX, y: cy - originY };
    });

    setTargets(out);
  }, []);

  React.useLayoutEffect(() => {
    measureTargets();
  }, [chars.join(""), measureTargets, className, letterClassName]);

  React.useEffect(() => {
    // remeasure on resize since positions change
    const onResize = () => measureTargets();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measureTargets]);

  // Build shards using stable seeds; add target x/y once measured
  const { codeShards, letterShards } = React.useMemo(() => {
    const code: CodeShard[] = [];
    const letters: LetterShard[] = [];
    let gid = 0;

    chars.forEach((ch, ci) => {
      if (ch !== " ") {
        const s0 = ci * 777 + 3;
        const angDegL = -175 + seeded(s0) * 170; // up-left sector
        const angL = (angDegL * Math.PI) / 180;
        const multL = 1.0 + 0.6 * seeded(s0 + 1);

        // Temp tx/ty until we measure; we’ll patch via effect later if needed
        const tx = targets[ci]?.x ?? 0;
        const ty = targets[ci]?.y ?? 0;

        letters.push({
          id: `L-${gid++}`,
          char: ch,
          dx: Math.cos(angL) * mag * multL,
          dy: Math.sin(angL) * mag * multL,
          rot: -30 + 60 * seeded(s0 + 2),
          tx, ty,
        });

        for (let s = 0; s < codeShardsPerLetter; s++) {
          const seed = ci * 1000 + s * 17 + 11;
          const r1 = seeded(seed);
          const r2 = seeded(seed + 1);
          const r3 = seeded(seed + 2);
          const angleDeg = -175 + r1 * 170;
          const angle = (angleDeg * Math.PI) / 180;
          const mult = 1.2 + 1.3 * r2;
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
      } else {
        // still reserve a slot so indices match for targets
        targets[ci] ??= { x: 0, y: 0 };
      }
    });

    return { codeShards: code, letterShards: letters };
    // include targets length so we rebuild when measured
  }, [chars, mag, codeShardsPerLetter, targets.length]);

  // Keep letterShards in sync with measured targets
  const patchedLetterShards = React.useMemo(() => {
    return letterShards.map((ls, i) => {
      const t = targets[i];
      return t ? { ...ls, tx: t.x, ty: t.y } : ls;
    });
  }, [letterShards, targets]);

  // One clock for the outward blast
  const TRANS = React.useMemo(() => ({ duration: durationMs / 1000, ease }), [durationMs, ease]);
  const [state, setState] = React.useState<"rest" | "explode" | "implode">("rest");
  const [snapping, setSnapping] = React.useState(false); // true when we’re about to swap to clean text

  // Base name: visible only at rest. During explode & implode, we hide it so shards are the show.
  const nameVariants: Variants = {
    rest:    { opacity: 1 },
    explode: { opacity: 0, transition: { duration: 0.001 } },
    implode: { opacity: 0, transition: { duration: 0.001 } },
  };

  // Letter glyph shards (these become the letters during reform)
  const letterShardVariants: Variants = {
    rest:    { x: 0, y: 0, opacity: 0, rotate: 0, scale: 1 },
    explode: (p: { dx: number; dy: number; rot: number }) => ({
      x: p.dx, y: p.dy, rotate: p.rot, opacity: 1,
      scale: 1 + shardScale * 0.25,
      transition: { ...TRANS, opacity: { duration: 0.001 } },
    }),
    // Fly to the exact letter position and *stay visible* (this visually “reforms” the word)
    implode: (p: { tx: number; ty: number }) => ({
      x: p.tx, y: p.ty, rotate: 0, opacity: 1, scale: 1,
      transition: { type: "spring", ...returnSpring },
    }),
  };

  // Code shards: fly out and back to center, then get out of the way
  const codeShardVariants: Variants = {
    rest:    { x: 0, y: 0, opacity: 0, rotate: 0, scaleX: 1, scaleY: 1 },
    explode: (p: { dx: number; dy: number; rot: number; vertical?: boolean }) => ({
      x: p.dx, y: p.dy, rotate: p.rot, opacity: 1,
      scaleX: p.vertical ? 1 : 1 + shardScale,
      scaleY: p.vertical ? 1 + shardScale : 1,
      transition: { ...TRANS, opacity: { duration: 0.001 } },
    }),
    // Collapse back to origin and fade so the letters can read cleanly
    implode: { x: 0, y: 0, rotate: 0, opacity: 0, scaleX: 1, scaleY: 1, transition: { type: "spring", ...returnSpring } },
  };

  // When we hover out (implode), we let letter shards land on their targets,
  // hold briefly so it reads as a *reform*, then snap to clean text state.
  const scheduleSnapToRest = React.useCallback(() => {
    setSnapping(true);
    const t = window.setTimeout(() => {
      setSnapping(false);
      setState("rest");
    }, reformHoldMs);
    return () => window.clearTimeout(t);
  }, [reformHoldMs]);

  // Kick off “snap to rest” once the *first* letter finishes its implode spring
  const onLetterImplodeComplete = React.useCallback(() => {
    if (state === "implode" && !snapping) {
      scheduleSnapToRest();
    }
  }, [state, snapping, scheduleSnapToRest]);

  return (
    <motion.div
      ref={containerRef}
      className={`relative inline-block select-none ${className}`}
      initial="rest"
      animate={state}
      onHoverStart={() => {
        // Cancel any pending snap and explode
        setSnapping(false);
        setState("explode");
      }}
      onHoverEnd={() => {
        // Head back in and reform
        setState("implode");
      }}
      role="img"
      aria-label={text}
      tabIndex={0}
    >
      {/* Visible name only at REST */}
      <motion.span variants={nameVariants} className={`relative inline-block ${letterClassName}`}>
        {text}
      </motion.span>

      {/* Hidden probe used for precise per-letter measurement */}
      <div className="absolute inset-0 pointer-events-none opacity-0 -z-50">
        <div ref={probeRef} className={`whitespace-pre ${letterClassName}`}>
          {chars.map((ch, i) => (
            <span key={`probe-${i}`} data-letter-idx={i} className="inline-block">
              {ch}
            </span>
          ))}
        </div>
      </div>

      {/* EXPLOSION LAYER — centered on the name; shards blast up-left only */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Letter glyph shards (these *become* the letters during implode) */}
          {patchedLetterShards.map((p, idx) => (
            <motion.span
              key={p.id}
              custom={{ dx: p.dx, dy: p.dy, rot: p.rot, tx: p.tx, ty: p.ty }}
              variants={letterShardVariants}
              className="absolute font-bold"
              aria-hidden
              // Use the first letter as our “animation done” sentinel for the snap
              onAnimationComplete={idx === 0 ? onLetterImplodeComplete : undefined}
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
