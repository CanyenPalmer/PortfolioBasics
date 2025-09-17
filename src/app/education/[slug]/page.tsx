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
  details?: string | string[];
  coursework?: string[];
  classes?: string[];
  modules?: string[];
  highlights?: string[];
  notes?: string | string[];
  links?: { label: string; href: string }[];
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
  description?: string;
  coursework?: string[];
  highlights?: string[];
  extraBullets?: string[]; // merged details/notes/classes/modules (if present)
  links?: { label: string; href: string }[];
  heroSrc: string;
  heroAlt: string;
};

function resolveHeroFromTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("ball state")) return "/images/ball-state.png";
  if (t.includes("google")) return "/images/google.png";
  if (t.includes("greenfield")) return "/images/greenfield-central.png";
  if (t.includes("pittsburgh") || t.includes("pitt")) return "/images/pitt.png";
  return "/images/portfolio-basics-avatar.png";
}

function toArray(maybe: unknown): string[] | undefined {
  if (!maybe) return undefined;
  if (Array.isArray(maybe)) return maybe.map(String).filter(Boolean);
  const s = String(maybe).trim();
  return s ? [s] : undefined;
}

function normalize(raw: RawEdu): Edu {
  const title = (raw.institution ?? raw.school ?? "").toString();
  const sub = (raw.degree ?? raw.program ?? "").toString();
  const years = (raw.years ?? raw.period)?.toString();
  const slug = slugify(`${title} ${sub}`);

  const heroSrc = raw.hero?.src ?? resolveHeroFromTitle(title);
  const heroAlt =
    raw.hero?.alt ?? (title && sub ? `${title} — ${sub}` : title || "Education");

  // Coursework can be under various keys
  const coursework =
    (Array.isArray(raw.coursework) && raw.coursework) ||
    (Array.isArray(raw.classes) && raw.classes) ||
    (Array.isArray(raw.modules) && raw.modules) ||
    undefined;

  // Highlights as-is
  const highlights = Array.isArray(raw.highlights) ? raw.highlights : undefined;

  // Collect any extra bullet-like content
  const extraBullets = [
    ...(toArray(raw.details) ?? []),
    ...(toArray(raw.notes) ?? []),
  ];
  const mergedExtras = extraBullets.length ? extraBullets : undefined;

  return {
    slug,
    title,
    sub,
    years,
    location: raw.location,
    summary: raw.summary ?? raw.description,
    description: raw.description ?? raw.summary,
    coursework,
    highlights,
    extraBullets: mergedExtras,
    links: Array.isArray(raw.links) ? raw.links : undefined,
    heroSrc,
    heroAlt,
  };
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
      <section className="relative py-20 bg-[#0d131d] text-white">
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
    <section className="relative py-14 md:py-20 bg-[#0d131d] text-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back link */}
        <div className="mb-6">
          <Link href="/#education" className="text-white/80 hover:underline">
            ← Back to Education
          </Link>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
            {edu.title}
          </h1>
          {edu.sub ? (
            <p className="text-white/85 text-base md:text-lg">{edu.sub}</p>
          ) : null}
          <div className="text-sm text-white/65">
            {edu.years ? <span>{edu.years}</span> : null}
            {edu.years && edu.location ? <span className="mx-2">•</span> : null}
            {edu.location ? <span>{edu.location}</span> : null}
          </div>
        </div>

        {/* Layout: image (≈1/3–1/2) + details */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Image column */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 bg-black/20">
              {/* number in top-left */}
              <div className="absolute left-4 top-4 z-10 text-base md:text-lg font-medium text-white/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                ({idx + 1})
              </div>
              {/* image shown in FULL (contain) with sensible max height */}
              <div className="w-full flex items-center justify-center">
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

          {/* Details column */}
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

            {/* Extra details (details/notes/classes/modules merged) */}
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
