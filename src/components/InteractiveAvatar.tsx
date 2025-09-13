// src/components/InteractiveAvatar.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState, useId } from "react";

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
  /** Intrinsic layout size for the SVG viewBox (not CSS size) */
  width?: number;
  height?: number;

  /** Eye configs tuned to your image */
  leftEye: EyeConfig;
  rightEye: EyeConfig;

  /** External cursor vector in [-1…1] range (optional). If omitted, we listen locally. */
  vec?: Pt;

  /** Blink behavior (natural defaults) */
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

  // Blink state
  const [phase, setPhase] = useState<"idle" | "closing" | "closed" | "opening">("idle");
  const [t, setT] = useState(0); // 0..1 progress in current phase
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Unique IDs for clipPaths (avoids collisions if used multiple times on a page)
  const uid = useId();
  const leftId = `clip-L-${uid}`;
  const rightId = `clip-R-${uid}`;

  // Local mouse tracking if vec not provided
  useEffect(() => {
    if (vec) return;
    const el = boxRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
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

  // Blink scheduler (simple + robust)
  useEffect(() => {
    const clear = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      timerRef.current = null;
      rafRef.current = null;
    };

    const scheduleNext = () => {
      const nextMs = 1000 * (minBlinkSec + Math.random() * (maxBlinkSec - minBlinkSec));
      timerRef.current = setTimeout(() => {
        setPhase("closing");
        setT(0);
        drive(performance.now(), blinkCloseMs, "closed", () => {
          // hold closed
          timerRef.current = setTimeout(() => {
            setPhase("opening");
            setT(0);
            drive(performance.now(), blinkOpenMs, "idle", () => {
              scheduleNext();
            });
          }, blinkHoldMs);
        });
      }, nextMs);
    };

    const drive = (
      start: number,
      duration: number,
      nextPhase: "closed" | "idle",
      onDone: () => void
    ) => {
      const loop = (now: number) => {
        const p = clamp((now - start) / duration, 0, 1);
        setT(p);
        if (p >= 1) {
          setPhase(nextPhase === "closed" ? "closed" : "idle");
          setT(0);
          onDone();
          return;
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    };

    scheduleNext();
    return clear;
  }, [minBlinkSec, maxBlinkSec, blinkCloseMs, blinkHoldMs, blinkOpenMs]);

  const v = vec ?? localVec;

  const eyeCenterPx = (eye: EyeConfig) => {
    const cx = (eye.cxPct / 100) * width;
    const cy = (eye.cyPct / 100) * height;
    return { cx, cy };
  };

  const pupilPos = (eye: EyeConfig) => {
    const { cx, cy } = eyeCenterPx(eye);
    const dx = v.x * eye.travel;
    const dy = v.y * eye.travel;
    return { x: cx + dx, y: cy + dy };
  };

  // Lid amount 0(open)→1(closed)
  const lid = useMemo(() => {
    if (phase === "closing") return t;
    if (phase === "closed") return 1;
    if (phase === "opening") return 1 - t;
    return 0;
  }, [phase, t]);

  const Eye = ({ eye, id }: { eye: EyeConfig; id: string }) => {
    const { cx, cy } = eyeCenterPx(eye);
    const pupil = pupilPos(eye);
    const rot = eye.rotateDeg ?? 0;

    return (
      <g transform={`rotate(${rot}, ${cx}, ${cy})`}>
        <defs>
          <clipPath id={id}>
            <ellipse cx={cx} cy={cy} rx={eye.rx} ry={eye.ry} />
          </clipPath>
        </defs>

        {/* Pupil */}
        <circle
          cx={pupil.x}
          cy={pupil.y}
          r={eye.pupilR}
          fill="rgba(0,0,0,0.75)"
          clipPath={`url(#${id})`}
        />

        {/* Eyelids (top & bottom rects that meet in the middle) */}
        {lid > 0 && (
          <>
            <rect
              x={cx - eye.rx - 2}
              y={cy - eye.ry - 2}
              width={eye.rx * 2 + 4}
              height={(eye.ry + 2) * lid}
              fill="rgba(0,0,0,0.85)"
              clipPath={`url(#${id})`}
            />
            <rect
              x={cx - eye.rx - 2}
              y={cy + eye.ry + 2 - (eye.ry + 2) * lid}
              width={eye.rx * 2 + 4}
              height={(eye.ry + 2) * lid}
              fill="rgba(0,0,0,0.85)"
              clipPath={`url(#${id})`}
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
        // IMPORTANT: let the className (e.g. w-[360px]) control width.
        // We only use aspectRatio to derive height from that width.
        aspectRatio: `${width} / ${height}`,
        contain: "layout paint",
      }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-contain select-none"
        onError={(e) => {
          // Tiny helper to surface path issues during debug
          console.error("Avatar image failed to load:", (e.target as HTMLImageElement).src);
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <Eye eye={leftEye} id={leftId} />
        <Eye eye={rightEye} id={rightId} />
      </svg>
    </div>
  );
}
