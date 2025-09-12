"use client";

import { motion } from "framer-motion";

type ExperienceItem = {
  title: string;
  org?: string;
  date: string;       // "2023 — Present"
  highlight?: string; // "250k+ rows analyzed"
};

type Props = {
  id?: string; // keep #experience anchor
  heading?: string;
  items: ExperienceItem[];
  className?: string;
};

/**
 * Terminal-style experience timeline:
 * - Vertical rail + glowing nodes
 * - Each role reveals like a console log
 * - Right-hand metric highlight (keep your exact facts)
 */
export default function ExperienceLog({
  id = "experience",
  heading = "EXPERIENCE — BATTLE RECORDS",
  items,
  className,
}: Props) {
  return (
    <section
      id={id}
      aria-label="Experience"
      className={`relative bg-[#0b1016] px-6 sm:px-8 md:px-12 py-20 text-white ${className ?? ""}`}
    >
      <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-[#0c1117]/60 p-6 md:p-10 shadow-[0_0_32px_rgba(0,229,255,.08)]">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-wide text-cyan-300" style={{ textShadow: "0 0 18px rgba(0,229,255,.2)" }}>
            {heading}
          </h2>
          <div className="mt-2 h-px w-full bg-gradient-to-r from-cyan-300/60 via-cyan-300/20 to-transparent" />
        </div>

        <div className="relative grid grid-cols-[16px_1fr_auto] gap-x-6 md:gap-x-8">
          {/* Vertical rail */}
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-cyan-300/30" />
          </div>

          <div className="col-span-2 flex flex-col gap-10">
            {items.map((item, idx) => (
              <motion.div
                key={`${item.title}-${idx}`}
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-[16px_1fr_auto] gap-x-6 md:gap-x-8"
              >
                {/* Node */}
                <div className="relative">
                  <span className="absolute left-[1px] top-1 size-3 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(0,229,255,.6)]" />
                </div>

                {/* Role */}
                <div>
                  <div className="text-lg md:text-xl font-medium">{item.title}</div>
                  {item.org && <div className="text-sm text-white/70">{item.org}</div>}
                  <div className="text-sm text-white/60">{item.date}</div>
                </div>

                {/* Metric */}
                <div className="self-center text-cyan-300/95 text-right text-base md:text-lg">
                  {item.highlight || ""}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
