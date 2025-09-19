// src/components/LandingIntro.tsx
"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Cinzel } from "next/font/google"; // custom title font

const cinzel = Cinzel({ subsets: ["latin"], weight: ["700", "800", "900"] });

type Props = {
  title?: string;
  skylineSrc?: string;   // sky-only background
  buildingsSrc?: string; // transparent foreground buildings
  handoffColor?: string; // target tone to match the next section (Hero) before fade-out
};

/**
 * LandingIntro — cinematic intro fully isolated from the rest of the site.
 *
 * Notes:
 * - Title + subheading horizontally centered near the top (top middle).
 * - Thicker (tasteful) text-shadows for pop.
 * - Title split into two italic lines; subheading italicized too.
 * - Title block sits in front of buildings.
 * - Skyline-to-hero tint handoff tied to landing progress; overlay fades during early hero scroll.
 */
export default function LandingIntro({
  title = "Let Data Drive Your Decisions",
  skylineSrc = "/images/landing/skyline.png",
  buildingsSrc = "/images/landing/buildings.png",
  handoffColor = "rgb(8,12,20)", // set this to your Hero background tone
}: Props) {
  // LANDING-LOCAL SCROLL DRIVER — locks user into the intro and gives progress 0→1
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sentinelRef,
    offset: ["start start", "end start"], // 0→1 as sentinel scrolls past top
  });

  const reduce = useReducedMotion();

  // --- Read the next section (Hero) without modifying it ---
  // We expect the Hero to have id="home".
  const heroRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    heroRef.current = document.getElementById("home") as HTMLElement | null;
  }, []);

  // Fade the overlay OUT over ~15% of scrolling within the Hero
  const { scrollYProgress: heroIntra } = useScroll({
    target: heroRef,
    offset: ["start 0%", "start -15%"], // top of Hero at top → 15% into Hero
  });
  const overlayFadeByHero = useTransform(heroIntra, [0, 1], [1, 0]);

  // Tint/dimmer driven ONLY by landing progress — last slice of the landing section.
  const tintOpacity = useTransform(scrollYProgress, [0.30, 0.995], [0, 1]);

  // TITLE / BUILDINGS / SKY motions
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
          opacity: reduce ? 1 : (heroRef.current ? overlayFadeByHero : 1),
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

        {/* TITLE BLOCK — full-width container, centered at same top height; on top of buildings */}
        <motion.div
          className="absolute inset-x-0 top-[18vh] z-30 text-center"
          style={{ y: reduce ? "0vh" : titleY }}
        >
          <h1 className={`${cinzel.className} italic text-white tracking-tight`}>
            {/* Line 1 */}
            <span
              className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-[0_0_16px_rgba(64,200,255,.25)]"
              style={{
                textShadow:
                  "0 5px 18px rgba(0,0,0,0.65), 0 3px 8px rgba(0,0,0,0.5)",
              }}
            >
              Let Data Drive
            </span>
            {/* Line 2 */}
            <span
              className="mt-1 block text-4xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-[0_0_16px_rgba(64,200,255,.25)]"
              style={{
                textShadow:
                  "0 5px 18px rgba(0,0,0,0.65), 0 3px 8px rgba(0,0,0,0.5)",
              }}
            >
              Your Decisions
            </span>
          </h1>

          {/* Subheading — italicized, soft weight, slightly stronger (yet subtle) shadow */}
          <p
            className="mt-3 italic text-base sm:text-lg md:text-xl text-white/90 font-normal"
            style={{
              textShadow:
                "0 4px 14px rgba(0,0,0,0.50), 0 2px 6px rgba(0,0,0,0.4)",
            }}
          >
            Canyen&apos;s Portfolio
          </p>
        </motion.div>

        {/* BUILDINGS — behind the title (z-20 < z-30) */}
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

        {/* HANDOFF tint/dimmer — fades in only at the end of the landing section */}
        <motion.div
          className="absolute inset-0 z-25"
          style={{
            backgroundColor: handoffColor,
            opacity: reduce ? 0 : tintOpacity,
          }}
        />

        {/* Subtle scroll cue */}
        <motion.div
          className="absolute bottom-6 left-1/2 z-50 -translate-x-1/2 text-[12px] tracking-[0.2em] text-slate-200/80"
          style={{ opacity: cueOpacity }}
        >
          • SCROLL TO ENTER •
        </motion.div>
      </motion.div>

      {/* A11y: quick path for keyboard/screen-reader users */}
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:bottom-6 focus:left-6 focus:z-50 bg-white/10 text-white rounded px-3 py-2 backdrop-blur"
      >
        Skip intro and jump to hero
      </a>
    </section>
  );
}
