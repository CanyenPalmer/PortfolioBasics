// src/components/ContactSection.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { profile } from "@/content/profile";

export default function ContactSection() {
  const email = (profile as any)?.contact?.email ?? "Canyen2019@gmail.com";

  const [now, setNow] = React.useState<string>(() => new Date().toLocaleString());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date().toLocaleString()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative bg-[#0b1016] text-white pt-24 pb-28 md:pt-28 md:pb-36 scroll-mt-24 md:scroll-mt-28 md:snap-start"
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        {/* 3-column layout */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Left */}
          <div className="space-y-6">
            <p className="max-w-sm text-2xl font-semibold leading-tight text-white/95">
              A portfolio contact that’s both <span className="text-cyan-300">solid</span> and{" "}
              <span className="text-cyan-300">fluid</span> at the same time.
            </p>

            <div className="space-y-1">
              <p className="text-sm uppercase tracking-wide text-white/50">Contact</p>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 text-base text-white/90 hover:text-white transition-colors"
              >
                <span className="translate-y-[1px]">↗</span>
                {email}
              </a>
              <address className="not-italic text-white/70">Pittsburgh, PA • United States</address>
            </div>

            <p className="mt-8 max-w-md text-xs leading-relaxed text-white/55">
              Always open to collaborate on projects that blend data science, ML, and design.
            </p>
          </div>

          {/* Middle: Navigation */}
          <nav className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-white/50">Navigation</p>
            <ul className="mt-2 space-y-1 font-extrabold leading-none">
              {[
                { href: "#home", label: "Home" },
                { href: "#projects", label: "Work" },
                { href: "#about", label: "About" },
                { href: "#experience", label: "Experience" },
                { href: "#education", label: "Education" },
                { href: "#contact", label: "Contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-4xl md:text-5xl text-white/90 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right */}
          <div className="space-y-2 md:justify-self-end">
            <p className="text-sm uppercase tracking-wide text-white/50">Connect</p>
            <ul className="mt-2 space-y-2">
              <li>
                <a
                  href="https://www.linkedin.com/in/canyen-palmer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-lg text-white/90 hover:text-white transition-colors"
                >
                  LinkedIn <span className="text-white/50">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/CanyenPalmer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-lg text-white/90 hover:text-white transition-colors"
                >
                  GitHub <span className="text-white/50">↗</span>
                </a>
              </li>
              <li className="pt-4 text-xs font-mono uppercase tracking-wider text-white/40">{now}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Echo footer — three stacked, tiled rows */}
      <div className="relative mt-16 overflow-hidden">
        <div className="echo-mask pointer-events-none">
          {/* Bottom row (100%) */}
          <div className="echo-row r0">
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={`r0-${i}`} className="echo-word">CANYEN&nbsp;PALMER</span>
            ))}
          </div>
          {/* Middle row (70%), slight horizontal offset for a staggered feel */}
          <div className="echo-row r1">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={`r1-${i}`} className="echo-word">CANYEN&nbsp;PALMER</span>
            ))}
          </div>
          {/* Top row (50%), stronger offset */}
          <div className="echo-row r2">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={`r2-${i}`} className="echo-word">CANYEN&nbsp;PALMER</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom meta row */}
      <div className="mx-auto mt-8 w-full max-w-7xl px-6">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-white/45">
          <span>©{new Date().getFullYear()} Canyen Palmer</span>
          <span>Legal Notice</span>
          <span>Data • Design • Systems</span>
        </div>
      </div>

      <style jsx>{`
        /* Soft vertical fade only (no fog overlay) */
        .echo-mask {
          position: relative;
          height: 220px;
          mask-image: linear-gradient(
            to top,
            transparent 0%,
            black 18%,
            black 82%,
            transparent 100%
          );
        }

        .echo-row {
          position: absolute;
          left: 0;
          right: 0;
          display: flex;
          gap: 32px;              /* space between repeats */
          white-space: nowrap;
          will-change: transform;
        }

        /* Stack positions + exact opacities */
        .r0 { bottom: 0px;   opacity: 1.0;  transform: translateX(0%); }
        .r1 { bottom: 64px;  opacity: 0.7;  transform: translateX(-8%); }
        .r2 { bottom: 128px; opacity: 0.5;  transform: translateX(-16%); }

        .echo-word {
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #fff;

          /* Size so each word chunk is BIG and tiles across the viewport.
             The 11.6 divider was tuned to "CANYEN PALMER" width on common screens.
             Tweak 11.6 → 11.4 (larger) or 11.8 (smaller) if you want tighter/looser. */
          font-size: clamp(54px, calc(100vw / 11.6), 180px);
          line-height: 0.9;
        }

        @media (max-width: 768px) {
          .echo-mask { height: 190px; }
          .r1 { bottom: 56px; }
          .r2 { bottom: 112px; }
          .echo-word { font-size: clamp(40px, calc(100vw / 10.8), 150px); }
        }
      `}</style>
    </section>
  );
}
