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
  about?: string;
  overview?: string;
  notes?: string;
  details?: string;
  coursework?: string[];
  courses?: string[];
  classes?: string[];
  modules?: string[];
  highlights?: string[];
  achievements?: string[];
  awards?: string[];
  certificates?: string[];
  links?: { label: string; href: string }[];
  hero?: { src: string; alt: string };
  logo?: { src: string; alt: string };
  gpa?: string | number;
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
}: {
  params: { slug: string };
}) {
  const raw = ((profile as any)?.education ?? []) as RawEdu[];

  const items = useMemo(() => {
    return raw.map((e) => {
      const title = (e.institution ?? e.school ?? "").toString();
      const sub = (e.degree ?? e.program ?? "").toString();
      const years = (e.years ?? e.period)?.toString();
      const slug = slugify(`${title} ${sub}`);

      // Flexible text mapping for “Overview”
      const overviewText =
        e.summary ??
        e.description ??
        e.overview ??
        e.about ??
        e.details ??
        e.notes ??
        "";

      // Flexible array mapping for coursework/highlights
      const coursework =
        e.coursework ??
        e.courses ??
        e.classes ??
        e.modules ??
        [];

      const highlights =
        e.highlights ??
        e.achievements ??
        e.awards ??
        e.certificates ??
        [];

      const heroSrc = e.hero?.src ?? resolveHeroFromTitle(title);
      const heroAlt =
        e.hero?.alt ?? (title && sub ? `${title} — ${sub}` : title || "Education");

      return {
        slug,
        title,
        sub,
        years,
        location: e.location,
        gpa: e.gpa,
        overviewText,
        coursework: Array.isArray(coursework) ? coursework : [],
        highlights: Array.isArray(highlights) ? highlights : [],
        links: Array.isArray(e.links) ? e.links : [],
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
      <div className="max-w-6xl mx-auto px-6">

        {/* Back link */}
        <div className="mb-6">
          <Link href="/#education" className="text-white/80 hover:underline">
            ← Back to Education
          </Link>
        </div>

        {/* Header: number + title */}
        <div className="mb-6 flex items-baseline gap-3">
          <div className="text-base md:text-lg font-medium text-white/80">
            ({idx + 1})
          </div>
          <h1 className="text-xl md:text-3xl font-semibold">
            {edu.title}
            {edu.sub ? <span className="block md:inline md:ml-2 text-white/85">— {edu.sub}</span> : null}
          </h1>
        </div>

        {/* Two-column layout: image (1/3–1/2) + details */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Image column */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 bg-black/20">
              <div className="relative w-full" style={{ aspectRatio: "4 / 5" }}>
                <img
                  src={edu.heroSrc}
                  alt={edu.heroAlt}
                  className="absolute inset-0 w-full h-full object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
            {/* Meta chips */}
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {edu.years ? (
                <span className="px-2 py-0.5 rounded-full bg-white/10">{edu.years}</span>
              ) : null}
              {edu.location ? (
                <span className="px-2 py-0.5 rounded-full bg-white/10">{edu.location}</span>
              ) : null}
              {edu.gpa ? (
                <span className="px-2 py-0.5 rounded-full bg-white/10">GPA: {edu.gpa}</span>
              ) : null}
            </div>
          </div>

          {/* Details column */}
          <div className="lg:col-span-7 xl:col-span-8">
            {/* Overview */}
            {edu.overviewText ? (
              <div className="mb-8">
                <h2 className="text-lg md:text-xl font-semibold mb-2">Overview</h2>
                <p className="text-white/85 leading-relaxed">
                  {edu.overviewText}
                </p>
              </div>
            ) : null}

            {/* Coursework */}
            {edu.coursework.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-lg md:text-xl font-semibold mb-2">Coursework</h2>
                <ul className="list-disc list-inside text-white/85 space-y-1">
                  {edu.coursework.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Highlights */}
            {edu.highlights.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-lg md:text-xl font-semibold mb-2">Highlights</h2>
                <ul className="list-disc list-inside text-white/85 space-y-1">
                  {edu.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Links */}
            {edu.links.length > 0 ? (
              <div className="mb-2">
                <h2 className="text-lg md:text-xl font-semibold mb-2">Links</h2>
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
                    </a
