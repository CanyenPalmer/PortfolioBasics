"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { profile } from "@/content/profile";

/**
 * Expected testimonial shape (flexible):
 * {
 *   app?: string;           // small app tag
 *   name?: string;          // person
 *   role?: string;          // their role
 *   quote?: string;         // short quote (front)
 *   before?: string[];      // back: bullet list (before)
 *   after?: string[];       // back: bullet list (after)
 *   beforeTitle?: string;   // heading override (default "Before")
 *   afterTitle?: string;    // heading override (default "After")
 *   diff?: { before?: string[]; after?: string[]; } // alt location
 * }
 */

type Testimonial = {
  app?: string;
  name?: string;
  role?: string;
  quote?: string;
  before?: string[];
  after?: string[];
  beforeTitle?: string;
  afterTitle?: string;
  diff?: { before?: string[]; after?: string[] };
};

export function Testimonials() {
  const items = (profile.testimonials ?? []) as Testimonial[];
  if (!Array.isArray(items) || items.length === 0) return null;

  const [flipped, setFlipped] = React.useState<Record<number, boolean>>({});

  const toggle = (i: number) =>
    setFlipped((s) => ({ ...s, [i]: !s[i] }));

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
            // normalize data
            const before = t.before ?? t.diff?.before ?? [];
            const after = t.after ?? t.diff?.after ?? [];
            const hasDiff = (before && before.length > 0) || (after && after.length > 0);

            return (
              <motion.article
                key={`${t.app ?? "t"}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.03 }}
                className="rounded-xl border border-cyan-400/10 bg-black/20 p-0"
                style={{ perspective: "1000px" }} // ensure 3D depth for children
              >
                {/* Flip container */}
                <div
                  className={`flip-3d ${flipped[i] ? "is-flipped" : ""}`}
                  onClick={() => hasDiff && toggle(i)}
                  role={hasDiff ? "button" : undefined}
                  aria-pressed={hasDiff ? !!flipped[i] : undefined}
                >
                  {/* FRONT */}
                  <div className="flip-face rounded-xl ring-1 ring-white/10 bg-black/20 p-5 min-h-80 max-h-[70vh]">
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
                      <div className="mt-4 text-sm text-cyan-300/80">
                        Click to flip ↺
                      </div>
                    ) : null}
                  </div>

                  {/* BACK */}
                  {hasDiff ? (
                    <div className="flip-back rounded-xl ring-1 ring-white/10 bg-black/30 p-5 min-h-80 max-h-[70vh]">
                      <div className="h-full overflow-y-auto pr-2">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="rounded-md border border-cyan-400/10 bg-black/20 p-3">
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
                          <div className="rounded-md border border-cyan-400/10 bg-black/20 p-3">
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

                        <div className="mt-4 text-sm text-cyan-300/80">
                          Click to flip back ↺
                        </div>
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

export default Testimonials;
