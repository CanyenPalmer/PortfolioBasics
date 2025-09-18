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
 * THIS REV — ONLY YOUR REQUESTS:
 * - Seamless loop now includes a “node” spacer at the seam (line ends with " ·").
 * - Both runs are identical gray (no gradient/opacity shift).
 * - Hide ALL scrollbars site-wide (Firefox + WebKit/Chromium) via a scoped global style here.
 */

function TestimonialsComponent() {
  const items = (profile.testimonials ?? []) as ReadonlyArray<Testimonial>;
  if (!Array.isArray(items) || items.length === 0) return null;

  const t0 = items[0];
  const t1 = items[1];

  // GLOBAL scrollbar hider (applies across the whole app)
  const GlobalScrollbarHider = () => (
    <style jsx global>{`
      /* Hide scrollbar chrome everywhere */
      * {
        scrollbar-width: none !important; /* Firefox */
        -ms-overflow-style: none !important; /* IE/Edge legacy */
      }
      *::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
        background: transparent !important;
      }
      *::-webkit-scrollbar-thumb {
        background: transparent !important;
        border: none !important;
      }
      *::-webkit-scrollbar-track {
        background: transparent !important;
      }
    `}</style>
  );

  if (!t1) {
    return (
      <section
        id="testimonials"
        aria-label="Testimonials"
        className="relative bg-[#0b1016] min-h-[100svh] md:min-h-screen py-24 md:py-32 scroll-mt-24 md:scroll-mt-28 md:snap-start w-full overflow-x-hidden"
      >
        <GlobalScrollbarHider />
        <div className="container mx-auto px-6 max-w-7xl overflow-x-hidden">
          {/* Semantic heading for SR; visually hidden since banner is the visual title */}
          <h2 className="sr-only">Testimonials</h2>

          {/* 2-col layout with left rail banner */}
          <div className="grid grid-cols-[64px,1fr] gap-6 md:grid-cols-[80px,1fr] overflow-x-hidden">
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
      className="relative bg-[#0b1016] min-h-[100svh] md:min-h-screen py-24 md:py-32 scroll-mt-24 md:scroll-mt-28 md:snap-start w-full overflow-x-hidden"
    >
      <GlobalScrollbarHider />
      <div className="container mx-auto px-6 max-w-7xl overflow-x-hidden">
        {/* Semantic heading for SR; visually hidden since banner is the visual title */}
        <h2 className="sr-only">Testimonials</h2>

        {/* 2-col layout with left rail banner */}
        <div className="grid grid-cols-[64px,1fr] gap-6 md:grid-cols-[80px,1fr] overflow-x-hidden">
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
 * BannerRail — isolated, clipped rail with seamless top→bottom loop.
 * - EXACTLY TWO copies (A + A) of one continuous line, back-to-back, no spacing → no gap.
 * - Line now ENDS with a dot node " · " so the seam matches the between-word spacing.
 * - Uniform gray text across both runs for a seamless cycle.
 * - Fixed width + overflow hidden + isolate prevent any overlap or horizontal leak.
 */
function BannerRail() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={[
        "relative isolate",
        "pointer-events-none",
        "hidden sm:block",
        "h-full",
        "z-10",
        "overflow-hidden",
        "w-[64px] md:w-[80px] max-w-[80px]",
      ].join(" ")}
      aria-hidden="true"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, rgba(0,0,0,0) 100%)",
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, rgba(0,0,0,0) 100%)",
      }}
    >
      {/* Track height is the natural height of (A + A). Animate -50% → 0% to move DOWN one-copy height. */}
      <motion.div
        initial={{ y: "-50%" }}
        animate={reduceMotion ? { y: "-50%" } : { y: "0%" }}
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 40,
                ease: "linear",
                repeat: Infinity,
              }
        }
        className="absolute inset-x-0 top-0 will-change-transform"
        style={{ translateZ: 0 }}
      >
        {/* A */}
        <BannerLine />
        {/* A (immediately after; no gap) */}
        <BannerLine />
      </motion.div>
    </div>
  );
}

/** Single continuous line. No stacking, no wrap, uniform gray, with a trailing node. */
function BannerLine() {
  // Add a trailing node " · " so the seam matches inter-word spacing.
  const line =
    "TESTIMONIALS\u00A0·\u00A0VOICES\u00A0·\u00A0REVIEWS\u00A0·";

  return (
    <div
      className={[
        "select-none",
        "font-medium",            // unified weight
        "text-white/70",         // uniform gray tone across copies
        "[writing-mode:vertical-rl]",
        "[text-orientation:mixed]",
        "whitespace-nowrap",
        "break-keep",
        "leading-none",
        "text-[32px] md:text-[40px]",
        "tracking-[0.05em]",
        "m-0",
        "p-0",
      ].join(" ")}
      style={{ letterSpacing: "0.02em", wordBreak: "keep-all" }}
    >
      <span className="inline-block">
        {line}
        {"TESTIMONIALS\u00A0·\u00A0VOICES\u00A0·\u00A0REVIEWS\u00A0·"}
        {"TESTIMONIALS\u00A0·\u00A0VOICES\u00A0·\u00A0REVIEWS\u00A0·"}
      </span>
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
      } md:items-center overflow-x-hidden`}
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
    <div className={["flex flex-col justify-center overflow-x-hidden", className ?? ""].join(" ")}>
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
    <figure className={["relative overflow-x-hidden", className ?? ""].join(" ")}>
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
