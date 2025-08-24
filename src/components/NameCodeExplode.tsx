"use client";

import * as React from "react";
import { motion, useMotionValue, animate } from "framer-motion";

// ---------------- Types ----------------
type Props = {
  text?: string;
  className?: string;

  // Physics
  intensity?: number;                           // throw distance baseline (auto-scales to viewport)
  explodeSpring?: { stiffness: number; damping: number }; // outward spring
  returnSpring?: { stiffness: number; damping: number };  // return spring

  // Visuals
  opacityClass?: string;
  letterClassName?: string;
  shardScale?: number;
  codeShardsPerLetter?: number;
  upLeftSpreadDeg?: number;

  // Space-drift
  floatAmplitudePx?: number;                    // how far shards drift while idle
  floatSpeedHz?: number;                        // drift speed
};

// ---------------- Config ----------------
const CODE_FRAGMENTS = [
  "import","def","return","if","else","for","while",
  "SELECT *","JOIN","GROUP BY","=>","lambda",
  "fit()","predict()","ROC","AUC","mean()","std()",
  "pd.read_csv()","groupby()","merge()","plt.plot()","{ }","< />"
];

function seeded(n: number) { const x = Math.sin(n * 99991) * 10000; return x - Math.floor(x); }
function easeInOutCubic(t: number) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2; }

type LetterShard = { id: string; char: string; dx: number; dy: number; rot: number; phase: number; };
type CodeShard   = { id: string; token: string; dx: number; dy: number; rot: number; vertical?: boolean; phase: number; };

