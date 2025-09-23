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
  description?: string;
  achievements?: string[];
  courses?: string[];
};

type Edu = {
  title: string;
  sub: string;
  years?: string;
  href?: string;
  img: string;
  key: string;
  description?: string;
  achievements?: string[];
  courses?: string[];
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
    img: e.img ?? resolveHeroFromTitle(title),
    key: slugify(title || sub || "edu"),
    description: e.description,
    achievements: e.achievements,
    courses: e.courses,
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

/* ----------------- Step engine (fast, escapable, momentum-friendly) ----------------- */
function useStepEngine(opts: {
  steps: number;
  getStep: () => number;
  setStep: (n: number) => void;
  isLocked: () => boolean;
  onExitLock: () => void;       // called when user tries to scroll past ends
  threshold?: number;
  minCooldownMs?: number;
}) {
  const { steps, getStep, setStep, isLocked, onExitLock, threshold = 50, minCooldownMs = 45 } = opts;
  const lastStepAt = React.useRef(0);
  const wheelAcc = React.useRef(0);
  const touchAcc = React.useRef(0);
  const touchY = React.useRef(0);

  const advance = React.useCallback((dir: 1 | -1, amount = 1) => {
    const now = performance.now();
    if (now - lastStepAt.current < minCooldownMs) return;
    const cur = getStep();
    const next = Math.max(0, Math.min(steps, cur + dir * amount));
    if (next !== cur) {
      setStep(next);
      lastStepAt.current = now;
    }
  }, [getStep, setStep, steps, minCooldownMs]);

  const maybeExit = React.useCallback((dir: 1 | -1) => {
    const cur = getStep();
    if ((cur === 0 && dir === -1) || (cur === steps && dir === 1)) {
      // user intends to leave; unlock immediately
      onExitLock();
      return true;
    }
    return false;
  }, [getStep, steps, onExitLock]);

  React.useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!isLocked()) return;
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;

      // let native scroll go if at ends, but UNLOCK first so page moves next tick
      if (maybeExit(dir)) return;

      // accumulate & convert to steps
      wheelAcc.current += e.deltaY;
      const stepsToAdvance = Math.floor(Math.abs(wheelAcc.current) / threshold);
      e.preventDefault();
      if (stepsToAdvance >= 1) {
        advance(Math.sign(wheelAcc.current) as 1 | -1, stepsToAdvance);
        wheelAcc.current = wheelAcc.current % threshold;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (!isLocked()) return;
      const keys = ["PageDown", "PageUp", " ", "Spacebar", "ArrowDown", "ArrowUp"];
      if (!keys.includes(e.key)) return;
      const dir: 1 | -1 = (e.key === "ArrowUp" || e.key === "PageUp") ? -1 : 1;

      if (maybeExit(dir)) return;

      e.preventDefault();
      advance(dir, 1);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!isLocked()) return;
      touchY.current = e.touches[0]?.clientY ?? 0;
      touchAcc.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isLocked()) return;
      const y = e.touches[0]?.clientY ?? 0;
      const dy = touchY.current - y;
      touchY.current = y;
      const dir: 1 | -1 = dy > 0 ? 1 : -1;

      if (maybeExit(dir)) return;

      touchAcc.current += dy;
      const stepsToAdvance = Math.floor(Math.abs(touchAcc.current) / threshold);
      e.preventDefault();
      if (stepsToAdvance >= 1) {
        advance(Math.sign(touchAcc.current) as 1 | -1, stepsToAdvance);
        touchAcc.current = touchAcc.current % threshold;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("keydown", onKey, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });

    return () => {
      window.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("keydown", onKey as any);
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
    };
  }, [advance, isLocked, maybeExit, threshold]);
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
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className={`relative text-left overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10 bg-[#0d131d] focus:outline-none focus:ring-2 focus:ring-cyan-300/70 ${
        visible ? "pointer-events-auto" : "pointer-events-none"
      }`}
      tabIndex={visible ? 0 : -1}
      style={{ zIndex: 70 }} // above any glow
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
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            key="sheet"
            role="dialog" aria-modal="true"
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-[min(960px,95vw)] overflow-hidden rounded-2xl bg-[#0d131d] ring-1 ring-white/10 shadow-2xl relative">
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
                  <img src={edu.img} alt={edu.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className={`text-xl sm:text-2xl font-semibold ${outfit.className}`}>{edu.title}</h3>
                  <p className={`mt-1 text-sm sm:text-base opacity-85 ${plus.className}`}>{edu.sub}</p>
                  {edu.years && <p className="mt-2 text-xs sm:text-sm opacity-70">{edu.years}</p>}
                  {edu.description && <p className="mt-4 text-sm leading-relaxed opacity-90">{edu.description}</p>}
                  {Array.isArray(edu.achievements) && edu.achievements.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm font-semibold opacity-90">Achievements</div>
                      <ul className="mt-1 list-disc pl-5 text-sm opacity-85 space-y-1">
                        {edu.achievements.map((a, i) => <li key={i}>{a}</li>)}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(edu.courses) && edu.courses.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm font-semibold opacity-90">Selected Courses</div>
                      <ul className="mt-1 list-disc pl-5 text-sm opacity-85 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                        {edu.courses.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  )}
                  {edu.href && (
                    <a href={edu.href} target="_blank" rel="noreferrer" className="inline-block mt-5 text-sm underline underline-offset-4 decoration-cyan-300/70 hover:decoration-cyan-300">
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
  const total = items.length;
  const maxStep = total; // steps 0..total

  const [step, setStep] = React.useState(0);
  const [reduced, setReduced] = React.useState(false);
  const [openEdu, setOpenEdu] = React.useState<Edu | null>(null);

  const sectionRef = React.useRef<HTMLDivElement>(null);
  const stickyRef  = React.useRef<HTMLDivElement>(null);
  const headerRef  = React.useRef<HTMLDivElement>(null);
  const rowRef     = React.useRef<HTMLDivElement>(null);

  const [locked, setLocked] = React.useState(false);
  const lockedRef = React.useRef(false);
  const wasLocked = React.useRef(false);
  const lastScrollY = React.useRef(0);

  // respect reduced motion
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(m.matches);
    apply();
    m.addEventListener?.("change", apply);
    return () => m.removeEventListener?.("change", apply);
  }, []);

  /* ---------------- Lock trigger: sticky frame spanning viewport ---------------- */
  React.useEffect(() => {
    const onScrollOrResize = () => {
      const sticky = stickyRef.current;
      const vh = window.innerHeight || 1;
      if (!sticky) return;

      const s = sticky.getBoundingClientRect();
      // Engage when sticky spans viewport; add a tiny hysteresis to avoid flicker.
      const spansNow = s.top <= 0 && s.bottom >= vh;
      const spansLeave = s.top > 2 || s.bottom < vh - 2;
      const next = !reduced && !openEdu && (lockedRef.current ? !spansLeave : spansNow);

      // direction-aware step on entry
      const y = window.scrollY || window.pageYOffset || 0;
      const dir: "down" | "up" = y >= (lastScrollY.current || 0) ? "down" : "up";
      lastScrollY.current = y;

      if (next && !wasLocked.current) {
        setStep(dir === "down" ? 0 : maxStep);
      }
      wasLocked.current = next;

      // Apply/restore hard page freeze so lock *always* engages
      if (next && !lockedRef.current) {
        const html = document.documentElement;
        html.style.overflow = "hidden";
      } else if (!next && lockedRef.current) {
        const html = document.documentElement;
        html.style.overflow = "";
      }

      setLocked(next);
      lockedRef.current = next;
    };

    onScrollOrResize();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      // safety restore
      document.documentElement.style.overflow = "";
    };
  }, [maxStep, openEdu, reduced]);

  /* ---------------- Release immediately when user tries to leave ---------------- */
  const exitLock = React.useCallback(() => {
    if (!lockedRef.current) return;
    // restore overflow and unlock now
    document.documentElement.style.overflow = "";
    setLocked(false);
    lockedRef.current = false;
  }, []);

  /* ---------------- Gesture engine while locked (fast & escapable) -------------- */
  useStepEngine({
    steps: maxStep,
    getStep: () => step,
    setStep: (n) => setStep(n),
    isLocked: () => lockedRef.current,
    onExitLock: exitLock,
    threshold: 48,         // quick reveal
    minCooldownMs: 40,
  });

  /* ---------------- Prevent background scroll only when modal open --------------- */
  React.useEffect(() => {
    if (!openEdu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [openEdu]);

  const visibleCount = reduced ? total : (locked ? Math.min(step, total) : 0);

  return (
    <section id="education" aria-label="Education" className="relative">
      {/* modest runway to avoid overscroll gap */}
      <div ref={sectionRef} className="relative min-h-[140vh]">
        <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">
          {/* Header */}
          <div
            ref={headerRef}
            className="absolute left-0 right-0 top-0 z-[80] flex flex-col items-center pt-8 sm:pt-10"
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

          {/* Cards — ALWAYS clickable when visible */}
          <div className="absolute inset-0 z-[70] flex items-start justify-center">
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

          {/* Subtle glow (non-interactive, below tiles) */}
          <AnimatePresence>
            {visibleCount >= total && (
              <motion.div
                key="settle"
                className="absolute inset-0 z-[60] pointer-events-none"
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



