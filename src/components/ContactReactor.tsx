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
 * ContactReactor — centered stage:
 * - One absolute, square "stage" box centers everything (rings, core, arms)
 * - Rings, core, and rotating arms share the EXACT same center
 * - Inner orbit CW, middle CCW, outer CW (slow for clickability)
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

  // Node badge
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
      className="group relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full outline-none ring-0 focus-visible:ring-2 focus-visible:ring-cyan-300/80 transition"
    >
      <span className="absolute inset-0 rounded-full bg-cyan-400/25 blur-xl opacity-0 group-hover:opacity-100 transition" />
      <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-400/10 backdrop-blur-md">
        {children}
      </span>
    </a>
  );

  /**
   * RotatingArm
   * - A square wrapper centered on the stage with size = 2 * radius
   * - A branch (line) from center to right edge + node anchored at the end
   * - The entire wrapper rotates, keeping branch + node attached and centered to the core
   */
  const RotatingArm = ({
    radius,
    duration,
    reverse = false,
    children,
    ariaLabel,
    href,
  }: {
    radius: number; // px
    duration: number; // seconds
    reverse?: boolean;
    children: React.ReactNode;
    ariaLabel: string;
    href: string;
  }) => {
    const size = radius * 2;
    const nodeSize = 56; // h-14 w-14
    const nodeR = nodeSize / 2;

    return (
      <motion.div
        className="pointer-events-auto absolute"
        style={{
          width: size,
          height: size,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          transformOrigin: "center center",
        }}
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ repeat: Infinity, duration, ease: "linear" }}
      >
        {/* Orbit (ghost ring) + branch from center to node anchor */}
        <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
          <circle
            cx={radius}
            cy={radius}
            r={radius}
            className="stroke-cyan-300/10"
            strokeWidth={1}
            fill="none"
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
          style={{
            left: size - nodeSize,
            top: radius - nodeR,
          }}
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
      {/* Subtle starfield / vignette */}
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

        {/* === CENTERED STAGE (everything aligns to this box) === */}
        <div className="relative mx-auto grid place-items-center">
          {/* Square stage ensures exact centering across rings, core, and arms */}
          <div className="relative h-[640px] w-[640px] sm:h-[720px] sm:w-[720px]">
            {/* Background concentric rings — SAME center as core & arms */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 720 720"
              fill="none"
            >
              <circle cx="360" cy="360" r="160" className="stroke-cyan-300/14" strokeWidth="1.5" />
              <circle cx="360" cy="360" r="240" className="stroke-cyan-300/10" strokeWidth="1.5" />
              <circle cx="360" cy="360" r="320" className="stroke-cyan-300/7" strokeWidth="1.5" />
            </svg>

            {/* Core — perfectly centered inside stage */}
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
              Rotating arms — centered within the SAME stage box
              Radii chosen to match the background rings for perfect alignment.
              - Inner: r=160, CW, 60s
              - Middle: r=240, CCW, 80s
              - Outer: r=320, CW, 100s
            */}
            <RotatingArm
              radius={160}
              duration={60}
              reverse={false}
              ariaLabel="GitHub"
              href={githubHref}
            >
              <Github className="h-6 w-6 text-cyan-100" />
            </RotatingArm>

            <RotatingArm
              radius={240}
              duration={80}
              reverse
              ariaLabel="LinkedIn"
              href={linkedinHref}
            >
              <Linkedin className="h-6 w-6 text-cyan-100" />
            </RotatingArm>

            <RotatingArm
              radius={320}
              duration={100}
              reverse={false}
              ariaLabel="Email"
              href={emailHref}
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
