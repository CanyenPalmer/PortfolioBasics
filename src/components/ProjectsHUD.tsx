// src/components/ProjectsHUD.tsx
"use client";

import * as React from "react";
import TransitionLink from "@/components/TransitionLink";
import { profile } from "@/content/profile";
import { slugify } from "@/lib/slug";
import { Oswald, Plus_Jakarta_Sans } from "next/font/google";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";

const oswald = Oswald({ subsets: ["latin"], weight: ["400", "500", "700"] });
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type Project = {
  title: string;
  tech?: string[];
  links?: { label?: string; href: string }[];
};

const IMAGE_BY_TITLE: Record<string, { src: string; alt: string }> = {
  "CGM Patient Analytics": { src: "/images/cgm-patient-avatar.png", alt: "CGM Patient Analytics preview" },
  "Logistic Regression & Tree-Based ML": { src: "/images/logistic-regression-avatar.png", alt: "Logistic & Tree-Based ML preview" },
  "Real Estate Conditions Comparison (R)": { src: "/images/real-estate-avatar.png", alt: "Real Estate GLM (R) preview" },
  "Python 101": { src: "/images/python-101-avatar.png", alt: "Python 101 preview" },
  "MyCaddy — Physics Shot Calculator": { src: "/images/mycaddy-avatar.png", alt: "MyCaddy app preview" },
  "PortfolioBasics (This Site)": { src: "/images/portfolio-basics-avatar.png", alt: "Portfolio website preview" },
};

const KEYWORD_BY_TITLE: Record<string, string> = {
  "CGM Patient Analytics": "predictive-analysis",
  "Logistic Regression & Tree-Based ML": "machine-learning",
  "Real Estate Conditions Comparison (R)": "statistics",
  "Python 101": "education",
  "MyCaddy — Physics Shot Calculator": "data-pipeline",
  "PortfolioBasics (This Site)": "frontend",
};

const ASPECT: Record<string, string> = {
  "CGM Patient Analytics": "3 / 4",
  "MyCaddy — Physics Shot Calculator": "3 / 4",
  "PortfolioBasics (This Site)": "3 / 4",
  "Real Estate Conditions Comparison (R)": "3 / 4",
  "Logistic Regression & Tree-Based ML": "16 / 9",
  "Python 101": "2 / 3",
};

// Tonal solids per project — higher opacity to fully mask background
const TONE_BY_TITLE: Record<string, string> = {
  "CGM Patient Analytics": "bg-emerald-500/70 ring-emerald-400/40",
  "Logistic Regression & Tree-Based ML": "bg-sky-500/70 ring-sky-400/40",
  "Real Estate Conditions Comparison (R)": "bg-amber-500/70 ring-amber-400/40",
  "Python 101": "bg-indigo-500/70 ring-indigo-400/40",
  "MyCaddy — Physics Shot Calculator": "bg-lime-500/70 ring-lime-400/40",
  "PortfolioBasics (This Site)": "bg-fuchsia-500/70 ring-fuchsia-400/40",
};
function toneFor(title: string) {
  return TONE_BY_TITLE[title] ?? "bg-white/70 ring-white/40";
}

const LAYOUT = {
  lg: {
    containerHeight: 1750,
    items: {
      // Slight width reductions + small vertical offsets to avoid overlap
      "CGM Patient Analytics": { left: "5%", top: 0, width: "23%" },
      "MyCaddy — Physics Shot Calculator": { left: "32%", top: 100, width: "22%" },
      "PortfolioBasics (This Site)": { left: "59%", top: 210, width: "27%" },
      "Real Estate Conditions Comparison (R)": { left: "5%", top: 570, width: "23%" },
      "Logistic Regression & Tree-Based ML": { left: "32%", top: 870, width: "52%" },
      "Python 101": { left: "5%", top: 1130, width: "23%" },
    } as Record<string, { left: string; top: number; width: string }>,
    note: { left: "54%", top: 1370, width: "34%" },
  },
};

const TILE_ORDER = [
  "CGM Patient Analytics",
  "MyCaddy — Physics Shot Calculator",
  "PortfolioBasics (This Site)",
  "Real Estate Conditions Comparison (R)",
  "Logistic Regression & Tree-Based ML",
  "Python 101",
];

