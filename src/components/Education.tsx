// src/components/Education.tsx
"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { profile } from "@/content/profile";
import { slugify } from "@/lib/slug";

// Match your section header pairing used elsewhere
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

/** Window-level step lock (Education-only via in-view checks) */
function useWindowStepLock(opts: {
  steps: number; // inclusive: 0..steps
  threshold?: number;
  getStep: () => number;
  onStep: (next: number, dir: 1 | -1) => void;
  isLockActive: () => boolean;
}) {
  const { steps, threshold = 60, getStep, onStep, isLockActive } = opts;
  const accRef = useRef(0);
  const touching = useRef(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!isLockActive()) return;
      e.preventDefault(); // lock page scrolling while active
      const step = getStep();
      accRef.current += e.deltaY;
      if (Math.abs(accRef.current) >= threshold) {
        const dir: 1 | -1 = accRef.current > 0 ? 1 : -1;
        const next = Math.max(0, Math.min(steps, step + dir));
        if (next !== step) onStep(next, dir);
        accRef.current = 0;
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!isLockActive()) return;
      touching.current = true;
      lastY.current = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isLockActive() || !touching.current) return;
      e.preventDefault();
      const y = e.touches[0]?.clientY ?? 0;
      const dy = lastY.current - y; // + = scroll down
      lastY.current = y;
      const step = getStep();
      accRef.current += dy;
      if (Math.abs(accRef.current) >= threshold) {
        const dir: 1 | -1 = accRef.current > 0 ? 1 : -1;
        const next = Math.max(0, Math.min(steps, step + dir));
        if (next !== step) onStep(next, dir);
        accRef.current = 0;
      }
    };

    const onTouchEnd = () => {
      touching.current = false;
      accRef.current = 0;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
      window.removeEventListener("touchend", onTouchEnd as any);
    };
  }, [steps, threshold, getStep, onStep, isLockActive]);
}

/** One education tile */
function Tile({ idx, edu, visible }: { idx: number; edu: Edu; visible: boolean }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 42, x: idx % 2 ? 12 : -12, scale: 0.985 }}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 42,
        x: visible ? 0 : idx % 2 ? 12 : -12,
        scale: visible ? 1 : 0.985,
      }}
      transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
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
  const total = items.length; // should be 4
  const maxStep = total;      // 0..4

  // step: 0..total (0 none visible; 1..total visibleCount)
  const [step, setStep] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null); // tall wrapper

  // Reduced motion → show full collage; skip lock entirely
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const cb = () => setReduced(m.matches);
    m.addEventListener?.("change", cb);
    return () => m.removeEventListener?.("change", cb);
  }, []);

  /**
   * Engage the lock *only* when the section is in the central band.
   * This makes it escapable at the top/bottom edges, and it mirrors the pattern you liked.
   */
  const isSectionCentered = () => {
    const el = sectionRef.current;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    return rect.top < vh * 0.3 && rect.bottom > vh * 0.7;
  };

  /**
   * Lock is active when:
   * - not reduced motion
   * - not globally unlocked
   * - section centered (prevents trapping)
   */
  const isLockActive = () => !reduced && !unlocked && isSectionCentered();

  // Window-level lock like Experience/Projects (reliable capture)
  useWindowStepLock({
    steps: maxStep,
    threshold: 60,
    getStep: () => step,
    isLockActive,
    onStep: (next, dir) => {
      // Escape rules at both ends:
      // - if at max and scrolling down → unlock to continue page
      if (step === maxStep && dir === 1) {
        setUnlocked(true);
        return;
      }
      // - if at 0 and scrolling up → unlock to continue page upward
      if (step === 0 && dir === -1) {
        setUnlocked(true);
        return;
      }
      setStep(next);
    },
  });

  // Relock when the user re-enters from either side:
  // - From above: reset to 0 so animation can play forward
  // - From below: keep full (step=maxStep) so it looks complete on scroll-up pass
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // If section is far above viewport (we scrolled up past it), prep forward run
      if (rect.top >= vh * 0.98) {
        setUnlocked(false);
        setStep(0);
      }
      // If section is far below viewport (we scrolled past it downward), show completed state
      if (rect.bottom <= vh * 0.02) {
        setUnlocked(false);
        setStep(maxStep);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [maxStep]);

  const visibleCount = reduced || unlocked ? total : Math.min(step, total);

  return (
    <section id="education" aria-label="Education" className="relative">
      {/* Tall runway so sticky frame has room to lock */}
      <div ref={sectionRef} className="relative min-h-[440vh]">
        {/* Sticky/pinned viewport content */}
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Pinned header (title + subhead + nodes) */}
          <div className="absolute left-0 right-0 top-0 z-50 flex flex-col items-center pt-10 sm:pt-12">
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
                {Array.from({ length: total }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-6 rounded-full ${
                      i < Math.min(visibleCount, total) ? "bg-cyan-400" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Collage grid — spaced away from header so they don't touch */}
          <div className="absolute inset-0 z-40 flex items-start justify-center">
            <div className="mt-[24vh] sm:mt-[26vh] md:mt-[28vh] grid grid-cols-2 gap-3 sm:gap-5 w-[min(1024px,92vw)]">
              {items.map((edu, i) => (
                <Tile key={edu.key} idx={i} edu={edu} visible={i < visibleCount} />
              ))}
            </div>
          </div>

          {/* Soft settle glow when all are visible (still locked until extra down) */}
          <AnimatePresence>
            {visibleCount >= total && !unlocked && (
              <motion.div
                key="settle-glow"
                className="absolute inset-0 z-30"
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
