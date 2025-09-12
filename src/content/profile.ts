// Single source of truth for your portfolio content.
// Paste your original portfolio's text into the TODO sections below.

export const profile = {
  hero: {
    // TODO: paste your exact name or title line
    headline: "Canyen Palmer",
    // TODO: paste your exact subheadline/tagline
    subheadline: "Data Scientist & Google-Certified Data Analytics Professional",
    // TODO: paste the hero typing line (the one you used before)
    typer: "Turning data into decisions through science, code, and storytelling.",
  },

  about: {
    // High-level lead sentence (keep original wording)
    // TODO: paste from old portfolio
    lead:
      "I specialize in statistics, machine learning, predictive modeling, optimization, and visualization.",

    // Body paragraphs in order (paste verbatim from old site)
    // TODO: paste from old portfolio
    body: [
      "I’m currently pursuing my Master’s in Data Science at the University of Pittsburgh. I focus on turning raw data into actionable insights that drive decision-making, efficiency, and outcomes.",
      "Tooling comfort: Python, SQL, R, and modern viz stacks. Libraries you’ll often see in my repos include pandas, NumPy, scikit-learn, Matplotlib/seaborn, statsmodels, and the Tidyverse for R.",
      "I care about delivery as much as modeling — clean data pipelines, reproducible notebooks, and dashboards that non-technical stakeholders can actually use."
    ],

    // Images under /public/about/* — keep the same files you used previously
    // Remove entries that don’t exist yet; order them as you want them to appear.
    images: [
      "/about/pose-1.webp",
      "/about/pose-2.webp",
      "/about/pose-3.webp",
      "/about/pose-4.webp",
    ],
  },

  education: [
    // Map each school exactly as in your old Education section
    {
      school: "Greenfield-Central High School",
      degree: "Academic & Technical Honors Diplomas",
      range: "2015 — 2019",
      details: [
        "Project Lead The Way (PLTW) — Completed",
        "2× Men’s Varsity Golf; 4× Medalist; Franklin College Academic Scholarship Student & Men’s Golf Athlete; NineStar Connect Scholarship Student",
      ],
      badges: ["AP/Honors", "PLTW", "STEM"],
    },
    {
      school: "Ball State University",
      degree: "B.G.S. — Mathematics; A.A. — Computer Science",
      range: "2020 — 2024",
      details: ["Dean’s List (Summer 2023). Launched Palmer Projects — Freelance Data Services."],
      coursework: [
        { code: "MATH", name: "Precalculus, Boolean Algebra, Stats, Calculus I/II" },
        { code: "CS", name: "CS I (Fundamentals), CS II (DS & OOP), Algorithms, Computer Org & Arch" },
        { code: "BA/ISOM", name: "Business Analytics, Business Apps" },
      ],
      badges: ["Mathematics", "Computer Science"],
    },
    {
      school: "University of Pittsburgh",
      degree: "M.S. in Data Science",
      range: "2025 — Present",
      details: ["Master of Data Science — M.D.S."],
      coursework: [
        { code: "CMPINF 2100", name: "Data-Centric Computing" },
        { code: "Foundations", name: "Foundations of Data Science" },
        { code: "Analytics", name: "Translate Data into Insights, The Power of Statistics" },
        { code: "ML", name: "Regression Analysis; Nuts & Bolts of ML" },
      ],
      badges: ["Python", "SQL", "Machine Learning", "Visualization", "Jupyter"],
    },
    {
      school: "Google Advanced Data Analytics",
      degree: "Professional Certificate (Capstone Included)",
      range: "",
      details: ["Regression Analysis; ML fundamentals; Advanced capstone."],
      badges: ["Advanced Analytics", "Capstone"],
    },
  ],

  experience: [
    // TODO: paste your exact roles/bullets from old portfolio
    {
      title: "Data Scientist",
      range: "2021 — Present",
      bullets: ["Shipped predictive models and analytics workflows end-to-end."],
      metric: { value: "$317k", label: "unpaid identified (CGM project)" },
    },
    {
      title: "Machine Learning Intern",
      range: "2020 — 2021",
      bullets: ["Prototyped feature stores & model monitoring."],
      metric: { value: "250k+", label: "rows analyzed" },
    },
    {
      title: "Research Assistant",
      org: "University setting",
      bullets: ["Quant methods; reproducible pipelines."],
      metric: { value: "5×", label: "deployment speedup" },
    },
  ],

  projects: [
    // Keep titles/summaries/links/tech exactly as in old site
    {
      title: "CGM Patient Analytics",
      summary:
        "15k invoice rows → 244 CGM rows. Engineered ‘Patient Responsibility’ metric; normalized messy exports; CSV → Excel pivots for ops stakeholders.",
      details: [
        "Aligned operations with predictive alerts and reconciled invoice exports.",
        "Data wrangling: pandas, NumPy; Visualization: Matplotlib/Plotly; Delivery: Excel pivots for non-technical teams.",
      ],
      impact: "$317k unpaid identified",
      tags: ["Python", "pandas", "NumPy", "Matplotlib", "Plotly", "Excel"],
      href: "https://github.com/CanyenPalmer/CGM-Patient-Analytics",
    },
    {
      title: "MyCaddy — Physics Shot Calculator",
      summary:
        "Physics-based adjusted carry distance (lie, wind, temp, weather). Modular core; Flask app + local script.",
      details: [
        "Inputs: environmental + lie; Outputs: adjusted carry/club recommendations.",
        "Unit-tested core; simple Flask UI.",
      ],
      tags: ["Python", "Flask", "NumPy"],
      href: "https://github.com/CanyenPalmer/MyCaddy",
    },
    // TODO: add any other projects from the old portfolio
  ],

  testimonials: [
    // TODO: paste your real quotes if you had them in the old repo
    { app: "MyCaddy", quote: "Helped me commit to a shot when I was unsure. We’ll definitely use this again.", name: "User Feedback" },
    { app: "CGM Patient Tracker", quote: "Surfaced unpaid claims by aligning operations with predictive alerts.", name: "Ops Lead" },
  ],

  contact: {
    email: "canyen2019@gmail.com",
  },
};
