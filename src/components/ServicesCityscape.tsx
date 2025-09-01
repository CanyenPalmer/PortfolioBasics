"use client";

import React from "react";

/**
 * Cyber City — Six Variant Billboards (Auto-Fit Titles, Mixed Mounts)
 * - Billboards sit ON TOP as building headers (proper hardware per variant)
 * - Titles always fit inside (padding + 1–2 line smart wrap + auto font size)
 * - Six variants: blade, cantilever, gantry, cabinet, marquee, trapezoid
 * - Neon tones alternate (cyan / magenta / amber), mixed mount heights
 * - Overlay details panel with Copy / Close (top-right)
 * - No external libraries
 */

/* ============================== Data =============================== */

type CTA = { label: string; href: string };
export type Service = {
  id: string;
  title: string;
  blurb: string;
  tech?: string[];
  bullets?: string[];
  ctas?: CTA[];
};

const SERVICES: Service[] = [
  {
    id: "data-apps",
    title: "Data Apps & Automation",
    blurb:
      "Internal tools & micro-APIs that save hours: lightweight web apps, file pipelines, and quick integrations.",
    tech: ["Python", "Flask/FastAPI", "TypeScript/React", "Tailwind", "Excel/OpenPyXL"],
    bullets: [
      "Lightweight web apps and micro-APIs around analytics workloads (e.g., MyCaddy).",
      "Excel/PDF flows automated with parsing and write-back for ops efficiency.",
      "Modern TS/React UI foundations showcased in the portfolio build.",
    ],
    ctas: [
      { label: "MyCaddy (demo)", href: "/projects/mycaddy" },
      { label: "Portfolio (TS/Next)", href: "/projects/portfolio" },
    ],
  },
  {
    id: "automation-ops",
    title: "Ops & Scheduling",
    blurb:
      "Scheduled jobs and self-healing checks so reporting runs itself—retries, alerts, and data quality gates.",
    tech: ["Python", "Excel/OpenPyXL", "Google Sheets", "Scheduling/CRON", "GitHub Actions"],
    bullets: [
      "CRON-like pipelines with alerting and retries.",
      "Data quality checks, logs, and SLA monitors for trustworthy reporting.",
      "Google Sheets/Excel automation for operational teams.",
    ],
    ctas: [
      { label: "Ops utilities", href: "/projects/ops" },
      { label: "CGM Tools", href: "/projects/cgm" },
    ],
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    blurb: "From EDA to production-ready models with clear metrics and clean handoff docs.",
    tech: ["pandas", "numpy", "scikit-learn", "XGBoost", "Evaluation"],
    bullets: [
      "End-to-end EDA → modeling → evaluation in reproducible notebooks.",
      "scikit-learn/XGBoost with proper CV and interpretable metrics.",
      "Handoff-ready model cards and results summaries.",
    ],
    ctas: [
      { label: "Salifort case study", href: "/projects/salifort" },
      { label: "ML notebooks", href: "/projects/ml" },
    ],
  },
  {
    id: "analytics-eng",
    title: "Analytics Engineering",
    blurb:
      "Reliable SQL layers and semantic models so dashboards are fast, consistent, and trustworthy.",
    tech: ["SQL", "Reproducible transforms", "Tests & docs (dbt-style)", "Warehouse tuning"],
    bullets: [
      "Clean SQL layers and semantic models that standardize metrics.",
      "Warehouse tuning and testable, documented transforms.",
      "Reproducible query patterns and naming conventions.",
    ],
    ctas: [
      { label: "Warehouse examples", href: "/projects/warehouse" },
      { label: "Analytics repo", href: "/projects/analytics" },
    ],
  },
  {
    id: "dashboards",
    title: "Dashboards & Visualization",
    blurb: "Decision-ready dashboards that load fast and track what matters—no vanity charts.",
    tech: ["Tableau", "Power BI", "KPI design", "Performance & caching"],
    bullets: [
      "Tableau/Power BI dashboards designed around KPIs and decisions.",
      "Performance and caching practices for fast loads.",
      "Metrics governance to avoid vanity charts.",
    ],
    ctas: [
      { label: "Dashboard gallery", href: "/projects/dashboards" },
      { label: "MyCaddy metrics", href: "/projects/mycaddy#metrics" },
    ],
  },
  {
    id: "viz-storytelling",
    title: "Visualization & Storytelling",
    blurb: "Executive-ready visuals and narratives that move decisions—not just pretty plots.",
    tech: ["Matplotlib", "seaborn", "ggplot2 (R)", "Narrative arcs"],
    bullets: [
      "Matplotlib/seaborn/ggplot2 visuals tailored to stakeholder narratives.",
      "Clear “What/So What/Now What” framing for execs.",
      "Polished decks and write-ups for handoffs.",
    ],
    ctas: [
      { label: "Presentation deck", href: "/projects/presentations" },
      { label: "Portfolio write-ups", href: "/projects/portfolio#writeups" },
    ],
  },
];

/* ============================ Visual Helpers ============================ */

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-[11px] leading-none text-cyan-100">
      {children}
    </span>
  );
}
function stringifyService(s: Service) {
  const techLine = s.tech && s.tech.length ? `Tech: ${s.tech.join(", ")}` : "";
  const bullets = s.bullets?.map((b) => `- ${b}`).join("\n") ?? "";
  const ctas = s.ctas?.map((c) => `• ${c.label}: ${c.href}`).join("\n") ?? "";
  return `${s.title}\n\n${s.blurb}\n${techLine ? `\n${techLine}` : ""}\n\n${bullets}\n\n${ctas}`.trim();
}

