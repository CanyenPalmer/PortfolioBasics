"use client";

import * as React from "react";

/** -----------------------------------------------------------------------
 * Experience (Hybrid: VS Code Tabs + JSON editor)
 * - Each role appears as a file tab (Option C)
 * - The open tab renders JSON-like content with syntax colors (Option A)
 * - Fully client-only, Tailwind styled, a11y-friendly
 * ----------------------------------------------------------------------*/

type ExperienceItem = {
  id: string;
  title: string;
  company: string;
  location?: string;
  dates: string;           // e.g. "2023 – Present"
  tech?: string[];         // quick stack tags
  highlights: string[];    // bullet points
  fileName?: string;       // optional: custom tab name (defaults from title)
};

const EXPERIENCES: ExperienceItem[] = [
  {
    id: "data_scientist",
    title: "Data Scientist",
    company: "TechCorp",
    location: "Remote",
    dates: "2023 – Present",
    tech: ["Python", "Pandas", "scikit-learn", "Airflow", "AWS"],
    highlights: [
      "Built uplift model improving retention by 12% YoY.",
      "Designed event-driven ETL in Airflow processing 2B+ rows/month.",
      "Partnered with product to deploy real-time scoring API (p95 < 60ms).",
    ],
    fileName: "data_scientist.py",
  },
  {
    id: "data_analyst",
    title: "Data Analyst",
    company: "AnalyticsHub",
    location: "Indianapolis, IN",
    dates: "2021 – 2023",
    tech: ["SQL", "Tableau", "Python", "dbt"],
    highlights: [
      "Automated KPI dashboards; reduced weekly reporting time by 8 hours.",
      "Wrote reusable SQL/dbt models for finance + growth analytics.",
      "Ran A/B analysis framework w/ sequential testing & CUPED adjustments.",
    ],
    fileName: "data_analyst.json",
  },
  {
    id: "intern",
    title: "Data Science Intern",
    company: "Insight Labs",
    dates: "2020 – 2021",
    tech: ["Python", "NumPy", "Matplotlib"],
    highlights: [
      "Explored anomaly detection for IoT sensor data; cut false positives 18%.",
      "Documented notebooks with reproducible seeds & data contracts.",
    ],
    fileName: "intern.ipynb",
  },
];

/** Small helper to format arrays w/ commas, line breaks, and syntax colors */
function JsonArray({
  items,
  itemColor = "text-green-400",
  commaColor = "text-white/50",
  wrap = true,
}: {
  items: React.ReactNode[];
  itemColor?: string;
  commaColor?: string;
  wrap?: boolean;
}) {
  return (
    <span className={`${wrap ? "whitespace-pre-wrap" : ""}`}>
      [
      {items.map((v, i) => (
        <React.Fragment key={i}>
          <span className={`${itemColor}`}>{v}</span>
          {i < items.length - 1 ? <span className={`mx-0.5 ${commaColor}`}>, </span> : null}
        </React.Fragment>
      ))}
      ]
    </span>
  );
}

