"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTypewriter } from "@/hooks/useTypewriter";
import { buildExperienceJson, tokenizeJson, JsonToken } from "@/utils/jsonHighlight";
import { RichText } from "@/utils/richText";

/** -----------------------------------------------------------------------
 * Experience (Terminal/Editor theme + Tabs + JSON viewer)
 * ... (unchanged comment block)
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
  context?: string;
  featured?: boolean;
};

const EXPERIENCES: ExperienceItem[] = [
  {
    id: "lead_analyst",
    title: "Lead Analyst",
    company: "Iconic Care Inc.",
    location: "Indianapolis, Indiana",
    dates: "June 2025 – Aug 2025",
    context: "Internal Analytics & Custom ML Models for Data Insights.",
    tech: ["Python", "SQLite", "Excel", "Google Sheets/Slides", "GitHub", "Jupyter Notebooks"],
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
          "Discovered **$20,000** in transferable funds through CGM equipment alone.",
        ],
      },
      {
        name: "CalendarExtractor",
        details: [
          "Python model that extracts specific information from Google Calendar entries across any period, exporting mined data to CSV for further testing.",
          "Saves **12+ hours/week** per sales rep.",
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
    context: "Billing Ops & Analytics; dashboards, denials, reimbursement.",
    tech: ["Python", "Excel", "Google Sheets/Docs", "Brightree"],
    skills: ["Analytics", "Project Management", "System Testing", "Medical Billing", "Databases"],
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
          "Automated Packages/Kits that eliminated **~50%** of the processing time.",
        ],
      },
    ],
    fileName: "billing_revenue_specialist.json",
  },
  {
    id: "ceo_founder_data_scientist",
    title: "CEO & Founder | Data Scientist",
    company: "Palmer Projects - Freelance",
    location: "Global",
    dates: "May 2023 – Present",
    context: "Independent studio delivering analytics, ML, and software projects.",
    tech: ["Python", "R", "SQL", "Tableau", "Excel"],
    skills: ["Analytics", "Machine Learning", "Software Development", "System Testing", "Stakeholder Engagement"],
    highlights: [
      "Founded **Palmer Projects** to deliver freelance analytics, machine learning, and software solutions for global clients.",
      "Worked across diverse industries to provide actionable insights through advanced data engineering, visualization, and reporting.",
    ],
    creations: [
      {
        name: "MyGolf © 2025 Palmer Projects | Golfer's Guide to Better Play",
        details: [
          "Built `MyCaddy`, a multi-interface, physics-based shot distance calculator developed to help golfers make data-driven club selections.",
          "`MyCaddy` models the true impact of environmental and surface conditions to optimize decision-making.",
          "`MyCaddy` is highlighted in the Projects section for further detail.",
        ],
      },
    ],
    fileName: "ceo_founder_data_scientist.py",
    featured: true,
  },
];

/* ---------------- Real-time colored Typed JSON view ------------------- */
function TypedColorJsonView({ exp }: { exp: ExperienceItem }) {
  // Precompute tokens for the entire JSON once per exp
  const tokens = React.useMemo<JsonToken[]>(() => {
    const json = buildExperienceJson(exp);
    return tokenizeJson(json);
  }, [exp]);

  // Count of visible characters (across *visible text*, not HTML)
  const fullLen = React.useMemo(
    () => tokens.reduce((sum, t) => sum + t.text.length, 0),
    [tokens]
  );

  // Drive typing using your existing minimal hook (string not needed; we just need a tick count)
  const { output } = (function useCharTicker(len: number, speed = 10, startDelay = 60) {
    const [n, setN] = React.useState(0);
    React.useEffect(() => {
      setN(0);
      const startId = window.setTimeout(() => {
        const id = window.setInterval(() => {
          setN((prev) => {
            if (prev + 1 >= len) {
              window.clearInterval(id);
              return len;
            }
            return prev + 1;
          });
        }, speed);
      }, startDelay);
      return () => window.clearTimeout(startId);
    }, [len, speed, startDelay]);
    return { output: n };
  })(fullLen, 10, 60);

  // Build the partially-typed DOM: iterate tokens and render only up to `output` characters
  let remaining = output;
  const children: React.ReactNode[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (remaining <= 0) break;
    const take = Math.min(remaining, t.text.length);
    const sliceText = t.text.slice(0, take);
    children.push(
      t.className ? (
        <span key={i} className={t.className}>
          {sliceText}
        </span>
      ) : (
        <span key={i}>{sliceText}</span>
      )
    );
    remaining -= take;
  }

  const done = output >= fullLen;

  return (
    <pre className="relative font-mono text-[13px] leading-relaxed text-white/90 whitespace-pre-wrap">
      <code>{children}</code>
      <span
        className={`ml-1 inline-block h-4 w-[7px] align-baseline rounded-sm translate-y-[3px] ${
          done ? "bg-white/70 animate-pulse" : "bg-white/80 animate-pulse"
        }`}
      />
    </pre>
  );
}

