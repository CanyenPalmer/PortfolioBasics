// src/components/HeroWithAvatar.tsx
"use client";

import React, { useRef, useState } from "react";
import InteractiveAvatar from "@/components/InteractiveAvatar";

type Props = {
  headline: string;
  subheadline: string;
  /** Optional typing-line text your page.tsx passes through */
  typer?: string;
};

export default function Hero({ headline, subheadline, typer }: Props) {
  const areaRef = useRef<HTMLDivElement | null>(null);
  const [vec, setVec] = useState({ x: 0, y: 0 });

  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = areaRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    setVec({ x: Math.max(-1, Math.min(1, nx)), y: Math.max(-1, Math.min(1, ny)) });
  };
  const onLeave = () => setVec({ x: 0, y: 0 });

  return (
    <section
      id="home"
      className="relative min-h-[72vh] overflow-hidden flex items-center"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      ref={areaRef}
    >
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Copy */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">{headline}</h1>
          <p className="text-neutral-300 text-lg">{subheadline}</p>
          {/* Render typer if provided, otherwise omit */}
          {typer ? (
            <p className="text-sm text-neutral-400 leading-relaxed">{typer}</p>
          ) : null}
        </div>

        {/* Avatar (dependency-free) */}
        <div className="justify-self-center">
          <InteractiveAvatar
            src="/about/avatar-hero-headshot.png"
            width={768}
            height={1152}
            vec={vec}
            className="w-[300px] md:w-[360px] drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
            leftEye={{
              cxPct: 40.5,
              cyPct: 38.0,
              rx: 22,
              ry: 14,
              rotateDeg: -3,
              pupilR: 6,
              travel: 7,
            }}
            rightEye={{
              cxPct: 60.5,
              cyPct: 38.0,
              rx: 22,
              ry: 14,
              rotateDeg: 3,
              pupilR: 6,
              travel: 7,
            }}
          />
        </div>
      </div>
    </section>
  );
}
