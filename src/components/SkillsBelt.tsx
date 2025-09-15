// src/components/SkillsBelt.tsx
"use client";

import * as React from "react";

type LogoSpec = {
  src: string;   // path under /public, e.g. "/logos/python.svg"
  alt: string;
  href?: string;
  title?: string;
};

export type SkillsBeltProps = {
  speedSeconds?: number;         // full loop time
  logoHeight?: number;           // px
  gapPx?: number;                // horizontal gap in px
  pauseOnHover?: boolean;
  logos?: ReadonlyArray<LogoSpec>;
  ariaLabel?: string;
};

const defaultLogos: ReadonlyArray<LogoSpec> = [
  { src: "/logos/python.svg", alt: "Python" },
  { src: "/logos/r.svg", alt: "R" },
  { src: "/logos/javascript.svg", alt: "JavaScript" },
  { src: "/logos/pandas.svg", alt: "pandas" },
  { src: "/logos/numpy.svg", alt: "NumPy" },
  { src: "/logos/scipy.svg", alt: "SciPy" },
  { src: "/logos/sqlite.svg", alt: "SQL / SQLite" },
  { src: "/logos/tableau.svg", alt: "Tableau" },
  { src: "/logos/jupyter.svg", alt: "Jupyter" },
  { src: "/logos/excel.svg", alt: "Excel" },
  { src: "/logos/tidyverse.svg", alt: "tidyverse" },
  { src: "/logos/github.svg", alt: "GitHub" },
  { src: "/logos/githubpages.svg", alt: "GitHub Pages" },
  { src: "/logos/googleslides.svg", alt: "Google Slides" },
];

export default function SkillsBelt({
  speedSeconds = 26,
  logoHeight = 28,
  gapPx = 28,
  pauseOnHover = true,
  logos = defaultLogos,
  ariaLabel = "Skillset toolbelt",
}: SkillsBeltProps) {
  // Duplicate for seamless loop
  const loop = React.useMemo(() => [...logos, ...logos], [logos]);

  return (
    <section
      aria-label={ariaLabel}
      className="relative rounded-xl border border-cyan-400/10 bg-black/20 p-3 md:p-4 shadow-[0_0_0_1px_rgba(0,255,255,0.05)]"
    >
      <div
        className={[
          "relative overflow-hidden rounded-lg",
          pauseOnHover ? "sb-pause" : "",
          // ensure visible even if images fail to load
          "min-h-[56px]",
        ].join(" ")}
        style={
          {
            ["--sb-speed" as any]: `${speedSeconds}s`,
            ["--sb-gap" as any]: `${gapPx}px`,
            ["--sb-height" as any]: `${logoHeight}px`,
          } as React.CSSProperties
        }
      >
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[60px] z-10 sb-fade-left" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[60px] z-10 sb-fade-right" />

        {/* track */}
        <div className="sb-track flex items-center">
          {loop.map((l, i) => {
            const content = (
              <span
                className="sb-tile inline-flex items-center justify-center rounded-md px-4 py-2 ring-1 ring-white/5"
                title={l.title ?? l.alt}
              >
                <img
                  src={l.src}
                  alt={l.alt}
                  height={logoHeight}
                  style={{ height: `var(--sb-height)`, width: "auto", display: "block" }}
                />
              </span>
            );
            return (
              <div key={`${l.src}-${i}`} className="shrink-0" style={{ marginRight: `var(--sb-gap)` }}>
                {l.href ? (
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
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

        {/* scanlines removed */}
        <div className="pointer-events-none absolute inset-0 z-[1] sb-scan" />
      </div>

      <style jsx>{`
        .sb-track {
          width: max-content;
          animation: sb-marquee var(--sb-speed) linear infinite;
        }
        .sb-pause:hover .sb-track {
          animation-play-state: paused;
        }

        .sb-tile {
          position: relative;
          background: rgba(255, 255, 255, 0.02);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06),
            0 0 18px rgba(0, 255, 255, 0.05);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }
        .sb-tile::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 0.375rem;
          pointer-events: none;
          /* static diagonal gloss */
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.18) 0%,
            rgba(255,255,255,0.06) 40%,
            rgba(255,255,255,0.02) 60%,
            transparent 85%
          );
          transform: none;
          animation: none;
        }
        .sb-tile:hover {
          transform: translateY(-1px) scale(1.02);
          box-shadow: inset 0 0 0 1px rgba(0, 255, 255, 0.15),
            0 0 22px rgba(0, 255, 255, 0.1);
        }

        /* fades */
        .sb-scan {
          display: none;
        }
        .sb-fade-left {
          background: linear-gradient(to right, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
        }
        .sb-fade-right {
          background: linear-gradient(to left, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
        }

        @keyframes sb-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .sb-track { animation: none !important; }
          .sb-tile::after { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
