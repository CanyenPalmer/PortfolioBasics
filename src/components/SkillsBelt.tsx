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
  rowCount?: number;             // rows to render (1 or 2 typically)
  pauseOnHover?: boolean;        // pause scrolling on hover
  logos?: LogoSpec[];            // list of logos (will be duplicated)
  ariaLabel?: string;            // accessible label for the belt
};

const DEFAULT_LOGOS: LogoSpec[] = [
  { src: "/logos/python.svg", alt: "Python" },
  { src: "/logos/typescript.svg", alt: "TypeScript" },
  { src: "/logos/r-lang.svg", alt: "R" },
  { src: "/logos/sql.svg", alt: "SQL" },
  { src: "/logos/tableau.svg", alt: "Tableau" },
  { src: "/logos/nextjs.svg", alt: "Next.js" },
  { src: "/logos/react.svg", alt: "React" },
  { src: "/logos/tailwind.svg", alt: "Tailwind CSS" },
];

export default function SkillsBelt({
  speedSeconds = 28,
  logoHeight = 26,
  gapPx = 28,
  rowCount = 1,
  pauseOnHover = true,
  logos = DEFAULT_LOGOS,
  ariaLabel = "Skills toolbar",
}: SkillsBeltProps) {
  // Duplicate list to create a seamless loop
  const loop = React.useMemo(() => [...logos, ...logos], [logos]);

  // Build rows (either 1 or 2)
  const rows = Array.from({ length: Math.max(1, Math.min(2, rowCount)) }, (_, i) => i);

  return (
    <section
      aria-label={ariaLabel}
      className="relative w-full"
    >
      <div className="sb-belt group relative overflow-hidden select-none">
        {/* Edge fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0b1016] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0b1016] to-transparent" />

        <div className="grid gap-2" style={{ gridTemplateRows: `repeat(${rows.length}, minmax(0, 1fr))` }}>
          {rows.map((rowIdx) => (
            <div
              key={rowIdx}
              className={`sb-row relative`}
            >
              <ul
                className={`sb-track flex items-center`}
                style={{
                  animationDuration: `${speedSeconds}s`,
                  gap: `${gapPx}px`,
                }}
                aria-hidden={false}
              >
                {loop.map((logo, i) => {
                  const key = `${rowIdx}-${i}-${logo.src}`;
                  const Tile = (
                    <div
                      key={key}
                      className="sb-tile relative grid place-items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
                      style={{
                        height: `${logoHeight + 18}px`,
                        minWidth: `${logoHeight * 3}px`,
                      }}
                    >
                      {/* NOTE: The glare has been fully removed.
                         If you want a STATIC highlight later, see the small note below. */}
                      {logo.href ? (
                        <a
                          href={logo.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                          title={logo.title || logo.alt}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={logo.src}
                            alt={logo.alt}
                            height={logoHeight}
                            style={{ height: logoHeight, width: "auto" }}
                            draggable={false}
                          />
                          <span className="sr-only">{logo.alt}</span>
                        </a>
                      ) : (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={logo.src}
                            alt={logo.alt}
                            height={logoHeight}
                            style={{ height: logoHeight, width: "auto" }}
                            draggable={false}
                          />
                          <span className="sr-only">{logo.alt}</span>
                        </>
                      )}
                    </div>
                  );
                  return Tile;
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .sb-belt {
          --sb-scan-opacity: 0; /* scan disabled */
        }

        /* Track marquee (two copies of the list in one UL) */
        .sb-track {
          width: max-content;
          animation: sb-scroll linear infinite;
          will-change: transform;
        }

        /* Reverse direction on even rows for a subtle weave */
        .sb-row:nth-child(even) .sb-track {
          animation-direction: reverse;
        }

        /* Pause on hover (optional) */
        .sb-belt:hover .sb-track {
          animation-play-state: ${pauseOnHover ? "paused" : "running"};
        }

        /* Individual tiles — NO GLARE/EFFECT NOW */
        .sb-tile {
          position: relative;
          isolation: isolate;
          /* Remove any leftover pseudo-element shine */
        }
        .sb-tile::after {
          content: none !important; /* <-- kills the glare entirely */
        }

        /* Marquee scroll (duplicate length is 50%) */
        @keyframes sb-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .sb-track { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