/* -------------------- small utils -------------------- */
function keywordFor(title: string, tech?: string[]) {
  if (KEYWORD_BY_TITLE[title]) return KEYWORD_BY_TITLE[title];
  if (tech?.some((t) => /scikit-learn|xgboost|lightgbm/i.test(t))) return "machine-learning";
  if (tech?.some((t) => /\bR\b/i.test(t))) return "statistics";
  if (tech?.some((t) => /sql|sqlite|postgres/i.test(t))) return "data-pipeline";
  return "project";
}
function docTop(el: HTMLElement | null) {
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  return r.top + (window.scrollY || window.pageYOffset || 0);
}

/* -------------------- bits -------------------- */
function ProjectTile({ p, left, top, width }: { p: Project; left: string; top: number; width: string }) {
  const img = IMAGE_BY_TITLE[p.title] ?? { src: "/images/portfolio-basics-avatar.png", alt: `${p.title} preview` };
  const slug = slugify(p.title);
  const aspect = ASPECT[p.title] ?? "3 / 4";
  const tone = toneFor(p.title);

  return (
    <article className="absolute z-10" style={{ left, top, width }} aria-label={p.title}>
      {/* Tinted panel wrapper: uniform padding on ALL sides */}
      <div className={`rounded-2xl ring-1 ${tone} shadow-lg shadow-black/30`}>
        <TransitionLink
          href={`/projects/${slug}?via=projects`}
          className="block group"
          onClick={() => {
            if (typeof window !== "undefined") window.sessionStorage.setItem("cameFromProjects", "1");
          }}
        >
          <div className="p-3 md:p-4">
            <div style={{ aspectRatio: aspect }} className="w-full overflow-hidden rounded-xl">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-contain select-none transition-transform duration-300 ease-out group-hover:scale-[1.03] will-change-transform"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/images/portfolio-basics-avatar.png";
                }}
              />
            </div>

            <div className="mt-3 flex items-baseline justify-between gap-3">
              <h3 className="text-base md:text-lg font-medium tracking-tight text-white/90">
                <TransitionLink
                  href={`/projects/${slug}?via=projects`}
                  className="hover:underline"
                  onClick={() => {
                    if (typeof window !== "undefined") window.sessionStorage.setItem("cameFromProjects", "1");
                  }}
                >
                  {p.title}
                </TransitionLink>
              </h3>
              <span className="text-[11px] md:text-xs uppercase tracking-wide text-white/90">
                {keywordFor(p.title, p.tech)}
              </span>
            </div>
          </div>
        </TransitionLink>
      </div>
    </article>
  );
}

function BlurbAndNote({ left, top, width }: { left: string; top: number; width: string }) {
  // Opaque neutral panel for the moving “detail passage”
  return (
    <div className="absolute hidden md:block z-0" style={{ left, top, width }}>
      <div className="rounded-2xl ring-1 ring-white/10 bg-[#0d131d] shadow-lg shadow-black/30 px-5 py-4 pointer-events-none">
        <p className="text-[15px] leading-tight text-white/90 mb-4">
          I carry projects from messy data to maintainable tools—analyses, models, and apps that are rigorous, documented, and usable.
        </p>
        <div className="grid grid-cols-[8.5rem,1fr] gap-x-6">
          <div className="text-[12px] leading-tight text-white/85 font-medium">
            <div>Showcase</div>
            <div>Highlights</div>
          </div>
          <div className="flex flex-col gap-2 text-[14px] leading-snug text-white/95">
            <div><span className="font-semibold">96.2% accuracy (AUC 93.8%)</span> on employee-retention models</div>
            <div><span className="font-semibold">$317k patient responsibility</span> surfaced; CSV → Python → Excel export</div>
            <div><span className="font-semibold">2.3k-home pricing model (R)</span> — 60+ features, RMSE-driven selection</div>
            <div><span className="font-semibold">Physics-based golf yardage</span> calculator (wind, temp, lie)</div>
            <div><span className="font-semibold">Next.js portfolio</span> with README-driven project pages</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StageHeader({ onMeasured }: { onMeasured: (h: number) => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!ref.current) return;
    const measure = () => onMeasured(Math.round(ref.current!.getBoundingClientRect().height));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ref.current);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [onMeasured]);

  return (
    <div ref={ref}>
      <div className={`${oswald.className} leading-none tracking-tight`}>
        <div className="inline-block">
          <div className="text-xl md:text-2xl font-medium text-white/90">Palmer</div>
          <div className="h-[2px] bg-white/25 mt-1" />
        </div>
        <h2 className="mt-3 uppercase font-bold text-white/90 tracking-tight text-[12vw] md:text-[9vw] lg:text-[8vw]">Projects</h2>
      </div>
      <div className={`${plusJakarta.className} mt-3 text-sm md:text-base text-white/70`}>
        Select a project to view the full details
      </div>
    </div>
  );
}

