"use client";

import * as React from "react";
import TransitionLink from "@/components/TransitionLink";
import { profile } from "@/content/profile";
import { slugify } from "@/lib/slug";
import { Playfair_Display, Outfit, Plus_Jakarta_Sans } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"], // for light style
});

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
  const t = title.toLowerCase();
  if (t.includes("ball state")) return "/images/ball-state.png";
  if (t.includes("google")) return "/images/google.png";
  if (t.includes("greenfield")) return "/images/greenfield-central.png";
  if (t.includes("pittsburgh") || t.includes("pitt")) return "/images/pitt.png";
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

/** Section header: Oversized serif wordmark + underline + subheader */
function EducationHeader() {
  return (
    <div className="mb-12 md:mb-16">
      <div className={`${playfair.className} leading-none tracking-tight`}>
        <h2 className="text-[12vw] sm:text-7xl md:text-8xl lg:text-9xl font-bold">
          EDUCATION
        </h2>
      </div>
      <div className="mt-2 h-[2px] w-full bg-white/20" />
      <div className={`${outfit.className} mt-3 text-sm md:text-base text-white/85`}>
        Diplomas • Degrees • Certifications
      </div>
    </div>
  );
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
    <TransitionLink
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
    </TransitionLink>
  );
}

export default function Education() {
  const raw = ((profile as any)?.education ?? []) as RawEdu[];
  const items: Edu[] = React.useMemo(() => raw.map(normalizeEdu), [raw]);

  return (
    <section
      id="education"
      className="relative py-20 bg-[#0d131d] text-white overflow-x-hidden"
      aria-label="Education"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header — unchanged */}
        <EducationHeader />

        {/* Wrapper lets us position the blurb without shrinking the collection */}
        <div className="relative">
          {/* Blurb: top-left at lg+, does NOT consume grid width */}
          <div className="hidden lg:block absolute left-0 top-0 w-[20%] -ml-4">
            <p
              className={`${plusJakarta.className} text-lg sm:text-xl font-light text-gray-400 tracking-wide lowercase max-w-md`}
            >
              My educational journey reflects a mix of foundational trainings, professional certifications, and advanced graduate studies
            </p>
          </div>

          {/* Collection: full original size; shifted right visually at lg+ */}
          <div className="transform lg:translate-x-[22%] will-change-transform">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 overflow-hidden">
              {items.map((edu, i) => (
                <div
                  key={`${edu.slug}-${i}`}
                  className="bg-white/5 relative"
                >
                  <Tower idx={i} edu={edu} />
                </div>
              ))}
            </div>
          </div>

          {/* Optional right spacer look at lg+ (visual 1/5), not consuming width */}
          <div className="hidden lg:block absolute right-0 top-0 w-[20%] h-px" />
        </div>
      </div>
    </section>
  );
}
