// src/components/ContactSection.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { profile } from "@/content/profile";

export default function ContactSection() {
  const email = (profile as any)?.contact?.email ?? "Canyen2019@gmail.com";

  // Optional subtle clock (like the reference)
  const [now, setNow] = React.useState<string>(() => new Date().toLocaleString());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date().toLocaleString()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative bg-[#0b1016] text-white pt-24 pb-28 md:pt-28 md:pb-36"
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
              {/* Replace with your preferred address or remove */}
              <address className="not-italic text-white/70">
                Pittsburgh, PA • United States
              </address>
            </div>

            {/* Optional note */}
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
              {/* Tiny live clock (optional) */}
              <li className="pt-4 text-xs font-mono uppercase tracking-wider text-white/40">
                {now}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Echo footer */}
      <div className="relative mt-16 overflow-hidden">
        <div className="echo-mask pointer-events-none">
          <div className="echo-row">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="echo-word">CANYEN&nbsp;PALMER</span>
            ))}
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
        .echo-mask {
          position: relative;
          height: 130px;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.06) 30%,
            rgba(255, 255, 255, 0.06) 70%,
            rgba(255, 255, 255, 0) 100%
          );
          mask-image: linear-gradient(
            to top,
            transparent 0%,
            black 25%,
            black 75%,
            transparent 100%
          );
        }
        .echo-row {
          position: absolute;
          bottom: -16px;
          left: 0;
          right: 0;
          white-space: nowrap;
          display: flex;
          gap: 24px;
          justify-content: center;
        }
        .echo-word {
          font-weight: 900;
          letter-spacing: 0.06em;
          font-size: clamp(48px, 12vw, 120px);
          line-height: 1;
          color: rgba(255, 255, 255, 0.18);
        }
      `}</style>
    </section>
  );
}
