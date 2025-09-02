"use client";

import React from "react";

/**
 * Cyber City — Framed Skyline, Parallax Background, Detailed Foreground
 * - Centered heading + looping typewriter subline (with blinking caret).
 * - ViewBox: 1360x600. All geometry clamped to frame.
 * - Rectangular billboards with neon glow (cyan/magenta/amber), auto-fit titles.
 * - Two parallax background skylines with subtle window lights.
 * - Foreground towers: ribs, fins, ducts, ladders, tanks, antennas, cables.
 * - Organic window glow (seeded, SSR-safe).
 * - Overlay details panel with Copy / Close.
 * - Pure React/SVG. No external deps.
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

/* ... all your helper functions unchanged ... */

/* ============================== Component ============================== */

export default function ServicesCityscape() {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [scrollY, setScrollY] = React.useState(0);
  const current = openId ? SERVICES.find((s) => s.id === openId)! : null;

  const open = (id: string) => {
    setScrollY(window.scrollY);
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    setOpenId(id);
  };
  const close = () => {
    const y = scrollY;
    setOpenId(null);
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, y);
    document.documentElement.style.scrollBehavior = "";
  };

  React.useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        const s = SERVICES.find((x) => x.id === openId);
        if (s) navigator.clipboard?.writeText(stringifyService(s)).catch(() => {});
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId]);

  return (
    <section
      id="services"                                   // ✅ Anchor for tab
      className="relative py-20 scroll-mt-24 min-h-[70vh]" // ✅ Offset + height
      aria-label="My Services"
    >
      <div className="container mx-auto px-4">
        {/* Centered heading + typing subline (looping) */}
        <header className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-cyan-100">My Services</h2>
          <TypingLine text="Click a billboard to view a service!" />
        </header>

        {/* ...rest of your SVG cityscape & overlay code unchanged... */}
      </div>

      {/* ...overlay panel + global styles unchanged... */}
    </section>
  );
}
