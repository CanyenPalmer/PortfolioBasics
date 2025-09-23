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

/* ---------- Robust, re-enterable gesture lock (listeners mount once) ---------- */
function useLockedGestures(opts: {
  steps: number;
  getStep: () => number;
  setStep: (n: number) => void;
  isLocked: boolean;
  threshold?: number;
  cooldownMs?: number;
}) {
  const { steps, getStep, setStep, isLocked, threshold = 110, cooldownMs = 170 } = opts;

  const lockedRef = React.useRef(isLocked);
  const thresholdRef = React.useRef(threshold);
  const cooldownRef = React.useRef(cooldownMs);
  const getStepRef = React.useRef(getStep);
  const setStepRef = React.useRef(setStep);

  React.useEffect(() => { lockedRef.current = isLocked; }, [isLocked]);
  React.useEffect(() => { thresholdRef.current = threshold; }, [threshold]);
  React.useEffect(() => { cooldownRef.current = cooldownMs; }, [cooldownMs]);
  React.useEffect(() => { getStepRef.current = getStep; }, [getStep]);
  React.useEffect(() => { setStepRef.current = setStep; }, [setStep]);

  React.useEffect(() => {
    const acc = { v: 0 };
    const touching = { v: false };
    const lastY = { v: 0 };
    const lastStepAt = { v: 0 };

    const tryStep = (dir: 1 | -1) => {
      const now = performance.now();
      if (now - lastStepAt.v < cooldownRef.current) return;
      const s = getStepRef.current();
      const next = Math.max(0, Math.min(steps, s + dir));
      if (next !== s) {
        setStepRef.current(next);
        lastStepAt.v = now;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (!lockedRef.current) return;
      const step = getStepRef.current();
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      if ((step === 0 && dir === -1) || (step === steps && dir === 1)) return; // escape at ends
      e.preventDefault();
      acc.v += e.deltaY;
      if (Math.abs(acc.v) >= thresholdRef.current) {
        tryStep(dir);
        acc.v = 0;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (!lockedRef.current) return;
      const keys = ["PageDown", "PageUp", " ", "Spacebar", "ArrowDown", "ArrowUp"];
      if (!keys.includes(e.key)) return;
      const step = getStepRef.current();
      const dir: 1 | -1 = e.key === "ArrowUp" || e.key === "PageUp" ? -1 : 1;
      if ((step === 0 && dir === -1) || (step === steps && dir === 1)) return;
      e.preventDefault();
      tryStep(dir);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!lockedRef.current) return;
      touching.v = true;
      lastY.v = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!lockedRef.current || !touching.v) return;
      const y = e.touches[0]?.clientY ?? 0;
      const dy = lastY.v - y;
      lastY.v = y;
      const step = getStepRef.current();
      const dir: 1 | -1 = dy > 0 ? 1 : -1;
      if ((step === 0 && dir === -1) || (step === steps && dir === 1)) return;
      e.preventDefault();
      acc.v += dy;
      if (Math.abs(acc.v) >= thresholdRef.current) {
        tryStep(dir);
        acc.v = 0;
      }
    };

    const onTouchEnd = () => {
      touching.v = false;
      acc.v = 0;
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
  }, [steps]);
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
      className={`relative text-left overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10 bg-[#0d131d] focus:outline-none focus:ring-2 focus:ring-cyan-300/70 ${
        visible ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      style={{ zIndex: 41 }} // ensure above any visual effects
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

  // Lock state (edge-triggered, re-enterable)
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

  /* ---- Engage lock when:
         - Section spans the viewport (sticky active),
         - Header is visible (any intersection),
         - Card row is meaningfully visible (visibility ratio >= 0.6) AND its center within 20%..80% of viewport.
         Re-enters from both directions; sets starting step on each entry. --- */
  React.useEffect(() => {
    const computeLock = () => {
      const sec = sectionRef.current;
      const header = headerRef.current;
      const row = rowRef.current;
      const vh = window.innerHeight || 1;
      if (!sec || !header || !row) return false;

      const s = sec.getBoundingClientRect();
      const h = header.getBoundingClientRect();
      const r = row.getBoundingClientRect();

      const sectionSpans = s.top <= 0.5 && s.bottom >= vh - 0.5; // sticky fully engaged
      const headerOnscreen = h.bottom > 0 && h.top < vh;

      // Row visibility ratio
      const visibleH = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      const ratio = Math.max(0, Math.min(1, visibleH / Math.max(1, r.height)));

      // Row center band
      const center = r.top + r.height / 2;
      const centerInBand = center > vh * 0.2 && center < vh * 0.8;

      return sectionSpans && headerOnscreen && ratio >= 0.6 && centerInBand && !openEdu && !reduced;
    };

    const onScrollOrResize = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const dir: "down" | "up" = y >= (lastScrollY.current || 0) ? "down" : "up";
      lastScrollY.current = y;

      const nextLocked = computeLock();

      // Edge-trigger: on entering lock, set starting step by direction
      if (nextLocked && !wasLocked.current) {
        setStep(dir === "down" ? 0 : maxStep);
      }
      wasLocked.current = nextLocked;
      setIsLocked(nextLocked);
    };

    onScrollOrResize();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [maxStep, openEdu, reduced]);

  // Intercept gestures while locked (listeners mount once; read live state via ref)
  useLockedGestures({
    steps: maxStep,
    getStep: () => step,
    setStep: (n) => setStep(n),
    isLocked,
    threshold: 110,
    cooldownMs: 170,
  });

  // Prevent background scroll when modal open
  React.useEffect(() => {
    if (openEdu) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [openEdu]);

  // Visible cards during lock; show all if reduced motion
  const visibleCount = reduced ? total : (isLocked ? Math.min(step, total) : 0);

  return (
    <section id="education" aria-label="Education" className="relative">
      {/* Tightened runway to reduce gap before Testimonials */}
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

          {/* Subtle settle effect (kept below tiles so it never blocks clicks) */}
          <AnimatePresence>
            {visibleCount >= total && (
              <motion.div
                key="settle"
                className="absolute inset-0"
                style={{ zIndex: 30 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.10 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
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
