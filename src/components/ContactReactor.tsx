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
 * ContactReactor — perfectly centered stage:
 * - One square stage; rings, core, and arms all use the SAME absolute center
 * - Orbits: inner CW, middle CCW, outer CW (slow)
 * - Nodes are spaced farther apart and branches connect directly to them
 */
export default function ContactReactor({
  linkedinHref = "https://www.linkedin.com/in/canyen-palmer-b0b6762a0",
  githubHref = "https://github.com/CanyenPalmer",
  emailHref = "mailto:Canyen2019@gmail.com",
  tagline = "Always Learning, Always Building - Let's Connect",
}: Props) {
  const coreControls = useAnimationControls();

  // Gentle breathing for the core glow
  React.useEffect(() => {
    const loop = async () => {
      while (true) {
        await coreControls.start({
          opacity: 0.9,
          scale: 1.04,
          transition: { duration: 2.2, ease: "easeInOut" },
        });
        await coreControls.start({
          opacity: 1,
          scale: 1,
          transition: { duration: 2.2, ease: "easeInOut" },
        });
      }
    };
    loop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <span className="absolute inset-0 rounded-full bg-cyan-400/25 blur-xl opacity-0 group-hover:opacity-100 transition" />
      <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-400/10 backdrop-blur-md">
        {children}
      </span>
    </a>
  );

  /**
   * RotatingArm — centered wrapper; draws an orbit ring + branch to a node.
   * All arms, rings, and core are centered at the same point (stage center).
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
        style={{ transform: "translate(-50%, -50%)", width: size, height: size }}
        initial={{ rotate: initialAngle }}
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ repeat: Infinity, duration, ease: "linear" }}
      >
        {/* Orbit ring + branch (same center as core) */}
        <svg className="absolute inset-0" viewBox={`0 0 ${size} ${size}`} fill="none">
          <circle
            cx={radius}
            cy={radius}
            r={radius}
            className="stroke-cyan-300/12"
            strokeWidth={1.5}
          />
          <line
            x1={radius}
            y1={radius}
            x2={size - nodeR}
            y2={radius}
            className="stroke-cyan-300/50"
            strokeWidth={2.25}
          />
        </svg>

        {/* Node exactly at end of branch */}
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
      {/* Background glow + subtle dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.08),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      <div className="container mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Let&apos;s Build Together
          </h2>
          <p className="mt-3 text-balance text-sm text-white/70">
            Open to conversations, collaborations, and new challenges.
          </p>
        </div>

        {/* === SINGLE CENTERED STAGE (everything aligns to this) === */}
        <div className="relative mx-auto grid place-items-center">
          {/* Stage: fixed square to avoid any flex/scale drift */}
          <div className="relative h-[720px] w-[720px] max-w-full">
            {/* Rings — absolutely centered on the SAME point as the core */}
            <svg
              width={720}
              height={720}
              viewBox="0 0 720 720"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              fill="none"
            >
              <circle cx="360" cy="360" r="160" className="stroke-cyan-300/14" strokeWidth="1.5" />
              <circle cx="360" cy="360" r="240" className="stroke-cyan-300/10" strokeWidth="1.5" />
              <circle cx="360" cy="360" r="320" className="stroke-cyan-300/7" strokeWidth="1.5" />
            </svg>

            {/* Core — absolutely centered on the SAME point */}
            <motion.div
              animate={coreControls}
              className="absolute left-1/2 top-1/2 z-10 grid -translate-x-1/2 -translate-y-1/2 place-items-center"
            >
              <div className="relative h-44 w-44 rounded-full">
                {/* inner glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-300/60 via-indigo-400/60 to-fuchsia-400/60 blur-2xl" />
                {/* core body */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-cyan-400 to-indigo-500 shadow-[0_0_44px_rgba(34,211,238,0.45)]" />
                {/* sheen */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-60" />
                {/* slow ring */}
                <motion.div
                  aria-hidden
                  className="absolute -inset-2 rounded-full border border-cyan-300/30"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
                />
              </div>
            </motion.div>

            {/*
              Rotating arms — each wrapper is absolutely centered to the SAME point.
              Radii match the rings so everything stays concentric.
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
        <p className="mt-32 text-center text-base text-white/80">{tagline}</p>
      </div>
    </section>
  );
}
