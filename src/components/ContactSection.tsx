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
      {/* ===== 3-COLUMN CONTENT (centered to match meta row) ===== */}
      <div className="mx-auto w-full max-w-7xl px-6 grid grid-cols-1 gap-16 lg:grid-cols-3 lg:gap-8">
        {/* Left: Contact */}
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

        {/* Middle: Navigation (fills its column) */}
        <div>
          <p className="text-xs uppercase tracking-widest text-white/50">Navigation</p>
          <ul className="mt-4 space-y-4">
            <li>
              <Link href="#hero" className="block text-3xl font-semibold tracking-tight hover:text-cyan-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="#about" className="block text-3xl font-semibold tracking-tight hover:text-cyan-400 transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="#experience" className="block text-3xl font-semibold tracking-tight hover:text-cyan-400 transition-colors">
                Experience
              </Link>
            </li>
            <li>
              <Link href="#projects" className="block text-3xl font-semibold tracking-tight hover:text-cyan-400 transition-colors">
                Projects
              </Link>
            </li>
            <li>
              <Link href="#education" className="block text-3xl font-semibold tracking-tight hover:text-cyan-400 transition-colors">
                Education
              </Link>
            </li>
            <li>
              <Link href="#testimonials" className="block text-3xl font-semibold tracking-tight hover:text-cyan-400 transition-colors">
                Testimonials
              </Link>
            </li>
          </ul>
        </div>

        {/* Right: Connect */}
        <div>
          <p className="text-xs uppercase tracking-widest text-white/50">Connect</p>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xl font-medium hover:text-cyan-400 transition-colors"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xl font-medium hover:text-cyan-400 transition-colors"
              >
                GitHub
              </a>
            </li>
          </ul>
          <p className="mt-6 text-xs text-white/45">{time}</p>
        </div>
      </div>

      {/* ===== META ROW (already centered) ===== */}
      <div className="relative z-10 mx-auto mt-16 mb-2 flex w-full max-w-7xl items-center justify-between px-6 text-[10px] uppercase tracking-widest text-white/45">
        <span>©2025 CANYEN PALMER</span>
        <span>THANK YOU FOR VISITING</span>
        <span>DATA • DESIGN • SYSTEMS</span>
      </div>

      {/* ===== ECHO STACK — three lines, full-bleed, layered backgrounds, masked cutoffs ===== */}
      <div className="relative h-[340px] overflow-hidden">
        {/* Background planes (full-width, overlapping like paper stacks) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[320px]">
          <div className="absolute inset-x-0 bottom-0 h-full bg-[#0b1016] z-[1]" />
          <div className="absolute inset-x-0 bottom-0 h-[75%] bg-[#0a0d13] z-[2]" />
          <div className="absolute inset-x-0 bottom-0 h-[50%] bg-[#070b10] z-[3]" />
        </div>

        {/* Text rows pinned to bottom; each masked to show 1/4, 1/2, full */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[320px]">
          {/* Top (show bottom quarter) */}
          <div className="absolute bottom-[200px] w-full flex justify-center">
            <span className="echo-word echo-clip-25">CANYEN PALMER</span>
          </div>
          {/* Middle (show bottom half) */}
          <div className="absolute bottom-[100px] w-full flex justify-center">
            <span className="echo-word echo-clip-50">CANYEN PALMER</span>
          </div>
          {/* Bottom (show full; touches bottom edge) */}
          <div className="absolute bottom-0 w-full flex justify-center">
            <span className="echo-word echo-clip-100">CANYEN PALMER</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* One phrase per row, spanning the viewport */
        .echo-word {
          white-space: nowrap;
          text-transform: uppercase;
          font-weight: 900;
          letter-spacing: -0.06em;
          line-height: 1;
          color: #ffffff;
          font-size: clamp(64px, 10.8vw, 240px); /* full-bleed width */
        }

        /* Masks: reveal only the lower fraction of each line (like the reference cutoffs) */
        .echo-clip-25 {
          -webkit-mask-image: linear-gradient(to top, black 25%, transparent 25%);
          mask-image: linear-gradient(to top, black 25%, transparent 25%);
        }
        .echo-clip-50 {
          -webkit-mask-image: linear-gradient(to top, black 50%, transparent 50%);
          mask-image: linear-gradient(to top, black 50%, transparent 50%);
        }
        .echo-clip-100 {
          -webkit-mask-image: linear-gradient(to top, black 100%, transparent 100%);
          mask-image: linear-gradient(to top, black 100%, transparent 100%);
        }

        @media (max-width: 768px) {
          .echo-word {
            font-size: clamp(44px, 12.5vw, 180px);
          }
        }
      `}</style>
    </section>
  );
}


