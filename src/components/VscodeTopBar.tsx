"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import NameStamp from "@/components/NameStamp";

/**
 * VscodeTopBar — minimal floating header that:
 *  - visible across: about → testimonials
 *  - fades in once on entering About, fades out after Testimonials
 *  - no bar background; only blurred text + icons
 */

type Props = {
  signature: string;
  resumeHref?: string;
  linkedinHref?: string;
  githubHref?: string;
};

const VISIBLE_START = "about";
const VISIBLE_END = "testimonials";

const NAV_SECTION_IDS = [
  "home",
  "about",
  "experience",
  "projects",
  "education",
  "testimonials",
  "contact",
] as const;

/* Inline icons */
function IconGithub(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      className="filter backdrop-blur-none"
      style={{ filter: "url(#blur)" }}
      {...props}
    >
      <defs>
        <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
      </defs>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-3.162 19.492c.5.092.683-.216.683-.48 0-.236-.009-.861-.014-1.69-2.78.604-3.366-1.34-3.366-1.34-.455-1.155-1.11-1.464-1.11-1.464-.907-.62.069-.607.069-.607 1.003.07 1.53 1.03 1.53 1.03.892 1.53 2.342 1.088 2.91.833.091-.647.35-1.088.636-1.339-2.22-.252-4.555-1.11-4.555-4.943 0-1.091.39-1.983 1.03-2.682-.103-.253-.447-1.27.098-2.645 0 0 .84-.269 2.75 1.025A9.563 9.563 0 0 1 12 6.844c.85.004 1.706.115 2.505.337 1.909-1.294 2.748-1.025 2.748-1.025.547 1.375.203 2.392.1 2.645.64.699 1.029 1.59 1.029 2.682 0 3.842-2.339 4.687-4.566 4.936.359.309.679.917.679 1.85 0 1.335-.012 2.41-.012 2.736 0 .266.18.576.688.478A10 10 0 0 0 12 2Z"
      />
    </svg>
  );
}
function IconLinkedIn(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      className="filter"
      style={{ filter: "url(#blur)" }}
      {...props}
    >
      <path
        fill="currentColor"
        d="M4.983 3.5C4.983 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.483 1.12 2.483 2.5ZM.29 8.25h4.42V23.5H.29V8.25Zm7.48 0h4.24v2.08h.06c.59-1.12 2.03-2.3 4.18-2.3 4.47 0 5.29 2.94 5.29 6.76v8.71h-4.42v-7.72c0-1.84-.03-4.22-2.57-4.22-2.57 0-2.97 2-2.97 4.08v7.86H7.77V8.25Z"
      />
    </svg>
  );
}
function IconFileText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      className="filter"
      style={{ filter: "url(#blur)" }}
      {...props}
    >
      <path
        fill="currentColor"
        d="M14 2H6a2 2 0 0 0-2 2v16c0 1.103.897 2 2 2h12a2 2 0 0 0 2-2V8zm0 2.414L17.586 8H14zM8 13h8v2H8zm0 4h8v2H8zm0-8h4v2H8z"
      />
    </svg>
  );
}

export default function VscodeTopBar({
  signature,
  resumeHref = "/Canyen_Palmer_Resume.pdf",
  linkedinHref = "https://www.linkedin.com/in/canyen-palmer-b0b6762a0",
  githubHref = "https://github.com/CanyenPalmer",
}: Props) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);

  const tabs = useMemo(
    () =>
      NAV_SECTION_IDS.map((id) => ({
        id,
        label: id[0].toUpperCase() + id.slice(1),
        href: `#${id}`,
      })),
    []
  );

  /* ---------- VISIBILITY: based on band ---------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const startEl = document.getElementById(VISIBLE_START);
    const endEl = document.getElementById(VISIBLE_END);
    if (!startEl || !endEl) return;

    const checkVisibility = () => {
      const start = startEl.getBoundingClientRect().top;
      const end = endEl.getBoundingClientRect().bottom;
      const vpHeight = window.innerHeight;

      // Visible if viewport intersects the band
      const inBand = start < vpHeight * 0.9 && end > vpHeight * 0.1;
      setVisible(inBand);
    };

    checkVisibility();
    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility);
    return () => {
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, []);

  /* ---------- ACTIVE TAB ---------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sections = NAV_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean
    ) as HTMLElement[];

    const pickActive = () => {
      const viewportCenter = window.innerHeight / 2;
      let bestId: string | null = null;
      let bestDist = Infinity;

      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const dist = Math.abs(mid - viewportCenter);
        if (dist < bestDist) {
          bestDist = dist;
          bestId = el.id;
        }
      }
      if (bestId) setActive(bestId);
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(pickActive);
    };

    pickActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          key="vscode-topbar"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed inset-x-0 top-0 z-50 w-full"
          aria-label="Site navigation"
        >
          <div className="mx-auto max-w-7xl px-3 sm:px-5">
            <nav className="mt-3 flex items-center justify-between">
              {/* Signature */}
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="truncate text-sm font-semibold text-white/95"
                  style={{ filter: "url(#blur)" }}
                >
                  <NameStamp
                    text={signature}
                    className="text-sm font-semibold"
                    variant="bar"
                    rearmOnExit={false}
                  />
                </span>
              </div>

              {/* Tabs */}
              <ul className="hidden md:flex items-center gap-2">
                {tabs.map((t) => {
                  const isActive = active === t.id;
                  return (
                    <li key={t.id}>
                      <a
                        href={t.href}
                        className={`px-3 py-1.5 text-sm transition-colors`}
                        style={{
                          color: isActive ? "#67e8f9" : "rgba(255,255,255,0.8)",
                          filter: "url(#blur)",
                        }}
                      >
                        {t.label}
                      </a>
                    </li>
                  );
                })}
              </ul>

              {/* Contact links */}
              <div className="flex items-center gap-2 sm:gap-3">
                {resumeHref && (
                  <Link
                    href={resumeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-white/85 hover:text-cyan-200 transition-colors"
                    aria-label="Resume"
                    style={{ filter: "url(#blur)" }}
                  >
                    <IconFileText style={{ width: 18, height: 18 }} />
                  </Link>
                )}
                {linkedinHref && (
                  <Link
                    href={linkedinHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-white/85 hover:text-cyan-200 transition-colors"
                    aria-label="LinkedIn"
                    style={{ filter: "url(#blur)" }}
                  >
                    <IconLinkedIn style={{ width: 18, height: 18 }} />
                  </Link>
                )}
                {githubHref && (
                  <Link
                    href={githubHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-white/85 hover:text-cyan-200 transition-colors"
                    aria-label="GitHub"
                    style={{ filter: "url(#blur)" }}
                  >
                    <IconGithub style={{ width: 18, height: 18 }} />
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
