"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  heading: string;
  lead?: string;
  body?: string[];
  images?: string[];
};

export default function AboutMe({ heading, lead, body = [], images = [] }: Props) {
  return (
    <div className="relative">
      {/* Section header */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold"
      >
        {heading}
      </motion.h2>

      {lead && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.05, duration: 0.5 }}
          className="mt-3 text-white/80 max-w-3xl"
        >
          {lead}
        </motion.p>
      )}

      {/* Content */}
      <div className="mt-10 grid md:grid-cols-2 gap-10 items-start">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="space-y-5"
        >
          {body.map((p, i) => (
            <p key={i} className="text-white/80 leading-relaxed">
              {p}
            </p>
          ))}
        </motion.div>

        {/* Images (safe if files missing) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.05, duration: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          {images.length === 0 ? (
            <div className="col-span-2 text-sm text-white/50">
              (Add your About images at <code>/public/about/</code> and list their paths in <code>app/page.tsx</code>.)
            </div>
          ) : (
            images.map((src, idx) => (
              <div key={idx} className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/10 bg-white/5">
                {/* Fallback if an image is missing */}
                {/* next/image will error if the file truly doesn't exist in prod build; to keep your deploy safe,
                    we wrap it with a plain <img> fallback for dev. */}
                <Image
                  src={src}
                  alt={`About image ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement & { src?: string };
                    if (target) {
                      // Swap to a simple <img> fallback by replacing the element
                      const wrapper = target.closest("span"); // next/image wrapper
                      if (wrapper) {
                        wrapper.outerHTML = `<img src="/placeholder.jpg" alt="placeholder" style="width:100%;height:100%;object-fit:cover;opacity:.75;" />`;
                      }
                    }
                  }}
                />
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
