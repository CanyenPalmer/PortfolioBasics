// src/components/TransitionOverlay.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransitionOverlay } from "@/providers/TransitionProvider";

export default function TransitionOverlay() {
  const { isActive, mode, prefersReduced } = useTransitionOverlay();

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="overlay-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0.08 : 0.18, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] pointer-events-none"
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
              transition={{ duration: mode === "mach" ? 1.0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
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
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center px-6">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Canyen&nbsp;Palmer</h1>
        <p className="mt-2 text-white/70 text-sm md:text-base">Turning data into decisions.</p>

        {!reduced && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: [0.85, 1.06, 1], opacity: [0, 0.35, 0] }}
            transition={{ duration: 0.5, times: [0, 0.6, 1], ease: "easeOut", delay: 0.9 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20 w-48 h-48 md:w-64 md:h-64"
          />
        )}
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
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], times: [0, 0.6, 1], delay: 0.1 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/15 w-40 h-40 md:w-56 md:h-56"
          />
        )}
      </div>
    </div>
  );
}
