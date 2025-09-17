// src/components/HeroWithAvatar.tsx
"use client";

import React from "react";
import SkillsBelt from "@/components/SkillsBelt";
import { Outfit } from "next/font/google";

// import the same icons you use in VscodeTopBar
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";

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
      {/* Top-right navigation */}
      <nav
        aria-label="Primary"
        className={`${outfit.className} absolute top-6 right-6 z-20`}
      >
        <ul className="flex items-center gap-6 md:gap-7 text-sm md:text-base tracking-wide text-white/70">
          {[
            { label: "HOME", href: "#home" },
            { label: "ABOUT", href: "#about" },
            { label: "EXPERIENCE", href: "#experience" },
            { label: "PROJECTS", href: "#projects" },
            { label: "EDUCATION", href: "#education" },
            { label: "TESTIMONIALS", href: "#testimonials" },
            { label: "CONTACT", href: "#contact" },
          ].map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:rounded-sm nav-glitch"
              >
                {item.label}
              </a>
            </li>
          ))}

          {/* External links as icons */}
          <li className="ml-3 flex items-center gap-3 text-xl">
            <a
              href="https://github.com/CanyenPalmer"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/canyenpalmer/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
            >
              <FaLinkedin />
            </a>
            <a
              href="/Canyen-Palmer-Resume.pdf"
              target="_blank"
              rel="noreferrer"
              aria-label="Resume"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
            >
              <HiOutlineDocumentText />
            </a>
          </li>
        </ul>
      </nav>

      {/* Main hero content */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
        {/* Copy */}
        <div className="space-y-5">
          <h1 className="text-6xl md:text-7xl font-bold leading-[1.05]">
            {headline}
          </h1>

          {/* SkillsBelt — scaled visually */}
          <div className="mt-2 w-full max-w-[680px]">
            <SkillsBelt speedSeconds={26} logoHeight={42} gapPx={32} />
          </div>

          <p className="text-xl md:text-2xl text-white/80">{subheadline}</p>
          {typer ? (
            <p className="text-sm text-white/60 leading-relaxed">{typer}</p>
          ) : null}
        </div>

        {/* Avatar */}
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
        <div className="text-sm text-white/50">• Scroll to Explore •</div>
      </div>

      {/* Glitch animation */}
      <style jsx>{`
        .nav-glitch:hover {
          animation: nav-glitch 1.5s linear infinite;
          color: #ffffff; /* force white during glitch instead of gray highlight */
        }
        @keyframes nav-glitch {
          0% {
            text-shadow: none;
            transform: translateZ(0);
          }
          5% {
            text-shadow: 1px 0 rgba(255, 0, 0, 0.4),
              -1px 0 rgba(0, 255, 255, 0.4);
            transform: translate(0.5px, 0);
          }
          10% {
            text-shadow: -1px 0 rgba(255, 0, 0, 0.35),
              1px 0 rgba(0, 255, 255, 0.35);
            transform: translate(-0.5px, 0.2px);
          }
          15% {
            text-shadow: 1px 0 rgba(255, 0, 0, 0.4),
              -1px 0 rgba(0, 255, 255, 0.4);
            transform: translate(0.4px, -0.2px);
          }
          20% {
            text-shadow: none;
            transform: translateZ(0);
          }
          33% {
            text-shadow: none;
            transform: none;
          }
          100% {
            text-shadow: none;
            transform: none;
          }
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
