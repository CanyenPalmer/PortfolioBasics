"use client";

import * as React from "react";
import { motion } from "framer-motion";

type Props = {
  headline?: string;
  subheadline?: string;
  typer?: string[];
};

export default function Hero({ headline, subheadline, typer }: Props) {
  return (
    <section
      aria-label="Hero"
      className="relative bg-[#0b1016] overflow-hidden"
    >
      {/* Background typography underlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-10 left-6 text-[10rem] font-black tracking-tight text-white/5 select-none">
          DATA
        </div>
        <div className="absolute bottom-0 right-6 text-[9rem] font-black tracking-tight text-white/5 select-none rotate-6">
          SCIENCE
        </div>
      </div>

      <div className="container mx-auto px-6 py-24 max-w-7xl relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white"
        >
          {headline}
        </motion.h1>

        {subheadline && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-6 text-lg text-white/70 max-w-2xl"
          >
            {subheadline}
          </motion.p>
        )}
      </div>
    </section>
  );
}
