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

  // try one line first
  let fs1 = fitFont(title, boxW, 28);
  let h1 = fs1 * idealLineHeight;
  const estW1 = title.length * (pxPerCharAt16 * (fs1 / 16));
  if (h1 <= boxH && estW1 <= boxW) {
    return { fontSize: fs1, lines: [title], lineHeight: fs1 * idealLineHeight, padX, padY };
  }

  // split into two lines
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

  // fallback tiny single line
  const fsTiny = Math.max(12, Math.floor(boxH / idealLineHeight));
  return { fontSize: fsTiny, lines: [title], lineHeight: fsTiny * idealLineHeight, padX, padY };
}

/* =============================== Skyline Layout =============================== */

type Building = {
  id: Service["id"];
  x: number;
  baseY: number; // ground baseline
  w: number;
  h: number;     // height
  tone: Tone;
  variant: SignVariant;
  lift: number;  // varied sign elevation above roof
};

const BUILDINGS: Building[] = [
  { id: "data-apps",        x:  90, baseY: 540, w: 160, h: 340, tone: "cyan",    variant: "blade",     lift: 12 },
  { id: "automation-ops",   x: 280, baseY: 540, w: 175, h: 370, tone: "magenta", variant: "cantilever",lift: 36 },
  { id: "machine-learning", x: 485, baseY: 540, w: 195, h: 390, tone: "amber",   variant: "gantry",    lift: 26 },
  { id: "analytics-eng",    x: 710, baseY: 540, w: 210, h: 360, tone: "cyan",    variant: "cabinet",   lift: 10 },
  { id: "dashboards",       x: 945, baseY: 540, w: 180, h: 380, tone: "magenta", variant: "marquee",   lift: 42 },
  { id: "viz-storytelling", x:1145, baseY: 540, w: 170, h: 350, tone: "amber",   variant: "trapezoid", lift: 24 },
];

/** billboard size from building width (clamped) */
function billboardSizeFor(w: number) {
  const bw = Math.max(120, Math.min(Math.round(w * 0.9), 200));
  const bh = Math.max(70, Math.min(Math.round(bw * 0.55), 112));
  return { bw, bh };
}

/* ============================== Tiny SVG helpers ============================== */

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

