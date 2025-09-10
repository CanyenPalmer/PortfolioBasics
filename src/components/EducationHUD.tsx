"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type CourseBuckets = {
  math?: string[];
  cs?: string[];
  finance?: string[];
  other?: string[];
  foundations?: string[];
  analytics?: string[];
  ml?: string[];
  programming?: string[];
  core?: string[];
  electives?: string[];
  capstone?: string[];
};

type Edu = {
  id: string;
  years: string;
  label: string;
  placement: "above" | "below";
  credentials: string[];
  highlights?: string[];
  courses?: CourseBuckets;
};

const EDUCATION: Edu[] = [
  {
    id: "gchs",
    years: "2015 – 2019",
    label: "Greenfield-Central High School | Academic & Technical Honors Diplomas",
    placement: "above",
    credentials: [
      "Academic Honors Diploma",
      "Technical Honors Diploma",
      "Project Lead The Way (PLTW) | Completed",
    ],
    highlights: [
      "2× Men’s Varsity Golf",
      "4× Men’s Varsity Golf Medalist",
      "Franklin College 2019 Academic Scholarship Student & Men’s Golf Athlete",
      "NineStar Connect Scholarship Student",
    ],
  },
  {
    id: "ballstate",
    years: "2020 – 2024",
    label: "Ball State University | B.G.S. – Mathematics, A.A. – Computer Science",
    placement: "below",
    credentials: [
      "B.G.S. – Mathematics",
      "A.A. – Computer Science",
      "Dean’s List (Summer 2023)",
    ],
    highlights: [
      "Dean’s List Summer 2023",
      "Launched Palmer Projects — Freelance Data Services",
    ],
    courses: {
      math: [
        "MATH 113: Precalculus Algebra",
        "MATH 114: Precalculus Trigonometry",
        "MATH 125: Mathematics Applications",
        "MATH 165: Calculus I",
        "MATH 166: Calculus II",
        "MATH 215: Discrete Systems",
        "MATH 267: Calculus III",
        "MATH 320: Probability",
        "MATH 321: Mathematical Statistics",
      ],
      cs: [
        "CS 120: Computer Science I | Programming Fundamentals",
        "CS 121: Computer Science II | Data Structures & OOP",
        "CS 224: Design & Analysis of Algorithms",
        "CS 230: Computer Organization & Architecture",
      ],
      finance: ["FIN 101: Personal Finance", "FIN 110: Personal Finance"],
      other: [
        "IMM 140: CyberSecurity (Franklin College)",
        "LA 103: Quantitative Reasoning (Franklin College)",
        "PHYC 100: Conceptual Physics",
        "BA 205: Foundations of Business Analytics",
        "ISOM 125: Intro to Business Computer Applications",
        "GCM 184: Graphics | Computer Applications",
        "CT 100: Future Technology Innovations",
      ],
    },
  },
  {
    id: "google-ada",
    years: "2025",
    label: "Google Advanced Data Analytics Professional Certificate",
    placement: "above",
    credentials: ["Awarded July 2025 (Google)"],
    highlights: [
      "Python programming",
      "SQL repositories / workflows",
      "Tableau data visualization",
      "Capstone: Logistic Regression & Tree-Based ML (see Projects)",
    ],
    courses: {
      foundations: ["Foundations of Data Science", "Get Started with Python"],
      analytics: [
        "Go Beyond the Numbers: Translate Data into Insights",
        "The Power of Statistics",
      ],
      ml: [
        "Regression Analysis: Simplify Complex Data Relationships",
        "The Nuts and Bolts of Machine Learning",
      ],
      capstone: ["Google Advanced Data Analytics Capstone"],
    },
  },
  {
    id: "pitt-mds",
    years: "2025 – Present",
    label: "University of Pittsburgh | Master of Data Science (M.D.S.)",
    placement: "below",
    credentials: ["Master of Data Science — M.D.S."],
    highlights: [
      "Python",
      "SQL",
      "Machine Learning",
      "Data Visualization",
      "Jupyter Notebooks",
      "Anaconda",
    ],
    courses: {
      programming: ["CMPINF 2100: Data-Centric Computing"],
      foundations: [
        "CMPINF 2105: Mathematical & Statistical Foundations for Data Science",
        "CMPINF 2140: Responsible Data Science",
      ],
      core: [
        "CMPINF 2110: Managing, Querying, and Preserving Data",
        "CMPINF 2120: Applied Predictive Modeling",
        "CMPINF 2130: The Art of Data Visualization",
      ],
      electives: [
        "CMPINF 2211: Foundations of Cloud Computing for Data Science Professionals",
        "CMPINF 2221: Applied Bayesian Data Analysis",
        "CMPINF 2223: LLMs and Their Applications",
      ],
      capstone: ["CMPINF 2910: Case Studies in Data Science"],
    },
  },
];

