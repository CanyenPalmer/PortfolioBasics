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
  period?: string;
  years?: string;
  dates?: string;
  href?: string;
  img?: string;
  key?: string;
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
  const years = (e.years ?? e.period ?? e.dates)?.toString();
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

/* ---------- Step-lock controller: intercepts wheel/touch/keys while locked --- */
function useStepLock(opts: {
  steps: number;                        // inclusive: 0..steps
  getStep: () => number;
  setStep: (n: number) => void;
  shouldLock: () => boolean;            // live lock predicate
  threshold?: number;                   // scroll delta per step
  cooldownMs?: number;                  // min time between steps
}) {
  const { steps, getStep, setStep, shouldLock, threshold = 110, cooldownMs = 170 } = opts;
  const acc = React.useRef(0);
  const touching = React.useRef(false);
  const lastY = React.useRef(0);
  const lastStepAt = React.useRef(0);

  const tryStep = React.useCallback(
    (dir: 1 | -1) => {
      const now = performance.now();
      if (now - lastStepAt.current < cooldownMs) return;
      const s = getStep();
      const next = Math.max(0, Math.min(steps, s + dir));
      if (next !== s) {
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

      // Let user escape at ends to continue page scrolling
      if ((step === 0 && dir === -1) || (step === steps && dir === 1)) return;

      e.preventDefault();
      acc.current += e.deltaY;
      if (Math.abs(acc.current) >= threshold) {
        tryStep(dir);
        acc.current = 0;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (!shouldLock()) return;
      // Prevent keyboard scrolling while locked
      const keys = ["PageDown", "PageUp", " ", "Spacebar", "ArrowDown", "ArrowUp"];
      if (!keys.includes(e.key)) return;

      const step = getStep();
      const dir: 1 | -1 =
        e.key === "ArrowUp" || e.key === "PageUp" ? -1 : 1;

      if ((step === 0 && dir === -1) || (step === steps && dir === 1)) return;

      e.preventDefault();
      tryStep(dir);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!shouldLock()) return;
      touching.current = true;
      lastY.current = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!shouldLock() || !touching.current) return;
      const y = e.touches[0]?.clientY ?? 0;
      const dy = lastY.current - y;
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
    window.addEventListener("keydown", onKey, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("keydown", onKey as any);
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
      window.removeEventListener("touchend", onTouchEnd as any);
    };
  }, [getStep, shouldLock, steps, threshold, tryStep]);
}

/* --------------------------------- Tile ------------------------------- */
function Tile({
  edu,
  visible,
  onOpen,
}: {
  edu: Edu;
  visible: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 80 }}
      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
      className="relative text-left overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10 bg-[#0d131d] focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
    >
      <div className="w-full h-[50vh] md:h-[54vh] lg:h-[56vh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={edu.img} alt={edu.title} className="block h-full w-full object-cover" />
      </div>
      <figcaption className="p-3 sm:p-4">
        <div className={`text-sm sm:text-base font-semibold ${outfit.className}`}>{edu.title}</div>
        <div className={`text-xs sm:text-sm opacity-80 ${plus.className}`}>{edu.sub}</div>
        {edu.years && <div className="text-[11px] mt-1 opacity-60">{edu.years}</div>}
      </figcaption>
    </motion.button>
  );
}

