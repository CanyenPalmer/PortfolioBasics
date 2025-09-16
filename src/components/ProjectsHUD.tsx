"use client";

import * as React from "react";
import Link from "next/link";
import { profile } from "@/content/profile";
import { slugify } from "@/lib/slug";

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
  "CGM Patient Analytics": "3 / 4",                   // tall
  "MyCaddy — Physics Shot Calculator": "3 / 4",       // tall (bigger)
  "PortfolioBasics (This Site)": "3 / 4",             // tall (bigger)
  "Real Estate Conditions Comparison (R)": "3 / 4",   // tall
  "Logistic Regression & Tree-Based ML": "16 / 9",    // wide
  "Python 101": "2 / 3",                              // very tall
};

/**
 * Custom collage layout (no overlap). Tweaked per your notes:
 *  - Lower MyCaddy, Portfolio, and Logistic Regression a bit
 *  - Keep the added spacing between MyCaddy and Portfolio
 *  - Python remains closer to Real Estate (from previous step)
 */
const LAYOUT = {
  md: {
    containerHeight: 1750,
    items: {
      "CGM Patient Analytics": { left: "2%",  top: 0,   width: "28%" },

      // LOWERED: top 0 -> 60
      "MyCaddy — Physics Shot Calculator": { left: "36%", top: 60,  width: "26%" },

      // LOWERED: top 60 -> 140 (and still shifted right for gap)
      "PortfolioBasics (This Site)":       { left: "66%", top: 140, width: "31%" },

      "Real Estate Conditions Comparison (R)": { left: "2%",  top: 450, width: "28%" },

      // LOWERED: top 720 -> 800
      "Logistic Regression & Tree-Based ML":   { left: "36%", top: 800, width: "56%" },

      "Python 101": { left: "2%", top: 1040, width: "28%" },
    } as Record<string, { left: string; top: number; width: string }>,
  },
  lg: {
    containerHeight: 1600,
    items: {
      "CGM Patient Analytics": { left: "4%",  top: 0,   width: "24%" },

      // LOWERED: top 0 -> 50
      "MyCaddy — Physics Shot Calculator": { left: "32%", top: 50,  width: "23%" },

      // LOWERED: top 80 -> 140 (keeps nice gap to MyCaddy and closer to LR)
      "PortfolioBasics (This Site)":       { left: "59%", top: 140, width: "29%" },

      "Real Estate Conditions Comparison (R)": { left: "4%",  top: 500, width: "24%" },

      // LOWERED: top 700 -> 760
      "Logistic Regression & Tree-Based ML":   { left: "32%", top: 760, width: "54%" },

      "Python 101": { left: "4%", top: 1000, width: "24%" },
    } as Record<string, { left: string; top: number; width: string }>,
  },
};

// Visual order (helps focus order + matching to image map)
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
    <article className="absolute" style={{ left, top, width }} aria-label={p.title}>
      <Link
        href={`/projects/${slug}?via=projects`}
        className="block"
        onClick={() =>
          typeof window !== "undefined" &&
          window.sessionStorage.setItem("cameFromProjects", "1")
        }
      >
        {/* Aspect-ratio wrapper => deterministic heights, no overlaps */}
        <div style={{ aspectRatio: aspect }} className="w-full bg-transparent">
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-contain select-none"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/images/portfolio-basics-avatar.png";
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

export default function ProjectsHUD() {
  const projects = ((profile as any)?.projects ?? []) as ReadonlyArray<Project>;

  // Mobile: simple stack
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
              className="block"
              onClick={() =>
                typeof window !== "undefined" &&
                window.sessionStorage.setItem("cameFromProjects", "1")
              }
            >
              <div style={{ aspectRatio: aspect }} className="w-full">
                <img src={img.src} alt={img.alt} className="w-full h-full object-contain" />
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
      className="relative w-full py-20 md:py-28 scroll-mt-24 md:scroll-mt-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-8">
          Projects
        </h2>

        {/* Mobile stacked */}
        {mobile}

        {/* md+ collage */}
        <div className="relative hidden md:block lg:hidden" style={{ height: md.containerHeight }}>
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
        </div>

        {/* lg collage */}
        <div className="relative hidden lg:block" style={{ height: lg.containerHeight }}>
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
        </div>
      </div>
    </section>
  );
}
