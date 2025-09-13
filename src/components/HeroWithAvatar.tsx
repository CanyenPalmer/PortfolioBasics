// src/components/HeroWithAvatar.tsx
"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import InteractiveAvatar from "@/components/InteractiveAvatar";

type Props = {
  headline: string;
  subheadline: string;
  typer?: string;
};

export default function Hero({ headline, subheadline }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [vec, setVec] = useState({ x: 0, y: 0 });

  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = ref.current;
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
      ref={ref}
    >
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Copy */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">{headline}</h1>
          <p className="text-neutral-300 text-lg">{subheadline}</p>
        </div>

        {/* Avatar */}
        <motion.div
          className="justify-self-center"
          animate={{ rotate: vec.x * 3, translateY: vec.y * 6 }}
          transition={{ type: "spring", stiffness: 120, damping: 14, mass: 0.6 }}
        >
          <InteractiveAvatar
            src="/about/avatar-hero-headshot.png"
            width={768}
            height={1152}
            vec={vec} // pass hero-area cursor to the avatar
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
            // Blink defaults are natural; adjust if you want a livelier vibe:
            // minBlinkSec={2.8}
            // maxBlinkSec={6.5}
          />
        </motion.div>
      </div>
    </section>
  );
}
