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
 * - ONE SVG (840x840), shared center (420,420)
 * - 3 static rings + pulsing core
 * - 3 rotating arms: stem begins ON ring circumference, extends outward to node
 * - Brand icons in nodes (inline paths)
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
  const W = 840, H = 840;
  const CX = 420, CY = 420;

  // Orbits (match visual rings)
  const R1 = 190;  // inner
  const R2 = 280;  // middle
  const R3 = 360;  // outer

  // Node + stem styling
  const NODE_R = 28;             // 56px diameter
  const STEM_GAP = 12;           // gap between ring and node edge
  const BRANCH = "#67e8f9";
  const STEM_STROKE = 3;

  // Given a ring radius r, compute stem start (on ring), end (near node), and node center
  const stemStartX = (r: number) => CX + r;                                             // on ring
  const nodeCenterX = (r: number) => CX + r + STEM_GAP + NODE_R;                        // after gap + node radius
  const stemEndX   = (r: number) => nodeCenterX(r) - (NODE_R - 3);                      // tuck under badge by 3px

  // Brand icons (lucide-style strokes) centered at (x,y)
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

  // SVG-only node for pixel-perfect alignment
  const Node = ({
    href, label, x, y, children,
  }: { href: string; label: string; x: number; y: number; children: React.ReactNode }) => (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer noopener" style={{ cursor: "pointer" }}>
      {/* halo */}
      <circle cx={x} cy={y} r={NODE_R + 14} fill="none" stroke={BRANCH} strokeOpacity={0.18} />
      {/* badge */}
      <circle cx={x} cy={y} r={NODE_R} fill="rgba(34,211,238,0.10)" stroke={BRANCH} strokeOpacity={0.45} />
      {/* icon */}
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
          <motion.svg width={840} height={840} viewBox="0 0 840 840" className="block">
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
              <circle cx={CX} cy={CY} r={110} fill="url(#coreGlow)" opacity={0.9} />
              <motion.circle
                cx={CX} cy={CY} r={120} fill="none" stroke="url(#coreRing)" strokeWidth={1.5}
                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
                style={{ transformOrigin: `${CX}px ${CY}px` }}
              />
            </motion.g>

            {/* === ARMS (rotate around same center). IMPORTANT:
                 stem starts ON ring (stemStartX), ends before node (stemEndX).
                 node is placed after a gap so it reads as "attached to ring". === */}

            {/* Inner orbit — CW — GitHub */}
            <motion.g
              initial={{ rotate: 320 }}
              animate={{ rotate: 320 + 360 }}
              transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            >
              {/* stem attached to inner ring */}
              <line
                x1={stemStartX(R1)} y1={CY}
                x2={stemEndX(R1)}   y2={CY}
                stroke={BRANCH} strokeOpacity={0.85} strokeWidth={STEM_STROKE} strokeLinecap="round"
              />
              {/* node just outside ring */}
              <Node href={githubHref} label="GitHub" x={nodeCenterX(R1)} y={CY}>
                <IconGithub x={nodeCenterX(R1)} y={CY} />
              </Node>
            </motion.g>

            {/* Middle orbit — CCW — LinkedIn */}
            <motion.g
              initial={{ rotate: 180 }}
              animate={{ rotate: 180 - 360 }}
              transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            >
              <line
                x1={stemStartX(R2)} y1={CY}
                x2={stemEndX(R2)}   y2={CY}
                stroke={BRANCH} strokeOpacity={0.85} strokeWidth={STEM_STROKE} strokeLinecap="round"
              />
              <Node href={linkedinHref} label="LinkedIn" x={nodeCenterX(R2)} y={CY}>
                <IconLinkedIn x={nodeCenterX(R2)} y={CY} />
              </Node>
            </motion.g>

            {/* Outer orbit — CW — Email */}
            <motion.g
              initial={{ rotate: 40 }}
              animate={{ rotate: 40 + 360 }}
              transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            >
              <line
                x1={stemStartX(R3)} y1={CY}
                x2={stemEndX(R3)}   y2={CY}
                stroke={BRANCH} strokeOpacity={0.85} strokeWidth={STEM_STROKE} strokeLinecap="round"
              />
              <Node href={emailHref} label="Email" x={nodeCenterX(R3)} y={CY}>
                <IconMail x={nodeCenterX(R3)} y={CY} />
              </Node>
            </motion.g>
          </motion.svg>
        </div>

        {/* Tagline */}
        <p className="mt-28 text-center text-base text-white/80">{tagline}</p>
      </div>
    </section>
  );
}
