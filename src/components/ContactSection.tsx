// src/components/ContactSection.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { profile } from "@/content/profile";

export default function ContactSection() {
  const email = (profile as any)?.contact?.email ?? "Canyen2019@gmail.com";

  // Optional small clock (can remove)
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
          {/* Left: blurb + contact */}
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

          {/* Right: Connect */}
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

      {/* Echo footer — three stacked single lines */}
      <div className="relative mt-16 overflow-hidden">
        <div className="echo-mask pointer-events-none">
          {/* Bottom row (100%) */}
          <div className="echo-row r0">
            <span className="echo-word">CANYEN&nbsp;PALMER</span>
          </div>
          {/* Middle row (70%) */}
          <div className="echo-row r1">
            <span className="echo-word">CANYEN&nbsp;PALMER</span>
          </div>
          {/* Top row (50%) */}
          <div className="echo-row r2">
            <span className="echo-word">CANYEN&nbsp;PALMER</span>
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
        /* Keep only a gentle vertical fade; no white overlay "fog" */
        .echo-mask {
          position: relative;
          height: 220px;
          /* no background overlay */
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
          justify-content: center;   /* center single word */
          white-space: nowrap;
          line-height: 1;
        }

        /* Exact opacities requested */
        .r2 { bottom: 128px; opacity: 0.5; }  /* top */
        .r1 { bottom: 64px;  opacity: 0.7; }  /* middle */
        .r0 { bottom: 0px;   opacity: 1.0; }  /* bottom */

        /* One word per line; sized to span the width without clipping */
        .echo-word {
          font-weight: 900;
          letter-spacing: 0.055em;
          /* The calc below approximates “full width” for this phrase.
             It scales with viewport width and leaves a tiny safe margin. */
          font-size: clamp(44px, calc((100vw - 48px) / 12.0), 160px);
          /* Center and preserve edges */
          padding: 0 24px;           /* safe margin so ends don't hard-clip */
          color: #ffffff;            /* solid white; no gradient fills */
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .echo-mask { height: 190px; }
          .r2 { bottom: 108px; }
          .r1 { bottom: 54px; }
          .r0 { bottom: 0; }
          .echo-word { font-size: clamp(36px, calc((100vw - 32px) / 12.0), 120px); padding: 0 16px; }
        }
      `}</style>
    </section>
  );
}
