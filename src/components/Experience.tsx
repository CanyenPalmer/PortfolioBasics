// src/components/Experience.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import SectionPanel from "@/components/ui/SectionPanel";
import { profile } from "@/content/profile";

export default function Experience() {
  const items = ((profile as any)?.experience ?? []) as ReadonlyArray<any>;

  if (!items || items.length === 0) return null;

  return (
    <section
      id="experience"
      aria-label="Experience"
      className="relative bg-[#0e1622] min-h-[100svh] md:min-h-screen py-24 md:py-32 scroll-mt-24 md:scroll-mt-28 md:snap-start"
    >
      <SectionPanel title="Experience" className="mx-auto max-w-7xl">
        <div className="space-y-10">
          {items.map((role, i) => (
            <motion.article
              key={role.id ?? i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.03 }}
              className="rounded-lg border border-cyan-400/10 bg-black/20 p-5"
            >
              {/* Header */}
              <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-white/90">
                  {role.title}{" "}
                  <span className="text-white/60">— {role.company}</span>
                </h3>
                <span className="font-mono text-xs text-cyan-300/80">
                  {role.dates}
                </span>
              </header>

              {/* Location + context */}
              {role.location && (
                <p className="text-sm text-white/60">{role.location}</p>
              )}
              {role.context && (
                <p className="mt-2 text-sm text-white/75">{role.context}</p>
              )}

              {/* Highlights */}
              {Array.isArray(role.highlights) && role.highlights.length > 0 && (
                <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-white/85">
                  {role.highlights.map((h: string, idx: number) => (
                    <li key={idx} dangerouslySetInnerHTML={{ __html: h }} />
                  ))}
                </ul>
              )}

              {/* Creations */}
              {Array.isArray(role.creations) && role.creations.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-cyan-300/80">
                    Creations
                  </h4>
                  {role.creations.map(
                    (
                      c: { name: string; details?: string[] },
                      ci: number
                    ) => (
                      <div key={ci} className="ml-2">
                        <p className="font-medium text-white/90">
                          • {c.name}
                        </p>
                        {Array.isArray(c.details) &&
                          c.details.length > 0 && (
                            <ul className="mt-1 list-disc space-y-1.5 pl-6 text-sm text-white/80">
                              {c.details.map((d, di) => (
                                <li
                                  key={di}
                                  dangerouslySetInnerHTML={{ __html: d }}
                                />
                              ))}
                            </ul>
                          )}
                      </div>
                    )
                  )}
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </SectionPanel>
    </section>
  );
}
