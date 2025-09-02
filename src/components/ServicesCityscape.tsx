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
function toneColors(tone: Tone) {
  switch (tone) {
    case "cyan": return { neon: "rgba(0,229,255,1)", stroke: "rgba(0,229,255,.55)" };
    case "magenta": return { neon: "rgba(255,60,172,1)", stroke: "rgba(255,60,172,.50)" };
    case "amber": return { neon: "rgba(255,190,110,1)", stroke: "rgba(255,190,110,.55)" };
  }
}

/** auto-fit text into billboard (1–2 lines) */
function layoutLabel(title: string, bw: number, bh: number, padX = 16, padY = 14) {
  const boxW = bw - padX * 2;
  const boxH = bh - padY * 2;
  const idealLineHeight = 1.15;
  const pxPerCharAt16 = 8;

  const fitFont = (txt: string, targetW: number, maxPx = 28) => {
    const len = Math.max(6, txt.length);
    const est = Math.min(maxPx, Math.floor((targetW / (len * (pxPerCharAt16 / 16))) * 0.98));
    return Math.max(12, est);
  };

  // try one line
  let fs1 = fitFont(title, boxW, 28);
  const h1 = fs1 * idealLineHeight;
  const estW1 = title.length * (pxPerCharAt16 * (fs1 / 16));
  if (h1 <= boxH && estW1 <= boxW) {
    return { fontSize: fs1, lines: [title], lineHeight: fs1 * idealLineHeight, padX, padY };
  }

  // split into two lines (prefer split on " & " or closest space to center)
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

/* =============================== Layout =============================== */

type Building = {
  id: Service["id"];
  x: number;
  baseY: number; // ground baseline
  w: number;
  h: number;     // height
  tone: Tone;
  lift: number;  // sign elevation above roof
};

const BUILDINGS: Building[] = [
  { id: "data-apps",        x:  78, baseY: 560, w: 160, h: 390, tone: "cyan",    lift: 12 },
  { id: "automation-ops",   x: 280, baseY: 560, w: 175, h: 430, tone: "magenta", lift: 26 },
  { id: "machine-learning", x: 510, baseY: 560, w: 200, h: 450, tone: "amber",   lift: 18 },
  { id: "analytics-eng",    x: 750, baseY: 560, w: 210, h: 425, tone: "cyan",    lift: 10 },
  { id: "dashboards",       x: 990, baseY: 560, w: 185, h: 440, tone: "magenta", lift: 24 },
  { id: "viz-storytelling", x:1205, baseY: 560, w: 170, h: 410, tone: "amber",   lift: 16 },
];

/** billboard size from building width (clamped) */
function billboardSizeFor(w: number) {
  const bw = Math.max(130, Math.min(Math.round(w * 0.92), 220));
  const bh = Math.max(72, Math.min(Math.round(bw * 0.52), 118));
  return { bw, bh };
}

/* ============================== Random ============================== */

/** deterministic 0..1 (SSR-safe) */
function seeded(seed: number) {
  const s = Math.sin(seed) * 10000;
  return s - Math.floor(s);
}

/* ============================== SVG helpers ============================== */

/** background skyline blocks with soft lit windows */
function backgroundBlocks({
  yTop,
  color = "#0c1522",
  width = 1360,
  bandH = 140,
  density = 0.5,
  seedBase = 1,
}: {
  yTop: number; color?: string; width?: number; bandH?: number; density?: number; seedBase?: number;
}) {
  const buildings: JSX.Element[] = [];
  let x = -20;
  let idx = 0;
  while (x < width + 40) {
    const s = seeded(seedBase + idx * 7.3);
    const w = 80 + Math.round(s * 160);
    const h = 60 + Math.round(seeded(seedBase + idx * 11.1) * bandH);
    const y = yTop - h;
    const bx = Math.max(-20, Math.min(1360, x));
    const bw = Math.min(w, 1360 - bx);
    buildings.push(
      <g key={`bg-${seedBase}-${idx}`} opacity={0.9}>
        <rect x={bx} y={y} width={bw} height={h} fill={color} />
        {/* soft windows */}
        {Array.from({ length: Math.round((bw * h) / 1800 * density) }).map((_, i) => {
          const sw = 6, sh = 5;
          const cx = bx + 8 + (i * 31) % Math.max(1, bw - 16);
          const cy = y + 8 + ((i * 53) % Math.max(1, h - 16));
          const on = seeded(seedBase + idx * 100 + i * 13.7) > 0.4;
          return on ? (
            <rect key={`w-${i}`} x={cx} y={cy} width={sw} height={sh} fill="#9adfff" opacity={0.16} />
          ) : null;
        })}
      </g>
    );
    x += w + 18 + Math.round(seeded(seedBase + idx * 5.5) * 30);
    idx++;
  }
  return buildings;
}

/** organic glowing windows on foreground towers */
function gridWindows(
  x: number, y: number, w: number, h: number, cols: number, rows: number,
  hueA = "#9cf3ff", hueB = "#ffcba4"
): JSX.Element[] {
  const pad = 8;
  const gw = (w - pad * 2) / cols;
  const gh = (h - pad * 2) / rows;
  const out: JSX.Element[] = [];
  let i = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++, i++) {
      const seed = (x + y + r * 131 + c * 73 + i * 17) * 0.12345;
      const rnd1 = seeded(seed);
      const rnd2 = seeded(seed + 11.11);
      const rnd3 = seeded(seed + 22.22);

      const sw = gw * (0.52 + rnd1 * 0.18);
      const sh = gh * (0.42 + rnd2 * 0.20);
      const cx = x + pad + c * gw + (gw - sw) / 2;
      const cy = y + pad + r * gh + (gh - sh) / 2;

      const duration = (2.2 + rnd1 * 4.2).toFixed(2);
      const delay = (rnd2 * 4).toFixed(2);
      const litColor = rnd3 > 0.5 ? hueA : hueB;
      const burned = rnd3 > 0.93;

      out.push(
        <rect
          key={`${x}-${y}-${i}`}
          x={cx}
          y={cy}
          width={sw}
          height={sh}
          rx={1.5}
          ry={1.5}
          fill={litColor}
          opacity={burned ? 0.12 : 0.18 + rnd2 * 0.25}
          className="window-glow"
          style={{
            animation: burned
              ? undefined
              : `windowGlow ${duration}s cubic-bezier(.4,0,.2,1) ${delay}s infinite alternate`,
          } as React.CSSProperties}
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

/** façade ribs and corner fins for foreground towers */
function facadeDetails(bx: number, top: number, bw: number, bh: number, idx: number) {
  const els: JSX.Element[] = [];
  const ribs = 3 + (idx % 3);
  const gap = bw / (ribs + 1);
  for (let i = 1; i <= ribs; i++) {
    const x = bx + i * gap;
    els.push(<rect key={`rib-${i}`} x={x} y={top + 12} width={2} height={bh - 24} fill="rgba(255,255,255,.05)" />);
  }
  // corner fins
  els.push(<rect key="finL" x={bx - 3} y={top + 8} width={3} height={bh - 16} fill="rgba(255,255,255,.05)" />);
  els.push(<rect key="finR" x={bx + bw} y={top + 8} width={3} height={bh - 16} fill="rgba(255,255,255,.05)" />);

  // duct run
  if (seeded(idx * 9.1) > 0.42) {
    const dy = top + 60 + Math.round(seeded(idx * 3.3) * (bh * 0.4));
    els.push(<rect key="duct" x={bx + 6} y={dy} width={bw - 12} height={6} fill="#0b1320" />);
  }

  // service ladder
  if (seeded(idx * 5.7) > 0.6) {
    const lx = bx + bw - 10;
    els.push(<rect key="ladder" x={lx} y={top + 20} width={2} height={bh - 40} fill="rgba(255,255,255,.10)" />);
    for (let k = 0; k < Math.floor((bh - 40) / 16); k++) {
      els.push(<rect key={`rung-${k}`} x={lx - 8} y={top + 28 + k * 16} width={10} height={1.2} fill="rgba(255,255,255,.10)" />);
    }
  }

  return els;
}

/** random-ish roof furniture (deterministic per building index) */
function roofDetails(bx: number, top: number, bw: number, idx: number) {
  const elements: JSX.Element[] = [];
  const s1 = seeded(idx * 7.7);
  const s2 = seeded(idx * 13.3);
  const s3 = seeded(idx * 19.9);

  // HVAC unit
  if (s1 > 0.2) {
    const w = 28 + Math.round(s1 * 20);
    const h = 12 + Math.round(s2 * 8);
    const x = bx + 10 + Math.round(s2 * (bw - 60));
    const y = top - h - 6;
    elements.push(
      <g key={`hvac-${idx}`}>
        <rect x={x} y={y} width={w} height={h} fill="#0f1a28" stroke="rgba(255,255,255,.08)" />
        {slats(x + 4, y + 3, w - 8, h - 6, 5, "rgba(255,255,255,.10)")}
      </g>
    );
  }
  // water tank
  if (s2 > 0.55) {
    const r = 9 + Math.round(s3 * 6);
    const x = bx + bw - (30 + r);
    const y = top - (r * 2 + 6);
    elements.push(
      <g key={`tank-${idx}`}>
        <rect x={x - 2} y={y + r * 2} width={4} height={10} fill="#0d1624" />
        <circle cx={x} cy={y + r} r={r} fill="#0f1b2a" stroke="rgba(255,255,255,.08)" />
        <rect x={x - r} y={y + r * 1.8} width={r * 2} height={4} fill="#0b1320" />
      </g>
    );
  }
  // antenna + beacon
  if (s3 > 0.35) {
    const ax = bx + bw * (0.3 + s1 * 0.4);
    const h = 18 + Math.round(s2 * 16);
    elements.push(
      <g key={`ant-${idx}`}>
        <rect x={ax} y={top - h - 2} width={2} height={h + 2} fill="#101a29" />
        <circle cx={ax + 1} cy={top - h - 4} r={3} fill="#9cf3ff" opacity={0.75} />
      </g>
    );
  }
  // cable run
  if (s1 + s2 > 0.9) {
    const x1 = bx + 8, x2 = bx + bw - 8;
    const y = top - 4;
    elements.push(
      <path
        key={`cable-${idx}`}
        d={`M${x1} ${y} C ${x1 + 30} ${y + 8}, ${x2 - 30} ${y - 6}, ${x2} ${y + 4}`}
        stroke="rgba(180,220,255,.25)"
        strokeWidth={1}
        fill="none"
      />
    );
  }

  return elements;
}

/* =========================== Rectangular Billboard =========================== */

function RectBillboard({
  w, h, title, tone,
}: { w: number; h: number; title: string; tone: Tone }) {
  const { neon, stroke } = toneColors(tone);
  const layout = layoutLabel(title, w, h, 16, 14);

  return (
    <g>
      {/* precise glow plate (same rect) */}
      <rect
        x={-10}
        y={-10}
        width={w + 20}
        height={h + 20}
        rx={8}
        ry={8}
        fill={neon}
        opacity={0.16}
        filter={`url(#glow-${tone})`}
      />
      {/* cabinet */}
      <rect
        x={0}
        y={0}
        width={w}
        height={h}
        rx={6}
        ry={6}
        fill="url(#glass)"
        stroke={stroke}
        strokeWidth={3}
        style={{ filter: `drop-shadow(0 0 12px ${neon}) drop-shadow(0 0 24px ${neon})` }}
      />
      {/* subtle rim */}
      <rect x={w - 6} y={4} width={4} height={h - 8} fill={stroke} opacity={0.35} />
      {/* label */}
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
    </g>
  );
}

/* ============================ Typing Subheading (Looping) ============================ */

function TypingLine({
  text,
  speed = 40,        // ms per typed character
  eraseSpeed = 28,   // ms per erased character
  startDelay = 300,  // ms before first typing starts
  pauseAfterType = 1100,
  pauseAfterErase = 600,
  caret = true,
  loop = true,
}: {
  text: string;
  speed?: number;
  eraseSpeed?: number;
  startDelay?: number;
  pauseAfterType?: number;
  pauseAfterErase?: number;
  caret?: boolean;
  loop?: boolean;
}) {
  const [shown, setShown] = React.useState("");
  const [phase, setPhase] = React.useState<"idle"|"typing"|"hold"|"erasing"|"hold2">("idle");

  React.useEffect(() => {
    let t: any;
    let step: any;

    const startTyping = () => {
      setPhase("typing");
      let i = 0;
      step = setInterval(() => {
        i++;
        setShown(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(step);
          setPhase("hold");
          t = setTimeout(() => {
            if (loop) startErasing(); else setPhase("idle");
          }, pauseAfterType);
        }
      }, speed);
    };

    const startErasing = () => {
      setPhase("erasing");
      let i = text.length;
      step = setInterval(() => {
        i--;
        setShown(text.slice(0, Math.max(0, i)));
        if (i <= 0) {
          clearInterval(step);
          setPhase("hold2");
          t = setTimeout(() => {
            if (loop) startTyping(); else setPhase("idle");
          }, pauseAfterErase);
        }
      }, eraseSpeed);
    };

    // initial delay
    t = setTimeout(startTyping, startDelay);

    return () => {
      clearTimeout(t);
      clearInterval(step);
    };
  }, [text, speed, eraseSpeed, startDelay, pauseAfterType, pauseAfterErase, loop]);

  return (
    <div className="mt-3 text-center text-sm md:text-base text-cyan-100/80">
      <span>{shown}</span>
      {caret && (
        <span
          aria-hidden
          className="ml-1 inline-block h-[1.05em] align-[-0.06em] w-[.65ch] bg-cyan-300/80 animate-blink"
        />
      )}
      <style jsx>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .animate-blink { animation: blink 1s steps(1, end) infinite; }
      `}</style>
    </div>
  );
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
        {/* Centered heading + typing subline (looping) */}
        <header className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-cyan-100">My Services</h2>
          <TypingLine text="Click a billboard to view a service!" />
        </header>

        <div className="relative overflow-hidden rounded-2xl border border-cyan-400/10 bg-[#070c12]">
          <svg viewBox="0 0 1360 600" className="block w-full h-auto">
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
            <rect x="0" y="0" width="1360" height="600" fill="url(#sky)" />
            {Array.from({ length: 110 }).map((_, i) => {
              const x = (i * 131) % 1360;
              const y = ((i * 97) % 200) + 18;
              const r = (i % 3) + 1;
              return <circle key={i} cx={x} cy={y} r={r} fill="url(#star)" opacity={0.18} />;
            })}

            {/* --------- far silhouettes (two layers, lighter + closer) --------- */}
            <g opacity={0.75}>
              {backgroundBlocks({ yTop: 360, color: "#0c1522", bandH: 120, density: 0.45, seedBase: 10 })}
            </g>
            <g opacity={0.9}>
              {backgroundBlocks({ yTop: 410, color: "#0e1928", bandH: 150, density: 0.55, seedBase: 50 })}
            </g>

            {/* --------- mid/near foreground towers --------- */}
            <g filter="url(#grain)">
              {BUILDINGS.map((b, idx) => {
                const roofY = Math.max(40, b.baseY - b.h);
                const bh = b.baseY - roofY;

                return (
                  <g key={b.id}>
                    {/* main tower */}
                    <rect x={b.x} y={roofY} width={b.w} height={bh} fill="#0f1623" stroke="rgba(255,255,255,.06)" />
                    {/* façade detail */}
                    {facadeDetails(b.x, roofY, b.w, bh, idx)}
                    {/* overhang band */}
                    <rect x={b.x - 6} y={roofY + Math.round(bh * 0.30)} width={b.w + 12} height={10} fill="#0a111b" />
                    {/* vents (slats) */}
                    {slats(b.x + 12, roofY + 22, b.w - 24, 26, 6)}
                    {/* windows grid (lower half) with animated glow */}
                    {gridWindows(
                      b.x + 10,
                      roofY + Math.round(bh * 0.52),
                      b.w - 20,
                      Math.round(bh * 0.44),
                      6 + (idx % 3),
                      8 + ((idx + 1) % 3),
                      "#9cf3ff",
                      "#ffcba4"
                    )}
                    {/* roof furniture */}
                    {roofDetails(b.x, roofY, b.w, idx)}
                  </g>
                );
              })}
            </g>

            {/* --------- ground + fog --------- */}
            <rect x="0" y="545" width="1360" height="55" fill="#09101a" />
            <rect x="0" y="510" width="1360" height="40" fill="url(#fog)" />
            <rect x="0" y="533" width="1360" height="34" fill="url(#fog)" opacity={0.6} />

            {/* --------- rectangular billboards (clamped to frame) --------- */}
            {BUILDINGS.map((b) => {
              const svc = SERVICES.find((s) => s.id === b.id)!;
              const { bw, bh } = billboardSizeFor(b.w);
              const roof = Math.max(40, b.baseY - b.h);
              let yTarget = roof - (bh + b.lift);
              if (yTarget < 16) yTarget = 16;
              const xTarget = Math.round(Math.max(6, Math.min(1360 - bw - 6, b.x + (b.w - bw) / 2)));

              return (
                <g key={`${b.id}-hdr`} transform={`translate(${xTarget} ${Math.round(yTarget)})`} style={{ cursor: "pointer" }} onClick={() => open(b.id)}>
                  <RectBillboard w={bw} h={bh} title={svc.title} tone={b.tone} />
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
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                  <path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
                </svg>
                Copy
              </button>
              <button
                onClick={close}
                className="inline-flex items-center rounded-md border border-cyan-400/20 bg-cyan-400/10 p-1.5 text-cyan-100 hover:bg-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                aria-label="Close"
                title="Close (Esc)"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"/>
                </svg>
              </button>
            </div>

            <div className="p-5 md:p-6">
              <div className="mb-2 flex items-center gap-2 text-cyan-100">
                <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-70" fill="currentColor">
                  <path d="M3 3h10v8H3V3zm0 10h8v8H3v-8zm10-5h8v13h-8V8z"/>
                </svg>
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

      {/* Global keyframes for SVG window glow */}
      <style jsx global>{`
        @keyframes windowGlow {
          0%   { opacity: 0.10; }
          45%  { opacity: 0.30; }
          60%  { opacity: 0.62; }
          100% { opacity: 0.92; }
        }
        @media (prefers-reduced-motion: reduce) {
          .window-glow { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
