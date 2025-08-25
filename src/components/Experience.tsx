"use client";

import * as React from "react";

/** -----------------------------------------------------------------------
 * Experience (Hybrid: VS Code Tabs + JSON editor)
 * - Tabs per job (file-like)
 * - JSON-like editor with syntax colors
 * - Accessible; works with scroll or top-bar jump
 * ----------------------------------------------------------------------*/

type Creation = { name: string; details: string[] };

type ExperienceItem = {
  id: string;
  title: string;
  company: string;
  location?: string;
  dates: string;
  tech?: string[];
  skills?: string[];
  highlights: string[];
  creations?: Creation[];
  fileName?: string;
};

const EXPERIENCES: ExperienceItem[] = [
  {
    id: "lead_analyst",
    title: "Lead Analyst",
    company: "Iconic Care Inc.",
    location: "Indianapolis, Indiana",
    dates: "June 2025 – Aug 2025",
    tech: [
      "Python",
      "SQLite",
      "Excel",
      "Google Sheets/Slides",
      "GitHub",
      "Jupyter Notebooks",
    ],
    skills: ["Analytics", "Custom ML Models", "Revenue Cycle KPIs"],
    highlights: [
      "Built internal analytics tools using Python, Google Sheets, and ML models to support billing, rep performance, and operational forecasting.",
      "Created optimization models that support field representative efficiency, tying performance metrics directly to revenue outcomes.",
      "Acted as the cross-functional analytics lead between billing, customer service, sales, and leadership, managing mission-critical projects across departments.",
    ],
    creations: [
      {
        name: "CGM Patient Responsibility Tracker",
        details: [
          "Machine-Learning Model capable of mass data upload via CSV, mining and manipulation for key insights, and output of newly constructed CSV.",
          "Discovered $20,000 in transferable funds through CGM equipment alone.",
        ],
      },
      {
        name: "CalendarExtractor",
        details: [
          "Python model that extracts specific information from Google Calendar entries across any period, exporting mined data to CSV for further testing.",
          "Saves 12+ hours per week per sales rep.",
        ],
      },
    ],
    fileName: "lead_analyst.json",
  },
  {
    id: "billing_revenue_specialist",
    title: "Billing & Revenue Specialist",
    company: "Iconic Care Inc.",
    location: "Indianapolis, Indiana",
    dates: "May 2025 – Jun 2025",
    tech: ["Python", "Excel", "Google Sheets/Docs", "Brightree"],
    skills: [
      "Analytics",
      "Project Management",
      "System Testing",
      "Medical Billing",
      "Databases",
    ],
    highlights: [
      "Optimized Payor Level Dashboards, Billing Cycle Processes, Patient Information Checklist, HPCPS Code Validations, Cost/Reimbursement Data, and BrightTree Consignment to be interpreted throughout all departments of Iconic Care Inc.",
      "Expressed analytical insights throughout a multitude of departments while maintaining the confidentiality of crucial company metrics.",
      "Created denial tracking and prevention dashboards to increase success rates.",
      "Constructed Iconic Care's first-ever balance sheet for tracking all crucial financial metrics.",
    ],
    creations: [
      {
        name: "Operational Assets",
        details: [
          "15+ Dashboards across billing, denial tracking, and reimbursement.",
          "10+ Quality Checklists for Denials/Claims management.",
          "Automated Packages/Kits that eliminated half of the processing time.",
        ],
      },
    ],
    fileName: "billing_revenue_specialist.json",
  },
  {
    id: "ceo_founder_data_scientist",
    title: "CEO & Founder | Data Scientist",
    company: "<<< COMPANY >>>",
    dates: "<<< DATES >>>",
    highlights: ["<<< Placeholder until details are added >>>"],
    fileName: "ceo_founder_data_scientist.py",
  },
];

/* ---------------- Helpers for JSON pretty rendering ------------------- */
function JsonArray({
  items,
  itemColor = "text-green-400",
  commaColor = "text-white/50",
}: {
  items: React.ReactNode[];
  itemColor?: string;
  commaColor?: string;
}) {
  return (
    <span>
      [
      {items.map((v, i) => (
        <React.Fragment key={i}>
          <span className={itemColor}>{v}</span>
          {i < items.length - 1 ? (
            <span className={`mx-0.5 ${commaColor}`}>, </span>
          ) : null}
        </React.Fragment>
      ))}
      ]
    </span>
  );
}

