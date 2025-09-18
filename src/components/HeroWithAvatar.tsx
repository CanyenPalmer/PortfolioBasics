// src/components/HeroWithAvatar.tsx
"use client";

import React from "react";
import SkillsBelt from "@/components/SkillsBelt";
import { Outfit } from "next/font/google";
import NameStamp from "@/components/NameStamp";

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
  // === VHS glitch hover (nav-only) ===
  const _glitchTimers = React.useRef<Map<HTMLElement, number>>(new Map());
  const _glyphs =
    "アイウエオカキクケコサシスセソタチツテトﾅﾆﾇﾈﾉABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  function scrambleLabel(label: string) {
    const n = Math.max(1, Math.min(label.length, Math.floor(label.length * 0.8)));
    let out = "";
    for (let i = 0; i < label.length; i++) {
      if (/\s/.test(label[i])) { out += " "; continue; }
      if (i < label.length - n) { out += label[i]; continue; }
      const c = _glyphs[Math.floor(Math.random() * _glyphs.length)];
      out += c;
    }
    return out;
  }

  function onNavHoverEnter(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = e.currentTarget as HTMLElement;
    const label = el.getAttribute("data-label") || "";
    el.classList.add("is-glitching");
    // Initialize CSS var so ::before/::after have content
    el.style.setProperty("--glitch-text", `"${label}"`);
    // Update random overlay briefly (~300–360ms)
    let ticks = 0;
    const id = window.setInterval(() => {
      ticks++;
      el.style.setProperty("--glitch-text", `"${scrambleLabel(label)}"`);
      if (ticks >= 8) {
        clearInterval(id);
        _glitchTimers.current.delete(el);
        el.style.setProperty("--glitch-text", `"${label}"`);
        el.classList.remove("is-glitching");
      }
    }, 45);
    _glitchTimers.current.set(el, id);
  }

  function onNavHoverLeave(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = e.currentTarget as HTMLElement;
    const label = el.getAttribute("data-label") || "";
    const id = _glitchTimers.current.get(el);
    if (id) { clearInterval(id); _glitchTimers.current.delete(el); }
    el.style.setProperty("--glitch-text", `"${label}"`);
    el.classList.remove("is-glitching");
  }

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
                data-label={item.label}
                onMouseEnter={onNavHoverEnter}
                onMouseLeave={onNavHoverLeave}
              >
                <span className="nav-label">{item.label}</span>
                <span className="nav-vhs" aria-hidden="true" />
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
            <NameStamp
              text={headline ?? "Canyen Palmer"}
              className="text-6xl md:text-7xl font-bold"
              variant="hero"
              rearmOnExit={true}
            />
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
        <div className="text-base text-white/50">• Scroll to Explore •</div>
      </div>

      {/* VHS glitch overlay (only on hovered nav item) */}
      <style jsx global>{`
        .nav-glitch { position: relative; display: inline-block; color: rgba(255,255,255,0.7); }
        .nav-glitch .nav-label { position: relative; z-index: 1; }
        .nav-glitch:hover { color: #fff; }

        /* Overlay element uses CSS var --glitch-text for randomized content */
        .nav-glitch .nav-vhs {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .nav-glitch.is-glitching .nav-vhs::before,
        .nav-glitch.is-glitching .nav-vhs::after {
          content: var(--glitch-text);
          position: absolute;
          left: 0; top: 0;
          white-space: nowrap;
          will-change: transform, clip-path, opacity, text-shadow;
        }
        .nav-glitch.is-glitching .nav-vhs::before {
          color: currentColor;
          mix-blend-mode: screen;
          text-shadow: 1px 0 rgba(0,255,255,0.6);
          animation: vhsShiftA 280ms steps(2, end) infinite;
        }
        .nav-glitch.is-glitching .nav-vhs::after {
          color: currentColor;
          mix-blend-mode: screen;
          text-shadow: -1px 0 rgba(255,0,0,0.6);
          animation: vhsShiftB 280ms steps(2, end) infinite;
        }

        @keyframes vhsShiftA {
          0% { transform: translate(0,0); clip-path: inset(0 0 0 0); opacity: .85; }
          25% { transform: translate(1px,-0.5px); clip-path: inset(0 0 60% 0); opacity: .55; }
          50% { transform: translate(-1px,0.5px); clip-path: inset(40% 0 0 0); opacity: .7; }
          75% { transform: translate(0.5px,0); clip-path: inset(10% 0 20% 0); opacity: .6; }
          100% { transform: translate(0,0); clip-path: inset(0 0 0 0); opacity: .85; }
        }
        @keyframes vhsShiftB {
          0% { transform: translate(0,0); clip-path: inset(0 0 0 0); opacity: .8; }
          25% { transform: translate(-1px,0.5px); clip-path: inset(20% 0 30% 0); opacity: .5; }
          50% { transform: translate(1px,-0.5px); clip-path: inset(0 0 50% 0); opacity: .65; }
          75% { transform: translate(-0.5px,0); clip-path: inset(50% 0 0 0); opacity: .55; }
          100% { transform: translate(0,0); clip-path: inset(0 0 0 0); opacity: .8; }
        }

        @media (prefers-reduced-motion: reduce) {
          .nav-glitch.is-glitching .nav-vhs::before,
          .nav-glitch.is-glitching .nav-vhs::after { animation: none !important; text-shadow: none !important; }
        }
      `}</style>
    </section>
  );
}
