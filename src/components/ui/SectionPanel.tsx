// src/components/ui/SectionPanel.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";

type Props = {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
};

export default function SectionPanel({ title, children, className = "", headerRight }: Props) {
  return (
    <section className={`relative ${className}`}>
      {/* VSCode-like chrome */}
      <div className="mb-4 flex items-center justify-between rounded-t-lg border border-cyan-400/15 bg-[#0b1016]/70 px-3 py-2 ring-1 ring-cyan-400/10">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ff5f56] shadow-[0_0_8px_#ff5f56]" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ffbd2e] shadow-[0_0_8px_#ffbd2e]" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#27c93f] shadow-[0_0_8px_#27c93f]" />
          {title && (
            <span className="ml-3 font-mono text-sm tracking-wide text-cyan-300/90">
              {title.toUpperCase()}
            </span>
          )}
        </div>
        <div className="text-white/40">{headerRight ?? "••"}</div>
      </div>

      {/* Body */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl border border-cyan-400/15 bg-[#0b1016]/60 p-5 ring-1 ring-cyan-400/10 shadow-[0_0_40px_rgba(0,229,255,.08)]"
      >
        {title && (
          <div className="mb-6 h-[2px] w-full bg-gradient-to-r from-cyan-300/90 via-cyan-200/70 to-transparent" />
        )}
        {children}
      </motion.div>
    </section>
  );
}
