"use client";

import * as React from "react";
import { useMemo, useRef, useState, useEffect } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import SectionPanel from "@/components/ui/SectionPanel";
import { profile } from "@/content/profile";
import ExperienceCard from "@/components/Experience/ExperienceCard";
import styles from "@/components/Experience/experience.module.css";

/**
 * Experience — right→center→left card flow with teaser + true lock.
 *
 * What this implements:
 * - Teaser: as the section approaches, the first card “peeks” in (≈half visible) and animates.
 * - Lock: once the lock window spans the viewport, the subheader + cards pin and continue
 *         to be driven by vertical scroll (true scroll lock).
 * - No vertical jump: pre-lock and locked stages share identical geometry; we toggle visibility only.
 * - Click-to-center: clicking a card scrolls to center it in full view.
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

  // Top title (not part of the lock; you asked to lock only the subheader)
  const TitleBlock = (
    <div className="pt-8 pb-2">
      <SectionPanel title="Experience">
        {/* accessible child to satisfy required 'children' */}
        <span className="sr-only">Experience section</span>
      </SectionPanel>
    </div>
  );

  // Lock window contains the sticky subheader + stage area
  const lockRef = useRef<HTMLDivElement | null>(null);

  // Sticky SUBHEADER (inside the lock window)
  const subheaderRef = useRef<HTMLDivElement | null>(null);

  // Measure subheader height so the stage sits directly beneath it (no jump)
  const [subH, setSubH] = useState(56); // default approx height
  useEffect(() => {
    const measure = () => {
      const h = Math.round(subheaderRef.current?.getBoundingClientRect().height || 56);
      setSubH(h);
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
   * PRE-LOCK TEASER:
   * q ∈ [0..1] from when the section top is at 80% viewport to when it hits top (lock ready).
   * tPre for the first card goes from -0.5 (≈half visible) → 0 (center) across q=0→1.
   */
  const { scrollYProgress: preProg } = useScroll({
    target: lockRef,
    offset: ["start 80%", "start start"],
  });
  const [q, setQ] = useState(0);
  useMotionValueEvent(preProg, "change", (v) => setQ(clamp01(v)));

  /**
   * LOCK PROGRESS:
   * lp ∈ [0..1] while the lock window spans the viewport (true pin).
   * Map so card 0 is centered when lp=0, and the last card exits by lp=1.
   */
  const { scrollYProgress: lockProgress } = useScroll({
    target: lockRef,
    offset: ["start start", "end end"],
  });
  const [lp, setLp] = useState(0);
  useMotionValueEvent(lockProgress, "change", (v) => setLp(clamp01(v)));

  // Are we locked? (window fully covering viewport)
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
   * pDuring = 1 + lp * cardCount
   * -> t = pDuring - (idx + 1); t=0 means centered.
   */
  const pDuring = 1 + lp * cardCount;

  // Subheader underline progress (increments as cards center)
  const underlinePct = useMemo(() => {
    const viewed = Math.min(cardCount, Math.max(0, pDuring)); // 0..cardCount
    return clamp01(viewed / cardCount);
  }, [pDuring, cardCount]);

  // Click-to-center helper: compute target scroll for a given index
  const centerCard = React.useCallback(
    (idx: number) => {
      const el = lockRef.current;
      if (!el || cardCount <= 0) return;
      const rect = el.getBoundingClientRect();
      const topY = window.scrollY + rect.top;

      // lp target to center idx: lp = idx / cardCount
      const targetLp = idx / cardCount;

      // Scrollable height inside the lock window:
      const scrollable = el.offsetHeight - window.innerHeight;
      const targetY = topY + targetLp * Math.max(1, scrollable);

      window.scrollTo({ top: targetY, behavior: "smooth" });
    },
    [cardCount]
  );

  return (
    <section data-section="experience" className="relative w-full">
      {/* Title outside the lock; you asked to keep only the subheader in the lock */}
      {TitleBlock}

      {/* Lock window wraps the sticky subheader + stage; it provides the scroll budget */}
      <div
        ref={lockRef}
        className={styles.lockWindow}
        style={{
          height: `calc(${cardCount + 1} * 100vh)`,
          ["--sub-h" as any]: `${subH}px`,
        }}
      >
        {/* Sticky SUBHEADER INSIDE the lock (always visible while locked) */}
        <div ref={subheaderRef} className={styles.subheaderSticky}>
          <div className={styles.subheaderRow}>
            <span className="text-sm opacity-80">
              <span className="text-[var(--accent,_#7dd3fc)] font-medium">Impact</span> over titles
            </span>
            <div className={styles.underlineTrack} aria-hidden>
              <div
                className={styles.underlineFill}
                style={{ width: `${Math.max(0, Math.min(1, underlinePct)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stage holder keeps identical geometry pre-lock and locked → no vertical jump */}
        <div className={styles.stageHolder}>
          {/* -------- PRE-LOCK TEASER (visible only before lock) -------- */}
          <div className={`${styles.stageFlow} ${isLocked ? styles.isHidden : styles.isVisible}`}>
            <div className={styles.stack}>
              {experiences.map((exp: any, idx: number) => {
                const k = keyFor(exp);
                const metrics = (metricsMap as any)[k] ?? (metricsByIndex as any)[idx] ?? [];

                // Only the first card peeks pre-lock; others stay off to the right
                const tPre = idx === 0 ? (-0.5 + 0.5 * q) : 2; // -0.5 → 0 as q:0→1
                const tClamped = Math.max(-2, Math.min(2, tPre));

                const vw = window.innerWidth || 0;
                const xPx = -tClamped * 0.60 * vw;
                const edge = Math.min(1, Math.abs(tClamped));
                const scale = 0.94 + (1 - edge) * 0.10;
                const opacity = 0.35 + (1 - edge) * 0.65; // fade in as enters
                const zIndex = 100 - Math.round(edge * 50);

                const isExpanded = false;                 // teaser stays compact
                const isFocused = Math.abs(tPre) < 0.35;  // hover-scrub feel

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
                    onCenter={() => centerCard(idx)}
                  />
                );
              })}
            </div>
          </div>

          {/* -------- LOCKED STAGE (fixed under subheader; visible only while locked) -------- */}
          <div className={`${styles.stageFixed} ${isLocked ? styles.isVisible : styles.isHidden}`}>
            <div className={styles.stack}>
              {experiences.map((exp: any, idx: number) => {
                const k = keyFor(exp);
                const metrics = (metricsMap as any)[k] ?? (metricsByIndex as any)[idx] ?? [];

                // Deck mapping during lock:
                // t = pDuring - (idx + 1); t=0 means perfectly centered.
                const t = pDuring - (idx + 1);
                const tClamped = Math.max(-2, Math.min(2, t));

                const vw = window.innerWidth || 0;
                const xPx = -tClamped * 0.60 * vw;
                const edge = Math.min(1, Math.abs(tClamped));
                const scale = 0.94 + (1 - edge) * 0.10;
                const opacity = 0.55 + (1 - edge) * 0.45;
                const zIndex = 100 - Math.round(edge * 50);

                const isExpanded = Math.abs(t) < 0.12; // auto-expand at center
                const isFocused  = Math.abs(t) < 0.35; // hover-scrub band

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
                    onCenter={() => centerCard(idx)}
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

