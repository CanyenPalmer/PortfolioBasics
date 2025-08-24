"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, animate } from "framer-motion";

/**
 * NameCodeExplode (soft-edge drift)
 * - Origin = exact midpoint between "...Canye[n]" and "[P]almer"
 * - Fullscreen fixed overlay for overlap (not clipped)
 * - Explode → decelerating space-drift with SOFT EDGE FORCE (never offscreen) → rewind on mouse move/leave
 * - Reverse path is perfectly symmetric for the return
 */

type Props = {
  text?: string;
  className?: string;

  // Physics
  intensity?: number; // base throw distance; auto-scales to viewport
  explodeSpring?: { stiffness: number; damping: number };
  returnSpring?: { stiffness: number; damping: number };

  // Visuals
  opacityClass?: string;
  letterClassName?: string;
  shardScale?: number;
  codeShardsPerLetter?: number;
  upLeftSpreadDeg?: number;

  // Floating (decelerating, soft-bounded)
  floatMaxPx?: number;         // nominal extra drift distance if unbounded
  floatDecayPerSec?: number;   // 1 - e^(-k t) rate; higher = slows sooner
  viewportMarginPx?: number;   // keep shards this many px inside the viewport

  // Soft-edge shaping (how gently we approach the cap)
  edgeSoftness?: number;       // 1..5 good range; higher = softer approach to the cap

  overlayZ?: number;           // z-index for overlay
};

const CODE_FRAGMENTS = [
  "import", "def", "return", "if", "else", "for", "while",
  "SELECT *", "JOIN", "GROUP BY", "=>", "lambda",
  "fit()", "predict()", "ROC", "AUC", "mean()", "std()",
  "pd.read_csv()", "groupby()", "merge()", "plt.plot()", "{ }", "< />"
];

function seeded(n: number) { const x = Math.sin(n * 99991) * 10000; return x - Math.floor(x); }
function easeInOutCubic(t: number) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
// Quintic smootherstep: smooth 0→1 ramp without sharp knees
function smootherstep01(s: number) {
  const x = Math.min(1, Math.max(0, s));
  return x * x * x * (x * (6 * x - 15) + 10);
}

type LetterShard = {
  id: string; char: string;
  dx: number; dy: number; rot: number; dirX: number; dirY: number;
};
type CodeShard = {
  id: string; token: string;
  dx: number; dy: number; rot: number; vertical?: boolean; dirX: number; dirY: number;
};

