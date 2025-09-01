"use client";

import React from "react";

/**
 * Services Cityscape (lightweight)
 * - Static SVG skyline + simple billboards
 * - Click billboard -> full-view panel with: Title, Tech Pills, Context bullets, CTAs
 * - Top-right actions: Copy details (Cmd/Ctrl+C) and Close (Esc or backdrop)
 * - Locks body scroll when open and restores exact scroll position on close
 * - No external icon deps (inline SVGs below)
 */

/* ------------------------- tiny inline icons (no deps) ------------------------- */
const Icon = {
  Copy: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
      <path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
    </svg>
  ),
  X: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
      <path fill="currentColor" d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"/>
    </svg>
  ),
  PanelsTopLeft: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
      <path fill="currentColor" d="M3 3h10v8H3V3zm0 10h8v8H3v-8zm10-5h8v13h-8V8z"/>
    </svg>
  ),
  Cpu: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
      <path fill="currentColor" d="M9 9h6v6H9z"/><path fill="currentColor" d="M15 1h-2v2h-2V1H9v2H7a2 2 0 0 0-2 2v2H3v2h2v2H3v2h2v2a2 2 0 0 0 2 2h2v2h2v-2h2v2h2v-2h2a2 2 0 0 0 2-2v-2h2v-2h-2v-2h2V7h-2V5a2 2 0 0 0-2-2h-2V1zM7 7h10v10H7V7z"/>
    </svg>
  ),
  LineChart: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
      <path fill="currentColor" d="M3 3h2v16h16v2H3z"/>
      <path fill="currentColor" d="M7 15l4-4 3 3 5-6 1.6 1.2-6.6 8-3-3-4 4z"/>
    </svg>
  ),
  Wrench: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
      <path fill="currentColor" d="M22 7.5a5.5 5.5 0 0 1-8.9 4.2l-7.4 7.4-2.1-2.1 7.4-7.4A5.5 5.5 0 1 1 22 7.5z"/>
    </svg>
  ),
  Rocket: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
      <path fill="currentColor" d="M14 3l7 7-5 5-7-7 5-5zm-3.5 8.5L7 15l-4 1 1-4 3.5-3.5 3.5 3.5zM6 18l-3 3v-3l3-1z"/>
    </svg>
  ),
  Brain: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...p}>
      <path fill="currentColor" d="M7 3a4 4 0 0 0-3 6.9V11a4 4 0 0 0 4 4v3a3 3 0 1 0 6 0v-1h1a4 4 0 0 0 3.9-4.8A4 4 0 0 0 17 3a4 4 0 0 0-2 .5A4 4 0 0 0 7 3z"/>
    </svg>
  ),
};
const { Copy, X, PanelsTopLeft, Cpu, LineChart, Wrench, Rocket, Brain } = Icon;

/* ----------------------------------- types ----------------------------------- */
export type Service = {
  id: string;
  title: string;
  blurb: string;
  tech?: string[];      // neon pill row
  bullets?: string[];   // context: how applied
  ctas?: { label: string; href: string }[];
  icon?: React.ReactNode;
};

