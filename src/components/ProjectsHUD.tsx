"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type Project = {
  title: string;
  summary: string;
  tags: string[];
  chart?: number[]; // simple inline bar chart values
  href?: string;
};

type Props = {
  heading?: string;
  projects: Project[];
  sideIllustrationSrc?: string; // optional manga/cyber portrait
};

export default function Projects({
  heading = "Projects",
  projects,
  sideIllustrationSrc,
}: Props) {
  return (
    <section id="projects" className="section-wrap">
      <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-10 items-start">
        <Panel>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="neon-title magenta"
          >
            {heading.toUpperCase()}
          </motion.h2>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {projects.map((p, i) => (
              <motion.a
                key={i}
                href={p.href ?? "#"}
                target={p.href ? "_blank" : undefined}
                rel={p.href ? "noreferrer" : undefined}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-white/20 hover:bg-white/[0.05] transition"
              >
                <div className="text-lg font-semibold">{p.title}</div>
                <p className="mt-1 text-white/70 text-sm">{p.summary}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t, j) => (
                    <span
                      key={j}
                      className="text-xs px-2 py-1 rounded-md ring-1 ring-white/15 bg-white/[0.04]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {p.chart && p.chart.length > 0 && (
                  <div className="mt-4 rounded-xl bg-black/30 p-3 ring-1 ring-white/10">
                    <MiniBars values={p.chart} />
                  </div>
                )}
              </motion.a>
            ))}
          </div>
        </Panel>

        {/* Optional illustration column */}
        <div className="relative hidden lg:block">
          <div className="sticky top-24">
            <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden ring-1 ring-white/10 bg-white/5">
              <div className="absolute -inset-6 bg-[#00e5ff22] blur-3xl pointer-events-none" />
              {sideIllustrationSrc ? (
                <Image
                  src={sideIllustrationSrc}
                  alt="Cyber illustration"
                  fill
                  sizes="40vw"
                  className="object-cover opacity-[.9] mix-blend-screen"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-white/40 text-sm p-6 text-center">
                  (Add a stylized portrait at <code>/public/illustrations/side.png</code> and pass its path as <code>sideIllustrationSrc</code>.)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="hud-panel">{children}</div>;
}

function MiniBars({ values }: { values: number[] }) {
  // simple inline SVG bar chart (neon-ish)
  const max = Math.max(...values);
  const width = 280;
  const height = 120;
  const pad = 12;
  const barW = (width - pad * 2) / values.length - 6;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <defs>
        <linearGradient id="neon" x1="0" x2="0" y1="1" y2="0">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={width} height={height} rx="10" fill="rgba(255,255,255,0.03)" />
      {values.map((v, i) => {
        const h = (v / max) * (height - pad * 2);
        const x = pad + i * (barW + 6);
        const y = height - pad - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={h} rx="6" fill="url(#neon)" />
            <rect x={x} y={y} width={barW} height={h} rx="6" fill="none" stroke="#00e5ff" strokeOpacity=".4" />
          </g>
        );
      })}
    </svg>
  );
}
