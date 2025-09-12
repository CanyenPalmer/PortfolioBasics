// src/components/Education.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { profile } from "@/content/profile";

type EduItem = {
  school?: string;
  program?: string;
  degree?: string;
  dates?: string;
  location?: string;
  bullets?: string[];
  details?: string[];
};

type Props = {
  heading?: string;
  /** Optional. If not provided, uses profile.education */
  items?: ReadonlyArray<EduItem>;
};

export default function Education({ heading = "Education", items }: Props) {
  const list: ReadonlyArray<EduItem> =
    items ?? (((profile as any)?.education ?? []) as ReadonlyArray<EduItem>);

  if (!Array.isArray(list) || list.length === 0) return null;

  return (
    <section aria-label="Education">
      <h2 className="mb-6 text-xl font-semibold tracking-wide text-cyan-200">{heading}</h2>

      <div className="space-y-6">
        {list.map((e, i) => (
          <motion.article
            key={`${e.school ?? "edu"}-${i}`}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.03 }}
            className="rounded-lg border border-cyan-400/10 bg-black/20 p-5"
          >
            <header className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold text-white/90">
                {e.school}
                {e.program || e.degree ? (
                  <span className="text-white/60"> — {e.program ?? e.degree}</span>
                ) : null}
              </h3>
              {e.dates && (
                <span className="font-mono text-xs text-cyan-300/80">{e.dates}</span>
              )}
            </header>

            {e.location && <p className="text-sm text-white/60">{e.location}</p>}

            {Array.isArray(e.bullets) && e.bullets.length > 0 && (
              <ul className="mt-3 list-disc space-y-1.5 pl-6 text-sm text-white/85">
                {e.bullets.map((b, bi) => (
                  <li key={bi} dangerouslySetInnerHTML={{ __html: b }} />
                ))}
              </ul>
            )}

            {Array.isArray(e.details) && e.details.length > 0 && (
              <ul className="mt-3 list-disc space-y-1.5 pl-6 text-sm text-white/85">
                {e.details.map((d, di) => (
                  <li key={di} dangerouslySetInnerHTML={{ __html: d }} />
                ))}
              </ul>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
