"use client";

import React from "react";

/**
 * Services Cityscape — Image Backplate (refined)
 * Fixes:
 * - Smooth sweep (no glitchy line); removed old fog pattern causing banding
 * - Image fallback if /public/cityscape.jpg missing (no broken link top-left)
 * - Billboards are flush on buildings (no stem), with tight glow
 *
 * HOW TO:
 * 1) Put your licensed image at public/cityscape.jpg (or webp/mp4 if you prefer a video).
 * 2) Tweak ANCHORS (left%, top%) to sit each billboard exactly in a glow area.
 */

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

/* ----------------------------------- data ----------------------------------- */
export type Service = {
  id: string;
  title: string;
  blurb: string;
  tech?: string[];
  bullets?: string[];
  ctas?: { label: string; href: string }[];
  icon?: React.ReactNode;
};

const SERVICES: Service[] = [
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
    icon: <Cpu />,
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
    icon: <Wrench />,
  },
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
    icon: <Brain />,
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
    icon: <LineChart />,
  },
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
    icon: <PanelsTopLeft />,
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
    icon: <Rocket />,
  },
];

/* ------------------------ percentage anchors on backplate ------------------------ */
const ANCHORS: Record<
  "data-apps" | "automation-ops" | "machine-learning" | "analytics-eng" | "dashboards" | "viz-storytelling",
  { left: number; top: number }
> = {
  "data-apps":        { left:  9.0, top: 52.5 },
  "automation-ops":   { left: 18.8, top: 43.5 },
  "machine-learning": { left: 33.5, top: 35.0 },
  "analytics-eng":    { left: 49.0, top: 38.5 },
  "dashboards":       { left: 64.5, top: 33.0 },
  "viz-storytelling": { left: 82.0, top: 44.0 },
};

/* -------------------------------- utilities ---------------------------------- */
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

