// src/components/AboutMeShowcase.tsx
import * as React from "react";
import Image from "next/image";
import { profile } from "@/content/profile";

/** Minimal shape of an About pose item from profile.about.poses */
type Pose = {
  id?: number | string;
  key?: string;
  title?: React.ReactNode;
  body?: React.ReactNode;
  img?: string;
  alt?: string;
};

/**
 * AboutMeShowcase — Two-column layout:
 * - LEFT: all text sections stacked in order (title + body for each pose)
 * - RIGHT: all images stacked vertically in the same order
 *
 * Adjusted to prevent cropping:
 * - Uses `object-contain` instead of `object-cover`
 * - Auto-adjusts height by intrinsic image ratio
 * - Wraps each image in a responsive container so it scales cleanly
 */
export default function AboutMeShowcase() {
  const poses: Pose[] = (profile.about?.poses as unknown as Pose[]) ?? [];

  return (
    <section
      id="about"
      className="px-6 md:px-10 lg:px-16 py-16 md:py-24 max-w-6xl mx-auto"
    >
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        {/* LEFT: Text stack */}
        <div className="space-y-12 md:space-y-16 max-w-3xl">
          {poses.map((p, idx) => (
            <article
              key={String(p.id ?? p.key ?? (typeof p.title === "string" ? p.title : idx))}
            >
              {p.title ? (
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
                  {p.title}
                </h3>
              ) : null}
              <div className="prose prose-invert prose-p:leading-relaxed prose-headings:mt-0 prose-headings:mb-4 text-white/90">
                {p.body}
              </div>
            </article>
          ))}
        </div>

        {/* RIGHT: Vertical image stack (no cropping) */}
        <div className="space-y-10">
          {poses.map((p, idx) =>
            p.img ? (
              <figure
                key={`img-${String(p.id ?? p.key ?? idx)}`}
                className="w-full"
              >
                <div className="relative w-full">
                  <Image
                    src={p.img}
                    alt={p.alt ?? ""}
                    width={1200}
                    height={900}
                    className="w-full h-auto object-contain rounded-xl"
                    priority={idx <= 1}
                  />
                </div>
              </figure>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}
