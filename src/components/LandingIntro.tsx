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
 * LandingIntro — cinematic intro that is fully isolated from the rest of the site.
 *
 * FIXES:
 * 1) Locks the user in this section until the buildings are fully removed.
 *    - We use a non-interfering "sentinel" spacer to drive progress.
 *    - A fixed overlay renders the animation independently of page layout.
 *    - Overlay becomes hidden only after buildings finish exiting.
 *
 * 2) No formatting changes to Hero/About (or anything else):
 *    - The overlay is `fixed inset-0` with `pointer-events-none`.
 *    - No transforms applied to any shared/container element outside this component.
 *    - The rest of the page flows normally under the overlay.
 *
 * ORDER (as requested):
 *  - Headline drops first.
 *  - Buildings slide off bottom while sky subtly zooms (only during building exit).
 *  - When only sky remains, overlay hides and normal scrolling proceeds to Hero.
 */
export default function LandingIntro({
  title = "Let Data Drive Your Decisions",
  skylineSrc = "/images/landing/skyline.png",
  buildingsSrc = "/images/landing/buildings.png",
}: Props) {
  /**
   * SCROLL DRIVER (sentinel):
   * We create a tall spacer <div> that advances scroll progress from 0→1.
   * The animation itself is rendered in a separate FIXED overlay layer,
   * so no layout/zoom leaks into the rest of the site.
   */
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sentinelRef,
    offset: ["start start", "end start"], // 0..1 while sentinel is scrolling past the top
  });

  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  // Hide the overlay once progress is essentially complete (prevents any interference).
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      // Buildings finish by ~0.98; give a tiny buffer before hiding the overlay entirely.
      setDone(v >= 0.995);
    });
    return () => unsub();
  }, [scrollYProgress]);

  /**
   * CHOREOGRAPHY
   * - Title:     0.00 → 0.48    (falls first; from in-frame to off-bottom)
   * - Buildings: 0.12 → 0.98    (slide off; light fade near end)
   * - Sky zoom:  0.18 → 0.85    (1.00 → 1.03 ONLY during building exit)
   */
  const titleY = useTransform(scrollYProgress, [0.0, 0.48], ["0vh", "130vh"]);
  const bldgY  = useTransform(scrollYProgress, [0.12, 0.98], ["0vh", "130vh"]);
  const bldgOpacity = useTransform(scrollYProgress, [0.80, 0.98], [1, 0.35]);
  const skyScale = useTransform(scrollYProgress, [0.18, 0.85], [1, 1.03]);

  return (
    <section aria-label="Landing Intro" className="relative">
      {/* SENTINEL — provides the lock-in scroll length (user can't "leave" until it finishes) */}
      <div
        ref={sentinelRef}
        className="h-[320vh]" // tall enough to complete the whole sequence before releasing
      />

      {/* FIXED OVERLAY — isolated, no pointer events, no layout impact */}
      <div
        className={[
          "fixed inset-0 z-[60] pointer-events-none", // sits above page, doesn't capture input
          done ? "hidden" : "",                       // fully remove once sequence is done
        ].join(" ")}
      >
        {/* SKY (bottom of overlay). Scaling here does NOT affect page layout. */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: reduce ? 1 : skyScale, willChange: "transform" }}
        >
          <Image
            src={skylineSrc}
            alt="Starry anime night sky with subtle clouds"
            fill
            priority
            sizes="100vw"
            className="object-cover select-none"
          />
        </motion.div>

        {/* TITLE (front-most in overlay) — drops FIRST */}
        <motion.h1
          className="absolute left-1/2 top-[18vh] z-30 -translate-x-1/2 text-center font-extrabold tracking-tight text-white"
          style={{ y: reduce ? "0vh" : titleY, willChange: "transform" }}
        >
          <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-[0_0_16px_rgba(64,200,255,.25)]">
            {title}
          </span>
        </motion.h1>

        {/* BUILDINGS (above sky, below title) — slide and lightly fade near end */}
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
            className="w-full h-auto select-none"
          />
        </motion.div>

        {/* Scroll cue (visual only) */}
        <div className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 text-[12px] tracking-[0.2em] text-slate-200/80">
          • SCROLL TO ENTER •
        </div>
      </div>

      {/* Accessibility: Reduced-motion quick path (kept outside overlay to avoid interference) */}
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:bottom-6 focus:left-6 focus:z-50 bg-white/10 text-white rounded px-3 py-2 backdrop-blur"
      >
        Skip intro and jump to hero
      </a>
    </section>
  );
}
