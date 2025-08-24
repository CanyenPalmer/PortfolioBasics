"use client";

import * as React from "react";
import { useAnimationFrame, motion } from "framer-motion";

/**
 * NameCodeExplode
 * - Explodes letters + code shards from a precise seam (between first and last word).
 * - Soft-edge field: shards slow rapidly near the viewport/container walls; they don't fly off-screen.
 * - On hover end, shards reverse smoothly back to origin (spring-like).
 *
 * External API kept simple and similar to your usage in Hero.tsx.
 */

type Props = {
  text?: string;                     // e.g. "Canyen Palmer"
  className?: string;                // typographic classes for the name at rest
  intensity?: number;                // base throw strength
  opacityClass?: string;             // class for code shard color (e.g., "text-white/25")
  letterClassName?: string;          // class for the name at rest (extra)
  codeShardsPerLetter?: number;      // how many code shards per letter
  shardScale?: number;               // small scale stretch for code shards
  // Physics tuning
  driftFactor?: number;              // how long shards keep gliding in space (0..1) higher=longer
  edgePaddingPx?: number;            // inner padding from edges where soft wall starts acting
  edgeCushionPx?: number;            // thickness of the soft edge field
  dragLinear?: number;               // baseline drag per second (0..1)
  edgePush?: number;                 // inward push strength near edges
  returnSpring?: { k: number; c: number }; // return spring (stiffness k, damping c)
};

const CODE_FRAGMENTS = [
  "import","def","return","if","else","for","while",
  "SELECT *","JOIN","GROUP BY","=>","lambda",
  "fit()","predict()","ROC","AUC","mean()","std()",
  "pd.read_csv()","groupby()","merge()","plt.plot()","{ }","< />"
];

// seeded psuedorandom (stable)
function seeded(n: number) {
  let x = Math.sin(n * 99991) * 10000;
  return x - Math.floor(x);
}

type Particle = {
  id: string;
  kind: "letter" | "code";
  char?: string;
  token?: string;
  // origin relative to seam-center in pixels
  ox: number; oy: number;
  // current state
  x: number; y: number;             // position relative to seam-center
  vx: number; vy: number;           // velocity px/s
  rot: number; vrot: number;
  vertical?: boolean;               // for code shards
};

