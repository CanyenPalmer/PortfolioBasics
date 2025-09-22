// src/components/Education.tsx
"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { profile } from "@/content/profile";
import { slugify } from "@/lib/slug";

// Fonts (match your prior header look for this section)
// - Title uses Outfit (was the previous header feel you had here)
// - Subheader uses Plus Jakarta Sans
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "900"] });
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
  const img = resolveHeroFromTitle(title);
  return { title, sub, years, href: e.href, img, key: slugify(title || sub || "edu") };
}

function getEducationFromProfile(): Edu[] {
  // No edits to profile.tsx; best-effort read with a known fallback
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
 * Local step-scroll controller:
 * - Locks scroll while the section is in view and we're not fully unlocked.
 * - Each threshold of wheel/touch delta advances or rewinds one step.
 */
function useStepScroll(opts: {
  steps: number; // 0..steps
  threshold?: number;
  enabled: boolean;
  getStep: () => number;
  onChange: (next: number, dir: 1 | -1) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const { steps, threshold = 80, enabled, onChange, getStep, containerRef } = opts;
  const accRef = useRef(0);
  const touching = useRef(false);
  const lastY = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;

    const isInView = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // More permissive hitbox so lock always engages when the section is visible
      return rect.top < vh && rect.bottom > 0;
    };

    const onWheel = (e: WheelEvent) => {
      if (!enabled) return;
      if (!isInView()) return;
      const step = getStep();
      const atMax = step >= steps;
      const atMin = step <= 0;

      // While not at bounds, prevent default to create the local lock
      if (!atMax || !atMin) e.preventDefault();

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
      if (!enabled) return;
      if (!touching.current) return;
      if (!isInView()) return;
      const y = e.touches[0]?.clientY ?? 0;
      const dy = lastY.current - y; // + down
      lastY.current = y;

      const step = getStep();
      const atMax = step >= steps;
      const atMin = step <= 0;
      if (!atMax || !atMin) e.preventDefault();

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
  }, [enabled, threshold, steps, onChange, getStep, containerRef]);
}

function Tower({
  idx,
  edu,
  active,
}: {
  idx: number;
  edu: Edu;
  active: boolean;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 36, x: idx % 2 ? 10 : -10, scale: 0.985 }}
      animate={{
        opacity: active ? 1 : 0,
        y: active ? 0 : 36,
        x: active ? 0 : idx % 2 ? 10 : -10,
        scale: active ? 1 : 0.985,
      }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10 bg-[#0d131d]"
    >
      <div className="aspect-[3/4] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={edu.img}
          alt={edu.title}
          className="h-full w-full object-cover"
        />
      </div>
      <figcaption className="p-3 sm:p-4">
        {/* Keep caption font stack consistent with prior section look */}
        <div className={`text-base sm:text-lg font-semibold ${outfit.className}`}>
          {edu.title}
        </div>
        <div className={`text-xs sm:text-sm opacity-80 ${plus.className}`}>
          {edu.sub}
        </div>
        {edu.years && <div className="text-xs mt-1 opacity-60">{edu.years}</div>}
      </figcaption>
    </motion.figure>
  );
}

export default function Education() {
  const items = useMemo(() => getEducationFromProfile(), []);
  // step: 0..4 (0 = nothing visible, 4 = all 4 visible)
  const [step, setStep] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null); // section wrapper

  // Relock when re-entering from above
  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      if (rect.top >= vh * 0.95) {
        setUnlocked(false);
        setStep(0);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prefers reduced motion: show full collage and never lock
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const fn = () => setReduced(m.matches);
    m.addEventListener?.("change", fn);
    return () => m.removeEventListener?.("change", fn);
  }, []);

  // Step controller (locks until unlocked)
  useStepScroll({
    steps: 4,
    threshold: 72, // a little snappier
    enabled: !unlocked && !reduced,
    getStep: () => step,
    containerRef,
    onChange: (next, dir) => {
      if (step === 4 && dir === 1) {
        // one extra down-scroll after 4 visible unlocks the section
        setUnlocked(true);
        return;
      }
      setStep(next);
    },
  });

  const visibleCount = reduced || unlocked ? 4 : step;

  return (
    <section id="education" aria-label="Education" className="relative">
      <div ref={containerRef} className="relative">
        {/* Sticky lock frame */}
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Title + Subheader + 4 nodes — this stays pinned during the lock */}
          <div className="pointer-events-none absolute left-0 right-0 top-0 flex flex-col items-center pt-16 sm:pt-20">
            <h2 className={`text-4xl sm:text-5xl tracking-tight ${outfit.className}`}>
              Education
            </h2>
            <p className={`mt-2 text-sm sm:text-base opacity-80 ${plus.className}`}>
              Four stages of the journey — built one scroll at a time.
            </p>

            {/* 4 nodes (progress) — fill as columns appear, shown only while locked */}
            {!reduced && !unlocked && (
              <div className="mt-3 flex gap-2">
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

          {/* Collage grid — centered, animates 1 tile per scroll step */}
          <div className="absolute inset-0 mt-28 sm:mt-32 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-3 sm:gap-5 w-[min(1024px,92vw)]">
              {items.map((edu, i) => (
                <Tower key={edu.key} idx={i} edu={edu} active={i < visibleCount} />
              ))}
            </div>
          </div>

          {/* Gentle settle glow when all four are visible (still locked) */}
          <AnimatePresence>
            {visibleCount >= 4 && !unlocked && (
              <motion.div
                key="settle-glow"
                className="absolute inset-0"
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
