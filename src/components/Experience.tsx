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
  useEffect(() => {
    const update = () => setVw(window.innerWidth || 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Fixed header offset — compute on mount + resize only (avoid drift)
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
    return () => {
      window.removeEventListener("resize", computeTopOffset);
    };
  }, []);

  // Pre-lock progress (teaser + prefill underline)
  const { scrollYProgress: preProg } = useScroll({
    target: lockRef,
    offset: ["start 80%", "start start"],
  });
  const [q, setQ] = useState(0);
  useMotionValueEvent(preProg, "change", (v) => setQ(clamp01(v)));

  // Lock progress
  const { scrollYProgress: lockProgress } = useScroll({
    target: lockRef,
    offset: ["start start", "end end"],
  });
  const [lp, setLp] = useState(0);
  useMotionValueEvent(lockProgress, "change", (v) => setLp(clamp01(v)));

  // Direction-aware lock with tiny hysteresis to avoid boundary jitter
  const lastYRef = useRef(0);
  const ENTER_EPS = 2;
  const EXIT_EPS_TOP = 0;
  const EXIT_EPS_BOTTOM = 2;

  const [isLocked, setIsLocked] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const FADE_MS = 220;
  const fadeTimerRef = useRef<number | null>(null);
  const [inView, setInView] = useState(false); // NEW: is the section on screen at all?

  useEffect(() => {
    const onScroll = () => {
      const el = lockRef.current;
      if (!el) return;

      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setInView(r.bottom > 0 && r.top < vh); // keep the line visible while the section is on screen

      const y = window.scrollY || 0;
      const dirDown = y > lastYRef.current;
      lastYRef.current = y;

      if (!isLocked) {
        const enter = r.top <= ENTER_EPS && r.bottom >= vh - ENTER_EPS;
        if (enter) {
          if (fadeTimerRef.current) {
            window.clearTimeout(fadeTimerRef.current);
            fadeTimerRef.current = null;
          }
          setJustUnlocked(false);
          setIsLocked(true);
        }
      } else {
        const stillCovers =
          r.top <= EXIT_EPS_TOP && r.bottom >= vh - EXIT_EPS_BOTTOM;
        if (!stillCovers) {
          setIsLocked(false);
          setJustUnlocked(true);
          if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
          fadeTimerRef.current = window.setTimeout(() => {
            setJustUnlocked(false);
            fadeTimerRef.current = null;
          }, FADE_MS);
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    };
  }, [isLocked]);

  // Card progression during lock
  const pDuring = 1 + lp * cardCount;

  // Underline fill (freeze during fade-out to avoid any reset/jump)
  const underlineLive = useMemo(() => {
    if (!isLocked) return 0.5 * clamp01(q); // 0 → 50% pre-lock
    if (cardCount <= 1) return 1;
    const pb = clamp01((pDuring - 1) / (cardCount - 1));
    return 0.5 + 0.5 * pb;
  }, [isLocked, q, pDuring, cardCount]);

  const lastUnderlineRef = useRef(0);
  useEffect(() => {
    if (!justUnlocked) lastUnderlineRef.current = underlineLive;
  }, [underlineLive, justUnlocked]);
  const underlineForRender = justUnlocked ? lastUnderlineRef.current : underlineLive;

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

  // Keep the bar visible whenever the section is on screen (pre-lock + lock).
  const barOpacity = (isLocked || inView) ? 1 : 0;

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
          ["--sub-shift" as any]: `0px`,
        }}
      >
        {/* Progress header line — stays visible while section is in view and during lock */}
        <div
          ref={subheaderRef}
          className={styles.subheaderSticky}
          style={{
            position: "sticky",
            top: `${topOffset}px`,
            left: 0,
            right: 0,
            width: "100%",
            zIndex: 80,                 // ensure above cards
            opacity: barOpacity,        // visible in view + lock
            transition: `opacity ${FADE_MS}ms ease`,
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
        >
          <div className={styles.subheaderRow}>
            <span className="text-sm opacity-80">
              <span className="text-[var(--accent,_#7dd3fc)] font-medium">Progress</span> Through Experience
            </span>
            <div className={styles.underlineTrack} aria-hidden>
              <div
                className={styles.underlineFill}
                style={{ width: `${Math.max(0, Math.min(1, underlineForRender)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stage */}
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


