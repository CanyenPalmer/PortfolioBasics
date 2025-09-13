// src/components/InteractiveAvatar.tsx
"use client";

import * as React from "react";

type Pt = { x: number; y: number };

export type InteractiveAvatarProps = {
  /** Path under /public, e.g. "/about/avatar-hero.webp" (transparent headshot) */
  src: string;
  alt?: string;

  /** Size via Tailwind classes, e.g. "w-64 md:w-80". You control layout outside. */
  className?: string;

  /** Eye centers as percentages (0–100) of the image box */
  eyeL: Pt;
  eyeR: Pt;

  /** Strength controls */
  rotateMaxDeg?: number;     // default 10
  translateMaxPx?: number;   // default 8
  pupilRangePx?: number;     // default 6
  pupilRadiusPx?: number;    // default 2.8
  pupilColor?: string;       // default "rgba(0,0,0,0.38)"
  showPupils?: boolean;      // default true but very subtle

  /** Normalized vector from parent hero, in [-1,1] each axis */
  vec?: { x: number; y: number };
};

export default function InteractiveAvatar({
  src,
  alt = "Avatar",
  className = "",
  eyeL,
  eyeR,
  rotateMaxDeg = 10,
  translateMaxPx = 8,
  pupilRangePx = 6,
  pupilRadiusPx = 2.8,
  pupilColor = "rgba(0,0,0,0.38)",
  showPupils = true,
  vec,
}: InteractiveAvatarProps) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const v = vec ?? { x: 0, y: 0 };

  // Head transform (turn toward cursor): rotateX/Y + slight translate for parallax
  const rotY = v.x * rotateMaxDeg;     // look left/right
  const rotX = -v.y * rotateMaxDeg;    // look up/down
  const tx = v.x * translateMaxPx;     // small slide
  const ty = v.y * translateMaxPx;

  // Pupils move within a limited radius around eye centers
  const pupilOffset = (n: number) => n * pupilRangePx;

  const pupilStyle = (eye: Pt): React.CSSProperties => ({
    left: `calc(${eye.x}% - ${pupilRadiusPx}px)`,
    top: `calc(${eye.y}% - ${pupilRadiusPx}px)`,
    transform: `translate(${pupilOffset(v.x)}px, ${pupilOffset(v.y)}px)`,
    width: pupilRadiusPx * 2,
    height: pupilRadiusPx * 2,
    background: pupilColor,
  });

  return (
    <div
      className={[
        "relative select-none will-change-transform",
        className,
      ].join(" ")}
      style={
        reduced
          ? undefined
          : {
              transform: `perspective(900px) rotateY(${rotY}deg) rotateX(${rotX}deg) translate3d(${tx}px, ${ty}px, 0)`,
              transition: "transform 120ms ease",
            }
      }
      aria-label="Interactive avatar"
    >
      {/* Transparent PNG/WEBP headshot */}
      <img
        src={src}
        alt={alt}
        className="block h-auto w-full rounded-xl ring-1 ring-cyan-400/15 bg-transparent"
        draggable={false}
      />

      {/* Eye overlay (subtle) */}
      {showPupils && !reduced && (
        <div className="pointer-events-none absolute inset-0">
          <span
            className="absolute rounded-full shadow-[0_0_8px_rgba(0,0,0,0.12)] mix-blend-multiply"
            style={pupilStyle(eyeL)}
          />
          <span
            className="absolute rounded-full shadow-[0_0_8px_rgba(0,0,0,0.12)] mix-blend-multiply"
            style={pupilStyle(eyeR)}
          />
        </div>
      )}
    </div>
  );
}
