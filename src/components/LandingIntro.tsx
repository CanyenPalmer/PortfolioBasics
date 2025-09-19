// src/components/LandingIntro.tsx
"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  title?: string;
  skylineSrc?: string;   // sky-only background
  buildingsSrc?: string; // transparent foreground buildings
  handoffColor?: string; // target tone to match the next section (Hero) before fade-out
};

/**
 * LandingIntro — cinematic intro fully isolated from the rest of the site.
 *
 * NEW (only change):
 *  - Seamless handoff to the next section:
 *    • As the Hero enters the viewport (its top goes from bottom→top), a tint layer fades in
 *      toward `handoffColor`, visually matching the Hero’s background.
 *    • Over the first ~15% of scrolling within the Hero, the overlay itself fades out (1→0).
 *    • Both effects are reversible when scrolling back up.
 *
 * Everything else remains exactly as before (lock-in, parallax, reverse behavior, isolation).
 */
export default function LandingIntro({
  title = "Let Data Drive Your Decisions",
  skylineSrc = "/images/landing/skyline.png",
  buildingsSrc = "/images/landing/buildings.png",
  handoffColor = "rgb(8,12,20)", // set to your Hero background tone
}: Props) {
  // SECTION-LOCAL SCROLL DRIVER (unchanged): locks user into the intro
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sentinelRef,
    offset: ["start start", "end start"], // 0→1 as sentinel scrolls past top
  });

  const reduce = useReducedMotion();

  // --- NEW: detect the next section (Hero) without modifying it ---
  // We expect the Hero to have id="home". We only *read* it; no changes outside this file.
  const heroRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    heroRef.current = document.getElementById("home") as HTMLElement | null;
  }, []);

  // 1) As Hero approaches: map its top from bottom→top of viewport (start 100% → start 0%)
  //    This drives the TINT layer opacity 0→1 so the skyline color matches the Hero tone.
  const { scrollYProgress: heroApproach } = useScroll({
    target: heroRef,
    offset: ["start 100%", "start 0%"],
  });
  const tintOpacity = useTransform(heroApproach, [0, 1], [0, 1]);

  // 2) Once Hero is fully in view: fade the overlay out over ~15% scroll within Hero.
  const { scrollYProgress: heroIntra } = useScroll({
    target: heroRef,
    offset: ["start 0%", "start -15%"], // top of Hero at top → 15% into Hero
  });
  const overlayFadeByHero = useTransform(heroIntra, [0, 1], [1, 0]);

  // Fallback (previous behavior) if #home isn't found yet:
  const overlayFadeBySentinel = useTransform(scrollYProgress, [0.97, 1.0], [1, 0]);

  // TITLE / BUILDINGS / SKY motions (unchanged)
  const titleY = useTransform(scrollYProgress, [0.0, 0.48], ["0vh", "130vh"]);
  const bldgY = useTransform(scrollYProgress, [0.12, 0.98], ["0vh", "130vh"]);
  const bldgOpacity = useTransform(scrollYProgress, [0.80, 0.98], [1, 0.35]);
  const skyScale = useTransform(scrollYProgress, [0.18, 0.85], [1, 1.03]);
  const cueOpacity = useTransform(scrollYProgress, [0.0, 0.15], [0.9, 0]);

  return (
    <section aria-label="Landing Intro" className="relative isolate">
      {/* SCROLL DRIVER — defines how long the user is "locked" in this scene */}
      <div ref={sentinelRef} className="h-[320vh]" />

      {/* FIXED OVERLAY — draws the scene on top without affecting layout or sizing elsewhere */}
      <motion.div
        aria-hidden
        className="fixed inset-0 z-[60] pointer-events-none select-none will-change-transform will-change-opacity"
        style={{
          // Use hero-driven fade when #home exists; otherwise fall back to the sentinel fade.
          opacity: reduce
            ? 1
            : (heroRef.current ? overlayFadeByHero : overlayFadeBySentinel) as unknown as number,
          contain: "paint layout style size",
        }}
      >
        {/* SKY (bottom layer) */}
        <motion.div className="absolute inset-0 z-0" style={{ scale: reduce ? 1 : skyScale }}>
          <Image
            src={skylineSrc}
            alt="Starry anime night sky with subtle clouds"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        {/* TITLE — drops first */}
        <motion.h1
          className="absolute left-1/2 top-[18vh] z-30 -translate-x-1/2 text-center font-extrabold tracking-tight text-white"
          style={{ y: reduce ? "0vh" : titleY }}
        >
          <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-[0_0_16px_rgba(64,200,255,.25)]">
            {title}
          </span>
        </motion.h1>

        {/* BUILDINGS — slide down and lightly fade near the end */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-20"
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
            className="w-full h-auto"
          />
        </motion.div>

        {/* NEW: Handoff tint/dimmer — matches Hero tone as it comes into view.
            Place above buildings and sky, below the title. */}
        <motion.div
          className="absolute inset-0 z-25"
          style={{
            backgroundColor: handoffColor,
            opacity: reduce ? 0 : tintOpacity,
          }}
        />

        {/* Subtle scroll cue (unchanged) */}
        <motion.div
          className="absolute bottom-6 left-1/2 z-50 -translate-x-1/2 text-[12px] tracking-[0.2em] text-slate-200/80"
          style={{ opacity: cueOpacity }}
        >
          • SCROLL TO ENTER •
        </motion.div>
      </motion.div>

      {/* A11y: quick path for keyboard/screen-reader users; does not affect layout */}
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:bottom-6 focus:left-6 focus:z-50 bg-white/10 text-white rounded px-3 py-2 backdrop-blur"
      >
        Skip intro and jump to hero
      </a>
    </section>
  );
}
