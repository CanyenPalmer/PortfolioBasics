// src/components/AboutMeShowcase.tsx
import * as React from "react";
import Image from "next/image";
import { profile } from "@/content/profile";

/**
 * AboutMeShowcase — Vertical, free-flow layout (no panels)
 *
 * What changed:
 * - Images now stack vertically with their corresponding text blocks.
 * - Uses the same content source: profile.about.poses
 * - No changes required to page.tsx or other sections.
 *
 * Safe by design:
 * - If a pose has no image, the image block is simply omitted (no layout break).
 * - Keeps a consistent 4:3 aspect ratio to match your existing /public/about/* assets.
 * - Adds subtle alternating x-translation on desktop so the stack breathes (no heavy framing).
 */
export default function AboutMeShowcase() {
  const poses = profile.about?.poses ?? [];

  return (
    <section id="about" className="px-6 md:px-10 lg:px-16 py-16 md:py-24 max-w-6xl mx-auto">
      <div className="space-y-16 md:space-y-24">
        {poses.map((p, idx) => (
          <article key={p.id ?? p.title ?? idx} className="max-w-3xl">
            {/* Title */}
            {p.title ? (
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
                {p.title}
              </h3>
            ) : null}

            {/* Body (already JSX in your content file) */}
            <div className="prose prose-invert prose-p:leading-relaxed prose-headings:mt-0 prose-headings:mb-4 text-white/90">
              {p.body}
            </div>

            {/* Image (stacked under text) */}
            {p.img ? (
              <div
                className={[
                  "mt-6 md:mt-8",
                  // Subtle alternating alignment on desktop to keep it airy without panels
                  idx % 2 === 1
                    ? "md:translate-x-6 lg:translate-x-12"
                    : "md:-translate-x-6 lg:-translate-x-12",
                ].join(" ")}
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src={p.img}
                    alt={p.alt ?? ""}
                    fill
                    sizes="(min-width: 1024px) 900px, 100vw"
                    className="object-cover"
                    priority={idx <= 1}
                  />
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
