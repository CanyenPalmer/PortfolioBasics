// src/components/Testimonials.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { profile } from "@/content/profile";

// Keep the array available (some parts of your site may reference it)
export const TESTIMONIALS = profile.testimonials as readonly any[];

/** React component that renders testimonials from profile.testimonials */
export function Testimonials() {
  const items = TESTIMONIALS;

  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
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

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {Array.isArray(t.before) && t.before.length > 0 && (
              <div className="rounded-md border border-cyan-400/10 bg-black/20 p-3">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-cyan-300/90">
                  Before
                </div>
                <ul className="list-disc space-y-1 pl-5 text-sm text-white/85">
                  {t.before.map((b: string, bi: number) => (
                    <li key={bi} dangerouslySetInnerHTML={{ __html: b }} />
                  ))}
                </ul>
              </div>
            )}
            {Array.isArray(t.after) && t.after.length > 0 && (
              <div className="rounded-md border border-cyan-400/10 bg-black/20 p-3">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-cyan-300/90">
                  After
                </div>
                <ul className="list-disc space-y-1 pl-5 text-sm text-white/85">
                  {t.after.map((a: string, ai: number) => (
                    <li key={ai} dangerouslySetInnerHTML={{ __html: a }} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.article>
      ))}
    </div>
  );
}

// Provide a default export so `import Testimonials from "@/components/Testimonials"` also works
export default Testimonials;