function HoloBg() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,255,0.08),transparent_40%),linear-gradient(to_right,rgba(0,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.06)_1px,transparent_1px)] bg-[size:auto,80px_1px,1px_80px]" />
  );
}

export default function EducationHUD() {
  const items = useMemo(() => EDUCATION, []);
  const [open, setOpen] = useState<Edu | null>(null);
  const [coursesOpen, setCoursesOpen] = useState(false);

  useEffect(() => {
    const had = document.body.style.overflow;
    if (open || coursesOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = had;
    };
  }, [open, coursesOpen]);

  return (
    <section
      id="education"
      className="relative mx-auto max-w-7xl px-4 py-32 md:py-40 scroll-mt-24"
    >
      <div className="mb-16 md:mb-20">
        <h2 className="text-center text-3xl md:text-4xl font-semibold tracking-[0.2em] text-cyan-300">
          EDUCATION
        </h2>
        <p className="mt-4 text-center text-cyan-200/70">
          Click a node to open the full academic dossier.
        </p>
      </div>

      <HoloBg />

      {/* Spine container with nodes centered on the line */}
      <div className="relative w-full h-56 md:h-64">
        {/* Spine exactly through node centers */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] rounded-full bg-gradient-to-r from-cyan-400/60 via-cyan-400/30 to-fuchsia-400/60" />

        {/* End labels pinned to the extreme ends */}
        <div className="absolute inset-x-0 top-[calc(50%+36px)] flex justify-between text-cyan-300/80 text-xs md:text-sm">
          <span>2015</span>
          <span>Present</span>
        </div>

        {/* Evenly spaced nodes along the spine */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between items-center">
          {items.map((edu) => (
            <div key={edu.id} className="relative flex items-center justify-center">
              {/* Node */}
              <button
                onClick={() => setOpen(edu)}
                className="group relative h-4 w-4 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(0,255,255,.6)]"
                aria-haspopup="dialog"
                aria-label={`${edu.label} — ${edu.years}`}
              >
                <span className="pointer-events-none absolute -inset-1 rounded-full bg-cyan-400/70 blur-sm opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Connector that DOES NOT touch the spine (starts just off the node) */}
              {edu.placement === "above" ? (
                <div className="absolute left-1/2 -translate-x-1/2 top-[-92px] md:top-[-112px] h-[80px] md:h-[96px] w-[2px] bg-cyan-400/40" />
              ) : (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[-92px] md:bottom-[-112px] h-[80px] md:h-[96px] w-[2px] bg-cyan-400/40" />
              )}

              {/* Label card */}
              {edu.placement === "above" ? (
                <div className="absolute left-1/2 -translate-x-1/2 top-[-128px] md:top-[-156px] w-[min(48ch,46vw)]">
                  <div className="rounded-xl border border-cyan-400/40 bg-slate-900/60 p-3 text-center shadow-[0_0_24px_rgba(0,255,255,0.18)]">
                    <div className="text-xs md:text-sm text-cyan-200 font-semibold">
                      {edu.label}
                    </div>
                    <div className="mt-1 text-[11px] md:text-xs text-cyan-300/80">
                      {edu.years}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[-128px] md:bottom-[-156px] w-[min(48ch,46vw)]">
                  <div className="rounded-xl border border-cyan-400/40 bg-slate-900/60 p-3 text-center shadow-[0_0_24px_rgba(0,255,255,0.18)]">
                    <div className="text-xs md:text-sm text-cyan-200 font-semibold">
                      {edu.label}
                    </div>
                    <div className="mt-1 text-[11px] md:text-xs text-cyan-300/80">
                      {edu.years}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Extra bottom breathing room */}
      <div className="mt-24 md:mt-32" />

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              className="hud-scan pointer-events-auto w-[min(92vw,980px)] max-w-full overflow-hidden rounded-2xl border border-cyan-400/60 bg-slate-950/80 shadow-[0_0_60px_rgba(0,255,255,0.35)]"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
            >
              <div className="relative flex items-center justify-between border-b border-cyan-400/40 bg-slate-900/60 px-5 py-3">
                <h3 className="text-cyan-200 font-semibold tracking-wide">
                  ACADEMIC DOSSIER — {open.label}
                </h3>
                <button
                  onClick={() => setOpen(null)}
                  className="rounded-md border border-cyan-400/40 bg-cyan-400/10 px-2 py-1 text-cyan-200 hover:bg-cyan-400/20"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[72vh] overflow-y-auto px-5 py-4">
                <div className="grid gap-5 md:grid-cols-2">
                  <InfoSection title="Credentials" items={open.credentials} />
                  {open.highlights && (
                    <InfoSection title="Highlights" items={open.highlights} />
                  )}
                </div>

                {open.courses && (
                  <div className="mt-6">
                    <button
                      onClick={() => setCoursesOpen(true)}
                      className="inline-flex items-center gap-2 rounded-md border border-cyan-400/50 bg-cyan-400/10 px-3 py-2 text-cyan-200 hover:bg-cyan-400/20"
                      aria-haspopup="dialog"
                    >
                      Courses
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && open.courses && coursesOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCoursesOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              className="hud-scan pointer-events-auto w-[min(92vw,900px)] max-w-full overflow-hidden rounded-2xl border border-cyan-400/60 bg-slate-950/85 shadow-[0_0_60px_rgba(0,255,255,0.35)]"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative flex items-center justify-between border-b border-cyan-400/40 bg-slate-900/60 px-5 py-3">
                <h3 className="text-cyan-200 font-semibold tracking-wide">
                  Courses — {open.label}
                </h3>
                <button
                  onClick={() => setCoursesOpen(false)}
                  className="rounded-md border border-cyan-400/40 bg-cyan-400/10 px-2 py-1 text-cyan-200 hover:bg-cyan-400/20"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[72vh] overflow-y-auto px-5 py-4 grid gap-5 md:grid-cols-2">
                {renderCourseBuckets(open.courses)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function InfoSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-cyan-400/40 bg-slate-900/40 p-4">
      <div className="mb-2 text-cyan-300 font-semibold">{title}</div>
      <ul className="space-y-1.5 text-sm leading-snug text-teal-100/90">
        {items.map((t, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[7px] h-[6px] w-[6px] rounded-full bg-cyan-400/70" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function renderCourseBuckets(b?: CourseBuckets) {
  if (!b) return null;
  const sections: Array<[string, string[] | undefined]> = [
    ["Programming", b.programming ?? []],
    ["Foundations", b.foundations ?? []],
    ["Computing Core", b.core ?? []],
    ["Mathematics", b.math ?? []],
    ["Computer Science", b.cs ?? []],
    ["Finance", b.finance ?? []],
    ["Analytics & Insights", b.analytics ?? []],
    ["Modeling & ML", b.ml ?? []],
    ["Electives", b.electives ?? []],
    ["Other / Supporting", b.other ?? []],
    ["Capstone", b.capstone ?? []],
  ];
  return sections
    .filter(([, arr]) => arr && arr.length)
    .map(([label, arr]) => (
      <div
        key={label}
        className="rounded-xl border border-cyan-400/40 bg-slate-900/40 p-4"
      >
        <div className="mb-2 text-cyan-300 font-semibold">{label}</div>
        <ul className="space-y-1.5 text-sm leading-snug text-teal-100/90">
          {arr!.map((t, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-[7px] h-[6px] w-[6px] rounded-full bg-cyan-400/70" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    ));
}