type Tone = "cyan" | "magenta" | "amber";
type SignVariant = "blade" | "cantilever" | "gantry" | "cabinet" | "marquee" | "trapezoid";

function toneColors(tone: Tone) {
  switch (tone) {
    case "cyan": return { neon: "rgba(0,229,255,1)", stroke: "rgba(0,229,255,.55)" };
    case "magenta": return { neon: "rgba(255,60,172,1)", stroke: "rgba(255,60,172,.50)" };
    case "amber": return { neon: "rgba(255,190,110,1)", stroke: "rgba(255,190,110,.55)" };
  }
}

/** auto-fit text */
function layoutLabel(title: string, bw: number, bh: number, padX = 16, padY = 14) {
  const maxLines = 2;
  const boxW = bw - padX * 2;
  const boxH = bh - padY * 2;
  const idealLineHeight = 1.15;

  const pxPerCharAt16 = 8;
  const fitFont = (txt: string, targetW: number, maxPx = 28) => {
    const len = Math.max(6, txt.length);
    const est = Math.min(maxPx, Math.floor((targetW / (len * (pxPerCharAt16 / 16))) * 0.98));
    return Math.max(12, est);
  };

  let fs1 = fitFont(title, boxW, 28);
  let h1 = fs1 * idealLineHeight;
  const estW1 = title.length * (pxPerCharAt16 * (fs1 / 16));
  if (h1 <= boxH && estW1 <= boxW) {
    return { fontSize: fs1, lines: [title], lineHeight: fs1 * idealLineHeight, padX, padY };
  }

  const splitIndex =
    title.indexOf(" & ") > -1
      ? title.indexOf(" & ") + 3
      : (() => {
          const mid = Math.floor(title.length / 2);
          let left = title.lastIndexOf(" ", mid);
          let right = title.indexOf(" ", mid);
          if (left === -1) left = mid;
          if (right === -1) right = mid;
          return Math.abs(mid - left) <= Math.abs(right - mid) ? left : right;
        })();

  const line1 = title.slice(0, splitIndex).trim();
  const line2 = title.slice(splitIndex).trim();
  const fs2 = Math.min(fitFont(line1, boxW, 24), fitFont(line2, boxW, 24));
  const lh2 = fs2 * idealLineHeight;
  if (lh2 * 2 <= boxH) {
    return { fontSize: fs2, lines: [line1, line2], lineHeight: lh2, padX, padY };
  }

  const fsTiny = Math.max(12, Math.floor(boxH / idealLineHeight));
  return { fontSize: fsTiny, lines: [title], lineHeight: fsTiny * idealLineHeight, padX, padY };
}

/* ============================= Billboard Variants ============================= */

function BillboardHeader({
  w, h, title, tone, variant,
}: { w: number; h: number; title: string; tone: Tone; variant: SignVariant }) {
  const { neon, stroke } = toneColors(tone);
  const layout = layoutLabel(title, w, h, 16, 14);

  const Label = () => (
    <g style={{ pointerEvents: "none" }}>
      {layout.lines.map((ln, i) => (
        <text
          key={i}
          x={w / 2}
          y={h / 2 + (i - (layout.lines.length - 1) / 2) * layout.lineHeight}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={layout.fontSize}
          fill="#d9faff"
          style={{ fontWeight: 700, letterSpacing: "1px" }}
        >
          {ln}
        </text>
      ))}
    </g>
  );

  switch (variant) {
    case "blade":
      return (
        <g filter={`url(#glow-${tone})`}>
          <rect x="0" y="0" width={w} height={h} rx="4" fill="url(#glass)" stroke={stroke} strokeWidth="3" />
          <rect x="w/2-2" y={-20} width="4" height="20" fill={stroke} />
          <Label />
        </g>
      );
    case "cantilever":
      return (
        <g filter={`url(#glow-${tone})`}>
          <line x1={-20} y1={h/2} x2={0} y2={h/2} stroke={stroke} strokeWidth="3" />
          <line x1={-20} y1={h/2} x2={-35} y2={-20} stroke={stroke} strokeWidth="2" />
          <rect x="0" y="0" width={w} height={h} rx="6" fill="url(#glass)" stroke={stroke} strokeWidth="2" />
          <Label />
        </g>
      );
    case "gantry":
      return (
        <g filter={`url(#glow-${tone})`}>
          <rect x="0" y="0" width={w} height={h} fill="url(#glass)" stroke={stroke} strokeWidth="2" />
          <rect x={w*0.2} y={h} width="4" height="20" fill={stroke} />
          <rect x={w*0.8} y={h} width="4" height="20" fill={stroke} />
          <Label />
        </g>
      );
    case "cabinet":
      return (
        <g filter={`url(#glow-${tone})`}>
          <rect x="0" y="0" width={w} height={h} rx="4" fill="url(#glass)" stroke={stroke} strokeWidth="3" />
          <rect x={w} y="4" width="6" height={h-8} fill={stroke} opacity="0.4" />
          <Label />
        </g>
      );
    case "marquee":
      return (
        <g filter={`url(#glow-${tone})`}>
          <rect x="0" y="0" width={w} height={h} rx="10" fill="url(#glass)" stroke={stroke} strokeWidth="3" />
          {Array.from({ length: 12 }).map((_, i) => (
            <circle key={i} cx={(i+1)*(w/13)} cy="0" r="3" fill={stroke} />
          ))}
          <Label />
        </g>
      );
    case "trapezoid":
      return (
        <g filter={`url(#glow-${tone})`}>
          <polygon points={`0,${h} ${w},${h} ${w-20},0 20,0`} fill="url(#glass)" stroke={stroke} strokeWidth="2" />
          <Label />
        </g>
      );
  }
}
