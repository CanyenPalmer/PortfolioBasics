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
 * ContactReactor — a futuristic "reactor core" CTA
 * - Central neon core that gently pulses
 * - Three "nodes" (GitHub, LinkedIn, Email) connected by energy lines
 * - Minimal markup, no external CSS; Tailwind-only
 * - Keyboard accessible & screen-reader friendly
 */
export default function ContactReactor({
  linkedinHref = "https://www.linkedin.com/in/canyen-palmer-b0b6762a0",
  githubHref = "https://github.com/CanyenPalmer",
  emailHref = "mailto:Canyen2019@gmail.com",
  tagline = "Always Learning, Always Building - Let's Connect",
}: Props) {
  const controls = useAnimationControls();

  // Slow heartbeat for the core glow
  React.useEffect(() => {
    const loop = async () => {
      while (true) {
        await controls.start({
          opacity: 0.9,
          scale: 1.04,
          transition: { duration: 2.2, ease: "easeInOut" },
        });
        await controls.start({
          opacity: 1,
          scale: 1.0,
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
      {/* Outer ring glow */}
      <span className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition" />
      {/* Icon badge */}
      <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-400/10 backdrop-blur-md">
        {children}
      </span>
    </a>
  );

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative isolate overflow-hidden py-28 sm:py-36"
    >
      {/* Subtle starfield */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.08),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      <div className="container mx-auto max-w-5xl px-6">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Let&apos;s Build Together
          </h2>
          <p className="mt-3 text-balance text-sm text-white/70">
            Open to conversations, collaborations, and new challenges.
          </p>
        </div>

        <div className="relative mx-auto grid place-items-center">
          {/* Energy links — positioned around core */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <svg
              className="h-[380px] w-[380px] sm:h-[460px] sm:w-[460px]"
              viewBox="0 0 460 460"
              fill="none"
            >
              {/* faint orbits */}
              <circle
                cx="230"
                cy="230"
                r="120"
                className="stroke-cyan-300/20"
                strokeWidth="1.5"
              />
              <circle
                cx="230"
                cy="230"
                r="170"
                className="stroke-cyan-300/10"
                strokeWidth="1"
              />
              <circle
                cx="230"
                cy="230"
                r="210"
                className="stroke-cyan-300/5"
                strokeWidth="1"
              />

              {/* connection lines to nodes */}
              {/* GitHub: left */}
              <line
                x1="90"
                y1="230"
                x2="160"
                y2="230"
                className="stroke-cyan-300/40"
                strokeWidth="2"
              />
              {/* LinkedIn: top-right */}
              <line
                x1="300"
                y1="130"
                x2="360"
                y2="90"
                className="stroke-cyan-300/40"
                strokeWidth="2"
              />
              {/* Email: bottom-right */}
              <line
                x1="295"
                y1="330"
                x2="360"
                y2="375"
                className="stroke-cyan-300/40"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Core */}
          <motion.div animate={controls} className="relative z-10 grid place-items-center">
            <div className="relative h-40 w-40 rounded-full">
              {/* inner glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-300/60 via-indigo-400/60 to-fuchsia-400/60 blur-2xl" />
              {/* core body */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-cyan-400 to-indigo-500 shadow-[0_0_40px_rgba(34,211,238,0.45)]" />
              {/* sheen */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-60" />
              {/* rotating ring */}
              <motion.div
                aria-hidden
                className="absolute -inset-2 rounded-full border border-cyan-300/30"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
              />
            </div>
          </motion.div>

          {/* Clickable nodes */}
          <div className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2">
            <Node href={githubHref} label="GitHub">
              <Github className="h-6 w-6 text-cyan-100" />
            </Node>
          </div>
          <div className="pointer-events-auto absolute right-6 top-14">
            <Node href={linkedinHref} label="LinkedIn">
              <Linkedin className="h-6 w-6 text-cyan-100" />
            </Node>
          </div>
          <div className="pointer-events-auto absolute right-8 bottom-8">
            <Node href={emailHref} label="Email">
              <Mail className="h-6 w-6 text-cyan-100" />
            </Node>
          </div>
        </div>

        {/* Tagline */}
        <p className="mt-28 text-center text-base text-white/80">{tagline}</p>
      </div>
    </section>
  );
}
