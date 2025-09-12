"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export type Testimonial = { app: string; name?: string; role?: string; quote: string; };
export default function Testimonials({ heading = "Testimonials", items, cols = 3 }: { heading?: string; items: Testimonial[]; cols?: 2|3; }) {
  return (
    <section id="testimonials" className="section-wrap">
      <div className="hud-panel">
        <motion.h2 initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }} className="neon-title">
          {heading.toUpperCase()}
        </motion.h2>

        <div className={`mt-8 grid gap-6 ${cols === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"}`}>
          {items.map((t, i) => (<FlipCard key={i} t={t} delay={i * 0.05} />))}
        </div>
      </div>
    </section>
  );
}

function FlipCard({ t, delay = 0 }: { t: Testimonial; delay?: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.button type="button" aria-label={`Toggle testimonial from ${t.app}`}
      initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, delay }} onClick={() => setFlipped(v => !v)}
      className="group relative w-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-cyan-300" style={{ perspective: 1200 }}>
      <div className={`flip-3d ${flipped ? "is-flipped" : ""}`} role="region" aria-live="polite">
        <div className="flip-face rounded-2xl ring-1 ring-white/12 bg-white/[0.035] p-6 md:p-7 flex flex-col justify-between min-h-[240px] lg:min-h-[280px]">
          <div>
            <div className="text-sm uppercase tracking-wider text-white/60">App</div>
            <div className="mt-1 text-xl font-semibold">{t.app}</div>
            {(t.name || t.role) && (
              <div className="mt-2 text-white/60 text-sm">
                {t.name && <span>{t.name}</span>}
                {t.name && t.role && <span> • </span>}
                {t.role && <span>{t.role}</span>}
              </div>
            )}
          </div>
          <div className="mt-6 text-right text-xs text-white/60">Click to flip</div>
        </div>

        <div className="flip-face flip-back rounded-2xl ring-1 ring-white/12 bg-white/[0.05] p-6 md:p-7 min-h-[240px] lg:min-h-[280px]">
          <div className="h-full flex flex-col">
            <p className="text-white/85 leading-relaxed text-[15px] md:text-[16px]">“{t.quote}”</p>
            <div className="mt-auto pt-4 text-right text-xs text-white/65">Click to flip back</div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
