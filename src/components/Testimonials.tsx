"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { profile } from "@/content/profile";

type Testimonial = {
  app?: string;
  name?: string;
  role?: string;
  quote?: string;
  before?: ReadonlyArray<string>;
  after?: ReadonlyArray<string>;
  beforeTitle?: string;
  afterTitle?: string;
  diff?: {
    before?: ReadonlyArray<string>;
    after?: ReadonlyArray<string>;
  };
};

/**
 * Testimonials — Clean 2×2 (No Cards, No Frames)
 *
 * Desktop (lg+):
 *   TL — Text (C. Smith / MyCaddy)
 *   TR — Avatar (smith-avatar.png)   [transparent, free; no bg]
 *   BL — Avatar (waterman-avatar.png)[transparent, free; no bg]
 *   BR — Text (G. Waterman / Best-Bet)
 *
 * Tablet: two rows (text + avatar for pair 1; avatar + text for pair 2)
 * Mobile: each pair stacks (text above avatar) for readability
 */

function TestimonialsComponent() {
  const items = (profile.testimonials ?? []) as ReadonlyArray<Testimonial>;
  if (!Array.isArray(items) || items.length === 0) return null;

  const t0 = items[0];
  const t1 = items[1];

  // If only one testimonial exists, show a simple single-column layout
  if (!t1) {
    return (
      <section
        id="testimonials"
        aria-label="Testimonials"
        className="relative bg-[#0d131d] min-h-[100svh] md:min-h-screen py-24 md:py-32 scroll-mt-24 md:scroll-mt-28 md:snap-start"
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="mb-8 text-2xl font-semibold tracking-wide text-cyan-200">
            Testimonials
          </h2>

          <SinglePair t={t0} />
        </div>
      </section>
    );
  }

  return (
    <section
      id="testimonials"
      aria-label="Testimonials"
      className="relative bg-[#0d131d] min-h-[100svh] md:min-h-screen py-24 md:py-32 scroll-mt-24 md:scroll-mt-28 md:snap-start"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 className="mb-8 text-2xl font-semibold tracking-wide text-cyan-200">
          Testimonials
        </h2>

        {/* 2×2 board, no visible frames */}
        <div
          className={`
            grid gap-8
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-2 lg:auto-rows-fr
          `}
        >
          {/* TL — Text (pair 1) */}
          <TextBlock t={t0} className="order-1 lg:order-1" />

          {/* TR — Avatar (pair 1) */}
          <AvatarFree
            who={t0.name ?? "C. Smith"}
            brand={t0.app}
            src={pickAvatarSrc(t0.name)}
            alt={`Portrait of ${t0.name ?? "C. Smith"}`}
            className="order-2 lg:order-2"
          />

          {/* BL — Avatar (pair 2) */}
          <AvatarFree
            who={t1.name ?? "G. Waterman"}
            brand={t1.app}
            src={pickAvatarSrc(t1.name)}
            alt={`Portrait of ${t1.name ?? "G. Waterman"}`}
            className="order-4 md:order-3 lg:order-3"
          />

          {/* BR — Text (pair 2) */}
          <TextBlock t={t1} className="order-3 md:order-4 lg:order-4" />
        </div>
      </div>
    </section>
  );
}

/* Named export expected by your app and re-exported by components/Testimonials/index.ts */
export function Testimonials() {
  return <TestimonialsComponent />;
}

/* Default export for `import Testimonials from ...` */
export default function DefaultExportedTestimonials() {
  return <TestimonialsComponent />;
}

/* -------------------- Subcomponents -------------------- */

function TextBlock({ t, className }: { t: Testimonial; className?: string }) {
  const before = (t.before ?? t.diff?.before ?? []) as ReadonlyArray<string>;
  const after = (t.after ?? t.diff?.after ?? []) as ReadonlyArray<string>;
  const hasBefore = (before?.length ?? 0) > 0;
  const hasAfter = (after?.length ?? 0) > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={["relative", className ?? ""].join(" ")}
    >
      {/* Header (no frame) */}
      <div className="flex flex-col">
        {t.app ? (
          <div className="font-mono text-[11px] uppercase tracking-widest text-cyan-300/80">
            {t.app}
          </div>
        ) : null}

        <h3 className="mt-1 text-lg font-semibold text-white/90">
          {t.name}
          {t.role ? <span className="text-white/60"> — {t.role}</span> : null}
        </h3>

        {t.quote ? (
          <blockquote className="mt-3 pl-0 text-white/90">
            <span className="text-cyan-200">“</span>
            <span>{t.quote}</span>
            <span className="text-cyan-200">”</span>
          </blockquote>
        ) : null}
      </div>

      {/* Details (inline, no cards) */}
      {(hasBefore || hasAfter) && (
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-300/90">
              {t.beforeTitle ?? "Before"}
            </div>
            {hasBefore ? (
              <ul className="list-disc space-y-1 pl-5 text-sm text-white/85">
                {before.map((b, bi) => (
                  <li key={bi} dangerouslySetInnerHTML={{ __html: b }} />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/60">—</p>
            )}
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-300/90">
              {t.afterTitle ?? "After"}
            </div>
            {hasAfter ? (
              <ul className="list-disc space-y-1 pl-5 text-sm text-white/85">
                {after.map((a, ai) => (
                  <li key={ai} dangerouslySetInnerHTML={{ __html: a }} />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/60">—</p>
            )}
          </div>
        </div>
      )}
    </motion.article>
  );
}

function AvatarFree({
  who,
  brand,
  src,
  alt,
  className,
}: {
  who: string;
  brand?: string;
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={["relative", className ?? ""].join(" ")}
    >
      {/* Transparent PNG only — no background, no border, no frame */}
      <div className="relative mx-auto w-full max-w-[520px]">
        <Image
          src={src}
          alt={alt}
          width={1000}
          height={1400}
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="mx-auto h-auto w-full select-none"
          priority={false}
        />
      </div>

      {/* Minimal label under avatar */}
      <figcaption className="mt-3 text-center">
        <div className="text-sm font-semibold text-white/90">{who}</div>
        {brand ? (
          <div className="text-[11px] uppercase tracking-widest text-cyan-300/80">
            {brand}
          </div>
        ) : null}
      </figcaption>
    </motion.figure>
  );
}

function SinglePair({ t }: { t: Testimonial }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <TextBlock t={t} />
      <AvatarFree
        who={t.name ?? ""}
        brand={t.app}
        src={pickAvatarSrc(t.name)}
        alt={`Portrait of ${t.name ?? "testimonial author"}`}
      />
    </div>
  );
}

/* -------------------- Helpers -------------------- */

/** Map names → avatar files in /public/images/ */
function pickAvatarSrc(name?: string): string {
  const n = (name ?? "").toLowerCase();
  if (n.includes("smith") || n.includes("c. smith")) return "/images/smith-avatar.png";
  if (n.includes("waterman") || n.includes("g. waterman")) return "/images/waterman-avatar.png";
  return "/images/avatar.png"; // your existing default
}
