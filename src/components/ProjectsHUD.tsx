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

//
// 🔧 Map project titles → image files you’ve placed in /public/images/projects/*
// Update the paths below to match your actual filenames.
//
const IMAGE_BY_TITLE: Record<string, { src: string; alt: string }> = {
  "CGM Patient Analytics": {
    src: "/images/projects/cgm-patient.png",
    alt: "CGM Patient Analytics preview",
  },
  "Logistic Regression & Tree-Based ML": {
    src: "/images/projects/logistic-regression.png",
    alt: "Logistic & Tree-Based ML preview",
  },
  "Real Estate GLM (R)": {
    src: "/images/projects/real-estate-glm.png",
    alt: "Real Estate GLM preview",
  },
  "Python 101": {
    src: "/images/projects/python-101.png",
    alt: "Python 101 preview",
  },
  "MyCaddy": {
    src: "/images/projects/mycaddy.png",
    alt: "MyCaddy app preview",
  },
  "Portfolio (This Site)": {
    src: "/images/projects/portfolio-basics.png",
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
        <p className="mb-8 text-sm md:text-base text-white/70">
          A collection of recent work—data, models, and apps.
        </p>

        {/* Masonry: responsive columns like the reference */}
        <div className="columns-1 sm:columns-2 xl:columns-3 gap-6 [column-fill:_balance]">
          {projects.map((p, idx) => {
            const mapped = IMAGE_BY_TITLE[p.title];
            const img = mapped ?? {
              src: "/images/projects/portfolio-basics.png",
              alt: `${p.title} preview`,
            };
            const keyword =
              KEYWORD_BY_TITLE[p.title] ??
              (p.tech?.includes("scikit-learn")
                ? "machine-learning"
                : p.tech?.includes("R")
                ? "statistics"
                : p.tech?.some((t) => /sql|sqlite/i.test(t))
                ? "data-pipeline"
                : "project");

            const primaryHref = p.links?.[0]?.href;

            return (
              <article
                key={`${p.title}-${idx}`}
                className="
                  mb-6 inline-block w-full break-inside-avoid
                "
              >
                {/* Tile (no cropping): object-contain, natural height */}
                <motion.a
                  href={primaryHref ?? "#"}
                  target={primaryHref ? "_blank" : undefined}
                  rel={primaryHref ? "noreferrer" : undefined}
                  className="block overflow-hidden rounded-2xl bg-black/40 ring-1 ring-white/5"
                  initial={{ y: 0 }}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                >
                  <div className="relative w-full">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={1600}
                      height={1000}
                      sizes="(min-width:1280px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="w-full h-auto object-contain select-none"
                      priority={idx < 2}
                    />
                  </div>
                </motion.a>

                {/* Subheading row: Title (left) + keyword (right) */}
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

                {/* Optional subtle tech badges */}
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
