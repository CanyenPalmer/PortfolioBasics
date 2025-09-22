// src/components/Education.tsx
"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { profile } from "@/content/profile";
import { slugify } from "@/lib/slug";

// Fonts — match your established header pairing
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });
const plus = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

type RawEdu = {
  institution?: string;
  school?: string;
  program?: string;
  degree?: string;
  years?: string;
  period?: string;
  href?: string;
};
type Edu = {
  title: string;
  sub: string;
  years?: string;
  href?: string;
  img: string;
  key: string;
};

function resolveHeroFromTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("ball state")) return "/images/ball-state.png";
  if (t.includes("google")) return "/images/google.png";
  if (t.includes("greenfield")) return "/images/greenfield-central.png";
  if (t.includes("pittsburgh") || t.includes("pitt")) return "/images/pitt.png";
  return "/images/portfolio-basics-avatar.png";
}
function normalizeEdu(e: RawEdu): Edu {
  const title = (e.institution ?? e.school ?? "").toString();
  const sub = (e.degree ?? e.program ?? "").toString();
  const years = (e.years ?? e.period)?.toString();
  return {
    title,
    sub,
    years,
    href: e.href,
    img: resolveHeroFromTitle(title),
    key: slugify(title || sub || "edu"),
  };
}
function getEducationFromProfile(): Edu[] {
  // Use profile.education if present; otherwise fallback to your four
  // @ts-ignore
  const raw: RawEdu[] =
    (profile?.education as any) || [
      { institution: "Ball State University", degree: "B.S. (Honors) – Applied Mathematics", years: "2018 – 2022" },
      { institution: "Google (Coursera)", degree: "Google Data Analytics Professional Certificate", years: "2023" },
      { institution: "Greenfield-Central High School", degree: "Academic Honors Diploma", years: "2014 – 2018" },
      { institution: "University of Pittsburgh", degree: "Master of Data Science (In Progress)", years: "2024 – Present" },
    ];
  return raw.map(normalizeEdu).slice(0, 4);
}

/**
 * Local step-scroll controller, bound to the STICKY FRAME (not the whole section).
 * - steps = inclusive max step (0..steps)
 * - While enabled (locked), intercept wheel/touch and advance a single step per threshold.
 */
function useStepScroll(opts: {
  steps: number;
  threshold?: number;
  enabled: boolean;
  getStep: () => number;
  onChange: (next: number, dir: 1 | -1) => void;
  stickyRef: React.RefObject<HTMLDivElement>;
}) {
  const { steps, threshold = 70, enabled, getStep, onChange, stickyRef } = opts;
  const accRef = useRef(0);
  const touching = useRef(false);
  const lastY = useRef(0);

  useEffect(() => {
    const el = stickyRef.current;
    if (!el || !enabled) return;

    const onWheel = (e: WheelEvent) => {
      if (!enabled) return;
      e.preventDefault(); // local lock (only on sticky frame)
      const step = getStep();
      accRef.current += e.deltaY;
      if (Math.abs(accRef.current) >= threshold) {
        const dir: 1 | -1 = accRef.current > 0 ? 1 : -1;
        const next = Math.max(0, Math.min(steps, step + dir));
        if (next !== step) onChange(next, dir);
        accRef.current = 0;
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touching.current = true;
      lastY.current = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!enabled || !touching.current) return;
      e.preventDefault(); // local lock
      const y = e.touches[0]?.clientY ?? 0;
      const dy = lastY.current - y; // + = down
      lastY.current = y;
      const step = getStep();
      accRef.current += dy;
      if (Math.abs(accRef.current) >= threshold) {
        const dir: 1 | -1 = accRef.current > 0 ? 1 : -1;
        const next = Math.max(0, Math.min(steps, step + dir));
        if (next !== step) onChange(next, dir);
        accRef.current = 0;
      }
    };
    const onTouchEnd = () => {
      touching.current = false;
      accRef.current = 0;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("wheel", onWheel as any);
      el.removeEventListener("touchstart", onTouchStart as any);
      el.removeEventListener("touchmove", onTouchMove as any);
      el.removeEventListener("touchend", onTouchEnd as any);
    };
  }, [enabled, steps, threshold, getStep, onChange, stickyRef]);
}

