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
}: {
  logos?: Logo[];
  speedSeconds?: number;
}) {
  const items = React.useMemo(() => [...logos, ...logos], [logos]); // seamless loop

  const maskStyle: React.CSSProperties = {
    WebkitMaskImage:
      "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
    maskImage:
      "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
  };

  return (
    <section aria-label="Tooling and tech" className="relative w-full">
      <div className="relative holo-frame rounded-2xl p-[1px]">
        <div className="relative rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
          <div className="relative" style={maskStyle}>
            <ul
              className="marquee flex items-center gap-8 px-6 py-4"
              style={
                {
                  // @ts-expect-error CSS custom property
                  "--marquee-duration": `${speedSeconds}s`,
                } as React.CSSProperties
              }
            >
              {items.map((logo, i) => (
                <li key={`${logo.src}-${i}`} className="shrink-0" title={logo.alt} aria-label={logo.alt}>
                  <div className="group relative grid place-items-center h-12 w-28 rounded-xl bg-white/5 border border-white/10">
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 holo-sheen" />
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={96}
                      height={32}
                      className="
                        h-6 w-auto
                        opacity-90
                        transition duration-300 group-hover:opacity-100
                        grayscale invert brightness-110 contrast-125
                      "
                      priority={i < 8}
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
