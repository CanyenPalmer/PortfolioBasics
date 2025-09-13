// src/components/AboutMeShowcase.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import SkillsBelt from "@/components/SkillsBelt";

type AboutImage = {
  img: string;
  alt?: string;
  caption?: string;
};

export default function AboutMeShowcase() {
  const about: any = (profile as any)?.about ?? {};
  const title: string = about?.title ?? "About Me";
  const paragraphs: string[] = Array.isArray(about?.paragraphs) ? about.paragraphs : [];
  const gallery: AboutImage[] = Array.isArray(about?.gallery) ? about.gallery : [];

  if (paragraphs.length === 0 && gallery.length === 0) {
    // Nothing to render; fail silently
    return null;
  }

  return (
    <section aria-label="About">
      <h2 className="mb-6 text-xl font-semibold tracking-wide text-cyan-200">{title}</h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
        {/* Text */}
        <div className="md:col-span-3 space-y-4">
          {paragraphs.map((p: string, i: number) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="text-white/85"
              dangerouslySetInnerHTML={{ __html: p }}
            />
          ))}
        </div>

        {/* Gallery */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {gallery.map((g: AboutImage, i: number) => (
            <motion.figure
              key={`${g.img}-${i}`}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.03 }}
              className="rounded-lg border border-cyan-400/10 bg-black/20 p-2"
            >
              <div className="relative overflow-hidden rounded-md ring-1 ring-cyan-400/15">
                <Image
                  src={g.img}
                  alt={g.alt ?? "About image"}
                  width={800}
                  height={800}
                  className="h-auto w-full"
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-cyan-400/12" />
              </div>
              {g.caption && (
                <figcaption className="mt-1 text-xs text-white/60">{g.caption}</figcaption>
              )}
            </motion.figure>
          ))}
        </div>
      </div>

      {/* Toolbelt rail at the bottom of the About “page” */}
      <div className="mt-10">
        <SkillsBelt speedSeconds={26} />
      </div>
    </section>
  );
}

