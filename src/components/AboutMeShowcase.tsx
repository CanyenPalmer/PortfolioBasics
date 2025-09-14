// src/components/AboutMeShowcase.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { profile } from "@/content/profile";
// ⬇️ Removed: import SkillsBelt from "@/components/SkillsBelt";

type AboutImage = {
  img: string;
  alt?: string;
  caption?: string;
};

type Pose = {
  title: string;
  subtitle?: string;
  alt?: string;
  src: string;
  caption?: string;
};

const poses: ReadonlyArray<Pose> = [
  {
    title: "Discovering Analytics",
    subtitle: "Canyen mid golf swing with a neon trail arc",
    src: "/about/p1.png",
    alt: "Canyen golf neon arc",
  },
  {
    title: "Composing Research",
    subtitle: "Canyen typing at a code terminal with floating hologram panels",
    src: "/about/p2.png",
    alt: "Canyen code terminal",
  },
  {
    title: "Down, But Not Out",
    subtitle: "Canyen in a hospital gown with soft lighting and a hopeful expression",
    src: "/about/p3.png",
    alt: "Canyen hospital gown",
  },
  {
    title: "The Future",
    subtitle: "Canyen facing forward with a subtle hologram HUD and confident posture",
    src: "/about/p4.png",
    alt: "Canyen future HUD",
  },
];

function Paragraphs({ text }: { text?: string }) {
  if (!text) return null;
  const parts = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      {parts.map((html, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: i * 0.04 }}
          className="text-white/85"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ))}
    </>
  );
}

export default function AboutMeShowcase() {
  const { title, kicker, paragraphs, images } = profile.about;

  const left = paragraphs?.slice?.(0, 2) ?? [];
  const right = paragraphs?.slice?.(2) ?? [];

  return (
    <section aria-label="About Me">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div className="mb-4">
            <p className="uppercase tracking-wider text-cyan-400/80 text-xs font-semibold">
              {kicker}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          </div>

          <div className="space-y-5">
            <Paragraphs text={left.join("\n\n")} />
          </div>

          {images?.slice?.(0, 2)?.length ? (
            <div className="mt-8 grid grid-cols-2 gap-4">
              {images.slice(0, 2).map((img, i) => (
                <figure key={i} className="rounded-xl border border-cyan-400/10 bg-black/20 p-2">
                  <Image
                    src={img.img}
                    alt={img.alt ?? ""}
                    width={640}
                    height={480}
                    className="rounded-lg"
                  />
                  {img.caption ? (
                    <figcaption className="text-xs text-white/60 mt-2">{img.caption}</figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <div className="space-y-5">
            <Paragraphs text={right.join("\n\n")} />
          </div>

          {images?.slice?.(2)?.length ? (
            <div className="mt-8 grid grid-cols-2 gap-4">
              {images.slice(2).map((img, i) => (
                <figure key={i} className="rounded-xl border border-cyan-400/10 bg-black/20 p-2">
                  <Image
                    src={img.img}
                    alt={img.alt ?? ""}
                    width={640}
                    height={480}
                    className="rounded-lg"
                  />
                  {img.caption ? (
                    <figcaption className="text-xs text-white/60 mt-2">{img.caption}</figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* ⬇️ Removed the bottom toolbelt rail from About */}
      {/* <div className="mt-10">
        <SkillsBelt speedSeconds={26} />
      </div> */}
    </section>
  );
}

