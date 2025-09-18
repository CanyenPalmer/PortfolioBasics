"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
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
 * Changes (only what was requested in this step):
 * - Banner text repeats with dot spacers, travels top→bottom across the full section, and fades smoothly.
 * - Removed residual right-side white bar by clipping horizontal overflow at the section.
 * - Kept the larger, tall/narrow/blocky text sizing from previous fix.
 */

function TestimonialsComponent() {
  const items = (profile.testimonials ?? []) as ReadonlyArray<Testimonial>;
  if (!Array.isArray(items) || items.length === 0) return null;

  const t0 = items[0];
  const t1 = items[1];

  if (!t1) {
    return (
      <section
        id="testimonials"
        aria-label="Testimonials"
        className="relative bg-[#0b1016] min-h-[100svh] md:min-h-screen py-24 md:py-32 scroll-mt-24 md:scroll-mt-28 md:snap-start overflow-x-hidden"
      >
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Semantic heading for SR; visually hidden since banner is the visual title */}
          <h2 className="sr-only">Testimonials</h2>

          {/* 2-col layout with left rail banner */}
          <div className="grid grid-cols-[64px,1fr] gap-6 md:grid-cols-[80px,1fr]">
            <BannerRail />

            <div className="space-y-20">
              {/* Pair 1 — C. Smith / MyCaddy (text left, avatar right) */}
              <SinglePair t={t0} reverse={false} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="testimonials"
      aria-label="Testimonials"
      className="relative bg-[#0b1016] min-h-[100svh] md:min-h-screen py-24 md:py-32 scroll-mt-24 md:scroll-mt-28 md:snap-start overflow-x-hidden"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Semantic heading for SR; visually hidden since banner is the visual title */}
        <h2 className="sr-only">Testimonials</h2>

        {/* 2-col layout with left rail banner */}
        <div className="grid grid-cols-[64px,1fr] gap-6 md:grid-cols-[80px,1fr]">
          <BannerRail />

          <div className="space-y-20">
            {/* Pair 1 — C. Smith / MyCaddy (text left, avatar right) */}
            <SinglePair t={t0} reverse={false} />

            {/* Pair 2 — G. Waterman / Best-Bet (avatar left, text right) */}
            <SinglePair t={t1} reverse />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return <TestimonialsComponent />;
}

export default function DefaultExportedTestimonials() {
  return <TestimonialsComponent />;
}

/* -------------------- Left Rail Banner -------------------- */

/**
 * Implementation notes for THIS revision:
 * - Made the rail span the full column height (not sticky) so the banner travels from the section top to bottom.
 * - overflow-hidden keeps it from creating internal or page scrollbars.
 * - A smooth mask fades the text at the top and just before the bottom to avoid a hard edge.
 * - Animation runs top→bottom and loops; the jump happens fully out of view, hidden by the mask.
 */
function BannerRail() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={[
        "relative",
        "pointer-events-none",
        "hidden sm:block",
        "h-full",           // span full section column height
        "z-10",
        "overflow-hidden",  // no internal/page scrollbars
      ].join(" ")}
      aria-hidden="true"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 6%, rgba(0,0,0,1) 94%, rgba(0,0,0,0) 100%)",
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 6%, rgba(0,0,0,1) 94%, rgba(0,0,0,0) 100%)",
      }}
    >
      <motion.div
        initial={{ y: "-8%" }} // start slightly above the masked region
        animate={
          reduceMotion
            ? { y: 0 }
            : { y: "108%" } // glide to just below the bottom mask edge
        }
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 42,  // slow/ambient
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }
        }
        className="absolute inset-0 will-change-transform"
        style={{ translateZ: 0 }}
      >
        {/* Single tall stack; the loop resets off-screen thanks to the mask */}
        <div className="flex min-h-[200%] flex-col items-center justify-start">
          <BannerText />
          <div className="h-40" />
          <BannerText />
          <div className="h-40" />
          <BannerText />
          <div className="h-40" />
          <BannerText />
        </div>
      </motion.div>
    </div>
  );
}

