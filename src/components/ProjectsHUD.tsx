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
              {/* Title */}
              <h3 className="text-lg font-semibold text-cyan-200">{p.title}</h3>

              {/* Tech stack */}
              {Array.isArray(p.tech) && p.tech.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.tech.map((t: string, ti: number) => (
                    <span
                      key={ti}
                      className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-xs text-cyan-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Points */}
              {Array.isArray(p.points) && p.points.length > 0 && (
                <ul className="mt-3 list-disc space-y-1.5 pl-6 text-sm text-white/85">
                  {p.points.map((pt: string, pi: number) => (
                    <li key={pi} dangerouslySetInnerHTML={{ __html: pt }} />
                  ))}
                </ul>
              )}

              {/* Details */}
              {p.details && (
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {Object.entries(p.details).map(([k, arr]: [string, any]) => {
                    if (!Array.isArray(arr) || arr.length === 0) return null;
                    const title = k[0].toUpperCase() + k.slice(1);
                    return (
                      <div
                        key={k}
                        className="rounded-md border border-cyan-400/10 bg-black/20 p-3"
                      >
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-cyan-300/90">
                          {title}
                        </div>
                        <ul className="list-disc space-y-1 pl-5 text-sm text-white/85">
                          {arr.map((x: string, xi: number) => (
                            <li key={xi} dangerouslySetInnerHTML={{ __html: x }} />
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Links */}
              {Array.isArray(p.links) && p.links.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {p.links.map((l: any, li: number) => (
                    <a
                      key={li}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-sm text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200"
                    >
                      {l.label ?? "Link"}
                    </a>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </SectionPanel>
    </section>
  );
}
