// src/components/VscodeTopBar.tsx
"use client";

import * as React from "react";
import Link from "next/link";

type VscodeTopBarProps = {
  /** Left/right action links you already pass today */
  resumeHref: string;
  githubHref: string;
  linkedinHref: string;
  /** Signature text you show in the bar (unchanged) */
  signature: string;
};

/**
 * VSCode-style top bar — linear single row
 *
 * Layout (desktop):
 * [ ● ● ● ]  [/ Canyen Palmer – Portfolio ]  [ About | Experience | Projects | Education | Testimonials | Contact ]  [ Resume | GitHub | LinkedIn ]
 *
 * Notes:
 * - Titles (tab labels) are NOT changed — just formatting/placement.
 * - Middle nav becomes horizontally scrollable on small screens (single row; no wrapping).
 * - External links keep target/rel for safety.
 * - Sticky with subtle blur + divider; scoped to header only.
 */
export default function VscodeTopBar({
  resumeHref,
  githubHref,
  linkedinHref,
  signature,
}: VscodeTopBarProps) {
  // Your existing section titles/anchors — unchanged labels, linearized layout
  const tabs: { label: string; href: string }[] = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Education", href: "#education" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 border-b border-white/10 bg-[#0b1016]/70 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Single linear row */}
        <div className="flex h-14 items-center gap-4">
          {/* Left cluster: dots + brand/signature */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ff5f56]" aria-hidden />
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" aria-hidden />
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#27c93f]" aria-hidden />
            </div>

            {/* Brand text — keep your existing signature; shortens on very small screens */}
            <div className="whitespace-nowrap text-sm sm:text-base tracking-tight text-white/90">
              <span className="text-white/60 mr-1">/</span>
              <span className="hidden xs:inline">{signature} – Portfolio</span>
              <span className="xs:hidden">{signature}</span>
            </div>
          </div>

          {/* Middle: section tabs — single row; scroll on small screens (no wrapping) */}
          <nav
            aria-label="Main"
            className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent"
          >
            <ul className="flex items-center gap-5 md:gap-6 text-sm">
              {tabs.map((t) => (
                <li key={t.href} className="shrink-0">
                  <Link
                    href={t.href}
                    className="text-white/80 hover:text-white transition-colors inline-block py-1 border-b-2 border-transparent hover:border-white/30"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: action buttons — keep as buttons, same destinations */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-white/15 px-3 py-1.5 text-sm text-white/90 hover:text-white hover:border-white/30 transition-colors"
            >
              Resume
            </a>
            <a
              href={githubHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-white/15 px-3 py-1.5 text-sm text-white/90 hover:text-white hover:border-white/30 transition-colors"
            >
              GitHub
            </a>
            <a
              href={linkedinHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-white/15 px-3 py-1.5 text-sm text-white/90 hover:text-white hover:border-white/30 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Optional tiny divider glow under header (keeps VSCode vibe without framing) */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </header>
  );
}
