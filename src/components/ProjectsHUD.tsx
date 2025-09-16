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

/**
 * Custom collage layout based on your sketch.
 * Tweak these numbers to nudge positions/sizes.
 * - width: percentage of collage width
 * - left: percentage from left
 * - top: pixels from the top
 * - containerHeight: ensures nothing is cut off
 */
const LAYOUT = {
  md: {
    containerHeight: 1500, // px
    items: {
      "CGM Patient Analytics": { left: "2%", top: 0, width: "28%" },
      "MyCaddy — Physics Shot Calculator": { left: "36%", top: 0, width: "22%" },
      "PortfolioBasics (This Site)": { left: "62%", top: 0, width: "30%" },

      "Real Estate Conditions Comparison (R)": { left: "2%", top: 360, width: "28%" },
      "Logistic Regression & Tree-Based ML": { left: "36%", top: 520, width: "56%" },

      "Python 101": { left: "2%", top: 980, width: "28%" },
    } as Record<string, { left: string; top: number; width: string }>,
  },
  lg: {
    containerHeight: 1400, // px
    items: {
      "CGM Patient Analytics": { left: "4%", top: 0, width: "24%" },
      "MyCaddy — Physics Shot Calculator": { left: "32%", top: 0, width: "18%" },
      "PortfolioBasics (This Site)": { left: "52%", top: 0, width: "28%" },

      "Real Estate Conditions Comparison (R)": { left: "4%", top: 360, width: "24%" },
      "Logistic Regression & Tree-Based ML": { left: "32%", top: 500, width: "54%" },

      "Python 101": { left: "4%", top: 950, width: "24%" },
    } as Record<string, { left: string; top: number; width: string }>,
  },
};

// The order we’ll render tiles (helps with alt text and focus order)
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

  return (
    <article
      className="absolute select-none"
      style={{ left, top, width }}
      aria-label={p.title}
    >
      <Link
        href={`/projects/${slug}?via=projects`}
        className="block"
        onClick={() =>
          typeof window !== "undefined" &&
          window.sessionStorage.setItem("cameFromProjects", "1")
        }
      >
        <img
          src={img.src}
          alt={img.alt}
          className="w-full h-auto object-contain"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/portfolio-basics-avatar.png";
          }}
        />
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

  // Mobile-first: simple stacked list (no special layout)
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
              <img src={img.src} alt={img.alt} className="w-full h-auto object-contain" />
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
                {keywordFor(p.title, p.tech)}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );

  // md+ collage
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
        </div>
      </div>
    </section>
  );
}
