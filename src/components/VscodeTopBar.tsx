// src/components/VscodeTopBar.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ExternalLink, Github, Linkedin, Download } from "lucide-react";
import { LINKS } from "@/content/links";
import { profile } from "@/content/profile";

/**
 * VSCode-style top bar
 * - Sticky, translucent, neon accents
 * - Left: traffic-lights, signature (from unified content)
 * - Center: section tabs (About, Experience, Projects, Education, Testimonials, Contact)
 * - Right: Resume, LinkedIn, GitHub
 *
 * Looks the same as before, but uses centralized LINKS + section anchors.
 */

const BAR_BG =
  "bg-[linear-gradient(180deg,rgba(12,16,22,.85),rgba(12,16,22,.72))] backdrop-blur supports-[backdrop-filter]:backdrop-blur-md";
const CYAN = "text-cyan-300";
const CYAN_BORDER = "border-cyan-400/30";
const NEON_RING = "ring-1 ring-cyan-400/20";

const sections: { label: string; href: string }[] = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

type Props = {
  /** Optional override for the signature shown at left. Defaults to your name from profile. */
  signature?: string;
  /** Optional: show a minimal bar (e.g., on alt pages) */
  minimal?: boolean;
};

export default function VscodeTopBar({ signature, minimal = false }: Props) {
  const pathname = usePathname();
  const name = signature ?? profile?.hero?.headline ?? "Canyen Palmer";

  return (
    <header
      className={`sticky top-0 z-50 ${BAR_BG} ${NEON_RING} border-b ${CYAN_BORDER} shadow-[0_4px_30px_rgba(0,0,0,.35)]`}
      role="banner"
    >
      {/* Top Row: traffic lights + title + actions */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-12 items-center justify-between gap-3">
          {/* Left cluster: traffic lights + signature */}
          <div className="flex items-center gap-3">
            <TrafficLights />
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-sm text-white/80">/</span>
              <span className={`font-semibold tracking-wide ${CYAN}`}>{name}</span>
              <span className="hidden sm:inline text-xs text-white/50">
                {pathname === "/" ? "— Portfolio" : "— Page"}
              </span>
            </div>
          </div>

          {/* Right cluster: external actions */}
          <div className="flex items-center gap-2">
            <IconButton
              href={LINKS.resume}
              title="Resume"
              ariaLabel="Open resume"
              icon={<Download className="h-4 w-4" aria-hidden />}
            />
            <IconButton
              href={LINKS.linkedin}
              title="LinkedIn"
              ariaLabel="Open LinkedIn"
              icon={<Linkedin className="h-4 w-4" aria-hidden />}
              external
            />
            <IconButton
              href={LINKS.github}
              title="GitHub"
              ariaLabel="Open GitHub"
              icon={<Github className="h-4 w-4" aria-hidden />}
              external
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: section tabs (hidden if minimal) */}
      {!minimal && (
        <nav
          className="mx-auto max-w-7xl px-2 sm:px-4"
          aria-label="Primary"
        >
          <div className="flex flex-wrap items-center gap-1 py-2">
            {sections.map((s) => (
              <TabLink key={s.href} href={s.href} label={s.label} />
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

/* ------------------------- Subcomponents ------------------------- */

function TrafficLights() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-block h-3 w-3 rounded-full bg-[#ff5f56] shadow-[0_0_8px_#ff5f56]" />
      <span className="inline-block h-3 w-3 rounded-full bg-[#ffbd2e] shadow-[0_0_8px_#ffbd2e]" />
      <span className="inline-block h-3 w-3 rounded-full bg-[#27c93f] shadow-[0_0_8px_#27c93f]" />
    </div>
  );
}

function TabLink({ href, label }: { href: string; label: string }) {
  return (
    <motion.a
      href={href}
      className="group relative rounded-md px-3 py-1.5 text-sm font-medium text-white/80 hover:text-white"
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 350, damping: 24 }}
    >
      <span>{label}</span>
      {/* Neon underline */}
      <span className="pointer-events-none absolute inset-x-2 -bottom-0.5 h-px origin-left scale-x-0 bg-cyan-400/70 transition-transform duration-300 group-hover:scale-x-100" />
    </motion.a>
  );
}

function IconButton({
  href,
  title,
  ariaLabel,
  icon,
  external = false,
}: {
  href: string;
  title: string;
  ariaLabel: string;
  icon: React.ReactNode;
  external?: boolean;
}) {
  const content = (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      <span className="hidden sm:inline">{title}</span>
      {external && <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />}
    </span>
  );

  const baseClass =
    "rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-medium text-white/85 border border-cyan-400/25 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-colors";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={ariaLabel}
        className={baseClass}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={baseClass}>
      {content}
    </Link>
  );
}
