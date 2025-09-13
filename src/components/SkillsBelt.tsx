// src/components/SkillsBelt.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import styles from "./skills-belt.module.css";

type LogoSpec = {
  /** Path under /public (e.g., "/logos/python.svg") */
  src: string;
  alt: string;
  /** Optional destination; if present, tile is clickable */
  href?: string;
  /** Optional tooltip/title text */
  title?: string;
};

export type SkillsBeltProps = {
  /** Speed of one full loop in seconds */
  speedSeconds?: number;
  /** Pixel height of each logo tile (actual image rendered at this height) */
  logoHeight?: number;
  /** Horizontal gap (Tailwind class or raw CSS length) between tiles */
  gapClass?: string;
  /** Pause animation when user hovers the belt (default true) */
  pauseOnHover?: boolean;
  /** Custom logo set; if omitted we use a sensible default */
  logos?: ReadonlyArray<LogoSpec>;
  /** Optional aria-label override */
  ariaLabel?: string;
};

const defaultLogos: ReadonlyArray<LogoSpec> = [
  { src: "/logos/python.svg", alt: "Python", title: "Python" },
  { src: "/logos/r.svg", alt: "R", title: "R" },
  { src: "/logos/javascript.svg", alt: "JavaScript", title: "JavaScript" },
  { src: "/logos/pandas.svg", alt: "pandas", title: "pandas" },
  { src: "/logos/numpy.svg", alt: "NumPy", title: "NumPy" },
  { src: "/logos/scipy.svg", alt: "SciPy", title: "SciPy" },
  { src: "/logos/sqlite.svg", alt: "SQL / SQLite", title: "SQL / SQLite" },
  { src: "/logos/tableau.svg", alt: "Tableau", title: "Tableau" },
  { src: "/logos/jupyter.svg", alt: "Jupyter", title: "Jupyter" },
  { src: "/logos/excel.svg", alt: "Excel", title: "Excel" },
  { src: "/logos/tidyverse.svg", alt: "tidyverse", title: "tidyverse" },
  { src: "/logos/github.svg", alt: "GitHub", title: "GitHub" },
  { src: "/logos/githubpages.svg", alt: "GitHub Pages", title: "GitHub Pages" },
  { src: "/logos/googleslides.svg", alt: "Google Slides", title: "Google Slides" },
];

export default function SkillsBelt({
  speedSeconds = 26,
  logoHeight = 28,
  gapClass = "gap-6 md:gap-10",
  pauseOnHover = true,
  logos = defaultLogos,
  ariaLabel = "Skillset toolbelt",
}: SkillsBeltProps) {
  // Duplicate the list so the marquee loops seamlessly
  const loopLogos = React.useMemo(() => [...logos, ...logos], [logos]);

  return (
    <section
      aria-label={ariaLabel}
      className={[
        // Outer “HUD rail” frame to match your panels
        "rounded-xl border border-cyan-400/10 bg-black/20 p-3 md:p-4",
        "shadow-[0_0_0_1px_rgba(0,255,255,0.05)]",
        "relative",
      ].join(" ")}
    >
      <div
        className={[
          styles.belt,
          pauseOnHover ? styles.pauseOnHover : "",
          "overflow-hidden rounded-lg",
        ].join(" ")}
      >
        <div
          className={[styles.track, "flex items-center", gapClass].join(" ")}
          style={{ animationDuration: `${speedSeconds}s` }}
        >
          {loopLogos.map((logo, i) => {
            const content = (
              <span
                className={[
                  styles.tile,
                  "inline-flex items-center justify-center rounded-md",
                  "px-4 py-2 ring-1 ring-white/5",
                ].join(" ")}
                title={logo.title ?? logo.alt}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={Math.round(logoHeight * 1.4)}
                  height={logoHeight}
                  style={{ height: logoHeight, width: "auto" }}
                  priority={i < 6}
                />
              </span>
            );

            return (
              <div key={`${logo.src}-${i}`} className="shrink-0">
                {logo.href ? (
                  <a
                    href={logo.href}
                    target="_blank"
                    rel="noreferrer"
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 rounded-md"
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