function ExperienceJsonView({ exp }: { exp: ExperienceItem }) {
  return (
    <pre className="relative font-mono text-[13px] leading-relaxed text-white/90 whitespace-pre-wrap">
      <code>
        <span className="text-white/80">{"{"}</span>
        {"\n"}
        {"  "}
        <span className="text-blue-400">"title"</span>:{" "}
        <span className="text-green-400">"{exp.title}"</span>,
        {"\n"}
        {"  "}
        <span className="text-blue-400">"company"</span>:{" "}
        <span className="text-green-400">"{exp.company}"</span>,
        {"\n"}
        {exp.location && (
          <>
            {"  "}
            <span className="text-blue-400">"location"</span>:{" "}
            <span className="text-green-400">"{exp.location}"</span>,
            {"\n"}
          </>
        )}
        {"  "}
        <span className="text-blue-400">"dates"</span>:{" "}
        <span className="text-orange-300">"{exp.dates}"</span>,
        {"\n"}
        {exp.tech && (
          <>
            {"  "}
            <span className="text-blue-400">"tech"</span>:{" "}
            <JsonArray items={exp.tech.map((t, i) => <span key={i}>"{t}"</span>)} />
            ,{"\n"}
          </>
        )}
        {exp.skills && (
          <>
            {"  "}
            <span className="text-blue-400">"skills"</span>:{" "}
            <JsonArray items={exp.skills.map((s, i) => <span key={i}>"{s}"</span>)} />
            ,{"\n"}
          </>
        )}
        {"  "}
        <span className="text-blue-400">"highlights"</span>: [\n
        {exp.highlights.map((h, i) => (
          <div key={i} className="pl-6">
            <span className="text-green-400">"{h}"</span>
            {i < exp.highlights.length - 1 ? (
              <span className="text-white/60">,</span>
            ) : null}
          </div>
        ))}
        {"  ]"}
        {exp.creations && (
          <>
            ,{"\n"}
            {"  "}
            <span className="text-blue-400">"creations"</span>: [\n
            {exp.creations.map((c, i) => (
              <div key={i} className="pl-6">
                <span className="text-white/80">{"{"}</span>
                {"\n"}
                {"    "}
                <span className="text-blue-400">"name"</span>:{" "}
                <span className="text-green-400">"{c.name}"</span>,
                {"\n"}
                {"    "}
                <span className="text-blue-400">"details"</span>: [\n
                {c.details.map((d, j) => (
                  <div key={j} className="pl-10">
                    <span className="text-green-400">"{d}"</span>
                    {j < c.details.length - 1 ? (
                      <span className="text-white/60">,</span>
                    ) : null}
                  </div>
                ))}
                {"    ]\n"}
                <span className="text-white/80">{"  }"}</span>
                {i < exp.creations.length - 1 ? (
                  <span className="text-white/60">,</span>
                ) : null}
              </div>
            ))}
            {"  ]"}
          </>
        )}
        {"\n"}
        <span className="text-white/80">{"}"}</span>
      </code>
    </pre>
  );
}

/* ---------------- Tabs ------------------- */
function Tabs({
  items,
  activeId,
  onChange,
}: {
  items: { id: string; label: string }[];
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="border-b border-white/10">
      <ul
        role="tablist"
        aria-label="Experience files"
        className="flex items-center gap-1 overflow-x-auto py-1"
      >
        {items.map((t) => {
          const active = t.id === activeId;
          return (
            <li key={t.id} className="shrink-0">
              <button
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${t.id}`}
                id={`tab-${t.id}`}
                onClick={() => onChange(t.id)}
                className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-[12.5px] font-mono transition
                  ${
                    active
                      ? "bg-white/10 text-white border border-white/10 shadow-[inset_0_-2px_0_rgba(56,189,248,0.6)]"
                      : "text-white/70 hover:text-white/95 hover:bg-white/5 border border-transparent"
                  }`}
              >
                <span
                  className={`inline-block h-1 w-1 rounded-full ${
                    active
                      ? "bg-emerald-400"
                      : "bg-white/30 group-hover:bg-white/50"
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
  const active =
    EXPERIENCES.find((e) => e.id === activeId) ?? EXPERIENCES[0];

  return (
    <section
      id="experience"
      className="relative w-full max-w-5xl mx-auto py-20 px-6 md:px-8"
      aria-labelledby="experience-title"
    >
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
          label:
            e.fileName ??
            e.title.toLowerCase().replace(/\s+/g, "_") + ".json",
        }))}
        activeId={activeId}
        onChange={setActiveId}
      />

      {/* Panel */}
      <div
        role="tabpanel"
        id={`panel-${active.id}`}
        aria-labelledby={`tab-${active.id}`}
        className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 md:p-6"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-white/50 font-mono">
          <span>{active.company}</span>
          {active.location && <span>• {active.location}</span>}
          <span>• {active.dates}</span>
          {active.tech && (
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
          )}
        </div>

        {/* JSON view */}
        <ExperienceJsonView exp={active} />

        {/* Highlights plain list */}
        <details className="mt-4 group">
          <summary className="cursor-pointer text-white/80 font-mono text-sm select-none">
            <span className="group-open:hidden">▸</span>
            <span className="hidden group-open:inline">▾</span>{" "}
            view_highlights_as_list
          </summary>
          <ul className="mt-2 list-disc pl-6 text-white/85">
            {active.highlights.map((h, i) => (
              <li key={i} className="mb-1 text-[15px] leading-relaxed">
                {h}
              </li>
            ))}
            {active.creations &&
              active.creations.map((c, i) => (
                <li key={i} className="mt-2">
                  <strong>{c.name}:</strong>
                  <ul className="list-disc pl-6">
                    {c.details.map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>
                </li>
              ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
