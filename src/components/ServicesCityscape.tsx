"use client";

import React from "react";

/**
 * Photo Backplate + Polygon Billboards (with on-page editor)
 * - Uses /public/cityscape.jpg as the backplate.
 * - Each billboard is an SVG <polygon> (any shape), fully opaque cover.
 * - Per-board tint + blend to match scene color.
 * - Edit mode: hold **E** to toggle; drag points; press **Cmd/Ctrl+C** to copy JSON to clipboard.
 * - Clicking a board opens the detail panel (Copy/Close preserved).
 *
 * Steps:
 * 1) Put your chosen image at /public/cityscape.jpg (or change IMG_PATH).
 * 2) Go to the page, press **E** to enter Edit Mode. Drag the 4 points of each board
 *    so they exactly trace the real sign. Press Cmd/Ctrl+C to copy updated JSON.
 * 3) Paste the JSON back into BILLBOARDS array (points are [% x, % y] in the viewBox).
 */

const IMG_PATH = "/cityscape.jpg";

/* ---------------- icons (inline, no deps) ---------------- */
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

/* --------------------- services content (same as before) --------------------- */
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

/* ------------------- billboard polygons (edit these) -------------------
 * points: array of [x%, y%] in a 100x100 normalized viewBox
 * tint: "cyan" | "magenta" | "amber" | "white" | hex
 * blend: "screen" | "overlay" | "normal"
 * opacity: number 0..1
 */
type Pt = [number, number];
type Board = {
  id: Service["id"];
  points: Pt[];   // polygon in % of width/height (0-100)
  tint?: string;  // e.g., "cyan", "#36e7ff"
  blend?: "screen" | "overlay" | "normal";
  opacity?: number;
  labelScale?: number; // text scale relative to board
};

const BILLBOARDS: Board[] = [
  {
    id: "data-apps",
    points: [
      [9.5, 47.5], [14.5, 47.0], [14.5, 63.5], [9.3, 64.0], // rough; tweak in editor
    ],
    tint: "cyan",
    blend: "screen",
    opacity: 0.95,
    labelScale: 0.9,
  },
  {
    id: "automation-ops",
    points: [
      [22.5, 42.0], [27.8, 41.0], [27.2, 53.4], [22.2, 54.6],
    ],
    tint: "cyan",
    blend: "screen",
    opacity: 0.95,
  },
  {
    id: "machine-learning",
    points: [
      [47.8, 37.5], [54.5, 37.2], [54.0, 48.0], [47.5, 48.4],
    ],
    tint: "cyan",
    blend: "screen",
    opacity: 0.95,
  },
  {
    id: "analytics-eng",
    points: [
      [54.2, 52.2], [66.0, 52.0], [65.6, 60.5], [54.0, 60.8],
    ],
    tint: "cyan",
    blend: "screen",
    opacity: 0.95,
  },
  {
    id: "dashboards",
    points: [
      [70.6, 41.6], [76.8, 40.8], [76.2, 53.4], [70.2, 54.0],
    ],
    tint: "cyan",
    blend: "screen",
    opacity: 0.95,
  },
  {
    id: "viz-storytelling",
    points: [
      [84.8, 45.2], [90.6, 44.8], [90.2, 56.0], [84.4, 56.6],
    ],
    tint: "cyan",
    blend: "screen",
    opacity: 0.95,
  },
];

/* ------------------------------- helpers -------------------------------- */
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

function tintToColor(t?: string) {
  switch ((t || "").toLowerCase()) {
    case "cyan": return "rgba(0,229,255,1)";
    case "magenta": return "rgba(255,60,172,1)";
    case "amber": return "rgba(255,190,110,1)";
    case "white": return "rgba(255,255,255,1)";
    default: return t || "rgba(0,229,255,1)";
  }
}

