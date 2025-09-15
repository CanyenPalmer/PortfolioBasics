// src/components/ContactSection.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { profile } from "@/content/profile";

export default function ContactSection() {
  const email = (profile as any)?.contact?.email ?? "Canyen2019@gmail.com";

  // Optional clock
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

      {/* ECHO STRIPE — three aligned, single titles, bottom dominates */}
      <div className="relative mt-16 overflow-hidden">
        <div className="echo-mask pointer-events-none">
          {/* Top (50%) */}
          <div className="echo-row echo-top">
            <span className="echo-word">CANYEN&nbsp;PALMER</span>
          </div>
          {/* Middle (70%) */}
          <div className="echo-row echo-mid">
            <span className="echo-word">CANYEN&nbsp;PALMER</span>
          </div>
          {/* Bottom (100%) — sits on top to visually cut through above rows */}
          <div className="echo-row echo-bottom">
            <span className="echo-word">CANYEN&nbsp;PALMER</span>
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
        /* Tunables for perfect fit without edge clipping */
        :root {
          --echo-edge: 16px;        /* left/right safe gutter */
          --echo-factor: 11.2;      /* smaller = larger text; tweak 11.0–11.6 to taste */
        }
        @media (min-width: 1024px) {
          :root {
            --echo-edge: 20px;
            --echo-factor: 11.0;
          }
        }

        /* A gentle vertical fade only (no fog overlay). */
        .echo-mask {
          position: relative;
          height: 220px; /* increase to 240–260 if you want more stack height */
          mask-image: linear-gradient(
            to top,
            transparent 0%,
            black 20%,
            black 80%,
            transparent 100%
          );
        }

        /* Each row uses identical centering so letters align perfectly */
        .echo-row {
          position: absolute;
          left: 50%;
          transform: translateX(-50%); /* center alignment for all rows */
          width: max-content;
          line-height: 0.92;
          letter-spacing: 0.055em;
          z-index: 0; /* default; bottom row will override */
        }

        /* Bottom row on top to "cut" the stack like the reference */
        .echo-bottom { bottom: 0px;  opacity: 1;   z-index: 3; }
        .echo-mid    { bottom: 64px; opacity: 0.7; z-index: 2; }
        .echo-top    { bottom: 128px;opacity: 0.5; z-index: 1; }

        /* Single title sized to span edge-to-edge with safe gutters, no repeats */
        .echo-word {
          display: inline-block;
          text-transform: uppercase;
          font-weight: 900;
          color: #fff;
          padding-left: var(--echo-edge);
          padding-right: var(--echo-edge);
          /* The calc below fills the viewport width minus gutters.
             Adjust --echo-factor slightly if you want tighter or looser edges. */
          font-size: clamp(
            48px,
            calc((100vw - (var(--echo-edge) * 2)) / var(--echo-factor)),
            180px
          );
        }

        @media (max-width: 768px) {
          .echo-mask { height: 200px; }
          .echo-mid  { bottom: 56px; }
          .echo-top  { bottom: 112px; }
          :root { --echo-edge: 14px; --echo-factor: 11.6; }
        }
      `}</style>
    </section>
  );
}
