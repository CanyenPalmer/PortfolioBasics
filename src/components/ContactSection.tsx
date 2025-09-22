"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ContactSection() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleString()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="contact" className="relative bg-[#0b1016] text-white pt-24 pb-0">
      {/* ===== CONTENT (unchanged) ===== */}
      <div className="mx-auto w-full max-w-7xl px-6 grid grid-cols-1 gap-16 lg:grid-cols-3 lg:gap-8">
        {/* Left */}
        <div className="space-y-4">
          <p className="text-xl font-light leading-relaxed">
            I’d love to get in touch through my links! Currently open to{" "}
            <span className="text-cyan-400 font-medium">freelance</span> or{" "}
            <span className="text-cyan-400 font-medium">full-time</span> work.
          </p>

          <div className="mt-6 space-y-1 text-sm text-white/80">
            <p className="uppercase text-xs tracking-widest text-white/50">Contact</p>
            <a href="mailto:Canyen2019@gmail.com" className="block hover:underline">
              Canyen2019@gmail.com
            </a>
            <p>Greenfield, IN • United States</p>
          </div>

          <p className="mt-4 max-w-sm text-xs text-white/50">
            Always open to collaborate on projects that blend data science, ML, and design.
          </p>
        </div>

        {/* Middle */}
        <div>
          <p className="text-xs uppercase tracking-widest text-white/50">Navigation</p>
          <ul className="mt-4 space-y-4">
            <li><Link href="#hero" className="block text-3xl font-semibold tracking-tight hover:text-cyan-400">Home</Link></li>
            <li><Link href="#about" className="block text-3xl font-semibold tracking-tight hover:text-cyan-400">About</Link></li>
            <li><Link href="#experience" className="block text-3xl font-semibold tracking-tight hover:text-cyan-400">Experience</Link></li>
            <li><Link href="#projects" className="block text-3xl font-semibold tracking-tight hover:text-cyan-400">Projects</Link></li>
            <li><Link href="#education" className="block text-3xl font-semibold tracking-tight hover:text-cyan-400">Education</Link></li>
            <li><Link href="#testimonials" className="block text-3xl font-semibold tracking-tight hover:text-cyan-400">Testimonials</Link></li>
          </ul>
        </div>

        {/* Right */}
        <div>
          <p className="text-xs uppercase tracking-widest text-white/50">Connect</p>
          <ul className="mt-4 space-y-3">
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="block text-xl font-medium hover:text-cyan-400">LinkedIn</a></li>
            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block text-xl font-medium hover:text-cyan-400">GitHub</a></li>
          </ul>
          <p className="mt-6 text-xs text-white/45">{time}</p>
        </div>
      </div>

      {/* ===== META ROW (unchanged) ===== */}
      <div className="relative z-10 mx-auto mt-16 mb-2 flex w-full max-w-7xl items-center justify-between px-6 text-[10px] uppercase tracking-widest text-white/45">
        <span>©2025 CANYEN PALMER</span>
        <span>THANK YOU FOR VISITING</span>
        <span>DATA • DESIGN • SYSTEMS</span>
      </div>

      {/* ===== FOOTER ECHO — 1/3 • 1/2 • FULL (NO BACKGROUNDS; TIGHT LETTERING + OPACITY) ===== */}
      <div className="relative h-[520px] md:h-[560px] overflow-hidden">
        {/* bottom-pinned stack with slight separation */}
        <div className="pointer-events-none absolute left-1/2 bottom-0 z-10 w-screen -translate-x-1/2 flex flex-col items-center justify-end gap-[0.30em] md:gap-[0.32em] pb-0">
          {/* Top row — show top 33% */}
          <div className="echo-row z-[30]">
            <span className="echo-word echo-cut-33" style={{ opacity: 0.5 }}>
              CANYEN PALMER
            </span>
          </div>

          {/* Middle row — show top 50% */}
          <div className="echo-row z-[20]">
            <span className="echo-word echo-cut-50" style={{ opacity: 0.75 }}>
              CANYEN PALMER
            </span>
          </div>

          {/* Bottom row — full */}
          <div className="echo-row z-[10]">
            <span className="echo-word echo-cut-100" style={{ opacity: 1 }}>
              CANYEN PALMER
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Big word — tightened letter spacing for denser look */
        .echo-word {
          white-space: nowrap;
          text-transform: uppercase;
          font-weight: 900;
          letter-spacing: -0.11em;                  /* tighter than before */
          line-height: 0.86;
          color: #ffffff;
          font-size: clamp(64px, 10.8vw, 240px);
          position: relative;
          display: inline-block;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: geometricPrecision;
        }

        /* Row container (no background bars now) */
        .echo-row {
          position: relative;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Masks: keep the TOP portion visible (pre-cut) */
        .echo-cut-33 {
          -webkit-mask-image: linear-gradient(to bottom, black 33%, transparent 33%);
          mask-image: linear-gradient(to bottom, black 33%, transparent 33%);
        }
        .echo-cut-50 {
          -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 50%);
          mask-image: linear-gradient(to bottom, black 50%, transparent 50%);
        }
        .echo-cut-100 {
          -webkit-mask-image: linear-gradient(to bottom, black 100%, transparent 100%);
          mask-image: linear-gradient(to bottom, black 100%, transparent 100%);
        }

        @media (max-width: 768px) {
          .echo-word {
            font-size: clamp(44px, 12.5vw, 180px);
            letter-spacing: -0.10em;               /* slightly looser on small screens */
            line-height: 0.88;
          }
        }
      `}</style>
    </section>
  );
}