/* -------------------------------- component ---------------------------------- */
export default function ServicesCityscape() {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [scrollY, setScrollY] = React.useState<number>(0);
  const [imgSrc, setImgSrc] = React.useState<string>("/cityscape.jpg"); // update if you use .webp or .mp4

  const current = openId ? SERVICES.find((s) => s.id === openId)! : null;

  const open = React.useCallback((id: string) => {
    setScrollY(window.scrollY);
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    setOpenId(id);
  }, []);

  const close = React.useCallback(() => {
    const y = scrollY;
    setOpenId(null);
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

  return (
    <section className="svc-city relative py-20">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-cyan-100">My Services</h2>
          <p className="mt-2 max-w-2xl text-sm md:text-base text-cyan-100/70">
            Tap a billboard to open the details panel. Copy or close from the top-right.
          </p>
        </header>

        <div className="relative overflow-hidden rounded-2xl bg-[#070c12] border border-cyan-400/10">
          {/* Backplate container with stable aspect so anchors behave responsively */}
          <div className="relative w-full h-[48vw] min-h-[360px] max-h-[700px]">
            {/* IMAGE backplate with graceful fallback (prevents broken image icon) */}
            <img
              src={imgSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
              onError={() => setImgSrc("")}
            />
            {/* Fallback gradient if image missing */}
            {imgSrc === "" && <div aria-hidden className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_50%_20%,rgba(255,60,172,.06),transparent_55%),radial-gradient(1000px_600px_at_60%_15%,rgba(172,108,255,.05),transparent_50%),linear-gradient(180deg,#0a0f18_0%,#0a0f1a_25%,#0b111b_60%,#0b1016_100%)]" />}

            {/* Atmospherics (smooth only; no banding) */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="svc-haze" />
              <div className="svc-sweep" />
              <div className="svc-rain" />
              <div className="svc-ground-reflect" />
              <div className="svc-vignette" />
            </div>

            {/* Flush-mounted billboards in glow areas */}
            {Object.entries(ANCHORS).map(([id, pos]) => {
              const svc = SERVICES.find((s) => s.id === id)!;
              return (
                <button
                  key={id}
                  onClick={() => open(id)}
                  className="billboard group absolute -translate-x-1/2 -translate-y-1/2 select-none"
                  style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
                  aria-label={`${svc.title} details`}
                >
                  <div className="rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1.5 text-[11px] font-medium tracking-wide text-cyan-100 shadow-[0_0_22px_rgba(0,229,255,.18)_inset,0_0_22px_rgba(0,229,255,.12)]
                    group-hover:bg-cyan-400/20 group-hover:border-cyan-400/50">
                    <div className="flex items-center gap-1.5">
                      {svc.icon}
                      <span>{svc.title}</span>
                    </div>
                  </div>
                </button>
              );
            })}
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
                onClick={() => navigator.clipboard?.writeText(stringifyService(current)).catch(() => {})}
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

      {/* Scoped styles */}
      <style jsx>{`
        .svc-city { --cyn: 0,229,255; --mag: 255,60,172; --vio: 172,108,255; }

        /* Smooth neon haze and one clean sweep (no banding) */
        .svc-haze {
          position: absolute; inset: 0;
          background:
            radial-gradient(60% 40% at 50% 70%, rgba(var(--cyn), .10), transparent 70%),
            radial-gradient(40% 30% at 30% 75%, rgba(var(--mag), .06), transparent 70%),
            radial-gradient(45% 35% at 70% 72%, rgba(var(--vio), .07), transparent 70%);
          mix-blend-mode: screen;
          animation: haze-drift 24s linear infinite;
        }
        /* Single linear sweep from left to right */
        .svc-sweep::before {
          content: "";
          position: absolute; top: 0; bottom: 0; left: -40%;
          width: 40%;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.04) 50%, transparent 100%);
          mix-blend-mode: screen;
          animation: sweep 6s linear infinite;
        }

        /* Rain (kept subtle; smooth fall) */
        .svc-rain::before {
          content: "";
          position: absolute; inset: -120px -120px;
          background-image:
            linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,0) 60%),
            linear-gradient(180deg, rgba(153,255,255,.10), rgba(153,255,255,0) 60%);
          background-size: 2px 90px, 1px 70px;
          background-repeat: repeat;
          background-position: 0 0, 40px 0;
          transform: rotate(12deg);
          opacity: .18;
          animation: rain-fall 1.1s linear infinite;
          filter: drop-shadow(0 0 4px rgba(var(--cyn), .12));
        }

        /* Wet street reflection */
        .svc-ground-reflect {
          position: absolute; inset: 0;
          background:
            linear-gradient(180deg, transparent 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,.35) 100%),
            radial-gradient(60% 30% at 50% 96%, rgba(var(--cyn), .08), transparent 70%),
            radial-gradient(50% 25% at 65% 98%, rgba(var(--mag), .07), transparent 70%);
          mix-blend-mode: screen;
        }
        .svc-vignette { position:absolute; inset:0; box-shadow: inset 0 0 120px rgba(0,0,0,.55); }

        /* Flush billboard styling (no pole; tighter glow) */
        .billboard::before {
          content: "";
          position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
          width: 220px; height: 120px;
          background:
            radial-gradient(closest-side, rgba(var(--cyn), .22), transparent 70%),
            radial-gradient(closest-side, rgba(var(--mag), .10), transparent 80%);
          filter: blur(12px); z-index: -1; pointer-events: none;
        }
        .billboard > div {
          box-shadow:
            inset 0 0 22px rgba(var(--cyn), .22),
            0 0 18px rgba(var(--cyn), .15);
          backdrop-filter: saturate(1.2);
        }

        @keyframes haze-drift { from { transform: translate3d(0,0,0); } to { transform: translate3d(-80px,0,0); } }
        @keyframes sweep { from { transform: translateX(0); } to { transform: translateX(280%); } }
        @keyframes rain-fall { from { background-position-y: 0, 0; } to { background-position-y: 220px, 170px; } }

        @media (prefers-reduced-motion: reduce) {
          .svc-haze, .svc-sweep::before, .svc-rain::before { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
