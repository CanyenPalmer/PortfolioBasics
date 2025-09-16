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
 * This version keeps your original flip-card behavior for the two text testimonials
 * and inserts TWO extra grid items that are free-floating avatars (transparent PNGs)
 * sourced from /public/images/smith-avatar.png and /public/images/waterman-avatar.png
 *
 * Layout (lg+):
 *   TL — Text card (C. Smith / MyCaddy)
 *   TR — Avatar (smith-avatar.png)
 *   BL — Avatar (waterman-avatar.png)
 *   BR — Text card (G. Waterman / Best-Bet)
 *
 * Tablet: two rows (text+avatar for pair 1, avatar+text for pair 2)
 * Mobile: stack as text → avatar for each pair
 *
 * If profile.testimonials has more than two items, only the first two are shown
 * in this board; the rest are ignored to keep the composition intentional.
 */

export function Testimonials() {
  const items = (profile.testimonials ?? []) as ReadonlyArray<Testimonial>;
  if (!Array.isArray(items) || items.length === 0) return null;

  // Take the first two as our board content
  const t0 = items[0];
  const t1 = items[1];

  // Guard against missing second item: if only one exists, just render your original list.
  if (!t1) {
    return <LegacyTestimonialsOnly items={items} />;
  }

  // Track flip state per text card (two cards: 0 and 1)
  const [flipped, setFlipped] = React.useState<Record<number, boolean>>({});
  const toggle = (i: number) => setFlipped((s) => ({ ...s, [i]: !s[i] }));

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

        {/* 2×2 board (adds two avatar tiles to your original two flip-cards) */}
        <div
          className={`
            grid gap-6
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-2 lg:auto-rows-fr
          `}
        >
          {/* TL — Text (pair 1) */}
          <FlipCard
            index={0}
            t={t0}
            flipped={!!flipped[0]}
            onToggle={() => {
              const hasDiff =
                (t0.before?.length ?? 0) > 0 ||
                (t0.after?.length ?? 0) > 0 ||
                (t0.diff?.before?.length ?? 0) > 0 ||
                (t0.diff?.after?.length ?? 0) > 0;
              if (hasDiff) toggle(0);
            }}
            className="order-1 lg:order-1"
          />

          {/* TR — Avatar for C. Smith (pair 1) */}
          <AvatarTile
            who={t0.name ?? "C. Smith"}
            brand={t0.app ?? ""}
            // map by name; overrideable if you ever rename
            src={pickAvatarSrc(t0.name)}
            alt={`Portrait of ${t0.name ?? "C. Smith"}`}
            className="order-2 lg:order-2"
          />

          {/* BL — Avatar for G. Waterman (pair 2) */}
          <AvatarTile
            who={t1.name ?? "G. Waterman"}
            brand={t1.app ?? ""}
            src={pickAvatarSrc(t1.name)}
            alt={`Portrait of ${t1.name ?? "G. Waterman"}`}
            className="order-4 md:order-3 lg:order-3"
          />

          {/* BR — Text (pair 2) */}
          <FlipCard
            index={1}
            t={t1}
            flipped={!!flipped[1]}
            onToggle={() => {
              const hasDiff =
                (t1.before?.length ?? 0) > 0 ||
                (t1.after?.length ?? 0) > 0 ||
                (t1.diff?.before?.length ?? 0) > 0 ||
                (t1.diff?.after?.length ?? 0) > 0;
              if (hasDiff) toggle(1);
            }}
            className="order-3 md:order-4 lg:order-4"
          />
        </div>
      </div>
    </section>
  );
}

export default Testimonials;

/* -------------------- Subcomponents -------------------- */

