// src/components/ProjectsHUD.tsx
"use client";

import * as React from "react";
import TransitionLink from "@/components/TransitionLink";
import { profile } from "@/content/profile";
import { slugify } from "@/lib/slug";
import { Oswald, Plus_Jakarta_Sans } from "next/font/google";
import { motion, useScroll, useTransform } from "framer-motion";

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
  "CGM Patient Analytics": {
    src: "/images/cgm-patient-avatar.png",
    alt: "CGM Patient Analytics preview",
  },
  "Logistic Regression & Tree-Based ML": {
    src: "/images/logistic-regression-avatar.png",
    alt: "Logistic & Tree-Based ML preview",
  },
  "Real Estate Conditions Comparison (R)": {
    src: "/images/real-estate-avatar.png",
    alt: "Real Estate GLM (R) preview",
  },
  "Python 101": {
    src: "/images/python-101-avatar.png",
    alt: "Python 101 preview",
  },
  "MyCaddy — Physics Shot Calculator": {
    src: "/images/mycaddy-avatar.png",
    alt: "MyCaddy app preview",
  },
  "PortfolioBasics (This Site)": {
    src: "/images/portfolio-basics-avatar.png",
    alt: "Portfolio website preview",
  },
};

const KEYWORD_BY_TITLE: Record<string, string> = {
  "CGM Patient Analytics": "predictive-analysis",
  "Logistic Regression & Tree-Based ML": "machine-learning",
  "Real Estate Conditions Comparison (R)": "statistics",
  "Python 101": "education",
  "MyCaddy — Physics Shot Calculator": "data-pipeline",
  "PortfolioBasics (This Site)": "frontend",
};

// Predictable heights via aspect-ratio wrappers (prevents overlaps)
const ASPECT: Record<string, string> = {
  "CGM Patient Analytics": "3 / 4",
  "MyCaddy — Physics Shot Calculator": "3 / 4",
  "PortfolioBasics (This Site)": "3 / 4",
  "Real Estate Conditions Comparison (R)": "3 / 4",
  "Logistic Regression & Tree-Based ML": "16 / 9",
  "Python 101": "2 / 3",
};

