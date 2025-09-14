"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { profile } from "@/content/profile";

export default function AboutMe() {
  const { about } = profile;
  const { body, images } = about;

  return (
    <section
      id="about"
      aria-label="About Me"
      className="relative bg-[#0b1016] overflow-hidden"
    >
      {/* Background typography underlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-10 left-6 text-[10rem] font-black tracking-tight text-white/5 select-none">
          ABOUT
        </div>
        <div className="absolute bottom-0 right-6 text-[9rem] font-black tracking-tight text-white/5 select-none rotate-6">
          ME
        </div>
      </div>

      <div className="container mx-auto px-6 py-24 max-w-7xl relative z-10">
        <h2 className="mb-8 text-3xl font-bold tracking-tight text-white">
          About Me
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            {body.map((p, i) => (
              <p
                key={i}
                className="text-white/80 leading-relaxed"
              >
                {p}
              </p>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            {images.map((src, idx) => (
              <div
                key={idx}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/10 bg-white/5"
              >
                <Image
                  src={src}
                  alt={`About image ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                  priority={idx === 0}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
