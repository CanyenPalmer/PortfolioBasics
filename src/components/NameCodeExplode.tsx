"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, animate } from "framer-motion";

/**
 * NameCodeExplode
 * - Origin = exact midpoint between "...Canye[n]" and "[P]almer"
 * - Fullscreen fixed overlay so shards can overlap other sections (not clipped)
 * - Explode → coast with decelerating drift (never offscreen) → reverse to origin on mouse move/leave
 * - Reverse path is perfectly symmetric for smooth return
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

  // Floating (decelerating, bounded)
  floatMaxPx?: number;         // soft cap for extra drift distance (before bounds)
  floatDecayPerSec?: number;   // higher = slows sooner; used in (1 - e^{-k t})
  viewportMarginPx?: number;   // keep shards this many px inside the viewport
  overlayZ?: number;           // z-index for overlay
};

const CODE_FRAGMENTS = [
  "import","def","return","if","else","for","while",
  "SELECT *","JOIN","GROUP BY","=>","lambda",
  "fit()","predict()","ROC","AUC","mean()","std()",
  "pd.read_csv()","groupby()","merge()","plt.plot()","{ }","< />"
];

function seeded(n: number) { const x = Math.sin(n * 99991) * 10000; return x - Math.floor(x); }
function easeInOutCubic(t: number) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2; }

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
  floatMaxPx = 160,          // typical extra outward drift distance
  floatDecayPerSec = 0.55,   // 0.55 → clear deceleration; raise for quicker slow-down
  viewportMarginPx = 24,     // keep shards fully on-screen
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

  // -------- decelerating drift --------
  // We use fd(t) = cap * (1 - e^{-k t}) so velocity decays smoothly.
  const [floatT, setFloatT] = React.useState(0); // time since float began (seconds)
  const [capsLetters, setCapsLetters] = React.useState<number[]>([]);
  const [capsCode, setCapsCode] = React.useState<number[]>([]);

  // compute per-shard caps so shards never leave the viewport while floating
  const recomputeCaps = React.useCallback(() => {
    if (typeof window === "undefined") return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const M = viewportMarginPx;

    const capFor = (dx: number, dy: number, dirX: number, dirY: number) => {
      // start at position after full explosion (t≈1): (originAbs + [dx,dy])
      // we allow an additional fd * dir along that vector
      // ensure [x,y] stays within [M, vw-M] x [M, vh-M]
      let capX = Number.POSITIVE_INFINITY;
      let capY = Number.POSITIVE_INFINITY;

      if (Math.abs(dirX) > 1e-6) {
        if (dirX > 0) capX = (vw - M - (originAbs.x + dx)) / dirX;
        else capX = ((originAbs.x + dx) - M) / (-dirX);
      }
      if (Math.abs(dirY) > 1e-6) {
        if (dirY > 0) capY = (vh - M - (originAbs.y + dy)) / dirY;
        else capY = ((originAbs.y + dy) - M) / (-dirY);
      }

      const cap = Math.max(0, Math.min(capX, capY, floatMaxPx));
      return isFinite(cap) ? cap : 0;
    };

    setCapsLetters(letterShards.map(s => capFor(s.dx, s.dy, s.dirX, s.dirY)));
    setCapsCode(codeShards.map(s => capFor(s.dx, s.dy, s.dirX, s.dirY)));
  }, [originAbs.x, originAbs.y, letterShards, codeShards, viewportMarginPx, floatMaxPx]);

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
          setFloatT(0); // start decelerating drift timer
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

  // RAF loop to increment floatT while floating (slows via 1 - e^{-k t})
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

  // helper to compute decelerating outward drift amount for shard i
  const driftAmount = (cap: number) => cap * (1 - Math.exp(-floatDecayPerSec * floatT));

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
          const fd = (mode === "floating") ? driftAmount(capsLetters[i] || 0) : 0;

          const x = p.dx * t + p.dirX * fd;
          const y = p.dy * t + p.dirY * fd;
          const r = p.rot * t; // we keep rotation from explosion; no extra spin

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
          const fd = (mode === "floating") ? driftAmount(capsCode[i] || 0) : 0;

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
      onMouseEnter={beginExplode}
      onMouseLeave={beginReturn}
      onFocus={beginExplode}
      onBlur={beginReturn}
      role="img"
      aria-label={text}
      tabIndex={0}
    >
      {baseText}
      {mounted ? createPortal(overlay, document.body) : null}
    </div>
  );
}
