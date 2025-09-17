"use client";

import * as React from "react";
import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/content/profile";

type RawEdu = {
  institution?: string;
  school?: string;
  degree?: string;
  program?: string;
  years?: string;
  period?: string;
  location?: string;
  summary?: string;
  description?: string;
  coursework?: string[];
  highlights?: string[];
  links?: { label: string; href: string }[];
  hero?: { src: string; alt: string };
  logo?: { src: string; alt: string };
};

type Edu = {
  title: string;          // Institution / School
  sub: string;            // Degree / Program
  years?: string;         // Years / Period
  location?: string;
  summary?: string;
  description?: string;
  coursework?: string[];
  highlights?: string[];
  links?: { label: string; href: string }[];
  hero?: { src: string; alt: string };
  logo?: { src: string; alt: string };
};

function normalizeEdu(e: RawEdu): Edu {
  const title = (e.institution ?? e.school ?? "").toString();
  const sub = (e.degree ?? e.program ?? "").toString();
  const years = (e.years ?? e.period)?.toString();
  return {
    title,
    sub,
    years,
    location: e.location,
    summary: e.summary ?? e.description,
    description: e.description ?? e.summary,
    coursework: Array.isArray(e.coursework) ? e.coursework : undefined,
    highlights: Array.isArray(e.highlights) ? e.highlights : undefined,
    links: Array.isArray(e.links) ? e.links : undefined,
    hero: e.hero,
    logo: e.logo,
  };
}

export default function Education() {
  const raw = ((profile as any)?.education ?? []) as RawEdu[];
  const items = useMemo(() => raw.map(normalizeEdu), [raw]);
  const [active, setActive] = useState<number | null>(null);

  const onKey = useCallback(
    (e: React.KeyboardEvent, i: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setActive((prev) => (prev === i ? null : i));
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActive((prev) => {
          const next = prev == null ? i : Math.min((prev ?? i) + 1, items.length - 1);
          return next;
        });
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActive((prev) => {
          const next = prev == null ? i : Math.max((prev ?? i) - 1, 0);
          return next;
        });
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setActive(null);
      }
    },
    [items.length]
  );

  return (
    <section
      id="education"
      className="relative py-20 bg-[#0d131d] text-white"
      aria-label="Education"
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 text-center">Education</h2>

        {/* Free-flowing, responsive columns using auto-fit + minmax */}
        <div
          className="grid gap-6 md:gap-8"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {items.map((edu, i) => {
            const isActive = active === i;
            const numberLabel = `(${i + 1})`;

            // Use provided hero; otherwise safe fallback.
            const heroSrc = edu.hero?.src ?? "/images/portfolio-basics-avatar.png";
            const heroAlt =
              edu.hero?.alt ?? `${edu.title || "Education"} — ${edu.sub || ""}`.trim();

            return (
              <motion.article
                key={`${edu.title}-${i}`}
                layout
                className={[
                  "relative rounded-2xl ring-1 ring-white/10 bg-white/5 overflow-hidden",
                  "focus-within:ring-2 focus-within:ring-white/30",
                  // Expanded tile spans more columns on larger screens
                  isActive ? "md:col-span-2 lg:col-span-3" : "col-span-1",
                ].join(" ")}
                aria-label={`${numberLabel} ${edu.title}${edu.sub ? ` — ${edu.sub}` : ""}`}
              >
                {/* Clickable/keyboard-activatable surface */}
                <motion.button
                  type="button"
                  onClick={() => setActive((prev) => (prev === i ? null : i))}
                  onKeyDown={(e) => onKey(e, i)}
                  aria-pressed={isActive}
                  aria-expanded={isActive}
                  className="group block w-full text-left outline-none"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  {/* Hero image with page-turn hover (desktop), number top-left */}
                  <motion.div
                    layout
                    initial={false}
                    whileHover={{
                      rotateY: 6,
                      scale: 1.02,
                    }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="relative transform-gpu"
                    // Respect reduced motion
                    style={{
                      perspective: 1000,
                    }}
                  >
                    <div
                      className="w-full"
                      style={{
                        aspectRatio: "3 / 4",
                      }}
                    >
                      <img
                        src={heroSrc}
                        alt={heroAlt}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover select-none"
                      />
                      {/* Bottom gradient for text legibility */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />
                    </div>

                    {/* Top-left number (text only) */}
                    <div className="absolute left-3 top-3 text-sm md:text-base font-medium text-white/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                      {numberLabel}
                    </div>

                    {/* Optional top-left logo, slightly below number (if provided) */}
                    {edu.logo?.src ? (
                      <img
                        src={edu.logo.src}
                        alt={edu.logo.alt ?? `${edu.title} logo`}
                        className="absolute left-3 top-8 h-6 w-auto opacity-80"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}

                    {/* Caption (title / sub / years) pinned to bottom-left of hero */}
                    <div className="absolute left-4 bottom-3 right-4">
                      <div className="text-sm md:text-base font-semibold leading-tight">
                        {edu.title}
                      </div>
                      {edu.sub ? (
                        <div className="text-xs md:text-sm text-white/80 leading-tight">
                          {edu.sub}
                        </div>
                      ) : null}
                      {edu.years ? (
                        <div className="text-[11px] md:text-xs text-white/60 leading-tight">
                          {edu.years}
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                </motion.button>

                {/* Expanded details */}
                <AnimatePresence initial={false}>
                  {isActive ? (
                    <motion.div
                      key="details"
                      layout
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "tween", duration: 0.28 }}
                      className="px-4 md:px-6 pb-5 md:pb-6 pt-3 md:pt-4"
                    >
                      {/* Summary / description */}
                      {edu.summary ? (
                        <p className="text-[13px] md:text-sm text-white/85 leading-relaxed mb-3">
                          {edu.summary}
                        </p>
                      ) : null}

                      {/* Coursework */}
                      {Array.isArray(edu.coursework) && edu.coursework.length > 0 ? (
                        <div className="mb-3">
                          <h4 className="text-xs uppercase tracking-wide text-white/60 mb-1.5">
                            Coursework
                          </h4>
                          <ul className="list-disc list-inside text-[13px] md:text-sm text-white/85 space-y-1">
                            {edu.coursework.slice(0, 8).map((c) => (
                              <li key={c} className="break-words">
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {/* Highlights */}
                      {Array.isArray(edu.highlights) && edu.highlights.length > 0 ? (
                        <div className="mb-3">
                          <h4 className="text-xs uppercase tracking-wide text-white/60 mb-1.5">
                            Highlights
                          </h4>
                          <ul className="list-disc list-inside text-[13px] md:text-sm text-white/85 space-y-1">
                            {edu.highlights.slice(0, 8).map((h) => (
                              <li key={h} className="break-words">
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {/* Links / CTAs */}
                      {Array.isArray(edu.links) && edu.links.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {edu.links.map((l) => (
                            <a
                              key={`${edu.title}-${l.href}`}
                              href={l.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[12px] md:text-sm px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 transition-colors"
                            >
                              {l.label ?? "Open"}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
