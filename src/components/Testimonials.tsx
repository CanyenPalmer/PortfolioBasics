"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TESTIMONIALS, MinimalTestimonial } from "@/data/testimonials";

const CYAN = "#00e5ff";

function useTilt(disabled: boolean) {
  const [tilt, setTilt] = React.useState({ rx: 0, ry: 0, s: 1 });
  const ref = React.useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 2 - 1; // -1..1
    const py = (y / rect.height) * 2 - 1;
    setTilt({ rx: py * -6, ry: px * 8, s: 1.02 });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, s: 1 });

  return { ref, tilt, onMove, onLeave };
}

function teaserFromQuote(q: string, max = 160) {
  if (q.length <= max) return q;
  const slice = q.slice(0, max);
  const cut = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf(" "));
  return (cut > 80 ? slice.slice(0, cut) : slice) + "…";
}

function BulletList({ items }: { items: string[] | string }) {
  if (Array.isArray(items)) {
    return (
      <ul className="list-disc pl-5 text-white/85 leading-relaxed">
        {items.map((it, i) => (
          <li key={i} className="mb-1.5">
            {it}
          </li>
        ))}
      </ul>
    );
  }
  return <p className="text-white/85 leading-relaxed">{items}</p>;
}

function DossierCard({ t }: { t: MinimalTestimonial }) {
  const prefersReduced = useReducedMotion();
  const { ref, tilt, onMove, onLeave } = useTilt(prefersReduced);
  const [flipped, setFlipped] = React.useState(false);

  const wrapper =
    "relative h-[560px] md:h-[600px] lg:h-[640px] w-full rounded-2xl border border-cyan-300/30 bg-white/5 backdrop-blur-md shadow-[0_0_0_1px_rgba(0,229,255,.12)] overflow-hidden";

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={() => setFlipped((f) => !f)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setFlipped((f) => !f)}
      aria-label={`Testimonial for ${t.app}. ${flipped ? "Hide details" : "Show details"}.`}
      className={`${wrapper} cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-300/60`}
      style={{ transformStyle: "preserve-3d" }}
      animate={
        prefersReduced
          ? {}
          : {
              rotateX: tilt.rx,
              rotateY: tilt.ry,
              scale: tilt.s,
              transition: { type: "spring", stiffness: 140, damping: 16 },
            }
      }
    >
      {/* glow pad */}
      <div className="pointer-events-none absolute -inset-0.5 -z-10 rounded-2xl opacity-30 blur-2xl [background:radial-gradient(circle,rgba(0,229,255,.18)_0%,rgba(255,59,212,.10)_55%,transparent_70%)]" />

      {/* flip stack */}
      <div className="absolute inset-0 [transform-style:preserve-3d]">
        {/* front */}
        <motion.div
          className="absolute inset-0 [backface-visibility:hidden]"
          animate={flipped ? { rotateY: 180 } : { rotateY: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.36 }}
        >
          <div className="flex h-full flex-col justify-between p-6 md:p-7">
            <div className="flex items-baseline gap-2">
              <div className="text-sm font-semibold text-white/90">{t.app}</div>
            </div>

            <p className="mt-2 text-base/7 text-white/90 leading-relaxed">
              {teaserFromQuote(t.quote)}
            </p>

            {(t.name || t.role) && (
              <div className="mt-4 text-sm text-white/60">
                {t.name ? `— ${t.name.replace(/^—\s*/, "")}` : null}
                {t.role ? <span className="text-white/40"> ({t.role})</span> : null}
              </div>
            )}

            <div className="mt-5 text-xs text-white/60">Click to flip for details ↺</div>
          </div>
        </motion.div>

        {/* back */}
        <motion.div
          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          animate={flipped ? { rotateY: 0 } : { rotateY: -180 }}
          transition={{ duration: prefersReduced ? 0 : 0.36 }}
        >
          <div className="flex h-full min-h-0 flex-col p-6 md:p-7">
            {/* Header (static, not scrolling) */}
            <div>
              <div className="text-sm font-semibold text-white/90">{t.app}</div>
              {(t.name || t.role) && (
                <div className="text-xs text-white/60">
                  {t.name ? `— ${t.name.replace(/^—\s*/, "")}` : null}
                  {t.role ? <span className="text-white/40"> ({t.role})</span> : null}
                </div>
              )}
            </div>

            {/* Scrollable content area */}
            <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
              <p className="text-base/7 text-white/90 leading-relaxed">{t.quote}</p>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <div className="mb-2 text-sm font-semibold text-cyan-300/90">
                    Before {t.app}
                  </div>
                  <BulletList items={t.before} />
                </div>
                <div>
                  <div className="mb-2 text-sm font-semibold text-cyan-300/90">
                    After {t.app}
                  </div>
                  <BulletList items={t.after} />
                </div>
              </div>
            </div>

            {/* Footer (pinned inside card) */}
            <div className="pt-6 text-xs text-white/60">Click to flip back ↺</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative w-full bg-[#0b1016] py-32 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-baseline justify-between gap-4 md:mb-16">
          <h2 className="text-2xl font-semibold tracking-tight">Testimonials</h2>
          <div className="text-sm text-white/60">Click a card to flip for details</div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {TESTIMONIALS.map((t, idx) => (
            <DossierCard key={idx} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