/** Your original flip-card, extracted as a component (unchanged behavior). */
function FlipCard({
  t,
  index,
  flipped,
  onToggle,
  className,
}: {
  t: Testimonial;
  index: number;
  flipped: boolean;
  onToggle: () => void;
  className?: string;
}) {
  const before = (t.before ?? t.diff?.before ?? []) as ReadonlyArray<string>;
  const after = (t.after ?? t.diff?.after ?? []) as ReadonlyArray<string>;
  const hasDiff = (before?.length ?? 0) > 0 || (after?.length ?? 0) > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.03 }}
      className={[
        "rounded-xl border border-cyan-400/10 bg-transparent p-0 isolate",
        className ?? "",
      ].join(" ")}
    >
      {/* Flip container */}
      <div
        className={`flip-3d ${flipped ? "is-flipped" : ""}`}
        onClick={() => hasDiff && onToggle()}
        role={hasDiff ? "button" : undefined}
        aria-pressed={hasDiff ? !!flipped : undefined}
      >
        {/* FRONT */}
        <div className="flip-face rounded-xl ring-1 ring-white/10 bg-black/70 p-5 min-h-80 max-h-[70vh]">
          {t.app && (
            <div className="font-mono text-[11px] uppercase tracking-widest text-cyan-300/80">
              {t.app}
            </div>
          )}
          <h3 className="mt-1 text-lg font-semibold text-white/90">
            {t.name}
            {t.role ? <span className="text-white/60"> — {t.role}</span> : null}
          </h3>

          {t.quote && (
            <blockquote className="mt-3 border-l-2 border-cyan-400/30 pl-4 text-white/85">
              <span className="text-cyan-200">“</span>
              <span>{t.quote}</span>
              <span className="text-cyan-200">”</span>
            </blockquote>
          )}

          {hasDiff ? (
            <div className="mt-4 text-sm text-cyan-300/80">Click to flip ↺</div>
          ) : null}
        </div>

        {/* BACK */}
        {hasDiff ? (
          <div className="flip-back rounded-xl ring-1 ring-white/10 bg-black/70 p-5 min-h-80 max-h-[70vh]">
            <div className="h-full overflow-y-auto pr-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-md border border-cyan-400/10 bg-black/50 p-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-300/90">
                    {t.beforeTitle ?? "Before"}
                  </div>
                  {before && before.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-5 text-sm text-white/85">
                      {before.map((b, bi) => (
                        <li key={bi} dangerouslySetInnerHTML={{ __html: b }} />
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-white/60">—</p>
                  )}
                </div>

                <div className="rounded-md border border-cyan-400/10 bg-black/50 p-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-300/90">
                    {t.afterTitle ?? "After"}
                  </div>
                  {after && after.length > 0 ? (
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

              <div className="mt-4 text-sm text-cyan-300/80">Click to flip back ↺</div>
            </div>
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

/** Free-floating avatar tile that matches your site’s vibe and keeps things lightweight. */
function AvatarTile({
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
      className={[
        "relative rounded-xl border border-cyan-400/10 bg-black/20 px-4 pb-5 pt-4",
        "isolate overflow-hidden",
        className ?? "",
      ].join(" ")}
    >
      {/* subtle backplate pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-10 [background:repeating-linear-gradient(135deg,rgba(255,255,255,0.15)_0_2px,transparent_2px_6px)]"
      />

      {/* avatar image (transparent PNG) */}
      <div className="relative mx-auto w-full max-w-[420px]">
        <Image
          src={src}
          alt={alt}
          width={800}
          height={1200}
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="mx-auto h-auto w-full select-none"
          priority={false}
        />
      </div>

      {/* label */}
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

/** Fallback: render your original list if only one item exists. */
function LegacyTestimonialsOnly({ items }: { items: ReadonlyArray<Testimonial> }) {
  const [flipped, setFlipped] = React.useState<Record<number, boolean>>({});
  const toggle = (i: number) => setFlipped((s) => ({ ...s, [i]: !s[i] }));

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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((t, i) => {
            const before = (t.before ?? t.diff?.before ?? []) as ReadonlyArray<string>;
            const after = (t.after ?? t.diff?.after ?? []) as ReadonlyArray<string>;
            const hasDiff = (before?.length ?? 0) > 0 || (after?.length ?? 0) > 0;

            return (
              <motion.article
                key={`${t.app ?? "t"}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.03 }}
                className="rounded-xl border border-cyan-400/10 bg-transparent p-0 isolate"
              >
                <div
                  className={`flip-3d ${flipped[i] ? "is-flipped" : ""}`}
                  onClick={() => hasDiff && toggle(i)}
                  role={hasDiff ? "button" : undefined}
                  aria-pressed={hasDiff ? !!flipped[i] : undefined}
                >
                  <div className="flip-face rounded-xl ring-1 ring-white/10 bg-black/70 p-5 min-h-80 max-h-[70vh]">
                    {t.app && (
                      <div className="font-mono text-[11px] uppercase tracking-widest text-cyan-300/80">
                        {t.app}
                      </div>
                    )}
                    <h3 className="mt-1 text-lg font-semibold text-white/90">
                      {t.name}
                      {t.role ? <span className="text-white/60"> — {t.role}</span> : null}
                    </h3>

                    {t.quote && (
                      <blockquote className="mt-3 border-l-2 border-cyan-400/30 pl-4 text-white/85">
                        <span className="text-cyan-200">“</span>
                        <span>{t.quote}</span>
                        <span className="text-cyan-200">”</span>
                      </blockquote>
                    )}

                    {hasDiff ? (
                      <div className="mt-4 text-sm text-cyan-300/80">Click to flip ↺</div>
                    ) : null}
                  </div>

                  {hasDiff ? (
                    <div className="flip-back rounded-xl ring-1 ring-white/10 bg-black/70 p-5 min-h-80 max-h-[70vh]">
                      <div className="h-full overflow-y-auto pr-2">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="rounded-md border border-cyan-400/10 bg-black/50 p-3">
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-300/90">
                              {t.beforeTitle ?? "Before"}
                            </div>
                            {before && before.length > 0 ? (
                              <ul className="list-disc space-y-1 pl-5 text-sm text-white/85">
                                {before.map((b, bi) => (
                                  <li key={bi} dangerouslySetInnerHTML={{ __html: b }} />
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-white/60">—</p>
                            )}
                          </div>

                          <div className="rounded-md border border-cyan-400/10 bg-black/50 p-3">
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-300/90">
                              {t.afterTitle ?? "After"}
                            </div>
                            {after && after.length > 0 ? (
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

                        <div className="mt-4 text-sm text-cyan-300/80">Click to flip back ↺</div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Helpers -------------------- */

/**
 * Pick avatar path by name. You can extend this as you add more people.
 * (Files must exist in public/images/)
 */
function pickAvatarSrc(name?: string): string {
  const n = (name ?? "").toLowerCase();
  if (n.includes("smith") || n.includes("c. smith")) return "/images/smith-avatar.png";
  if (n.includes("waterman") || n.includes("g. waterman")) return "/images/waterman-avatar.png";
  // default fallback (keeps layout even if name didn't match)
  return "/images/avatar.png";
}
