"use client";

import * as React from "react";
import { motion } from "framer-motion";
import NameStamp from "@/components/NameStamp";

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
      {/* Removed background underlay */}

      <div className="container mx-auto px-6 py-24 max-w-7xl relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white"
        >
          <NameStamp
            text={headline ?? "Canyen Palmer"}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold"
            variant="hero"
            rearmOnExit={true}
          />
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