/* ----------------------------- services (wired) ------------------------------ */
const SERVICES: Service[] = [
  // — Group 1: Data Apps & Automation —
  {
    id: "data-apps",
    title: "Data Apps",
    blurb: "Internal tools & micro-APIs that save hours: lightweight web apps, file pipelines, and quick integrations.",
    tech: ["Python", "Flask/FastAPI", "TypeScript/React", "Tailwind", "Excel/OpenPyXL"],
    bullets: [
      "Built lightweight web apps and micro-APIs around analytics workloads (e.g., MyCaddy).",
      "Excel/PDF file flows automated with parsing and write-back for ops efficiency.",
      "Modern TS/React UI foundations showcased in the portfolio build.",
    ],
    ctas: [
      { label: "MyCaddy (demo)", href: "/projects/mycaddy" },
      { label: "Portfolio (TS/Next)", href: "/projects/portfolio" },
    ],
    icon: <Cpu className="h-4 w-4" aria-hidden />,
  },
  {
    id: "automation-ops",
    title: "Automation & Ops",
    blurb: "Scheduled jobs and self-healing checks so reporting runs itself—retries, alerts, and data quality gates.",
    tech: ["Python", "Excel/OpenPyXL", "Google Sheets", "Scheduling/CRON", "GitHub Actions"],
    bullets: [
      "Scheduled pipelines with CRON-like cadence and alerting for failures.",
      "Data quality checks, logs, and SLA monitors to keep reports trustworthy.",
      "Google Sheets/Excel automation for operational teams.",
    ],
    ctas: [
      { label: "Ops utilities", href: "/projects/ops" },
      { label: "CGM Tools", href: "/projects/cgm" },
    ],
    icon: <Wrench className="h-4 w-4" aria-hidden />,
  },

  // — Group 2: Machine Learning & Analytics —
  {
    id: "machine-learning",
    title: "Machine Learning",
    blurb: "From EDA to production-ready models with clear metrics and clean handoff docs.",
    tech: ["pandas", "numpy", "scikit-learn", "XGBoost", "Evaluation"],
    bullets: [
      "End-to-end EDA → modeling → evaluation in reproducible notebooks.",
      "scikit-learn and XGBoost with proper CV and interpretable metrics.",
      "Handoff-ready model cards and results summaries.",
    ],
    ctas: [
      { label: "Salifort case study", href: "/projects/salifort" },
      { label: "ML notebooks", href: "/projects/ml" },
    ],
    icon: <Brain className="h-4 w-4" aria-hidden />,
  },
  {
    id: "analytics-eng",
    title: "Analytics",
    blurb: "Reliable SQL layers and semantic models so dashboards are fast, consistent, and trustworthy.",
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
    icon: <LineChart className="h-4 w-4" aria-hidden />,
  },

  // — Group 3: Dashboards & Visualization/Storytelling —
  {
    id: "dashboards",
    title: "Dashboards",
    blurb: "Decision-ready dashboards that load fast and track what matters—no vanity charts.",
    tech: ["Tableau", "Power BI", "KPI design", "Performance & caching"],
    bullets: [
      "Tableau/Power BI dashboards designed around KPIs and decisions.",
      "Performance and caching practices for fast-load experiences.",
      "Metrics governance to avoid vanity charts.",
    ],
    ctas: [
      { label: "Dashboard gallery", href: "/projects/dashboards" },
      { label: "MyCaddy metrics", href: "/projects/mycaddy#metrics" },
    ],
    icon: <PanelsTopLeft className="h-4 w-4" aria-hidden />,
  },
  {
    id: "viz-storytelling",
    title: "Visualization & Storytelling",
    blurb: "Executive-ready visuals and narratives that move decisions—not just pretty plots.",
    tech: ["Matplotlib", "seaborn", "ggplot2 (R)", "Narrative arcs"],
    bullets: [
      "Matplotlib/seaborn/ggplot2 visuals tailored to stakeholder narratives.",
      "Clear “What/So What/Now What” framing for exec audiences.",
      "Polished decks and write-ups for handoffs.",
    ],
    ctas: [
      { label: "Presentation deck", href: "/projects/presentations" },
      { label: "Portfolio write-ups", href: "/projects/portfolio#writeups" },
    ],
    icon: <Rocket className="h-4 w-4" aria-hidden />,
  },
];

/* ------------------------------- utils/components ------------------------------ */
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