export default function NameCodeExplode({
  text = "Canyen Palmer",
  className = "text-5xl md:text-7xl font-extrabold tracking-tight",
  intensity = 220,
  opacityClass = "text-white/25",
  letterClassName = "",
  codeShardsPerLetter = 6,
  shardScale = 0.5,
  driftFactor = 0.92,
  edgePaddingPx = 20,
  edgeCushionPx = 140,
  dragLinear = 0.28,
  edgePush = 900,
  returnSpring = { k: 90, c: 26 },
}: Props) {
  const rootRef = React.useRef<HTMLSpanElement>(null);
  const seamRef = React.useRef<{cx: number; cy: number} | null>(null);
  const [viewport, setViewport] = React.useState({ w: 0, h: 0 });
  const [particles, setParticles] = React.useState<Particle[]>([]);
  const [state, setState] = React.useState<"rest"|"explode">("rest");

  // Measure viewport (or container) for soft walls
  React.useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setViewport({ w, h });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Build letter spans so we can measure the exact seam (space between first/last word)
  const letters = React.useMemo(() => [...text], [text]);

  // We render actual letters in a hidden measuring layer to find seam center in pixels
  const letterRefs = React.useRef<HTMLSpanElement[]>([]);
  letterRefs.current = [];

  const pushRef = (el: HTMLSpanElement | null) => {
    if (el) letterRefs.current.push(el);
  };

  // Compute seam center (between last char before the first space and first char after)
  React.useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const spaceIndex = text.indexOf(" ");
    if (spaceIndex === -1) {
      // fallback: center of the whole name
      const r = el.getBoundingClientRect();
      seamRef.current = { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
      return;
    }

    const before = letterRefs.current[spaceIndex - 1];
    const after = letterRefs.current[spaceIndex + 1];
    const rBefore = before?.getBoundingClientRect();
    const rAfter = after?.getBoundingClientRect();
    const rName = el.getBoundingClientRect();

    if (rBefore && rAfter) {
      const cx = (rBefore.right + rAfter.left) / 2; // exact pixel between n|P
      const cy = rName.top + rName.height / 2;
      seamRef.current = { cx, cy };
    } else {
      // fallback to element center
      const r = rName;
      seamRef.current = { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    }
  }, [text, viewport.w, viewport.h]);

  // Build particles from letters + code tokens (stable, but needs seam to place origins)
  React.useEffect(() => {
    const el = rootRef.current;
    const seam = seamRef.current;
    if (!el || !seam) return;

    const elRect = el.getBoundingClientRect();
    const centerX = seam.cx;
    const centerY = seam.cy;

    // For each letter, get its rect and compute origin relative to seam
    const parts: Particle[] = [];
    let gid = 0;

    letters.forEach((ch, i) => {
      if (ch === " ") return;
      const span = letterRefs.current[i];
      if (!span) return;

      const r = span.getBoundingClientRect();
      const lx = r.left + r.width / 2;
      const ly = r.top + r.height / 2;
      const ox = lx - centerX;
      const oy = ly - centerY;

      // Letter particle
      {
        const s0 = i * 777 + 3;
        const angDeg = -175 + seeded(s0) * 170;          // up-left-ish
        const ang = (angDeg * Math.PI) / 180;
        const mult = 1.0 + 0.6 * seeded(s0 + 1);
        const v0 = intensity * mult;

        parts.push({
          id: `L-${gid++}`,
          kind: "letter",
          char: ch,
          ox, oy,
          x: 0, y: 0,
          vx: Math.cos(ang) * v0,
          vy: Math.sin(ang) * v0,
          rot: 0,
          vrot: (-30 + 60 * seeded(s0 + 2)) * (Math.PI/180) * 0.5,
        });
      }

      // Code shards for this letter
      for (let s = 0; s < codeShardsPerLetter; s++) {
        const seed = i * 1000 + s * 17 + 11;
        const r1 = seeded(seed);
        const r2 = seeded(seed + 1);
        const r3 = seeded(seed + 2);
        const angleDeg = -175 + r1 * 170;      // up-left
        const angle = (angleDeg * Math.PI) / 180;
        const mult = 1.2 + 1.3 * r2;
        const v0 = intensity * mult;
        const vertical = r3 > 0.6;
        const token = CODE_FRAGMENTS[(i + s) % CODE_FRAGMENTS.length];

        parts.push({
          id: `C-${gid++}`,
          kind: "code",
          token,
          ox, oy,
          x: 0, y: 0,
          vx: Math.cos(angle) * v0,
          vy: Math.sin(angle) * v0,
          rot: 0,
          vrot: (-20 + 40 * seeded(seed + 3)) * (Math.PI/180) * 0.5,
          vertical,
        });
      }
    });

    setParticles(parts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letters.join(""), intensity, codeShardsPerLetter, shardScale, viewport.w, viewport.h]);

  // Interaction handlers
  const onEnter = () => setState("explode");
  const onLeave = () => setState("rest");

  // Physics integration
  const lastTs = React.useRef<number | null>(null);

  useAnimationFrame((t) => {
    if (!seamRef.current) return;
    if (lastTs.current == null) lastTs.current = t;
    const dtMs = t - lastTs.current;
    lastTs.current = t;

    // Clamp dt to avoid huge steps on tab refocus
    const dt = Math.min(0.05, Math.max(0.001, dtMs / 1000)); // seconds

    setParticles((prev) => {
      if (prev.length === 0) return prev;
      const next = prev.map((p) => ({ ...p }));

      const W = viewport.w;
      const H = viewport.h;
      const pad = edgePaddingPx;
      const innerL = pad, innerR = W - pad, innerT = pad, innerB = H - pad;

      for (const p of next) {
        // target point (origin) in "rest" is (0,0) relative to each letter's original glyph center
        let ax = 0, ay = 0;

        if (state === "explode") {
          // Space drift: mild drag (linear) to slow down globally
          p.vx *= (1 - dragLinear * dt);
          p.vy *= (1 - dragLinear * dt);
          p.vrot *= (1 - 0.35 * dt);

          // Soft-edge field: the closer to edges, the stronger the inward push + extra damping
          const worldX = p.x + p.ox + seamRef.current!.cx;
          const worldY = p.y + p.oy + seamRef.current!.cy;

          // distance to each inner edge
          const dL = worldX - innerL;
          const dR = innerR - worldX;
          const dT = worldY - innerT;
          const dB = innerB - worldY;

          // Helper to compute push from one edge
          const pushFrom = (d: number) => {
            const s = 1 - Math.min(Math.max(d / edgeCushionPx, 0), 1); // 1 near wall -> 0 away
            return s * s; // smoother
          };

          const fL = pushFrom(dL);
          const fR = pushFrom(dR);
          const fT = pushFrom(dT);
          const fB = pushFrom(dB);

          // inward push (sum)
          ax += edgePush * (fR - fL);
          ay += edgePush * (fB - fT);

          // extra damping near edges so motion visibly slows as it approaches the walls
          const nearEdge = Math.max(fL, fR, fT, fB); // 0..1
          const edgeDamp = 1 - (0.65 * nearEdge);
          p.vx *= edgeDamp;
          p.vy *= edgeDamp;

        } else {
          // Return-to-origin (time reversal feel): spring toward (0,0) with damping
          // position relative to each particle's individual origin
          const dx = p.x;
          const dy = p.y;
          ax += -returnSpring.k * dx - returnSpring.c * p.vx;
          ay += -returnSpring.k * dy - returnSpring.c * p.vy;

          // also slow rotation back to 0
          p.vrot += (-6 * p.rot - 4 * p.vrot) * dt;
        }

        // Integrate
        p.vx += ax * dt;
        p.vy += ay * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vrot * dt;

        // Clamp to inner rect (never leaves the screen)
        const worldX2 = p.x + p.ox + seamRef.current!.cx;
        const worldY2 = p.y + p.oy + seamRef.current!.cy;

        // If out of bounds, softly clamp + bounce-dampen
        if (worldX2 < innerL) {
          p.x += (innerL - worldX2);
          p.vx = Math.abs(p.vx) * 0.35;
        } else if (worldX2 > innerR) {
          p.x -= (worldX2 - innerR);
          p.vx = -Math.abs(p.vx) * 0.35;
        }
        if (worldY2 < innerT) {
          p.y += (innerT - worldY2);
          p.vy = Math.abs(p.vy) * 0.35;
        } else if (worldY2 > innerB) {
          p.y -= (worldY2 - innerB);
          p.vy = -Math.abs(p.vy) * 0.35;
        }
      }

      return next;
    });
  });

  // Render
  return (
    <span
      ref={rootRef}
      className={`relative inline-block select-none ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      role="img"
      aria-label={text}
      tabIndex={0}
      style={{ willChange: "transform" }}
    >
      {/* Visible name at rest */}
      <span className={`relative inline-block ${letterClassName}`}>
        {/* Measuring layer (in-flow) */}
        {letters.map((ch, i) => (
          <span
            key={`m-${i}`}
            ref={pushRef}
            className="inline-block align-baseline"
            aria-hidden
            style={{ visibility: "hidden", position: "relative" }}
          >
            {ch}
          </span>
        ))}
        {/* Actually visible text (overlayed so measuring spans exist) */}
        <span className="absolute inset-0 pointer-events-none" aria-hidden>
          {text}
        </span>
      </span>

      {/* EXPLOSION LAYER — full-screen overlay so shards can overlap other sections */}
      <div className="pointer-events-none fixed inset-0 top-0 left-0 -z-10">
        {/* We render all particles relative to seam center with CSS transforms */}
        {particles.map((p) => {
          const translate = `translate(${p.x + p.ox}px, ${p.y + p.oy}px) rotate(${p.rot}rad)`;
          const baseStyle: React.CSSProperties = {
            position: "absolute",
            left: seamRef.current?.cx ?? 0,
            top: seamRef.current?.cy ?? 0,
            transform: translate,
            transformOrigin: "center",
            whiteSpace: "nowrap",
          };

          if (p.kind === "letter") {
            return (
              <span
                key={p.id}
                style={baseStyle}
                className="font-bold text-white"
                aria-hidden
              >
                {p.char}
              </span>
            );
          }

          // code shard
          const style: React.CSSProperties = { ...baseStyle };
          const cls = `font-mono ${opacityClass} text-[0.34em] md:text-[0.30em]`;
          if (p.vertical) (style as any).writingMode = "vertical-rl";
          const sx = p.vertical ? 1 : 1 + shardScale;
          const sy = p.vertical ? 1 + shardScale : 1;
          style.transform = `${translate} scale(${sx}, ${sy})`;
          return (
            <span key={p.id} style={style} className={cls} aria-hidden>
              {p.token}
            </span>
          );
        })}
      </div>
    </span>
  );
}