export default function NameCodeExplode({
  text = "Canyen Palmer",
  className = "text-5xl md:text-7xl font-extrabold tracking-tight",

  // tuned: a touch slower on explode, crisp return
  explodeSpring = { stiffness: 220, damping: 26 },
  returnSpring  = { stiffness: 320, damping: 32 },

  intensity = 220,
  upLeftSpreadDeg = 170,

  opacityClass = "text-white/25",
  letterClassName = "",
  shardScale = 0.5,
  codeShardsPerLetter = 6,

  floatAmplitudePx = 14,   // gentle space drift
  floatSpeedHz = 0.12,     // very slow
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // single scalar for path symmetry: 0 = rest, 1 = max explosion
  const progress = useMotionValue(0);

  // simple state machine
  // 'idle' (rest) -> 'exploding' -> 'floating' -> 'returning' -> 'idle'
  const [mode, setMode] = React.useState<"idle" | "exploding" | "floating" | "returning">("idle");

  // viewport-scaled magnitude
  const [mag, setMag] = React.useState(intensity);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const diag = Math.hypot(window.innerWidth, window.innerHeight);
      setMag(Math.max(intensity, diag * 0.75));
    }
  }, [intensity]);

  // ----- Measure exact origin (midpoint between last 'n' of Canyen and 'P' of Palmer) -----
  const chars = React.useMemo(() => [...text], [text]);
  const [originDelta, setOriginDelta] = React.useState({ dx: 0, dy: 0 });

  const measureOrigin = React.useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const cbox = el.getBoundingClientRect();
    const cCX = cbox.left + cbox.width / 2;
    const cCY = cbox.top + cbox.height / 2;

    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-layer="visible"][data-letter-idx]'));
    if (!spans.length) return;

    const rects: Array<DOMRect | null> = Array(chars.length).fill(null);
    for (const s of spans) rects[Number(s.dataset.letterIdx)] = s.getBoundingClientRect();

    const tops: number[] = [], bottoms: number[] = [];
    rects.forEach(r => { if (r) { tops.push(r.top); bottoms.push(r.bottom); }});
    const lineCY = (Math.min(...tops) + Math.max(...bottoms)) / 2;

    const leftStart = text.indexOf("Canyen");
    const rightStart = text.indexOf("Palmer");

    let oX = cCX, oY = lineCY;
    if (leftStart >= 0 && rightStart >= 0) {
      const rL = rects[leftStart + "Canyen".length - 1]; // 'n'
      const rR = rects[rightStart];                      // 'P'
      if (rL && rR) {
        oX = (rL.right + rR.left) / 2;
        oY = lineCY;
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

  // ----- Build shards (deterministic), with per-shard float phase -----
  const { codeShards, letterShards } = React.useMemo(() => {
    const code: CodeShard[] = [];
    const letters: LetterShard[] = [];
    let gid = 0;

    chars.forEach((ch, ci) => {
      if (ch !== " ") {
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
          phase: seeded(s0 + 9) * Math.PI * 2, // unique float phase
        });

        for (let s = 0; s < codeShardsPerLetter; s++) {
          const seed = ci * 1000 + s * 17 + 11;
          const r1 = seeded(seed);
          const r2 = seeded(seed + 1);
          const r3 = seeded(seed + 2);
          const angleDeg = -175 + r1 * upLeftSpreadDeg;
          const angle = (angleDeg * Math.PI) / 180;
          const mult = 1.2 + 1.3 * r2;
          code.push({
            id: `C-${gid++}`,
            token: CODE_FRAGMENTS[(ci + s) % CODE_FRAGMENTS.length],
            dx: Math.cos(angle) * mag * mult,
            dy: Math.sin(angle) * mag * mult,
            rot: -20 + 40 * seeded(seed + 3),
            vertical: r3 > 0.6,
            phase: seeded(seed + 8) * Math.PI * 2,
          });
        }
      }
    });

    return { codeShards: code, letterShards: letters };
  }, [chars, mag, codeShardsPerLetter, upLeftSpreadDeg]);

  // ----- Animate progress with springs -----
  const runTo = React.useCallback((target: 0 | 1, spring: { stiffness: number; damping: number }) => {
    return animate(progress, target, {
      type: "spring",
      stiffness: spring.stiffness,
      damping: spring.damping,
      onComplete: () => {
        if (target === 1) setMode("floating");
        else setMode("idle");
      }
    });
  }, [progress]);

  // kick off explosion on enter; return on leave
  const onMouseEnter = () => {
    if (mode === "idle" || mode === "returning") {
      setMode("exploding");
      runTo(1, explodeSpring);
    }
  };
  const onMouseLeave = () => {
    if (mode !== "idle") {
      setMode("returning");
      runTo(0, returnSpring);
    }
  };

  // while floating, any mouse move -> return
  const onMouseMove = React.useCallback(() => {
    if (mode === "floating") {
      setMode("returning");
      runTo(0, returnSpring);
    }
  }, [mode, runTo]);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("mousemove", onMouseMove);
    return () => el.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  // eased progress for path symmetry
  const eased = React.useRef(0);
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const unsub = progress.on("change", (t) => {
      eased.current = easeInOutCubic(t);
      setTick(v => v + 1);
    });
    return unsub;
  }, [progress]);

  // float clock (runs only while floating)
  const floatTimeRef = React.useRef(0);
  React.useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      if (mode === "floating") {
        floatTimeRef.current += dt;
        setTick(v => v + 1);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  const THRESH = 0.02;

  // helper: drift offsets from phase
  const drift = (phase: number) => {
    // very gentle, slow, circular-ish drift
    const t = floatTimeRef.current * floatSpeedHz * 2 * Math.PI;
    const dx = Math.cos(t + phase) * floatAmplitudePx;
    const dy = Math.sin(t * 0.85 + phase * 1.13) * (floatAmplitudePx * 0.8);
    const r  = Math.sin(t * 0.6 + phase * 0.7) * 2.5; // small rotational wiggle (deg)
    return { dx, dy, r };
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block select-none ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
      role="img"
      aria-label={text}
      tabIndex={0}
    >
      {/* Visible text (measured). Keep it in-flow; toggle opacity instantly */}
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

      {/* EXPLOSION / FLOATING LAYER — origin at exact Canyen|Palmer midpoint */}
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
            const f = mode === "floating" ? drift(p.phase) : { dx: 0, dy: 0, r: 0 };
            return (
              <motion.span
                key={p.id}
                className="absolute font-bold"
                aria-hidden
                style={{
                  transform: `translate(${p.dx * t + f.dx}px, ${p.dy * t + f.dy}px) rotate(${p.rot * t + f.r}deg)`,
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
            const f = mode === "floating" ? drift(p.phase) : { dx: 0, dy: 0, r: 0 };
            return (
              <motion.span
                key={p.id}
                className={`absolute font-mono ${opacityClass} text-[0.34em] md:text-[0.30em]`}
                aria-hidden
                style={{
                  writingMode: p.vertical ? ("vertical-rl" as any) : undefined,
                  transform: `translate(${p.dx * t + f.dx}px, ${p.dy * t + f.dy}px) rotate(${p.rot * t + f.r}deg) scale(${sx}, ${sy})`,
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
