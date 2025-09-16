"use client";

import * as React from "react";
import { profile } from "@/content/profile";
import { motion } from "framer-motion";

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

// small, tasteful angle variety (straightens on hover)
const ROTATE_CLASSES = [
  "md:-rotate-[0.6deg]",
  "md:rotate-[0.6deg]",
  "md:-rotate-[1deg]",
  "md:rotate-[0.8deg]",
  "md:-rotate-[0.4deg]",
  "md:rotate-[0.4deg]",
];

// vertical offsets to break alignment (masonry already helps; this exaggerates it)
const OFFSET_CLASSES = [
  "md:mt-0",
  "md:mt-6",
  "md:mt-12",
  "md:-mt-4",
  "md:mt-10",
  "md:mt-16",
];

export default function ProjectsHUD() {
  const projects = ((profile as any)?.projects ?? []) as ReadonlyArray<Project>;

  return (
    <section
      id="projects"
      aria-label="Projects"
      className="relative w-full py-20 md:py-28 scroll-mt-24 md:scroll-mt-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Minimal header */}
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-8">
          Projects
        </h2>

        {/* TRUE collage: CSS columns (1–2 only) + break-inside-avoid */}
        <div className="columns-1 md:columns-2 gap-8 [column-fill:_balance]">
          {projects.map((p, idx) => {
            const img = IMAGE_BY_TITLE[p.title] ?? {
              src: "/images/portfolio-basics-avatar.png",
              alt: `${p.title} preview`,
            };
            const href = p.links?.[0]?.href;

            const keyword =
              KEYWORD_BY_TITLE[p.title] ??
              (p.tech?.some((t) => /scikit-learn|xgboost|lightgbm/i.test(t))
                ? "machine-learning"
                : p.tech?.some((t) => /\bR\b/i.test(t))
                ? "statistics"
                : p.tech?.some((t) => /sql|sqlite|postgres/i.test(t))
                ? "data-pipeline"
                : "project");

            const isFeature = p.title.toLowerCase().includes("logistic regression");
            const rotate = ROTATE_CLASSES[idx % ROTATE_CLASSES.length];
            const offset = OFFSET_CLASSES[idx % OFFSET_CLASSES.length];

            return (
              <article
                key={`${p.title}-${idx}`}
                className={[
                  "mb-8 inline-block w-full break-inside-avoid",
                  offset,
                ].join(" ")}
              >
                <motion.a
                  href={href ?? "#"}
                  target={href ? "_blank" : undefined}
                  rel={href ? "noreferrer" : undefined}
                  className={[
                    "block rounded-xl bg-[#111418] ring-1 ring-white/5 overflow-hidden",
                    rotate,
                    // a bit more padding on feature to visually enlarge & give breathing room
                    isFeature ? "p-3 md:p-4" : "p-2",
                  ].join(" ")}
                  initial={{ y: 0, rotate: 0 }}
                  whileHover={{ y: -4, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 240, damping: 20 }}
                >
                  {/* No cropping: natural size; feature gets a mild scale bump */}
                  <img
                    src={img.src}
                    alt={img.alt}
                    className={[
                      "w-full h-auto object-contain select-none",
                      isFeature ? "md:scale-110" : "",
                    ].join(" ")}
                    loading={idx < 2 ? "eager" : "lazy"}
                    decoding="async"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/images/portfolio-basics-avatar.png";
                    }}
                  />
                </motion.a>

                {/* Title (left) + keyword (right) */}
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <h3 className="text-base md:text-lg font-medium tracking-tight">
                    {p.title}
                  </h3>
                  <span className="text-[11px] md:text-xs uppercase tracking-wide text-white/60">
                    {keyword}
                  </span>
                </div>

                {/* Subtle tech badges */}
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
