// src/components/VscodeTopBar.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LINKS } from "@/content/links";
import { profile } from "@/content/profile";

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

type Props = { signature?: string; minimal?: boolean };

export default function VscodeTopBar({ signature, minimal = false }: Props) {
  const pathname = usePathname();
  const name = signature ?? profile?.hero?.headline ?? "Canyen Palmer";

  return (
    <header
      className={`sticky top-0 z-50 ${BAR_BG} ${NEON_RING} border-b ${CYAN_BORDER} shadow-[0_4px_30px_rgba(0,0,0,.35)]`}
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-12 items-center justify-between gap-3">
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

          <div className="flex items-center gap-2">
            <IconButton href={LINKS.resume} title="Resume" ariaLabel="Open resume" icon={<DownloadIcon />} />
            <IconButton href={LINKS.linkedin} title="LinkedIn" ariaLabel="Open LinkedIn" icon={<LinkedInIcon />} external />
            <IconButton href={LINKS.github} title="GitHub" ariaLabel="Open GitHub" icon={<GitHubIcon />} external />
          </div>
        </div>
      </div>

      {!minimal && (
        <nav className="mx-auto max-w-7xl px-2 sm:px-4" aria-label="Primary">
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

/* Icons */
function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 opacity-70" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14L21 3" />
    </svg>
  );
}
function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.84 9.68.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.2-3.37-1.2-.45-1.17-1.1-1.48-1.1-1.48-.9-.63.07-.62.07-.62 1 .07 1.52 1.06 1.52 1.06.89 1.55 2.34 1.1 2.9.84.09-.66.35-1.1.63-1.35-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .85-.28 2.78 1.05A9.42 9.42 0 0 1 12 6.8c.86 0 1.74.12 2.56.34 1.93-1.33 2.78-1.05 2.78-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.93-2.35 4.8-4.59 5.05.36.32.67.94.67 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.05 10.05 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4zM8.5 8.5h3.8v2.1h.1c.5-.9 1.7-2.1 3.5-2.1 3.7 0 4.4 2.4 4.4 5.5V24h-4v-6.8c0-1.6-.03-3.7-2.3-3.7-2.3 0-2.6 1.7-2.6 3.6V24h-4V8.5z" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

/* Bits */
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
      <span className="pointer-events-none absolute inset-x-2 -bottom-0.5 h-px origin-left scale-x-0 bg-cyan-400/70 transition-transform duration-300 group-hover:scale-x-100" />
    </motion.a>
  );
}
function IconButton({
  href, title, ariaLabel, icon, external = false,
}: { href: string; title: string; ariaLabel: string; icon: React.ReactNode; external?: boolean }) {
  const content = (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      <span className="hidden sm:inline">{title}</span>
      {external && <ExternalIcon />}
    </span>
  );
  const base = "rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-medium text-white/85 border border-cyan-400/25 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-colors";
  return external ? (
    <a href={href} target="_blank" rel="noreferrer noopener" aria-label={ariaLabel} className={base}>
      {content}
    </a>
  ) : (
    <Link href={href} aria-label={ariaLabel} className={base}>
      {content}
    </Link>
  );
}
