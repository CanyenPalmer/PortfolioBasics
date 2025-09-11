"use client";

import { motion, useAnimationControls } from "framer-motion";
import * as React from "react";

type Props = {
  linkedinHref?: string;
  githubHref?: string;
  emailHref?: string;
  tagline?: string;
};

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

  // Single SVG coordinate system
  const W = 900, H = 900;
  const CX = 450, CY = 450;

  // Ring radii (kept inside canvas incl. gap + node + halo)
  const R1 = 180; // inner
  const R2 = 260; // middle
  const R3 = 340; // outer   -> 450 + 340 + (12 + 28 + 14) = 844 < 900 (safe)

  // Node / stem styling
  const NODE_R = 28;  // 56px diameter
  const HALO = 14;    // halo thickness
  const GAP  = 12;    // gap from ring to node edge
  const BR   = "#67e8f9";

  // Precomputed X positions (arms are drawn at angle 0 and rotated by the SVG itself)
  const stemStartX = (r: number) => CX + r;                                 // on ring
  const nodeCx     = (r: number) => CX + r + GAP + NODE_R;                   // node center
  const stemEndX   = (r: number) => nodeCx(r) - (NODE_R - 3);               // tuck under badge 3px

  // Brand icons (lucide-like) centered at (x,y)
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

  // Clickable SVG node
  const Node = ({ href, label, x, y, children }: { href: string; label: string; x: number; y: number; children: React.ReactNode }) => (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer noopener" style={{ cursor: "pointer" }}>
      <circle cx={x} cy={y} r={NODE_R + HALO} fill="none" stroke={BR} strokeOpacity={0.18} />
      <circle cx={x} cy={y} r={NODE_R} fill="rgba(34,211,238,0.10)" stroke={BR} strokeOpacity={0.45} />
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

        <div className="relative mx-auto flex items-center justify-center">
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block">
            {/* defs */}
            <defs>
              <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.95" />
                <stop offset="55%" stopColor="#6366f1" stopOpacity="0.88" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.75" />
              </radialGradient>
              <linearGradient id="coreRing" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={BR} stopOpacity={0.40} />
                <stop offset="100%" stopColor={BR} stopOpacity={0.10} />
              </linearGradient>
            </defs>

            {/* static rings (concentric) */}
            <circle cx={CX} cy={CY} r={R1} stroke={BR} strokeOpacity={0.22} strokeWidth={1.6} fill="none" />
            <circle cx={CX} cy={CY} r={R2} stroke={BR} strokeOpacity={0.16} strokeWidth={1.6} fill="none" />
            <circle cx={CX} cy={CY} r={R3} stroke={BR} strokeOpacity={0.12} strokeWidth={1.6} fill="none" />

            {/* core with pulse & slow ring */}
            <motion.g animate={coreControls}>
              <circle cx={CX} cy={CY} r={118} fill="url(#coreGlow)" opacity={0.9} />
              <motion.circle
                cx={CX} cy={CY} r={128} fill="none" stroke="url(#coreRing)" strokeWidth={1.5}
                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
                style={{ transformOrigin: `${CX}px ${CY}px` }}
              />
            </motion.g>

            {/* === ARMS — pure SVG rotate around (CX,CY) via animateTransform === */}

            {/* Inner (GitHub) — clockwise, starts at 300° */}
            <g transform={`rotate(300 ${CX} ${CY})`}>
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from={`300 ${CX} ${CY}`}
                to={`660 ${CX} ${CY}`}
                dur="60s"
                repeatCount="indefinite"
              />
              {/* stem attached to R1 */}
              <line x1={stemStartX(R1)} y1={CY} x2={stemEndX(R1)} y2={CY} stroke={BR} strokeOpacity={0.85} strokeWidth={3} strokeLinecap="round" />
              {/* node */}
              <Node href={githubHref} label="GitHub" x={nodeCx(R1)} y={CY}>
                <IconGithub x={nodeCx(R1)} y={CY} />
              </Node>
            </g>

            {/* Middle (LinkedIn) — counter-clockwise, starts at 180° */}
            <g transform={`rotate(180 ${CX} ${CY})`}>
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from={`180 ${CX} ${CY}`}
                to={`-180 ${CX} ${CY}`}
                dur="80s"
                repeatCount="indefinite"
              />
              <line x1={stemStartX(R2)} y1={CY} x2={stemEndX(R2)} y2={CY} stroke={BR} strokeOpacity={0.85} strokeWidth={3} strokeLinecap="round" />
              <Node href={linkedinHref} label="LinkedIn" x={nodeCx(R2)} y={CY}>
                <IconLinkedIn x={nodeCx(R2)} y={CY} />
              </Node>
            </g>

            {/* Outer (Email) — clockwise, starts at 40° */}
            <g transform={`rotate(40 ${CX} ${CY})`}>
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from={`40 ${CX} ${CY}`}
                to={`400 ${CX} ${CY}`}
                dur="100s"
                repeatCount="indefinite"
              />
              <line x1={stemStartX(R3)} y1={CY} x2={stemEndX(R3)} y2={CY} stroke={BR} strokeOpacity={0.85} strokeWidth={3} strokeLinecap="round" />
              <Node href={emailHref} label="Email" x={nodeCx(R3)} y={CY}>
                <IconMail x={nodeCx(R3)} y={CY} />
              </Node>
            </g>
          </svg>
        </div>

        {/* Tagline */}
        <p className="mt-28 text-center text-base text-white/80">{tagline}</p>
      </div>
    </section>
  );
}
