"use client";

import React from "react";

/**
 * Cyber City (SVG) — Detailed Skyline + Built-In Billboards
 * - Spires, antennae, ducts/vents, overhangs, catwalks, hanging frames, cross-street cables
 * - Billboards are part of buildings (perfect alignment, no photos)
 * - Overlay panel preserves Copy / Close behavior
 * - Zero external deps
 */

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
    title: "Data Apps",
    blurb:
      "Internal tools & micro-APIs that save hours: lightweight web apps, file pipelines, and quick integrations.",
    tech: ["Python", "Flask/FastAPI", "TypeScript/React", "Tailwind", "Excel/OpenPyXL"],
    bullets: [
      "Built lightweight web apps and micro-APIs around analytics workloads (e.g., MyCaddy).",
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
    title: "Automation & Ops",
    blurb:
      "Scheduled jobs and self-healing checks so reporting runs itself—retries, alerts, and data quality gates.",
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
  },
  {
    id: "analytics-eng",
    title: "Analytics",
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
  },
];

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

/** Billboard slots (in viewBox coords) */
type BillboardSlot = {
  id: Service["id"];
  x: number;
  y: number;
  w: number;
  h: number;
  angle?: number;
  tone: "cyan" | "magenta" | "amber";
};
const SLOTS: BillboardSlot[] = [
  { id: "data-apps",        x: 110,  y: 185, w: 90,  h: 140, angle: -2, tone: "cyan" },
  { id: "automation-ops",   x: 255,  y: 165, w: 110, h: 90,  angle: -3, tone: "cyan" },
  { id: "machine-learning", x: 425,  y: 135, w: 132, h: 96,  angle:  0, tone: "cyan" },
  { id: "analytics-eng",    x: 585,  y: 218, w: 150, h: 95,  angle: -1, tone: "amber" },
  { id: "dashboards",       x: 787,  y: 165, w: 130, h: 118, angle:  2, tone: "magenta" },
  { id: "viz-storytelling", x: 985,  y: 200, w: 142, h: 102, angle:  1, tone: "magenta" },
];

/* ----------------------------- SVG helpers ----------------------------- */
function toneColors(tone: "cyan" | "magenta" | "amber") {
  switch (tone) {
    case "cyan": return { neon: "rgba(0,229,255,1)", stroke: "rgba(0,229,255,.55)" };
    case "magenta": return { neon: "rgba(255,60,172,1)", stroke: "rgba(255,60,172,.50)" };
    case "amber": return { neon: "rgba(255,190,110,1)", stroke: "rgba(255,190,110,.55)" };
  }
}
function gridWindows(
  x: number, y: number, w: number, h: number, cols: number, rows: number,
  litEvery = 6, litColor = "#9cf3ff"
): JSX.Element[] {
  const pad = 8;
  const gw = (w - pad * 2) / cols;
  const gh = (h - pad * 2) / rows;
  const sw = gw * 0.6;
  const sh = gh * 0.5;
  const out: JSX.Element[] = [];
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++, i++) {
      out.push(
        <rect
          key={`${x}-${y}-${i}`}
          x={x + pad + c * gw + (gw - sw) / 2}
          y={y + pad + r * gh + (gh - sh) / 2}
          width={sw}
          height={sh}
          rx={1.5}
          ry={1.5}
          fill={i % litEvery === 0 ? litColor : "rgba(255,255,255,.05)"}
          opacity={0.9}
        />
      );
    }
  }
  return out;
}
function slats(x: number, y: number, w: number, h: number, n: number, color = "rgba(255,255,255,.08)") {
  const gap = h / n;
  return Array.from({ length: n }).map((_, i) => (
    <rect key={i} x={x} y={y + i * gap} width={w} height={gap * 0.35} fill={color} />
  ));
}
function screws(points: Array<[number, number]>, color: string) {
  return points.map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r={2} fill={color} opacity={0.6} />);
}

