"use client";

import * as React from "react";
import { Satisfy } from "next/font/google";
import { useRouter, usePathname } from "next/navigation";
import { LINKS } from "../content/links"; // note the relative path from /components

const satisfy = Satisfy({ subsets: ["latin"], weight: "400", display: "swap" });

type Section = { id: string; label: string };

// We keep these props for compatibility, but we IGNORE any hrefs passed in.
// That prevents placeholder overrides from elsewhere.
type Props = {
  sections?: Section[];
  // legacy/ignored:
  resumeHref?: string;
  linkedinHref?: string;
  githubHref?: string;
  signature?: string;
  /** If your home lives somewhere else, change this (e.g., "/portfolio") */
  homePath?: string;
};

export default function VscodeTopBar({
  sections = [
    { id: "home", label: "Home" },
    { id: "experience", label: "Experience" },
    { id: "services", label: "My Services" },
    { id: "projects", label: "Projects" },
    { id: "education", label: "Education" },
    { id: "about", label: "About Me" },
    { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact" },
  ],
  signature = "Canyen Palmer",
  homePath = "/",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeId, setActiveId] = React.useState<string>(sections[0]?.id ?? "home");

  // Final URLs (always from LINKS; ignore any incoming props so nothing can override)
  const resumeUrl   = LINKS.resume;
  const linkedinUrl = LINKS.linkedin;
  const githubUrl   = LINKS.github;

  const HEADER_OFFSET = 72; // keep in sync with your header height

  const smoothScrollToId = React.useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top - HEADER_OFFSET - 8;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  // Observe sections and set active tab on scroll
  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) setActiveId(s.id);
        },
        { rootMargin: `-${HEADER_OFFSET}px 0px -66% 0px`, threshold: 0.1 }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  // Handle clicks: if on home, smooth scroll; otherwise route to /#id (then hash handler below will scroll)
  const onTabClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const targetHash = `#${id}`;
    if (pathname === homePath) {
      // Update hash for accessibility/URL while preventing default jump
      history.replaceState(null, "", targetHash);
      smoothScrollToId(id);
    } else {
      router.push(`${homePath}${targetHash}`);
    }
  };

  // On mount (and when hash changes), perform an offset-aware scroll
  React.useEffect(() => {
    const handleHashScroll = () => {
      const raw = window.location.hash.replace("#", "");
      if (!raw) return;
      // Delay a tick to ensure the section is in the DOM after route transitions
      requestAnimationFrame(() => smoothScrollToId(raw));
    };
    // Initial load
    handleHashScroll();
    // Future hash changes (e.g., navigating from another page)
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Split signature into per-letter spans for wave
  const sigChars = React.useMemo(() => signature.split(""), [signature]);

  return (
    <header
      className="
        sticky top-0 z-50 w-full
        border-b border-white/10
        backdrop-blur-md bg-[rgba(12,16,22,0.6)]
      "
      role="navigation"
      aria-label="Primary"
    >
      {/* Full-bleed row with edge padding */}
      <div className="px-4 md:px-6">
        {/* Grid: LEFT (lights+signature) | CENTER (tabs) | RIGHT (actions) */}
        <div className="h-14 grid grid-cols-[auto_1fr_auto] items-center gap-3">
          {/* LEFT — traffic lights flush-left + signature */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="inline-flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>

            {/* Signature in Satisfy font with per-letter crowd wave */}
            <div
              className={`
                ${satisfy.className}
                select-none text-white/90 font-semibold
                tracking-[0.02em] [text-shadow:0_1px_0_rgba(0,0,0,0.4)]
                truncate flex
              `}
              aria-label="Signature"
              title={signature}
            >
              {sigChars.map((ch, i) => (
                <span
                  key={i}
                  className="sig-ch"
                  style={{ ["--i" as any]: i }}
                  aria-hidden={ch === " " ? undefined : true}
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>

          {/* CENTER — tabs (start-left on mobile, center on md+) */}
          <nav
            className="min-w-0 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            aria-label="Section tabs"
          >
            <ul className="flex items-center gap-3 justify-start md:justify-center">
              {sections.map((s) => {
                const isActive = s.id === activeId;
                return (
                  <li key={s.id} className="shrink-0">
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => onTabClick(e, s.id)}
                      className={`
                        group inline-flex items-center
                        px-4 py-2 rounded-md
                        font-mono text-[13px]
                        transition
                        ${
                          isActive
                            ? "bg-white/10 text-white border border-white/10 shadow-[inset_0_-2px_0_rgba(56,189,248,0.6)]"
                            : "text-white/70 hover:text-white/95 hover:bg-white/5 border border-transparent hover:shadow-[inset_0_-2px_0_rgba(255,255,255,0.25)]"
                        }
                      `}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span
                        className={`mr-2 inline-block h-1 w-1 rounded-full ${
                          isActive ? "bg-emerald-400" : "bg-white/30 group-hover:bg-white/50"
                        }`}
                      />
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* RIGHT — actions */}
          <div className="flex items-center gap-2.5 pl-2 justify-end">
            {/* NOTE: hidden on <sm> by design; remove 'hidden sm:' to always show */}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-[12.5px] font-medium border border-white/15 text-white/90 hover:bg-white/10 transition"
              aria-label="Open resume in new tab"
              title="Resume"
            >
              <span className="font-mono">Resume</span>
            </a>

            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-white/15 hover:bg-white/10 transition text-white"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <LinkedInIcon className="h-4.5 w-4.5" />
            </a>

            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-white/15 hover:bg-white/10 transition text-white"
              aria-label="GitHub"
              title="GitHub"
            >
              <GitHubIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Subtle bottom accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-emerald-400/40 via-blue-400/40 to-purple-400/40" />

      {/* Wave keyframes (scoped global so Tailwind won't purge) */}
      <style jsx global>{`
        :root { --SIG_WAVE_DURATION: 0.9s; --SIG_WAVE_STAGGER: 0.08s; }
        @keyframes signature-wave {
          0% { transform: translateY(0) rotate(0) scale(1); opacity: 1; }
          25% { transform: translateY(-2px) rotate(-1deg) scale(1.02); opacity: 0.95; }
          50% { transform: translateY(0) rotate(0) scale(1); opacity: 1; }
          100% { transform: translateY(0) rotate(0) scale(1); opacity: 1; }
        }
        .sig-ch {
          display: inline-block; transform-origin: center bottom;
          animation: signature-wave var(--SIG_WAVE_DURATION) ease-in-out infinite;
          animation-delay: calc(var(--i, 0) * var(--SIG_WAVE_STAGGER));
          will-change: transform, opacity;
        }
        @media (prefers-reduced-motion: reduce) { .sig-ch { animation: none; } }
      `}</style>
    </header>
  );
}

/* Icons */
function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.451 20.451h-3.555v-5.569c0-1.328-.025-3.036-1.85-3.036-1.852 0-2.135 1.445-2.135 2.939v5.666H9.355V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.603 0 4.268 2.371 4.268 5.455v6.285zM5.337 7.433a2.064 2.064 0 1 1 0-4.128 2.064 2.064 0 0 1 0 4.128zM6.999 20.451H3.675V9h3.324v11.451z" />
    </svg>
  );
}
function GitHubIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.589 2 12.254c0 4.53 2.865 8.366 6.839 9.723.5.095.682-.222.682-.493 0-.243-.009-.888-.014-1.744-2.782.615-3.37-1.365-3.37-1.365-.455-1.172-1.111-1.485-1.111-1.485-.908-.64.07-.627.07-.627 1.003.073 1.531 1.05 1.531 1.05.892 1.557 2.341 1.108 2.91.847.091-.662.35-1.108.636-1.362-2.221-.257-4.555-1.137-4.555-5.06 0-1.117.389-2.03 1.027-2.747-.103-.259-.445-1.298.097-2.706 0 0 .839-.27 2.75 1.05A9.362 9.362 0 0 1 12 7.802c.85.004 1.705.117 2.504.343 1.91-1.32 2.748-1.05 2.748-1.05.544 1.408.202 2.447.1 2.706.64.717 1.026 1.63 1.026 2.747 0 3.934-2.337 4.8-4.565 5.052.357.315.675.935.675 1.885 0 1.361-.013 2.458-.013 2.794 0 .274.18.593.688.492C19.139 20.616 22 16.782 22 12.254 22 6.589 17.523 2 12 2Z"
      />
    </svg>
  );
}