/* ----------------------------- Modal Sheet ---------------------------- */
function EduModal({
  edu,
  onClose,
}: {
  edu: Edu | null;
  onClose: () => void;
}) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (edu) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [edu, onClose]);

  return (
    <AnimatePresence>
      {edu && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[100] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-[min(920px,95vw)] overflow-hidden rounded-2xl bg-[#0d131d] ring-1 ring-white/10 shadow-2xl relative">
              <button
                className="absolute top-3 right-3 rounded-md px-2 py-1 text-sm bg-white/10 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
                onClick={onClose}
                aria-label="Close"
              >
                ✕
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="md:h-[56vh] h-[40vh]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={edu.img}
                    alt={edu.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className={`text-xl sm:text-2xl font-semibold ${outfit.className}`}>
                    {edu.title}
                  </h3>
                  <p className={`mt-1 text-sm sm:text-base opacity-85 ${plus.className}`}>
                    {edu.sub}
                  </p>
                  {edu.years && (
                    <p className="mt-2 text-xs sm:text-sm opacity-70">{edu.years}</p>
                  )}
                  {edu.href && (
                    <a
                      href={edu.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-4 text-sm underline underline-offset-4 decoration-cyan-300/70 hover:decoration-cyan-300"
                    >
                      Visit
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* --------------------------------- Main ------------------------------- */
export default function Education() {
  const items = React.useMemo(() => getEducationFromProfile(), []);
  const total = items.length;          // 4
  const maxStep = total;               // 0..4

  const [step, setStep] = React.useState(0);
  const [reduced, setReduced] = React.useState(false);

  const [openEdu, setOpenEdu] = React.useState<Edu | null>(null);

  const sectionRef = React.useRef<HTMLDivElement>(null);
  const stickyRef  = React.useRef<HTMLDivElement>(null);
  const headerRef  = React.useRef<HTMLDivElement>(null);
  const rowRef     = React.useRef<HTMLDivElement>(null);

  // Track lock state and re-entry
  const [isLocked, setIsLocked] = React.useState(false);
  const wasLocked = React.useRef(false);
  const lastScrollY = React.useRef<number>(0);

  // Respect reduced motion (skip lock; show everything)
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(m.matches);
    apply();
    m.addEventListener?.("change", apply);
    return () => m.removeEventListener?.("change", apply);
  }, []);

  /* ---- Lock when the section spans the viewport AND both the title and card row are in view. 
         Re-enterable from both directions; sets starting step on each entry. --------- */
  React.useEffect(() => {
    const computeLock = () => {
      const sec = sectionRef.current;
      const header = headerRef.current;
      const row = rowRef.current;
      const vh = window.innerHeight || 1;

      if (!sec || !header || !row) return { lock: false };

      const s = sec.getBoundingClientRect();
      const h = header.getBoundingClientRect();
      const r = row.getBoundingClientRect();

      // Section fully spans the viewport (sticky frame active)
      const sectionSpans = s.top <= 0.5 && s.bottom >= vh - 0.5;

      // Header & row are on-screen (any intersection with viewport)
      const headerOnscreen = h.bottom > 0 && h.top < vh;
      const rowOnscreen = r.bottom > 0 && r.top < vh;

      // Lock only when BOTH title area & full card row are on-screen during the sticky span
      const shouldLock = sectionSpans && headerOnscreen && rowOnscreen && !openEdu && !reduced;

      return { lock: shouldLock };
    };

    const onScrollOrResize = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const dir: "down" | "up" = y >= (lastScrollY.current || 0) ? "down" : "up";
      lastScrollY.current = y;

      const { lock } = computeLock();

      // Edge-trigger: on each entry into lock, set starting step based on direction
      if (lock && !wasLocked.current) {
        if (dir === "down") setStep(0);       // play forward when coming from above
        else setStep(maxStep);                 // play backward when coming from below
      }
      wasLocked.current = lock;
      setIsLocked(lock);
    };

    onScrollOrResize();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [maxStep, openEdu, reduced]);

  // Intercept gestures only while locked
  useStepLock({
    steps: maxStep,
    getStep: () => step,
    setStep: (n) => setStep(n),
    shouldLock: () => isLocked,
    threshold: 110,
    cooldownMs: 170,
  });

  // While modal is open, prevent background scroll
  React.useEffect(() => {
    if (openEdu) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [openEdu]);

  // Visible cards = step while locked; reveal all when reduced motion
  const visibleCount = reduced ? total : (isLocked ? Math.min(step, total) : 0);

  return (
    <section id="education" aria-label="Education" className="relative">
      {/* Shortened runway to reduce gap before Testimonials */}
      <div ref={sectionRef} className="relative min-h-[140vh]">
        <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">
          {/* Header */}
          <div
            ref={headerRef}
            className="absolute left-0 right-0 top-0 z-50 flex flex-col items-center pt-8 sm:pt-10"
          >
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
                    className={`h-1.5 w-4 rounded-full transition-all ${
                      i < visibleCount ? "bg-cyan-300/80 w-6" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Row of cards */}
          <div className="absolute inset-0 z-40 flex items-start justify-center">
            <div
              ref={rowRef}
              className="mt-[24vh] sm:mt-[26vh] md:mt-[28vh] w-[min(1400px,95vw)]"
            >
              <div className="grid grid-cols-4 gap-4 sm:gap-5">
                {items.map((edu, i) => (
                  <Tile
                    key={edu.key}
                    edu={edu}
                    visible={i < visibleCount}
                    onOpen={() => setOpenEdu(edu)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Soft settle when all visible */}
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

      {/* Modal for expanded details */}
      <EduModal edu={openEdu} onClose={() => setOpenEdu(null)} />
    </section>
  );
}


