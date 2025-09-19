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
 * - Background "skyline" stays; very subtle zoom only during buildings exit.
 * - Foreground "buildings" slide down and fade near the end.
 * - Headline falls from the sky, occluded by buildings.
 * - When complete, section unpins and the page continues to the hero.
 *
 * Drop this ABOVE the Hero in app/page.tsx.
 * Assets expected:
 *   /public/images/landing/skyline.png
 *   /public/images/landing/buildings.png
 */
export default function LandingIntro({
  title = "Let Data Drive Your Decisions",
  skylineSrc = "/images/landing/skyline.png",
  buildingsSrc = "/images/landing/buildings.png",
}: Props) {
  // Pin technique: tall wrapper + sticky viewport child.
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"], // progress 0..1 while sticky viewport is in view
  });

  const reduce = useReducedMotion();

  // Headline falls first (-20vh -> +130vh)
  const titleY = useTransform(scrollYProgress, [0.0, 0.55], ["-20vh", "130vh"]);
  // Buildings fall next (0vh -> +120vh) with a soft fade near the end
  const bldgY  = useTransform(scrollYProgress, [0.15, 0.85], ["0vh", "120vh"]);
  const bldgOpacity = useTransform(scrollYProgress, [0.70, 0.85], [1, 0.35]);

  // Skyline subtle zoom ONLY while buildings are moving (1.00 -> ~1.03)
  const skyScale = useTransform(scrollYProgress, [0.20, 0.80], [1, 1.03]);

  return (
    <section aria-label="Landing Intro" className="relative h-[220vh] md:h-[220vh]">
      {/* Sticky viewport */}
      <div ref={wrapRef} className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* SKYLINE (bottom) */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            scale: reduce ? 1 : skyScale,
            willChange: "transform",
          }}
        >
          <Image
            src={skylineSrc}
            alt="Starry anime night sky with subtle clouds"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        {/* TITLE (beneath buildings for occlusion) */}
        <motion.h1
          className="absolute left-1/2 top-[-12vh] -translate-x-1/2 text-center font-extrabold tracking-tight text-white/95"
          style={{
            y: reduce ? "0vh" : titleY,
            zIndex: 10, // under buildings (z-20) so it tucks behind rooftops
            willChange: "transform",
          }}
        >
          <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-[0_0_16px_rgba(64,200,255,.25)]">
            {title}
          </span>
        </motion.h1>

        {/* BUILDINGS (top) */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-20"
          style={{
            y: reduce ? "0vh" : bldgY,
            opacity: reduce ? 1 : bldgOpacity,
            willChange: "transform,opacity",
          }}
        >
          <Image
            src={buildingsSrc}
            alt=""
            width={3840}
            height={2160}
            priority
            className="w-full h-auto select-none pointer-events-none"
          />
        </motion.div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 text-[12px] tracking-[0.2em] text-slate-200/80">
          • SCROLL TO ENTER •
        </div>

        {/* Reduced-motion: keep it accessible */}
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:absolute focus:bottom-6 focus:left-6 focus:z-40 bg-white/10 text-white rounded px-3 py-2 backdrop-blur"
        >
          Skip intro and jump to hero
        </a>
      </div>
    </section>
  );
}
