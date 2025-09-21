"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export type Metric = {
  label: string;
  value: number;
  format?: "currency" | "number" | "percent";
  type?: "counter" | "bar" | "ring";
  icon?: string;
};

type Props = {
  metric: Metric;
  preview?: boolean;  // mouse-driven preview when focused
  autoplay?: boolean; // deterministic play in expanded view
};

function formatValue(v: number, fmt: Metric["format"]) {
  switch (fmt) {
    case "currency":
      return v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });
    case "percent":
      return `${Math.round(v)}%`;
    default:
      return v.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }
}

export default function MetricTile({ metric, preview, autoplay }: Props) {
  const target = metric.value;
  const raw = useMotionValue(0);

  // Ring math (0..100 mapped to stroke length)
  const radius = 24;
  const circumference = 2 * Math.PI * radius;

  // Derived transforms
  const ringProgress = useTransform(raw, [0, 100], [0, circumference]);
  const ringDashOffset = useTransform(ringProgress, (v) => circumference - v);
  const barWidthPct = useTransform(raw, [0, 100], ["0%", "100%"]);

  // Number display
  const display = useTransform(raw, (v) => {
    const capped = metric.format === "percent" ? Math.min(v, 100) : v;
    return formatValue(Math.round(capped), metric.format);
  });

  // Hover/preview: mouse sets 0..target (full), Expanded: animate to target
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (autoplay) {
      const controls = animate(raw, target, { duration: 1.2, ease: "easeOut" });
      return () => controls.stop();
    }
    // Reset when leaving autoplay
    raw.set(0);
  }, [autoplay, target, raw]);

  React.useEffect(() => {
    if (!preview) return;

    const el = ref.current;
    if (!el) return;

    // Full preview to the metric's target (no 40–60% cap)
    const cap = metric.format === "percent" ? Math.min(target, 100) : target;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = Math.max(rect.left, Math.min(e.clientX, rect.right));
      const ratio = (x - rect.left) / Math.max(1, rect.width); // 0..1
      const next = Math.round(cap * ratio); // reach full target at far right
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => raw.set(next));
    };

    const onLeave = () => raw.set(0);

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [preview, target, metric.format, raw]);

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm hover:border-[var(--accent,_#7dd3fc)]/60 transition-colors"
      style={{ willChange: "transform, opacity" }}
      aria-label={`${metric.label} ${formatValue(metric.value, metric.format)}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-wide opacity-80">{metric.label}</div>
        <motion.div className="text-right text-base font-semibold tabular-nums">
          {display}
        </motion.div>
      </div>

      {/* Visualizer */}
      {metric.type === "ring" ? (
        <div className="mt-2 flex items-center justify-center">
          <svg width="64" height="64" viewBox="0 0 64 64" className="block">
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              opacity={0.15}
            />
            <motion.circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke="var(--accent, currentColor)"
              strokeWidth="6"
              strokeDasharray={circumference}
              style={{ strokeDashoffset: ringDashOffset }}
              transform="rotate(-90 32 32)"
            />
          </svg>
        </div>
      ) : metric.type === "bar" ? (
        <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[var(--accent,_#7dd3fc)]"
            style={{ width: barWidthPct }}
          />
        </div>
      ) : (
        // counter-only: baseline progress line
        <div className="mt-2 h-[2px] w-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-[var(--accent,_#7dd3fc)]"
            style={{ width: barWidthPct }}
          />
        </div>
      )}
    </div>
  );
}
