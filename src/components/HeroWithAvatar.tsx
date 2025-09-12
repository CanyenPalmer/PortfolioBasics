// src/components/HeroWithAvatar.tsx
"use client";

import Image from "next/image";
import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type Props = {
  headline: string;
  subheadline: string;
  typer: string;
  avatarSrc?: string; // default /images/avatar.png
};

export default function HeroWithAvatar({
  headline,
  subheadline,
  typer,
  avatarSrc = "/images/avatar.png",
}: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 140, damping: 14 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 140, damping: 14 });

  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const onPointerMove = (e: React.PointerEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section id="home" className="relative min-h-[78vh] overflow-hidden border-b border-cyan-400/10" aria-label="Hero">
      {/* Background + shards */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,229,255,.18),transparent_30%),radial-gradient(circle_at_85%_65%,rgba(255,59,212,.14),transparent_28%)]" />
        <div className="absolute inset-0 opacity-[.07] [background:repeating-linear-gradient(0deg,rgba(255,255,255,.07)_0_1px,transparent_1px_3px)]" />
        <div className="absolute left-2 top-14 h-64 w-64 -rotate-12 opacity-80 [mask-image:radial-gradient(closest-side,white,transparent)]">
          <div className="absolute inset-0 bg-[conic-gradient(from_120deg,rgba(0,229,255,.55),transparent_40%)] blur-[1px]" />
        </div>
        <div className="absolute right-4 top-10 h-64 w-64 rotate-6 opacity-80 [mask-image:radial-gradient(closest-side,white,transparent)]">
          <div className="absolute inset-0 bg-[conic-gradient(from_-60deg,rgba(255,59,212,.45),transparent_40%)] blur-[1px]" />
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
        {/* Avatar panel (parallax) */}
        <motion.div
          ref={cardRef}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className="relative mx-auto w-full max-w-[520px] perspective-[1200px]"
        >
          <motion.div
            className="relative rounded-2xl border border-cyan-400/25 bg-[#0b1016]/40 p-3 shadow-[0_0_60px_rgba(0,229,255,.20)]"
            style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="relative overflow-hidden rounded-xl ring-1 ring-cyan-400/25"
              initial={{ scale: 0.985 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div style={{ transform: "translateZ(26px)" }}>
                <Image
                  src={avatarSrc}
                  alt="Stylized 2D avatar of Canyen Palmer"
                  width={1024}
                  height={1024}
                  priority
                  className="block h-auto w-full select-none"
                />
              </motion.div>
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-cyan-400/12" />
            </motion.div>

            {/* Ambient neon chip */}
            <motion.div
              className="pointer-events-none absolute -left-4 top-3 h-20 w-20 rounded-full"
              animate={{ x: [0, 2, 0], y: [0, -2, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              style={{ boxShadow: "0 0 24px rgba(0,229,255,.25), 0 0 48px rgba(255,59,212,.15)" }}
            />
          </motion.div>
        </motion.div>

        {/* Text stack */}
        <div className="relative">
          <motion.h1
            className="text-5xl font-extrabold tracking-tight md:text-6xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <span className="bg-gradient-to-br from-cyan-300 via-cyan-200 to-white bg-clip-text text-transparent">
              {headline}
            </span>
          </motion.h1>

          <motion.p
            className="mt-4 text-lg text-white/75 md:text-xl"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {subheadline}
          </motion.p>

          <motion.p
            className="mt-3 font-mono text-sm text-cyan-300/90 md:text-base"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {typer}
          </motion.p>

          <motion.div
            className="mt-6 h-[2px] w-44 bg-gradient-to-r from-cyan-400/80 via-cyan-200/60 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
          />
        </div>
      </div>

      {/* Header dots */}
      <div className="pointer-events-none absolute left-3 top-3 flex gap-1">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ff5f56] shadow-[0_0_8px_#ff5f56]" />
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ffbd2e] shadow-[0_0_8px_#ffbd2e]" />
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#27c93f] shadow-[0_0_8px_#27c93f]" />
      </div>
      <div className="pointer-events-none absolute right-3 top-3 text-white/40">••</div>
    </section>
  );
}