function BannerText() {
  // Repeated label with dot spacers; vertical writing keeps the tall/narrow look.
  const line =
    "TESTIMONIALS · VOICES · REVIEWS · TESTIMONIALS · VOICES · REVIEWS · TESTIMONIALS · VOICES · REVIEWS";

  return (
    <div
      className={[
        "select-none",
        "font-semibold",
        "tracking-[0.05em]",
        "text-transparent",
        "bg-clip-text",
        "bg-gradient-to-b",
        "from-cyan-200/90 via-white/60 to-white/20",
        "opacity-85",
        "[writing-mode:vertical-rl]",
        "[text-orientation:mixed]",
        "leading-[1.04]",
        "text-[32px] md:text-[40px]",
      ].join(" ")}
      style={{ letterSpacing: "0.02em" }}
    >
      <span className="block">{line}</span>
    </div>
  );
}

/* -------------------- Subcomponents -------------------- */

function SinglePair({ t, reverse }: { t: Testimonial; reverse?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={`flex flex-col gap-8 md:gap-12 lg:gap-16 ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } md:items-center`}
    >
      <AvatarFree
        who={t.name ?? ""}
        brand={t.app}
        src={pickAvatarSrc(t.name)}
        alt={`Portrait of ${t.name ?? "testimonial author"}`}
        className="md:w-1/2 lg:w-5/12"
      />
      <TextBlock t={t} className="md:w-1/2 lg:w-7/12" />
    </motion.div>
  );
}

function TextBlock({ t, className }: { t: Testimonial; className?: string }) {
  const before = (t.before ?? t.diff?.before ?? []) as ReadonlyArray<string>;
  const after = (t.after ?? t.diff?.after ?? []) as ReadonlyArray<string>;
  const hasBefore = (before?.length ?? 0) > 0;
  const hasAfter = (after?.length ?? 0) > 0;

  return (
    <div className={["flex flex-col justify-center", className ?? ""].join(" ")}>
      {t.app ? (
        <div className="font-mono text-[12px] md:text-[13px] uppercase tracking-widest text-cyan-300/80">
          {t.app}
        </div>
      ) : null}

      {/* Taller, narrower, blockier title */}
      <h3 className="mt-1 text-2xl md:text-3xl font-semibold text-white/90 leading-tight tracking-tight">
        {t.name}
        {t.role ? <span className="text-white/60"> — {t.role}</span> : null}
      </h3>

      {t.quote ? (
        <blockquote className="mt-4 text-xl md:text-2xl text-white/90 leading-tight tracking-tight">
          <span className="text-cyan-200">“</span>
          <span>{t.quote}</span>
          <span className="text-cyan-200">”</span>
        </blockquote>
      ) : null}

      {(hasBefore || hasAfter) && (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-xs md:text-sm font-semibold uppercase tracking-wide text-rose-300/90">
              {t.beforeTitle ?? "Before"}
            </div>
            {hasBefore ? (
              <ul className="list-disc space-y-1 pl-5 text-base md:text-lg text-white/85 leading-snug tracking-tight">
                {before.map((b, bi) => (
                  <li key={bi} dangerouslySetInnerHTML={{ __html: b }} />
                ))}
              </ul>
            ) : (
              <p className="text-base md:text-lg text-white/60 leading-snug tracking-tight">—</p>
            )}
          </div>

          <div>
            <div className="mb-2 text-xs md:text-sm font-semibold uppercase tracking-wide text-emerald-300/90">
              {t.afterTitle ?? "After"}
            </div>
            {hasAfter ? (
              <ul className="list-disc space-y-1 pl-5 text-base md:text-lg text-white/85 leading-snug tracking-tight">
                {after.map((a, ai) => (
                  <li key={ai} dangerouslySetInnerHTML={{ __html: a }} />
                ))}
              </ul>
            ) : (
              <p className="text-base md:text-lg text-white/60 leading-snug tracking-tight">—</p>
            )}
          </div>
        </div>
      )}
    </div>
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
    <figure className={["relative", className ?? ""].join(" ")}>
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
      <figcaption className="mt-3 text-center">
        <div className="text-sm font-semibold text-white/90">{who}</div>
        {brand ? (
          <div className="text-[11px] uppercase tracking-widest text-cyan-300/80">
            {brand}
          </div>
        ) : null}
      </figcaption>
    </figure>
  );
}

/* -------------------- Helpers -------------------- */

function pickAvatarSrc(name?: string): string {
  const n = (name ?? "").toLowerCase();
  if (n.includes("smith") || n.includes("c. smith")) return "/images/smith-avatar.png";
  if (n.includes("waterman") || n.includes("g. waterman")) return "/images/waterman-avatar.png";
  return "/images/avatar.png";
}

/*ignore*/ 
