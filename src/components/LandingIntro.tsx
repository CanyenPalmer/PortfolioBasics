// src/components/LandingIntro.tsx
"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  title?: string;
  skylineSrc?: string;   // sky-only background
  buildingsSrc?: string; // transparent foreground buildings
};

/**
 * LandingIntro — cinematic intro fully isolated from the rest of the site.
 *
 * FIXES APPLIED:
 * 1) Isolation: section uses `isolate` + fixed overlay with `pointer-events-none`, no global
 *    CSS vars, no layout transforms outside this component.
 * 2) Smooth release: overlay fades out between ~97%→100% scroll progress (no snap/jump).
 * 3) Lock-in: tall sentinel drives progress; user can't leave until buildings fully exit.
 *
 * Sequence:
 *  - Title drops first (0.00→0.48)
 *  - Buildings slide/fade off (0.12→0.98)
 *  - Sky subtly zooms only during building exit (0.18→0.85)
 *  - Overlay opacity eases to 0 (0.97→1.00), then stays inert (invisible & non-interactive)
 */
export default function LandingIntro({
  title = "Let Data Drive Your Decisions",
  skylineSrc = "/images/landing/skyline.png",
  buildingsSrc = "/images/landing/buildings.png",
}: Props) {
  // Scroll progress is based on a local "sentinel" only—no page-wide listeners.
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sentinelRef,
    offset: ["start start", "end start"], // 0→1 as sentinel scrolls past top
  });

  const reduce = useReducedMotion();
  const [isGone, setIsGone] = useState(false); // hard-remove overlay only after fully faded

  // Soft fade of overlay: prevents the end-of-section "jump".
  // Keep the node mounted but transparent; once effectively complete, mark as gone.
  const overlayOpacity = useTransform(scrollYProgress, [0.97, 1.0], [1, 0]);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      // After fully complete, mark overlay as gone (display:none via class).
      if (v >= 0.999) setIsGone(true);
    });
    return () => unsub();
  }, [scrollYProgress]);

  // Motion mappings for the elements INSIDE the overlay (never touch outer layout).
  const titleY = useTransform(scrollYProgress, [0.0, 0.48], ["0vh", "130vh"]);
  const bldgY = useTransform(scrollYProgress, [0.12, 0.98], ["0vh", "130vh"]);
  const bldgOpacity = useTransform(scrollYProgress, [0.80, 0.98], [1, 0.35]);
  const skyScale = useTransform(scrollYProgress, [0.18, 0.85], [1, 1.03]);

  // Optional: scroll cue fades out early
  const cueOpacity = useTransform(scrollYProgress, [0.0, 0.15], [0.9, 0]);

  return (
    <section
      aria-label="Landing Intro"
      // isolate = new stacking context so filters/shadows/z-index don't bleed into other sections
      className="relative isolate"
    >
      {/* SCROLL DRIVER — defines how long the user is "locked" in this scene */}
      <div
        ref={sentinelRef}
        className="h-[320vh]" // adjust for longer/shorter lock-in duration
      />

      {/* FIXED OVERLAY — draws the scene on top without affecting layout or sizing elsewhere */}
      <motion.div
        aria-hidden
        className={[
          "fixed inset-0 z-[60] pointer-events-none select-none will-change-transform will-change-opacity",
          isGone ? "hidden" : "",
        ].join(" ")}
        style={{
          opacity: reduce ? 1 : overlayOpacity,
          // contain further prevents any layout/style leakage in some browsers
          // @ts-expect-error - 'contain' not in CSSProperties typing for all versions
          contain: "paint layout style size",
        }}
      >
        {/* SKY (bottom layer) */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: reduce ? 1 : skyScale }}
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

        {/* Subtle scroll cue */}
        <motion.div
          className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 text-[12px] tracking-[0.2em] text-slate-200/80"
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

/*ignore*/
