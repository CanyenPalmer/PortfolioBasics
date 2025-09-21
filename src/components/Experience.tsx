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
 * - Scroll drives: enter from right → center (auto-expand) → exit left
 * - Sticky title; underline progress increments per card
 * - Metrics: hover-scrub in focus, autoplay when centered/expanded
 * - Everything scoped to Experience only
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

/** Fallback per-card metrics to guarantee tiles show immediately */
const metricsByIndex: MetricsByIndex = {
  // Card 0 — Lead Analyst
  0: [
    { label: "Funds Discovered", value: 20000, format: "currency", type: "counter" },
    { label: "Hours Saved / Week", value: 12, format: "number", type: "bar" },
    { label: "Rep Efficiency", value: 100, format: "percent", type: "ring" },
  ],
  // Card 1 — Billing & Revenue Specialist (your requested three)
  1: [
    { label: "Optimized Efficiency Increase", value: 150, format: "percent", type: "bar" }, // fills to 150%, clipped inside pill
    { label: "Dashboards Created", value: 15, format: "number", type: "counter", suffix: "+" }, // 15+
    { label: "Success Rate Increase", value: 45, format: "percent", type: "ring" }, // 45% ring
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

  /** Section height: N+1 viewports for scroll room */
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);

  /** Get 0→1 progress for this section */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const [prog, setProg] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setProg(v));

  /** Track viewport width to translate vw→px for Motion x */
  const [vw, setVw] = useState(0);
  useEffect(() => {
    const update = () => setVw(window.innerWidth || 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /** Map progress across cards; t = local offset per card (0=center) */
  const centerThreshold = 0.12; // auto-expand when |t| < threshold
  const focusThreshold = 0.35;  // consider focused when |t| < this

  /** Nearest index to center (for underline progress) */
  const nearestIndex = useMemo(() => {
    const p = prog * cardCount;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < cardCount; i++) {
      const t = p - i;
      const d = Math.abs(t);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    return best;
  }, [prog, cardCount]);

  /** Underline = viewed fraction */
  const titleUnderlinePct = useMemo(() => {
    return clamp01((nearestIndex + 1) / cardCount);
  }, [nearestIndex, cardCount]);

  return (
    <section
      data-section="experience"
      ref={sectionRef}
      className="relative w-full"
      style={{ height: `calc(${cardCount + 1} * 100vh)` }} // scroll room
    >
      {/* Sticky Title (pinned at top) */}
      <div className="sticky top-0 z-30 bg-transparent pt-8 pb-4">
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

      {/* Sticky Stage (pins under the title) */}
      <div ref={pinRef} className={styles.stagePin}>
        <div className={styles.stack}>
          {experiences.map((exp: any, idx: number) => {
            const k = keyFor(exp);
            const metrics =
              metricsMap[k] ??
              metricsByIndex[idx] ??
              [];

            // Per-card local offset, 0 is center, -1 is one card before, +1 is one card after
            const t = prog * cardCount - idx;

            // Motion params derived from t (clamped to [-1, 1] for visuals)
            const tClamped = Math.max(-1, Math.min(1, t));

            // Translate X in px: -t * 60vw (right→center→left)
            const xPx = -tClamped * 0.60 * vw;

            // Scale: smaller at edges, bigger at center
            const scale = 0.94 + (1 - Math.abs(tClamped)) * 0.10; // ~0.94 → 1.04

            // Opacity: dim at edges
            const opacity = 0.55 + (1 - Math.abs(tClamped)) * 0.45; // ~0.55 → 1.0

            // z-index: centered card on top
            const zIndex = 100 - Math.round(Math.abs(tClamped) * 50);

            // State flags
            const isExpanded = Math.abs(t) < centerThreshold;
            const isFocused = Math.abs(t) < focusThreshold;

            return (
              <ExperienceCard
                key={`${k}-${idx}`}
                experience={exp}
                index={idx}
                isFocused={isFocused}
                isExpanded={isExpanded}
                metrics={metrics}
                // Motion styles for right→center→left flow
                x={xPx}
                scale={scale}
                opacity={opacity}
                zIndex={zIndex}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