/* ----------------------------- Component ------------------------------ */
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
    <section className="relative py-20">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-cyan-100">My Services</h2>
          <p className="mt-2 max-w-2xl text-sm md:text-base text-cyan-100/70">
            Tap a billboard to open the details panel. Copy or close from the top-right.
          </p>
        </header>

        <div className="relative overflow-hidden rounded-2xl border border-cyan-400/10 bg-[#070c12]">
          <svg viewBox="0 0 1200 520" className="block w-full h-auto">
            {/* --------- defs --------- */}
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0b1220" />
                <stop offset="55%" stopColor="#0a0f1a" />
                <stop offset="100%" stopColor="#0a0f18" />
              </linearGradient>
              <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(6,12,18,0.92)" />
                <stop offset="100%" stopColor="rgba(10,14,22,0.86)" />
              </linearGradient>
              <radialGradient id="star" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#9ff6ff" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <filter id="grain" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
                <feComponentTransfer>
                  <feFuncA type="table" tableValues="0 0.015" />
                </feComponentTransfer>
                <feBlend mode="overlay" in2="SourceGraphic" />
              </filter>
              {(["cyan","magenta","amber"] as const).map((t)=>(
                <filter id={`glow-${t}`} key={t} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              ))}
              {/* fog bands */}
              <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,.0)" />
                <stop offset="100%" stopColor="rgba(180,220,255,.06)" />
              </linearGradient>
            </defs>

            {/* --------- sky + stars --------- */}
            <rect x="0" y="0" width="1200" height="520" fill="url(#sky)" />
            {Array.from({ length: 70 }).map((_, i) => {
              const x = (i * 173) % 1200;
              const y = ((i * 97) % 180) + 20;
              const r = (i % 3) + 1;
              return <circle key={i} cx={x} cy={y} r={r} fill="url(#star)" opacity={0.18} />;
            })}

            {/* --------- far skyline silhouettes (depth) --------- */}
            <g fill="#0e1724" opacity="0.8">
              <path d="M0,300 h120 v-90 h60 v-40 h110 v130 h100 v-80 h90 v110 h120 v-140 h80 v150 h140 v-120 h80 v170 h120 v-90 h120 V520 H0 Z" />
            </g>

            {/* --------- mid skyline w/ spires, antennae --------- */}
            <g fill="#0f1623">
              {/* block shapes */}
              <rect x="20" y="300" width="90" height="200" />
              <rect x="130" y="260" width="80" height="240" />
              <rect x="240" y="220" width="120" height="280" />
              <rect x="380" y="240" width="110" height="260" />
              <rect x="510" y="210" width="140" height="290" />
              <rect x="670" y="235" width="120" height="265" />
              <rect x="810" y="260" width="110" height="240" />
              <rect x="940" y="230" width="120" height="270" />
              <rect x="1080" y="290" width="90" height="210" />
              {/* spires */}
              <path d="M290 220 l15 -28 l15 28 z" fill="#121c2b" />
              <rect x="300" y="180" width="10" height="40" fill="#101a29" />
              <rect x="558" y="170" width="8" height="45" fill="#101a29" />
              <circle cx="562" cy="168" r="3" fill="#9cf3ff" opacity="0.7" />
              <rect x="716" y="210" width="6" height="30" fill="#101a29" />
              <rect x="980" y="210" width="8" height="36" fill="#101a29" />
            </g>

            {/* --------- midground detailed buildings (vents, overhangs, catwalks) --------- */}
            <g filter="url(#grain)">
              {/* Building A (left) */}
              <g>
                <rect x="80" y="250" width="130" height="230" fill="#0d1420" stroke="rgba(0,229,255,.18)" />
                {/* overhang */}
                <rect x="75" y="300" width="140" height="10" fill="#0a111b" />
                {/* vents */}
                {slats(90, 315, 60, 24, 5)}
                {gridWindows(92, 350, 100, 120, 6, 8, 5, "#6be7ff")}
                {/* rooftop duct */}
                <rect x="95" y="240" width="40" height="8" fill="#0a111b" />
                <rect x="135" y="238" width="20" height="10" fill="#0a111b" />
              </g>

              {/* Building B (mid-left) */}
              <g>
                <rect x="230" y="220" width="150" height="260" fill="#0e1624" stroke="rgba(172,108,255,.15)"/>
                {/* overhang + catwalk */}
                <rect x="220" y="270" width="170" height="10" fill="#0a111b" />
                <rect x="225" y="280" width="160" height="6" fill="rgba(255,255,255,.06)" />
                {Array.from({length:8}).map((_,i)=>(
                  <rect key={i} x={230+i*20} y={286} width="2" height="18" fill="rgba(255,255,255,.08)" />
                ))}
                {gridWindows(240, 300, 130, 170, 7, 9, 7, "#f7b2ff")}
                {/* rooftop units */}
                <rect x="250" y="210" width="30" height="8" fill="#0a111b" />
                <rect x="285" y="208" width="18" height="10" fill="#0a111b" />
              </g>

              {/* Building C (center) */}
              <g>
                <rect x="410" y="200" width="170" height="280" fill="#0e1521" stroke="rgba(0,229,255,.15)"/>
                {/* vertical signage frame (non-click) */}
                <rect x="420" y="210" width="16" height="120" fill="rgba(255,255,255,.04)" />
                <rect x="552" y="210" width="16" height="120" fill="rgba(255,255,255,.04)" />
                {/* vents block */}
                <rect x="470" y="230" width="60" height="26" fill="#0a111b" />
                {slats(472, 233, 56, 20, 6)}
                {gridWindows(420, 360, 150, 110, 9, 7, 6, "#9cf3ff")}
              </g>

              {/* Building D (center-right) */}
              <g>
                <rect x="600" y="260" width="190" height="220" fill="#0d1420" stroke="rgba(255,190,110,.14)"/>
                {/* overhang + ducts */}
                <rect x="592" y="310" width="206" height="10" fill="#0a111b" />
                <rect x="610" y="320" width="60" height="16" fill="#0a111b" />
                {slats(612, 322, 56, 12, 5)}
                {gridWindows(610, 350, 170, 110, 8, 7, 6, "#ffcba4")}
                {/* roof boxes */}
                <rect x="620" y="250" width="26" height="10" fill="#0a111b" />
                <rect x="700" y="248" width="20" height="12" fill="#0a111b" />
              </g>

              {/* Building E (right) */}
              <g>
                <rect x="820" y="230" width="150" height="250" fill="#0e1624" stroke="rgba(255,60,172,.16)"/>
                {/* hanging signage frame (non-click, decorative) */}
                <rect x="880" y="220" width="6" height="40" fill="rgba(255,255,255,.08)"/>
                <rect x="846" y="260" width="74" height="8" fill="rgba(255,255,255,.08)"/>
                {gridWindows(830, 300, 130, 160, 7, 9, 6, "#ff9fdf")}
              </g>

              {/* Building F (far-right) */}
              <g>
                <rect x="990" y="260" width="140" height="220" fill="#0d1420" stroke="rgba(255,60,172,.16)"/>
                <rect x="980" y="315" width="160" height="8" fill="#0a111b" />
                {gridWindows(1000, 330, 110, 130, 6, 8, 5, "#ffc6e9")}
                {/* rooftop fan */}
                <circle cx="1040" cy="255" r="10" fill="#0a111b" />
                {Array.from({length:5}).map((_,i)=>(
                  <rect key={i} x={1039} y={246+i*4} width="2" height="18" fill="rgba(255,255,255,.08)"/>
                ))}
              </g>
            </g>

            {/* --------- cross-street cables --------- */}
            <g stroke="rgba(180,210,255,.14)" strokeWidth="2">
              <path d="M60,200 C300,260 520,150 760,210 980,265 1120,220 1180,230" fill="none" />
              <path d="M40,240 C260,300 520,190 780,245 980,290 1120,260 1195,270" fill="none" />
              {/* small hanging beacons */}
              {[200, 420, 680, 910].map((x,i)=>(
                <g key={i}>
                  <line x1={x} y1={215} x2={x} y2={235} stroke="rgba(180,210,255,.18)" strokeWidth="2"/>
                  <circle cx={x} cy={240} r="3" fill="#9ff6ff" opacity="0.65"/>
                </g>
              ))}
            </g>

            {/* --------- ground/fog --------- */}
            <rect x="0" y="470" width="1200" height="50" fill="#09101a" />
            <rect x="0" y="440" width="1200" height="40" fill="url(#fog)" />
            <rect x="0" y="460" width="1200" height="35" fill="url(#fog)" opacity="0.6" />

            {/* --------- BILLBOARDS (interactive) --------- */}
            {SLOTS.map((slot) => {
              const svc = SERVICES.find((s) => s.id === slot.id)!;
              const { neon, stroke } = toneColors(slot.tone);
              return (
                <g
                  key={slot.id}
                  transform={`translate(${slot.x} ${slot.y}) rotate(${slot.angle ?? 0})`}
                  style={{ cursor: "pointer" }}
                  onClick={() => open(slot.id)}
                >
                  {/* hanger tabs */}
                  <rect x={-4} y={-10} width={8} height={10} fill="rgba(255,255,255,.05)" />
                  <rect x={slot.w-4} y={-10} width={8} height={10} fill="rgba(255,255,255,.05)" />
                  {/* cables to frame */}
                  <path d={`M0,-8 L0,0 M${slot.w},-8 L${slot.w},0`} stroke="rgba(255,255,255,.12)" strokeWidth="2" />

                  {/* glow plate */}
                  <rect
                    x="-8" y="-8" width={slot.w + 16} height={slot.h + 16}
                    rx="12" ry="12"
                    fill={neon} opacity="0.18"
                    filter={`url(#glow-${slot.tone})`}
                  />
                  {/* frame */}
                  <rect
                    x="0" y="0" width={slot.w} height={slot.h}
                    rx="10" ry="10"
                    fill="url(#glass)"
                    stroke={stroke}
                    strokeWidth="2"
                    style={{ filter: `drop-shadow(0 0 12px ${neon}) drop-shadow(0 0 28px ${neon})` }}
                  />
                  {/* screws */}
                  {screws(
                    [[10,10],[slot.w-10,10],[10,slot.h-10],[slot.w-10,slot.h-10]],
                    stroke
                  )}
                  {/* label */}
                  <text
                    x={slot.w/2} y={slot.h/2}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="18" fill="#d9faff" opacity="0.92"
                    style={{ letterSpacing: ".5px", fontWeight: 700, pointerEvents: "none" }}
                  >
                    {svc.title}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Overlay Panel */}
      {current && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
          <div className="relative w-full max-w-2xl rounded-2xl border border-cyan-400/20 bg-[#0b1016]/90 shadow-2xl">
            {/* actions */}
            <div className="absolute right-2 top-2 flex items-center gap-2">
              <button
                onClick={() => current && navigator.clipboard?.writeText(stringifyService(current)).catch(() => {})}
                className="group inline-flex items-center gap-1.5 rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1.5 text-xs text-cyan-100 hover:bg-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                aria-label="Copy details"
                title="Copy details (Cmd/Ctrl+C)"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>
                Copy
              </button>
              <button
                onClick={close}
                className="inline-flex items-center rounded-md border border-cyan-400/20 bg-cyan-400/10 p-1.5 text-cyan-100 hover:bg-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                aria-label="Close"
                title="Close (Esc)"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"/></svg>
              </button>
            </div>

            {/* content */}
            <div className="p-5 md:p-6">
              <div className="mb-2 flex items-center gap-2 text-cyan-100">
                <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-70" fill="currentColor"><path d="M3 3h10v8H3V3zm0 10h8v8H3v-8zm10-5h8v13h-8V8z"/></svg>
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
    </section>
  );
}