function PACEBackground({ topOffset, height }: { topOffset: number; height: number }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 z-[5]" style={{ top: topOffset, height }}>
      <div className="relative h-full w-full">
        <div className="absolute left-6 top-2 bottom-2 w-px bg-white/10" />
        <NodeWithBranches top="0%"  label="PLAN"      sub="Scope for outcomes"         branches={["Storyboard", "Framework", "Deadline"]} />
        <NodeWithBranches top="28%" label="ANALYZE"   sub="Turn data into direction"   branches={["Data audit", "Hypotheses", "Methods"]} />
        <NodeWithBranches top="58%" label="CONSTRUCT" sub="Build, iterate, instrument" branches={["Prototype", "Feedback", "Instrumentation"]} />
        <NodeWithBranches top="88%" label="EXECUTE"   sub="Ship, train, measure"       branches={["Deploy", "Enablement", "Impact"]} />
      </div>
    </div>
  );
}

function NodeWithBranches({
  top,
  label,
  sub,
  branches,
}: {
  top: string;
  label: string;
  sub: string;
  branches: string[];
}) {
  return (
    <div className="absolute left-0 right-0" style={{ top }}>
      <div className="relative pl-16 pr-4">
        <div className="absolute left-2 top-1 h-7 w-7 rounded-full bg-white/10 ring-1 ring-white/15" />
        <div className="text-white/85">
          <div className="text-xs tracking-[0.22em] text-white/60">{label}</div>
          <div className="text-sm md:text-base text-white/80">{sub}</div>
        </div>
        <div className="absolute left-16 top-[1.6rem] h-px w-10 bg-white/12" />
        <div className="ml-24 flex flex-wrap gap-3 mt-1">
          {branches.map((b) => (
            <div key={b} className="rounded-md border border-white/15 px-3 py-1 text-[11px] md:text-xs text-white/70">
              {b}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Left rail (persistent) -------------------- */
function LeftRail({ height, top }: { height: number; top: number }) {
  const [paused, setPaused] = React.useState(false);
  const TOP_FADE = 250;
  const BOTTOM_FADE = 96;

  const measureRef = React.useRef<HTMLSpanElement | null>(null);
  const [rowH, setRowH] = React.useState<number>(0);
  React.useEffect(() => {
    if (!measureRef.current) return;
    const measure = () => {
      const w = Math.ceil(measureRef.current!.getBoundingClientRect().width);
      setRowH(w + 8);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(measureRef.current);
    return () => ro.disconnect();
  }, []);

  const [rows, setRows] = React.useState<number>(80);
  React.useEffect(() => {
    if (!height || !rowH) return;
    const target = Math.min(600, Math.max(40, Math.ceil((height / rowH) * 1.6)));
    setRows(target);
  }, [height, rowH]);

  const innerRef = React.useRef<HTMLDivElement | null>(null);
  const yRef = React.useRef(0);
  const lastRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    let raf = 0;
    const SPEED = 22;
    const tick = (ts: number) => {
      const last = lastRef.current ?? ts;
      lastRef.current = ts;
      if (!paused && innerRef.current && rowH > 0) {
        const dt = (ts - last) / 1000;
        let y = yRef.current - SPEED * dt;
        const wrapRows = Math.floor(-y / rowH);
        if (wrapRows > 0) y += wrapRows * rowH;
        yRef.current = y;
        innerRef.current.style.transform = `translateY(${y.toFixed(2)}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, rowH]);

  return (
    <div
      className="relative w-16 overflow-hidden"
      style={{
        height: `${height}px`,
        marginTop: top,
        WebkitMaskImage: `linear-gradient(to bottom, transparent 0px, black ${TOP_FADE}px, black calc(100% - ${BOTTOM_FADE}px), transparent 100%)`,
        maskImage: `linear-gradient(to bottom, transparent 0px, black ${TOP_FADE}px, black calc(100% - ${BOTTOM_FADE}px), transparent 100%)`,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* hidden measurer */}
      <span
        ref={measureRef}
        className={`${plusJakarta.className} text-[11px] tracking-[0.18em] absolute opacity-0 pointer-events-none whitespace-nowrap`}
      >
        Scroll to Explore
      </span>

      {/* moving column */}
      <div className="absolute inset-0">
        <div ref={innerRef} className="will-change-transform">
          <RailColumn rows={rows} rowH={rowH || 40} />
        </div>
      </div>
    </div>
  );
}
function RailColumn({ rows, rowH }: { rows: number; rowH: number }) {
  const lines = new Array(rows).fill("Scroll to Explore");
  return (
    <div className="box-border flex flex-col items-center" style={{ paddingTop: rowH, paddingBottom: rowH }}>
      {lines.map((txt, i) => (
        <div key={`${txt}-${i}`} className="flex items-center justify-center overflow-hidden" style={{ height: rowH, width: "100%" }}>
          <span className={`${plusJakarta.className} inline-block rotate-90 origin-center whitespace-nowrap text-[11px] tracking-[0.18em] text-white/40 select-none`}>
            {txt}
          </span>
        </div>
      ))}
    </div>
  );
}

/* -------------------- Component -------------------- */
export default function ProjectsHUD() {
  const projects = ((profile as any)?.projects ?? []) as ReadonlyArray<Project>;
  const stageH = typeof window === "undefined" ? 800 : window.innerHeight;

  const preStageRef = React.useRef<HTMLDivElement>(null);
  const driverRef = React.useRef<HTMLDivElement>(null);
  const lockEndRef = React.useRef<HTMLDivElement>(null); // true lock end
  const postStageRef = React.useRef<HTMLDivElement>(null);

  const [headerH, setHeaderH] = React.useState(0);

  const EXTRA_PACE_GAP = 84; // spacing under subheading
  const paceTop = headerH + EXTRA_PACE_GAP;
  const windowH = Math.max(360, stageH - paceTop);
  const treeH = Math.max(520, Math.min(820, Math.round(windowH * 0.75)));

  // Travel math
  const TRAVEL_CORE = Math.max(0, LAYOUT.lg.containerHeight - windowH);

  // Cards appear from bottom
  const START_FROM_BOTTOM = Math.round(windowH * 0.98);

  // >>> Increased extra-out travel so ALL cards clear the top fully
  const OUT_EXTRA = Math.max(1100, Math.round(windowH * 2.2));
  const END_Y = -TRAVEL_CORE - OUT_EXTRA;

  // Driver height used by other timings; keep as-is
  const EXIT_TAIL_BASE = Math.max(560, Math.round(windowH * 0.72));
  const EXIT_TAIL = EXIT_TAIL_BASE;
  const DRIVER_HEIGHT = START_FROM_BOTTOM + TRAVEL_CORE + EXIT_TAIL + 1;

  // We still keep this to power other pieces (rail timing, etc.)
  const { scrollYProgress } = useScroll({ target: driverRef, offset: ["start start", "end start"] });

  // Cards y driven by actual window scroll so it can start BEFORE lock when EXECUTE bottom enters
  const collageY = useMotionValue(START_FROM_BOTTOM);

  // Visibility states
  const [preVisible, setPreVisible] = React.useState(true);
  const [lockActive, setLockActive] = React.useState(false);
  const [postVisible, setPostVisible] = React.useState(false);
  const [railVisible, setRailVisible] = React.useState(false);

  // Sidebar motion / reveal
  const [postDelta, setPostDelta] = React.useState(0);
  const [railRevealY, setRailRevealY] = React.useState(0);
  const [railMaskPct, setRailMaskPct] = React.useState(0);

  // Helpers for snapping/jitter
  the const prevYRef = React.useRef(0);
  const snappingRef = React.useRef(false);
  const didSnapRef = React.useRef(false);

  useMotionValueEvent(scrollYProgress, "change", () => {});

  const railIntroOffset = Math.max(0, windowH - (paceTop + treeH));

  // Pre-lock cards overlay trigger
  const [preCardsActive, setPreCardsActive] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const prevY = prevYRef.current;
      const viewportH = typeof window !== "undefined" ? window.innerHeight : 800;

      const preTop = Math.round(docTop(preStageRef.current!));   // section start (Projects top)
      const lockStart = preTop;                                  // lock begins when section top hits viewport top
      const lockEnd = Math.round(docTop(lockEndRef.current!));   // unlock point

      // Jitter-free snap to lockStart
      const LOCK_SNAP_WINDOW = 64;
      if (!snappingRef.current) {
        const crossedDownIntoLock = prevY < lockStart && y >= lockStart + 1 && y <= lockStart + LOCK_SNAP_WINDOW;
        const microNearLock = y > lockStart && y < lockStart + 12;

        if (crossedDownIntoLock || (!didSnapRef.current && microNearLock)) {
          snappingRef.current = true;
          didSnapRef.current = true;
          const docEl = document.documentElement;
          const prevBehavior = docEl.style.scrollBehavior;
          docEl.style.scrollBehavior = "auto";
          window.scrollTo(0, lockStart);
          requestAnimationFrame(() => {
            docEl.style.scrollBehavior = prevBehavior;
            snappingRef.current = false;
          });
        }

        if (y < lockStart - 48 || y > lockEnd + 48) {
          didSnapRef.current = false;
        }
      }

      const inLock = y >= lockStart && y < lockEnd;
      const beforeLock = y < lockStart;
      const afterLock = y >= lockEnd;

      // Mutually exclusive visibility
      if (beforeLock) {
        if (!preVisible) setPreVisible(true);
        if (lockActive) setLockActive(false);
        if (postVisible) setPostVisible(false);
      } else if (inLock) {
        if (preVisible) setPreVisible(false);
        if (!lockActive) setLockActive(true);
        if (postVisible) setPostVisible(false);
      } else {
        if (preVisible) setPreVisible(false);
        if (lockActive) setLockActive(false);
        if (!postVisible) setPostVisible(true);
      }

      // Sidebar visibility across the whole Projects span
      const postTop = Math.round(docTop(postStageRef.current!));
      const postEnd = postTop + viewportH + 320;
      const viewportBottom = y + viewportH;
      const railOn = viewportBottom >= preTop && y < postEnd;
      if (railOn !== railVisible) setRailVisible(railOn);

      // Sidebar reveal synced to second node (28%) — unchanged
      const secondNodeTop = preTop + paceTop + Math.round(treeH * 0.28);
      const revealStart = secondNodeTop - viewportH + 8; // when node just enters from bottom
      const revealEnd = lockStart;
      const denom = Math.max(1, revealEnd - revealStart);
      const rp = Math.max(0, Math.min(1, (y - revealStart) / denom));
      setRailRevealY(Math.round(railIntroOffset * (1 - rp)));
      setRailMaskPct(Math.round(rp * 100));

      // === Cards: start BEFORE lock when the BOTTOM of EXECUTE (4th) node enters viewport ===
      const executeNodeTop = preTop + paceTop + Math.round(treeH * 0.88); // EXECUTE node is at 88%
      const EXEC_NODE_BLOCK_H = 120; // approximate node block height (label + branches)
      const executeBottom = executeNodeTop + EXEC_NODE_BLOCK_H;

      // Start when bottom enters viewport from the bottom edge:
      const appearStartY = executeBottom - viewportH + 8;
      const appearEndY = lockEnd; // finish by unlock

      if (y < appearStartY) {
        collageY.set(START_FROM_BOTTOM);
        if (preCardsActive) setPreCardsActive(false);
      } else if (y >= appearEndY) {
        collageY.set(END_Y);
        if (!afterLock && !preCardsActive) setPreCardsActive(true); // ensure visible if we overshoot quickly
      } else {
        const p = (y - appearStartY) / Math.max(1, appearEndY - appearStartY);
        const newY = Math.round(START_FROM_BOTTOM + (END_Y - START_FROM_BOTTOM) * Math.min(1, Math.max(0, p)));
        collageY.set(newY);
        if (!preCardsActive) setPreCardsActive(true);
      }

      // Move the sidebar with the section after unlock
      setPostDelta(afterLock ? Math.max(0, y - lockEnd) : 0);

      prevYRef.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [preVisible, lockActive, postVisible, railVisible, stageH, windowH, paceTop, treeH, railIntroOffset, collageY]);

  /* ----------- PRE-LOCK in-flow stage ----------- */
  const StaticPre = (
    <div
      className="mx-auto max-w-7xl px-6"
      style={{
        height: stageH,
        visibility: preVisible ? "visible" : "hidden",
        pointerEvents: preVisible ? "auto" : "none",
      }}
    >
      <div className="h-full md:grid md:grid-cols-[64px,1fr] md:gap-6 relative">
        <div className="hidden md:block" aria-hidden />
        <div className="relative h-full">
          <div className="pt-6 md:pt-8">
            <StageHeader onMeasured={setHeaderH} />
          </div>
          <PACEBackground topOffset={paceTop} height={treeH} />
          <div className="absolute inset-x-0" style={{ top: paceTop, height: windowH }} />
        </div>
      </div>
    </div>
  );

  /* ----------- LOCKED overlays (chrome + cards) ----------- */
  const ChromeOverlay = lockActive ? (
    <div className="fixed inset-0 z-[70] pointer-events-none">
      <div className="h-full mx-auto max-w-7xl px-6 md:grid md:grid-cols-[64px,1fr] md:gap-6 relative">
        <div className="hidden md:block" aria-hidden />
        <div className="relative h-full">
          <div className="pt-6 md:pt-8">
            <div className={`${oswald.className} leading-none tracking-tight`}>
              <div className="inline-block">
                <div className="text-xl md:text-2xl font-medium text-white/90">Palmer</div>
                <div className="h-[2px] bg-white/25 mt-1" />
              </div>
              <h2 className="mt-3 uppercase font-bold text-white/90 tracking-tight text-[12vw] md:text-[9vw] lg:text-[8vw]">
                Projects
              </h2>
            </div>
            <div className={`${plusJakarta.className} mt-3 text-sm md:text-base text-white/70`}>
              Select a project to view the full details
            </div>
          </div>
          <PACEBackground topOffset={paceTop} height={treeH} />
        </div>
      </div>
    </div>
  ) : null;

  // Cards overlay is visible EITHER once EXECUTE bottom appears (preCardsActive) OR during lock
  const CollageOverlay = (preCardsActive || lockActive) ? (
    <motion.div className="fixed inset-0 z-[75]">
      <div className="h-full mx-auto max-w-7xl px-6 md:grid md:grid-cols-[64px,1fr] md:gap-6 relative">
        <div className="hidden md:block" aria-hidden />
        <div className="relative h-full">
          <div className="absolute inset-x-0 overflow-hidden" style={{ top: 0, height: stageH }}>
            <div className="absolute inset-x-0" style={{ top: paceTop, height: windowH }}>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  WebkitMaskImage: `linear-gradient(to bottom, black 0px, black calc(100% - 180px), transparent 100%)`,
                  maskImage: `linear-gradient(to bottom, black 0px, black calc(100% - 180px), transparent 100%)`,
                }}
              />
              <motion.div
                style={{
                  y: collageY,
                  height: LAYOUT.lg.containerHeight,
                  position: "relative",
                  transform: "translateZ(0)",
                  willChange: "transform",
                }}
              >
                {TILE_ORDER.map((title) => {
                  const p = projects.find((x) => x.title === title);
                  if (!p) return null;
                  const pos = LAYOUT.lg.items[title];
                  return <ProjectTile key={`tile-${title}`} p={p} left={pos.left} top={pos.top} width={pos.width} />;
                })}
                <BlurbAndNote left={LAYOUT.lg.note.left} top={LAYOUT.lg.note.top} width={LAYOUT.lg.note.width} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  ) : null;

  /* ----------- POST-LOCK in-flow stage ----------- */
  const StaticPost = (
    <div
      className="mx-auto max-w-7xl px-6"
      style={{
        minHeight: stageH,
        visibility: postVisible ? "visible" : "hidden",
        pointerEvents: postVisible ? "auto" : "none",
      }}
    >
      <div className="h-full md:grid md:grid-cols-[64px,1fr] md:gap-6 relative">
        <div className="hidden md:block" aria-hidden />
        <div className="relative h-full">
          <div className="pt-6 md:pt-8">
            <div className={`${oswald.className} leading-none tracking-tight`}>
              <div className="inline-block">
                <div className="text-xl md:text-2xl font-medium text-white/90">Palmer</div>
                <div className="h-[2px] bg-white/25 mt-1" />
              </div>
              <h2 className="mt-3 uppercase font-bold text-white/90 tracking-tight text-[12vw] md:text-[9vw] lg:text-[8vw]">
                Projects
              </h2>
            </div>
            <div className={`${plusJakarta.className} mt-3 text-sm md:text-base text-white/70`}>
              Select a project to view the full details
            </div>
          </div>
          <PACEBackground topOffset={paceTop} height={treeH} />
          <div className="absolute inset-x-0" style={{ top: paceTop, height: windowH }} />
        </div>
      </div>
    </div>
  );

  // Mobile — match panel style
  const mobile = (
    <div className="md:hidden space-y-10 px-6 py-10 bg-[#0d131d]">
      {TILE_ORDER.map((title) => {
        const p = projects.find((x) => x.title === title);
        if (!p) return null;
        const img = IMAGE_BY_TITLE[p.title] ?? { src: "/images/portfolio-basics-avatar.png", alt: `${p.title} preview` };
        const slug = slugify(p.title);
        const aspect = ASPECT[p.title] ?? "3 / 4";
        return (
          <article key={title} className={`rounded-2xl ring-1 ${toneFor(title)} shadow-lg shadow-black/30`}>
            <TransitionLink href={`/projects/${slug}?via=projects`} className="block group">
              <div className="p-4">
                <div style={{ aspectRatio: aspect }} className="w-full overflow-hidden rounded-xl">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03] will-change-transform"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-medium tracking-tight text-white/90">
                    <TransitionLink href={`/projects/${slug}?via=projects`} className="hover:underline">
                      {p.title}
                    </TransitionLink>
                  </h3>
                  <span className="text-xs uppercase tracking-wide text-white/90">{KEYWORD_BY_TITLE[p.title] ?? "project"}</span>
                </div>
              </div>
            </TransitionLink>
          </article>
        );
      })}
    </div>
  );

  return (
    <section id="projects" aria-label="Projects" className="relative w-full bg-[#0d131d]">
      {/* Mobile */}
      {mobile}

      {/* Desktop / Tablet */}
      <div className="hidden md:block">
        {/* PRE-LOCK in-flow */}
        <div ref={preStageRef} className="relative">
          {StaticPre}
        </div>

        {/* DRIVER (kept for section distances / unlock math) */}
        <div ref={driverRef} style={{ height: DRIVER_HEIGHT }} />

        {/* Lock end marker */}
        <div ref={lockEndRef} style={{ height: 0 }} />

        {/* POST-LOCK in-flow */}
        <div ref={postStageRef} className="relative">
          {StaticPost}
        </div>

        {/* Spacer so we don’t collide with Education — shortened */}
        <div style={{ height: 320 }} />

        {/* LOCKED overlays */}
        {CollageOverlay}
        {ChromeOverlay}

        {/* PERSISTENT LEFT RAIL (unchanged) */}
        <motion.div
          className="fixed inset-0 z-[62] pointer-events-none"
          aria-hidden
          initial={false}
          animate={{ opacity: railVisible ? 1 : 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ transform: `translateY(${-postDelta}px)` }}
        >
          <div className="h-full mx-auto max-w-7xl px-6">
            <div className="relative h-full md:grid md:grid-cols-[64px,1fr] md:gap-6">
              <div className="hidden md:block">
                <div
                  style={{
                    transform: `translateY(${railRevealY}px)`,
                    WebkitMaskImage: `linear-gradient(to top, black 0%, black ${railMaskPct}%, transparent ${railMaskPct}%)`,
                    maskImage: `linear-gradient(to top, black 0%, black ${railMaskPct}%, transparent ${railMaskPct}%)`,
                    willChange: "transform, mask-image, -webkit-mask-image",
                  }}
                >
                  <LeftRail height={treeH} top={paceTop} />
                </div>
              </div>
              <div aria-hidden className="hidden md:block" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



