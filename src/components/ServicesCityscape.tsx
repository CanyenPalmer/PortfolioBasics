"use client";

import React from "react";

/**
 * Services Cityscape — Enhanced Cyberpunk Skyline
 * - Multi-layer SVG skyline (far/mid/front) with varied buildings
 * - Neon outlines, window flicker, haze + fog layers (CSS only)
 * - Custom billboards anchored to foreground buildings
 * - Same overlay panel behavior (Copy, Close, scroll restore)
 * - No external deps (inline icons)
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
  tech?: string[];
  bullets?: string[];
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

/* ------------------------------- utils -------------------------------- */
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

/* ------------------------------- component ---------------------------- */
export default function ServicesCityscape() {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [scrollY, setScrollY] = React.useState<number>(0);

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
          {/* atmospheric layers */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 svc-stars" />
            <div className="svc-haze" />
            <div className="svc-fog" />
            <div className="svc-windows" />
          </div>

          {/* Multi-layer skyline */}
          <div className="relative h-[360px] md:h-[460px]">
            <svg viewBox="0 0 1200 460" className="absolute bottom-0 w-full h-full" aria-hidden>
              <defs>
                <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0a0f1b" />
                  <stop offset="40%" stopColor="#0a0f1b" />
                  <stop offset="100%" stopColor="#0b1016" />
                </linearGradient>
                <linearGradient id="frontFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#101826" />
                  <stop offset="100%" stopColor="#0e1623" />
                </linearGradient>
                <linearGradient id="midFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0d1420" />
                  <stop offset="100%" stopColor="#0b121c" />
                </linearGradient>
                <linearGradient id="farFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#09101a" />
                  <stop offset="100%" stopColor="#091017" />
                </linearGradient>
              </defs>

              {/* sky backdrop */}
              <rect x="0" y="0" width="1200" height="460" fill="url(#sky)" />

              {/* FAR LAYER (tall, faint) */}
              <g className="far" fill="url(#farFill)" opacity="0.55" stroke="rgba(172,108,255,.28)" strokeWidth="1.5">
                <rect x="20"  y="120" width="70"  height="340" rx="2" />
                <rect x="120" y="80"  width="90"  height="380" rx="2" />
                <rect x="240" y="100" width="80"  height="360" rx="2" />
                <rect x="340" y="60"  width="110" height="400" rx="2" />
                <rect x="490" y="90"  width="85"  height="370" rx="2" />
                <rect x="600" y="70"  width="95"  height="390" rx="2" />
                <rect x="720" y="100" width="80"  height="360" rx="2" />
                <rect x="820" y="80"  width="100" height="380" rx="2" />
                <rect x="950" y="110" width="75"  height="350" rx="2" />
                <rect x="1040" y="95" width="90" height="365" rx="2" />
              </g>

              {/* MID LAYER (medium density) */}
              <g className="mid" fill="url(#midFill)" opacity="0.75" stroke="rgba(255,60,172,.35)" strokeWidth="1.6">
                <rect x="60"  y="200" width="95"  height="260" rx="2" />
                <rect x="180" y="170" width="100" height="290" rx="2" />
                <rect x="300" y="190" width="90"  height="270" rx="2" />
                <rect x="420" y="160" width="120" height="300" rx="2" />
                <rect x="560" y="190" width="95"  height="270" rx="2" />
                <rect x="680" y="170" width="100" height="290" rx="2" />
                <rect x="810" y="200" width="95"  height="260" rx="2" />
                <rect x="930" y="180" width="105" height="280" rx="2" />
                <rect x="1060" y="210" width="85" height="250" rx="2" />
              </g>

              {/* FRONT LAYER (foreground, where billboards attach) */}
              <g className="front" fill="url(#frontFill)" stroke="rgba(0,229,255,.45)" strokeWidth="2">
                {/* varied silhouettes */}
                <rect x="40"  y="240" width="110" height="220" rx="2" />
                <path d="M190 220 h100 v240 h-100 z" />
                <path d="M320 210 h115 v250 h-115 z" />
                <path d="M460 250 h95  v210 h-95  z" />
                <path d="M580 190 h100 v270 h-100 z" />
                <path d="M710 230 h85  v230 h-85  z" />
                <path d="M810 250 h120 v210 h-120 z" />
                <path d="M960 210 h100 v250 h-100 z" />
                <path d="M1080 260 h80 v200 h-80 z" />

                {/* antenna details */}
                <line x1="635" y1="190" x2="635" y2="170" stroke="rgba(0,229,255,.45)" strokeWidth="2"/>
                <circle cx="635" cy="168" r="3" fill="rgba(255,60,172,.7)" />
              </g>
            </svg>

            {/* Billboards anchored to foreground buildings (match x/y to front layer tops) */}
            <div className="absolute inset-0">
              <Billboard x={95}   y={235} label="Data Apps"    icon={<Cpu />}           onClick={() => open("data-apps")} />
              <Billboard x={240}  y={215} label="Automation"   icon={<Wrench />}        onClick={() => open("automation-ops")} />
              <Billboard x={377}  y={205} label="ML"           icon={<Brain />}         onClick={() => open("machine-learning")} />
              <Billboard x={508}  y={245} label="Analytics"    icon={<LineChart />}     onClick={() => open("analytics-eng")} />
              <Billboard x={628}  y={185} label="Dashboards"   icon={<PanelsTopLeft />} onClick={() => open("dashboards")} />
              <Billboard x={868}  y={245} label="Storytelling" icon={<Rocket />}        onClick={() => open("viz-storytelling")} />
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
                onClick={() => {
                  if (!current) return;
                  const text = stringifyService(current);
                  if (navigator.clipboard?.writeText) {
                    navigator.clipboard.writeText(text).catch(() => {});
                  }
                }}
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
        .svc-city {
          --cyn: 0,229,255;      /* cyan neon */
          --mag: 255,60,172;     /* magenta neon */
          --vio: 172,108,255;    /* violet neon */
        }

        /* Sky gradients + vignette via .svc-stars */
        .svc-stars {
          background:
            radial-gradient(1200px 700px at 50% 20%, rgba(var(--mag), .06), transparent 55%),
            radial-gradient(1000px 600px at 60% 15%, rgba(var(--vio), .05), transparent 50%),
            linear-gradient(180deg, #0a0f18 0%, #0a0f1a 20%, #0b111b 55%, #0b1016 100%);
        }
        .svc-city::before {
          content: "";
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(70% 55% at 50% 45%, transparent 60%, rgba(0,0,0,.35) 100%);
          z-index: 0;
        }

        /* Neon haze + fog */
        .svc-haze, .svc-fog, .svc-windows {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
        }
        .svc-haze {
          background:
            radial-gradient(60% 40% at 50% 70%, rgba(var(--cyn), .10), transparent 70%),
            radial-gradient(40% 30% at 30% 75%, rgba(var(--mag), .06), transparent 70%),
            radial-gradient(45% 35% at 70% 72%, rgba(var(--vio), .07), transparent 70%);
          mix-blend-mode: screen;
          animation: haze-drift 24s linear infinite;
        }
        .svc-fog {
          background: repeating-linear-gradient(180deg, rgba(255,255,255,.018) 0 2px, transparent 2px 6px);
          opacity: .35;
          mask-image: linear-gradient(to bottom, transparent 0%, black 30%, black 85%, transparent 100%);
          animation: fog-slide 36s linear infinite;
        }
        @keyframes haze-drift { from { transform: translate3d(0,0,0); } to { transform: translate3d(-80px,0,0); } }
        @keyframes fog-slide  { from { transform: translate3d(0,0,0); } to { transform: translate3d(0,-60px,0); } }
        @media (prefers-reduced-motion: reduce) { .svc-haze, .svc-fog { animation: none; } }

        /* Add neon glow to SVG strokes */
        svg .far[stroke], svg .mid[stroke], svg .front[stroke] {
          filter:
            drop-shadow(0 0 10px rgba(var(--cyn), .25))
            drop-shadow(0 0 24px rgba(var(--cyn), .12));
        }

        /* Simulated windows flicker */
        .svc-windows {
          opacity: .14;
          background:
            radial-gradient(2px 3px at 15% 78%, rgba(255,240,180,.9), transparent 60%),
            radial-gradient(2px 3px at 22% 82%, rgba(255,189,120,.9), transparent 60%),
            radial-gradient(2px 3px at 38% 76%, rgba(255,240,180,.85), transparent 60%),
            radial-gradient(2px 3px at 61% 81%, rgba(255,189,120,.85), transparent 60%),
            radial-gradient(2px 3px at 74% 79%, rgba(255,240,180,.8), transparent 60%),
            radial-gradient(2px 3px at 86% 77%, rgba(255,189,120,.85), transparent 60%);
          animation: windows-flicker 4s ease-in-out infinite alternate;
        }
        @keyframes windows-flicker {
          0% { opacity: .10; filter: hue-rotate(0deg); }
          45% { opacity: .18; }
          50% { opacity: .08; }
          100% { opacity: .16; filter: hue-rotate(10deg); }
        }
        @media (prefers-reduced-motion: reduce) { .svc-windows { animation: none; } }

        /* Billboard glow beam */
        .billboard { position: absolute; }
        .billboard::before {
          content: ""; position: absolute; left: 50%; top: -18px; transform: translateX(-50%);
          width: 200px; height: 120px;
          background:
            radial-gradient(closest-side, rgba(var(--cyn), .20), transparent 70%),
            radial-gradient(closest-side, rgba(var(--mag), .08), transparent 80%);
          filter: blur(8px); z-index: -1; pointer-events: none;
        }
        .billboard > div {
          box-shadow:
            inset 0 0 20px rgba(var(--cyn), .18),
            0 0 20px rgba(var(--cyn), .18);
          backdrop-filter: saturate(1.2);
        }

        /* Dialog polish */
        [role="dialog"] .rounded-2xl {
          box-shadow:
            0 10px 30px rgba(0,0,0,.6),
            0 0 0 1px rgba(var(--cyn), .15) inset,
            0 0 40px rgba(var(--cyn), .12);
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
      className="billboard group absolute -translate-x-1/2 -translate-y-1/2 select-none"
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