/** The JSON-like pretty view for a single job */
function ExperienceJsonView({ exp }: { exp: ExperienceItem }) {
  return (
    <pre className="relative font-mono text-[13px] leading-relaxed text-white/90">
      <code>
        <span className="text-white/80">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="text-blue-400">"title"</span>
        <span className="text-white/60">: </span>
        <span className="text-green-400">"{exp.title}"</span>
        <span className="text-white/60">,</span>
        {"\n"}
        {"  "}
        <span className="text-blue-400">"company"</span>
        <span className="text-white/60">: </span>
        <span className="text-green-400">"{exp.company}"</span>
        {exp.location ? (
          <>
            <span className="text-white/60">,</span>
            {"\n"}
            {"  "}
            <span className="text-blue-400">"location"</span>
            <span className="text-white/60">: </span>
            <span className="text-green-400">"{exp.location}"</span>
          </>
        ) : null}
        <span className="text-white/60">,</span>
        {"\n"}
        {"  "}
        <span className="text-blue-400">"dates"</span>
        <span className="text-white/60">: </span>
        <span className="text-orange-300">"{exp.dates}"</span>
        {exp.tech?.length ? (
          <>
            <span className="text-white/60">,</span>
            {"\n"}
            {"  "}
            <span className="text-blue-400">"tech"</span>
            <span className="text-white/60">: </span>
            <JsonArray
              items={exp.tech.map((t, i) => <span key={i}>"{t}"</span>)}
              itemColor="text-green-400"
            />
          </>
        ) : null}
        <span className="text-white/60">,</span>
        {"\n"}
        {"  "}
        <span className="text-blue-400">"highlights"</span>
        <span className="text-white/60">: [</span>
        {"\n"}
        {exp.highlights.map((h, i) => (
          <div key={i} className="pl-6">
            <span className="text-green-400">"{h}"</span>
            {i < exp.highlights.length - 1 ? <span className="text-white/60">,</span> : null}
          </div>
        ))}
        <span className="text-white/60">{"\n  ]"}</span>
        {"\n"}
        <span className="text-white/80">{"}"}</span>
      </code>
    </pre>
  );
}

/** Accessible VS Code–like tabs */
function Tabs({
  items,
  activeId,
  onChange,
}: {
  items: { id: string; label: string }[];
  activeId: string;
  onChange: (id: string) => void;
}) {
  const listRef = React.useRef<HTMLUListElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!listRef.current) return;
    const btns = Array.from(listRef.current.querySelectorAll<HTMLButtonElement>("button[role=tab]"));
    if (!btns.length) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = btns[(index + 1) % btns.length];
      next.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = btns[(index - 1 + btns.length) % btns.length];
      prev.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      btns[0].focus();
    } else if (e.key === "End") {
      e.preventDefault();
      btns[btns.length - 1].focus();
    }
  };

  return (
    <div className="border-b border-white/10">
      <ul
        ref={listRef}
        role="tablist"
        aria-label="Experience files"
        className="flex items-center gap-1 overflow-x-auto py-1"
      >
        {items.map((t, i) => {
          const active = t.id === activeId;
          return (
            <li key={t.id} className="shrink-0">
              <button
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${t.id}`}
                id={`tab-${t.id}`}
                onClick={() => onChange(t.id)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-[12.5px] font-mono transition
                  ${active
                    ? "bg-white/10 text-white border border-white/10 shadow-[inset_0_-2px_0_rgba(56,189,248,0.6)]"
                    : "text-white/70 hover:text-white/95 hover:bg-white/5 border border-transparent hover:shadow-[inset_0_-2px_0_rgba(255,255,255,0.25)]"
                  }`}
                title={t.label}
              >
                {/* Dot status (active file) */}
                <span
                  className={`inline-block h-1 w-1 rounded-full ${
                    active ? "bg-emerald-400" : "bg-white/30 group-hover:bg-white/50"
                  }`}
                />
                {t.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Experience() {
  const [activeId, setActiveId] = React.useState(EXPERIENCES[0]?.id ?? "");
  const active = React.useMemo(
    () => EXPERIENCES.find((e) => e.id === activeId) ?? EXPERIENCES[0],
    [activeId]
  );

  return (
    <section
      id="experience"
      className="relative w-full max-w-5xl mx-auto py-20 px-6 md:px-8"
      aria-labelledby="experience-title"
    >
      {/* Section heading styled like a file in VS Code */}
      <div className="mb-4">
        <h2 id="experience-title" className="sr-only">
          Experience
        </h2>
        <div className="flex items-center gap-2 text-white/75 font-mono text-sm">
          <span className="inline-flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </span>
          <span className="opacity-80">experience.json</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        items={EXPERIENCES.map((e) => ({
          id: e.id,
          label: e.fileName ?? e.title.toLowerCase().replace(/\s+/g, "_") + ".json",
        }))}
        activeId={activeId}
        onChange={setActiveId}
      />

      {/* Editor surface */}
      <div
        role="tabpanel"
        id={`panel-${active.id}`}
        aria-labelledby={`tab-${active.id}`}
        className="
          mt-4 rounded-xl border border-white/10 bg-black/20
          p-4 md:p-6
          shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]
        "
      >
        {/* File header (breadcrumb-ish) */}
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-white/50 font-mono">
          <span>{active.company}</span>
          {active.location && <span>• {active.location}</span>}
          <span>• {active.dates}</span>
          {active.tech?.length ? (
            <>
              <span className="hidden sm:inline">•</span>
              <div className="flex flex-wrap gap-1">
                {active.tech.map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </>
          ) : null}
        </div>

        {/* JSON body */}
        <ExperienceJsonView exp={active} />

        {/* Optional: Foldable highlights (plain list for readability) */}
        <details className="mt-4 group">
          <summary className="cursor-pointer text-white/80 font-mono text-sm select-none">
            <span className="group-open:hidden">▸</span>
            <span className="hidden group-open:inline">▾</span> view_highlights_as_list
          </summary>
          <ul className="mt-2 list-disc pl-6 text-white/85">
            {active.highlights.map((h, i) => (
              <li key={i} className="mb-1 text-[15px] leading-relaxed">
                {h}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