/* =========================== Billboard Variants =========================== */

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
    case "blade": {
      // vertical side-mounted blade; we render a horizontal cabinet but narrow, to keep text readable
      const rx = 6;
      return (
        <g>
          {/* simple hanger */}
          <rect x={w / 2 - 2} y={-20} width={4} height={20} fill={stroke} opacity={0.6} />
          {/* glow plate */}
          <rect x={-8} y={-8} width={w + 16} height={h + 16} rx={rx + 6} ry={rx + 6} fill={neon} opacity={0.18}
                filter={`url(#glow-${tone})`} />
          {/* cabinet */}
          <rect x={0} y={0} width={w} height={h} rx={rx} ry={rx} fill="url(#glass)" stroke={stroke} strokeWidth={3}
                style={{ filter: `drop-shadow(0 0 12px ${neon}) drop-shadow(0 0 28px ${neon})` }} />
          {/* side accent */}
          <rect x={w - 6} y={6} width={4} height={h - 12} fill={stroke} opacity={0.35} />
          <Label />
        </g>
      );
    }
    case "cantilever": {
      const rx = 8;
      return (
        <g>
          {/* arm + cables */}
          <line x1={-28} y1={h * 0.35} x2={0} y2={h * 0.35} stroke={stroke} strokeWidth={3} />
          <line x1={-28} y1={h * 0.35} x2={-44} y2={-18} stroke={stroke} strokeWidth={2} />
          <line x1={-10} y1={h * 0.35} x2={-28} y2={h + 6} stroke={stroke} strokeWidth={1.6} opacity={0.8} />
          {/* glow plate */}
          <rect x={-10} y={-10} width={w + 20} height={h + 20} rx={rx + 6} ry={rx + 6} fill={neon} opacity={0.17}
                filter={`url(#glow-${tone})`} />
          {/* plate */}
          <rect x={0} y={0} width={w} height={h} rx={rx} ry={rx} fill="url(#glass)" stroke={stroke} strokeWidth={2}
                style={{ filter: `drop-shadow(0 0 10px ${neon})` }} />
          <Label />
        </g>
      );
    }
    case "gantry": {
      return (
        <g>
          {/* posts */}
          <rect x={w * 0.2 - 2} y={h} width={4} height={22} fill={stroke} />
          <rect x={w * 0.8 - 2} y={h} width={4} height={22} fill={stroke} />
          {/* glow */}
          <rect x={-10} y={-10} width={w + 20} height={h + 20} fill={neon} opacity={0.18}
                filter={`url(#glow-${tone})`} />
          {/* frame */}
          <rect x={0} y={0} width={w} height={h} fill="url(#glass)" stroke={stroke} strokeWidth={2}
                style={{ filter: `drop-shadow(0 0 10px ${neon})` }} />
          <Label />
        </g>
      );
    }
    case "cabinet": {
      const rx = 6;
      return (
        <g>
          <rect x={-8} y={-8} width={w + 16} height={h + 16} rx={rx + 6} ry={rx + 6} fill={neon} opacity={0.16}
                filter={`url(#glow-${tone})`} />
          <rect x={0} y={0} width={w} height={h} rx={rx} ry={rx} fill="url(#glass)" stroke={stroke} strokeWidth={3}
                style={{ filter: `drop-shadow(0 0 12px ${neon}) drop-shadow(0 0 24px ${neon})` }} />
          {/* extruded rim */}
          <rect x={w - 6} y={4} width={6} height={h - 8} fill={stroke} opacity={0.35} />
          <Label />
        </g>
      );
    }
    case "marquee": {
      const rx = 12;
      // bulbs along the inside edge
      const bulbs = Array.from({ length: 18 }).map((_, i) => {
        const pad = 8;
        const span = w - pad * 2;
        const cx = pad + (i / 17) * span;
        return <circle key={i} cx={cx} cy={pad} r={3} fill={stroke} opacity={0.8} />;
      });
      const bulbsBottom = Array.from({ length: 18 }).map((_, i) => {
        const pad = 8;
        const span = w - pad * 2;
        const cx = pad + (i / 17) * span;
        return <circle key={`b${i}`} cx={cx} cy={h - pad} r={3} fill={stroke} opacity={0.8} />;
      });
      return (
        <g>
          <rect x={-12} y={-12} width={w + 24} height={h + 24} rx={rx + 8} ry={rx + 8} fill={neon} opacity={0.16}
                filter={`url(#glow-${tone})`} />
          <rect x={0} y={0} width={w} height={h} rx={rx} ry={rx} fill="url(#glass)" stroke={stroke} strokeWidth={3}
                style={{ filter: `drop-shadow(0 0 12px ${neon}) drop-shadow(0 0 28px ${neon})` }} />
          {bulbs}
          {bulbsBottom}
          <Label />
        </g>
      );
    }
    case "trapezoid": {
      const topInset = 16;
      return (
        <g>
          <rect x={-10} y={-10} width={w + 20} height={h + 20} fill={neon} opacity={0.16}
                filter={`url(#glow-${tone})`} />
          <polygon
            points={`0,${h} ${w},${h} ${w - topInset},0 ${topInset},0`}
            fill="url(#glass)"
            stroke={stroke}
            strokeWidth={2}
            style={{ filter: `drop-shadow(0 0 10px ${neon})` }}
          />
          <Label />
        </g>
      );
    }
  }
}

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
    <section className="relative py-20">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-cyan-100">My Services</h2>
          <p className="mt-2 max-w-2xl text-sm md:text-base text-cyan-100/70">
            Tap a billboard to open the details panel. Copy or close from the top-right.
          </p>
        </header>

        <div className="relative overflow-hidden rounded-2xl border border-cyan-400/10 bg-[#070c12]">
          <svg viewBox="0 0 1320 580" className="block w-full h-auto">
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
              <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,.0)" />
                <stop offset="100%" stopColor="rgba(180,220,255,.06)" />
              </linearGradient>
            </defs>

            {/* --------- sky + stars --------- */}
            <rect x="0" y="0" width="1320" height="580" fill="url(#sky)" />
            {Array.from({ length: 90 }).map((_, i) => {
              const x = (i * 149) % 1320;
              const y = ((i * 97) % 190) + 18;
              const r = (i % 3) + 1;
              return <circle key={i} cx={x} cy={y} r={r} fill="url(#star)" opacity={0.18} />;
            })}

            {/* --------- far silhouette --------- */}
            <g fill="#0e1724" opacity="0.85">
              <path d="M0,340 h120 v-115 h60 v-45 h120 v160 h110 v-100 h90 v135 h140 v-175 h80 v185 h150 v-145 h90 v205 h160 v-115 h130 V580 H0 Z" />
            </g>

            {/* --------- mid/near buildings from BUILDINGS --------- */}
            <g filter="url(#grain)">
              {BUILDINGS.map((b, idx) => {
                const top = b.baseY - b.h;
                return (
                  <g key={b.id}>
                    {/* main tower */}
                    <rect x={b.x} y={top} width={b.w} height={b.h} fill="#0f1623" stroke="rgba(255,255,255,.06)" />
                    {/* overhang band */}
                    <rect x={b.x - 6} y={top + Math.round(b.h * 0.34)} width={b.w + 12} height={10} fill="#0a111b" />
                    {/* vents (slats) */}
                    {slats(b.x + 12, top + 22, b.w - 24, 26, 6)}
                    {/* windows grid (lower half) */}
                    {gridWindows(
                      b.x + 10,
                      top + Math.round(b.h * 0.52),
                      b.w - 20,
                      Math.round(b.h * 0.44),
                      6 + (idx % 3),
                      8 + ((idx + 1) % 3),
                      6,
                      idx % 2 ? "#ffcba4" : "#9cf3ff"
                    )}
                    {/* tiny spire / beacon variety */}
                    {idx % 2 === 0 ? (
                      <>
                        <rect x={b.x + b.w * 0.46} y={top - 24} width={6} height={24} fill="#101a29" />
                        <circle cx={b.x + b.w * 0.49} cy={top - 26} r={3} fill="#9cf3ff" opacity={0.7} />
                      </>
                    ) : (
                      <>
                        <path d={`M${b.x + b.w*0.35} ${top - 16} l12 -22 l12 22 z`} fill="#121c2b" />
                        <rect x={b.x + b.w*0.40} y={top - 38} width={8} height={22} fill="#101a29" />
                      </>
                    )}
                  </g>
                );
              })}
            </g>

            {/* --------- ground + fog --------- */}
            <rect x="0" y="530" width="1320" height="50" fill="#09101a" />
            <rect x="0" y="500" width="1320" height="40" fill="url(#fog)" />
            <rect x="0" y="520" width="1320" height="35" fill="url(#fog)" opacity={0.6} />

            {/* --------- header billboards (variants) --------- */}
            {BUILDINGS.map((b) => {
              const svc = SERVICES.find((s) => s.id === b.id)!;
              const { bw, bh } = billboardSizeFor(b.w);
              const roof = b.baseY - b.h;
              const x = Math.round(b.x + (b.w - bw) / 2);
              const y = Math.round(roof - (bh + b.lift));
              return (
                <g key={`${b.id}-hdr`} transform={`translate(${x} ${y})`} style={{ cursor: "pointer" }} onClick={() => open(b.id)}>
                  <BillboardHeader w={bw} h={bh} title={svc.title} tone={b.tone} variant={b.variant} />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* --------- Overlay Panel --------- */}
      {current && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
          <div className="relative w-full max-w-2xl rounded-2xl border border-cyan-400/20 bg-[#0b1016]/90 shadow-2xl">
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
