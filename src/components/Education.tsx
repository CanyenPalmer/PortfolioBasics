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
  threshold?: number;
  minCooldownMs?: number;
}) {
  const { steps, getStep, setStep, isLocked, threshold = 52, minCooldownMs = 45 } = opts;
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

  React.useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!isLocked()) return;
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      const cur = getStep();
      // Let user leave at ends (no preventDefault)
      if ((cur === 0 && dir === -1) || (cur === steps && dir === 1)) return;

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
      const cur = getStep();
      if ((cur === 0 && dir === -1) || (cur === steps && dir === 1)) return;
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
      const cur = getStep();
      if ((cur === 0 && dir === -1) || (cur === steps && dir === 1)) return;

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
  }, [advance, getStep, isLocked, steps, threshold]);
}

/* ------------------------- Intersection Observer hook ------------------------- */
function useLockTrigger(opts: {
  stickyEl: React.RefObject<HTMLElement>;
  headerEl: React.RefObject<HTMLElement>;
  rowEl: React.RefObject<HTMLElement>;
  openModal: boolean;
  reduced: boolean;
}) {
  const { stickyEl, headerEl, rowEl, openModal, reduced } = opts;

  const [locked, setLocked] = React.useState(false);
  const prevLocked = React.useRef(false);
  const lastScrollY = React.useRef(0);

  // Sentinels to observe when we are inside the section viewport
  const topSentinel = React.useRef<HTMLDivElement | null>(null);
  const botSentinel = React.useRef<HTMLDivElement | null>(null);
  const [topOut, setTopOut] = React.useState(false);
  const [botOut, setBotOut] = React.useState(false);
  const [rowCentered, setRowCentered] = React.useState(false);
  const [rowVisible, setRowVisible] = React.useState(0);

  // Create sentinels once
  React.useEffect(() => {
    const sticky = stickyEl.current;
    if (!sticky) return;

    if (!topSentinel.current) {
      const n = document.createElement("div");
      n.setAttribute("data-edu-top", "1");
      n.style.position = "absolute";
      n.style.top = "0px";
      n.style.left = "0";
      n.style.right = "0";
      n.style.height = "1px";
      n.style.pointerEvents = "none";
      sticky.appendChild(n);
      topSentinel.current = n;
    }
    if (!botSentinel.current) {
      const n = document.createElement("div");
      n.setAttribute("data-edu-bot", "1");
      n.style.position = "absolute";
      n.style.bottom = "0px";
      n.style.left = "0";
      n.style.right = "0";
      n.style.height = "1px";
      n.style.pointerEvents = "none";
      sticky.appendChild(n);
      botSentinel.current = n;
    }
    return () => {
      try {
        topSentinel.current && topSentinel.current.remove();
        botSentinel.current && botSentinel.current.remove();
      } catch {}
      topSentinel.current = null;
      botSentinel.current = null;
    };
  }, [stickyEl]);

  // Observe sentinels
  React.useEffect(() => {
    if (!topSentinel.current || !botSentinel.current) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const isTop = (e.target as HTMLElement).hasAttribute("data-edu-top");
          const isBot = (e.target as HTMLElement).hasAttribute("data-edu-bot");
          const out = e.intersectionRatio === 0;
          if (isTop) setTopOut(out);
          if (isBot) setBotOut(out);
        }
      },
      { threshold: [0, 0.01, 1], root: null }
    );
    io.observe(topSentinel.current);
    io.observe(botSentinel.current);
    return () => io.disconnect();
  }, []);

  // Observe row visibility & centeredness
  React.useEffect(() => {
    const row = rowEl.current;
    if (!row) return;

    const io = new IntersectionObserver(
      (entries) => {
        const r = entries[0];
        setRowVisible(r.intersectionRatio); // 0..1
        const vh = window.innerHeight || 1;
        const rect = row.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        setRowCentered(center > vh * 0.25 && center < vh * 0.75);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], root: null }
    );
    io.observe(row);
    return () => io.disconnect();
  }, [rowEl]);

  // Determine lock state
  React.useEffect(() => {
    const onTick = () => {
      // Sticky is "active" if top sentinel is above viewport AND bottom sentinel is below viewport
      const stickyActive = topOut && botOut;
      const wantLock = stickyActive && rowCentered && rowVisible >= 0.45 && !openModal && !reduced;

      // Direction-aware step on entry
      const y = window.scrollY || window.pageYOffset || 0;
      const dir: "down" | "up" = y >= (lastScrollY.current || 0) ? "down" : "up";
      lastScrollY.current = y;

      if (wantLock && !prevLocked.current) {
        // entry step
        // (down → start at 0, up → start at max; the component that uses this hook will set it)
      }
      prevLocked.current = wantLock;
      setLocked(wantLock);
    };

    const id = requestAnimationFrame(onTick);
    return () => cancelAnimationFrame(id);
  }, [topOut, botOut, rowCentered, rowVisible, openModal, reduced]);

  return locked;
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
      transition={{ duration: 0.33, ease: [0.22, 1, 0.36, 1] }}
      className={`relative text-left overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10 bg-[#0d131d] focus:outline-none focus:ring-2 focus:ring-cyan-300/70 ${
        visible ? "pointer-events-auto" : "pointer-events-none"
      }`}
      tabIndex={visible ? 0 : -1}
      style={{ zIndex: 50 }} // higher than any glow
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
                    <a
                      href={edu.href} target="_blank" rel="noreferrer"
                      className="inline-block mt-5 text-sm underline underline-offset-4 decoration-cyan-300/70 hover:decoration-cyan-300"
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
  const total = items.length;
  const maxStep = total;

  const [step, setStep] = React.useState(0);
  const [reduced, setReduced] = React.useState(false);
  const [openEdu, setOpenEdu] = React.useState<Edu | null>(null);

  const sectionRef = React.useRef<HTMLDivElement>(null);
  const stickyRef  = React.useRef<HTMLDivElement>(null);
  const headerRef  = React.useRef<HTMLDivElement>(null);
  const rowRef     = React.useRef<HTMLDivElement>(null);

  // Lock state with ref for listeners
  const [isLocked, setIsLocked] = React.useState(false);
  const isLockedRef = React.useRef(false);
  const lastScrollY = React.useRef(0);
  const wasLocked = React.useRef(false);

  // Reduced motion
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(m.matches);
    apply();
    m.addEventListener?.("change", apply);
    return () => m.removeEventListener?.("change", apply);
  }, []);

  // Observe + decide lock
  const lockActive = useLockTrigger({
    stickyEl: stickyRef,
    headerEl: headerRef,
    rowEl: rowRef,
    openModal: !!openEdu,
    reduced,
  });

  // Decide entry step based on direction when lock toggles on
  React.useEffect(() => {
    const y = window.scrollY || window.pageYOffset || 0;
    const dir: "down" | "up" = y >= (lastScrollY.current || 0) ? "down" : "up";
    lastScrollY.current = y;

    if (lockActive && !wasLocked.current) {
      setStep(dir === "down" ? 0 : maxStep);
    }
    wasLocked.current = lockActive;
    setIsLocked(lockActive);
    isLockedRef.current = lockActive;
  }, [lockActive, maxStep]);

  // Gesture engine
  useStepEngine({
    steps: maxStep,
    getStep: () => step,
    setStep: (n) => setStep(n),
    isLocked: () => isLockedRef.current,
    threshold: 52,    // quick reveal
    minCooldownMs: 45,
  });

  // Modal blocks background scroll (only while open)
  React.useEffect(() => {
    if (!openEdu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [openEdu]);

  const visibleCount = reduced ? total : (isLocked ? Math.min(step, total) : 0);

  return (
    <section id="education" aria-label="Education" className="relative">
      {/* modest runway to avoid overscroll gap */}
      <div ref={sectionRef} className="relative min-h-[140vh]">
        <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">
          {/* Header */}
          <div
            ref={headerRef}
            className="absolute left-0 right-0 top-0 z-60 flex flex-col items-center pt-8 sm:pt-10"
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

          {/* Cards (clickable when visible) */}
          <div className="absolute inset-0 z-50 flex items-start justify-center">
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
                className="absolute inset-0 z-40 pointer-events-none"
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

      {/* Modal with full details */}
      <EduModal edu={openEdu} onClose={() => setOpenEdu(null)} />
    </section>
  );
}



