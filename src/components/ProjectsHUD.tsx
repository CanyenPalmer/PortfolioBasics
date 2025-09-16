"use client";

import * as React from "react";
import { profile } from "@/content/profile";
import { motion } from "framer-motion";

type Project = {
  title: string;
  tech?: string[];
  links?: { label?: string; href: string }[];
};

// If you already have specific filenames, map them here.
// Otherwise we’ll auto-generate a slug filename and fall back cleanly.
const EXPLICIT_IMAGES: Record<string, string> = {
  "CGM Patient Analytics": "/images/projects/cgm-patient.png",
  "Logistic Regression & Tree-Based ML": "/images/projects/logistic-regression.png",
  "Real Estate GLM (R)": "/images/projects/real-estate-glm.png",
  "Python 101": "/images/projects/python-101.png",
  "MyCaddy": "/images/projects/mycaddy.png",
  "Portfolio (This Site)": "/images/projects/portfolio-basics.png",
};

const KEYWORD_BY_TITLE: Record<string, string> = {
  "CGM Patient Analytics": "predictive-analysis",
  "Logistic Regression & Tree-Based ML": "machine-learning",
  "Real Estate GLM (R)": "regression-analysis",
  "Python 101": "education",
  "MyCaddy": "tooling",
  "Portfolio (This Site)": "frontend",
};

function slugifyTitle(t: string) {
  return t
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * ProjectsHUD — minimal, masonry collection (no neon, no frames).
 * - Clean header: just "Projects"
 * - Masonry via CSS columns
 * - Images are NOT cropped (object-contain; natural height)
 * - Uses <img> with onError fallback to avoid Next/Image config issues
 */
export default function ProjectsHUD() {
  const projects = ((profile as any)?.projects ?? []) as ReadonlyArray<Project>;

  return (
    <section
      id="projects"
      aria-label="Projects"
      className="relative w-full py-20 md:py-28 scroll-mt-24 md:scroll-mt-28"
    >
      {/* Minimal header (no VSCode frame, no neon) */}
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-8">
          Projects
        </h2>

        {/* Masonry columns like your reference */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:_balance]">
          {projects.map((p, idx) => {
            // Determine image src:
            // 1) explicit mapping if provided
            // 2) else /images/projects/<slug>.png
            const slug = slugifyTitle(p.title);
            const src =
              EXPLICIT_IMAGES[p.title] ?? `/images/projects/${slug}.png`;

            const keyword =
              KEYWORD_BY_TITLE[p.title] ??
              (p.tech?.some((t) => /scikit-learn|xgboost|lightgbm/i.test(t))
                ? "machine-learning"
                : p.tech?.some((t) => /\bR\b/i.test(t))
                ? "statistics"
                : p.tech?.some((t) => /sql|sqlite|postgres/i.test(t))
                ? "data-pipeline"
                : "project");

            const href = p.links?.[0]?.href;

            return (
              <article
                key={`${p.title}-${idx}`}
                className="mb-6 inline-block w-full break-inside-avoid"
              >
                <motion.a
                  href={href ?? "#"}
                  target={href ? "_blank" : undefined}
                  rel={href ? "noreferrer" : undefined}
                  className="block overflow-hidden rounded-xl bg-[#111418] ring-1 ring-white/5"
                  initial={{ y: 0 }}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                >
                  {/* Image: no cropping, scales down if needed */}
                  <img
                    src={src}
                    alt={`${p.title} preview`}
                    className="w-full h-auto object-contain select-none"
                    onError={(e) => {
                      // fallback if file not found
                      (e.currentTarget as HTMLImageElement).src =
                        "/images/projects/fallback.png";
                    }}
                    loading={idx < 2 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </motion.a>

                {/* Title (left) + one-word footnote (right) */}
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <h3 className="text-base md:text-lg font-medium tracking-tight">
                    {p.title}
                  </h3>
                  <span
                    className="text-[11px] md:text-xs uppercase tracking-wide text-white/60"
                    title={keyword}
                  >
                    {keyword}
                  </span>
                </div>

                {/* (Optional) tiny tech badges; subtle only */}
                {Array.isArray(p.tech) && p.tech.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {p.tech.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] md:text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-white/70 ring-1 ring-white/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
