"use client";

import { motion, useAnimationControls } from "framer-motion";
import * as React from "react";

type Props = {
  linkedinHref?: string;
  githubHref?: string;
  emailHref?: string;
  tagline?: string;
};

/**
 * ContactReactor — single centered SVG with stems attached to rings
 * - ONE SVG (900x900), shared center (450,450)
 * - 3 static rings + pulsing core
 * - 3 rotating arms: stem begins ON ring circumference, extends outward to node
 * - Arms rotate around the core (no in-place spinning) via translate-to-center, then rotate
 * - Brand icons in nodes (inline SVG paths)
 */
export default function ContactReactor({
  linkedinHref = "https://www.linkedin.com/in/canyen-palmer-b0b6762a0",
  githubHref = "https://github.com/CanyenPalmer",
  emailHref = "mailto:Canyen2019@gmail.com",
  tagline = "Always Learning, Always Building - Let's Connect",
}: Props) {
  const coreControls = useAnimationControls();

  React.useEffect(() => {
    const loop = async () => {
      while (true) {
        await coreControls.start({ scale: 1.045, transition: { duration: 2.0, ease: "easeInOut" } });
        await coreControls.start({ scale: 1, transition: { duration: 2.0, ease: "easeInOut" } });
      }
    };
    loop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // === Single SVG coordinate system ===
  const W = 900, H = 900;
  const CX = 450, CY = 450;

  // Orbits (match visual rings)
  const R1 = 200;  // inner
  const R2 = 300;  // middle
  const R3 = 380;  // outer (fits within 900px with halo)

  // Node + stem styling
  const NODE_R = 28;             // 56px diameter
  const HALO = 14;               // halo ring
  const STEM_GAP = 12;           // gap between ring and node edge
  const BRANCH = "#67e8f9";
  const STEM_STROKE = 3;

  // Since arms are built in a local coord system at the center,
  // x positions are relative to (0,0) = center.
  // Ring point is at (r, 0). Node sits further on +X.
  const stemEndX = (r: number) => r + STEM_GAP + NODE_R - 3; // -3 to tuck under badge
  const nodeCenterX = (r: number) => r + STEM_GAP + NODE_R;

  // Brand icons (lucide-like)
  const IconGithub = ({ x, y, size = 20 }: { x: number; y: number; size?: number }) => {
    const s = size;
    return (
      <g transform={`translate(${x - s / 2}, ${y - s / 2})`} fill="none" stroke="#e6fdff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 23c-4.5 1.5-4.5-2.5-6-3m12 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 18 5.77 5.07 5.07 0 0 0 17.91 2S16.73 1.65 14 3.46a13.38 13.38 0 0 0-6 0C5.27 1.65 4.09 2 4.09 2A5.07 5.07 0 0 0 4 5.77 5.44 5.44 0 0 0 2.5 9.5c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 19.13V23" />
      </g>
    );
  };
  const IconLinkedIn = ({ x, y, size = 20 }: { x: number; y: number; size?: number }) => {
    const s = size;
    return (
      <g transform={`translate(${x - s / 2}, ${y - s / 2})`} fill="none" stroke="#e6fdff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2" />
        <path d="M7 17v-7" />
        <circle cx="7" cy="7" r="1" />
        <path d="M11 17v-4a2 2 0 0 1 4 0v4" />
      </g>
    );
  };
  const IconMail = ({ x, y, size = 20 }: { x: number; y: number; size?: number }) => {
    const s = size;
    return (
      <g transform={`translate(${x - s / 2}, ${y - s / 2})`} fill="none" stroke="#e6fdff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 6-10 7L2 6" />
      </g>
    );
  };

  // SVG-only node for perfect alignment
  const Node = ({ href, label, x, y, children }: { href: string; label: string; x: number; y: number; children: React.ReactNode }) => (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer noopener" style={{ cursor: "pointer" }}>
      {/* halo */}
      <circle cx={x} cy={y} r={NODE_R + HALO} fill="none" stroke={BRANCH} strokeOpacity={0.18} />
      {/* badge */}
      <circle cx={x} cy={y} r={NODE_R} fill="rgba(34,211,238,0.10)" stroke={BRANCH} strokeOpacity={0.45} />
      {children}
      <title>{label}</title>
    </a>
  );

  return (
    <section id="contact" aria-label="Contact" className="relative isolate overflow-hidden py-28 sm:py-36">
      {/* background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.08),transparent_60%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Let&apos;s Build Together</h2>
          <p className="mt-3 text-balance text-sm text-white/70">Open to conversations, collaborations, and new challenges.</p>
        </div>

        {/* Single, perfectly centered SVG stage */}
        <div className="relative mx-auto flex items-center justify-center">
          <motion.svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block">
            {/* defs */}
            <defs>
              <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.95" />
                <stop offset="55%" stopColor="#6366f1" stopOpacity="0.88" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.75" />
              </radialGradient>
              <linearGradient id="coreRing" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={BRANCH} stopOpacity={0.40} />
                <stop offset="100%" stopColor={BRANCH} stopOpacity={0.10} />
              </linearGradient>
            </defs>

            {/* static rings (concentric) */}
            <circle cx={CX} cy={CY} r={R1} stroke={BRANCH} strokeOpacity={0.22} strokeWidth={1.6} fill="none" />
            <circle cx={CX} cy={CY} r={R2} stroke={BRANCH} strokeOpacity={0.16} strokeWidth={1.6} fill="none" />
            <circle cx={CX} cy={CY} r={R3} stroke={BRANCH} strokeOpacity={0.12} strokeWidth={1.6} fill="none" />

            {/* core */}
            <motion.g animate={coreControls}>
              <circle cx={CX} cy={CY} r={118} fill="url(#coreGlow)" opacity={0.9} />
              <motion.circle
                cx={CX} cy={CY} r={128} fill="none" stroke="url(#coreRing)" strokeWidth={1.5}
                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
                style={{ transformOrigin: `${CX}px ${CY}px` }}
              />
            </motion.g>

            {/* === ARMS: translate to center, then rotate — this creates orbit (no self-spin) === */}

            {/* Inner orbit — CW — GitHub */}
            <motion.g
              initial={{ rotate: 320 }}
              animate={{ rotate: 320 + 360 }}
              transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
            >
              <g transform={`translate(${CX}, ${CY})`}>
                {/* stem: starts ON ring, extends outward */}
                <line
                  x1={R1} y1={0}
                  x2={stemEndX(R1)} y2={0}
                  stroke={BRANCH} strokeOpacity={0.85} strokeWidth={STEM_STROKE} strokeLinecap="round"
                />
                {/* node: just beyond ring */}
                <Node href={githubHref} label="GitHub" x={nodeCenterX(R1)} y={0}>
                  <IconGithub x={nodeCenterX(R1)} y={0} />
                </Node>
              </g>
            </motion.g>

            {/* Middle orbit — CCW — LinkedIn */}
            <motion.g
              initial={{ rotate: 180 }}
              animate={{ rotate: 180 - 360 }}
              transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
            >
              <g transform={`translate(${CX}, ${CY})`}>
                <line
                  x1={R2} y1={0}
                  x2={stemEndX(R2)} y2={0}
                  stroke={BRANCH} strokeOpacity={0.85} strokeWidth={STEM_STROKE} strokeLinecap="round"
                />
                <Node href={linkedinHref} label="LinkedIn" x={nodeCenterX(R2)} y={0}>
                  <IconLinkedIn x={nodeCenterX(R2)} y={0} />
                </Node>
              </g>
            </motion.g>

            {/* Outer orbit — CW — Email */}
            <motion.g
              initial={{ rotate: 40 }}
              animate={{ rotate: 40 + 360 }}
              transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
            >
              <g transform={`translate(${CX}, ${CY})`}>
                <line
                  x1={R3} y1={0}
                  x2={stemEndX(R3)} y2={0}
                  stroke={BRANCH} strokeOpacity={0.85} strokeWidth={STEM_STROKE} strokeLinecap="round"
                />
                <Node href={emailHref} label="Email" x={nodeCenterX(R3)} y={0}>
                  <IconMail x={nodeCenterX(R3)} y={0} />
                </Node>
              </g>
            </motion.g>
          </motion.svg>
        </div>

        {/* Tagline */}
        <p className="mt-28 text-center text-base text-white/80">{tagline}</p>
      </div>
    </section>
  );
}
