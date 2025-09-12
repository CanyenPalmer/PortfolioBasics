"use client";
import { motion } from "framer-motion";

type Role = {
  title: string;
  org?: string;
  range?: string;
  bullets?: string[];
  metric?: { value: string; label: string };
};

export default function Experience({ heading = "Experience", roles }: { heading?: string; roles: Role[]; }) {
  return (
    <section id="experience" className="section-wrap">
      <div className="hud-panel">
        <motion.h2 initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }} className="neon-title">
          {heading.toUpperCase()}
        </motion.h2>

        <div className="mt-8 grid md:grid-cols-[1fr_auto] gap-10">
          <ol className="relative space-y-8">
            {roles.map((r, idx) => (
              <motion.li key={idx} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.45, delay: idx * 0.04 }}
                className="relative pl-8">
                <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_2px_rgba(0,229,255,.65)]" />
                {idx !== roles.length - 1 && (<span className="absolute left-0 top-4 bottom-[-1.25rem] w-px bg-white/10" />)}

                <div className="flex flex-col gap-1">
                  <div className="text-lg md:text-xl font-semibold">{r.title}</div>
                  {(r.org || r.range) && (
                    <div className="text-white/60">
                      {r.range && <span>{r.range}</span>}
                      {r.range && r.org && <span> • </span>}
                      {r.org && <span>{r.org}</span>}
                    </div>
                  )}
                  {!!r.bullets?.length && (
                    <ul className="mt-2 list-disc pl-5 text-white/80 space-y-1">
                      {r.bullets.map((b, i) => (<li key={i}>{b}</li>))}
                    </ul>
                  )}
                </div>
              </motion.li>
            ))}
          </ol>

          <div className="space-y-6 self-start min-w-[180px]">
            {roles.filter(r => r.metric).map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.45, delay: i * 0.06 }}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-2xl font-bold text-cyan-300 drop-shadow">{r.metric!.value}</div>
                <div className="text-xs uppercase tracking-wider text-white/60">{r.metric!.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
