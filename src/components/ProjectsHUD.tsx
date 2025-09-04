"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";

type Project = {
  id: string;
  title: string;
  techStack: string[];
  packages: string[];
  brief: string[];
  details: {
    dataset?: string[];
    methods?: string[];
    results?: string[];
    visuals?: string[];
    nextSteps?: string[];
  };
  links: { github: string; demo?: string };
};

const PROJECTS: Project[] = [
  {
    id: "cgm",
    title: "CGM Patient Analytics",
    techStack: ["Python", "Excel"],
    packages: ["pandas", "numpy", "matplotlib", "plotly", "openpyxl"],
    brief: [
      "Dataset: 15k invoice rows → 244 CGM rows",
      "Engineered 'Patient Responsibility' metric",
      "Automated CSV → Excel pivots",
      "Impact: $317k unpaid identified",
    ],
    details: {
      dataset: ["15,000 rows × 25 columns → 244 CGM patient rows"],
      methods: [
        "Feature engineering: Responsibility = Allow − Payments",
        "Normalize messy exports; write structured CSV",
        "Excel pivots for non-technical stakeholders",
      ],
      results: [
        "Unpaid ≈ $317k; post-billing owed ≈ $245k (~44%)",
        "Effective payment ratio ~56/100; risk > $200k",
      ],
      nextSteps: [
        "Payment likelihood modeling & outlier triage",
        "Recurring-balance detection across timeline",
      ],
    },
    links: { github: "https://github.com/CanyenPalmer/CGM-Patient-Analytics" },
  },
  {
    id: "salifort-attrition",
    title: "Logistic Regression & Tree-Based ML",
    techStack: ["Python"],
    packages: ["scikit-learn", "pandas", "numpy", "matplotlib", "seaborn"],
    brief: [
      "Dataset: 15,000 × 10 (Kaggle HR)",
      "LR: Acc 83% | Prec 80% | Rec 83%",
      "Tree/Ensemble: AUC 93.8% | Acc 96.2%",
      "Signals: overtime, tenure, promotions",
    ],
    details: {
      dataset: ["15,000 employee records, 10 features"],
      methods: [
        "Stratified split; fixed random_state",
        "Models: LR, Decision Tree, Random Forest",
        "Confusion matrix, ROC/AUC, GridSearch hooks",
      ],
      results: [
        "LR: Acc 83% | Prec 80% | Rec 83%",
        "Tree: AUC 93.8% | Acc 96.2% (RF modestly higher)",
        "Overwork & promotion cadence drive attrition",
      ],
      visuals: ["Confusion Matrix", "Feature Importance", "Correlation Heatmap"],
      nextSteps: [
        "Leakage check: remove last_evaluation",
        "K-Means profiles for segmentation",
      ],
    },
    links: {
      github:
        "https://github.com/CanyenPalmer/Logistic-Regression-and-Tree-based-Machine-Learning",
    },
  },
  {
    id: "real-estate-r",
    title: "Real Estate Conditions Comparison (R)",
    techStack: ["R"],
    packages: ["tidyverse (dplyr, ggplot2)", "yardstick", "glm"],
    brief: [
      "Ames housing: ~2.3k homes · 60+ features",
      "GLM on log(price) → lower RMSE",
      "Drivers: structural & sale conditions",
    ],
    details: {
      dataset: ["Ames housing (~2,300 rows, 60+ features)"],
      methods: [
        "Log-transform target; GLM variants",
        "Residual diagnostics; yardstick::rmse_vec",
      ],
      results: [
        "Log-price model outperformed raw on RMSE",
        "Condition & sale_condition materially shift price",
      ],
      visuals: [
        "Price Distribution (raw vs log)",
        "Residuals Plot",
        "Condition vs Price Boxplots",
      ],
    },
    links: {
      github:
        "https://github.com/CanyenPalmer/R-Coding---Real-estate-Conditions-Comparison",
    },
  },
  {
    id: "portfolio",
    title: "PortfolioBasics (This Site)",
    techStack: ["Next.js", "TypeScript"], // fixed wording
    packages: ["React", "TailwindCSS", "Framer Motion"],
    brief: [
      "100% from-scratch; no template",
      "Hero: hologram headshot + name explode",
      "Services: neon skyline & billboards",
      "Experience: VS Code-style editor",
    ],
    details: {
      methods: [
        "Custom Framer Motion animations",
        "Modular sections for scale & reuse",
      ],
      visuals: ["Hologram Headshot", "NameCodeExplode", "Services Cityscape"],
    },
    links: { github: "https://github.com/CanyenPalmer/PortfolioBasics" },
  },
  {
    id: "python-101",
    title: "Python 101",
    techStack: ["Python"],
    packages: ["random", "Python stdlib"],
    brief: [
      "Fundamentals: I/O, control flow, arithmetic",
      "Division handling, area calc, RNG (1–1,000,000)",
      "Clear outputs with f-strings",
    ],
    details: {
      methods: [
        "Pedagogical notebook with sequential exercises",
        "Error handling & formatted output",
      ],
      visuals: ["Notebook snippets & outputs"],
    },
    links: { github: "https://github.com/CanyenPalmer/Python-101" },
  },
  {
    id: "mycaddy",
    title: "MyCaddy — Physics Shot Calculator",
    techStack: ["Python"], // fixed wording
    packages: ["Flask", "gunicorn", "Jinja2", "numpy"],
    brief: [
      "Physics-based adjusted carry distance",
      "Inputs: lie, wind, temp, weather",
      "Web + local script; community-first",
    ],
    details: {
      methods: [
        "Modular physics core (my_caddy_core.py)",
        "Flask UI for input → adjusted yardage",
      ],
      results: ["On-course decision support beyond flat charts"],
      visuals: ["Web Form → Result", "Core Physics Snippet"],
    },
    links: { github: "https://github.com/CanyenPalmer/MyCaddy" },
  },
];

