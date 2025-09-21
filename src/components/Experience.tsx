"use client";

import * as React from "react";
import { useMemo, useRef, useState, useEffect } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import SectionPanel from "@/components/ui/SectionPanel";
import { profile } from "@/content/profile";
import ExperienceCard from "@/components/Experience/ExperienceCard";
import styles from "@/components/Experience/experience.module.css";

export type Metric = {
  label: string;
  value: number;
  format?: "currency" | "number" | "percent";
  type?: "counter" | "ring" | "bar";
  icon?: string;
  suffix?: string;
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

// very gentle ease so the bar doesn't travel far/fast
function gentleProgress(lp: number) {
  const s = clamp01(lp);
  return s * s; // ease-in quad
}

export default function Experience() {
  const experiences = profile.experience ?? [];
  const cardCount = experiences.length || 1;

  const TitleBlock = (
    <div className="pt-8 pb-2">
      <SectionPanel title="Experience">
        <span className="sr-only">Experience section</span>
      </SectionPanel>
    </div>
  );

  const lockRef = useRef<HTMLDivElement | null>(null);
  const subheaderRef = useRef<HTMLDivElement | null>(null);

  const [subH, setSubH] = useState(56);
  useEffect(() => {
    const measure = () => {
      const h = Math.round(subheaderRef.current?.getBoundingClientRect().height || 56);
      setSubH(h);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const [vw, setVw] = useState(0);
  const [vh, setVh] = useState(0);
  useEffect(() => {
    const update = () => {
      setVw(window.innerWidth || 0);
      setVh(window.innerHeight || 0);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const [topOffset, setTopOffset] = useState(0);
  useEffect(() => {
    const computeTopOffset = () => {
      let max = 0;
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>(
          'header, nav, [data-fixed-header], [data-sticky="header"], [data-header]'
        )
      );
      nodes.forEach((el) => {
        const cs = window.getComputedStyle(el);
        if (cs.position === "fixed") {
          const r = el.getBoundingClientRect();
          if (Math.abs(r.top) < 2) {
            const h = Math.round(r.height);
            if (h > max) max = h;
          }
        }
      });
      setTopOffset(max);
    };
    computeTopOffset();
    window.addEventListener("resize", computeTopOffset);
    window.addEventListener("scroll", computeTopOffset, { passive: true });
    return () => {
      window.removeEventListener("resize", computeTopOffset);
      window.removeEventListener("scroll", computeTopOffset);
    };
  }, []);

  // PRE-LOCK teaser/underline progress
  const { scrollYProgress: preProg } = useScroll({
    target: lockRef,
    offset: ["start 80%", "start start"],
  });
  const [q, setQ] = useState(0);
  useMotionValueEvent(preProg, "change", (v) => setQ(clamp01(v)));

  // LOCK progress
  const { scrollYProgress: lockProgress } = useScroll({
    target: lockRef,
    offset: ["start start", "end end"],
  });
  const [lp, setLp] = useState(0);
  useMotionValueEvent(lockProgress, "change", (v) => setLp(clamp01(v)));

  // Locked?
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

  // Unlock fade-out without flicker
  const wasLockedRef = useRef(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [holdFixed, setHoldFixed] = useState(false);

  useEffect(() => {
    let t1: any, t2: any;
    if (wasLockedRef.current && !isLocked) {
      // start fade while keeping bar fixed at its last position & width
      setHoldFixed(true);
      setJustUnlocked(true);
      t1 = setTimeout(() => setJustUnlocked(false), 420);
      t2 = setTimeout(() => setHoldFixed(false), 420);
    }
    wasLockedRef.current = isLocked;
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isLocked]);

  // Card mapping during lock
  const pDuring = 1 + lp * cardCount;

  // ---- Impact underline fill (freeze during fade-out to avoid reset flicker)
  const underlineLive = useMemo(() => {
    if (!isLocked) {
      return 0.5 * clamp01(q); // 0%→50% before lock
    }
    if (cardCount <= 1) return 1;
    const pb = clamp01((pDuring - 1) / (cardCount - 1)); // 0 at first center → 1 at last
    return 0.5 + 0.5 * pb;
  }, [isLocked, q, pDuring, cardCount]);

  const lastUnderlineRef = useRef(0);
  useEffect(() => {
    // update stored value whenever not in the fade-out hold
    if (!holdFixed) lastUnderlineRef.current = underlineLive;
  }, [underlineLive, holdFixed]);
  const underlineForRender = holdFixed ? lastUnderlineRef.current : underlineLive;

  // Limit + slow bar vertical travel (very small cap)
  const shiftMax = Math.min(16, Math.round((vh || 480) * 0.04)); // ~16px max
  const liveShift = isLocked ? gentleProgress(lp) * shiftMax : 0;

  // Preserve last locked shift during fade-out to prevent jump/flicker
  const lastShiftRef = useRef(0);
  useEffect(() => {
    if (!holdFixed && isLocked) lastShiftRef.current = liveShift;
  }, [isLocked, holdFixed, liveShift]);
  const shiftForTop = isLocked ? liveShift : holdFixed ? lastShiftRef.current : 0;

  // Click-to-center
  const centerCard = React.useCallback(
    (idx: number) => {
      const el = lockRef.current;
      if (!el || cardCount <= 0) return;
      const rect = el.getBoundingClientRect();
      const topY = window.scrollY + rect.top;
      const targetLp = idx / cardCount;
      const scrollable = el.offsetHeight - window.innerHeight;
      const targetY = topY + targetLp * Math.max(1, scrollable);
      window.scrollTo({ top: targetY, behavior: "smooth" });
    },
    [cardCount]
  );

  const fixedNow = isLocked || holdFixed;

  return (
    <section data-section="experience" className="relative w-full">
      {TitleBlock}

      <div
        ref={lockRef}
        className={styles.lockWindow}
        style={{
          height: `calc(${cardCount + 1} * 100vh)`,
          ["--sub-h" as any]: `${subH}px`,
          ["--top-offset" as any]: `${topOffset}px`,
          ["--sub-shift" as any]: `${Math.max(0, Math.round(liveShift))}px`, // layout uses live shift
        }}
      >
        {/* Impact bar (now capped travel + frozen during fade-out) */}
        <div
          ref={subheaderRef}
          className={styles.subheaderSticky}
          style={{
            position: fixedNow ? ("fixed" as const) : "sticky",
            top: fixedNow
              ? `calc(${topOffset}px + ${Math.max(0, Math.round(shiftForTop))}px)`
              : undefined,
            left: fixedNow ? 0 : undefined,
            right: fixedNow ? 0 : undefined,
            width: fixedNow ? "100%" : undefined,
            opacity: justUnlocked ? 0 : 1,
            transition: fixedNow
              ? "top .22s ease, opacity .38s ease"
              : justUnlocked
              ? "opacity .38s ease"
              : "opacity 0s linear",
          }}
        >
          <div className={styles.subheaderRow}>
            <span className="text-sm opacity-80">
              <span className="text-[var(--accent,_#7dd3fc)] font-medium">Impact</span> over titles
            </span>
            <div className={styles.underlineTrack} aria-hidden>
              <div
                className={styles.underlineFill}
                style={{ width: `${Math.max(0, Math.min(1, underlineForRender)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stage holder keeps identical geometry pre-lock and locked */}
        <div className={styles.stageHolder}>
          {/* Pre-lock teaser */}
          <div className={`${styles.stageFlow} ${isLocked ? styles.isHidden : styles.isVisible}`}>
            <div className={styles.stack}>
              {experiences.map((exp: any, idx: number) => {
                const k = keyFor(exp);
                const metrics = (metricsMap as any)[k] ?? (metricsByIndex as any)[idx] ?? [];
                const tPre = idx === 0 ? -0.5 + 0.5 * q : 2;
                const tClamped = Math.max(-2, Math.min(2, tPre));
                const xPx = -tClamped * 0.60 * vw;
                const edge = Math.min(1, Math.abs(tClamped));
                const scale = 0.94 + (1 - edge) * 0.10;
                const opacity = 0.35 + (1 - edge) * 0.65;
                const zIndex = 100 - Math.round(edge * 50);
                const isExpanded = false;
                const isFocused = Math.abs(tPre) < 0.35;

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

          {/* Locked deck */}
          <div className={`${styles.stageFixed} ${isLocked ? styles.isVisible : styles.isHidden}`}>
            <div className={styles.stack}>
              {experiences.map((exp: any, idx: number) => {
                const k = keyFor(exp);
                const metrics = (metricsMap as any)[k] ?? (metricsByIndex as any)[idx] ?? [];
                const t = 1 + lp * cardCount - (idx + 1);
                const tClamped = Math.max(-2, Math.min(2, t));
                const xPx = -tClamped * 0.60 * vw;
                const edge = Math.min(1, Math.abs(tClamped));
                const scale = 0.94 + (1 - edge) * 0.10;
                const opacity = 0.55 + (1 - edge) * 0.45;
                const zIndex = 100 - Math.round(edge * 50);
                const isExpanded = Math.abs(t) < 0.12;
                const isFocused = Math.abs(t) < 0.35;

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
