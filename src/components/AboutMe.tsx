"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  heading: string;
  lead?: string;
  body?: string[];
  images?: string[]; // e.g., ["/about/impact-dashboard.jpg", ...]
};

export default function AboutMe({ heading, lead, body = [], images = [] }: Props) {
  return (
    <section id="about" className="section-wrap">
      <div className="hud-panel">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="neon-title"
        >
          {heading.toUpperCase()}
        </motion.h2>

        {lead && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="mt-4 text-white/80 max-w-3xl"
          >
            {lead}
          </motion.p>
        )}

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

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            {images.length === 0 ? (
              <div className="col-span-2 text-sm text-white/50">
                (Add images under <code>/public/about/</code> and pass their paths to <code>images</code>.)
              </div>
            ) : (
              images.map((src, idx) => (
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
              ))
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
