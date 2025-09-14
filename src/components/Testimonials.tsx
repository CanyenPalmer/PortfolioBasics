"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { profile } from "@/content/profile";

export const TESTIMONIALS = profile.testimonials as readonly any[];

export function Testimonials() {
  const items = TESTIMONIALS;
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <section
      id="testimonials"
      aria-label="Testimonials"
      className="relative bg-[#0d131d] min-h-[100svh] md:min-h-screen py-24 md:py-32 scroll-mt-24 md:scroll-mt-28 md:snap-start"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((t: any, i: number) => (
            <motion.article
              key={`${t.app ?? "t"}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.03 }}
              className="rounded-lg border border-cyan-400/10 bg-black/20 p-5"
            >
              <header className="mb-3">
                {t.app && (
                  <div className="font-mono text-xs uppercase tracking-widest text-cyan-300/80">
                    {t.app}
                  </div>
                )}
                <h3 className="mt-1 text-lg font-semibold text-white/90">
                  {t.name}
                  {t.role ? <span className="text-white/60"> — {t.role}</span> : null}
                </h3>
              </header>
              {t.quote && (
                <blockquote className="mt-2 border-l-2 border-cyan-400/30 pl-4 text-white/85">
                  <span className="text-cyan-200">“</span>
                  <span>{t.quote}</span>
                  <span className="text-cyan-200">”</span>
                </blockquote>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
