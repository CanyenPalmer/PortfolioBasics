// src/components/AvatarFace.tsx
"use client";

import * as React from "react";

type Pt = { x: number; y: number };

export type AvatarFaceProps = {
  /** The avatar image (use your existing <Image> or <img/>) */
  children: React.ReactNode;
  /** Percent positions of each eye center within the image box (0–100). */
  eyeL: Pt; // e.g., { x: 39, y: 44 }
  eyeR: Pt; // e.g., { x: 58, y: 45 }
  /** Max pupil movement from each eye center, in px (default 6). */
  pupilRangePx?: number;
  /** Pupil radius (default 3). */
  pupilRadiusPx?: number;
  /** Head "turn" intensity: degrees and px translations. */
  rotateMaxDeg?: number; // default 10
  translateMaxPx?: number; // default 10
  /** Optional extra classes for the wrapper (use to size the avatar). */
  className?: string;
};

/**
 * Wraps your avatar image and adds:
 *  - head turning toward the cursor (subtle rotate + translate)
 *  - pupils that track the cursor within a limited range
 * Respects prefers-reduced-motion.
 */
export default function AvatarFace({
  children,
  eyeL,
  eyeR,
  pupilRangePx = 6,
  pupilRadiusPx = 3,
  rotateMaxDeg = 10,
  translateMaxPx = 10,
  className = "",
}: AvatarFaceProps) {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const [vec, setVec] = React.useState({ x: 0, y: 0 });
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const onMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Cursor relative to center of the avatar box, normalized to [-1, 1]
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nx = ((e.clientX - cx) / (rect.width / 2));
    const ny = ((e.clientY - cy) / (rect.height / 2));
    // Clamp
    const x = Math.max(-1, Math.min(1, nx));
    const y = Math.max(-1, Math.min(1, ny));
    setVec({ x, y });
  }, []);

  const onLeave = React.useCallback(() => {
    setVec({ x: 0, y: 0 });
  }, []);

  // Head transform (turn toward cursor): subtle rotate + translate
  const rotY = vec.x * rotateMaxDeg;     // look left/right
  const rotX = -vec.y * rotateMaxDeg;    // look up/down (invert for natural feel)
  const tx = vec.x * translateMaxPx;     // slight parallax slide
  const ty = vec.y * translateMaxPx;

  // Pupils track cursor inside each eye’s small range
  const pupilOffset = (v: number) => v * pupilRangePx;

  const eyeStyle = (eye: Pt) => {
    // eye coords are in percent; convert to CSS positioning
    const left = `calc(${eye.x}% - ${pupilRadiusPx}px)`;
    const top = `calc(${eye.y}% - ${pupilRadiusPx}px)`;
    const px = pupilOffset(vec.x);
    const py = pupilOffset(vec.y);
    return {
      left,
      top,
      transform: `translate(${px}px, ${py}px)`,
      width: pupilRadiusPx * 2,
      height: pupilRadiusPx * 2,
    } as React.CSSProperties;
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={reduced ? undefined : onMove}
      onMouseLeave={reduced ? undefined : onLeave}
      className={[
        "relative select-none will-change-transform",
        // size the avatar via parent or pass className (e.g., w-56 md:w-72)
        className,
      ].join(" ")}
      style={
        reduced
          ? undefined
          : ({
              transform: `perspective(900px) rotateY(${rotY}deg) rotateX(${rotX}deg) translate3d(${tx}px, ${ty}px, 0)`,
              transition: "transform 120ms ease",
            } as React.CSSProperties)
      }
    >
      {/* Your image */}
      <div className="relative">
        {children}
        {/* Optional subtle ambient glow frame */}
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-cyan-400/15" />
      </div>

      {/* Pupils overlay (two small dots that track) */}
      <div className="pointer-events-none absolute inset-0">
        <span
          className="absolute rounded-full bg-cyan-200/95 shadow-[0_0_8px_rgba(0,255,255,0.6)]"
          style={eyeStyle(eyeL)}
        />
        <span
          className="absolute rounded-full bg-cyan-200/95 shadow-[0_0_8px_rgba(0,255,255,0.6)]"
          style={eyeStyle(eyeR)}
        />
      </div>
    </div>
  );
}
