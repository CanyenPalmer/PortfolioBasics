// src/components/Education.tsx
"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { profile } from "@/content/profile";
import { slugify } from "@/lib/slug";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "900"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });
const plus = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

// --- Types ---
interface RawEdu {
  institution?: string;
  school?: string;
  program?: string;
  degree?: string;
  years?: string;
  period?: string;
  href?: string;
}
interface Edu {
  title: string;
  sub: string;
  years?: string;
  href?: string;
  img: string;
  key: string;
}

// --- Helpers ---
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
  // No edits to profile.tsx; best-effort extraction with a fallback list.
  // @ts-ignore – profile may or may not have an `education` array
  const rawList: RawEdu[] =
    (profile?.education as any) || [
      { institution: "Ball State University", degree: "B.S. (Honors) – Applied Mathematics", years: "2018 – 2022", href: "https://bsu.edu" },
      { institution: "Google (Coursera)", degree: "Google Data Analytics Professional Certificate", years: "2023", href: "https://grow.google/certificates/data-analytics/" },
      { institution: "Greenfield-Central High School", degree: "Academic Honors Diploma", years: "2014 – 2018" },
      { institution: "University of Pittsburgh", degree: "Master of Data Science (In Progress)", years: "2024 – Present", href: "https://www.pitt.edu/" },
    ];
  return rawList.map(normalizeEdu).slice(0, 4);
}

// --- Step Scroll Controller (local lock) ---
function useStepScroll(opts: {
  steps: number; // number of visual positions (0..steps)
  threshold?: number; // wheel/touch delta per step
  enabled: boolean;
  onChange: (next: number, dir: 1 | -1) => void;
  getStep: () => number;
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const { steps, threshold = 80, enabled, onChange, getStep, containerRef } = opts;
  const accRef = useRef(0);
  const touching = useRef(false);
  const lastY = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;

    const onWheel = (e: WheelEvent) => {
      // Only intercept when the section is centered enough in the viewport
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const inView = rect.top < vh * 0.3 && rect.bottom > vh * 0.7;
      const step = getStep();
      if (!inView) return;

      const maxStep = steps; // inclusive (0..steps)
      const atBoundsDown = step >= maxStep;
      const atBoundsUp = step <= 0;

      // Lock while not at bounds
      if (!atBoundsDown || !atBoundsUp) {
        e.preventDefault();
      }

      accRef.current += e.deltaY;
      if (Math.abs(accRef.current) >= threshold) {
        const dir: 1 | -1 = accRef.current > 0 ? 1 : -1;
        const next = Math.max(0, Math.min(maxStep, step + dir));
        if (next !== step) onChange(next, dir);
        accRef.current = 0;
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touching.current = true;
      lastY.current = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!touching.current) return;
      const y = e.touches[0]?.clientY ?? 0;
      const dy = lastY.current - y; // positive = swipe up (scroll down)
      lastY.current = y;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const inView = rect.top < vh * 0.3 && rect.bottom > vh * 0.7;
      const step = getStep();
      if (!inView) return;

      const maxStep = steps;
      const atBoundsDown = step >= maxStep;
      const atBoundsUp = step <= 0;
      if (!atBoundsDown || !atBoundsUp) {
        e.preventDefault();
      }

      accRef.current += dy;
      if (Math.abs(accRef.current) >= threshold) {
        const dir: 1 | -1 = accRef.current > 0 ? 1 : -1;
        const next = Math.max(0, Math.min(maxStep, step + dir));
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

// --- Presentational Tower ---
function Tower({ idx, edu, active }: { idx: number; edu: Edu; active: boolean }) {
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
        <img src={edu.img} alt={edu.title} className="h-full w-full object-cover" />
      </div>
      <figcaption className="p-3 sm:p-4">
        <div className={`text-base sm:text-lg font-semibold ${playfair.className}`}>{edu.title}</div>
        <div className={`text-xs sm:text-sm opacity-80 ${plus.className}`}>{edu.sub}</div>
        {edu.years && <div className="text-xs mt-1 opacity-60">{edu.years}</div>}
      </figcaption>
      <motion.div
        className="pointer-events-none absolute inset-0 ring-2 ring-cyan-400/0 rounded-2xl"
        initial={false}
        transition={{ duration: 0.1 }}
      />
    </motion.figure>
  );
}

// --- Main ---
export default function Education() {
  const items = useMemo(() => getEducationFromProfile(), []);
  const [step, setStep] = useState(0); // 0..4  (0 = none visible)
  const [unlocked, setUnlocked] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef<HTMLDivElement>(null);

  // Enable the step controller until we fully unlock
  useStepScroll({
    steps: 4,
    threshold: 80,
    enabled: !unlocked,
    getStep: () => step,
    containerRef,
    onChange: (next, dir) => {
      // Unlock rule: at step 4, one more down step triggers unlock
      if (step === 4 && dir === 1) {
        setUnlocked(true);
        return;
      }
      setStep(next);
    },
  });

  // When we enter the section from above, relock at step 0
  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // If we scrolled back up and the section re-enters viewport top, relock
      if (rect.top >= vh * 0.9) {
        setUnlocked(false);
        setStep(0);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // If prefers-reduced-motion: render full collage, no lock
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);

  const visibleCount = reduced || unlocked ? 4 : step; // how many columns to show

  return (
    <section id="education" aria-label="Education" className="relative">
      <div ref={containerRef} className="relative">
        {/* Sticky lock frame */}
        <div ref={lockRef} className="sticky top-0 min-h-screen">
          <div className="relative h-screen overflow-hidden">
            {/* Title + Subheader */}
            <div className="pointer-events-none absolute left-0 right-0 top-0 flex flex-col items-center pt-16 sm:pt-20">
              <h2 className={`text-4xl sm:text-5xl tracking-tight ${playfair.className}`}>Education</h2>
              <p className={`mt-2 text-sm sm:text-base opacity-80 ${plus.className}`}>
                Four stages of the journey — built one scroll at a time.
              </p>
              {/* Progress dots during lock */}
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

            {/* Collage grid */}
            <div className="absolute inset-0 mt-24 sm:mt-28 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-3 sm:gap-5 w-[min(1024px,92vw)]">
                {items.map((edu, i) => (
                  <Tower key={edu.key} idx={i} edu={edu} active={i < visibleCount} />
                ))}
              </div>
            </div>

            {/* Gentle settle glow when all four are in */}
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
      </div>
    </section>
  );
}
