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

      {/* ===== FOOTER (raised closer to meta bar) ===== */}
      <div className="relative h-[600px] md:h-[660px] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-10">
          {/* Top (⅓ visible) */}
          <div className="echo-layer echo-top">
            <span className="echo-word echo-wide echo-cut-33" style={{ opacity: 0.5 }}>
              CANYEN PALMER
            </span>
          </div>
          {/* Middle (½ visible) */}
          <div className="echo-layer echo-mid">
            <span className="echo-word echo-wide echo-cut-50" style={{ opacity: 0.75 }}>
              CANYEN PALMER
            </span>
          </div>
          {/* Bottom (full) */}
          <div className="echo-layer echo-bot">
            <span className="echo-word echo-wide echo-cut-100" style={{ opacity: 1 }}>
              CANYEN PALMER
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .echo-word {
          white-space: nowrap;
          text-transform: uppercase;
          font-weight: 900;
          letter-spacing: -0.12em;
          line-height: 1;
          color: #ffffff;
          font-size: clamp(72px, 12.6vw, 280px);
          display: inline-block;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: geometricPrecision;
        }
        .echo-wide {
          width: 100vw;
          display: block;
          text-align: center;
          transform: scaleX(1.04);
          transform-origin: center;
        }
        .echo-layer {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .echo-bot { bottom: 0; }
        .echo-mid { bottom: 3em; }   /* raised from 1.5em → 3em */
        .echo-top { bottom: 5em; }   /* raised from 2.5em → 5em */

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
          .echo-word { font-size: clamp(48px, 13.5vw, 200px); letter-spacing: -0.10em; }
          .echo-wide { transform: scaleX(1.02); }
          .echo-mid { bottom: 2em; }
          .echo-top { bottom: 3.5em; }
        }
      `}</style>
    </section>
  );
}
