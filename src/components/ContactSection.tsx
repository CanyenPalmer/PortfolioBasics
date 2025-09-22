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
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Left */}
          <div className="space-y-6">
            <p className="max-w-sm text-2xl font-semibold leading-tight text-white/95">
              I'd love to get in touch through my links! Currently open to <span className="text-cyan-300">freelance</span> or{" "}
              <span className="text-cyan-300">full-time</span> work.
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
              <address className="not-italic text-white/70">Greenfield, IN • United States</address>
            </div>

            <p className="mt-8 max-w-md text-xs leading-relaxed text-white/55">
              Always open to collaborate on projects that blend data science, ML, and design.
            </p>
          </div>

          {/* Middle: Navigation */}
          <nav className="space-y-2">
  <p className="text-sm uppercase tracking-wide text-white/50">Navigation</p>
  <ul className="mt-2 space-y-3 md:space-y-4">
    <li>
      <Link href="#hero" className="inline-flex items-center gap-2 text-3xl md:text-[26px] lg:text-[30px] font-medium tracking-tight text-white/90 hover:text-white transition-colors">
        Home
      </Link>
    </li>
    <li>
      <Link href="#about" className="inline-flex items-center gap-2 text-3xl md:text-[26px] lg:text-[30px] font-medium tracking-tight text-white/90 hover:text-white transition-colors">
        About
      </Link>
    </li>
    <li>
      <Link href="#experience" className="inline-flex items-center gap-2 text-3xl md:text-[26px] lg:text-[30px] font-medium tracking-tight text-white/90 hover:text-white transition-colors">
        Experience
      </Link>
    </li>
    <li>
      <Link href="#projects" className="inline-flex items-center gap-2 text-3xl md:text-[26px] lg:text-[30px] font-medium tracking-tight text-white/90 hover:text-white transition-colors">
        Projects
      </Link>
    </li>
    <li>
      <Link href="#education" className="inline-flex items-center gap-2 text-3xl md:text-[26px] lg:text-[30px] font-medium tracking-tight text-white/90 hover:text-white transition-colors">
        Education
      </Link>
    </li>
    <li>
      <Link href="#testimonials" className="inline-flex items-center gap-2 text-3xl md:text-[26px] lg:text-[30px] font-medium tracking-tight text-white/90 hover:text-white transition-colors">
        Testimonials
      </Link>
    </li>
  </ul>
</nav>

          {/* Right */}
          <div className="space-y-2 md:justify-self-end">
            <p className="text-sm uppercase tracking-wide text-white/50">Connect</p>
            <ul className="mt-2 space-y-3 md:space-y-4">
              <li>
                <a
                  href="https://www.linkedin.com/in/canyen-palmer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-3xl md:text-[26px] lg:text-[30px] font-medium tracking-tight text-white/90 hover:text-white transition-colors"
                >
                  LinkedIn <span className="text-white/50">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/CanyenPalmer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-3xl md:text-[26px] lg:text-[30px] font-medium tracking-tight text-white/90 hover:text-white transition-colors"
                >
                  GitHub <span className="text-white/50">↗</span>
                </a>
              </li>
              <li className="pt-4 text-xs font-mono uppercase tracking-wider text-white/40">{now}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-7xl px-6">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-white/45">
          <span>©{new Date().getFullYear()} Canyen Palmer</span>
          <span>Thank You For Visiting</span>
          <span>Data • Design • Systems</span>
        </div>
      </div>

      {/* ECHO STRIPE — three aligned single titles; bottom dominates and cuts through */}
      <div className="echo-stack absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none">
        <div className="echo-mask pointer-events-none">
          <div className="echo-row echo-top">
            <span className="echo-word">CANYEN&nbsp;PALMER</span>
          </div>
          <div className="echo-row echo-mid">
            <span className="echo-word">CANYEN&nbsp;PALMER</span>
          </div>
          <div className="echo-row echo-bottom">
            <span className="echo-word">CANYEN&nbsp;PALMER</span>
          </div>
        </div>
      </div>

      {/* Footer meta */}
      <style jsx>{`
        /* Echo stack pinned to the bottom so last line touches the section edge */
        .echo-stack {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 230px;
        }

        /* Add layered card-like backgrounds behind each line to create hierarchy */
        .echo-row {
          position: absolute;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: flex-end;
        }
        .echo-row::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1.2em;             /* background band height roughly line height */
          z-index: -1;
        }
        /* background tones: base (same as section), darker, darkest */
        .echo-top::before    { background: #0b1016; }
        .echo-mid::before    { background: #0a0d13; }
        .echo-bottom::before { background: #070b10; }

        /* Existing echo-mask stays but we remove the extra top margin and pin inside the stack */
        .echo-mask {
          position: relative;
          height: 230px;
          mask-image: linear-gradient(to top, transparent 0%, black 22%, black 78%, transparent 100%);
        }

        /* Gentle vertical fade so the stack blends; no fog overlay. */
        .echo-mask {
          position: relative;
          height: 230px;
          mask-image: linear-gradient(
            to top,
            transparent 0%,
            black 22%,
            black 78%,
            transparent 100%
          );
        }

        /* Center all rows identically so letters align perfectly */
        .echo-row {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: max-content;
          line-height: 0.9;
          letter-spacing: 0.02em;
        }

        /* Exact opacities + stacking order (bottom on top) */
        .echo-top    { bottom: 128px; opacity: 1; z-index: 1; }
        .echo-mid    { bottom:  64px; opacity: 1; z-index: 2; }
        .echo-bottom { bottom:   0px; opacity: 1; z-index: 3; }

        /* One title per row, spanning edge-to-edge using viewport units.
           Tweak 10.2vw up/down by 0.2 if you want tighter/looser edges. */
        .echo-word {
          display: inline-block;
          text-transform: uppercase;
          font-weight: 900;
          color: #fff;
          padding: 0 16px;                 /* tiny safe gutter */
          font-size: clamp(72px, 10.2vw, 220px);
        }

        @media (max-width: 768px) {
          .echo-mask { height: 200px; }
          .echo-top    { bottom: 128px; opacity: 1; z-index: 1; }
          .echo-mid    { bottom:  64px; opacity: 1; z-index: 2; }
          .echo-word { font-size: clamp(48px, 12vw, 180px); }
        }
      `}</style>
    </section>
  );
}

