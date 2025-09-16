"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionPanel from "@/components/ui/SectionPanel";
import { profile } from "@/content/profile";

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
  "Real Estate GLM (R)": {
    src: "/images/real-estate-avatar.png",
    alt: "Real Estate GLM preview",
  },
  "Python 101": {
    src: "/images/python-101-avatar.png",
    alt: "Python 101 preview",
  },
  "MyCaddy": {
    src: "/images/mycaddy-avatar.png",
    alt: "MyCaddy app preview",
  },
  "Portfolio (This Site)": {
    src: "/images/portfolio-basics-avatar.png",
    alt: "Portfolio website preview",
  },
};

const KEYWORD_BY_TITLE: Record<string, string> = {
  "CGM Patient Analytics": "predictive-analysis",
  "Logistic Regression & Tree-Based ML": "machine-learning",
  "Real Estate GLM (R)": "regression-analysis",
  "Python 101": "education",
  "MyCaddy": "tooling",
  "Portfolio (This Site)": "frontend",
};

export default function ProjectsHUD() {
  const projects = ((profile as any)?.projects ?? []) as ReadonlyArray<Project>;

  return (
    <section
      id="projects"
      aria-label="Projects"
      className="relative min-h-[100svh] md:min-h-screen py-24 md:py-32 scroll-mt-24 md:scroll-mt-28 md:snap-start"
    >
      <SectionPanel title="Projects">
        {/* Moved subtitle INSIDE since SectionPanel has no `subtitle` prop */}
        <p className="mb-8 text-sm md:text-base text-white/70">
          A collection of recent work—data, models, and apps.
        </p>

        {/* Borderless, responsive tile grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((p, idx) => {
            const img = IMAGE_BY_TITLE[p.title] ?? {
              src: "/images/portfolio-basics-avatar.png",
              alt: `${p.title} preview`,
            };
            const keyword =
              KEYWORD_BY_TITLE[p.title] ??
              (p.tech?.includes("scikit-learn")
                ? "machine-learning"
                : p.tech?.includes("R")
                ? "statistics"
                : p.tech?.includes("SQLite") || p.tech?.includes("SQL")
                ? "data-pipeline"
                : "project");

            const primaryHref = p.links?.[0]?.href;

            return (
              <article key={`${p.title}-${idx}`} className="group">
                {/* Image tile (borderless). Slight zoom on hover */}
                <motion.a
                  href={primaryHref ?? "#"}
                  target={primaryHref ? "_blank" : undefined}
                  rel={primaryHref ? "noreferrer" : undefined}
                  className="block relative overflow-hidden rounded-2xl bg-black/40"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-105 select-none"
                      priority={idx < 2}
                    />
                  </div>
                </motion.a>

                {/* Subheading row: Title (left), Footnote keyword (right) */}
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <h3 className="text-base md:text-lg font-medium tracking-tight">
                    {p.title}
                  </h3>
                  <span
                    className="text-[11px] md:text-xs uppercase tracking-wide text-cyan-300/90"
                    title={keyword}
                  >
                    {keyword}
                  </span>
                </div>

                {/* Optional: tiny tech badges row (kept subtle) */}
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
      </SectionPanel>
    </section>
  );
}
