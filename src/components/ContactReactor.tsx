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
 * ContactReactor — Reactor core CTA with rotating branches & nodes
 * - Three rotating "arms" that connect from core -> node (GitHub, LinkedIn, Email)
 * - Inner orbit rotates CW, middle CCW, outer CW (all slow for easy clicking)
 * - SVG starfield/orbits in the back; HTML nodes in rotating wrappers for crisp interactivity
 * - Tailwind-only; no global CSS edits
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
   * - A square wrapper centered on the core with size = 2 * radius
   * - Inside, a mini-SVG draws a branch (line) from center to the right edge
   * - A Node is placed at the right edge; wrapper rotation animates the whole arm+node around the core
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
        aria-hidden={false}
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ repeat: Infinity, duration, ease: "linear" }}
      >
        {/* Branch from center to right edge */}
        <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
          {/* subtle orbit line (ghost) */}
          <circle
            cx={radius}
            cy={radius}
            r={radius}
            className="stroke-cyan-300/10"
            strokeWidth={1}
            fill="none"
          />
          {/* bright branch line (center -> node) */}
          <line
            x1={radius}
            y1={radius}
            x2={size - 28} // stop slightly before edge so line tucks under the node circle nicely
            y2={radius}
            className="stroke-cyan-300/50"
            strokeWidth={2.25}
          />
        </svg>

        {/* Node anchored at the right edge of the arm */}
        <div
          className="absolute"
          style={{
            left: size - 28 - 28, // align center of node where line ends (node is 56px; 28 is radius)
            top: radius - 28,
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
      {/* Subtle starfield / glow */}
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

        {/* Stage */}
        <div className="relative mx-auto grid place-items-center">
          {/* Background orbits in a single SVG (bigger for more separation) */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <svg
              className="h-[520px] w-[520px] sm:h-[600px] sm:w-[600px]"
              viewBox="0 0 600 600"
              fill="none"
            >
              {/* faint concentric rings */}
              <circle cx="300" cy="300" r="130" className="stroke-cyan-300/14" strokeWidth="1.5" />
              <circle cx="300" cy="300" r="200" className="stroke-cyan-300/10" strokeWidth="1.5" />
              <circle cx="300" cy="300" r="270" className="stroke-cyan-300/7" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Core */}
          <motion.div animate={coreControls} className="relative z-10 grid place-items-center">
            <div className="relative h-44 w-44 rounded-full">
              {/* inner glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-300/60 via-indigo-400/60 to-fuchsia-400/60 blur-2xl" />
              {/* core body */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-cyan-400 to-indigo-500 shadow-[0_0_44px_rgba(34,211,238,0.45)]" />
              {/* sheen */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-60" />
              {/* slow outer ring */}
              <motion.div
                aria-hidden
                className="absolute -inset-2 rounded-full border border-cyan-300/30"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
              />
            </div>
          </motion.div>

          {/*
            Rotating arms (bigger radii => more separation)
            - Inner: radius 160px, CW, 60s
            - Middle: radius 230px, CCW, 80s
            - Outer: radius 300px, CW, 100s
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
            radius={230}
            duration={80}
            reverse
            ariaLabel="LinkedIn"
            href={linkedinHref}
          >
            <Linkedin className="h-6 w-6 text-cyan-100" />
          </RotatingArm>

          <RotatingArm
            radius={300}
            duration={100}
            reverse={false}
            ariaLabel="Email"
            href={emailHref}
          >
            <Mail className="h-6 w-6 text-cyan-100" />
          </RotatingArm>
        </div>

        {/* Tagline */}
        <p className="mt-32 text-center text-base text-white/80">{tagline}</p>
      </div>
    </section>
  );
}
