"use client";
import { motion } from "framer-motion";

type Project = {
  title: string;
  summary: string;
  tags: string[];
  href?: string;
  details?: string[];    // extra bullet lines from old portfolio
  impact?: string;       // e.g., "$317k unpaid identified"
};

export default function Projects({ heading = "Projects", projects }: { heading?: string; projects: Project[]; }) {
  return (
    <section id="projects" className="section-wrap">
      <div className="hud-panel">
        <motion.h2 initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }} className="neon-title magenta">
          {heading.toUpperCase()}
        </motion.h2>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <motion.a key={i} href={p.href ?? "#"} target={p.href ? "_blank" : undefined} rel={p.href ? "noreferrer" : undefined}
              initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-white/20 hover:bg-white/[0.05] transition">
              <div className="text-lg font-semibold">{p.title}</div>
              <p className="mt-1 text-white/70 text-sm">{p.summary}</p>

              {!!p.details?.length && (
                <ul className="mt-3 list-disc pl-5 text-white/80 space-y-1">
                  {p.details.map((d, j) => (<li key={j}>{d}</li>))}
                </ul>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags.map((t, j) => (
                  <span key={j} className="text-xs px-2 py-1 rounded-md ring-1 ring-white/15 bg-white/[0.04]">{t}</span>
                ))}
              </div>

              {p.impact && (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-cyan-200/90">
                  Impact: {p.impact}
                </div>
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
