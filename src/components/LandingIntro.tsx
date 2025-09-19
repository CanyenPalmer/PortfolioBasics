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
 * LandingIntro — pinned landing section with scroll-locked choreography:
 *  1) Title drops first
 *  2) Buildings slide off bottom while sky subtly zooms
 *  3) Only after buildings are fully gone does scroll unlock to Hero
 *
 * Fixes requested:
 *  - User is locked in this section until buildings fully exit
 *  - No formatting or layout impact on Hero/About or anything else on the page
 */
export default function LandingIntro({
  title = "Let Data Drive Your Decisions",
  skylineSrc = "/images/landing/skyline.png",
  buildingsSrc = "/images/landing/buildings.png",
}: Props) {
  /**
   * We "pin" with a tall wrapper and a sticky child filling the viewport.
   * The sticky child stays fixed while the wrapper scrolls behind it.
   * When the wrapper's height is exhausted, the sticky releases and
   * the page continues to the next section.
   *
   * To ensure the user remains locked until the buildings are fully gone,
   * we:
   *  - make the wrapper tall enough (h-[300vh])
   *  - map animations so buildings finish at ~0.98 progress
   *  - release right after that (natural sticky behavior)
   */
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"], // progress 0..1 only while THIS section is in control
  });

  const reduce = useReducedMotion();

  // ---- CHOREOGRAPHY (remapped to finish just before release) ----
  // Title: starts visible and drops out first (0.00 -> 0.48)
  const titleY = useTransform(scrollYProgress, [0.0, 0.48], ["0vh", "130vh"]);

  // Buildings: start after title begins; finish at ~0.98 so lock holds till they're gone
  const bldgY = useTransform(scrollYProgress, [0.12, 0.98], ["0vh", "130vh"]);
  const bldgOpacity = useTransform(scrollYProgress, [0.80, 0.98], [1, 0.35]);

  // Sky: subtle zoom only during the building exit window (then hold)
  const skyScale = useTransform(scrollYProgress, [0.18, 0.85], [1, 1.03]);

  return (
    // Tall wrapper: the ONLY thing that determines how long we are "locked" here.
    <section aria-label="Landing Intro" className="relative h-[300vh]">
      {/* Sticky viewport; isolated so nothing leaks out to the rest of the site */}
      <div
        ref={wrapRef}
        className="sticky top-0 h-screen overflow-hidden bg-black isolate"
      >
        {/* SKY — bottom layer; transforms scoped here only */}
        <motion.div
          className="absolute inset-0 z-0 will-change-transform"
          style={{ scale: reduce ? 1 : skyScale }}
        >
          <Image
            src={skylineSrc}
            alt="Starry anime night sky with subtle clouds"
            fill
            priority
            sizes="100vw"
            className="object-cover pointer-events-none select-none"
          />
        </motion.div>

        {/* TITLE — front-most; drops FIRST, then buildings go */}
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

        {/* BUILDINGS — above sky, below title; slide off and lightly fade near end */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-20 will-change-transform"
          style={{
            y: reduce ? "0vh" : bldgY,
            opacity: reduce ? 1 : bldgOpacity,
          }}
        >
          <Image
            src={buildingsSrc}
            alt=""
            width={3840}
            height={2160}
            priority
            className="w-full h-auto pointer-events-none select-none"
          />
        </motion.div>

        {/* Scroll cue (kept inside; no layout outside is affected) */}
        <div className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 text-[12px] tracking-[0.2em] text-slate-200/80">
          • SCROLL TO ENTER •
        </div>

        {/* Reduced-motion: no movement; provide jump link; still scoped locally */}
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
