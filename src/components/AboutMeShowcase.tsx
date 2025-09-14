// src/components/AboutMeShowcase.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { profile } from "@/content/profile";
// Removed: import SkillsBelt from "@/components/SkillsBelt";

type AboutImage = {
  img: string;
  alt?: string;
  caption?: string;
};

type Pose = {
  id?: number;
  key?: string;
  title?: string;
  subtitle?: string;
  alt?: string;
  img?: string;
  body?: React.ReactNode;
};

export default function AboutMeShowcase() {
  const about: any = (profile as any)?.about ?? {};
  const title: string = about?.title ?? "About Me";

  // Your primary source of truth (JSX bodies + optional img/alt)
  const poses: Pose[] = Array.isArray(about?.poses) ? (about.poses as Pose[]) : [];

  // Legacy fallback fields (HTML strings + gallery)
  const paragraphs: string[] = Array.isArray(about?.paragraphs) ? about.paragraphs : [];
  const gallery: AboutImage[] = Array.isArray(about?.gallery) ? (about.gallery as AboutImage[]) : [];

  // Normalize gallery items without a type guard
  const normalizedGallery: { img: string; alt?: string }[] = React.useMemo(() => {
    if (poses.length > 0) {
      return poses.flatMap((p) => (p?.img ? [{ img: p.img as string, alt: p.alt }] : []));
    }
    if (gallery.length > 0) {
      return gallery.flatMap((g) => (g?.img ? [{ img: g.img as string, alt: g.alt }] : []));
    }
    return [];
  }, [poses, gallery]);

  // Render
  return (
    <section id="about" aria-label="About">
      <h2 className="mb-6 text-xl font-semibold tracking-wide text-cyan-200">{title}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left column: text content */}
        <div className="space-y-5">
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
                {p.title ? <h3 className="text-white/90 font-semibold">{p.title}</h3> : null}
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

        {/* Right column: image grid (from poses or gallery) */}
        <div className="grid grid-cols-2 gap-4 self-start">
          {normalizedGallery.map((g, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400/10 to-purple-400/10"
            >
              <Image
                src={g.img}
                alt={g.alt ?? ""}
                width={640}
                height={480}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-cyan-400/12" />
            </motion.figure>
          ))}
        </div>
      </div>

      {/* Removed the toolbelt rail from About */}
      {/* <div className="mt-10">
        <SkillsBelt speedSeconds={26} />
      </div> */}
    </section>
  );
}

