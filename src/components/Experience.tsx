"use client";

import * as React from "react";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import SectionPanel from "@/components/ui/SectionPanel";
import { profile } from "@/content/profile";
import ExperienceCard from "./Experience/ExperienceCard";
import styles from "./Experience/experience.module.css";

/**
 * Experience — scroll-driven deck with expandable cards and metric tiles.
 * - Strictly scoped to the Experience section (no global side effects).
 * - Title is sticky within this section only.
 * - Metrics preview respond to cursor when a card is in focus; autoplay in expanded view.
 */

type Metric = {
  label: string;
  value: number;
  format?: "currency" | "number" | "percent";
  type?: "counter" | "bar" | "ring";
  icon?: string; // optional icon name if you later want to use lucide or similar
};

type MetricsMap = Record<string, Metric[]>;

/** 
 * Internal metrics map, keyed by `${company}::${role}`.
 * Keep profile.tsx untouched; add/adjust entries here as you like.
 */
const metricsMap: MetricsMap = {
  // Example: Iconic Care — Lead Analyst
  "Iconic Care::Lead Analyst": [
    { label: "Funds Discovered", value: 20000, format: "currency", type: "counter", icon: "wallet" },
    { label: "Hours Saved / Week", value: 12, format: "number", type: "bar", icon: "timer" },
    { label: "Rep Efficiency", value: 100, format: "percent", type: "ring", icon: "gauge" },
  ],
  // Add more by copying the pattern above, or leave absent to hide metrics for that card.
};

function keyFor(exp: any) {
  const company = exp?.company ?? "";
  const role = exp?.role ?? exp?.title ?? "";
  return `${company}::${role}`;
}

export default function Experience() {
  const experiences = profile.experience ?? [];

  // Refs + scroll progress for section
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  // Sticky title underline progress (advances as user browses cards)
  const cardCount = experiences.length || 1;
  const titleUnderline = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Track which card is currently "focused"
  const [focusIndex, setFocusIndex] = useState(0);

  // Expanded card index, or null if none
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Keep measurements to determine focus by scroll position
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const onSetRef = useCallback((el: HTMLDivElement | null, idx: number) => {
    itemRefs.current[idx] = el;
  }, []);

  // Determine focusIndex on scroll by closest card to the center of the viewport
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

  // Title underline width as fraction of cards viewed (purely cosmetic)
  const titleUnderlinePct = useMemo(() => {
    // Map focusIndex to progress across total cards (0..1)
    if (cardCount <= 1) return 1;
    return (focusIndex + 1) / cardCount;
  }, [focusIndex, cardCount]);

  // Safe expand/collapse
  const handleExpand = (idx: number) => setExpandedIndex(idx);
  const handleCollapse = () => setExpandedIndex(null);

  // Render
  return (
    <section data-section="experience" ref={sectionRef} className="relative w-full">
      {/* Sticky Title (Experience) */}
      <div className="sticky top-0 z-20 bg-transparent pt-8 pb-4">
        <SectionPanel title="Experience" subtitle="Impact over titles">
          <div className="mt-3 h-1 w-full bg-transparent">
            <div
              className="h-[2px] bg-[var(--accent,_#7dd3fc)] transition-[width]"
              style={{ width: `${Math.max(0, Math.min(1, titleUnderlinePct)) * 100}%` }}
              aria-hidden
            />
          </div>
        </SectionPanel>
      </div>

      {/* Sticky stage that cards move through */}
      <div className={`${styles.stage} relative`}>
        <ul className="relative mx-auto max-w-4xl">
          {experiences.map((exp: any, idx: number) => {
            const k = keyFor(exp);
            const metrics: Metric[] | undefined = metricsMap[k];

            // State helpers
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