export default function ServicesCityscape() {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [scrollY, setScrollY] = React.useState<number>(0);

  const current = openId ? SERVICES.find((s) => s.id === openId)! : null;

  const open = React.useCallback((id: string) => {
    setScrollY(window.scrollY);
    // lock scroll
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    setOpenId(id);
  }, []);

  const close = React.useCallback(() => {
    const y = scrollY;
    setOpenId(null);
    // unlock + restore
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, y);
    document.documentElement.style.scrollBehavior = "";
  }, [scrollY]);

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
  }, [openId, close]);

  const doCopy = React.useCallback(() => {
    if (!current) return;
    const text = stringifyService(current);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try { document.execCommand("copy"); } catch {}
        document.body.removeChild(ta);
      });
    }
  }, [current]);

  return (
    <section className="svc-city relative py-20">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-cyan-100">My Services</h2>
          <p className="mt-2 max-w-2xl text-sm md:text-base text-cyan-100/70">
            Tap a billboard to open the details panel. Copy or close from the top-right.
          </p>
        </header>

        {/* City skyline wrapper */}
        <div className="relative overflow-hidden rounded-2xl bg-[#080c12] border border-cyan-400/10">
          {/* far background stars */}
          <div className="absolute inset-0 pointer-events-none opacity-70">
            <div className="absolute inset-0 svc-stars" />
          </div>

          {/* Mid skyline silhouette */}
          <div className="relative h-[340px] md:h-[420px]">
            <svg viewBox="0 0 1200 400" className="absolute bottom-0 w-full h-full" aria-hidden>
              {/* gradient sky */}
              <defs>
                <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#07131c" />
                  <stop offset="100%" stopColor="#0b1016" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="1200" height="400" fill="url(#sky)" />
              {/* buildings */}
              <g fill="#0f1621">
                <rect x="40" y="220" width="90" height="180" />
                <rect x="170" y="180" width="80" height="220" />
                <rect x="280" y="140" width="110" height="260" />
                <rect x="430" y="200" width="85" height="200" />
                <rect x="540" y="120" width="95" height="280" />
                <rect x="670" y="160" width="75" height="240" />
                <rect x="770" y="190" width="110" height="210" />
                <rect x="920" y="150" width="85" height="250" />
                <rect x="1030" y="210" width="70" height="190" />
              </g>
              {/* neon outlines */}
              <g stroke="rgba(0,229,255,.35)" strokeWidth="2" fill="none">
                <rect x="40" y="220" width="90" height="180" />
                <rect x="170" y="180" width="80" height="220" />
                <rect x="280" y="140" width="110" height="260" />
                <rect x="430" y="200" width="85" height="200" />
                <rect x="540" y="120" width="95" height="280" />
                <rect x="670" y="160" width="75" height="240" />
                <rect x="770" y="190" width="110" height="210" />
                <rect x="920" y="150" width="85" height="250" />
                <rect x="1030" y="210" width="70" height="190" />
              </g>
            </svg>

            {/* Billboards: align with buildings */}
            <div className="absolute inset-0">
              <Billboard x={85}  y={210} label="Data Apps"     icon={<Cpu />}           onClick={() => open("data-apps")} />
              <Billboard x={190} y={170} label="Automation"    icon={<Wrench />}        onClick={() => open("automation-ops")} />
              <Billboard x={320} y={130} label="ML"            icon={<Brain />}         onClick={() => open("machine-learning")} />
              <Billboard x={455} y={190} label="Analytics"     icon={<LineChart />}     onClick={() => open("analytics-eng")} />
              <Billboard x={560} y={110} label="Dashboards"    icon={<PanelsTopLeft />} onClick={() => open("dashboards")} />
              <Billboard x={790} y={180} label="Storytelling"  icon={<Rocket />}        onClick={() => open("viz-storytelling")} />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay Panel */}
      {current && (
        <div role="dialog" aria-modal="true" aria-label={`${current.title} details`} className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />

          <div className="relative w-full max-w-2xl rounded-2xl border border-cyan-400/20 bg-[#0b1016]/90 shadow-2xl">
            {/* Top-right actions */}
            <div className="absolute right-2 top-2 flex items-center gap-2">
              <button
                onClick={doCopy}
                className="group inline-flex items-center gap-1.5 rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1.5 text-xs text-cyan-100 hover:bg-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                aria-label="Copy details" title="Copy details (Cmd/Ctrl+C)"
              >
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
              <button
                onClick={close}
                className="inline-flex items-center rounded-md border border-cyan-400/20 bg-cyan-400/10 p-1.5 text-cyan-100 hover:bg-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                aria-label="Close" title="Close (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 md:p-6">
              <div className="mb-2 flex items-center gap-2 text-cyan-100">
                <PanelsTopLeft className="h-4 w-4 opacity-70" />
                <h3 className="text-lg md:text-xl font-semibold tracking-wide">{current.title}</h3>
              </div>

              {/* Tech pills */}
              {current.tech?.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {current.tech.map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              ) : null}

              {/* Blurb */}
              <p className="mt-3 text-sm md:text-base text-cyan-100/85">{current.blurb}</p>

              {/* Context bullets */}
              {!!current.bullets?.length && (
                <ul className="mt-4 space-y-1.5">
                  {current.bullets.map((b, i) => (
                    <li key={i} className="text-sm text-cyan-100/80">• {b}</li>
                  ))}
                </ul>
              )}

              {!!current.ctas?.length && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {current.ctas.map((c, i) => (
                    <a
                      key={i}
                      href={c.href}
                      className="inline-flex items-center gap-2 rounded-md border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-sm text-cyan-100 hover:bg-cyan-400/20"
                    >
                      {c.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Local styles (scoped) */}
      <style jsx>{`
        .svc-city { --cyan: 0,229,255; }
        .svc-stars {
          background:
            radial-gradient(circle at 20% 30%, rgba(var(--cyan), .08), transparent 30%),
            radial-gradient(circle at 80% 20%, rgba(var(--cyan), .06), transparent 25%),
            radial-gradient(circle at 60% 70%, rgba(var(--cyan), .07), transparent 30%);
          filter: blur(0.5px);
        }
      `}</style>
    </section>
  );
}

/* ------------------------------ small billboard ------------------------------ */
function Billboard({
  x, y, label, icon, onClick,
}: { x: number; y: number; label: string; icon?: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group absolute -translate-x-1/2 -translate-y-1/2 select-none"
      style={{ left: x, top: y }}
      aria-label={`${label} details`}
    >
      <div className="rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1.5 text-[11px] font-medium tracking-wide text-cyan-100 shadow-[0_0_20px_rgba(0,229,255,.15)_inset]
      group-hover:bg-cyan-400/20 group-hover:border-cyan-400/50">
        <div className="flex items-center gap-1.5">
          {icon}
          <span>{label}</span>
        </div>
      </div>
      {/* pole */}
      <div className="mx-auto h-6 w-px bg-cyan-400/30" />
    </button>
  );
}
