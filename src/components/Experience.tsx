"use client";

import * as React from "react";
import { useMemo, useRef, useState, useEffect } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import SectionPanel from "@/components/ui/SectionPanel";
import { profile } from "@/content/profile";
import ExperienceCard from "@/components/Experience/ExperienceCard";
import styles from "@/components/Experience/experience.module.css";

/**
 * Experience — right→center→left card flow with teaser + lock.
 *
 * What this implements:
 * - Teaser: when the section is approaching, the first card “peeks” in and starts animating.
 * - Lock: when the section fully spans the viewport, the header + cards pin (fixed) and
 *   the deck continues to scroll horizontally with the user’s vertical scroll.
 * - No vertical shift at lock time: flow & fixed stages share the same geometry.
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

  // Lock window contains both the sticky header and the stage area
  const lockRef = useRef<HTMLDivElement | null>(null);

  // Sticky header inside the lock window (title + subheading)
  const headerRef = useRef<HTMLDivElement | null>(null);

  // Measure header height so stage sits exactly beneath it (no jump)
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

  // Viewport width for pixel-based X transforms
  const [vw, setVw] = useState(0);
  useEffect(() => {
    const update = () => setVw(window.innerWidth || 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /**
   * PRE-LOCK TEASER PROGRESS:
   * q in [0..1] from when the section is approaching (top hits ~80% of viewport)
   * to when its top reaches the top of the viewport (lock ready).
   * This drives the first card to “peek” in and move toward center.
   */
  const { scrollYProgress: preProg } = useScroll({
    target: lockRef,
    offset: ["start 80%", "start start"],
  });
  const [q, setQ] = useState(0);
  useMotionValueEvent(preProg, "change", (v) => setQ(clamp01(v)));

  /**
   * LOCK PROGRESS:
   * lp in [0..1] while the lock window spans the viewport (true pinning).
   * We map deck progress so first card is centered at lp=0.
   */
  const { scrollYProgress: lockProgress } = useScroll({
    target: lockRef,
    offset: ["start start", "end end"],
  });
  const [lp, setLp] = useState(0);
  useMotionValueEvent(lockProgress, "change", (v) => setLp(clamp01(v)));

  // Determine when lock is engaged: lock window fully covers viewport
  const [isLocked, setIsLocked] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const el = lockRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setIsLocked(r.top <= 0 && r.bottom >= window.innerHeight);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /**
   * Deck progress during LOCK:
   * We offset by +1 so the first card is centered at lp=0.
   * p ∈ [1, 1 + cardCount]
   */
  const pDuring = 1 + lp * cardCount;

  // Underline progress under the section title (increments per centered card)
  const titleUnderlinePct = useMemo(() => {
    const viewed = Math.min(cardCount, Math.max(0, pDuring)); // 0..cardCount (shifted)
    return clamp01(viewed / cardCount);
  }, [pDuring, cardCount]);

  return (
    <section data-section="experience" className="relative w-full">
      {/* Lock window wraps the sticky header and the stage and provides the scroll budget */}
      <div
        ref={lockRef}
        className={styles.lockWindow}
        style={{
          height: `calc(${cardCount + 1} * 100vh)`,
          ["--header-h" as any]: `${headerH}px`,
        }}
      >
        {/* Sticky header INSIDE the lock window (always visible during lock) */}
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

        {/* Stage holder reserves a consistent block under the header */}
        <div className={styles.stageHolder}>
          {/* -------- PRE-LOCK TEASER (visible only before lock) -------- */}
          <div className={`${styles.stageFlow} ${isLocked ? styles.isHidden : styles.isVisible}`}>
            <div className={styles.stack}>
              {experiences.map((exp: any, idx: number) => {
                const k = keyFor(exp);

                // Only the first card “peeks” during pre-lock; others stay off
                const tPre = idx === 0 ? q - 1 : 2; // -1(off-right) → 0(center) as q goes 0→1
                const tClamped = Math.max(-2, Math.min(2, tPre));

                const xPx = -tClamped * 0.60 * vw;
                const edge = Math.min(1, Math.abs(tClamped));
                const scale = 0.94 + (1 - edge) * 0.10;
                const opacity = 0.35 + (1 - edge) * 0.65; // fade in as it enters
                const zIndex = 100 - Math.round(edge * 50);

                // Focus/expand only when centered (q≈1), but teaser remains compact
                const isExpanded = false;
                const isFocused = Math.abs(tPre) < 0.35;

                const metrics = metricsMap[k] ?? metricsByIndex[idx] ?? [];

                return (
                  <ExperienceCard
                    key={`pre-${k}-${idx}`}
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

          {/* -------- LOCKED STAGE (fixed under header; visible only during lock) -------- */}
          <div className={`${styles.stageFixed} ${isLocked ? styles.isVisible : styles.isHidden}`}>
            <div className={styles.stack}>
              {experiences.map((exp: any, idx: number) => {
                const k = keyFor(exp);
                const metrics = metricsMap[k] ?? metricsByIndex[idx] ?? [];

                // Deck mapping during lock:
                // t = pDuring - (idx + 1); 0=center, -1=off-right, +1=off-left
                const t = pDuring - (idx + 1);
                const tClamped = Math.max(-2, Math.min(2, t));

                const xPx = -tClamped * 0.60 * vw;
                const edge = Math.min(1, Math.abs(tClamped));
                const scale = 0.94 + (1 - edge) * 0.10;
                const opacity = 0.55 + (1 - edge) * 0.45;
                const zIndex = 100 - Math.round(edge * 50);

                const isExpanded = Math.abs(t) < 0.12; // auto-expand in center band
                const isFocused = Math.abs(t) < 0.35;  // hover-scrub when focused

                return (
                  <ExperienceCard
                    key={`lock-${k}-${idx}`}
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
      </div>
    </section>
  );
}