/* ------------------------------- component ------------------------------- */
export default function ServicesCityscape() {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [scrollY, setScrollY] = React.useState<number>(0);
  const [imgSrc, setImgSrc] = React.useState<string>(IMG_PATH);

  // editor state
  const [editing, setEditing] = React.useState<boolean>(false);
  const [boards, setBoards] = React.useState<Board[]>(BILLBOARDS);
  const [drag, setDrag] = React.useState<{ bIndex: number; pIndex: number } | null>(null);

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

  // keyboard: E toggles editor, Cmd/Ctrl+C copies updated JSON
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (openId) { close(); return; }
        setEditing(false);
      }
      if (e.key.toLowerCase() === "e") setEditing((v) => !v);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c" && editing) {
        const json = JSON.stringify(boards, null, 2);
        navigator.clipboard?.writeText(json).catch(() => {});
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [editing, boards, close, openId]);

  // drag handlers for points (in % coords relative to SVG 100x100 viewbox)
  const onSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!drag) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setBoards((prev) => {
      const next = prev.map((b) => ({ ...b, points: b.points.map((p) => [...p] as Pt) }));
      next[drag.bIndex].points[drag.pIndex] = [Math.max(0, Math.min(100, xPct)), Math.max(0, Math.min(100, yPct))];
      return next;
    });
  };
  const onSvgMouseUp = () => setDrag(null);

  return (
    <section className="svc-city relative py-20">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-cyan-100">My Services</h2>
          <p className="mt-2 max-w-2xl text-sm md:text-base text-cyan-100/70">
            Click a billboard for details. Press <kbd>E</kbd> to {editing ? "exit" : "enter"} align mode.
          </p>
        </header>

        {/* Backplate box */}
        <div className="relative overflow-hidden rounded-2xl bg-[#070c12] border border-cyan-400/10">
          <div className="relative w-full h-[48vw] min-h-[360px] max-h-[720px]">
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

            {/* Overlay: SVG editor + polygons */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              onMouseMove={onSvgMouseMove}
              onMouseUp={onSvgMouseUp}
            >
              {/* subtle vignette to help readability */}
              <defs>
                <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
                  <stop offset="60%" stopColor="rgba(0,0,0,0)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
                </radialGradient>
              </defs>
              <rect x="0" y="0" width="100" height="100" fill="url(#vignette)" />

              {boards.map((b, bi) => {
                const svc = SERVICES.find((s) => s.id === b.id)!;
                const pts = b.points.map(([x, y]) => `${x},${y}`).join(" ");
                const tint = tintToColor(b.tint);
                const fill = tint; // opaque base so old sign is fully hidden
                const blend = b.blend || "normal";
                const opacity = b.opacity ?? 0.95;

                return (
                  <g key={b.id} style={{ mixBlendMode: blend as any, cursor: editing ? "move" : "pointer" }}>
                    {/* billboard face */}
                    <polygon
                      points={pts}
                      fill={fill}
                      opacity={opacity}
                      stroke="rgba(0,229,255,0.45)"
                      strokeWidth={0.25}
                      filter="url(#)"
                      onClick={() => !editing && open(b.id)}
                    />
                    {/* inner glass panel (adds neon feel without being transparent to the old sign) */}
                    <polygon
                      points={pts}
                      fill="rgba(6,12,18,0.85)"
                      stroke="rgba(0,229,255,0.45)"
                      strokeWidth={0.15}
                      style={{ filter: "drop-shadow(0 0 2px rgba(0,229,255,.5)) drop-shadow(0 0 6px rgba(0,229,255,.25))" }}
                      onClick={() => !editing && open(b.id)}
                    />
                    {/* label: positioned at polygon centroid */}
                    <text
                      x={centroid(b.points)[0]}
                      y={centroid(b.points)[1]}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={`${(b.labelScale ?? 1) * 2.6}px`}
                      fill="rgba(200,250,255,0.95)"
                      style={{ pointerEvents: "none", fontWeight: 600, letterSpacing: ".6px" }}
                    >
                      {svc.title}
                    </text>

                    {/* editor handles */}
                    {editing &&
                      b.points.map(([x, y], pi) => (
                        <g key={pi}>
                          {/* segment lines */}
                          <line
                            x1={x} y1={y}
                            x2={b.points[(pi + 1) % b.points.length][0]}
                            y2={b.points[(pi + 1) % b.points.length][1]}
                            stroke="rgba(255,255,255,.45)"
                            strokeWidth={0.15}
                          />
                          {/* draggable node */}
                          <circle
                            cx={x}
                            cy={y}
                            r={0.8}
                            fill="rgba(0,229,255,1)"
                            stroke="rgba(0,0,0,.6)"
                            strokeWidth={0.2}
                            onMouseDown={() => setDrag({ bIndex: bi, pIndex: pi })}
                          />
                        </g>
                      ))}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Overlay Panel */}
      {current && (
        <div role="dialog" aria-modal="true" aria-label={`${current.title} details`} className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpenId(null)} />
          <div className="relative w-full max-w-2xl rounded-2xl border border-cyan-400/20 bg-[#0b1016]/90 shadow-2xl">
            <div className="absolute right-2 top-2 flex items-center gap-2">
              <button
                onClick={() => navigator.clipboard?.writeText(stringifyService(current)).catch(() => {})}
                className="group inline-flex items-center gap-1.5 rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1.5 text-xs text-cyan-100 hover:bg-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                aria-label="Copy details" title="Copy details (Cmd/Ctrl+C)"
              >
                <Icon.Copy className="h-3.5 w-3.5" /> Copy
              </button>
              <button
                onClick={() => setOpenId(null)}
                className="inline-flex items-center rounded-md border border-cyan-400/20 bg-cyan-400/10 p-1.5 text-cyan-100 hover:bg-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                aria-label="Close" title="Close (Esc)"
              >
                <Icon.X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 md:p-6">
              <div className="mb-2 flex items-center gap-2 text-cyan-100">
                <Icon.PanelsTopLeft className="h-4 w-4 opacity-70" />
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

      <style jsx>{`
        .svc-city { --cyn: 0,229,255; }
        kbd { background: rgba(255,255,255,.1); padding: 2px 6px; border-radius: 4px; font-size: 12px; }
      `}</style>
    </section>
  );
}

/* centroid for label placement */
function centroid(points: Pt[]): Pt {
  // polygon centroid (simple average fallback if area is tiny)
  let x = 0, y = 0, a = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    const f = xi * yj - xj * yi;
    a += f;
    x += (xi + xj) * f;
    y += (yi + yj) * f;
  }
  if (Math.abs(a) < 1e-6) {
    const sx = points.reduce((s, p) => s + p[0], 0);
    const sy = points.reduce((s, p) => s + p[1], 0);
    return [sx / points.length, sy / points.length];
  }
  a *= 0.5;
  return [x / (6 * a), y / (6 * a)];
}
