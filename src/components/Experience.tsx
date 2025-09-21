"use client";

import * as React from "react";
import { useMemo, useRef, useState, useEffect } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import SectionPanel from "@/components/ui/SectionPanel";
import { profile } from "@/content/profile";
import ExperienceCard from "@/components/Experience/ExperienceCard";
import styles from "@/components/Experience/experience.module.css";

/**
 * Experience — pinned section with right→center→left card flow.
 * Fixes:
 *  - No shift when the lock engages (single sticky stage, no position toggle).
 *  - Cards move continuously with scroll (progress bound to lock window).
 *  - Title + subheader stay in view (header is part of the pinned section).
 */

export type Metric = {
  label: string;
  value: number;
  format?: "currency" | "number" | "percent";
  type?: "counter" | "bar" | "ring";
  icon?: string;
  suffix?: string; // e.g., "+"
};

type MetricsMap = Record<string, Metric[]>;
type MetricsByIndex = Record<number, Metric[]>;

const metricsMap: MetricsMap = {
  "Iconic Care Inc.::Lead Analyst": [
    { label: "Funds Discovered", value: 20000, format: "currency", type: "counter" },
    { label: "Hours Saved / Week", value: 12, format: "number", type: "bar" },
    { label: "Rep Efficiency", value: 100, format: "percent", type: "ring" },
  ],
};

const metricsByIndex: MetricsByIndex = {
  0: [
    { label: "Funds Discovered", value: 20000, format: "currency", type: "counter" },
    { label: "Hours Saved / Week", value: 12, format: "number", type: "bar" },
    { label: "Rep Efficiency", value: 100, format: "percent", type: "ring" },
  ],
  1: [
    { label: "Optimized Efficiency Increase", value: 150, format: "percent", type: "bar" },
    { label: "Dashboards Created", value: 15, format: "number", type: "counter", suffix: "+" },
    { label: "Success Rate Increase", value: 45, format: "percent", type: "ring" },
  ],
};

function keyFor(exp: any) {
  const company = exp?.company ?? "";
  const role = exp?.role ?? exp?.title ?? "";
  return `${company}::${role}`;
}
function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export default function Experience() {
  const experiences = profile.experience ?? [];
  const cardCount = experiences.length || 1;

  // Lock window (drives progress) — contains BOTH header and stage
  const lockRef = useRef<HTMLDivElement | null>(null);

  // Header height so the stage sits directly under it (no vertical jump)
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerH, setHeaderH] = useState(96);
  useEffect(() => {
    const measure = () => {
      const h = Math.round(headerRef.current?.getBoundingClientRect().height || 96);
      setHeaderH(h);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Progress ONLY while the lock window is engaged
  const { scrollYProgress: lockProgress } = useScroll({
    target: lockRef,
    offset: ["start start", "end end"],
  });
  const [lp, setLp] = useState(0);
  useMotionValueEvent(lockProgress, "change", (v) => setLp(clamp01(v)));

  // Viewport width for pixel-based X transforms
  const [vw, setVw] = useState(0);
  useEffect(() => {
    const update = () => setVw(window.innerWidth || 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /**
   * Deck progress across (cardCount + 1) stops:
   * p = lp * (cardCount + 1)
   * t_i = p - (i + 1)
   *  - lp=0:  card 0 off-right
   *  - lp=1/(cardCount+1): card 0 centered/expanded
   *  - lp=1:  last card fully off-left
   */
  const p = lp * (cardCount + 1);

  // Underline progress under the section title
  const titleUnderlinePct = useMemo(() => {
    const viewed = Math.min(cardCount, Math.max(0, p)); // 0..cardCount
    return clamp01(viewed / cardCount);
  }, [p, cardCount]);

  return (
    <section data-section="experience" className="relative w-full">
      {/* Lock window wraps header + stage and provides the scroll budget */}
      <div
        ref={lockRef}
        className={styles.lockWindow}
        style={{
          // Enough scroll to bring each card to center, plus entry/exit leeway
          height: `calc(${cardCount + 1} * 100vh)`,
          // Share header height var to CSS
          ["--header-h" as any]: `${headerH}px`,
        }}
      >
        {/* Sticky header INSIDE the lock (always visible during lock) */}
        <div ref={headerRef} className={styles.pinHeader}>
          <SectionPanel title="Experience">
            <p className="mt-1 text-sm opacity-80">
              <span className="text-[var(--accent,_#7dd3fc)] font-medium">Impact</span> over titles
            </p>
            <div className="mt-3 h-1 w-full bg-transparent">
              <div
                className="h-[2px] bg-[var(--accent,_#7dd3fc)] transition-[width]"
                style={{ width: `${Math.max(0, Math.min(1, titleUnderlinePct)) * 100}%` }}
                aria-hidden
              />
            </div>
          </SectionPanel>
        </div>

        {/* Single sticky stage directly under header — no position toggle, no shift */}
        <div className={styles.stageSticky}>
          <div className={styles.stack}>
            {experiences.map((exp: any, idx: number) => {
              const k = keyFor(exp);
              const metrics =
                metricsMap[k] ??
                metricsByIndex[idx] ??
                [];

              // Per-card offset across the deck (driven by scroll)
              const t = p - (idx + 1);
              const tClamped = Math.max(-2, Math.min(2, t));

              // Translate X in px: right→center→left
              const xPx = -tClamped * 0.60 * vw;

              // Scale & opacity based on distance from center
              const edge = Math.min(1, Math.abs(tClamped));
              const scale = 0.94 + (1 - edge) * 0.10;     // ~0.94 → ~1.04
              const opacity = 0.55 + (1 - edge) * 0.45;   // ~0.55 → 1
              const zIndex = 100 - Math.round(edge * 50); // center on top

              const isExpanded = Math.abs(t) < 0.12; // center band
              const isFocused  = Math.abs(t) < 0.35; // hover-scrub

              return (
                <ExperienceCard
                  key={`${k}-${idx}`}
                  experience={exp}
                  index={idx}
                  isFocused={isFocused}
                  isExpanded={isExpanded}
                  metrics={metrics}
                  x={xPx}
                  scale={scale}
                  opacity={opacity}
                  zIndex={zIndex}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