/* ---------------- Tabs (mobile only) ------------------- */
function Tabs({
  items,
  activeId,
  onChange,
}: {
  items: { id: string; label: string; featured?: boolean }[];
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <ul role="tablist" aria-label="Experience files" className="flex-1 flex items-center gap-1 overflow-x-auto py-1 no-scrollbar">
      {items.map((t) => {
        const active = t.id === activeId;
        return (
          <li key={t.id} className="shrink-0">
            <button
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${t.id}`}
              id={`tab-${t.id}`}
              aria-current={active ? "page" : undefined}
              onClick={() => onChange(t.id)}
              className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-[12.5px] font-mono transition ${
                active
                  ? "bg-white/10 text-white border border-white/10 shadow-[inset_0_-2px_0_rgba(56,189,248,0.6)]"
                  : "text-white/70 hover:text-white/95 hover:bg-white/5 border border-transparent"
              }`}
            >
              <span className={`inline-block h-1 w-1 rounded-full ${active ? "bg-emerald-400" : "bg-white/30 group-hover:bg-white/50"}`} />
              {t.label}
              {t.featured && (
                <span className="ml-1 rounded-sm border border-cyan-400/40 bg-cyan-400/10 text-cyan-200 px-1 py-[1px] text-[10px]">FEATURED</span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------------- Top Bar ------------------- */
function TopBar({
  items,
  activeId,
  onChange,
}: {
  items: { id: string; label: string; featured?: boolean }[];
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="mb-4 flex items-center gap-2 border-b border-white/10 py-1">
      <span className="inline-flex gap-1.5 shrink-0 ml-1">
        <span className="h-3 w-3 rounded-full bg-red-500/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <span className="h-3 w-3 rounded-full bg-green-500/80" />
      </span>

      <div className="flex-1 md:hidden">
        <Tabs items={items} activeId={activeId} onChange={onChange} />
      </div>

      <span className="shrink-0 text-white/75 font-mono text-sm px-2">experience.json</span>
    </div>
  );
}

/* ---------------- Timeline Rail (desktop) ------------------- */
function TimelineRail({
  items,
  activeId,
  onChange,
}: {
  items: ExperienceItem[];
  activeId: string;
  onChange: (id: string) => void;
}) {
  const activeIndex = Math.max(0, items.findIndex((e) => e.id === activeId));

  return (
    <div className="relative hidden md:block pr-4">
      <div className="relative ml-3">
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 bottom-0 w-px origin-top bg-gradient-to-b from-cyan-500/60 via-cyan-400/20 to-transparent"
        />
        <ul className="relative space-y-4">
          {items.map((e) => {
            const active = e.id === activeId;
            return (
              <li key={e.id} className="pl-4">
                <button
                  onClick={() => onChange(e.id)}
                  className={`relative group flex items-center gap-2 text-left font-mono text-[12px] transition ${
                    active ? "text-white" : "text-white/60 hover:text-white/90"
                  }`}
                >
                  <span
                    className={`absolute -left-[13px] h-2.5 w-2.5 rounded-full border ${
                      active
                        ? "bg-cyan-400 border-cyan-300 shadow-[0_0_0_6px_rgba(34,211,238,0.18)]"
                        : "bg-slate-400/70 border-slate-300/80 shadow-[0_0_0_6px_rgba(148,163,184,0.10)] group-hover:bg-slate-300"
                    }`}
                  />
                  <span className="truncate max-w-[160px]">
                    {e.fileName ?? e.title.toLowerCase().replace(/\s+/g, "_") + ".json"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <motion.div
          aria-hidden
          className="absolute left-0 w-px bg-cyan-400/60"
          initial={false}
          animate={{ top: activeIndex * 28 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.6 }}
          style={{ height: 28 }}
        />
      </div>
    </div>
  );
}

/* ---------------- Main Component ------------------- */
export default function Experience() {
  const [activeId, setActiveId] = React.useState(EXPERIENCES[0]?.id ?? "");
  const active = EXPERIENCES.find((e) => e.id === activeId) ?? EXPERIENCES[0];

  return (
    <section id="experience" className="relative w-full max-w-6xl mx-auto py-20 px-6 md:px-8" aria-labelledby="experience-title">
      <h2 id="experience-title" className="sr-only">Experience</h2>

      <TopBar
        items={EXPERIENCES.map((e) => ({
          id: e.id,
          label: e.fileName ?? e.title.toLowerCase().replace(/\s+/g, "_") + ".json",
          featured: e.featured,
        }))}
        activeId={activeId}
        onChange={setActiveId}
      />

      <div className="grid grid-cols-1 md:grid-cols-[180px,1fr] gap-4">
        <TimelineRail items={EXPERIENCES} activeId={activeId} onChange={setActiveId} />

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            role="tabpanel"
            id={`panel-${active.id}`}
            aria-labelledby={`tab-${active.id}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={`rounded-xl border p-4 md:p-6 backdrop-blur ${
              active.featured
                ? "border-cyan-400/40 bg-cyan-400/5 shadow-[0_10px_40px_-10px_rgba(34,211,238,0.25)]"
                : "border-white/10 bg-black/20"
            }`}
          >
            {/* Meta row with context pill */}
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-white/70 font-mono">
              <span className="text-white/85">{active.company}</span>
              {active.location && <span>• {active.location}</span>}
              <span>• {active.dates}</span>
              {active.context && (
                <span className="inline-flex items-center gap-1 rounded bg-white/5 px-1.5 py-0.5 border border-white/10 text-[11px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/80" />
                  {active.context}
                </span>
              )}
              {active.tech && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex flex-wrap gap-1">
                    {active.tech.map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                        {t}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {active.featured && (
                <span className="ml-auto rounded-sm border border-cyan-400/40 bg-cyan-400/10 text-cyan-200 px-1.5 py-[2px] text-[10px]">
                  FEATURED ROLE
                </span>
              )}
            </div>

            {/* REAL-TIME colored typed JSON */}
            <TypedColorJsonView exp={active} />

            {/* Highlights as rich text */}
            <details className="mt-4 group">
              <summary className="cursor-pointer text-white/80 font-mono text-sm select-none">
                <span className="group-open:hidden">▸</span>
                <span className="hidden group-open:inline">▾</span> view_highlights_as_list
              </summary>
              <ul className="mt-2 list-disc pl-6 text-white/85">
                {active.highlights.map((h, i) => (
                  <li key={i} className="mb-1 text-[15px] leading-relaxed">
                    <RichText text={h} />
                  </li>
                ))}
              </ul>
            </details>

            {/* Creations as rich text */}
            {active.creations && active.creations.length > 0 && (
              <div className="mt-4">
                <details className="group">
                  <summary className="cursor-pointer text-white/80 font-mono text-sm select-none">
                    <span className="group-open:hidden">▸</span>
                    <span className="hidden group-open:inline">▾</span> view_creations
                  </summary>
                  <motion.ul
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.25 }}
                    className="mt-2 space-y-3"
                  >
                    {active.creations.map((c) => (
                      <li key={c.name} className="rounded-lg border border-white/10 bg-white/5 p-3">
                        <p className="font-medium text-white/90">{c.name}</p>
                        <ul className="mt-1 list-disc pl-5 text-white/85">
                          {c.details.map((d, j) => (
                            <li key={j} className="leading-relaxed">
                              <RichText text={d} />
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </motion.ul>
                </details>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
