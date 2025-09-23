"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/**
 * GetInTouchBand
 * - A compact CTA band mirroring the reference: centered "Get in Touch" with subtle scrolling lines.
 * - Pure Tailwind + inline keyframes; no global CSS changes and no props required.
 * - Standalone so it won’t touch Education’s scroll-lock container or timing.
 */
export default function GetInTouchBand() {
  return (
    <section
      aria-label="Get in touch"
      className="relative w-full overflow-hidden border-t border-white/10 bg-[#0d131d]"
    >
      {/* Scrolling lines background (non-interactive) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {/* Horizontal thin lines moving left */}
        <div className="absolute inset-0 [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_14px)] [background-size:15px_100%] animate-[scroll-x_16s_linear_infinite]" />
        {/* Vertical cross-lines drifting up */}
        <div className="absolute inset-0 [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.025)_0px,rgba(255,255,255,0.025)_1px,transparent_1px,transparent_18px)] [background-size:100%_19px] opacity-80 animate-[scroll-y_32s_linear_infinite]" />
        {/* Soft top glow to “cap” the preceding section */}
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/10 to-transparent" />
      </div>

      {/* Centered CTA content */}
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24 md:py-28 text-center">
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 0.9, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mb-3 text-xs tracking-[0.2em] text-white/60 uppercase"
        >
          Let’s Collaborate
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-balance text-2xl sm:text-3xl md:text-4xl font-semibold text-white"
        >
          Have a project or role in mind?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 0.9, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
          className="mx-auto mt-3 max-w-2xl text-white/70 text-sm sm:text-base"
        >
          I build measurable, production-ready analytics—ML, dashboards, and optimization.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.1 }}
          className="mt-6 flex items-center justify-center gap-3"
        >
          <Link
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm transition duration-150 hover:bg-white/15 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] active:scale-[0.99]"
          >
            <span className="inline-block transition duration-150 group-hover:translate-x-0.5">
              Get in Touch
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4 opacity-80 transition duration-150 group-hover:translate-x-0.5"
              fill="currentColor"
            >
              <path d="M13.2 5.2a1 1 0 0 0 0 1.6l3.2 3.2H6a1 1 0 1 0 0 2h10.4l-3.2 3.2a1 1 0 1 0 1.4 1.4l5.2-5.2a1 1 0 0 0 0-1.4l-5.2-5.2a1 1 0 0 0-1.4 0Z" />
            </svg>
          </Link>

          <Link
            href="https://www.linkedin.com/in/canyen-palmer"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-sm font-medium text-white/80 transition duration-150 hover:border-white/25 hover:text-white"
          >
            LinkedIn
          </Link>
        </motion.div>
      </div>

      {/* Local keyframes scoped to this component */}
      <style jsx>{`
        @keyframes scroll-x {
          0% { background-position-x: 0; }
          100% { background-position-x: -1200px; }
        }
        @keyframes scroll-y {
          0% { background-position-y: 0; }
          100% { background-position-y: -800px; }
        }
      `}</style>
    </section>
  );
}

