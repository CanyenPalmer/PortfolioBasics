// src/components/Education.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { profile } from "@/content/profile";

export type EduItem = {
  school?: string;
  program?: string;
  degree?: string;
  dates?: string;
  location?: string;
  bullets?: ReadonlyArray<string>;
  details?: ReadonlyArray<string>; // used for listing classes/courses
};

export default function Education() {
  const education = (profile as any)?.education as ReadonlyArray<EduItem> | undefined;

  if (!education || education.length === 0) {
    return null;
  }

  return (
    <section
      id="education"
      aria-label="Education"
      className="relative bg-[#0b1016] py-16 md:py-20"
    >
      <div className="mx-auto w-full max-w-5xl px-6">
        {/* Section header */}
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Education
          </h2>
          <p className="mt-2 text-white/70">
            Degrees, certificates, and relevant coursework.
          </p>
        </motion.header>

        <div className="space-y-6">
          {education.map((e, idx) => {
            const hasBullets = Array.isArray(e.bullets) && e.bullets.length > 0;
            const hasDetails = Array.isArray(e.details) && e.details.length > 0;

            return (
              <motion.article
                key={`${e.school ?? "edu"}-${idx}`}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45 }}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-5 md:p-6"
              >
                {/* Top row: School + dates */}
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                  <div>
                    <h3 className="text-lg md:text-xl font-medium">
                      {e.school}
                    </h3>
                    {(e.program || e.degree) && (
                      <p className="text-white/80">
                        {[e.program, e.degree].filter(Boolean).join(" • ")}
                      </p>
                    )}
                    {e.location && (
                      <p className="text-white/60 text-sm">{e.location}</p>
                    )}
                  </div>
                  {e.dates && (
                    <div className="text-white/60 text-sm md:text-base">
                      {e.dates}
                    </div>
                  )}
                </div>

                {/* Bullets (honors/notes) */}
                {hasBullets && (
                  <ul className="mt-3 list-disc space-y-1.5 pl-6 text-sm text-white/85">
                    {e.bullets!.map((b, bi) => (
                      <li key={bi} dangerouslySetInnerHTML={{ __html: b }} />
                    ))}
                  </ul>
                )}

                {/* Courses / Classes (details) */}
                {hasDetails && (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/70">
                      Courses
                    </h4>
                    <ul className="space-y-1.5 text-sm text-white/85 list-disc pl-6">
                      {e.details!.map((d, di) => (
                        <li key={di} dangerouslySetInnerHTML={{ __html: d }} />
                      ))}
                    </ul>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
