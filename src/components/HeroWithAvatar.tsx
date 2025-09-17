// src/components/HeroWithAvatar.tsx
"use client";

import React from "react";
import SkillsBelt from "@/components/SkillsBelt";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type Props = {
  headline: string;
  subheadline: string;
  typer?: string;
};

export default function Hero({ headline, subheadline, typer }: Props) {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden flex items-center bg-[#0b1016] text-white"
      aria-label="Hero"
    >
      {/* Top-right, minimal, borderless navigation (part of the hero) */}
      <nav
        aria-label="Primary"
        className={`${outfit.className} absolute top-6 right-6 z-20`}
      >
        <ul className="flex items-center gap-6 md:gap-7 text-sm md:text-base lowercase tracking-wide text-white/70">
          {[
            { label: "home", href: "#home" },
            { label: "about", href: "#about" },
            { label: "experience", href: "#experience" },
            { label: "projects", href: "#projects" },
            { label: "education", href: "#education" },
            { label: "testimonials", href: "#testimonials" },
            { label: "contact", href: "#contact" },
          ].map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:rounded-sm nav-glitch"
              >
                {item.label}
              </a>
            </li>
          ))}
          {/* External links (text, minimal) */}
          <li className="ml-2">
            <a
              href="https://github.com/CanyenPalmer"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:rounded-sm nav-glitch"
            >
              github
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/canyenpalmer/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:rounded-sm nav-glitch"
            >
              linkedin
            </a>
          </li>
          <li>
            <a
              href="/Canyen-Palmer-Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:rounded-sm nav-glitch"
            >
              resume
            </a>
          </li>
        </ul>
      </nav>

      {/* Background typography underlay (kept subtle) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-10 left-6 text-[10rem] font-black tracking-tight text-white/5 select-none">
          DATA
        </div>
        <div className="absolute bottom-0 right-6 text-[9rem] font-black tracking-tight text-white/5 select-none rotate-6">
          SCIENCE
        </div>
      </div>

      {/* Main hero content */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
        {/* Copy */}
        <div className="space-y-5">
          <h1 className="text-6xl md:text-7xl font-bold leading-[1.05]">
            {headline}
          </h1>

          {/* SkillsBelt — scaled visually, still capped so it doesn't collide with avatar */}
          <div className="mt-2 w-full max-w-[680px]">
            <SkillsBelt speedSeconds={26} logoHeight={42} gapPx={32} />
          </div>

          <p className="text-xl md:text-2xl text-white/80">{subheadline}</p>
          {typer ? (
            <p className="text-sm text-white/60 leading-relaxed">{typer}</p>
          ) : null}
        </div>

        {/* Avatar (larger, but capped; transparent background) */}
        <div className="justify-self-center">
          <img
            src="/about/avatar-hero-headshot.png"
            alt="Avatar"
            className="w-[500px] md:w-[600px] max-w-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] select-none"
            draggable={false}
          />
        </div>
      </div>

      {/* Scroll prompt */}
      <div className="absolute bottom-6 left-0 right-0 z-10 flex items-center justify-center">
        <div className="text-sm text-white/50">
          • Scroll to Explore •
        </div>
      </div>

      {/* Glitch animation (only on hovered nav item). 
          Active for ~0.5s, idle ~1s, repeating while hovered. */}
      <style jsx>{`
        .nav-glitch:hover {
          animation: nav-glitch 1.5s linear infinite;
        }
        @keyframes nav-glitch {
          0% { text-shadow: none; transform: translateZ(0); }
          5% { text-shadow: 1px 0 rgba(255, 0, 0, 0.4), -1px 0 rgba(0, 255, 255, 0.4); transform: translate(0.5px, 0); }
          10% { text-shadow: -1px 0 rgba(255, 0, 0, 0.35), 1px 0 rgba(0, 255, 255, 0.35); transform: translate(-0.5px, 0.2px); }
          15% { text-shadow: 1px 0 rgba(255, 0, 0, 0.4), -1px 0 rgba(0, 255, 255, 0.4); transform: translate(0.4px, -0.2px); }
          20% { text-shadow: none; transform: translateZ(0); }
          33% { text-shadow: none; transform: none; } /* end of 0.5s active window */
          100% { text-shadow: none; transform: none; } /* idle remainder ~1s */
        }

        @media (prefers-reduced-motion: reduce) {
          .nav-glitch:hover {
            animation: none !important;
            text-decoration: underline;
          }
        }
      `}</style>
    </section>
  );
}

