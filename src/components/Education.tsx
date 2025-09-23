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

/* ----------------- Gesture lock (fast-scroll & escapable) ------------------ */
function useStepLock(opts: {
  steps: number;                 // inclusive: 0..steps
  getStep: () => number;
  setStep: (n: number) => void;
  isLocked: () => boolean;       // live lock predicate
  threshold?: number;            // px per step
  minCooldownMs?: number;        // anti-spam
}) {
  const { steps, getStep, setStep, isLocked, threshold = 110, minCooldownMs = 90 } = opts;

  const lastStepAt = React.useRef(0);

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
    let touchY = 0;

    const onWheel = (e: WheelEvent) => {
      if (!isLocked()) return;

      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      const cur = getStep();

      // allow exit at ends
      if ((cur === 0 && dir === -1) || (cur === steps && dir === 1)) return;

      // convert big deltas into multiple steps so fast scroll can't skip past
      const stepsToAdvance = Math.max(1, Math.round(Math.abs(e.deltaY) / threshold));
      e.preventDefault();
      advance(dir, stepsToAdvance);
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
      touchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isLocked()) return;
      const y = e.touches[0]?.clientY ?? 0;
      const dy = touchY - y; // + down
      touchY = y;
      const dir: 1 | -1 = dy > 0 ? 1 : -1;
      const cur = getStep();
      if ((cur === 0 && dir === -1) || (cur === steps && dir === 1)) return;
      const stepsToAdvance = Math.max(1, Math.round(Math.abs(dy) / threshold));
      e.preventDefault();
      advance(dir, stepsToAdvance);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("keydown", onKey as any);
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
    };
  }, [advance, getStep, isLocked, steps, threshold]);
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
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      // Always allow clicks when visible; no overlays above this.
      className={`relative text-left overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10 bg-[#0d131d] focus:outline-none focus:ring-2 focus:ring-cyan-300/70 ${
        visible ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      style={{ zIndex: 41 }}
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

  // Lock state
  const [locked, setLocked] = React.useState(false);
  const prevLocked = React.useRef(false);
  const lastScrollY = React.useRef(0);

  // Reduced motion
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(m.matches);
    apply();
    m.addEventListener?.("change", apply);
    return () => m.removeEventListener?.("change", apply);
  }, []);

  /* ----------------- Lock predicate (robust & re-enterable) ------------------ */
  React.useEffect(() => {
    const onScrollOrResize = () => {
      const sec = sectionRef.current;
      const header = headerRef.current;
      const row = rowRef.current;
      const vh = window.innerHeight || 1;
      if (!sec || !header || !row) return;

      const s = sec.getBoundingClientRect();
      const h = header.getBoundingClientRect();
      const r = row.getBoundingClientRect();

      // section spans viewport (sticky active) with tiny hysteresis
      const spansNow = s.top <= 0 && s.bottom >= vh;
      const spansLeave = s.top > 2 || s.bottom < vh - 2;
      const sectionSpans = locked ? !spansLeave : spansNow;

      // title visible
      const headerOnscreen = h.bottom > 0 && h.top < vh;

      // row center ~middle band so it doesn't engage too early/late
      const center = r.top + r.height / 2;
      const centerBand = center > vh * 0.2 && center < vh * 0.8;

      // row sufficiently visible (handles small screens)
      const visibleH = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      const ratio = Math.max(0, Math.min(1, visibleH / Math.max(1, r.height)));
      const rowVisible = ratio >= 0.45;

      const wantLock = !reduced && !openEdu && sectionSpans && headerOnscreen && centerBand && rowVisible;

      // direction + re-entry step set
      const y = window.scrollY || window.pageYOffset || 0;
      const dir: "down" | "up" = y >= (lastScrollY.current || 0) ? "down" : "up";
      lastScrollY.current = y;

      if (wantLock && !prevLocked.current) {
        setStep(dir === "down" ? 0 : maxStep);
      }
      prevLocked.current = wantLock;
      setLocked(wantLock);
    };

    onScrollOrResize();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [maxStep, openEdu, reduced, locked]);

  /* ---------- Intercept gestures while locked (fast & escapable) ----------- */
  useStepLock({
    steps: maxStep,
    getStep: () => step,
    setStep: (n) => setStep(n),
    isLocked: () => locked,
    threshold: 105,         // slightly snappier
    minCooldownMs: 70,
  });

  /* -------------- Disable background scroll when modal is open -------------- */
  React.useEffect(() => {
    if (!openEdu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [openEdu]);

  const visibleCount = reduced ? total : (locked ? Math.min(step, total) : 0);

  return (
    <section id="education" aria-label="Education" className="relative">
      {/* Tight runway to reduce gap before Testimonials */}
      <div ref={sectionRef} className="relative min-h-[140vh]">
        <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">
          {/* Header (no pointer-events disabled) */}
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

          {/* Row of cards — guaranteed clickable when visible */}
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

          {/* Decorative glow (below tiles and non-interactive) */}
          <AnimatePresence>
            {visibleCount >= total && (
              <motion.div
                key="settle"
                className="absolute inset-0 z-30 pointer-events-none"
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

