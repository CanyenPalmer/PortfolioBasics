"use client";
import { motion } from "framer-motion";

export default function Hero({
  headline,
  subheadline,
  typer,
}: {
  headline: string;
  subheadline: string;
  typer: string;
}) {
  return (
    <section id="home" className="relative flex items-center justify-center min-h-[72vh] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_30%,#00e5ff20_31%,transparent_32%)] animate-slow-pulse" />
        <div className="grid-bg" />
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 py-20">
        <div className="grid md:grid-cols-[1.1fr_.9fr] gap-10 items-center">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight">
              {headline}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08, duration: .6 }}
              className="mt-3 text-lg md:text-xl text-white/80">
              {subheadline}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15, duration: .6 }}
              className="mt-6 font-mono text-[15px] md:text-[17px] text-white/90">
              <span className="opacity-70">~/portfolio</span>
              <span className="opacity-70"> $ </span>
              <span className="typewriter">{typer}</span>
              <span className="caret" aria-hidden />
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .15, duration: .6 }}
            className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute -inset-8 -z-10 rounded-[36px] blur-3xl bg-[#00e5ff33] pointer-events-none" />
            <svg viewBox="0 0 520 520" className="w-full h-auto drop-shadow-[0_0_24px_rgba(0,229,255,0.35)]">
              <rect x="8" y="8" width="504" height="504" rx="28" className="fill-[#0f1520] stroke-[#1b2431]" strokeWidth="2" />
              <motion.circle cx="260" cy="150" r="42" className="fill-[#121a26] stroke-[#00e5ff]" strokeWidth="2"
                animate={{ y: [0, -2, 0] }} transition={{ duration: 3.5, repeat: Infinity }} />
              <motion.rect x="215" y="195" width="90" height="120" rx="16" className="fill-[#121a26] stroke-[#00e5ff]" strokeWidth="2"
                animate={{ y: [0, 1.5, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: .2 }} />
              <motion.rect x="168" y="205" width="40" height="14" rx="7" className="fill-[#121a26] stroke-[#00e5ff]" strokeWidth="2"
                animate={{ x: [0, 2, 0] }} transition={{ duration: 2.6, repeat: Infinity, delay: .1 }} />
              <motion.rect x="312" y="205" width="40" height="14" rx="7" className="fill-[#121a26] stroke-[#00e5ff]" strokeWidth="2"
                animate={{ x: [0, -2, 0] }} transition={{ duration: 2.6, repeat: Infinity, delay: .1 }} />
              <motion.rect x="222" y="318" width="24" height="92" rx="10" className="fill-[#121a26] stroke-[#00e5ff]" strokeWidth="2"
                animate={{ y: [0, -1.5, 0] }} transition={{ duration: 2.2, repeat: Infinity }} />
              <motion.rect x="274" y="318" width="24" height="92" rx="10" className="fill-[#121a26] stroke-[#00e5ff]" strokeWidth="2"
                animate={{ y: [0, 1.5, 0] }} transition={{ duration: 2.2, repeat: Infinity }} />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
