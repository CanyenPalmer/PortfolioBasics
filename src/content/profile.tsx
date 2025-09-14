// src/content/profile.tsx
import * as React from "react";

/**
 * AUTO-GENERATED from current portfolio site.
 * Contains EXACT text/content from your existing About, Experience, Projects, and Testimonials.
 * No wording or formatting changes were made, except:
 *  - Added `education` section migrated from your old portfolio.
 */

export const profile = {
  hero: {
    headline: "Canyen Palmer",
    subheadline:
      "Data Scientist & Google Certified Data Analytics Professional",
    typer: "Specializing in statistics, machine learning, predictive modeling, and optimization.",
  },

  about: {
    poses: [
      {
        id: 1,
        key: "power",
        title: "Welcome to my About Me section!",
        img: "/about/pose-1-power.webp",
        alt: "Canyen in a confident power pose with neon seam accents",
        body: (
          <div className="space-y-4">
            <p>
              My name is <strong>Canyen Palmer</strong> and I am a{" "}
              <strong>Data Scientist & Google Certified Data Analytics Professional</strong>{" "}
              specializing in statistics, machine learning, optimization, predictive modeling, and
              visualization. Currently pursuing my <strong>Master’s in Data Science</strong> at the
              University of Pittsburgh, I focus on turning raw data into actionable insights that
              drive decision-making, efficiency, and business outcomes.
            </p>
            <div className="space-y-2">
              <p className="font-semibold text-cyan-300/90">🛠️ Core Proficiency</p>
              <ul className="list-disc pl-6">
                <li>
                  <strong>Languages:</strong> Python, SQL, R, TypeScript, JavaScript
                </li>
                <li>
                  <strong>Libraries:</strong> pandas, NumPy, scikit-learn, Matplotlib, seaborn,
                  statsmodels, Tidyverse
                </li>
                <li>
                  <strong>Visualization:</strong> Tableau, Excel, Google Sheets
                </li>
                <li>
                  <strong>Frameworks & Tools:</strong> Flask, React, TailwindCSS, GitHub, Jupyter,
                  VS Code, Quarto
                </li>
              </ul>
            </div>
            <p className="text-white/70">
              Continue reading to learn Canyen's story.
            </p>
          </div>
        ),
      },
      {
        id: 2,
        key: "golf",
        title: "Discovering Analytics",
        img: "/about/pose-2-golf.webp",
        alt: "Canyen mid golf swing with a neon trail arc",
        body: (
          <div className="space-y-4">
            <p>
              After being offered the opportunity to play golf and continue my academic studies at{" "}
              <strong>Franklin College</strong>, I dedicated myself to finding measurable edges
              through analytics—refining techniques, improving consistency, and identifying where I
              could cut strokes and lower my scoring average.
            </p>
            <p>
              What many saw as a suffocating amount of research became my greatest strength, both on
              the course and in my personal development. When health challenges arrived, I faced a
              hard choice: protect my body’s long-term health or pursue a career in golf. That
              turning point led me to redirect my academic path—transferring to{" "}
              <strong>Ball State University</strong> to study <strong>mathematics</strong> and{" "}
              <strong>computer science</strong>.
            </p>
          </div>
        ),
      },
      {
        id: 3,
        key: "terminal",
        title: "Composing Research",
        img: "/about/pose-3-terminal.webp",
        alt: "Canyen at a massive cyberpunk terminal cluster with many glowing monitors",
        body: (
          <div className="space-y-4">
            <p>
              At <strong>Ball State University</strong>, I gathered an enormous amount of data from
              many sources—educational material through assignments and lectures, professional
              insights from career fairs, and collaboration with peers that sharpened communication,
              teamwork, and leadership.
            </p>
            <p>
              Every experience became a{" "}
              <strong>data entry in my personal library of datasets</strong>: subjects, courses, and
              topics forming unique entries in a growing knowledge repository. I learned to write my
              own “queries” across disciplines—connecting concepts and building an analytical
              framework I still use today.
            </p>
            <p>
              I pushed beyond the classroom by pursuing certifications in data analysis and data
              science, building real projects, and continuously expanding the scope and depth of that
              knowledge base.
            </p>
          </div>
        ),
      },
      {
        id: 4,
        key: "hospital",
        title: "Down, But Not Out",
        img: "/about/pose-4-hospital.webp",
        alt: "Canyen in a healthcare environment analyzing charts",
        body: (
          <div className="space-y-4">
            <p>
              In <strong>2023</strong>, I underwent a double foot operation that changed my
              life—surgery was required to relieve nerve stress and prevent paralysis. During
              recovery, academics became my anchor.
            </p>
            <p>
              That summer, I earned placement on the <strong>Dean’s List</strong> at Ball State
              while continuing to build projects, resumé materials, and my personal brand— all while
              learning to walk again.
            </p>
            <p>
              I once thought the hardest part would be landing a fair-paying job. Instead, the
              hardest part was putting on my socks after surgery—and choosing to keep moving
              forward.
            </p>
          </div>
        ),
      },
      {
        id: 5,
        key: "vision",
        title: "The Future",
        img: "/about/pose-5-vision.webp",
        alt: "Canyen looking into a neon horizon with futuristic overlays",
        body: (
          <div className="space-y-4">
            <p>
              After graduation, I explored what the world could offer me—and what I could offer
              myself. I gained real-world experience at an overnight manufacturing facility and a{" "}
              <strong>DME</strong> startup, while continuing freelance analytics for companies,
              peers, and family. That’s where I learned what it truly means to put passion into
              work.
            </p>
            <p>
              Today, I’m pursuing my <strong>Master’s in Data Science</strong> at the{" "}
              <strong>University of Pittsburgh</strong>, focused on giving communities access to
              insights that can change everyday lives. In a world of rising costs, I believe we can
              harness data science, machine learning, analytics, and software development to make
              life better for all.
            </p>
            <p>
              I am currently <strong>open to work</strong> and want to collaborate with companies
              who share this vision. If your mission is to build solutions that improve people’s
              lives, I’d love to connect and talk more.
            </p>
          </div>
        ),
      },
    ],
  },

  /* ===== NEW: EDUCATION (migrated from old portfolio) ===== */
  education: [
    {
      school: "Greenfield-Central High School",
      degree: "Academic & Technical Honors Diplomas",
      dates: "2015 – 2019",
      bullets: [
        "Academic Honors Diploma",
        "Technical Honors Diploma",
        "Project Lead The Way (PLTW) — Completed",
        "2× Men’s Varsity Golf; 4× Men’s Varsity Golf Medalist",
        "Franklin College 2019 Academic Scholarship Student & Men’s Golf Athlete",
        "NineStar Connect Scholarship Student",
      ],
    },
    {
      school: "Ball State University",
      degree: "B.G.S. – Mathematics; A.A. – Computer Science",
      dates: "2020 – 2024",
      bullets: [
        "Dean’s List (Summer 2023)",
        "Launched Palmer Projects — Freelance Data Services",
      ],
      details: [
        "Mathematics: MATH 113 (Precalculus Algebra), MATH 114 (Precalculus Trigonometry), MATH 125 (Mathematics Applications), MATH 165 (Calculus I), MATH 166 (Calculus II), MATH 215 (Discrete Systems), MATH 267 (Calculus III), MATH 320 (Probability), MATH 321 (Mathematical Statistics)",
        "Computer Science: CS 120 (Programming Fundamentals), CS 121 (Data Structures & OOP), CS 224 (Algorithms), CS 230 (Computer Organization & Architecture)",
        "Other: BA 205 (Foundations of Business Analytics), ISOM 125 (Intro to Business Computer Applications), PHYC 100 (Conceptual Physics), GCM 184 (Graphics | Computer Applications), CT 100 (Future Technology Innovations), FIN 101 & 110 (Personal Finance), IMM 140 (CyberSecurity — Franklin College), LA 103 (Quantitative Reasoning — Franklin College)",
      ],
    },
    {
      school: "Google Advanced Data Analytics",
      degree: "Professional Certificate",
      dates: "2025",
      bullets: [
        "Awarded July 2025 (Google)",
        "Python programming; SQL repositories/workflows; Tableau data visualization",
        "Capstone: Logistic Regression & Tree-Based ML (see Projects)",
      ],
      details: [
        "Foundations: Foundations of Data Science; Get Started with Python",
        "Analytics: Go Beyond the Numbers: Translate Data into Insights; The Power of Statistics",
        "Machine Learning: Regression Analysis: Simplify Complex Data Relationships; The Nuts and Bolts of Machine Learning",
        "Capstone: Google Advanced Data Analytics Capstone",
      ],
    },
    {
      school: "University of Pittsburgh",
      degree: "Master of Data Science (M.D.S.)",
      dates: "2025 – Present",
      bullets: [
        "Master of Data Science — M.D.S.",
      ],
      details: [
        "Programming: CMPINF 2100 — Data-Centric Computing",
        "Foundations: CMPINF 2105 — Mathematical & Statistical Foundations for Data Science; CMPINF 2140 — Responsible Data Science",
        "Core: CMPINF 2110 — Managing, Querying, and Preserving Data; CMPINF 2120 — Applied Predictive Modeling; CMPINF 2130 — The Art of Data Visualization",
        "Electives: CMPINF 2211 — Foundations of Cloud Computing for Data Science Professionals; CMPINF 2221 — Applied Bayesian Data Analysis; CMPINF 2223 — LLMs and Their Applications",
        "Capstone: CMPINF 2910 — Case Studies in Data Science",
      ],
    },
  ],

  experience: [
    {
      id: "lead_analyst",
      title: "Lead Analyst",
      company: "Iconic Care Inc.",
      location: "Indianapolis, Indiana",
      dates: "June 2025 – Aug 2025",
      context: "Internal analytics & custom ML models for data insights.",
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
            "Discovered $20,000 in transferable funds through one subset of CGM patient responsibility alone.",
          ],
        },
        {
          name: "CalendarExtractor",
          details: [
            "Python model that extracts specific information from Google Calendar entries across any period, exporting mined data to CSV for further testing.",
            "Saves 12+ hours/week per sales rep by automating recurring schedule analytics.",
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
      context: "Billing operations & analytics: dashboards, denials, reimbursement.",
      tech: ["Python", "Excel", "Google Sheets/Docs", "Brightree"],
      skills: ["Analytics", "Project Management", "System Testing", "Medical Billing", "Databases"],
      highlights: [
        "Optimized Payor Level Dashboards, Billing Cycle Processes, Patient Information Checklist, HCPCS Code Validations, Cost/Reimbursement Data, and Brightree Consignment to be interpreted throughout all departments of Iconic Care Inc.",
        "Expressed analytical insights throughout a multitude of departments while maintaining the confidentiality of crucial company metrics.",
        "Created denial tracking and prevention dashboards to increase success rates.",
        "Constructed Iconic Care's first-ever balance sheet for tracking all crucial financial metrics.",
      ],
    },
  ],

  projects: [
    {
      title: "CGM Patient Analytics",
      tech: ["Python", "Pandas", "SQLite", "Excel", "Jupyter"],
      packages: ["pandas", "numpy", "sqlite3", "openpyxl"],
      points: [
        "End-to-end data pipeline and model to analyze CGM patient responsibility.",
        "CSV ingestion → data cleaning/feature engineering → summary outputs.",
      ],
      details: {
        datasets: [
          "CGM billing CSV(s) for Durable Medical Equipment (DME).",
          "Patient responsibility columns (by payor), equipment types, claim history.",
        ],
        methods: [
          "Data wrangling in pandas, validation against payor-level rules (HCPCS).",
          "Aggregation by provider/patient to find unpaid responsibility pockets.",
        ],
        results: ["Identified $317,000 in unpaid balances across claims."],
        visuals: [
          "Excel and Google Sheets dashboards for department-wide interpretation.",
          "Segmented views by payor, equipment, and timeframe.",
        ],
        nextSteps: [
          "Add a reconciler to confirm closed balances with accounting.",
          "Expand to recurring cron-based pipeline.",
        ],
      },
      links: [{ label: "GitHub", href: "https://github.com/CanyenPalmer" }],
    },
    {
      title: "Logistic Regression & Tree-Based ML",
      tech: ["Python", "scikit-learn", "pandas", "numpy", "matplotlib"],
      packages: ["scikit-learn", "pandas", "numpy", "matplotlib"],
      points: [
        "Built logistic regression and tree-based models for binary classification.",
        "Compared ROC-AUC, precision/recall; tuned hyperparameters.",
      ],
      details: {
        datasets: ["Structured CSVs with labeled outcomes."],
        methods: ["Train/test split, cross-validation, scaling, feature selection."],
        results: ["Best AUC ~0.938; model selection based on business costs/benefits."],
        visuals: ["ROC and precision-recall curves; confusion matrices."],
        nextSteps: ["Pipeline into API; add SHAP for interpretability."],
      },
      links: [{ label: "GitHub", href: "https://github.com/CanyenPalmer" }],
    },
    {
      title: "Real Estate Conditions Comparison (R)",
      tech: ["R", "Tidyverse", "ggplot2", "glm"],
      packages: ["tidyverse", "ggplot2", "broom"],
      points: [
        "Built generalized linear models to compare real estate market conditions.",
        "Used GLM with RMSE to evaluate fit and predictive error.",
      ],
      details: {
        datasets: ["County-level series with housing indicators."],
        methods: ["GLM fitting, diagnostics, residual analysis."],
        results: ["RMSE compared across candidate GLMs; recommended parsimonious model."],
        visuals: ["Facet plots with ggplot2; residual diagnostics."],
        nextSteps: ["Incorporate macro features; rolling window retraining."],
      },
      links: [{ label: "GitHub", href: "https://github.com/CanyenPalmer" }],
    },
    {
      title: "PortfolioBasics (This Site)",
      tech: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
      packages: ["next", "react", "framer-motion", "tailwindcss"],
      points: [
        "Neon VSCode aesthetic with animated sections.",
        "Refactor to centralized content for maintainability.",
      ],
      details: {
        datasets: [],
        methods: ["Component composition, content-layer refactor."],
        results: ["Faster edits via single source of truth; reduced duplication."],
        visuals: ["Glass panels, animated tabs, neon chips glow."],
        nextSteps: ["Avatar parallax; dynamic content hooks."],
      },
      links: [{ label: "GitHub", href: "https://github.com/CanyenPalmer" }],
    },
    {
      title: "Python 101",
      tech: ["Python", "Pandas", "Jupyter"],
      packages: ["pandas", "numpy", "matplotlib"],
      points: [
        "Beginner-friendly Python notebooks introducing data analysis workflows.",
        "Covers data loading, cleaning, visualization, and simple modeling.",
      ],
      details: {
        datasets: ["Small CSV practice datasets."],
        methods: ["Notebook-driven learning with executable examples."],
        results: ["Students can reproduce common data tasks and basic EDA."],
        visuals: ["Inline Matplotlib figures; table previews."],
        nextSteps: ["Add exercises and auto-grading with nbgrader."],
      },
      links: [{ label: "GitHub", href: "https://github.com/CanyenPalmer" }],
    },
    {
      title: "MyCaddy — Physics Shot Calculator",
      tech: ["React", "TypeScript", "Python (Flask)", "SQLite"],
      packages: ["react", "typescript", "flask", "sqlite3"],
      points: [
        "Custom golf yardage-book generator and strategy tool.",
        "Physics-based shot calculator (wind, temp, lie) with mobile-first UI.",
      ],
      details: {
        datasets: ["User-entered round data; simulator/launch monitor metrics."],
        methods: ["Domain rules + physics formulas driving shot outcomes."],
        results: ["More consistent strategy and club selection on-course."],
        visuals: ["Clean mobile UI for quick decisions; charts for shot dispersion."],
        nextSteps: ["Integrate wearable data; add caddie recommendations."],
      },
      links: [{ label: "GitHub", href: "https://github.com/CanyenPalmer" }],
    },
  ],

  testimonials: [
    {
      app: "MyCaddy",
      quote:
        "MyCaddy was super impressive when we used it, I was surprised by the results. Not only was it accurate with what we put in, but it was able to work in areas that we were not getting very good service.",
      name: "C. Smith",
      role: "Amateur Golfer",
      before: [
        "Needed a way to understand shot strategy when conditions varied rapidly (wind, lie, temp).",
        "Wanted faster, clearer club selection without second-guessing.",
      ],
      after: [
        "MyCaddy gave accurate numbers in poor service areas.",
        "Strategy felt confident and consistent; fewer wasted strokes.",
      ],
    },
    {
      app: "Best Bet NFL",
      quote:
        "I always figured betting was rigged in the way they advertise their predictions. Thanks to this app, I am able to get a better idea of how likely the bet is to hit in reality.",
      name: "G. Waterman",
      role: "Football Enthusiast",
      before: [
        "Frustrated with skewed 'odds' and marketing-driven picks.",
        "Wanted true probability of a bet hitting without unneeded factors.",
      ],
      after: [
        "App for player bets, team vs team, and parlay bets that doesn’t 'juice' numbers.",
        "Probabilities based on past experiences, NFL averages, team ratings, and more.",
        "Calculates probability independent of +/- and wager odds, while still showing wager amounts.",
        "Includes a fallback calculation for rookies with limited starts.",
      ],
    },
  ],

  contact: {
    email: "Canyen2019@gmail.com",
  },
} as const;