export default function NameCodeExplode({
  text = "Canyen Palmer",
  className = "text-5xl md:text-7xl font-extrabold tracking-tight",

  // feel
  explodeSpring = { stiffness: 220, damping: 26 },
  returnSpring  = { stiffness: 360, damping: 34 },

  intensity = 240,
  upLeftSpreadDeg = 170,

  opacityClass = "text-white/25",
  letterClassName = "",
  shardScale = 0.5,
  codeShardsPerLetter = 6,

  // drift
  floatMaxPx = 160,
  floatDecayPerSec = 0.55,
  viewportMarginPx = 24,

  // soft-edge: 3 = very gentle; 1.5 = firmer
  edgeSoftness = 3,

  overlayZ = 50,
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // 0..1 path parameter (0 = origin; 1 = max explosion radius)
  const progress = useMotionValue(0);

  // modes
  const [mode, setMode] = React.useState<"idle" | "exploding" | "floating" | "returning">("idle");

  // magnitude auto-scales to viewport diagonal
  const [mag, setMag] = React.useState(intensity);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const diag = Math.hypot(window.innerWidth, window.innerHeight);
      setMag(Math.max(intensity, diag * 0.9));
    }
  }, [intensity]);

  // visible text chars
  const chars = React.useMemo(() => [...text], [text]);

  // absolute origin in viewport coords
  const [originAbs, setOriginAbs] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // measure origin at the midpoint of the gap between 'n' and 'P'
  const measureOrigin = React.useCallback(() => {
    const root = containerRef.current;
    if (!root) return;
    const spans = Array.from(root.querySelectorAll<HTMLSpanElement>('[data-layer="visible"][data-letter-idx]'));
    if (!spans.length) return;

    const rects: Array<DOMRect | null> = Array(chars.length).fill(null);
    for (const s of spans) rects[Number(s.dataset.letterIdx)] = s.getBoundingClientRect();

    const tops: number[] = [], bottoms: number[] = [];
    rects.forEach(r => { if (r) { tops.push(r.top); bottoms.push(r.bottom); }});
    const lineCY = (Math.min(...tops) + Math.max(...bottoms)) / 2;

    const leftStart = text.indexOf("Canyen");
    const rightStart = text.indexOf("Palmer");
    let oX = 0, oY = lineCY;

    if (leftStart >= 0 && rightStart >= 0) {
      const rL = rects[leftStart + "Canyen".length - 1]; // 'n'
      const rR = rects[rightStart];                      // 'P'
      if (rL && rR) {
        oX = (rL.right + rR.left) / 2;
      } else {
        const all = root.getBoundingClientRect();
        oX = all.left + all.width / 2;
      }
    } else {
      const all = root.getBoundingClientRect();
      oX = all.left + all.width / 2;
    }

    setOriginAbs({ x: oX, y: oY });
  }, [chars.length, text]);

  React.useLayoutEffect(() => { measureOrigin(); }, [measureOrigin, className, letterClassName, chars.join("")]);
  React.useEffect(() => {
    const onResizeOrScroll = () => measureOrigin();
    window.addEventListener("resize", onResizeOrScroll);
    window.addEventListener("scroll", onResizeOrScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", onResizeOrScroll);
      window.removeEventListener("scroll", onResizeOrScroll);
    };
  }, [measureOrigin]);

  // build shards + normalized directions
  const { codeShards, letterShards } = React.useMemo(() => {
    const code: CodeShard[] = [];
    const letters: LetterShard[] = [];
    let gid = 0;

    const norm = (x: number, y: number) => {
      const L = Math.hypot(x, y) || 1;
      return { x: x / L, y: y / L };
    };

    chars.forEach((ch, ci) => {
      if (ch !== " ") {
        const s0 = ci * 777 + 3;
        const angDegL = -175 + seeded(s0) * upLeftSpreadDeg;
        const ang = (angDegL * Math.PI) / 180;
        const mult = 1.0 + 0.6 * seeded(s0 + 1);
        const dx = Math.cos(ang) * mag * mult;
        const dy = Math.sin(ang) * mag * mult;
        const d = norm(dx, dy);

        letters.push({
          id: `L-${gid++}`,
          char: ch,
          dx, dy,
          rot: -30 + 60 * seeded(s0 + 2),
          dirX: d.x, dirY: d.y,
        });

        for (let s = 0; s < codeShardsPerLetter; s++) {
          const seed = ci * 1000 + s * 17 + 11;
          const r1 = seeded(seed), r2 = seeded(seed + 1), r3 = seeded(seed + 2);
          const ad = -175 + r1 * upLeftSpreadDeg;
          const a = (ad * Math.PI) / 180;
          const m = 1.2 + 1.3 * r2;
          const cdx = Math.cos(a) * mag * m;
          const cdy = Math.sin(a) * mag * m;
          const cd = norm(cdx, cdy);

          code.push({
            id: `C-${gid++}`,
            token: CODE_FRAGMENTS[(ci + s) % CODE_FRAGMENTS.length],
            dx: cdx, dy: cdy,
            rot: -20 + 40 * seeded(seed + 3),
            vertical: r3 > 0.6,
            dirX: cd.x, dirY: cd.y,
          });
        }
      }
    });

    return { codeShards: code, letterShards: letters };
  }, [chars, mag, codeShardsPerLetter, upLeftSpreadDeg]);

  // -------- soft-edge decelerating drift --------
  // nominal outward drift curve: D_nominal(t) = floatMaxPx * (1 - e^{-k t})
  // soft-edge gain: given a cap distance 'cap' along the shard's direction, we apply
  // D_actual = cap * smootherstep( (D_nominal / cap) ^ softness )
  // → approaches 'cap' smoothly, never exceeds it, and eases as we near edges.
  const [capsLetters, setCapsLetters] = React.useState<number[]>([]);
  const [capsCode, setCapsCode] = React.useState<number[]>([]);
  const [floatT, setFloatT] = React.useState(0);

  // compute per-shard directional cap to keep fully inside viewport (with margin)
  const recomputeCaps = React.useCallback(() => {
    if (typeof window === "undefined") return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const M = viewportMarginPx;

    // Available travel along a unit direction (dirX,dirY) starting from pos = origin + [dx,dy]
    const capFor = (dx: number, dy: number, dirX: number, dirY: number) => {
      const startX = originAbs.x + dx;
      const startY = originAbs.y + dy;

      // How far to each edge along dir; pick the nearest
      let capX = Number.POSITIVE_INFINITY;
      let capY = Number.POSITIVE_INFINITY;

      if (Math.abs(dirX) > 1e-6) {
        if (dirX > 0) capX = (vw - M - startX) / dirX;
        else capX = (startX - M) / (-dirX);
      }
      if (Math.abs(dirY) > 1e-6) {
        if (dirY > 0) capY = (vh - M - startY) / dirY;
        else capY = (startY - M) / (-dirY);
      }

      const cap = Math.max(0, Math.min(capX, capY));
      return isFinite(cap) ? cap : 0;
    };

    setCapsLetters(letterShards.map(s => capFor(s.dx, s.dy, s.dirX, s.dirY)));
    setCapsCode(codeShards.map(s => capFor(s.dx, s.dy, s.dirX, s.dirY)));
  }, [originAbs.x, originAbs.y, letterShards, codeShards, viewportMarginPx]);

  React.useEffect(() => { recomputeCaps(); }, [recomputeCaps]);
  React.useEffect(() => {
    const onResize = () => recomputeCaps();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recomputeCaps]);

  // animate progress (explode/return)
  const runTo = React.useCallback((target: 0 | 1, spring: { stiffness: number; damping: number }) => {
    return animate(progress, target, {
      type: "spring",
      stiffness: spring.stiffness,
      damping: spring.damping,
      onComplete: () => {
        if (target === 1) {
          setMode("floating");
          setFloatT(0);
        } else {
          setMode("idle");
          setFloatT(0);
        }
      }
    });
  }, [progress]);

  // interactions
  const beginExplode = React.useCallback(() => {
    if (mode === "idle" || mode === "returning") {
      setMode("exploding");
      runTo(1, explodeSpring);
    }
  }, [mode, runTo, explodeSpring]);

  const beginReturn = React.useCallback(() => {
    if (mode !== "idle") {
      setMode("returning");
      runTo(0, returnSpring);
    }
  }, [mode, runTo, returnSpring]);

  // mouse move returns if currently floating
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = () => { if (mode === "floating") beginReturn(); };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [mode, beginReturn]);

  // eased progress for reversible path
  const eased = React.useRef(0);
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const unsub = progress.on("change", (t) => {
      eased.current = easeInOutCubic(t);
      setTick(v => v + 1);
    });
    return unsub;
  }, [progress]);

  // RAF loop to increment floatT while floating
  React.useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      if (mode === "floating") {
        setFloatT(t => t + dt);
        setTick(v => v + 1);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  // tiny pop threshold
  const THRESH = 0.02;

  // overlay mounting
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // base text (measured; kept in-flow)
  const baseText = (
    <span
      className={`relative inline-block whitespace-pre ${letterClassName}`}
      style={{ opacity: (progress.get() < THRESH) ? 1 : 0, transition: "opacity 0.001s linear" }}
    >
      {chars.map((ch, i) => (
        <span key={`visible-${i}`} data-layer="visible" data-letter-idx={i} className="inline-block">
          {ch}
        </span>
      ))}
    </span>
  );

  // nominal outward drift distance since float began (no bounds)
  const nominalDrift = React.useMemo(() => {
    return (t: number) => floatMaxPx * (1 - Math.exp(-floatDecayPerSec * t));
  }, [floatMaxPx, floatDecayPerSec]);

  // Given a desired drift D_des and a cap, apply soft approach:
  //   gain = smootherstep( (D_des / cap) ^ (1/edgeSoftness) )
  //   D_actual = cap * gain
  // → as D_des approaches cap, D_actual eases toward cap without slamming.
  const applySoftCap = React.useCallback((desired: number, cap: number) => {
    if (cap <= 1e-6) return 0;
    const ratio = desired / cap;
    const shaped = Math.pow(Math.max(0, Math.min(1, ratio)), 1 / edgeSoftness);
    const gain = smootherstep01(shaped);
    return cap * gain;
  }, [edgeSoftness]);

  // fullscreen overlay
  const overlay = (
    <div
      className="fixed left-0 top-0 w-screen h-screen pointer-events-none"
      style={{ zIndex: overlayZ }}
    >
      {/* origin at exact measured pixel */}
      <div className="absolute" style={{ transform: `translate(${originAbs.x}px, ${originAbs.y}px)` }}>
        {/* LETTERS */}
        {letterShards.map((p, i) => {
          const t = eased.current;
          const show = progress.get() >= THRESH;

          // soft-edge drift along direction while floating
          const fd_nominal = mode === "floating" ? nominalDrift(floatT) : 0;
          const fd = mode === "floating" ? applySoftCap(fd_nominal, capsLetters[i] || 0) : 0;

          const x = p.dx * t + p.dirX * fd;
          const y = p.dy * t + p.dirY * fd;
          const r = p.rot * t;

          return (
            <motion.span
              key={p.id}
              className="absolute font-bold"
              aria-hidden
              style={{
                transform: `translate(${x}px, ${y}px) rotate(${r}deg)`,
                opacity: show ? 1 : 0,
                willChange: "transform, opacity",
              }}
            >
              {p.char}
            </motion.span>
          );
        })}

        {/* CODE */}
        {codeShards.map((p, i) => {
          const t = eased.current;
          const show = progress.get() >= THRESH;

          const fd_nominal = mode === "floating" ? nominalDrift(floatT) : 0;
          const fd = mode === "floating" ? applySoftCap(fd_nominal, capsCode[i] || 0) : 0;

          const x = p.dx * t + p.dirX * fd;
          const y = p.dy * t + p.dirY * fd;
          const r = p.rot * t;

          const sx = p.vertical ? 1 : 1 + shardScale * t;
          const sy = p.vertical ? 1 + shardScale * t : 1;

          return (
            <motion.span
              key={p.id}
              className={`absolute font-mono ${opacityClass} text-[0.34em] md:text-[0.30em]`}
              aria-hidden
              style={{
                writingMode: p.vertical ? ("vertical-rl" as any) : undefined,
                transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${sx}, ${sy})`,
                opacity: show ? 1 : 0,
                willChange: "transform, opacity",
              }}
            >
              {p.token}
            </motion.span>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`relative inline-block select-none ${className}`}
      onMouseEnter={() => {
        if (mode === "idle" || mode === "returning") {
          setMode("exploding");
          runTo(1, explodeSpring);
        }
      }}
      onMouseLeave={() => {
        if (mode !== "idle") {
          setMode("returning");
          runTo(0, returnSpring);
        }
      }}
      onFocus={() => {
        if (mode === "idle" || mode === "returning") {
          setMode("exploding");
          runTo(1, explodeSpring);
        }
      }}
      onBlur={() => {
        if (mode !== "idle") {
          setMode("returning");
          runTo(0, returnSpring);
        }
      }}
      role="img"
      aria-label={text}
      tabIndex={0}
    >
      {/* base text kept in-flow for measurement; opacity toggles instantly */}
      {baseText}

      {/* Fullscreen overlay via portal so shards aren't clipped */}
      {mounted ? createPortal(overlay, document.body) : null}
    </div>
  );
}
