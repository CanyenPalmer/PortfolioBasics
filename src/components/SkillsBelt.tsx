"use client";

import Image from "next/image";
import * as React from "react";

type Logo = { src: string; alt: string };

const DEFAULT_LOGOS: Logo[] = [
  { src: "/logos/python.svg", alt: "Python" },
  { src: "/logos/r.svg", alt: "R" },
  { src: "/logos/javascript.svg", alt: "JavaScript" },
  { src: "/logos/pandas.svg", alt: "Pandas" },
  { src: "/logos/numpy.svg", alt: "NumPy" },
  { src: "/logos/scipy.svg", alt: "SciPy" },
  { src: "/logos/sqlite.svg", alt: "SQLite" },
  { src: "/logos/tableau.svg", alt: "Tableau" },
  { src: "/logos/excel.svg", alt: "Excel" },
  { src: "/logos/jupyter.svg", alt: "Jupyter" },
  { src: "/logos/latex.svg", alt: "LaTeX" },
  { src: "/logos/tidyverse.svg", alt: "Tidyverse" },
  { src: "/logos/github.svg", alt: "GitHub" },
  { src: "/logos/googleslides.svg", alt: "Google Slides" },
  { src: "/logos/githubpages.svg", alt: "GitHub Pages" },
];

export default function SkillsBelt({
  logos = DEFAULT_LOGOS,
  speedSeconds = 26,
  variant = "compact", // "compact" (default) or "default"
}: {
  logos?: Logo[];
  speedSeconds?: number;
  variant?: "compact" | "default";
}) {
  // duplicate for seamless loop
  const items = React.useMemo(() => [...logos, ...logos], [logos]);

  // sizes per variant
  const SZ = variant === "compact"
    ? { tile: "h-10 w-24", imgH: 20, gap: "gap-6", pad: "px-4 py-3" }
    : { tile: "h-12 w-28", imgH: 24, gap: "gap-8", pad: "px-6 py-4" };

  // gentle edge fade so entries/exits feel smooth
  const maskStyle: React.CSSProperties = {
    WebkitMaskImage:
      "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
    maskImage:
      "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
  };

  return (
    <section aria-label="Tooling and tech" className="relative w-full">
      <div className="relative holo-frame rounded-2xl p-[1px]">
        <div className="relative rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
          <div className="relative" style={maskStyle}>
            <ul
              className={`marquee flex items-center ${SZ.gap} ${SZ.pad}`}
              style={
                {
                  // @ts-expect-error CSS custom property for animation duration
                  "--marquee-duration": `${speedSeconds}s`,
                } as React.CSSProperties
              }
            >
              {items.map((logo, i) => (
                <li
                  key={`${logo.src}-${i}`}
                  className="shrink-0"
                  title={logo.alt}
                  aria-label={logo.alt}
                >
                  <div
                    className={`group relative grid place-items-center ${SZ.tile} rounded-xl bg-white/5 border border-white/10`}
                  >
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 holo-sheen" />
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={96}
                      height={SZ.imgH}
                      className="
                        h-auto w-auto
                        opacity-90
                        transition duration-300 group-hover:opacity-100
                        grayscale invert brightness-110 contrast-125
                        max-h-[1.5rem]
                      "
                      // no priority: allow lazy for perf
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="pointer-events-none absolute -inset-[1px] rounded-2xl holo-glow" />
        </div>
      </div>
    </section>
  );
}