/** Collage layout (your original positions) */
const LAYOUT = {
  md: {
    containerHeight: 1950,
    items: {
      "CGM Patient Analytics": { left: "3%", top: 0, width: "28%" },
      "MyCaddy — Physics Shot Calculator": { left: "36%", top: 110, width: "26%" },
      "PortfolioBasics (This Site)": { left: "66%", top: 200, width: "31%" },
      "Real Estate Conditions Comparison (R)": { left: "3%", top: 480, width: "28%" },
      "Logistic Regression & Tree-Based ML": { left: "36%", top: 880, width: "56%" },
      "Python 101": { left: "3%", top: 1080, width: "28%" },
    } as Record<string, { left: string; top: number; width: string }>,
    note: { left: "55%", top: 1380, width: "34%" },
  },
  lg: {
    containerHeight: 1750,
    items: {
      "CGM Patient Analytics": { left: "5%", top: 0, width: "24%" },
      "MyCaddy — Physics Shot Calculator": { left: "32%", top: 80, width: "23%" },
      "PortfolioBasics (This Site)": { left: "59%", top: 180, width: "29%" },
      "Real Estate Conditions Comparison (R)": { left: "5%", top: 530, width: "24%" },
      "Logistic Regression & Tree-Based ML": { left: "32%", top: 820, width: "54%" },
      "Python 101": { left: "5%", top: 1080, width: "24%" },
    } as Record<string, { left: string; top: number; width: string }>,
    note: { left: "54%", top: 1320, width: "34%" },
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

function keywordFor(title: string, tech?: string[]) {
  if (KEYWORD_BY_TITLE[title]) return KEYWORD_BY_TITLE[title];
  if (tech?.some((t) => /scikit-learn|xgboost|lightgbm/i.test(t))) return "machine-learning";
  if (tech?.some((t) => /\bR\b/i.test(t))) return "statistics";
  if (tech?.some((t) => /sql|sqlite|postgres/i.test(t))) return "data-pipeline";
  return "project";
}

function ProjectTile({
  p,
  left,
  top,
  width,
}: {
  p: Project;
  left: string;
  top: number;
  width: string;
}) {
  const img = IMAGE_BY_TITLE[p.title] ?? {
    src: "/images/portfolio-basics-avatar.png",
    alt: `${p.title} preview`,
  };
  const slug = slugify(p.title);
  const aspect = ASPECT[p.title] ?? "3 / 4";

  return (
    <article className="absolute z-10" style={{ left, top, width }} aria-label={p.title}>
      <TransitionLink
        href={`/projects/${slug}?via=projects`}
        className="block group"
        onClick={() =>
          typeof window !== "undefined" &&
          window.sessionStorage.setItem("cameFromProjects", "1")
        }
      >
        <div style={{ aspectRatio: aspect }} className="w-full overflow-hidden">
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-contain select-none transition-transform duration-300 ease-out group-hover:scale-[1.03] will-change-transform"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "/images/portfolio-basics-avatar.png";
            }}
          />
        </div>
      </TransitionLink>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-base md:text-lg font-medium tracking-tight">
          <TransitionLink
            href={`/projects/${slug}?via=projects`}
            className="hover:underline"
            onClick={() =>
              typeof window !== "undefined" &&
              window.sessionStorage.setItem("cameFromProjects", "1")
            }
          >
            {p.title}
          </TransitionLink>
        </h3>
        <span className="text-[11px] md:text-xs uppercase tracking-wide text-white/60">
          {keywordFor(p.title, p.tech)}
        </span>
      </div>

      {Array.isArray(p.tech) && p.tech.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {p.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="text-[10px] md:text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-white/70"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

/** Blurb + reference-style note (md+ only). */
function BlurbAndNote({
  left,
  top,
  width,
}: {
  left: string;
  top: number;
  width: string;
}) {
  return (
    <div
      className="absolute hidden md:block pointer-events-none z-0"
      style={{ left, top, width }}
    >
      <p className="text-[15px] leading-tight text-white/85 mb-4">
        I carry projects from messy data to maintainable tools—analyses, models, and apps that are
        rigorous, documented, and usable.
      </p>

      <div className="grid grid-cols-[8.5rem,1fr] gap-x-6">
        <div className="text-[12px] leading-tight text-white/60 font-medium">
          <div>Showcase</div>
          <div>Highlights</div>
        </div>

        <div className="flex flex-col gap-2 text-[14px] leading-snug text-white/85">
          <div>
            <span className="font-semibold">96.2% accuracy (AUC 93.8%)</span> on employee-retention models
          </div>
          <div>
            <span className="font-semibold">$317k patient responsibility</span> surfaced; CSV → Python → Excel export
          </div>
          <div>
            <span className="font-semibold">2.3k-home pricing model (R)</span> — 60+ features, RMSE-driven selection
          </div>
          <div>
            <span className="font-semibold">Physics-based golf yardage</span> calculator (wind, temp, lie)
          </div>
          <div>
            <span className="font-semibold">Next.js portfolio</span> with README-driven project pages
          </div>
        </div>
      </div>
    </div>
  );
}

/** PACE storyboard (centered vertically; behind collage and always visible) */
function PACEBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
        style={{ height: "70vh", minHeight: 520, maxHeight: 820 }}
      >
        <div className="relative h-full w-full">
          <div className="absolute left-6 top-2 bottom-2 w-px bg-white/10" />
          <NodeWithBranches
            top="0%"
            label="PLAN"
            sub="Scope for outcomes"
            branches={["Storyboard", "Framework", "Deadline"]}
          />
          <NodeWithBranches
            top="28%"
            label="ANALYZE"
            sub="Turn data into direction"
            branches={["Data audit", "Hypotheses", "Methods"]}
          />
          <NodeWithBranches
            top="58%"
            label="CONSTRUCT"
            sub="Build, iterate, instrument"
            branches={["Prototype", "Feedback", "Instrumentation"]}
          />
          <NodeWithBranches
            top="88%"
            label="EXECUTE"
            sub="Ship, train, measure"
            branches={["Deploy", "Enablement", "Impact"]}
          />
        </div>
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
            <div
              key={b}
              className="rounded-md border border-white/15 px-3 py-1 text-[11px] md:text-xs text-white/70"
            >
              {b}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Header block */
function ProjectsHeader() {
  return (
    <div className="mb-8 md:mb-10">
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
  );
}

/** LEFT RAIL — unchanged visuals; height comes from PACE tree so lengths match */
function LeftRail({ height }: { height?: number | null }) {
  const [paused, setPaused] = React.useState(false);
  const TOP_FADE = 250;
  const BOTTOM_FADE = 96;
  const SPEED = 22;

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
    <div className="hidden md:block h-full">
      <div className="sticky top-28">
        <div
          className="relative w-16 overflow-hidden"
          style={{
            height: height ? `${height}px` : "100%",
            WebkitMaskImage: `linear-gradient(to bottom,
              transparent 0px,
              black ${TOP_FADE}px,
              black calc(100% - ${BOTTOM_FADE}px),
              transparent 100%)`,
            maskImage: `linear-gradient(to bottom,
              transparent 0px,
              black ${TOP_FADE}px,
              black calc(100% - ${BOTTOM_FADE}px),
              transparent 100%)`,
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
      </div>
    </div>
  );
}

function RailColumn({ rows, rowH }: { rows: number; rowH: number }) {
  const lines = new Array(rows).fill("Scroll to Explore");
  return (
    <div
      className="box-border flex flex-col items-center"
      style={{ paddingTop: rowH, paddingBottom: rowH }}
    >
      {lines.map((txt, i) => (
        <div
          key={`${txt}-${i}`}
          className="flex items-center justify-center overflow-hidden"
          style={{ height: rowH, width: "100%" }}
        >
          <span
            className={`${plusJakarta.className} inline-block rotate-90 origin-center whitespace-nowrap text-[11px] tracking-[0.18em] text-white/40 select-none`}
          >
            {txt}
          </span>
        </div>
      ))}
    </div>
  );
}

/* -------------------- SCROLL-LOCKED COLLAGE (right column only) -------------------- */
/**
 * Change: add a dynamic lead-in BEFORE the sticky viewport so the lock engages
 * only after the PACE tree would be fully visible and centered.
 */
function CollageScene({
  vh,
  treeHeight,
  containerHeight,
  items,
  note,
  projects,
  mode,
}: {
  vh: number;
  treeHeight: number;
  containerHeight: number;
  items: Record<string, { left: string; top: number; width: string }>;
  note: { left: string; top: number; width: string };
  projects: ReadonlyArray<Project>;
  mode: "md" | "lg";
}) {
  // Distance to scroll before locking so the tree would be centered in view
  const LEAD_IN = Math.max(0, Math.round((vh - treeHeight) / 2));

  // Cards appear from the bottom after lock begins
  const START_FROM_BOTTOM = Math.round(vh * 0.9);
  const TRAVEL_CORE = Math.max(0, containerHeight - vh);
  const EXIT_TAIL = 140;

  // Lock range = true motion path
  const TOTAL_PATH = START_FROM_BOTTOM + TRAVEL_CORE + EXIT_TAIL;

  // Sentinel spans: lead-in (free scroll) + locked motion
  const SENTINEL_HEIGHT = Math.max(LEAD_IN + TOTAL_PATH, vh + 1);

  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sentinelRef,
    offset: ["start start", "end start"],
  });

  // Keep collage still during lead-in, then animate across the locked span
  const startFrac = LEAD_IN / SENTINEL_HEIGHT;
  const y = useTransform(scrollYProgress, [0, startFrac, 1], [
    START_FROM_BOTTOM,
    START_FROM_BOTTOM,
    -(TRAVEL_CORE + EXIT_TAIL),
  ]);

  // Edge fades for cards only (tree stays fully visible)
  const TOP_FADE = 180;
  const BOTTOM_FADE = 110;

  return (
    <>
      {/* Scroll driver (controls the timing and lock) */}
      <div ref={sentinelRef} style={{ height: SENTINEL_HEIGHT }} className="relative">
        {/* free-scroll lead-in so the tree would be fully visible BEFORE lock */}
        {LEAD_IN > 0 && <div style={{ height: LEAD_IN }} />}

        {/* Pinned viewport (locks while sticky is in view) */}
        <div className="sticky top-0 h-screen">
          {/* Tree behind, unmasked (always visible) */}
          <PACEBackground />

          {/* Collage in front, masked at edges only */}
          <div className="absolute inset-0 z-10 overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                WebkitMaskImage: `linear-gradient(to bottom,
                  transparent 0px,
                  black ${BOTTOM_FADE}px,
                  black calc(100% - ${TOP_FADE}px),
                  transparent 100%)`,
                maskImage: `linear-gradient(to bottom,
                  transparent 0px,
                  black ${BOTTOM_FADE}px,
                  black calc(100% - ${TOP_FADE}px),
                  transparent 100%)`,
              }}
            />
            <motion.div
              style={{ y, height: containerHeight, position: "relative" }}
              className="will-change-transform"
            >
              {TILE_ORDER.map((title) => {
                const p = projects.find((x) => x.title === title);
                if (!p) return null;
                const pos = items[title];
                return (
                  <ProjectTile
                    key={`${mode}-${title}`}
                    p={p}
                    left={pos.left}
                    top={pos.top}
                    width={pos.width}
                  />
                );
              })}
              <BlurbAndNote left={note.left} top={note.top} width={note.width} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tiny buffer so the next section sits closer (no long tail) */}
      <div style={{ height: 12 }} />
    </>
  );
}

export default function ProjectsHUD() {
  const projects = ((profile as any)?.projects ?? []) as ReadonlyArray<Project>;

  // Viewport height for lock math + tree sizing
  const [vh, setVh] = React.useState<number>(
    typeof window === "undefined" ? 800 : window.innerHeight
  );
  React.useEffect(() => {
    const onResize = () => setVh(window.innerHeight || vh);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [vh]);

  // PACE tree height (must match the rail length)
  const treeHeight = Math.max(520, Math.min(820, Math.round(vh * 0.7)));

  // Mobile: simple stack (unchanged)
  const mobile = (
    <div className="md:hidden space-y-10">
      {TILE_ORDER.map((title) => {
        const p = projects.find((x) => x.title === title);
        if (!p) return null;
        const img = IMAGE_BY_TITLE[p.title] ?? {
          src: "/images/portfolio-basics-avatar.png",
          alt: `${p.title} preview`,
        };
        const slug = slugify(p.title);
        const aspect = ASPECT[p.title] ?? "3 / 4";
        return (
          <article key={title}>
            <TransitionLink
              href={`/projects/${slug}?via=projects`}
              className="block group"
              onClick={() =>
                typeof window !== "undefined" &&
                window.sessionStorage.setItem("cameFromProjects", "1")
              }
            >
              <div style={{ aspectRatio: aspect }} className="w-full overflow-hidden">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03] will-change-transform"
                />
              </div>
            </TransitionLink>
            <div className="mt-3 flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-medium tracking-tight">
                <TransitionLink
                  href={`/projects/${slug}?via=projects`}
                  className="hover:underline"
                >
                  {p.title}
                </TransitionLink>
              </h3>
              <span className="text-xs uppercase tracking-wide text-white/60">
                {KEYWORD_BY_TITLE[p.title] ?? "project"}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );

  const md = LAYOUT.md;
  const lg = LAYOUT.lg;

  return (
    <section
      id="projects"
      aria-label="Projects"
      className="relative w-full pt-20 md:pt-28 pb-0 scroll-mt-24 md:scroll-mt-28 bg-[#0d131d]"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <ProjectsHeader />

        {/* Two-column layout on md+: left rail + right content; mobile shows content full-width */}
        <div className="md:grid md:grid-cols-[64px,1fr] md:gap-6">
          {/* Left vertical scroller — height equals the PACE tree height */}
          <LeftRail height={treeHeight} />

          {/* Right column */}
          <div>
            {/* Mobile stacked */}
            {mobile}

            {/* md: locked collage scene */}
            <div className="relative hidden md:block lg:hidden">
              <CollageScene
                vh={vh}
                treeHeight={treeHeight}
                containerHeight={md.containerHeight}
                items={md.items}
                note={md.note}
                projects={projects}
                mode="md"
              />
            </div>

            {/* lg: locked collage scene */}
            <div className="relative hidden lg:block">
              <CollageScene
                vh={vh}
                treeHeight={treeHeight}
                containerHeight={lg.containerHeight}
                items={lg.items}
                note={lg.note}
                projects={projects}
                mode="lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