function Section({ title, items }: { title: string; items: string[] }) {
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

function Card({
  p,
  i,
  onOpen,
}: {
  p: Project;
  i: number;
  onOpen: (p: Project) => void;
}) {
  return (
    <motion.button
      onClick={() => onOpen(p)}
      className="group relative overflow-hidden rounded-2xl border border-cyan-400/50 bg-slate-900/40 p-4 text-left shadow-[0_0_24px_rgba(0,255,255,0.18)] hover:shadow-[0_0_36px_rgba(0,255,255,0.35)] transition-shadow hud-scan"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.45, delay: 0.05 * i, ease: "easeOut" }}
    >
      <h3 className="text-lg md:text-xl font-semibold tracking-wide text-cyan-200">
        {p.title}
      </h3>

      <div className="mt-2 text-xs md:text-sm text-cyan-300/90">
        <div className="font-semibold">Tech stack:</div>
        <div className="opacity-90">{p.techStack.join(", ")}</div>
        <div className="mt-1 font-semibold">Packages:</div>
        <div className="opacity-90">{p.packages.join(", ")}</div>
      </div>

      <ul className="mt-3 space-y-1.5 text-[12.5px] md:text-sm text-teal-100/90">
        {p.brief.map((line, idx) => (
          <li key={idx} className="flex gap-2">
            <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-cyan-400/70" />
            <span className="leading-snug">{line}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex gap-3">
        <span className="rounded-md border border-cyan-400/50 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-200">
          VIEW BRIEFING
        </span>
      </div>
    </motion.button>
  );
}

export default function ProjectsHUD() {
  const [open, setOpen] = useState<Project | null>(null);
  const grid = useMemo(() => PROJECTS, []);
  const onOpen = (p: Project) => setOpen(p);
  const onClose = () => setOpen(null);

  return (
    <section id="projects" className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
      <div className="mb-8 md:mb-12">
        <h2 className="text-center text-3xl md:text-4xl font-semibold tracking-[0.2em] text-cyan-300">
          MY PROJECTS
        </h2>
        <p className="mt-3 text-center text-cyan-200/70">
          Tap a panel to open the full dossier.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {grid.map((p, i) => (
          <Card key={p.id} p={p} i={i} onOpen={onOpen} />
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              className="hud-scan fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                         w-[min(92vw,980px)] max-w-full
                         overflow-hidden rounded-2xl border border-cyan-400/60 bg-slate-950/80 shadow-[0_0_60px_rgba(0,255,255,0.35)]"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative flex items-center justify-between border-b border-cyan-400/40 bg-slate-900/60 px-5 py-3">
                <h3 className="text-cyan-200 font-semibold tracking-wide">
                  PROJECT DOSSIER — {open.title}
                </h3>
                <button
                  onClick={onClose}
                  className="rounded-md border border-cyan-400/40 bg-cyan-400/10 p-1.5 text-cyan-200 hover:bg-cyan-400/20"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[72vh] overflow-y-auto px-5 py-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-cyan-300 font-semibold">Tech stack</div>
                    <div className="text-cyan-200/90">{open.techStack.join(", ")}</div>
                  </div>
                  <div>
                    <div className="text-cyan-300 font-semibold">Packages</div>
                    <div className="text-cyan-200/90">{open.packages.join(", ")}</div>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {open.details.dataset && (
                    <Section title="Dataset / Scale" items={open.details.dataset} />
                  )}
                  {open.details.methods && (
                    <Section title="Methods & Modeling" items={open.details.methods} />
                  )}
                  {open.details.results && (
                    <Section title="Results & Impact" items={open.details.results} />
                  )}
                  {open.details.visuals && (
                    <Section title="Visuals" items={open.details.visuals} />
                  )}
                  {open.details.nextSteps && (
                    <Section title="Next Steps" items={open.details.nextSteps} />
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={open.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-cyan-400/50 bg-cyan-400/10 px-3 py-2 text-cyan-200 hover:bg-cyan-400/20"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                  {open.links.demo && (
                    <a
                      href={open.links.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-fuchsia-400/50 bg-fuchsia-400/10 px-3 py-2 text-fuchsia-200 hover:bg-fuchsia-400/20"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
