"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { profile } from "@/content/profile";

type Pose = {
  id: number;
  key?: string;
  title?: string;
  img?: string;
  alt?: string;
  body?: React.ReactNode; // profile stores JSX here
};

export default function AboutMe() {
  // Your profile.about contains { poses: Pose[] }
  const poses = (profile as any)?.about?.poses as ReadonlyArray<Pose> | undefined;

  if (!Array.isArray(poses) || poses.length === 0) {
    // Nothing to render; stay compile-safe
    return null;
  }

  return (
    <section id="about" aria-label="About Me" className="relative bg-[#0b1016] overflow-hidden">
      {/* Background typography underlay (very subtle) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 left-6 text-[10rem] font-black tracking-tight text-white/5 select-none">
          ABOUT
        </div>
        <div className="absolute bottom-0 right-6 text-[9rem] font-black tracking-tight text-white/5 select-none rotate-6">
          ME
        </div>
      </div>

      <div className="container mx-auto px-6 py-24 max-w-7xl relative z-10">
        <h2 className="mb-8 text-3xl font-bold tracking-tight text-white">About Me</h2>

        <div className="grid gap-8 md:grid-cols-2">
          {poses.map((p, idx) => (
            <motion.article
              key={p.id ?? idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: idx * 0.04 }}
              className="rounded-2xl ring-1 ring-white/10 bg-white/5 overflow-hidden"
            >
              {/* Image (optional) */}
              {p.img && (
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={p.img}
                    alt={p.alt ?? p.title ?? "About image"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
              )}

              <div className="p-5">
                {p.title && (
                  <h3 className="text-lg font-semibold text-white/90 mb-2">{p.title}</h3>
                )}

                {/* Body comes from profile as a JSX Element; render directly */}
                {p.body ? (
                  <div className="prose prose-invert prose-p:leading-relaxed text-white/85">
                    {p.body}
                  </div>
                ) : null}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
