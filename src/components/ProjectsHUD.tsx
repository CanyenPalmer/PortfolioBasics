"use client";

import * as React from "react";
import { motion } from "framer-motion";
import SectionPanel from "@/components/ui/SectionPanel";
import { profile } from "@/content/profile";

export default function ProjectsHUD() {
  const projects = ((profile as any)?.projects ?? []) as ReadonlyArray<any>;

  return (
    <section id="projects" aria-label="Projects" className="relative">
      <SectionPanel title="Projects" className="mx-auto max-w-7xl">
        <div className="space-y-6">
          {projects.map((p, i) => (
            <motion.article
              key={p.title ?? i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.03 }}
              className="rounded-lg border border-cyan-400/10 bg-black/20 p-5"
            >
              <h3 className="text-lg font-semibold text-cyan-200">
                {p.title}
              </h3>
              {/* …existing content unchanged… */}
            </motion.article>
          ))}
        </div>
      </SectionPanel>
    </section>
  );
}
