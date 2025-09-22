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

// --- Data helpers ------------------------------------------------------------
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

// --- Lock controller (window-level, but scoped by “pinned” check) ------------
function useScrollStepLock(opts: {
  steps: number; // inclusive 0..steps
  getStep: () => number;
  setStep: (n: number) => void;
  pinnedCheck: () => boolean; // sticky frame is actually pinned?
  enabled: boolean; // disabled for reduced motion, etc.
  threshold?: number;
}) {
  const { steps, getStep, setStep, pinnedCheck, enabled, threshold = 65 } = opts;
  const acc = React.useRef(0);
  const touching = React.useRef(false);
  const lastY = React.useRef(0);

  React.useEffect(() => {
    if (!enabled) return;

    const handleWheel = (e: WheelEvent) => {
      // Only lock when the sticky frame is actually pinned in the viewport
      if (!pinnedCheck()) return;

      const step = getStep();
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;

      // Escape-at-ends: if user is at the beginning (0) and scrolling up,
      // or at the end (steps) and scrolling down, DO NOT preventDefault.
      if ((step === 0 && dir === -1) || (step === steps && dir === 1)) return;

      // Otherwise we are within the animation range — lock locally
      e.preventDefault();

      acc.current += e.deltaY;
      if (Math.abs(acc.current) >= threshold) {
        const next = Math.max(0, Math.min(steps, step + dir));
        if (next !== step) setStep(next);
        acc.current = 0;
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!pinnedCheck()) return;
      touching.current = true;
      lastY.current = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!pinnedCheck() || !touching.current) return;

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

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel as any);
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
      window.removeEventListener("touchend", onTouchEnd as any);
    };
  }, [enabled, steps, getStep, setStep, pinnedCheck, threshold]);
}

// --- Tile --------------------------------------------------------------------
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
        {/* remove baseline gap that created a gray strip */}
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

// --- Main --------------------------------------------------------------------
export default function Education() {
  const items = React.useMemo(() => getEducationFromProfile(), []);
  const total = items.length; // expected 4
  const maxStep = total;      // 0..4 (how many tiles visible)

  // step: 0..maxStep (0 none visible; 1..maxStep tiles visible)
  const [step, setStep] = React.useState(0);

  const sectionRef = React.useRef<HTMLDivElement>(null); // tall wrapper
  const stickyRef = React.useRef<HTMLDivElement>(null);   // sticky viewport region

  // Reduced motion → show all, skip lock
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const cb = () => setReduced(m.matches);
    m.addEventListener?.("change", cb);
    return () => m.removeEventListener?.("change", cb);
  }, []);

  // “Pinned” means the sticky frame is actively stuck to top and filling viewport.
  // Lock should ONLY run while pinned (this prevents wrong-section locking and guarantees escape near edges).
  const pinnedCheck = React.useCallback(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) return false;
    const sRect = section.getBoundingClientRect();
    const vH = window.innerHeight || 1;
    const stickyTop = sticky.getBoundingClientRect().top;

    const sectionCoversViewport = sRect.top <= 0 && sRect.bottom >= vH; // we're between the section’s start/end
    const stickyAtTop = Math.round(stickyTop) === 0; // sticky is pinned to top
    return sectionCoversViewport && stickyAtTop && !reduced;
  }, [reduced]);

  // Install the lock
  useScrollStepLock({
    steps: maxStep,
    getStep: () => step,
    setStep,
    pinnedCheck,
    enabled: true,
    threshold: 60,
  });

  // On re-enter from above → reset to 0 (play forward). From below → show complete.
  React.useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const r = section.getBoundingClientRect();
      const vH = window.innerHeight || 1;

      if (r.top >= vH * 0.98) {
        setStep(0);
      } else if (r.bottom <= vH * 0.02) {
        setStep(maxStep);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [maxStep]);

  const visibleCount = reduced ? total : Math.min(step, total);

  return (
    <section id="education" aria-label="Education" className="relative">
      {/* runway for the pinned sequence */}
      <div ref={sectionRef} className="relative min-h-[420vh]">
        {/* sticky frame keeps header + grid in view while animating */}
        <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">
          {/* header stays pinned; sized to read as a true section title */}
          <div className="absolute left-0 right-0 top-0 z-50 flex flex-col items-center pt-8 sm:pt-10">
            <h2 className={`tracking-tight ${outfit.className} text-5xl md:text-6xl lg:text-7xl`}>
              Education
            </h2>
            <p className={`mt-2 sm:mt-3 text-sm sm:text-base md:text-lg opacity-80 ${plus.className}`}>
              Four stages of the journey — built one scroll at a time.
            </p>
            {/* progress dots only during animation window */}
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

          {/* grid sits comfortably below header so both are visible during lock */}
          <div className="absolute inset-0 z-40 flex items-start justify-center">
            <div className="mt-[20vh] sm:mt-[22vh] md:mt-[24vh] grid grid-cols-2 gap-3 sm:gap-5 w-[min(1024px,92vw)]">
              {items.map((edu, i) => (
                <Tile key={edu.key} idx={i} edu={edu} visible={i < visibleCount} />
              ))}
            </div>
          </div>

          {/* gentle settle when complete (purely visual) */}
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
