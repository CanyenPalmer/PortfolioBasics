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
 * Safe by design:
 * - Uses the same content source (profile.about.poses)
 * - If a pose has no image, it is skipped on the right column (layout still clean)
 * - Only this About component changes; the rest of the site is untouched
 */
export default function AboutMeShowcase() {
  const poses: Pose[] = (profile.about?.poses as unknown as Pose[]) ?? [];

  return (
    <section id="about" className="px-6 md:px-10 lg:px-16 py-16 md:py-24 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16">
        {/* LEFT: Text stack */}
        <div className="space-y-12 md:space-y-16 max-w-3xl">
          {poses.map((p, idx) => (
            <article key={String(p.id ?? p.key ?? (typeof p.title === "string" ? p.title : idx))}>
              {p.title ? (
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">{p.title}</h3>
              ) : null}
              <div className="prose prose-invert prose-p:leading-relaxed prose-headings:mt-0 prose-headings:mb-4 text-white/90">
                {p.body}
              </div>
            </article>
          ))}
        </div>

        {/* RIGHT: Vertical image stack (in pose order) */}
        <div className="space-y-8 md:space-y-10">
          {poses.map((p, idx) =>
            p.img ? (
              <figure
                key={`img-${String(p.id ?? p.key ?? idx)}`}
                className="w-full"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src={p.img}
                    alt={p.alt ?? ""}
                    fill
                    sizes="(min-width: 1024px) 640px, 100vw"
                    className="object-cover"
                    priority={idx <= 1}
                  />
                </div>
                {/* Optional: small caption if ever needed
                {typeof p.title === "string" ? (
                  <figcaption className="mt-2 text-sm text-white/60">{p.title}</figcaption>
                ) : null}
                */}
              </figure>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}
