// src/components/InteractiveAvatar.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * InteractiveAvatar
 * - Renders your transparent PNG as the base.
 * - Two SVG eye "sockets" (ellipses) sit precisely over the eyes.
 * - Pupils are real circles that move within each socket (clamped).
 * - Eyelids animate over the sockets in sync to blink.
 *
 * No external deps. Tailwind optional (only for simple sizing/shadows).
 */

type Pt = { x: number; y: number };

type EyeConfig = {
  /** Eye center as % of image box (0–100) */
  cxPct: number;
  cyPct: number;
  /** Ellipse radii for the socket (px). Tune to fit your whites/iris. */
  rx: number;
  ry: number;
  /** Optional rotation of the socket to match your eye angle (degrees) */
  rotateDeg?: number;
  /** Pupil radius (px) and max travel from socket center (px) */
  pupilR: number;
  travel: number;
};

export type InteractiveAvatarProps = {
  /** Path under /public */
  src: string;
  alt?: string;
  className?: string;
  /** Intrinsic layout size (component scales responsively with CSS) */
  width?: number;
  height?: number;

  /** Eye configs tuned to *your* image */
  leftEye: EyeConfig;
  rightEye: EyeConfig;

  /** External cursor vector in [-1…1] range (optional). If omitted, we listen locally. */
  vec?: Pt;

  /** Blink behavior */
  minBlinkSec?: number; // default 3
  maxBlinkSec?: number; // default 7
  blinkCloseMs?: number; // default 120
  blinkHoldMs?: number;  // default 60
  blinkOpenMs?: number;  // default 140
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export default function InteractiveAvatar({
  src,
  alt = "Avatar",
  className = "",
  width = 768,
  height = 1152,

  leftEye,
  rightEye,

  vec,
  minBlinkSec = 3,
  maxBlinkSec = 7,
  blinkCloseMs = 120,
  blinkHoldMs = 60,
  blinkOpenMs = 140,
}: InteractiveAvatarProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [localVec, setLocalVec] = useState<Pt>({ x: 0, y: 0 });
  const [blinkPhase, setBlinkPhase] = useState<"idle" | "closing" | "closed" | "opening">("idle");
  const [blinkT, setBlinkT] = useState(0); // 0..1 progress within the active phase

  // If no external vec is passed, derive from mouse inside the component.
  useEffect(() => {
    if (vec) return;
    const el = boxRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      // Normalize to [-1..1] with center at mid box
      const nx = (mx / r.width) * 2 - 1;
      const ny = (my / r.height) * 2 - 1;
      setLocalVec({ x: clamp(nx, -1, 1), y: clamp(ny, -1, 1) });
    };
    const onLeave = () => setLocalVec({ x: 0, y: 0 });

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [vec]);

  // Blink scheduler (randomized natural cadence)
  useEffect(() => {
    let raf = 0;
    let timeout: any;

    const scheduleNext = () => {
      const nextMs = 1000 * (minBlinkSec + Math.random() * (maxBlinkSec - minBlinkSec));
      timeout = setTimeout(() => {
        setBlinkPhase("closing");
        setBlinkT(0);
      }, nextMs);
    };

    const tick = (tsPrev: number) => (tsNow: number) => {
      const dt = tsNow - tsPrev;
      if (blinkPhase === "closing") {
        setBlinkT((t) => {
          const nt = t + dt / blinkCloseMs;
          if (nt >= 1) {
            setBlinkPhase("closed");
            return 1;
          }
          raf = requestAnimationFrame(tick(tsNow));
          return nt;
        });
      } else if (blinkPhase === "closed") {
        setTimeout(() => {
          setBlinkPhase("opening");
          setBlinkT(0);
          raf = requestAnimationFrame(tick(performance.now()));
        }, blinkHoldMs);
      } else if (blinkPhase === "opening") {
        setBlinkT((t) => {
          const nt = t + dt / blinkOpenMs;
          if (nt >= 1) {
            setBlinkPhase("idle");
            setBlinkT(0);
            scheduleNext();
            return 1;
          }
          raf = requestAnimationFrame(tick(tsNow));
          return nt;
        });
      }
    };

    // Start the scheduler
    scheduleNext();

    // Drive the first RAF only during active phases
    const observer = new MutationObserver(() => {
      if (blinkPhase === "closing" || blinkPhase === "opening") {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick(performance.now()));
      }
    });
    observer.observe(document.documentElement, { attributes: false, childList: false, subtree: false });

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [minBlinkSec, maxBlinkSec, blinkCloseMs, blinkHoldMs, blinkOpenMs, blinkPhase]);

  // Which vector to use?
  const v = vec ?? localVec;

  const eyeToPx = (eye: EyeConfig) => {
    const cx = (eye.cxPct / 100) * width;
    const cy = (eye.cyPct / 100) * height;
    return { cx, cy };
  };

  // Pupil position from vector, clamped to a circle/ellipse
  const pupilPos = (eye: EyeConfig) => {
    const { cx, cy } = eyeToPx(eye);
    const dx = v.x * eye.travel;
    const dy = v.y * eye.travel;
    return { x: cx + dx, y: cy + dy };
  };

  // Eyelid scale based on blinkPhase/blinkT (0 open → 1 fully closed)
  const lid = (() => {
    if (blinkPhase === "closing") return blinkT;
    if (blinkPhase === "closed") return 1;
    if (blinkPhase === "opening") return 1 - blinkT;
    return 0;
  })();

  // Single eye group
  const Eye = ({ eye, side }: { eye: EyeConfig; side: "L" | "R" }) => {
    const { cx, cy } = eyeToPx(eye);
    const pupil = pupilPos(eye);

    return (
      <g transform={`rotate(${eye.rotateDeg ?? 0}, ${cx}, ${cy})`}>
        {/* Socket: defines the visible region for pupil + iris */}
        <defs>
          <clipPath id={`clip-${side}`}>
            <ellipse cx={cx} cy={cy} rx={eye.rx} ry={eye.ry} />
          </clipPath>
        </defs>

        {/* Pupil (appears only within socket) */}
        <circle
          cx={pupil.x}
          cy={pupil.y}
          r={eye.pupilR}
          fill="rgba(0,0,0,0.7)"
          clipPath={`url(#clip-${side})`}
        />

        {/* Eyelid — scales from top & bottom toward center for a natural blink */}
        {lid > 0 && (
          <>
            <rect
              x={cx - eye.rx - 2}
              y={cy - eye.ry - 2}
              width={eye.rx * 2 + 4}
              height={(eye.ry + 2) * lid}
              fill="rgba(0,0,0,0.85)"
              clipPath={`url(#clip-${side})`}
            />
            <rect
              x={cx - eye.rx - 2}
              y={cy + eye.ry + 2 - (eye.ry + 2) * lid}
              width={eye.rx * 2 + 4}
              height={(eye.ry + 2) * lid}
              fill="rgba(0,0,0,0.85)"
              clipPath={`url(#clip-${side})`}
            />
          </>
        )}
      </g>
    );
  };

  return (
    <div
      ref={boxRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: `${width} / ${height}`,
        contain: "layout paint",
      }}
    >
      {/* Base avatar */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-contain select-none"
      />

      {/* Eyes overlay */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <Eye eye={leftEye} side="L" />
        <Eye eye={rightEye} side="R" />
      </svg>
    </div>
  );
}
