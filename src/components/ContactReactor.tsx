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
 * ContactReactor (single centered SVG)
 * - ONE SVG (840x840). Shared center at (420,420).
 * - Concentric rings, pulsing core, 3 rotating arms.
 * - Branch lines meet the node AT ITS EDGE (not through the center).
 * - Wide initial angle separation so nodes don't bunch.
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
        await coreControls.start({
          scale: 1.045,
          transition: { duration: 2.0, ease: "easeInOut" },
        });
        await coreControls.start({
          scale: 1,
          transition: { duration: 2.0, ease: "easeInOut" },
        });
      }
    };
    loop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // === Single SVG coordinate system ===
  const W = 840;
  const H = 840;
  const CX = 420;
  const CY = 420;

  // Orbits — slightly larger for better separation
  const R1 = 180; // inner
  const R2 = 270; // middle
  const R3 = 360; // outer

  // Node styling
  const NODE_R = 28; // 56px diameter
  const BRANCH = "#67e8f9";

  // Utility: endpoint for branch that meets node *edge*, not center
  const branchEndX = (radius: number) => CX + radius - (NODE_R - 4); // 4px inset so the line tucks cleanly
  const nodeCenterX = (radius: number) => CX + radius;

  // Minimal node (SVG-only for perfect alignment)
  const Node = ({
    href,
    label,
    x,
    y,
    text,
  }: {
    href: string;
    label: string;
    x: number;
    y: number;
    text: string;
  }) => (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer noopener">
      {/* halo */}
      <circle cx={x} cy={y} r={NODE_R + 14} fill="none" stroke={BRANCH} strokeOpacity={0.18} />
      {/* badge */}
      <circle cx={x} cy={y} r={NODE_R} fill="rgba(34,211,238,0.10)" stroke={BRANCH} strokeOpacity={0.45} />
      {/* glyph */}
      <text
        x={x}
        y={y + 6}
        textAnchor="middle"
        fontSize="16"
        fontWeight={600}
        fill="#e6fdff"
        aria-label={label}
        style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" }}
      >
        {text}
      </text>
      <title>{label}</title>
    </a>
  );

  return (
    <section id="contact" aria-label="Contact" className="relative isolate overflow-hidden py-28 sm:py-36">
      {/* vignette + dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.08),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Let&apos;s Build Together</h2>
          <p className="mt-3 text-balance text-sm text-white/70">
            Open to conversations, collaborations, and new challenges.
          </p>
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

            {/* rings (concentric) */}
            <circle cx={CX} cy={CY} r={R1} stroke={BRANCH} strokeOpacity={0.22} strokeWidth={1.6} fill="none" />
            <circle cx={CX} cy={CY} r={R2} stroke={BRANCH} strokeOpacity={0.16} strokeWidth={1.6} fill="none" />
            <circle cx={CX} cy={CY} r={R3} stroke={BRANCH} strokeOpacity={0.12} strokeWidth={1.6} fill="none" />

            {/* core */}
            <motion.g animate={coreControls}>
              <circle cx={CX} cy={CY} r={104} fill="url(#coreGlow)" opacity={0.9} />
              <motion.circle
                cx={CX}
                cy={CY}
                r={114}
                fill="none"
                stroke="url(#coreRing)"
                strokeWidth={1.5}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
                style={{ transformOrigin: `${CX}px ${CY}px` }}
              />
            </motion.g>

            {/* ARMS — rotate as groups around (CX,CY) */}

            {/* Inner: CW (GitHub) — initial 330° */}
            <motion.g
              initial={{ rotate: 330 }}
              animate={{ rotate: 330 + 360 }}
              transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            >
              <line
                x1={CX}
                y1={CY}
                x2={branchEndX(R1)}
                y2={CY}
                stroke={BRANCH}
                strokeOpacity={0.78}
                strokeWidth={3}
                strokeLinecap="round"
              />
              <Node href={githubHref} label="GitHub" x={nodeCenterX(R1)} y={CY} text="GH" />
            </motion.g>

            {/* Middle: CCW (LinkedIn) — initial 180° */}
            <motion.g
              initial={{ rotate: 180 }}
              animate={{ rotate: 180 - 360 }}
              transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            >
              <line
                x1={CX}
                y1={CY}
                x2={branchEndX(R2)}
                y2={CY}
                stroke={BRANCH}
                strokeOpacity={0.78}
                strokeWidth={3}
                strokeLinecap="round"
              />
              <Node href={linkedinHref} label="LinkedIn" x={nodeCenterX(R2)} y={CY} text="in" />
            </motion.g>

            {/* Outer: CW (Email) — initial 45° */}
            <motion.g
              initial={{ rotate: 45 }}
              animate={{ rotate: 45 + 360 }}
              transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            >
              <line
                x1={CX}
                y1={CY}
                x2={branchEndX(R3)}
                y2={CY}
                stroke={BRANCH}
                strokeOpacity={0.78}
                strokeWidth={3}
                strokeLinecap="round"
              />
              <Node href={emailHref} label="Email" x={nodeCenterX(R3)} y={CY} text="✉" />
            </motion.g>
          </motion.svg>
        </div>

        {/* Tagline */}
        <p className="mt-28 text-center text-base text-white/80">{tagline}</p>
      </div>
    </section>
  );
}
