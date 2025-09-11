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
 * - ONE SVG (960x960), shared center (480,480)
 * - 3 static rings + pulsing core
 * - 3 arms: stem begins ON ring circumference, extends outward to node
 * - Arms ORBIT the core via transformOrigin at (CX,CY); inner content counter-rotates to stay upright
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
  const W = 960, H = 960;
  const CX = 480, CY = 480;

  // Orbits (chosen to keep outer node + halo inside the stage)
  const R1 = 220;  // inner
  const R2 = 310;  // middle
  const R3 = 400;  // outer

  // Node / stem styling
  const NODE_R = 28;      // 56px diameter
  const HALO = 14;        // halo radius beyond node
  const STEM_GAP = 12;    // gap from ring to node edge
  const BRANCH = "#67e8f9";
  const STEM_STROKE = 3;

  // Arm geometry in ABSOLUTE SVG coords (so transformOrigin can orbit around CX,CY)
  // Start point is ON ring at angle 0 (to the right). Rotation animates the whole group.
  const stemStart = (r: number) => ({ x: CX + r, y: CY });
  const nodeCenter = (r: number) => ({ x: CX + r + STEM_GAP + NODE_R, y: CY });
  const stemEnd = (r: number) => ({ x: CX + r + STEM_GAP + NODE_R - 3, y: CY }); // -3 tuck under badge

  // Brand icons (lucide-like outlines), centered at (x,y)
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

  // SVG-only node (clickable)
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

  // Shared transitions
  const cw60 = { repeat: Infinity, duration: 60, ease: "linear" } as const;
  const ccw80 = { repeat: Infinity, duration: 80, ease: "linear" } as const;
  const cw100 = { repeat: Infinity, duration: 100, ease: "linear" } as const;

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
              <circle cx={CX} cy={CY} r={130} fill="url(#coreGlow)" opacity={0.9} />
              <motion.circle
                cx={CX} cy={CY} r={142} fill="none" stroke="url(#coreRing)" strokeWidth={1.6}
                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
                style={{ transformOrigin: `${CX}px ${CY}px` }}
              />
            </motion.g>

            {/* === ARMS — orbit around (CX,CY) with transformOrigin; nodes counter-rotate to stay upright === */}

            {/* Inner (GitHub) — CW */}
            <motion.g
              initial={{ rotate: 300 }}
              animate={{ rotate: 300 + 360 }}
              transition={cw60}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            >
              {/* stem attached to inner ring */}
              <line
                x1={stemStart(R1).x} y1={stemStart(R1).y}
                x2={stemEnd(R1).x}   y2={stemEnd(R1).y}
                stroke={BRANCH} strokeOpacity={0.85} strokeWidth={STEM_STROKE} strokeLinecap="round"
              />
              {/* Node group counter-rotates to keep icon upright */}
              <motion.g
                animate={{ rotate: -(300 + 360) }}
                transition={cw60}
                style={{ transformOrigin: `${nodeCenter(R1).x}px ${nodeCenter(R1).y}px` }}
              >
                <Node href={githubHref} label="GitHub" x={nodeCenter(R1).x} y={nodeCenter(R1).y}>
                  <IconGithub x={nodeCenter(R1).x} y={nodeCenter(R1).y} />
                </Node>
              </motion.g>
            </motion.g>

            {/* Middle (LinkedIn) — CCW */}
            <motion.g
              initial={{ rotate: 180 }}
              animate={{ rotate: 180 - 360 }}
              transition={ccw80}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            >
              <line
                x1={stemStart(R2).x} y1={stemStart(R2).y}
                x2={stemEnd(R2).x}   y2={stemEnd(R2).y}
                stroke={BRANCH} strokeOpacity={0.85} strokeWidth={STEM_STROKE} strokeLinecap="round"
              />
              <motion.g
                animate={{ rotate: -(180 - 360) }}
                transition={ccw80}
                style={{ transformOrigin: `${nodeCenter(R2).x}px ${nodeCenter(R2).y}px` }}
              >
                <Node href={linkedinHref} label="LinkedIn" x={nodeCenter(R2).x} y={nodeCenter(R2).y}>
                  <IconLinkedIn x={nodeCenter(R2).x} y={nodeCenter(R2).y} />
                </Node>
              </motion.g>
            </motion.g>

            {/* Outer (Email) — CW */}
            <motion.g
              initial={{ rotate: 40 }}
              animate={{ rotate: 40 + 360 }}
              transition={cw100}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            >
              <line
                x1={stemStart(R3).x} y1={stemStart(R3).y}
                x2={stemEnd(R3).x}   y2={stemEnd(R3).y}
                stroke={BRANCH} strokeOpacity={0.85} strokeWidth={STEM_STROKE} strokeLinecap="round"
              />
              <motion.g
                animate={{ rotate: -(40 + 360) }}
                transition={cw100}
                style={{ transformOrigin: `${nodeCenter(R3).x}px ${nodeCenter(R3).y}px` }}
              >
                <Node href={emailHref} label="Email" x={nodeCenter(R3).x} y={nodeCenter(R3).y}>
                  <IconMail x={nodeCenter(R3).x} y={nodeCenter(R3).y} />
                </Node>
              </motion.g>
            </motion.g>
          </motion.svg>
        </div>

        {/* Tagline */}
        <p className="mt-28 text-center text-base text-white/80">{tagline}</p>
      </div>
    </section>
  );
}
