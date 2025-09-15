// src/components/ContactSection.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { profile } from "@/content/profile";

export default function ContactSection() {
  const email = (profile as any)?.contact?.email ?? "Canyen2019@gmail.com";

  // Optional tiny clock (remove if you don't want it)
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

      {/* ECHO STRIPE — three stacked tiled rows */}
      <div className="relative mt-16 overflow-hidden">
        <div className="echo-mask pointer-events-none">
          {/* Bottom row (100%) */}
          <div className="echo-row r0">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={`r0-${i}`} className="echo-word">CANYEN&nbsp;PALMER</span>
            ))}
          </div>
          {/* Middle row (70%) */}
          <div className="echo-row r1">
            {Array.from({ length: 11 }).map((_, i) => (
              <span key={`r1-${i}`} className="echo-word">CANYEN&nbsp;PALMER</span>
            ))}
          </div>
          {/* Top row (50%) */}
          <div className="echo-row r2">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={`r2-${i}`} className="echo-word">CANYEN&nbsp;PALMER</span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer meta */}
      <div className="mx-auto mt-8 w-full max-w-7xl px-6">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-white/45">
          <span>©{new Date().getFullYear()} Canyen Palmer</span>
          <span>Legal Notice</span>
          <span>Data • Design • Systems</span>
        </div>
      </div>

      <style jsx>{`
        /* Only a gentle vertical fade so the stack blends into the footer. */
        .echo-mask {
          position: relative;
          height: 200px; /* feel free to tweak to 220–240 for taller stripe */
          mask-image: linear-gradient(
            to top,
            transparent 0%,
            black 20%,
            black 80%,
            transparent 100%
          );
        }

        .echo-row {
          position: absolute;
          inset-inline: 0;
          display: flex;
          white-space: nowrap;
          gap: clamp(12px, 1.6vw, 28px); /* spacing between repeats */
        }

        /* Vertical positions and EXACT per-row opacities */
        .r0 { bottom: 0px;   opacity: 1.0;  transform: translateX(0%);    }
        .r1 { bottom: 58px;  opacity: 0.7;  transform: translateX(-8%);   }
        .r2 { bottom: 116px; opacity: 0.5;  transform: translateX(-16%);  }

        .echo-word {
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #fff;           /* clean, solid white (no gradients/shadows) */
          line-height: 0.95;
          /* Scales with viewport; tuned so the word tiles cleanly without clipping.
             Decrease 11.4 for larger letters, increase for smaller. */
          font-size: clamp(56px, calc(100vw / 11.4), 180px);
        }

        @media (max-width: 768px) {
          .echo-mask { height: 180px; }
          .r1 { bottom: 50px; }
          .r2 { bottom: 100px; }
          .echo-word { font-size: clamp(40px, calc(100vw / 10.6), 150px); }
        }
      `}</style>
    </section>
  );
}
