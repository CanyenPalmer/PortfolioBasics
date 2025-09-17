"use client";

import * as React from "react";
import Link from "next/link";
import { profile } from "@/content/profile";
import { slugify } from "@/lib/slug";
import { Playfair_Display, Outfit } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type RawEdu = {
  institution?: string;
  school?: string;
  degree?: string;
  program?: string;
  years?: string;
  period?: string;
  location?: string;

  // Text fields
  summary?: string;
  description?: string;
  overview?: string;
  about?: string;

  // Lists
  coursework?: string[];
  classes?: string[];
  courses?: string[];
  modules?: string[];
  curriculum?: string[];
  keyCourses?: string[];

  highlights?: string[];
  achievements?: string[];
  awards?: string[];
  certifications?: string[];
  recognition?: string[];
  milestones?: string[];

  details?: string[] | string;
  notes?: string[] | string;
  bullets?: string[] | string;
  keyPoints?: string[] | string;
  outcomes?: string[] | string;

  links?: { label: string; href: string }[];
  ctaLinks?: { label: string; href: string }[];

  hero?: { src: string; alt: string };
  logo?: { src: string; alt: string };
};

type Edu = {
  slug: string;
  title: string;
  sub: string;
  years?: string;
  location?: string;
  summary?: string;
  coursework?: string[];
  highlights?: string[];
  extraBullets?: string[];
  links?: { label: string; href: string }[];
  heroSrc: string;
  heroAlt: string;
};

function resolveHeroFromTitle(title: string): string {
  const t = (title || "").toLowerCase();
  if (t.includes("ball state")) return "/images/ball-state.png";
  if (t.includes("google")) return "/images/google.png";
  if (t.includes("greenfield")) return "/images/greenfield-central.png";
  if (t.includes("pittsburgh") || t.includes("pitt")) return "/images/pitt.png";
  return "/images/portfolio-basics-avatar.png";
}

function firstNonEmptyString(...vals: Array<unknown>): string | undefined {
  for (const v of vals) {
    if (v == null) continue;
    const s = Array.isArray(v) ? v.join(" ").trim() : String(v).trim();
    if (s) return s;
  }
  return undefined;
}

function toStringArray(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.map((x) => String(x)).filter(Boolean);
  const s = String(v).trim();
  return s ? [s] : [];
}

function mergeUnique(...lists: Array<unknown>): string[] | undefined {
  const out = new Set<string>();
  for (const list of lists) {
    for (const item of toStringArray(list)) {
      if (item) out.add(item);
    }
  }
  return out.size ? Array.from(out) : undefined;
}

/** Normalizer that tolerates different key names in profile.education */
function normalize(raw: RawEdu): Edu {
  const title = firstNonEmptyString(raw.institution, raw.school) ?? "";
  const sub = firstNonEmptyString(raw.degree, raw.program) ?? "";
  const years = firstNonEmptyString(raw.years, raw.period);
  const slug = slugify(`${title} ${sub}`);

  const heroSrc = raw.hero?.src ?? resolveHeroFromTitle(title);
  const heroAlt =
    raw.hero?.alt ??
    (title && sub ? `${title} — ${sub}` : title || "Education");

  const summary = firstNonEmptyString(
    raw.summary,
    raw.description,
    raw.overview,
    raw.about
  );

  const coursework =
    mergeUnique(
      raw.coursework,
      raw.classes,
      raw.courses,
      raw.modules,
      raw.curriculum,
      raw.keyCourses
    ) ?? undefined;

  const highlights =
    mergeUnique(
      raw.highlights,
      raw.achievements,
      raw.awards,
      raw.certifications,
      raw.recognition,
      raw.milestones
    ) ?? undefined;

  const extraBullets =
    mergeUnique(raw.details, raw.notes, raw.bullets, raw.keyPoints, raw.outcomes) ??
    undefined;

  const links =
    (Array.isArray(raw.links) && raw.links) ||
    (Array.isArray(raw.ctaLinks) && raw.ctaLinks) ||
    undefined;

  return {
    slug,
    title,
    sub,
    years,
    location: raw.location,
    summary,
    coursework,
    highlights,
    extraBullets,
    links,
    heroSrc,
    heroAlt,
  };
}

/** Section header used on the detail page */
function EducationHeader() {
  return (
    <div className="mb-10 md:mb-14">
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

export default function EducationDetail({
  params,
}: {
  params: { slug: string };
}) {
  const raw = ((profile as any)?.education ?? []) as RawEdu[];
  const items: Edu[] = React.useMemo(() => raw.map(normalize), [raw]);

  const idx = items.findIndex((it) => it.slug === params.slug);
  const edu = items[idx];

  if (!edu) {
    return (
      <section className="relative min-h-screen py-20 bg-[#0d131d] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-semibold mb-4">Education not found</h1>
          <Link href="/#education" className="underline">
            Back to Education
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen py-14 md:py-20 bg-[#0d131d] text-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Oversized header to match the section */}
        <EducationHeader />

        {/* Back link */}
        <div className="mb-6">
          <Link href="/#education" className="text-white/80 hover:underline">
            ← Back to Education
          </Link>
        </div>

        {/* Institution header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
            {edu.title}
          </h1>
          {edu.sub ? (
            <p className="text-white/85 text-base md:text-lg">{edu.sub}</p>
          ) : null}
          {(edu.years || edu.location) && (
            <div className="text-sm text-white/65">
              {edu.years ? <span>{edu.years}</span> : null}
              {edu.years && edu.location ? <span className="mx-2">•</span> : null}
              {edu.location ? <span>{edu.location}</span> : null}
            </div>
          )}
        </div>

        {/* Layout: image (≈1/3–1/2) + details */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Image column (≈5/12) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10">
              {/* Number in top-left */}
              <div className="absolute left-4 top-4 z-10 text-base md:text-lg font-medium text-white/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                ({idx + 1})
              </div>
              {/* Image shown in FULL (contain) with responsive max height */}
              <div className="w-full flex items-center justify-center bg-transparent">
                <img
                  src={edu.heroSrc}
                  alt={edu.heroAlt}
                  className="w-full h-auto max-h-[70vh] object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          {/* Details column (≈7/12) */}
          <div className="lg:col-span-7">
            {/* Overview / summary */}
            {edu.summary ? (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Overview</h2>
                <p className="text-white/85 leading-relaxed">{edu.summary}</p>
              </div>
            ) : null}

            {/* Coursework */}
            {Array.isArray(edu.coursework) && edu.coursework.length > 0 ? (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Coursework</h2>
                <ul className="list-disc list-inside text-white/85 space-y-1">
                  {edu.coursework.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Highlights */}
            {Array.isArray(edu.highlights) && edu.highlights.length > 0 ? (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Highlights</h2>
                <ul className="list-disc list-inside text-white/85 space-y-1">
                  {edu.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Extra details (details/notes/bullets/etc.) */}
            {Array.isArray(edu.extraBullets) && edu.extraBullets.length > 0 ? (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Details</h2>
                <ul className="list-disc list-inside text-white/85 space-y-1">
                  {edu.extraBullets.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Links */}
            {Array.isArray(edu.links) && edu.links.length > 0 ? (
              <div className="mb-2">
                <h2 className="text-lg font-semibold mb-2">Links</h2>
                <div className="flex flex-wrap gap-2">
                  {edu.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 transition-colors text-sm"
                    >
                      {l.label ?? "Open"}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
