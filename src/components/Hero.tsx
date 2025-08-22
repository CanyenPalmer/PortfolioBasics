"use client";

import { motion } from "framer-motion";
import { hero } from "@/content/hero.data";
import CodeEdgesStrict from "./CodeEdgesStrict";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 md:px-12">
      {/* Ambient Code Borders */}
      <CodeEdgesStrict />

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch w-full max-w-6xl">
        {/* LEFT COLUMN — Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center h-full"
        >
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            {hero.headline}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/80">
            {hero.subheadline}
          </p>

          {/* Skills snapshot */}
          <div className="mt-6 space-y-3 text-sm text-white/70">
            <p>
              <span className="font-semibold">Proficiency:</span>{" "}
              {hero.skills.proficiency.join(", ")}
            </p>
            <p>
              <span className="font-semibold">Familiarities:</span>{" "}
              {hero.skills.familiarity.join(", ")}
            </p>
            <p>
              <span className="font-semibold">Tech Stack:</span>{" "}
              {hero.skills.techStack.join(", ")}
            </p>
          </div>

          {/* Personal blurb */}
          <p className="mt-6 text-white/70">{hero.personal}</p>

          {/* CTA Buttons */}
          <div className="mt-8 flex gap-4">
            {hero.ctas.map((cta, i) => (
              <a
                key={i}
                href={cta.href}
                className={`px-5 py-3 rounded-xl font-medium transition ${
                  cta.variant === "primary"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border border-white/30 hover:bg-white/10 text-white"
                }`}
              >
                {cta.label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* RIGHT COLUMN — Headshot (tall as left column, width kept consistent) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center h-full"
        >
          {/* Stable frame: matches row height (h-full) and keeps a consistent width */}
          <div
            className="
              relative
              h-full
              w-full md:w-[min(46vw,620px)] max-w-full
              overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/15
              flex items-center justify-center
            "
          >
            {/* Image fills the frame: will be as tall as the left column content */}
            <img
              src={hero.headshot}
              alt="Headshot of Canyen Palmer"
              loading="eager"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
