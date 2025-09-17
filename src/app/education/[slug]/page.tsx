"use client";

import * as React from "react";
import Link from "next/link";
import { useMemo } from "react";
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

function resolveHeroFromTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("ball state")) return "/images/ball-state.png";
  if (t.includes("google")) return "/images/google.png";
  if (t.includes("greenfield")) return "/images/greenfield-central.png";
  if (t.includes("pittsburgh") || t.includes("pitt")) return "/images/pitt.png";
  return "/images/portfolio-basics-avatar.png";
}

export default function EducationDetail({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const raw = ((profile as any)?.education ?? []) as RawEdu[];

  const items = useMemo(() => {
    return raw.map((e) => {
      const title = (e.institution ?? e.school ?? "").toString();
      const sub = (e.degree ?? e.program ?? "").toString();
      const years = (e.years ?? e.period)?.toString();
      const slug = slugify(`${title} ${sub}`);
      const heroSrc = e.hero?.src ?? resolveHeroFromTitle(title);
      const heroAlt =
        e.hero?.alt ?? (title && sub ? `${title} — ${sub}` : title || "Education");
      return {
        slug,
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
      };
    });
  }, [raw]);

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
      <div className="max-w-5xl mx-auto px-6">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href={typeof window !== "undefined" && window.sessionStorage.getItem("cameFromEducation") ? "/#education" : "/#education"}
            className="text-white/80 hover:underline"
          >
            ← Back to Education
          </Link>
        </div>

        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10">
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            <img
              src={edu.heroSrc}
              alt={edu.heroAlt}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent" />
            {/* Top-left number text (matches gallery order) */}
            <div className="absolute left-4 top-4 text-base md:text-lg font-medium text-white/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
              ({idx + 1})
            </div>
            {/* Title block */}
            <div className="absolute left-5 bottom-4 right-5">
              <h1 className="text-xl md:text-2xl font-semibold leading-tight">
                {edu.title}
              </h1>
              {edu.sub ? (
                <div className="text-sm md:text-base text-white/85 leading-tight">
                  {edu.sub}
                </div>
              ) : null}
              {edu.years ? (
                <div className="text-[12px] md:text-sm text-white/65 leading-tight">
                  {edu.years}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mt-8 space-y-8">
          {edu.summary ? (
            <div>
              <h2 className="text-lg font-semibold mb-2">Overview</h2>
              <p className="text-white/85 leading-relaxed">{edu.summary}</p>
            </div>
          ) : null}

          {Array.isArray(edu.coursework) && edu.coursework.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold mb-2">Coursework</h2>
              <ul className="list-disc list-inside text-white/85 space-y-1">
                {edu.coursework.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {Array.isArray(edu.highlights) && edu.highlights.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold mb-2">Highlights</h2>
              <ul className="list-disc list-inside text-white/85 space-y-1">
                {edu.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {Array.isArray(edu.links) && edu.links.length > 0 ? (
            <div>
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
    </section>
  );
}
