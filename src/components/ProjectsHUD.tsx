"use client";

import * as React from "react";
import Link from "next/link";
import { profile } from "@/content/profile";
import { slugify } from "@/lib/slug";
import { Oswald, Plus_Jakarta_Sans } from "next/font/google";

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

/** Collage layout (restored to your original, overlap-free positions) */
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
    // ⬅️ ensure tiles render above the note layer
    <article className="absolute z-10" style={{ left, top, width }} aria-label={p.title}>
      <Link
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
      </Link>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-base md:text-lg font-medium tracking-tight">
          <Link
            href={`/projects/${slug}?via=projects`}
            className="hover:underline"
            onClick={() =>
              typeof window !== "undefined" &&
              window.sessionStorage.setItem("cameFromProjects", "1")
            }
          >
            {p.title}
          </Link>
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
    // ⬅️ note sits beneath tiles and ignores pointer events
    <div
      className="absolute hidden md:block pointer-events-none z-0"
      style={{ left, top, width }}
    >
      {/* Blurb */}
      <p className="text-[15px] leading-tight text-white/85 mb-4">
        I carry projects from messy data to maintainable tools—analyses, models, and apps that are
        rigorous, documented, and usable.
      </p>

      {/* Two-column note (no bullets) */}
      <div className="grid grid-cols-[8.5rem,1fr] gap-x-6">
        {/* Label */}
        <div className="text-[12px] leading-tight text-white/60 font-medium">
          <div>Showcase</div>
          <div>Highlights</div>
        </div>

        {/* Lines */}
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

/** Header block: “Palmer” (small + underline) + big condensed “PROJECTS” + subheader */
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

/** LEFT RAIL — single moving column (no duplicate segments), fixed row height, RAF loop, smooth fade */
function LeftRail({ height }: { height?: number | null }) {
  const [paused, setPaused] = React.useState(false);

  const FADE = 96;         // fade so letters dissolve before edges
  const ROW_H = 40;        // fixed row height -> no intra-line collision
  const SPEED = 12;        // px/sec (calm)

  // Rows: fill ~1.6x the rail height so the fade always has content.
  const [rows, setRows] = React.useState(120);
  React.useEffect(() => {
    if (!height) return;
    const target = Math.min(600, Math.max(60, Math.ceil((height / ROW_H) * 1.6)));
    setRows(target);
  }, [height]);

  // Refs for animation
  const innerRef = React.useRef<HTMLDivElement | null>(null);
  const yRef = React.useRef(0);
  const lastTsRef = React.useRef<number | null>(null);
  const segHRef = React.useRef(0);

  // Measure total column height
  React.useEffect(() => {
    if (!innerRef.current) return;
    const measure = () => {
      const h = Math.ceil(innerRef.current!.getBoundingClientRect().height);
      segHRef.current = h;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [rows]);

  // RAF loop (single column). We move upward; when we've scrolled >= 1 row, wrap by +row*floor(n).
  React.useEffect(() => {
    let raf = 0;
    const tick = (ts: number) => {
      const last = lastTsRef.current ?? ts;
      lastTsRef.current = ts;
      if (!paused && innerRef.current) {
        const dt = (ts - last) / 1000; // seconds
        let y = yRef.current - SPEED * dt; // move up
        // Wrap by whole rows so there is never sub-pixel overlap
        const wrap = Math.floor(-y / ROW_H);
        if (wrap > 0) y += wrap * ROW_H;
        yRef.current = y;
        innerRef.current.style.transform = `translateY(${y.toFixed(2)}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  return (
    <div className="hidden md:block h-full">
      <div className="sticky top-28">
        <div
          className="relative w-16 overflow-hidden"
          style={{
            height: height ? `${height}px` : "100%",
            WebkitMaskImage: `linear-gradient(to bottom, transparent 0px, black ${FADE}px, black calc(100% - ${FADE}px), transparent 100%)`,
            maskImage: `linear-gradient(to bottom, transparent 0px, black ${FADE}px, black calc(100% - ${FADE}px), transparent 100%)`,
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Top/Bottom gradient vignettes (fallback polish) */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0"
            style={{ height: FADE, backgroundImage: "linear-gradient(to bottom, #16202e, transparent)" }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0"
            style={{ height: FADE, backgroundImage: "linear-gradient(to top, #16202e, transparent)" }}
          />

          {/* Single moving column, absolutely positioned so it never affects layout */}
          <div className="absolute inset-0">
            <div ref={innerRef} className="will-change-transform">
              <RailColumn rows={rows} rowH={ROW_H} />
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
      style={{ paddingTop: rowH, paddingBottom: rowH, gap: 0 }}
    >
      {lines.map((txt, i) => (
        <div
          key={`${txt}-${i}`}
          className="flex items-center justify-center"
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

export default function ProjectsHUD() {
  const projects = ((profile as any)?.projects ?? []) as ReadonlyArray<Project>;

  // Measure the right column height so the left rail can span the full section height
  const rightColRef = React.useRef<HTMLDivElement>(null);
  const [railHeight, setRailHeight] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!rightColRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr && typeof cr.height === "number") setRailHeight(Math.ceil(cr.height));
    });
    ro.observe(rightColRef.current);
    return () => ro.disconnect();
  }, []);

  // Mobile: simple stack (note hidden on mobile)
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
            <Link
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
            </Link>
            <div className="mt-3 flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-medium tracking-tight">
                <Link
                  href={`/projects/${slug}?via=projects`}
                  className="hover:underline"
                  onClick={() =>
                    typeof window !== "undefined" &&
                    window.sessionStorage.setItem("cameFromProjects", "1")
                  }
                >
                  {p.title}
                </Link>
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
      className="relative w-full py-20 md:py-28 scroll-mt-24 md:scroll-mt-28 bg-[#16202e]"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* New distinct header */}
        <ProjectsHeader />

        {/* Two-column layout on md+: left rail + right content; mobile shows content full-width */}
        <div className="md:grid md:grid-cols-[64px,1fr] md:gap-6">
          {/* Left vertical scroller (hidden on mobile) */}
          <LeftRail height={railHeight} />

          {/* Right column: unchanged gallery & note */}
          <div ref={rightColRef}>
            {/* Mobile stacked */}
            {mobile}

            {/* md collage */}
            <div
              className="relative hidden md:block lg:hidden"
              style={{ height: md.containerHeight }}
            >
              {TILE_ORDER.map((title) => {
                const p = projects.find((x) => x.title === title);
                if (!p) return null;
                const pos = md.items[title];
                return (
                  <ProjectTile
                    key={`md-${title}`}
                    p={p}
                    left={pos.left}
                    top={pos.top}
                    width={pos.width}
                  />
                );
              })}
              <BlurbAndNote left={md.note.left} top={md.note.top} width={md.note.width} />
            </div>

            {/* lg collage */}
            <div
              className="relative hidden lg:block"
              style={{ height: lg.containerHeight }}
            >
              {TILE_ORDER.map((title) => {
                const p = projects.find((x) => x.title === title);
                if (!p) return null;
                const pos = lg.items[title];
                return (
                  <ProjectTile
                    key={`lg-${title}`}
                    p={p}
                    left={pos.left}
                    top={pos.top}
                    width={pos.width}
                  />
                );
              })}
              <BlurbAndNote left={lg.note.left} top={lg.note.top} width={lg.note.width} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
