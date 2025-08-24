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

  // Reform timing
  reformHoldMs?: number;

  // Tokens that define the gap (we’ll put origin at exact midpoint between them)
  gapLeftToken?: string;            // defaults to "Canyen"
  gapRightToken?: string;           // defaults to "Palmer"
  gapOccurrence?: number;           // 1 = first pair found
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
  tx: number; ty: number; // target offsets relative to origin
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
  durationMs = 520, // slower outward blast
  ease = "easeInOut",
  returnSpring = { stiffness: 420, damping: 32 },
  opacityClass = "text-white/25",
  letterClassName = "",
  shardScale = 0.5,
  codeShardsPerLetter = 6,
  reformHoldMs = 140,
  gapLeftToken = "Canyen",
  gapRightToken = "Palmer",
  gapOccurrence = 1,
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const chars = React.useMemo(() => [...text], [text]);
  const [mag, setMag] = React.useState(intensity);
  const [originDelta, setOriginDelta] = React.useState<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const [targets, setTargets] = React.useState<Array<{ x: number; y: number }>>([]);

  // Scale magnitude so shards go off-screen
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const diag = Math.hypot(window.innerWidth, window.innerHeight);
      setMag(Math.max(intensity, diag * 0.75));
    }
  }, [intensity]);

  // Helpers to find token positions
  function findTokenStart(arr: string[], needle: string, occurrence = 1): number | null {
    if (!needle) return null;
    let count = 0;
    for (let i = 0; i <= arr.length - needle.length; i++) {
      if (arr.slice(i, i + needle.length).join("") === needle) {
        count++;
        if (count === occurrence) return i;
      }
    }
    return null;
  }

  // Measure per-letter targets and compute origin at the EXACT midpoint between last 'n' of left token and 'P' of right token
  const measure = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const cbox = container.getBoundingClientRect();
    const containerCenterX = cbox.left + cbox.width / 2;
    const containerCenterY = cbox.top + cbox.height / 2;

    // Visible letters in-flow; we toggle opacity via variants, not display.
    const visibleSpans = Array.from(
      container.querySelectorAll<HTMLSpanElement>('[data-layer="visible"][data-letter-idx]')
    );

    if (!visibleSpans.length) return;

    const rects: Array<DOMRect | null> = Array(chars.length).fill(null);
    const centersAbs: Array<{ x: number; y: number } | null> = Array(chars.length).fill(null);

    for (const el of visibleSpans) {
      const idx = Number(el.dataset.letterIdx);
      const r = el.getBoundingClientRect();
      rects[idx] = r;
      centersAbs[idx] = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    // Compute entire line vertical bounds for a stable vertical center
    const tops: number[] = [];
    const bottoms: number[] = [];
    rects.forEach(r => {
      if (r) { tops.push(r.top); bottoms.push(r.bottom); }
    });
    const lineTop = Math.min(...tops);
    const lineBottom = Math.max(...bottoms);
    const lineCY = (lineTop + lineBottom) / 2;

    // Default origin: container center (fallback)
    let originX = containerCenterX;
    let originY = lineCY; // use line center vertically

    // Preferred: gap between tokens
    const leftStart = findTokenStart(chars, gapLeftToken, gapOccurrence);
    const rightStart = findTokenStart(chars, gapRightToken, gapOccurrence);

    if (leftStart !== null && rightStart !== null) {
      const leftEndIdx = leftStart + gapLeftToken.length - 1; // 'n' in "Canyen"
      const rightStartIdx = rightStart;                       // 'P' in "Palmer"
      const leftRect = rects[leftEndIdx];
      const rightRect = rects[rightStartIdx];

      if (leftRect && rightRect) {
        const leftEdge = leftRect.right;
        const rightEdge = rightRect.left;
        // EXACT middle pixel horizontally between 'n' and 'P'
        originX = (leftEdge + rightEdge) / 2;
        // Vertical = middle of the whole name line, not glyph-average
        originY = lineCY;
      }
    } else {
      // Fallback: use space gap if tokens not found
      const spaceIdx = chars.findIndex((c) => c === " ");
      if (spaceIdx >= 1 && spaceIdx < chars.length - 1) {
        const prev = rects[spaceIdx - 1];
        const next = rects[spaceIdx + 1];
        if (prev && next) {
          originX = (prev.right + next.left) / 2;
          originY = lineCY;
        }
      }
    }

    // Convert absolute centers to offsets **relative to that origin**
    const relTargets = centersAbs.map((pt) =>
      pt ? { x: pt.x - originX, y: pt.y - originY } : { x: 0, y: 0 }
    );

    // Shift explosion layer from container center → gap origin
    setOriginDelta({
      dx: originX - containerCenterX,
      dy: originY - containerCenterY,
    });
    setTargets(relTargets);
  }, [chars, gapLeftToken, gapRightToken, gapOccurrence]);

  React.useLayoutEffect(() => {
    measure();
  }, [measure, className, letterClassName, chars.join("")]);

  React.useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  // Build shards using stable seeds; target x/y are patched after measure
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
          const mult = 1.2 + 1.3 * r2;     // many go way off-screen
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
        // keep index alignment for targets (space isn’t a shard)
        targets[ci] ??= { x: 0, y: 0 };
      }
    });

    return { codeShards: code, letterShards: letters };
  }, [chars, mag, codeShardsPerLetter, targets.length]);

  // Patch shards with measured targets
  const patchedLetterShards = React.useMemo(
    () => letterShards.map((ls, i) => {
      const t = targets[i];
      return t ? { ...ls, tx: t.x, ty: t.y } : ls;
    }),
    [letterShards, targets]
  );

  // Animation state
  const TRANS = React.useMemo(() => ({ duration: durationMs / 1000, ease }), [durationMs, ease]);
  const [state, setState] = React.useState<"rest" | "explode" | "implode">("rest");
  const [snapping, setSnapping] = React.useState(false);

  // Visible text layer: kept in-flow for layout; opacity toggled instantly.
  const nameVariants: Variants = {
    rest:    { opacity: 1, transition: { duration: 0.001 } },
    explode: { opacity: 0, transition: { duration: 0.001 } },
    implode: { opacity: 0, transition: { duration: 0.001 } },
  };

  // Letter shards (these *become* the letters during reform)
  const letterShardVariants: Variants = {
    rest:    { x: 0, y: 0, opacity: 0, rotate: 0, scale: 1 },
    explode: (p: { dx: number; dy: number; rot: number }) => ({
      x: p.dx, y: p.dy, rotate: p.rot, opacity: 1,
      scale: 1 + shardScale * 0.25,
      transition: { ...TRANS, opacity: { duration: 0.001 } },
    }),
    // Fly to the exact letter position and **stay visible** (this is the reform moment)
    implode: (p: { tx: number; ty: number }) => ({
      x: p.tx, y: p.ty, rotate: 0, opacity: 1, scale: 1,
      transition: { type: "spring", ...returnSpring },
    }),
  };

  // Code shards
  const codeShardVariants: Variants = {
    rest:    { x: 0, y: 0, opacity: 0, rotate: 0, scaleX: 1, scaleY: 1 },
    explode: (p: { dx: number; dy: number; rot: number; vertical?: boolean }) => ({
      x: p.dx, y: p.dy, rotate: p.rot, opacity: 1,
      scaleX: p.vertical ? 1 : 1 + shardScale,
      scaleY: p.vertical ? 1 + shardScale : 1,
      transition: { ...TRANS, opacity: { duration: 0.001 } },
    }),
    // Fade out on the way back so letters read cleanly
    implode: { x: 0, y: 0, rotate: 0, opacity: 0, scaleX: 1, scaleY: 1, transition: { type: "spring", ...returnSpring } },
  };

  // Snap from shard-formed word to clean text after a brief hold
  const scheduleSnapToRest = React.useCallback(() => {
    setSnapping(true);
    const t = window.setTimeout(() => {
      setSnapping(false);
      setState("rest");
    }, reformHoldMs);
    return () => window.clearTimeout(t);
  }, [reformHoldMs]);

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
        setSnapping(false);
        setState("explode");
      }}
      onHoverEnd={() => setState("implode")}
      role="img"
      aria-label={text}
      tabIndex={0}
    >
      {/* Visible text as per-letter spans (we measure THESE exact boxes) */}
      <motion.span variants={nameVariants} className={`relative inline-block whitespace-pre ${letterClassName}`}>
        {chars.map((ch, i) => (
          <span
            key={`visible-${i}`}
            data-letter-idx={i}
            data-layer="visible"
            className="inline-block"
          >
            {ch}
          </span>
        ))}
      </motion.span>

      {/* EXPLOSION LAYER — shifted so origin is EXACT middle pixel of the gap between 'n' and 'P' */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `translate(calc(-50% + ${originDelta.dx}px), calc(-50% + ${originDelta.dy}px))`,
          }}
        >
          {/* Letter glyph shards (become the letters during reform) */}
          {patchedLetterShards.map((p, idx) => (
            <motion.span
              key={p.id}
              custom={{ dx: p.dx, dy: p.dy, rot: p.rot, tx: p.tx, ty: p.ty }}
              variants={letterShardVariants}
              className="absolute font-bold"
              aria-hidden
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
