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
      { institution: "Greenfield–Central High School", degree: "Academic & Technical Honors Diplomas", years: "2014 – 2018" },
      { institution: "Ball State University", degree: "B.G.S. – Mathematics; A.A. – Computer Science", years: "2018 – 2022" },
      { institution: "Google (Coursera)", degree: "Google Data Analytics Professional Certificate", years: "2023" },
      { institution: "University of Pittsburgh", degree: "Master of Data Science (In Progress)", years: "2024 – Present" },
    ];
  return raw.map(normalizeEdu).slice(0, 4);
}

/* ------------------ Step-lock controller (window listeners) ------------------
   - Lock activates only when the row is centered (IO + band + pinned fallback).
   - While active, intercept wheel/touch to step 0→4 (or reverse).
   - Escape at both ends so scrolling continues naturally.
   - Slightly slowed stepping (threshold + cooldown).
------------------------------------------------------------------------------- */
function useStepLock(opts: {
  steps: number;                        // inclusive: 0..steps
  getStep: () => number;
  setStep: (n: number) => void;
  shouldLock: () => boolean;            // live lock predicate
  threshold?: number;                   // scroll delta per step
  cooldownMs?: number;                  // min time between steps
}) {
  const { steps, getStep, setStep, shouldLock, threshold = 100, cooldownMs = 180 } = opts;
  const acc = React.useRef(0);
  const touching = React.useRef(false);
  const lastY = React.useRef(0);
  const lastStepAt = React.useRef(0);

  const tryStep = React.useCallback(
    (dir: 1 | -1) => {
      const now = performance.now();
      if (now - lastStepAt.current < cooldownMs) return;
      const step = getStep();
      const next = Math.max(0, Math.min(steps, step + dir));
      if (next !== step) {
        setStep(next);
        lastStepAt.current = now;
      }
    },
    [cooldownMs, getStep, setStep, steps]
  );

  React.useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!shouldLock()) return;

      const step = getStep();
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;

      // Escape at ends → let the gesture pass through
      if ((step === 0 && dir === -1) || (step === steps && dir === 1)) return;

      e.preventDefault(); // lock while animating
      acc.current += e.deltaY;

      if (Math.abs(acc.current) >= threshold) {
        tryStep(dir);
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
        tryStep(dir);
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
  }, [getStep, shouldLock, steps, threshold, tryStep]);
}

/* --------------------------- Tile (column) --------------------------- */
function Tile({ idx, edu, visible }: { idx: number; edu: Edu; visible: boolean }) {
  return (
    <motion.figure
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 80 }}
      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10 bg-[#0d131d]"
    >
      {/* Tall, proportional column; image fills (no letterboxing) */}
      <div className="w-full h-[50vh] md:h-[54vh] lg:h-[56vh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={edu.img} alt={edu.title} className="block h-full w-full object-cover" />
      </div>
      <figcaption className="p-3 sm:p-4">
        <div className={`text-sm sm:text-base font-semibold ${outfit.className}`}>{edu.title}</div>
        <div className={`text-xs sm:text-sm opacity-80 ${plus.className}`}>{edu.sub}</div>
        {edu.years && <div className="text-[11px] mt-1 opacity-60">{edu.years}</div>}
      </figcaption>
    </motion.figure>
  );
}

/* --------------------------- Main --------------------------- */
export default function Education() {
  const items = React.useMemo(() => getEducationFromProfile(), []);
  const total = items.length;          // 4
  const maxStep = total;               // 0..4

  const [step, setStep] = React.useState(0);      // 0 none; 1..4 visible
  const [ioActive, setIoActive] = React.useState(false);

  const sectionRef = React.useRef<HTMLDivElement>(null);
  const stickyRef  = React.useRef<HTMLDivElement>(null);
  const rowRef     = React.useRef<HTMLDivElement>(null);

  // Reduced motion → show all, skip lock
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const cb = () => setReduced(m.matches);
    m.addEventListener?.("change", cb);
    return () => m.removeEventListener?.("change", cb);
  }, []);

  // IO: sticky frame visible (relaxed so it actually fires)
  React.useEffect(() => {
    const sticky = stickyRef.current;
    if (!sticky) return;

    const obs = new IntersectionObserver(
      ([entry]) => setIoActive(entry.isIntersecting && entry.intersectionRatio >= 0.2),
      { root: null, threshold: [0, 0.2, 0.5, 1] }
    );

    obs.observe(sticky);
    return () => obs.disconnect();
  }, []);

  // Fallback: treat sticky as focused when pinned & section spans viewport
  const pinnedFallback = React.useCallback(() => {
    const sec = sectionRef.current;
    const sticky = stickyRef.current;
    if (!sec || !sticky) return false;
    const s = sec.getBoundingClientRect();
    const vH = window.innerHeight || 1;
    const stickyTop = sticky.getBoundingClientRect().top;
    const sectionSpans = s.top <= 0 && s.bottom >= vH;
    const stickyPinned = Math.round(stickyTop) === 0;
    return sectionSpans && stickyPinned;
  }, []);

  // Row-centered band: engage lock only when the row center is around viewport center
  const rowCentered = React.useCallback(() => {
    const row = rowRef.current;
    if (!row) return false;
    const r = row.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const center = r.top + r.height / 2;
    // Wider band so it triggers reliably, but still centered
    return center > vh * 0.35 && center < vh * 0.65;
  }, []);

  // Final lock predicate
  const isLocked = React.useMemo(
    () => !reduced && (ioActive || pinnedFallback()) && rowCentered(),
    [reduced, ioActive, pinnedFallback, rowCentered]
  );

  // Install step lock (escapable at both ends; slowed a touch)
  useStepLock({
    steps: maxStep,
    getStep: () => step,
    setStep: (n) => setStep(n),
    shouldLock: () => isLocked,
    threshold: 105,
    cooldownMs: 180,
  });

  // Re-entry: only reset when coming from above; do NOT prefill when passing below
  React.useEffect(() => {
    const onScroll = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      if (r.top >= vh * 0.98) setStep(0); // entering from above → play forward
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep cards hidden until lock actually engages (prevents early reveal)
  const visibleCount = reduced ? total : (isLocked ? Math.min(step, total) : 0);

  return (
    <section id="education" aria-label="Education" className="relative">
      {/* Normal-length runway; sticky viewport handles the lock window */}
      <div ref={sectionRef} className="relative min-h-[170vh]">
        {/* Sticky frame keeps header + row visible during the lock */}
        <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">
          {/* Header (pinned) */}
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

          {/* Single-row collage (1×4) — lowered so it doesn't touch the nodes */}
          <div className="absolute inset-0 z-40 flex items-start justify-center">
            <div
              ref={rowRef}
              className="mt-[24vh] sm:mt-[26vh] md:mt-[28vh] w-[min(1400px,95vw)]"
            >
              <div className="grid grid-cols-4 gap-4 sm:gap-5">
                {items.map((edu, i) => (
                  <Tile key={edu.key} idx={i} edu={edu} visible={i < visibleCount} />
                ))}
              </div>
            </div>
          </div>

          {/* Subtle settle when all are visible (visual only) */}
          <AnimatePresence>
            {visibleCount >= total && (
              <motion.div
                key="settle"
                className="absolute inset-0 z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.10 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  background:
                    "radial-gradient(60% 40% at 50% 50%, rgba(0,255,255,0.10), rgba(0,0,0,0))",
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}


