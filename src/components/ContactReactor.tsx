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
 * ContactReactor (single-SVG, truly concentric)
 * - ONE centered SVG (720x720). Everything shares cx=cy=360.
 * - Static concentric rings.
 * - Core drawn inside the SVG (gradients + soft glow).
 * - Three rotating arms are <motion.g> groups that rotate around the same center.
 * - Each arm draws a branch line from the center to a node; node is a clickable <a> link.
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
          scale: 1.04,
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

  // SVG constants (single coordinate system)
  const W = 720;
  const H = 720;
  const CX = 360;
  const CY = 360;

  // Orbit radii (match arms exactly)
  const R1 = 160; // inner
  const R2 = 240; // middle
  const R3 = 320; // outer

  // Node visual constants
  const NODE_R = 28; // 56px diameter
  const BRANCH_COLOR = "#67e8f9";

  // Helper to draw a node with icon-like text
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
    text: string; // "GH", "in", "✉" etc.
  }) => (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer noopener">
      {/* glow ring */}
      <circle cx={x} cy={y} r={NODE_R + 14} fill="none" stroke={BRANCH_COLOR} strokeOpacity={0.18} />
      {/* node pill */}
      <circle cx={x} cy={y} r={NODE_R} fill="rgba(34,211,238,0.10)" stroke={BRANCH_COLOR} strokeOpacity={0.45} />
      {/* label (icon-ish) */}
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
    </a>
  );

  return (
    <section id="contact" aria-label="Contact" className="relative isolate overflow-hidden py-28 sm:py-36">
      {/* Background vignette + subtle grid */}
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
          <p className="mt-3 text-balance text-sm text-white/70">Open to conversations, collaborations, and new challenges.</p>
        </div>

        {/* Single centered SVG stage — everything concentric */}
        <div className="relative mx-auto flex items-center justify-center">
          <motion.svg
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            className="block"
            initial={{}}
            animate={{}}
          >
            {/* --- defs for gradients/glow --- */}
            <defs>
              {/* core gradient */}
              <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#6366f1" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.75" />
              </radialGradient>
              {/* core ring gradient */}
              <linearGradient id="coreRing" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#67e8f9" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* --- static orbits (centered) --- */}
            <circle cx={CX} cy={CY} r={R1} stroke={BRANCH_COLOR} strokeOpacity={0.22} strokeWidth={1.6} fill="none" />
            <circle cx={CX} cy={CY} r={R2} stroke={BRANCH_COLOR} strokeOpacity={0.16} strokeWidth={1.6} fill="none" />
            <circle cx={CX} cy={CY} r={R3} stroke={BRANCH_COLOR} strokeOpacity={0.12} strokeWidth={1.6} fill="none" />

            {/* --- core (centered) --- */}
            <motion.g animate={coreControls}>
              {/* soft glow */}
              <circle cx={CX} cy={CY} r={96} fill="url(#coreGlow)" opacity={0.85} />
              {/* ring */}
              <motion.circle
                cx={CX}
                cy={CY}
                r={106}
                fill="none"
                stroke="url(#coreRing)"
                strokeWidth={1.4}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
                style={{ transformOrigin: `${CX}px ${CY}px` }}
              />
            </motion.g>

            {/* --- rotating arms (groups rotate around the SAME center) --- */}

            {/* Inner: CW, GitHub (label GH) */}
            <motion.g
              initial={{ rotate: 210 }}
              animate={{ rotate: 210 + 360 }}
              transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            >
              {/* branch from center to node center */}
              <line
                x1={CX}
                y1={CY}
                x2={CX + R1}
                y2={CY}
                stroke={BRANCH_COLOR}
                strokeOpacity={0.75}
                strokeWidth={2.8}
              />
              <Node href={githubHref} label="GitHub" x={CX + R1} y={CY} text="GH" />
            </motion.g>

            {/* Middle: CCW, LinkedIn (label in) */}
            <motion.g
              initial={{ rotate: 30 }}
              animate={{ rotate: 30 - 360 }}
              transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            >
              <line
                x1={CX}
                y1={CY}
                x2={CX + R2}
                y2={CY}
                stroke={BRANCH_COLOR}
                strokeOpacity={0.75}
                strokeWidth={2.8}
              />
              <Node href={linkedinHref} label="LinkedIn" x={CX + R2} y={CY} text="in" />
            </motion.g>

            {/* Outer: CW, Email (label ✉) */}
            <motion.g
              initial={{ rotate: 300 }}
              animate={{ rotate: 300 + 360 }}
              transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            >
              <line
                x1={CX}
                y1={CY}
                x2={CX + R3}
                y2={CY}
                stroke={BRANCH_COLOR}
                strokeOpacity={0.75}
                strokeWidth={2.8}
              />
              <Node href={emailHref} label="Email" x={CX + R3} y={CY} text="✉" />
            </motion.g>
          </motion.svg>
        </div>

        {/* Tagline */}
        <p className="mt-28 text-center text-base text-white/80">{tagline}</p>
      </div>
    </section>
  );
}
