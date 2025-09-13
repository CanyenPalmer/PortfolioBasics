// src/components/HeroWithAvatar.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import AvatarFace from "@/components/AvatarFace";

type Props = {
  headline: string;
  subheadline: string;
  typer?: string;
};

export default function Hero({ headline, subheadline, typer }: Props) {
  return (
    <div className="container mx-auto max-w-7xl px-6 py-20 md:py-28">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        {/* Left: copy */}
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

          {typer ? (
            <p className="text-cyan-300/90">{typer}</p>
          ) : null}

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

        {/* Right: avatar (NEW behavior: face mouse + eye tracking) */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center md:justify-end"
        >
          <AvatarFace
            // Size the avatar here (match what you had before)
            className="w-56 md:w-72 xl:w-80"
            // Tune these percentages so the pupils sit in your eyes.
            // Start values below work well for a centered portrait.
            eyeL={{ x: 41, y: 44 }}
            eyeR={{ x: 59, y: 44 }}
            // Feel tweaks (optional):
            pupilRangePx={6}
            pupilRadiusPx={3}
            rotateMaxDeg={10}
            translateMaxPx={8}
          >
            {/* KEEP your image src & classes exactly as before: */}
            <Image
              src="/about/pose-1-power.webp"  // ← if your hero uses a different file, use that path
              alt="Canyen Palmer"
              width={600}
              height={720}
              className="rounded-xl ring-1 ring-cyan-400/15 bg-black/20"
              priority
            />
          </AvatarFace>
        </motion.div>
      </div>
    </div>
  );
}
