"use client";

import * as React from "react";
import { motion, useMotionValue, animate } from "framer-motion";

// ---------- Types ----------
type Props = {
  text?: string;
  className?: string;

  // Explosion feel
  intensity?: number;                 // base distance; auto-scales to go off-screen
  explodeDurationMs?: number;         // timing for 0→1 (used in easing only)
  returnSpring?: { stiffness: number; damping: number }; // time-symmetric spring for 1→0 and 0→1

  // Visuals
  opacityClass?: string;              // color for code shards (e.g., "text-white/25")
  letterClassName?: string;
  shardScale?: number;                // anisotropic stretch of code shards
  codeShardsPerLetter?: number;

  // Geometry
  upLeftSpreadDeg?: number;           // how wide the blast cone is (default 170°)
};

// ---------- Config ----------
const CODE_FRAGMENTS = [
  "import","def","return","if","else","for","while",
  "SELECT *","JOIN","GROUP BY","=>","lambda",
  "fit()","predict()","ROC","AUC","mean()","std()",
  "pd.read_csv()","groupby()","merge()","plt.plot()","{ }","< />"
];

// stable 0..1
function seeded(n: number) {
  let x = Math.sin(n * 99991) * 10000;
  return x - Math.floor(x);
}

// smooth, symmetric curve for both directions
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

type LetterShard = {
  id: string; char: string;
  dx: number; dy: number; rot: number;
};

type CodeShard = {
  id: string; token: string;
  dx: number; dy: number; rot: number;
  vertical?: boolean;
};