// Single tile (one education panel)
function Tile({ idx, edu, visible }: { idx: number; edu: Edu; visible: boolean }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 40, x: idx % 2 ? 12 : -12, scale: 0.985 }}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 40,
        x: visible ? 0 : idx % 2 ? 12 : -12,
        scale: visible ? 1 : 0.985,
      }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10 bg-[#0d131d]"
    >
      <div className="aspect-[3/4] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={edu.img} alt={edu.title} className="h-full w-full object-cover" />
      </div>
      <figcaption className="p-3 sm:p-4">
        <div className={`text-base sm:text-lg font-semibold ${outfit.className}`}>{edu.title}</div>
        <div className={`text-xs sm:text-sm opacity-80 ${plus.className}`}>{edu.sub}</div>
        {edu.years && <div className="text-xs mt-1 opacity-60">{edu.years}</div>}
      </figcaption>
    </motion.figure>
  );
}

export default function Education() {
  const items = useMemo(() => getEducationFromProfile(), []);
  /**
   * step: 0..4  (0 = none visible; 1..4 = how many tiles are visible)
   * We start at 0 so the first down-scroll reveals tile #1 — prevents any tile feeling "stuck".
   */
  const [step, setStep] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null); // tall wrapper
  const stickyRef = useRef<HTMLDivElement>(null); // pinned viewport (events bound here)

  // Relock when re-entering from above
  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // If the whole section is above the viewport, reset for a fresh entry
      if (rect.top >= vh * 0.98) {
        setUnlocked(false);
        setStep(0);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reduced motion → show all, no lock
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const fn = () => setReduced(m.matches);
    m.addEventListener?.("change", fn);
    return () => m.removeEventListener?.("change", fn);
  }, []);

  // Determine if we should lock: section is on screen, not reduced, not unlocked.
  const lockEnabled = !reduced && !unlocked;

  // Local step-lock behavior (education only; bound to sticky frame)
  useStepScroll({
    steps: 4,
    threshold: 70,
    enabled: lockEnabled,
    getStep: () => step,
    stickyRef,
    onChange: (next, dir) => {
      // Unlock rule: when step is 4 (all tiles visible), one more down-scroll unlocks
      if (step === 4 && dir === 1) {
        setUnlocked(true);
        return;
      }
      setStep(next);
    },
  });

  // How many tiles to show
  const visibleCount = reduced || unlocked ? 4 : step;

  return (
    <section id="education" aria-label="Education" className="relative">
      {/* Tall wrapper gives vertical runway for the sticky frame */}
      <div ref={containerRef} className="relative min-h-[450vh]">
        {/* Sticky lock frame — this is what stays pinned during the sequence */}
        <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">
          {/* Pinned header (title + subhead + nodes) */}
          <div className="absolute left-0 right-0 top-0 z-20 flex flex-col items-center pt-10 sm:pt-12">
            <h2
              className={`tracking-tight ${outfit.className}
                          text-5xl md:text-6xl lg:text-7xl`}
            >
              Education
            </h2>
            <p className={`mt-3 text-sm sm:text-base md:text-lg opacity-80 ${plus.className}`}>
              Four stages of the journey — built one scroll at a time.
            </p>
            {!reduced && !unlocked && (
              <div className="mt-4 flex gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-6 rounded-full ${
                      i < Math.min(visibleCount, 4) ? "bg-cyan-400" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Collage grid (centered; tiles animate 1-by-1) */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="mt-24 sm:mt-28 md:mt-32 grid grid-cols-2 gap-3 sm:gap-5 w-[min(1024px,92vw)]">
              {items.map((edu, i) => (
                <Tile key={edu.key} idx={i} edu={edu} visible={i < visibleCount} />
              ))}
            </div>
          </div>

          {/* Subtle glow when all four are visible (still locked) */}
          <AnimatePresence>
            {visibleCount >= 4 && !unlocked && (
              <motion.div
                key="settle-glow"
                className="absolute inset-0 z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  background:
                    "radial-gradient(60% 40% at 50% 50%, rgba(0,255,255,0.15), rgba(0,0,0,0))",
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}


