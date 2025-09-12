// src/components/Experience.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import SectionPanel from "@/components/ui/SectionPanel";
import { profile } from "@/content/profile";

export default function Experience() {
  const items = profile.experience as any[];

  return (
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
            <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold text-white/90">
                {role.title} <span className="text-white/60">— {role.company}</span>
              </h3>
              <span className="font-mono text-xs text-cyan-300/80">{role.dates}</span>
            </header>

            {role.location && <p className="text-sm text-white/60">{role.location}</p>}
            {role.context && <p className="mt-2 text-sm text-white/75">{role.context}</p>}

            {Array.isArray(role.highlights) && role.highlights.length > 0 && (
              <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-white/85">
                {role.highlights.map((h: string, idx: number) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: h }} />
                ))}
              </ul>
            )}

            {Array.isArray(role.creations) && role.creations.length > 0 && (
              <div className="mt-5">
                <h4 className="mb-2 font-semibold text-cyan-300/90">Creations</h4>
                <div className="space-y-3">
                  {role.creations.map((c: any, ci: number) => (
                    <div key={ci} className="rounded-md border border-cyan-400/10 bg-black/20 p-3">
                      <div className="font-medium text-white/90">{c.name}</div>
                      {Array.isArray(c.details) && (
                        <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-white/85">
                          {c.details.map((d: string, di: number) => (
                            <li key={di} dangerouslySetInnerHTML={{ __html: d }} />
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </SectionPanel>
  );
}
