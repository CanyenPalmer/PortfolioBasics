"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex items-center justify-center min-h-[72vh] overflow-hidden"
    >
      {/* Subtle animated grid background */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_30%,#00e5ff20_31%,transparent_32%)] animate-slow-pulse" />
        <div className="grid-bg" />
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 py-20">
        <div className="grid md:grid-cols-[1.1fr_.9fr] gap-10 items-center">
          {/* Copy block */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight"
            >
              Canyen Palmer
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-3 text-lg md:text-xl text-white/80"
            >
              Data Scientist & Google-Certified Data Analytics Professional
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-6"
            >
              <TypeLine />
            </motion.div>
          </div>

          {/* Simple 2D animated figure (SVG) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="relative mx-auto w-full max-w-[520px]"
          >
            <CyberFigure />
            {/* Soft glow behind the figure */}
            <div className="absolute -inset-8 -z-10 rounded-[36px] blur-3xl bg-[#00e5ff33] pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TypeLine() {
  return (
    <div className="font-mono text-[15px] md:text-[17px] text-white/90">
      <span className="opacity-70">~/portfolio</span>
      <span className="opacity-70"> $ </span>
      <span className="typewriter">
        Turning data into decisions through science, code, and storytelling.
      </span>
      <span className="caret" aria-hidden />
      <p className="mt-2 text-white/60 text-sm">
        Clean pipelines → robust models → clear dashboards.
      </p>
    </div>
  );
}

/** Minimal 2D figure with subtle motion; stays within frame */
function CyberFigure() {
  return (
    <svg
      viewBox="0 0 520 520"
      className="w-full h-auto drop-shadow-[0_0_24px_rgba(0,229,255,0.35)]"
    >
      {/* Frame */}
      <rect x="8" y="8" width="504" height="504" rx="28" className="fill-[#0f1520] stroke-[#1b2431]" strokeWidth="2" />

      {/* Head */}
      <motion.circle
        cx="260"
        cy="150"
        r="42"
        className="fill-[#121a26] stroke-[#00e5ff]"
        strokeWidth="2"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      />

      {/* Body */}
      <motion.rect
        x="215"
        y="195"
        width="90"
        height="120"
        rx="16"
        className="fill-[#121a26] stroke-[#00e5ff]"
        strokeWidth="2"
        animate={{ y: [0, 1.5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.2 }}
      />

      {/* Arms */}
      <motion.rect
        x="168"
        y="205"
        width="40"
        height="14"
        rx="7"
        className="fill-[#121a26] stroke-[#00e5ff]"
        strokeWidth="2"
        animate={{ x: [0, 2, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, delay: 0.1 }}
      />
      <motion.rect
        x="312"
        y="205"
        width="40"
        height="14"
        rx="7"
        className="fill-[#121a26] stroke-[#00e5ff]"
        strokeWidth="2"
        animate={{ x: [0, -2, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, delay: 0.1 }}
      />

      {/* Legs */}
      <motion.rect
        x="222"
        y="318"
        width="24"
        height="92"
        rx="10"
        className="fill-[#121a26] stroke-[#00e5ff]"
        strokeWidth="2"
        animate={{ y: [0, -1.5, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />
      <motion.rect
        x="274"
        y="318"
        width="24"
        height="92"
        rx="10"
        className="fill-[#121a26] stroke-[#00e5ff]"
        strokeWidth="2"
        animate={{ y: [0, 1.5, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />

      {/* HUD nodes */}
      <motion.circle
        cx="420"
        cy="100"
        r="6"
        className="fill-[#00e5ff]"
        animate={{ opacity: [0.25, 1, 0.25] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
      <motion.circle
        cx="96"
        cy="420"
        r="6"
        className="fill-[#ff3bd4]"
        animate={{ opacity: [0.25, 1, 0.25] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.2 }}
      />
      <motion.circle
        cx="440"
        cy="360"
        r="6"
        className="fill-white"
        animate={{ opacity: [0.25, 1, 0.25] }}
        transition={{ duration: 1.4, repeat: Infinity, delay: 0.1 }}
      />
    </svg>
  );
}
