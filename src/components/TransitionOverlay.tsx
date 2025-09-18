// src/components/TransitionOverlay.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransitionOverlay } from "@/providers/TransitionProvider";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
});

export default function TransitionOverlay() {
  const { isActive, mode, prefersReduced } = useTransitionOverlay();

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="overlay-root"
          id="mach-overlay-live"
          // Keep fully opaque on MACH mount so there's no 1-frame peek when we drop SSR cover
          initial={{ opacity: mode === "mach" ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0.12 : 0.24, ease: "easeOut" }}
          className="fixed inset-0 z-[10002] pointer-events-none"
          aria-hidden="true"
        >
          {/* Base background */}
          <div className="absolute inset-0 bg-[#0b1016]" />

          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.14] mix-blend-screen"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.12) 1px, transparent 1px)",
              backgroundSize: "22px 22px, 22px 22px",
              backgroundPosition: "center center",
            }}
          />

          {/* Sweep */}
          {!prefersReduced && (
            <motion.div
              initial={{ x: "-110%" }}
              animate={{ x: ["-110%", "10%", "120%"] }}
              transition={{ duration: mode === "mach" ? 1.2 : 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 w-[38%] bg-[linear-gradient(90deg,transparent,rgba(0,255,255,0.18),transparent)]"
            />
          )}

          {/* Content */}
          {mode === "mach" ? <MachContent reduced={prefersReduced} /> : null}
          {mode === "nav" ? <NavContent reduced={prefersReduced} /> : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MachContent({ reduced }: { reduced: boolean }) {
  const [glitch, setGlitch] = React.useState(false);

  // Trigger a 1s glitch shortly after the overlay mounts (disabled for reduced motion)
  React.useEffect(() => {
    if (reduced) return;
    const startDelay = 350; // ms (lets the overlay settle before glitching)
    const duration = 1000;  // ms
    const t1 = window.setTimeout(() => {
      setGlitch(true);
      const t2 = window.setTimeout(() => setGlitch(false), duration);
      return () => window.clearTimeout(t2);
    }, startDelay);
    return () => window.clearTimeout(t1);
  }, [reduced]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center px-6">
        {/* Elegant title with glitch layers */}
        <div className={`relative inline-block ${playfair.className}`}>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            <span className="mach-title-base">Canyen&nbsp;Palmer</span>

            {/* glitch layers (only visible while glitch=true) */}
            <span
              aria-hidden="true"
              className={`mach-title-layer mach-title-r ${glitch ? "on" : ""}`}
            >
              Canyen&nbsp;Palmer
            </span>
            <span
              aria-hidden="true"
              className={`mach-title-layer mach-title-c ${glitch ? "on" : ""}`}
            >
              Canyen&nbsp;Palmer
            </span>
          </h1>
        </div>

        <p className="mt-2 text-white/70 text-sm md:text-base">Turning data into decisions.</p>

        {!reduced && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: [0.85, 1.06, 1], opacity: [0, 0.35, 0] }}
            transition={{ duration: 0.6, times: [0, 0.6, 1], ease: "easeOut", delay: 1.0 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20 w-48 h-48 md:w-64 md:h-64"
          />
        )}

        {/* Scoped styles for the glitch effect (local to this component) */}
        <style jsx>{`
          .mach-title-base {
            position: relative;
          }
          .mach-title-layer {
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            pointer-events: none;
            mix-blend-mode: screen;
          }
          .mach-title-layer.on {
            opacity: 1;
          }
          .mach-title-r.on {
            color: #ff4d4d;
            animation: glitchR 1s steps(12, end) both;
          }
          .mach-title-c.on {
            color: #00ffff;
            animation: glitchC 1s steps(12, end) both;
          }

          @keyframes glitchR {
            0%   { transform: translate(0px, 0px); clip-path: inset(0 0 80% 0); }
            10%  { transform: translate(1px, -1px); clip-path: inset(10% 0 55% 0); }
            20%  { transform: translate(-1px, 1px); clip-path: inset(30% 0 40% 0); }
            30%  { transform: translate(1px, 0px); clip-path: inset(20% 0 60% 0); }
            40%  { transform: translate(-2px, 1px); clip-path: inset(5% 0 70% 0); }
            50%  { transform: translate(2px, -1px); clip-path: inset(35% 0 30% 0); }
            60%  { transform: translate(-1px, 2px); clip-path: inset(15% 0 60% 0); }
            70%  { transform: translate(0px, -1px); clip-path: inset(0 0 80% 0); }
            80%  { transform: translate(1px, 1px); clip-path: inset(25% 0 50% 0); }
            90%  { transform: translate(-1px, 0px); clip-path: inset(10% 0 65% 0); }
            100% { transform: translate(0px, 0px); clip-path: inset(0 0 80% 0); }
          }

          @keyframes glitchC {
            0%   { transform: translate(0px, 0px); clip-path: inset(70% 0 0 0); }
            10%  { transform: translate(-1px, 1px); clip-path: inset(45% 0 10% 0); }
            20%  { transform: translate(1px, -1px); clip-path: inset(60% 0 5% 0); }
            30%  { transform: translate(-1px, 0px); clip-path: inset(40% 0 20% 0); }
            40%  { transform: translate(2px, -1px); clip-path: inset(65% 0 0 0); }
            50%  { transform: translate(-2px, 1px); clip-path: inset(30% 0 25% 0); }
            60%  { transform: translate(1px, -2px); clip-path: inset(50% 0 10% 0); }
            70%  { transform: translate(0px, 1px); clip-path: inset(70% 0 0 0); }
            80%  { transform: translate(-1px, -1px); clip-path: inset(35% 0 20% 0); }
            90%  { transform: translate(1px, 0px); clip-path: inset(55% 0 5% 0); }
            100% { transform: translate(0px, 0px); clip-path: inset(70% 0 0 0); }
          }
        `}</style>
      </div>
    </div>
  );
}

function NavContent({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative px-6">
        <h2 className="text-2xl md:text-5xl font-semibold tracking-tight text-center">
          Thank You For Visiting
        </h2>

        {!reduced && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: [0.7, 1.05, 1.2], opacity: [0, 0.25, 0] }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], times: [0, 0.6, 1], delay: 0.1 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/15 w-40 h-40 md:w-56 md:h-56"
          />
        )}
      </div>
    </div>
  );
}
