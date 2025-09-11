"use client";

import { motion, useAnimationControls } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import * as React from "react";

type Props = {
  linkedinHref?: string;
  githubHref?: string;
  emailHref?: string;
  tagline?: string;
};

/**
 * ContactReactor — concentric, SVG-anchored stage
 * - ONE square Stage (absolute center) controls all positioning
 * - Rings, Core, Arms share the exact same center (no flex/grid drift)
 * - Inner orbit CW, middle CCW, outer CW (slow)
 * - Branches are high-contrast and terminate right under each node
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
          opacity: 0.92,
          scale: 1.045,
          transition: { duration: 2.1, ease: "easeInOut" },
        });
        await coreControls.start({
          opacity: 1,
          scale: 1,
          transition: { duration: 2.1, ease: "easeInOut" },
        });
      }
    };
    loop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Clickable node badge */
  const Node = ({
    href,
    label,
    children,
  }: {
    href: string;
    label: string;
    children: React.ReactNode;
  }) => (
    <a
      href={href}
      aria-label={label}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
      className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full outline-none ring-0 focus-visible:ring-2 focus-visible:ring-cyan-300/80 transition"
    >
      <span className="absolute inset-0 rounded-full bg-cyan-400/30 blur-xl opacity-0 group-hover:opacity-100 transition" />
      <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/50 bg-cyan-400/10 backdrop-blur-md">
        {children}
      </span>
    </a>
  );

  /**
   * RotatingArm — purely centered wrapper:
   * - size = 2 * radius
   * - draws orbit ring + branch from exact center to node
   * - node positioned precisely at the branch tip
   */
  const RotatingArm = ({
    radius,
    duration,
    reverse = false,
    href,
    ariaLabel,
    children,
    initialAngle = 0,
  }: {
    radius: number; // px
    duration: number; // seconds
    reverse?: boolean;
    href: string;
    ariaLabel: string;
    children: React.ReactNode;
    initialAngle?: number; // degrees
  }) => {
    const size = radius * 2;
    const nodeSize = 56; // 14 * 4
    const nodeR = nodeSize / 2;

    return (
      <motion.div
        className="pointer-events-auto absolute left-1/2 top-1/2"
        style={{
          transform: "translate(-50%, -50%)",
          width: size,
          height: size,
        }}
        initial={{ rotate: initialAngle }}
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ repeat: Infinity, duration, ease: "linear" }}
      >
        {/* Orbit + Branch share SAME center as core */}
        <svg className="absolute inset-0" viewBox={`0 0 ${size} ${size}`} fill="none">
          {/* orbit ring (ghost) */}
          <circle
            cx={radius}
            cy={radius}
            r={radius}
            stroke="#67e8f9"
            strokeOpacity={0.18}
            strokeWidth={1.5}
          />
          {/* bright branch from center to just under node center */}
          <line
            x1={radius}
            y1={radius}
            x2={size - nodeR}
            y2={radius}
            stroke="#67e8f9"
            strokeOpacity={0.7}
            strokeWidth={2.75}
          />
        </svg>

        {/* Node exactly at end of branch tip */}
        <div
          className="absolute"
          style={{ left: size - nodeSize, top: radius - nodeR }}
        >
          <Node href={href} label={ariaLabel}>
            {children}
          </Node>
        </div>
      </motion.div>
    );
  };

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative isolate overflow-hidden py-28 sm:py-36"
    >
      {/* Subtle vignette + dotted field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.08),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Let&apos;s Build Together
          </h2>
          <p className="mt-3 text-balance text-sm text-white/70">
            Open to conversations, collaborations, and new challenges.
          </p>
        </div>

        {/* === STAGE: everything anchored to THIS exact center === */}
        <div className="relative mx-auto flex items-center justify-center">
          {/* Fixed square so centering never drifts */}
          <div className="relative h-[720px] w-[720px] max-w-full">
            {/* RINGS — centered to same point as core & arms */}
            <svg
              viewBox="0 0 720 720"
              className="absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2"
              fill="none"
            >
              <circle cx="360" cy="360" r="160" stroke="#67e8f9" strokeOpacity={0.22} strokeWidth={1.8} />
              <circle cx="360" cy="360" r="240" stroke="#67e8f9" strokeOpacity={0.16} strokeWidth={1.6} />
              <circle cx="360" cy="360" r="320" stroke="#67e8f9" strokeOpacity={0.12} strokeWidth={1.6} />
            </svg>

            {/* CORE — centered to same point */}
            <motion.div
              animate={coreControls}
              className="absolute left-1/2 top-1/2 z-10 grid -translate-x-1/2 -translate-y-1/2 place-items-center"
            >
              <div className="relative h-44 w-44 rounded-full">
                {/* inner glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-300/60 via-indigo-400/60 to-fuchsia-400/60 blur-2xl" />
                {/* core body */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-cyan-400 to-indigo-500 shadow-[0_0_54px_rgba(34,211,238,0.55)]" />
                {/* sheen */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-60" />
                {/* slow ring */}
                <motion.div
                  aria-hidden
                  className="absolute -inset-2 rounded-full border border-cyan-300/35"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
                />
              </div>
            </motion.div>

            {/*
              ARMS — wrappers absolutely centered to same point.
              Radii match the rings exactly; lines terminate under node centers.
              Initial angles staggered to avoid overlap at load.
            */}
            <RotatingArm
              radius={160}
              duration={60}
              reverse={false}
              href={githubHref}
              ariaLabel="GitHub"
              initialAngle={210}
            >
              <Github className="h-6 w-6 text-cyan-100" />
            </RotatingArm>

            <RotatingArm
              radius={240}
              duration={80}
              reverse
              href={linkedinHref}
              ariaLabel="LinkedIn"
              initialAngle={30}
            >
              <Linkedin className="h-6 w-6 text-cyan-100" />
            </RotatingArm>

            <RotatingArm
              radius={320}
              duration={100}
              reverse={false}
              href={emailHref}
              ariaLabel="Email"
              initialAngle={300}
            >
              <Mail className="h-6 w-6 text-cyan-100" />
            </RotatingArm>
          </div>
        </div>

        {/* Tagline */}
        <p className="mt-28 text-center text-base text-white/80">{tagline}</p>
      </div>
    </section>
  );
}
