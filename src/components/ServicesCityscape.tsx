"use client";

import React from "react";

/**
 * Services Cityscape — Photo Backplate w/ Face-Mounted Billboards
 *
 * - Uses your photo at /public/cityscape.jpg
 * - Each billboard is a "face" with { left%, top%, width%, height%, rotate, skewX, skewY }
 *   so you can match the building’s perspective.
 * - Base panel is opaque (covers the original sign), with neon border + glow.
 * - Clicking opens your existing detail panel (Copy/Close preserved).
 * - No animations, no extra deps.
 */

const IMG_PATH = "/cityscape.jpg";

/* ---------------- tiny inline icons (no external packages) ---------------- */
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

/* ---------------- billboard faces (replace signs in the photo) ----------------
   Tweak these per your exact photo. Units are percentages of the container.
   rotate in degrees; skewX/ skewY in degrees (to match perspective).
----------------------------------------------------------------------------- */
type Face = {
  id: Service["id"];
  left: number;    // % from left
  top: number;     // % from top
  width: number;   // % of container width
  height: number;  // % of container height
  rotate?: number; // deg
  skewX?: number;  // deg
  skewY?: number;  // deg
};

const FACES: Face[] = [
  // Left street, big vertical sign
  { id: "data-apps",        left: 14.0, top: 44.5, width: 10.0, height: 18.0, rotate: -2, skewX: -4, skewY: 0 },
  // Mid-left smaller board
  { id: "automation-ops",   left: 26.0, top: 40.5, width: 9.0,  height: 12.0, rotate: -3, skewX: -6, skewY: 0 },
  // Central distant sign
  { id: "machine-learning", left: 48.8, top: 36.5, width: 11.5, height: 13.0, rotate: 0,  skewX: -2, skewY: 0 },
  // Slightly right of center low roof
  { id: "analytics-eng",    left: 55.5, top: 52.0, width: 12.5, height: 10.0, rotate: -1, skewX: -3, skewY: 0 },
  // Right mid tower face
  { id: "dashboards",       left: 72.0, top: 41.0, width: 11.5, height: 14.0, rotate: 1,  skewX: 5,  skewY: 0 },
  // Far-right stacked shops
  { id: "viz-storytelling", left: 86.0, top: 46.0, width: 11.5, height: 12.0, rotate: 2,  skewX: 6,  skewY: 0 },
];

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
  const [imgSrc, setImgSrc] = React.useState<string>(IMG_PATH);

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
          {/* Aspect box so percentage faces scale consistently */}
          <div className="relative w-full h-[48vw] min-h-[360px] max-h-[720px]">
            {/* Photo backplate with graceful fallback */}
            <img
              src={imgSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
              onError={() => setImgSrc("")}
            />
            {imgSrc === "" && (
              <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#0a0f18] via-[#0a0f1a] to-[#0b1016]" />
            )}

            {/* Subtle vignette only */}
            <div className="absolute inset-0 pointer-events-none svc-vignette" />

            {/* Face-mounted billboards that cover/replace the original signs */}
            {FACES.map((f) => {
              const svc = SERVICES.find((s) => s.id === f.id)!;
              const transform = `
                translate(-50%, -50%)
                rotate(${f.rotate ?? 0}deg)
                skewX(${f.skewX ?? 0}deg)
                skewY(${f.skewY ?? 0}deg)
              `;
              return (
                <button
                  key={f.id}
                  onClick={() => open(f.id)}
                  className="face group absolute select-none"
                  style={{
                    left: `${f.left}%`,
                    top: `${f.top}%`,
                    width: `${f.width}%`,
                    height: `${f.height}%`,
                    transform,
                    transformOrigin: "50% 50%",
                  }}
                  aria-label={`${svc.title} details`}
                >
                  {/* Opaque base covers the original sign; glow + border give the neon feel */}
                  <div className="face-inner">
                    <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium tracking-wide text-cyan-100">
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

              {current.tech?.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {current.tech.map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              ) : null}

              <p className="mt-3 text-sm md:text-base text-cyan-100/85">{current.blurb}</p>

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
        .svc-city { --cyn: 0,229,255; --mag: 255,60,172; }

        .svc-vignette { position:absolute; inset:0; box-shadow: inset 0 0 120px rgba(0,0,0,.55); }

        /* Face-mounted panel covers the old sign */
        .face { position:absolute; }
        .face-inner {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          border-radius: 6px;
          background: rgba(6,12,18, .92);                    /* opaque base: hides original sign */
          border: 1px solid rgba(var(--cyn), .35);
          box-shadow:
            inset 0 0 26px rgba(var(--cyn), .24),
            0 0 22px rgba(var(--cyn), .16),
            0 0 40px rgba(var(--cyn), .10);
          backdrop-filter: saturate(1.1);
          transition: background .15s ease, border-color .15s ease, box-shadow .15s ease;
        }
        .face:hover .face-inner {
          background: rgba(6,12,18, .86);
          border-color: rgba(var(--cyn), .55);
          box-shadow:
            inset 0 0 30px rgba(var(--cyn), .30),
            0 0 28px rgba(var(--cyn), .22),
            0 0 56px rgba(var(--cyn), .16);
        }
      `}</style>
    </section>
  );
}
