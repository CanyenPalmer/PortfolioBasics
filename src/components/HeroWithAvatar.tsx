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

// Inline SVG icons (match VSCode-style minimal line/solid look; inherit currentColor)
function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.42c.58.11.8-.25.8-.56v-2.14c-3.26.71-3.95-1.4-3.95-1.4-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.21 1.79 1.21 1.04 1.78 2.74 1.26 3.41.96.11-.76.41-1.26.75-1.55-2.6-.3-5.33-1.3-5.33-5.77 0-1.27.46-2.3 1.21-3.12-.12-.3-.52-1.52.12-3.17 0 0 .98-.31 3.2 1.19a11.02 11.02 0 0 1 5.83 0c2.22-1.5 3.2-1.19 3.2-1.19.64 1.65.24 2.87.12 3.17.75.82 1.21 1.85 1.21 3.12 0 4.48-2.74 5.46-5.35 5.76.42.36.8 1.06.8 2.14v3.17c0 .31.21.68.81.56A11.5 11.5 0 0 0 12 .5z"/>
    </svg>
  );
}
function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.34 18.34H6.1V10.3h2.24v8.04ZM7.22 9.18a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6ZM18 18.34h-2.23v-4.17c0-.99-.02-2.26-1.38-2.26-1.39 0-1.6 1.08-1.6 2.19v4.24H10.6V10.3h2.14v1.1h.03c.3-.56 1.03-1.15 2.12-1.15 2.27 0 2.69 1.49 2.69 3.43v4.66Z"/>
    </svg>
  );
}
function ResumeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 2.5L17.5 8H14V4.5ZM8 11h8v2H8v-2Zm0 4h8v2H8v-2Z"/>
    </svg>
  );
}

export default function Hero({ headline, subheadline, typer }: Props) {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden flex items-center bg-[#0b1016] text-white"
      aria-label="Hero"
    >
      {/* Top-right navigation (caps, borderless, with glitch on hover) */}
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

          {/* External links as inline SVG icons (no deps) */}
          <li className="ml-3 flex items-center gap-3 text-xl">
            <a
              href="https://github.com/CanyenPalmer"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
              title="GitHub"
            >
              <GitHubIcon className="w-[18px] h-[18px]" />
            </a>
            <a
              href="https://www.linkedin.com/in/canyen-palmer-b0b6762a0"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
              title="LinkedIn"
            >
              <LinkedInIcon className="w-[18px] h-[18px]" />
            </a>
            <a
              href="/Canyen-Palmer-Resume.pdf"
              target="_blank"
              rel="noreferrer"
              aria-label="Resume"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
              title="Resume"
            >
              <ResumeIcon className="w-[18px] h-[18px]" />
            </a>
          </li>
        </ul>
      </nav>

      {/* Main hero content (no DATA/SCIENCE underlay) */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
        {/* Copy */}
        <div className="space-y-5">
          <h1 className="text-6xl md:text-7xl font-bold leading-[1.05]">
            {headline}
          </h1>

          {/* SkillsBelt — scaled visually, still capped */}
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
        <div className="text-sm text-white/50">• Scroll to Explore •</div>
      </div>

      {/* Glitch animation (only on hovered nav item) */}
      <style jsx>{`
        .nav-glitch {
          /* keep default muted color until hovered */
          color: rgba(255, 255, 255, 0.7);
        }
        .nav-glitch:hover {
          animation: nav-glitch 1.5s linear infinite;
          color: #ffffff; /* force white during glitch */
        }
        @keyframes nav-glitch {
          0% { text-shadow: none; transform: translateZ(0); }
          5% { text-shadow: 1px 0 rgba(255,0,0,0.4), -1px 0 rgba(0,255,255,0.4); transform: translate(0.5px, 0); }
          10% { text-shadow: -1px 0 rgba(255,0,0,0.35), 1px 0 rgba(0,255,255,0.35); transform: translate(-0.5px, 0.2px); }
          15% { text-shadow: 1px 0 rgba(255,0,0,0.4), -1px 0 rgba(0,255,255,0.4); transform: translate(0.4px, -0.2px); }
          20% { text-shadow: none; transform: translateZ(0); }
          33% { text-shadow: none; transform: none; } /* active window ~0.5s */
          100% { text-shadow: none; transform: none; } /* idle remainder ~1s */
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-glitch:hover { animation: none !important; text-decoration: underline; }
        }
      `}</style>
    </section>
  );
}
