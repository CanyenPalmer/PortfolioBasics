"use client";

import * as React from "react";
import {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import SectionPanel from "@/components/ui/SectionPanel";
import { profile } from "@/content/profile";
import ExperienceCard from "@/components/Experience/ExperienceCard";
import styles from "@/components/Experience/experience.module.css";

/**
 * Experience — pinned section with horizontal right→left card flow.
 * Fixes:
 * 1) Cards start moving ONLY when section is fully in view (lock occurs).
 * 2) After the last card is off-screen, scroll unlocks.
 * 
 * Implementation: use a dedicated "lock window" whose progress drives the deck.
 * - While the lock window is on-screen, the stage stays pinned and cards move.
 * - When it finishes, the stage unpins and scrolling continues normally.
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

/** Optional per-role metrics (you can key on company::role if desired) */
const metricsMap: MetricsMap = {
  "Iconic Care Inc.::Lead Analyst": [
    { label: "Funds Discovered", value: 20000, format: "currency", type: "counter" },
    { label: "Hours Saved / Week", value: 12, format: "number", type: "bar" },
    { label: "Rep Efficiency", value: 100, format: "percent", type: "ring" },
  ],
};

/** Fallback per-card metrics so tiles show immediately */
const metricsByIndex: MetricsByIndex = {
  // Card 0 — Lead Analyst
  0: [
    { label: "Funds Discovered", value: 20000, format: "currency", type: "counter" },
    { label: "Hours Saved / Week", value: 12, format: "number", type: "bar" },
    { label: "Rep Efficiency", value: 100, format: "percent", type: "ring" },
  ],
  // Card 1 — Billing & Revenue Specialist
  1: [
    { label: "Optimized Efficiency Increase", value: 150, format: "percent", type: "bar" },      // 150% bar (clipped)
    { label: "Dashboards Created", value: 15, format: "number", type: "counter", suffix: "+" }, // 15+
    { label: "Success Rate Increase", value: 45, format: "percent", type: "ring" },             // 45% ring
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

  /** Sticky title remains as-is */
  const titleRef = useRef<HTMLDivElement | null>(null);

  /** Lock window & pinned stage */
  const lockRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  /** Progress of the lock window ONLY (0→1 while fully engaged) */
  const { scrollYProgress: lockProgress } = useScroll({
    target: lockRef,
    offset: ["start start", "end end"],
  });
  const [lp, setLp] = useState(0);
  useMotionValueEvent(lockProgress, "change", (v) => setLp(clamp01(v)));

  /** Track viewport width (for x translate in px) */
  const [vw, setVw] = useState(0);
  useEffect(() => {
    const update = () => setVw(window.innerWidth || 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /**
   * Progress mapping:
   * p = lp * (cardCount + 1)
   * t_i = p - (i + 1)
   *  - At lp = 0:  t_0 = -1  (card 0 starts off-right)
   *  - At lp = 1/(cardCount+1): t_0 = 0 (centered, expands)
   *  - At lp = 1:  t_last = 2 (card N-1 far-left, fully off)
   */
  const p = lp * (cardCount + 1);

  /** Underline progress advances as cards center */
  const titleUnderlinePct = useMemo(() => {
    const viewed = Math.min(cardCount, Math.max(0, p)); // 0..cardCount
    return clamp01(viewed / cardCount);
  }, [p, cardCount]);

  return (
    <section data-section="experience" className="relative w-full">
      {/* Sticky Title */}
      <div ref={titleRef} className="sticky top-0 z-30 bg-transparent pt-8 pb-4">
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

      {/* Lock window: when this is on-screen, stage pins and cards move.
          Height determines the locked duration; after it finishes, unlocks. */}
      <div
        ref={lockRef}
        className={styles.lockWindow}
        style={{ height: `calc(${cardCount + 1} * 100vh)` }}
      >
        {/* Pinned stage sits under the title while the lock window is active */}
        <div ref={stageRef} className={styles.stagePin}>
          <div className={styles.stack}>
            {experiences.map((exp: any, idx: number) => {
              const k = keyFor(exp);
              const metrics =
                metricsMap[k] ??
                metricsByIndex[idx] ??
                [];

              // Per-card local offset; clamp to keep transforms sane
              const t = p - (idx + 1);
              const tClamped = Math.max(-2, Math.min(2, t));

              // Translate X in px: right→center→left
              const xPx = -tClamped * 0.60 * vw;

              // Scale: smaller at edges, bigger at center
              const scale = 0.94 + (1 - Math.min(1, Math.abs(tClamped))) * 0.10; // ~0.94 → ~1.04

              // Opacity: dim at edges
              const opacity = 0.55 + (1 - Math.min(1, Math.abs(tClamped))) * 0.45; // ~0.55 → 1

              // z-index: centered card on top
              const zIndex = 100 - Math.round(Math.min(1, Math.abs(tClamped)) * 50);

              // State flags for card behavior
              const isExpanded = Math.abs(t) < 0.12; // auto-expand in center band
              const isFocused = Math.abs(t) < 0.35;  // hover-scrub when focused

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
