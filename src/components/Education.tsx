"use client";

import { motion } from "framer-motion";

type Course = { code?: string; name: string };
type EduItem = {
  school: string;
  degree: string;
  range?: string;
  details?: string[];
  coursework?: Course[];
  badges?: string[];
};

type Props = { heading?: string; items: EduItem[]; };

export default function Education({ heading = "Education", items }: Props) {
  return (
    <section id="education" className="section-wrap">
      <div className="hud-panel">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="neon-title magenta"
        >
          {heading.toUpperCase()}
        </motion.h2>

        <div className="mt-8 space-y-8">
          {items.map((ed, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="text-lg md:text-xl font-semibold">{ed.school}</div>
                  <div className="text-white/70">{ed.degree}</div>
                </div>
                {ed.range && <div className="text-white/60 text-sm md:text-base">{ed.range}</div>}
              </div>

              {ed.details && ed.details.length > 0 && (
                <ul className="mt-4 list-disc pl-5 text-white/80 space-y-1">
                  {ed.details.map((d, j) => (<li key={j}>{d}</li>))}
                </ul>
              )}

              {ed.coursework && ed.coursework.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs uppercase tracking-wider text-white/60">Selected Coursework</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ed.coursework.map((c, k) => (
                      <span key={k} className="text-xs px-2 py-1 rounded-md ring-1 ring-white/15 bg-white/[0.04]" title={c.name}>
                        {c.code ? `${c.code}: ` : ""}{c.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {ed.badges && ed.badges.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs uppercase tracking-wider text-white/60">Focus Areas</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ed.badges.map((b, z) => (
                      <span key={z} className="text-xs px-2 py-1 rounded-md ring-1 ring-white/15 bg-white/[0.04]">{b}</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
