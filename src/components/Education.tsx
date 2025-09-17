"use client";

import * as React from "react";
import Link from "next/link";
import { profile } from "@/content/profile";
import { slugify } from "@/lib/slug";

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
  title: string;     // Institution / School
  sub: string;       // Degree / Program
  years?: string;
  location?: string;
  summary?: string;
  description?: string;
  coursework?: string[];
  highlights?: string[];
  links?: { label: string; href: string }[];
  heroSrc: string;   // resolved from provided hero or filename mapping
  heroAlt: string;
  slug: string;      // slugify(title + sub)
};

function resolveHeroFromTitle(title: string): string {
  // Map your filenames to institutions (fallbacks if hero not provided in content)
  const t = title.toLowerCase();
  if (t.includes("ball state")) return "/images/ball-state.png";
  if (t.includes("google")) return "/images/google.png";
  if (t.includes("greenfield")) return "/images/greenfield-central.png";
  if (t.includes("pittsburgh") || t.includes("pitt")) return "/images/pitt.png";
  // fallback (uses your site avatar placeholder)
  return "/images/portfolio-basics-avatar.png";
}

function normalizeEdu(e: RawEdu): Edu {
  const title = (e.institution ?? e.school ?? "").toString();
  const sub = (e.degree ?? e.program ?? "").toString();
  const years = (e.years ?? e.period)?.toString();
  const heroSrc = e.hero?.src ?? resolveHeroFromTitle(title);
  const heroAlt =
    e.hero?.alt ?? (title && sub ? `${title} — ${sub}` : title || "Education");

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
    heroSrc,
    heroAlt,
    slug: slugify(`${title} ${sub}`),
  };
}

/** Single tall tower with hover-pan image that follows the cursor. */
function Tower({
  idx,
  edu,
}: {
  idx: number;
  edu: Edu;
}) {
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const frameRef = React.useRef<number | null>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLDivElement;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;  // 0..1
    const y = (e.clientY - rect.top) / rect.height;  // 0..1

    // Translate image subtly toward the cursor (max ~8px)
    const max = 8;
    const tx = (x - 0.5) * max * 2;
    const ty = (y - 0.5) * max * 2;

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      if (imgRef.current) {
        imgRef.current.style.transform = `scale(1.05) translate(${tx.toFixed(
          1
        )}px, ${ty.toFixed(1)}px)`;
      }
    });
  };

  const onMouseLeave = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (imgRef.current) {
      imgRef.current.style.transform = "scale(1.02) translate(0px, 0px)";
    }
  };

  return (
    <Link
      href={`/education/${edu.slug}?via=education`}
      className="group block focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent"
      onClick={() => {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("cameFromEducation", "1");
        }
      }}
      aria-label={`(${idx + 1}) ${edu.title}${edu.sub ? ` — ${edu.sub}` : ""}`}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "3 / 5" }} // tall tower
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* Image (full bleed) */}
        <img
          ref={imgRef}
          src={edu.heroSrc}
          alt={edu.heroAlt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: "scale(1.02)" }}
        />

        {/* Top-left number (plain text) */}
        <div className="absolute left-3 top-3 text-sm md:text-base font-medium text-white/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
          ({idx + 1})
        </div>

        {/* Bottom gradient for text legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Caption at bottom-left */}
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
      </div>
    </Link>
  );
}

export default function Education() {
  const raw = ((profile as any)?.education ?? []) as RawEdu[];
  const items: Edu[] = React.useMemo(() => raw.map(normalizeEdu), [raw]);

  return (
    <section
      id="education"
      className="relative py-20 bg-[#0d131d] text-white"
      aria-label="Education"
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 text-center">Education</h2>

        {/* Four tall towers that sit together as one clean block */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 rounded-2xl overflow-hidden ring-1 ring-white/10">
          {items.map((edu, i) => (
            <div
              key={`${edu.slug}-${i}`}
              className="bg-white/5 ring-1 ring-white/10 relative"
              // join seams: remove inner rings on shared edges for a seamless block
              style={{}}
            >
              <Tower idx={i} edu={edu} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