export default function NameCodeExplode({
  text = "Canyen Palmer",
  className = "text-5xl md:text-7xl font-extrabold tracking-tight",
  intensity = 220,
  explodeDurationMs = 520,
  returnSpring = { stiffness: 420, damping: 32 },
  opacityClass = "text-white/25",
  letterClassName = "",
  shardScale = 0.5,
  codeShardsPerLetter = 6,
  upLeftSpreadDeg = 170,
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // single scalar that drives everything (0 = rest/origin, 1 = fully exploded)
  const progress = useMotionValue(0);
  const [hovering, setHovering] = React.useState(false);

  // magnitude scales with viewport to ensure off-screen throw
  const [mag, setMag] = React.useState(intensity);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const diag = Math.hypot(window.innerWidth, window.innerHeight);
      setMag(Math.max(intensity, diag * 0.75));
    }
  }, [intensity]);

  // ----- Find exact gap midpoint between "...Canye[n]" and "[P]almer" (from visible letters) -----
  const chars = React.useMemo(() => [...text], [text]);
  const [originDelta, setOriginDelta] = React.useState<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  const measureOrigin = React.useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const cbox = el.getBoundingClientRect();
    const cCX = cbox.left + cbox.width / 2;
    const cCY = cbox.top + cbox.height / 2;

    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-layer="visible"][data-letter-idx]'));
    if (!spans.length) return;

    // Collect rects in index order
    const rects: Array<DOMRect | null> = Array(chars.length).fill(null);
    for (const s of spans) {
      const idx = Number(s.dataset.letterIdx);
      rects[idx] = s.getBoundingClientRect();
    }

    // Compute line vertical center
    const tops: number[] = [];
    const bottoms: number[] = [];
    rects.forEach(r => { if (r) { tops.push(r.top); bottoms.push(r.bottom); }});
    const lineCY = (Math.min(...tops) + Math.max(...bottoms)) / 2;

    // Find "Canyen" then "Palmer"
    const leftStart = text.indexOf("Canyen");
    const rightStart = text.indexOf("Palmer");

    let oX = cCX;
    let oY = lineCY;

    if (leftStart >= 0 && rightStart >= 0) {
      const leftEndIdx = leftStart + "Canyen".length - 1; // index of the 'n'
      const rightStartIdx = rightStart;                   // index of the 'P'
      const rL = rects[leftEndIdx];
      const rR = rects[rightStartIdx];

      if (rL && rR) {
        const leftEdge = rL.right;
        const rightEdge = rR.left;
        oX = (leftEdge + rightEdge) / 2; // exact middle pixel horizontally
        oY = lineCY;                     // vertical middle of the line
      }
    }

    setOriginDelta({ dx: oX - cCX, dy: oY - cCY });
  }, [chars.length, text]);

  React.useLayoutEffect(() => { measureOrigin(); }, [measureOrigin, className, letterClassName, chars.join("")]);
  React.useEffect(() => {
    const onResize = () => measureOrigin();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measureOrigin]);

  // ----- Build shards (deterministic) -----
  const { codeShards, letterShards } = React.useMemo(() => {
    const code: CodeShard[] = [];
    const letters: LetterShard[] = [];
    let gid = 0;

    chars.forEach((ch, ci) => {
      if (ch !== " ") {
        // letter shards
        const s0 = ci * 777 + 3;
        const angDegL = -175 + seeded(s0) * upLeftSpreadDeg; // up-left cone
        const angL = (angDegL * Math.PI) / 180;
        const multL = 1.0 + 0.6 * seeded(s0 + 1);

        letters.push({
          id: `L-${gid++}`,
          char: ch,
          dx: Math.cos(angL) * mag * multL,
          dy: Math.sin(angL) * mag * multL,
          rot: -30 + 60 * seeded(s0 + 2),
        });

        // code shards around each letter
        for (let s = 0; s < codeShardsPerLetter; s++) {
          const seed = ci * 1000 + s * 17 + 11;
          const r1 = seeded(seed);
          const r2 = seeded(seed + 1);
          const r3 = seeded(seed + 2);
          const angleDeg = -175 + r1 * upLeftSpreadDeg;
          const angle = (angleDeg * Math.PI) / 180;
          const mult = 1.2 + 1.3 * r2; // goes far off-screen often
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
    // mag & upLeftSpreadDeg affect throws
  }, [chars, mag, codeShardsPerLetter, upLeftSpreadDeg]);

  // ----- Drive progress (time-symmetric) -----
  React.useEffect(() => {
    const controls = animate(progress, hovering ? 1 : 0, {
      type: "spring",
      stiffness: returnSpring.stiffness,
      damping: returnSpring.damping,
      // same spring both ways => reversible path/velocity profile
    });
    return controls.stop;
  }, [hovering, progress, returnSpring.stiffness, returnSpring.damping]);

  // tiny threshold for “instant pop in/out”
  const THRESH = 0.02;

  // Helper to map progress → eased (for all shards uniformly)
  const eased = React.useRef(0);
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    // subscribe to motion value and re-render cheaply
    const unsub = progress.on("change", (t) => {
      eased.current = easeInOutCubic(t);
      setTick((v) => v + 1); // minimal re-render trigger
    });
    return unsub;
  }, [progress]);

  // ----- Render -----
  return (
    <div
      ref={containerRef}
      className={`relative inline-block select-none ${className}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      role="img"
      aria-label={text}
      tabIndex={0}
    >
      {/* Visible text (measured for the origin). Keep it in-flow and toggle opacity instantly. */}
      <span
        className={`relative inline-block whitespace-pre ${letterClassName}`}
        style={{ opacity: (progress.get() < THRESH) ? 1 : 0, transition: "opacity 0.001s linear" }}
      >
        {chars.map((ch, i) => (
          <span
            key={`visible-${i}`}
            data-layer="visible"
            data-letter-idx={i}
            className="inline-block"
          >
            {ch}
          </span>
        ))}
      </span>

      {/* EXPLOSION LAYER — origin pinned to the exact middle pixel of the Canyen|Palmer gap */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `translate(calc(-50% + ${originDelta.dx}px), calc(-50% + ${originDelta.dy}px))`,
          }}
        >
          {/* Letter shards */}
          {letterShards.map((p) => {
            const t = eased.current;
            const show = progress.get() >= THRESH;
            return (
              <motion.span
                key={p.id}
                className="absolute font-bold"
                aria-hidden
                style={{
                  transform: `translate(${p.dx * t}px, ${p.dy * t}px) rotate(${p.rot * t}deg)`,
                  opacity: show ? 1 : 0,
                }}
              >
                {p.char}
              </motion.span>
            );
          })}

          {/* Code shards */}
          {codeShards.map((p) => {
            const t = eased.current;
            const show = progress.get() >= THRESH;
            const sx = p.vertical ? 1 : 1 + shardScale * t;
            const sy = p.vertical ? 1 + shardScale * t : 1;
            return (
              <motion.span
                key={p.id}
                className={`absolute font-mono ${opacityClass} text-[0.34em] md:text-[0.30em]`}
                aria-hidden
                style={{
                  writingMode: p.vertical ? ("vertical-rl" as any) : undefined,
                  transform: `translate(${p.dx * t}px, ${p.dy * t}px) rotate(${p.rot * t}deg) scale(${sx}, ${sy})`,
                  opacity: show ? 1 : 0,
                }}
              >
                {p.token}
              </motion.span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

