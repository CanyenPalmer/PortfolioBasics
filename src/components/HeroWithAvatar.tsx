// src/components/HeroWithAvatar.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import InteractiveAvatar from "@/components/InteractiveAvatar";

type Props = {
  headline: string;
  subheadline: string;
  typer?: string;
};

export default function Hero({ headline, subheadline, typer }: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [vec, setVec] = React.useState({ x: 0, y: 0 });

  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // Normalize cursor relative to hero center → [-1, 1]
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const nx = (e.clientX - cx) / (r.width / 2);
    const ny = (e.clientY - cy) / (r.height / 2);
    setVec({
      x: Math.max(-1, Math.min(1, nx)),
      y: Math.max(-1, Math.min(1, ny)),
    });
  };

  const onLeave = () => setVec({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="container mx-auto max-w-7xl px-6 py-20 md:py-28"
      aria-label="Hero"
    >
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        {/* Copy */}
        <div className="space-y-5">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-semibold tracking-tight text-white/95 md:text-4xl"
          >
            {headline}
          </motion.h1>

          {typer ? <p className="text-cyan-300/90">{typer}</p> : null}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="max-w-prose text-white/80"
          >
            {subheadline}
          </motion.p>
        </div>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center md:justify-end"
        >
          <InteractiveAvatar
            // Put the transparent headshot you approved here:
            src="/about/avatar-hero-headshot.png"
            alt="Canyen Palmer"
            className="w-56 md:w-72 xl:w-80"
            // Fine-tune these so the pupils sit on your eyes.
            // These are good starting values for the 3:4 headshot I delivered.
            eyeL={{ x: 41, y: 47 }}
            eyeR={{ x: 59, y: 47 }}
            rotateMaxDeg={10}
            translateMaxPx={8}
            pupilRangePx={6}
            pupilRadiusPx={2.8}
            pupilColor="rgba(0,0,0,0.38)"
            showPupils={true}
            vec={vec}  // ← cursor from the entire hero area
          />
        </motion.div>
      </div>
    </div>
  );
}
