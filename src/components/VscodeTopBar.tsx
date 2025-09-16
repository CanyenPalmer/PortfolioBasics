"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Linkedin, FileText } from "lucide-react";

/**
 * VscodeTopBar — translucent, fixed header that:
 *  - shows ONLY on sections: about, experience, projects, education, testimonials
 *  - fades in entering "about" and fades out after "testimonials"
 *  - removes the left color dots; shows just signature, tabs, and contact links
 *
 * Props preserved from your current layout usage:
 *  - signature: string
 *  - resumeHref: string
 *  - linkedinHref: string
 *  - githubHref: string
 */

type Props = {
  signature: string;
  resumeHref?: string;
  linkedinHref?: string;
  githubHref?: string;
};

const SECTION_IDS = [
  "about",
  "experience",
  "projects",
  "education",
  "testimonials",
] as const;

export default function VscodeTopBar({
  signature,
  resumeHref = "/Canyen_Palmer_Resume.pdf",
  linkedinHref = "https://www.linkedin.com/in/your-handle",
  githubHref = "https://github.com/your-handle",
}: Props) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Map for quick anchor generation
  const tabs = useMemo(
    () =>
      SECTION_IDS.map((id) => ({
        id,
        label: id[0].toUpperCase() + id.slice(1),
        href: `#${id}`,
      })),
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const targets = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (targets.length === 0) return;

    // Show the bar if ANY of our target sections is intersecting the viewport
    const onIntersect: IntersectionObserverCallback = (entries) => {
      let anyVisible = false;
      let current: string | null = null;

      for (const entry of entries) {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          anyVisible = true;
          // Use the largest intersection ratio as "active"
          if (!current || entry.intersectionRatio > 0.35) {
            current = id;
          }
        }
      }

      // If *none* of the watched sections are in view, hide the bar
      // This naturally hides it during the Hero and after Testimonials.
      setVisible((prev) => (prev !== anyVisible ? anyVisible : prev));
      if (current) setActive(current);
    };

    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      // A bit of threshold so it fades in as the section actually arrives
      threshold: [0.12, 0.25, 0.4, 0.6, 0.8],
    });

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
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
          className={`
            fixed inset-x-0 top-0 z-50
            mx-auto
            w-full
          `}
          aria-label="Site navigation"
        >
          <div
            className={`
              mx-auto max-w-7xl
              px-3 sm:px-5
            `}
          >
            <nav
              className={`
                mt-3
                flex items-center justify-between
                rounded-xl
                border border-white/10
                bg-black/35   /* clear/translucent so content shows through */
                backdrop-blur-md
                shadow-[0_2px_20px_rgba(0,0,0,0.35)]
                ring-1 ring-white/[0.02]
                px-3 sm:px-4 py-2
              `}
            >
              {/* Signature (no traffic-light dots) */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="truncate text-sm font-semibold text-white/95">
                  {signature}
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
                        className={`
                          rounded-md px-3 py-1.5 text-sm
                          transition-colors
                          ${
                            isActive
                              ? "text-cyan-200 bg-white/5"
                              : "text-white/80 hover:text-cyan-200 hover:bg-white/5"
                          }
                        `}
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
                    className="rounded-md p-1.5 text-white/85 hover:text-cyan-200 hover:bg-white/5 transition-colors"
                    aria-label="Resume"
                  >
                    <FileText size={18} strokeWidth={1.75} />
                  </Link>
                )}
                {linkedinHref && (
                  <Link
                    href={linkedinHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md p-1.5 text-white/85 hover:text-cyan-200 hover:bg-white/5 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={18} strokeWidth={1.75} />
                  </Link>
                )}
                {githubHref && (
                  <Link
                    href={githubHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md p-1.5 text-white/85 hover:text-cyan-200 hover:bg-white/5 transition-colors"
                    aria-label="GitHub"
                  >
                    <Github size={18} strokeWidth={1.75} />
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

