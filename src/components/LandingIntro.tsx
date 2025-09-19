// src/components/LandingIntro.tsx
"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

type Props = {
  title?: string;
  skylineSrc?: string;
  buildingsSrc?: string;
};

/**
 * LandingIntro — cinematic, pinned landing section.
 * Fixes per request:
 * 1) Effects isolated to this section (no site-wide formatting changes).
 * 2) Section remains static/pinned while animating.
 * 3) Title sits on the very front, in frame, and drops FIRST; then buildings fall; then unlock scroll.
 *
 * Place ABOVE your Hero in app/page.tsx. Do not change other files.
 */
export default function LandingIntro({
  title = "Let Data Drive Your Decisions",
  skylineSrc = "/images/landing/skyline.png",
  buildingsSrc = "/images/landing/buildings.png",
}: Props) {
  // Tall wrapper + sticky viewport child to "pin" the section during the intro.
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"], // progress 0..1 while sticky viewport is in view
  });

  const reduce = useReducedMotion();

  /**
   * PROGRESSION (kept simple and strictly scoped to local layers):
   * - Title falls first:    progress 0.00 → 0.50  (from visible to off-bottom)
   * - Buildings fall next:  progress 0.18 → 0.88  (from baseline to off-bottom)
   * - Sky subtle zoom ONLY while buildings are exiting: 0.22 → 0.80 (1.00 → 1.03)
   * - Unlock near 0.92 → natural scroll continues to Hero.
   */

  // Title starts visible (in frame), then drops out first.
  // Start a bit below the very top so it's clearly in-frame.
  const titleY = useTransform(scrollYProgress, [0.0, 0.5], ["0vh", "130vh"]);

  // Buildings: slide down after the title begins.
  const bldgY = useTransform(scrollYProgress, [0.18, 0.88], ["0vh", "120vh"]);
  // Slight fade near the end of their exit.
  const bldgOpacity = useTransform(scrollYProgress, [0.72, 0.88], [1, 0.4]);

  // Sky: very subtle zoom ONLY during building exit, then hold (no continuous scaling).
  const skyScale = useTransform(scrollYProgress, [0.22, 0.80], [1, 1.03]);

  return (
    // Tall wrapper provides scroll room; nothing outside is affected.
    <section
      aria-label="Landing Intro"
      className="relative h-[240vh] md:h-[240vh]"
    >
      {/* Sticky viewport — isolates effects to this section */}
      <div
        ref={wrapRef}
        className="sticky top-0 h-screen overflow-hidden bg-black isolate"
      >
        {/* LAYER: SKY (bottom). Scaling this div only — no layout shift. */}
        <motion.div
          className="absolute inset-0 z-0 will-change-transform"
          style={{ scale: reduce ? 1 : skyScale }}
        >
          <Image
            src={skylineSrc}
            alt="Starry anime night sky with moon and subtle clouds"
            fill
            priority
            sizes="100vw"
            className="object-cover pointer-events-none select-none"
          />
        </motion.div>

        {/* LAYER: TITLE (front-most). Drops FIRST. */}
        <motion.h1
          className="absolute left-1/2 top-[18vh] z-30 -translate-x-1/2 text-center font-extrabold tracking-tight text-white"
          style={{
            y: reduce ? "0vh" : titleY,
            willChange: "transform",
          }}
        >
          <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-[0_0_16px_rgba(64,200,255,.25)]">
            {title}
          </span>
        </motion.h1>

        {/* LAYER: BUILDINGS (in front of sky, behind the title per new spec) */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-20 will-change-transform"
          style={{
            y: reduce ? "0vh" : bldgY,
            opacity: reduce ? 1 : bldgOpacity,
          }}
        >
          {/* PNG with transparency; keep intrinsic aspect to avoid layout changes */}
          <Image
            src={buildingsSrc}
            alt=""
            width={3840}
            height={2160}
            priority
            className="w-full h-auto pointer-events-none select-none"
          />
        </motion.div>

        {/* Scroll cue (static, in-section only) */}
        <div className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 text-[12px] tracking-[0.2em] text-slate-200/80">
          • SCROLL TO ENTER •
        </div>

        {/* Reduced-motion helper (no animation; provide jump link) */}
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:absolute focus:bottom-6 focus:left-6 focus:z-50 bg-white/10 text-white rounded px-3 py-2 backdrop-blur"
        >
          Skip intro and jump to hero
        </a>
      </div>
    </section>
  );
}
