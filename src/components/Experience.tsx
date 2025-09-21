"use client";

import * as React from "react";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useScroll } from "framer-motion";
import SectionPanel from "@/components/ui/SectionPanel";
import { profile } from "@/content/profile";
import ExperienceCard from "@/components/Experience/ExperienceCard";
import styles from "@/components/Experience/experience.module.css";

/**
 * Experience — scroll-driven deck with expandable cards and metric tiles.
 * - Strictly scoped to the Experience section (no global side effects).
 * - Title is sticky within this section only.
 * - Metrics preview respond to cursor when a card is in focus; autoplay in expanded view.
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

/** 
 * Internal metrics map, keyed by `${company}::${role}`.
 * We also support a by-index fallback to avoid key mismatches.
 */
const metricsMap: MetricsMap = {
  "Iconic Care Inc.::Lead Analyst": [
    { label: "Funds Discovered", value: 20000, format: "currency", type: "counter" },
    { label: "Hours Saved / Week", value: 12, format: "number", type: "bar" },
    { label: "Rep Efficiency", value: 100, format: "percent", type: "ring" },
  ],
};

const metricsByIndex: MetricsByIndex = {
  // Card 0 — Lead Analyst (kept)
  0: [
    { label: "Funds Discovered", value: 20000, format: "currency", type: "counter" },
    { label: "Hours Saved / Week", value: 12, format: "number", type: "bar" },
    { label: "Rep Efficiency", value: 100, format: "percent", type: "ring" },
  ],
  // Card 1 — Billing & Revenue Specialist (NEW)
  1: [
    { label: "Optimized Efficiency Increase", value: 150, format: "percent", type: "bar" }, // fills to 150%
    { label: "Dashboards Created", value: 15, format: "number", type: "counter", suffix: "+" }, // shows 15+
    { label: "Success Rate Increase", value: 45, format: "percent", type: "ring" }, // 45% ring
  ],
};

function keyFor(exp: any) {
  const company = exp?.company ?? "";
  const role = exp?.role ?? exp?.title ?? "";
  return `${company}::${role}`;
}

export default function Experience() {
  const experiences = profile.experience ?? [];

  // Section scroll & refs
  const sectionRef = useRef<HTMLDivElement | null>(null);
  useScroll({ target: sectionRef, offset: ["start end", "end start"] }); // reserved if you want a progress later

  // Track which card is currently "focused"
  const [focusIndex, setFocusIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const onSetRef = useCallback((el: HTMLDivElement | null, idx: number) => {
    itemRefs.current[idx] = el;
  }, []);

  // Determine focusIndex on scroll by closest card to center
  useEffect(() => {
    const handler = () => {
      const viewportCenter = window.innerHeight / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      itemRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const dist = Math.abs(cardCenter - viewportCenter);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });
      setFocusIndex(bestIdx);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, []);

  // Title underline progress (cosmetic)
  const titleUnderlinePct = useMemo(() => {
    const total = experiences.length || 1;
    return Math.min(1, (focusIndex + 1) / total);
  }, [focusIndex, experiences.length]);

  const handleExpand = (idx: number) => setExpandedIndex(idx);
  const handleCollapse = () => setExpandedIndex(null);

  return (
    <section data-section="experience" ref={sectionRef} className="relative w-full">
      {/* Sticky Title */}
      <div className="sticky top-0 z-20 bg-transparent pt-8 pb-4">
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

      {/* Cards */}
      <div className={`${styles.stage} relative`}>
        <ul className="relative mx-auto max-w-4xl">
          {experiences.map((exp: any, idx: number) => {
            const k = keyFor(exp);
            const metrics =
              metricsMap[k] ??
              metricsByIndex[idx] ?? // fallback by index
              [];

            const isFocused = idx === focusIndex;
            const isExpanded = expandedIndex === idx;

            return (
              <li key={`${k}-${idx}`} className="relative">
                <ExperienceCard
                  refCallback={(el) => onSetRef(el, idx)}
                  experience={exp}
                  index={idx}
                  isFocused={isFocused}
                  isExpanded={!!isExpanded}
                  metrics={metrics}
                  onExpand={() => handleExpand(idx)}
                  onCollapse={handleCollapse}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
