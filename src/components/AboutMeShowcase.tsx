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

type Pose = {
  id?: string | number;
  key?: string;
  title?: string;
  img?: string;
  alt?: string;
  body?: React.ReactNode; // JSX from content file
};

export default function AboutMeShowcase() {
  const about: any = (profile as any)?.about ?? {};
  const title: string = about?.title ?? "About Me";

  // Your primary source of truth (JSX bodies + optional img/alt)
  const poses: Pose[] = Array.isArray(about?.poses) ? (about.poses as Pose[]) : [];

  // Legacy fallback fields (HTML strings + gallery)
  const paragraphs: string[] = Array.isArray(about?.paragraphs) ? about.paragraphs : [];
  const gallery: AboutImage[] = Array.isArray(about?.gallery) ? (about.gallery as AboutImage[]) : [];

  // --- Normalize gallery items without using a typed predicate ---
  const normalizedGallery: { img: string; alt?: string }[] = React.useMemo(() => {
    if (poses.length > 0) {
      // Use pose images if provided
      return poses.flatMap((p) => (p?.img ? [{ img: p.img as string, alt: p.alt }] : []));
    }
    if (gallery.length > 0) {
      // Fall back to gallery array
      return gallery.flatMap((g) => (g?.img ? [{ img: g.img as string, alt: g.alt }] : []));
    }
    return [];
  }, [poses, gallery]);

  // We ALWAYS render the section (so the belt is visible) even if text/gallery are empty
  return (
    <section id="about" aria-label="About">
      <h2 className="mb-6 text-xl font-semibold tracking-wide text-cyan-200">{title}</h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
        {/* Text / Body */}
        <div className="md:col-span-3 space-y-4">
          {poses.length > 0 ? (
            poses.map((p, i) => (
              <motion.div
                key={p.id ?? p.key ?? i}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className="text-white/85 space-y-3"
              >
                {p.title ? (
                  <h3 className="text-white/90 font-semibold">{p.title}</h3>
                ) : null}
                <div>{p.body}</div>
              </motion.div>
            ))
          ) : paragraphs.length > 0 ? (
            paragraphs.map((html, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className="text-white/85"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ))
          ) : (
            <p className="text-white/60">
              About content isn’t configured yet. Add entries to{" "}
              <code>profile.about.poses</code> (preferred) or <code>profile.about.paragraphs</code>.
            </p>
          )}
        </div>

        {/* Gallery / Images */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {normalizedGallery.map((g, i) => (
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
                  className="h-auto w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-cyan-400/12" />
              </div>
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
