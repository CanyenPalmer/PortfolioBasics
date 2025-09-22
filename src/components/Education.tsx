// src/components/Education.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { profile } from "@/content/profile";
import { slugify } from "@/lib/slug";

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

/* ------------------------ Data helpers ------------------------ */
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

/* ------------------ Window step-lock controller ------------------
   Pattern:
   - Activate ONLY when the sticky frame is truly "in focus" (via IntersectionObserver).
   - While active, intercept wheel/touch to advance exactly 1 step per tick.
   - Break lock at both ends so the same gesture passes through.
------------------------------------------------------------------- */
function useStepLock(opts: {
  steps: number;                        // inclusive: 0..steps
  getStep: () => number;
  setStep: (n: number) => void;
  shouldLock: () => boolean;            // updated by IO
  threshold?: number;                   // scroll delta per step
}) {
  const { steps, getStep, setStep, shouldLock, threshold = 65 } = opts;
  const acc = React.useRef(0);
  const touching = React.useRef(false);
  const lastY = React.useRef(0);

  React.useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!shouldLock()) return;

      const step = getStep();
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;

      // Break at ends to allow escape
      if ((step === 0 && dir === -1) || (step === steps && dir === 1)) return;

      // Lock while we’re within the animation window
      e.preventDefault();
      acc.current += e.deltaY;

      if (Math.abs(acc.current) >= threshold) {
        const next = Math.max(0, Math.min(steps, step + dir));
        if (next !== step) setStep(next);
        acc.current = 0;
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!shouldLock()) return;
      touching.current = true;
      lastY.current = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!shouldLock() || !touching.current) return;

      const y = e.touches[0]?.clientY ?? 0;
      const dy = lastY.current - y; // + = scroll down
      lastY.current = y;

      const step = getStep();
      const dir: 1 | -1 = dy > 0 ? 1 : -1;

      if ((step === 0 && dir === -1) || (step === steps && dir === 1)) return;

      e.preventDefault();
      acc.current += dy;

      if (Math.abs(acc.current) >= threshold) {
        const next = Math.max(0, Math.min(steps, step + dir));
        if (next !== step) setStep(next);
        acc.current = 0;
      }
    };
    const onTouchEnd = () => {
      touching.current = false;
      acc.current = 0;
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
  }, [steps, threshold, getStep, setStep, shouldLock]);
}

/* --------------------------- Tile --------------------------- */
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
        {/* block removes baseline gap (no gray strip) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={edu.img} alt={edu.title} className="block h-full w-full object-cover" />
      </div>
      <figcaption className="p-3 sm:p-4">
        <div className={`text-base sm:text-lg font-semibold ${outfit.className}`}>{edu.title}</div>
        <div className={`text-xs sm:text-sm opacity-80 ${plus.className}`}>{edu.sub}</div>
        {edu.years && <div className="text-xs mt-1 opacity-60">{edu.years}</div>}
      </figcaption>
    </motion.figure>
  );
}

/* --------------------------- Main --------------------------- */
export default function Education() {
  const items = React.useMemo(() => getEducationFromProfile(), []);
  const total = items.length;           // should be 4
  const maxStep = total;                // 0..4

  const [step, setStep] = React.useState(0); // 0 none; 1..4 visible
  const [ioLock, setIoLock] = React.useState(false); // “sticky in focus” flag

  const sectionRef = React.useRef<HTMLDivElement>(null);
  const stickyRef = React.useRef<HTMLDivElement>(null);

  // Reduced motion: show all, skip lock
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const cb = () => setReduced(m.matches);
    m.addEventListener?.("change", cb);
    return () => m.removeEventListener?.("change", cb);
  }, []);

  // IntersectionObserver to decide when the sticky frame is the active viewport.
  React.useEffect(() => {
    const sticky = stickyRef.current;
    if (!sticky) return;

    // When at least 60% of the sticky frame is visible, we engage the lock.
    const obs = new IntersectionObserver(
      ([entry]) => setIoLock(entry.isIntersecting && entry.intersectionRatio >= 0.6),
      { root: null, threshold: [0, 0.6, 1] }
    );

    obs.observe(sticky);
    return () => obs.disconnect();
  }, []);

  // Should the lock be active right now?
  const shouldLock = React.useCallback(() => !reduced && ioLock, [reduced, ioLock]);

  // Install step-lock (window listeners); escapable at both ends
  useStepLock({
    steps: maxStep,
    getStep: () => step,
    setStep: (n) => setStep(n),
    shouldLock,
    threshold: 62,
  });

  // Re-entry handling so the sequence can play cleanly in both directions.
  React.useEffect(() => {
    const onScroll = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // Coming from above (section just entering view) → reset to 0
      if (r.top >= vh * 0.98) setStep(0);
      // Coming from below (section just left screen) → keep complete
      if (r.bottom <= vh * 0.02) setStep(maxStep);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [maxStep]);

  const visibleCount = reduced ? total : Math.min(step, total);

  return (
    <section id="education" aria-label="Education" className="relative">
      {/* runway for the pinned play; generous but escapable */}
      <div ref={sectionRef} className="relative min-h-[420vh]">
        {/* sticky frame: header stays pinned; grid visible below */}
        <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">
          {/* Pinned header */}
          <div className="absolute left-0 right-0 top-0 z-50 flex flex-col items-center pt-8 sm:pt-10">
            <h2 className={`tracking-tight ${outfit.className} text-5xl md:text-6xl lg:text-7xl`}>
              Education
            </h2>
            <p className={`mt-2 sm:mt-3 text-sm sm:text-base md:text-lg opacity-80 ${plus.className}`}>
              Four stages of the journey — built one scroll at a time.
            </p>
            {!reduced && (
              <div className="mt-3 flex gap-2">
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

          {/* Grid spaced below header so both are always in view while locked */}
          <div className="absolute inset-0 z-40 flex items-start justify-center">
            <div className="mt-[20vh] sm:mt-[22vh] md:mt-[24vh] grid grid-cols-2 gap-3 sm:gap-5 w-[min(1024px,92vw)]">
              {items.map((edu, i) => (
                <Tile key={edu.key} idx={i} edu={edu} visible={i < visibleCount} />
              ))}
            </div>
          </div>

          {/* Subtle settle when all visible */}
          <AnimatePresence>
            {visibleCount >= total && (
              <motion.div
                key="settle"
                className="absolute inset-0 z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.12 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  background:
                    "radial-gradient(60% 40% at 50% 50%, rgba(0,255,255,0.12), rgba(0,0,0,0))",
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

