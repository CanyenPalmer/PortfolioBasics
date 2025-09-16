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

// vertical offsets to avoid row alignment
const OFFSET_Y = [
  "md:mt-0",
  "md:mt-8",
  "md:mt-16",
  "md:mt-12",
  "md:mt-20",
  "md:mt-24",
];

// stronger left/right hugging with extra margin drift
const DRIFT_SIDE = [
  "md:ml-0 md:mr-auto",
  "md:ml-auto md:mr-0",
  "md:ml-4 md:mr-auto",
  "md:ml-auto md:mr-4",
  "md:ml-8 md:mr-auto",
  "md:ml-auto md:mr-8",
];

export default function ProjectsHUD() {
  const all = ((profile as any)?.projects ?? []) as ReadonlyArray<Project>;

  // Feature: Logistic Regression (slightly smaller)
  const featureIdx = all.findIndex((p) =>
    p.title.toLowerCase().includes("logistic regression")
  );
  const feature = featureIdx >= 0 ? all[featureIdx] : null;
  const rest =
    featureIdx >= 0
      ? [...all.slice(0, featureIdx), ...all.slice(featureIdx + 1)]
      : all;

  return (
    <section
      id="projects"
      aria-label="Projects"
      className="relative w-full py-20 md:py-28 scroll-mt-24 md:scroll-mt-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Minimal header */}
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-8">
          Projects
        </h2>

        {/* =============== FEATURE (internal link ONLY) =============== */}
        {feature && (
          <article className="mb-16 md:w-[88%] md:ml-0 md:mr-auto">
            <Link
              href={`/projects/${slugify(feature.title)}?via=projects`}
              className="block"
              onClick={() =>
                typeof window !== "undefined" &&
                window.sessionStorage.setItem("cameFromProjects", "1")
              }
            >
              <img
                src={
                  IMAGE_BY_TITLE[feature.title]?.src ??
                  "/images/portfolio-basics-avatar.png"
                }
                alt={
                  IMAGE_BY_TITLE[feature.title]?.alt ??
                  `${feature.title} preview`
                }
                className="w-full h-auto object-contain select-none"
                loading="eager"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/images/portfolio-basics-avatar.png";
                }}
              />
            </Link>
            <div className="mt-4 flex items-baseline justify-between gap-3">
              <h3 className="text-lg md:text-xl font-semibold tracking-tight">
                <Link
                  href={`/projects/${slugify(feature.title)}?via=projects`}
                  className="hover:underline"
                  onClick={() =>
                    typeof window !== "undefined" &&
                    window.sessionStorage.setItem("cameFromProjects", "1")
                  }
                >
                  {feature.title}
                </Link>
              </h3>
              <span className="text-[11px] md:text-xs uppercase tracking-wide text-white/60">
                {KEYWORD_BY_TITLE[feature.title] ?? "project"}
              </span>
            </div>
            {Array.isArray(feature.tech) && feature.tech.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {feature.tech.slice(0, 5).map((t) => (
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
        )}

        {/* ====================== COLLAGE (1–2 across; internal links ONLY) ====================== */}
        <div className="columns-1 md:columns-2 gap-16 [column-fill:_balance]">
          {rest.map((p, idx) => {
            const img = IMAGE_BY_TITLE[p.title] ?? {
              src: "/images/portfolio-basics-avatar.png",
              alt: `${p.title} preview`,
            };
            // NOTE: We keep p.links for metadata but we DO NOT use it for navigation here.
            const oy = OFFSET_Y[idx % OFFSET_Y.length];
            const side = DRIFT_SIDE[idx % DRIFT_SIDE.length];
            const slug = slugify(p.title);
            const keyword =
              KEYWORD_BY_TITLE[p.title] ??
              (p.tech?.some((t) => /scikit-learn|xgboost|lightgbm/i.test(t))
                ? "machine-learning"
                : p.tech?.some((t) => /\bR\b/i.test(t))
                ? "statistics"
                : p.tech?.some((t) => /sql|sqlite|postgres/i.test(t))
                ? "data-pipeline"
                : "project");

            return (
              <article
                key={`${p.title}-${idx}`}
                className={[
                  "mb-16 inline-block w-[86%] break-inside-avoid",
                  oy,
                  side,
                ].join(" ")}
              >
                {/* Image → internal detail route */}
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
                    className="w-full h-auto object-contain select-none"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/images/portfolio-basics-avatar.png";
                    }}
                  />
                </Link>

                {/* Title (left) + keyword (right) */}
                <div className="mt-4 flex items-baseline justify-between gap-3">
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
                    {keyword}
                  </span>
                </div>

                {/* Subtle tech badges */}
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
          })}
        </div>
      </div>
    </section>
  );
}
