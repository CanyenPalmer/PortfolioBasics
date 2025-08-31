"use client";

import * as React from "react";
import { motion } from "framer-motion";

type Card = { id: string; label: string; blurb?: string };

const ROLES: Card[] = [
  { id: "role-ds", label: "Data Science", blurb: "Modeling, experimentation, ML." },
  { id: "role-de", label: "Data Engineer", blurb: "Pipelines, SQL/dbt, orchestration." },
  { id: "role-da", label: "Data Analyst", blurb: "Dashboards, analytics engineering, viz." },
];

const LOCATIONS: Card[] = [
  { id: "loc-in-onsite", label: "Indiana: On-Site" },
  { id: "loc-global-remote", label: "Globally: Remote" },
];

export default function ServicesGlobe() {
  return (
    <section
      id="services"
      className="relative py-20 bg-[var(--hud-bg,#0b1016)] overflow-hidden"
      style={{ contain: "content", isolation: "isolate" }}
    >
      <div className="mx-auto w-full max-w-5xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-center text-cyan-300 tracking-wide text-3xl md:text-4xl font-semibold"
        >
          MY SERVICES & AVAILABILITY
        </motion.h2>

        {/* Hologram Globe */}
        <div className="holo-beam relative mx-auto mt-10 w-full max-w-[560px] sm:max-w-[520px] aspect-square px-2">
          <GlobeSVG className="holo-scan holo-spin-slow absolute inset-0" />
        </div>

        {/* ROLES */}
        <div className="mt-10">
          <div className="text-cyan-200/90 text-sm tracking-[0.2em] mb-3">ROLES</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ROLES.map((r) => (
              <HoloCard key={r.id} label={r.label} blurb={r.blurb} variant="primary" />
            ))}
          </div>
        </div>

        {/* LOCATIONS */}
        <div className="mt-8">
          <div className="text-cyan-200/90 text-sm tracking-[0.2em] mb-3">LOCATIONS</div>
          <div className="grid gap-4 sm:grid-cols-2">
            {LOCATIONS.map((l) => (
              <HoloCard key={l.id} label={l.label} variant="alt" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GlobeSVG({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512" aria-hidden="true" role="img">
      <defs>
        {/* Dither pattern */}
        <pattern id="dither" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="black" opacity="0" />
          <rect x="0" y="0" width="2" height="2" fill="var(--neon-cyan)" opacity="0.9" />
          <rect x="2" y="2" width="2" height="2" fill="var(--neon-cyan)" opacity="0.9" />
        </pattern>

        {/* Sphere shading */}
        <radialGradient id="shade" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="black" stopOpacity="0.15" />
        </radialGradient>

        {/* Neon glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform="translate(256,256)">
        {/* Outer neon ring */}
        <circle r="200" fill="none" stroke="var(--neon-cyan)" strokeWidth="2" filter="url(#glow)" opacity="0.9" />
        {/* Inner magenta accent */}
        <circle r="196" fill="none" stroke="var(--neon-magenta)" strokeWidth="1" opacity="0.5" />

        {/* Dithered fill */}
        <mask id="maskShade">
          <circle r="196" fill="url(#shade)" />
        </mask>
        <circle r="196" fill="url(#dither)" mask="url(#maskShade)" />

        {/* Latitude lines */}
        {[-120,-90,-60,-30,0,30,60,90,120].map((lat) => (
          <ellipse
            key={`lat-${lat}`}
            rx={196 * Math.cos((Math.abs(lat) * Math.PI) / 180)}
            ry={196}
            transform={`rotate(90) rotate(${lat})`}
            fill="none"
            stroke="var(--neon-cyan)"
            strokeOpacity="0.12"
            strokeWidth="1"
          />
        ))}
        {/* Longitude lines */}
        {[...Array(12)].map((_, i) => {
          const ang = (i * 180) / 12;
          return (
            <ellipse
              key={`lon-${i}`}
              rx={196}
              ry={196 * 0.2}
              transform={`rotate(${ang})`}
              fill="none"
              stroke="var(--neon-cyan)"
              strokeOpacity="0.09"
              strokeWidth="1"
            />
          );
        })}
      </g>
    </svg>
  );
}

function HoloCard({
  label,
  blurb,
  variant = "primary",
}: {
  label: string;
  blurb?: string;
  variant?: "primary" | "alt";
}) {
  const neonClass = variant === "primary" ? "holo-border" : "holo-border-alt";
  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 320, damping: 22 }}>
      <div className={`relative overflow-hidden rounded-xl bg-transparent ${neonClass}`}>
        <div className="p-5 relative">
          <div className="text-cyan-100 font-medium">{label}</div>
          {blurb && <p className="mt-1 text-cyan-200/70 text-sm">{blurb}</p>}
          <div className="holo-scan pointer-events-none absolute inset-0" />
        </div>
      </div>
    </motion.div>
  );
}
