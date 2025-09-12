// src/content/profile.ts
// Unified content source for the portfolio

export const profile = {
  hero: {
    headline: "Canyen Palmer",
    subheadline: "Data Scientist & Google-Certified Data Analytics Professional",
    typer: "Turning data into decisions through science, code, and storytelling.",
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
                <li><strong>Languages:</strong> Python, SQL, R, TypeScript, JavaScript</li>
                <li><strong>Libraries:</strong> pandas, NumPy, scikit-learn, Matplotlib, seaborn,
                  statsmodels, Tidyverse</li>
                <li><strong>Visualization:</strong> Tableau, Excel, Google Sheets</li>
                <li><strong>Frameworks & Tools:</strong> Flask, React, TailwindCSS, GitHub, Jupyter,
                  VS Code, Quarto</li>
              </ul>
            </div>
            <p className="text-white/70">
              Use the arrows or glowing nodes below to explore each chapter of my story.
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
              After being offered the opportunity to play golf and continue my education at{" "}
              <strong>Franklin College</strong>, I decided to take both my education and my game to
              the next level. I realized the quickest way to achieve rapid improvement was to
              conduct <strong>thorough analysis</strong> of my performance—identifying where I could
              cut strokes and lower my scoring average.
            </p>
            <p>
              What many saw as a suffocating amount of research became my{" "}
              <strong>greatest strength</strong>, both on the course and in my personal development.
              When health challenges arrived, I faced a hard choice: protect my body’s long-term
              health or pursue a career in golf. That turning point led me to redirect my academic
              path—transferring to <strong>Ball State University</strong> to study{" "}
              <strong>mathematics</strong> and <strong>computer science</strong>.
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
              framework I still use to this day.
            </p>
          </div>
        ),
      },
      {
        id: 4,
        key: "hospital",
        title: "Real-World Applications",
        img: "/about/pose-4-hospital.webp",
        alt: "Canyen in a healthcare environment analyzing charts",
        body: (
          <div className="space-y-4">
            <p>
              Working at <strong>Iconic Care Inc.</strong> allowed me to directly apply my skills in
              healthcare analytics. I built tools that improved billing accuracy, identified unpaid
              balances, and streamlined workflows.
            </p>
            <p>
              These projects demonstrated the tangible value of combining{" "}
              <strong>machine learning with domain knowledge</strong>, ultimately improving both
              operational efficiency and financial outcomes.
            </p>
          </div>
        ),
      },
      {
        id: 5,
        key: "vision",
        title: "Vision Ahead",
        img: "/about/pose-5-vision.webp",
        alt: "Canyen looking into a neon horizon with futuristic overlays",
        body: (
          <div className="space-y-4">
            <p>
              Looking forward, I aim to leverage <strong>advanced analytics, machine learning, and
              domain expertise</strong> to solve problems across industries. Whether it’s improving
              healthcare systems, optimizing operations, or developing predictive models, I want my
              work to have a direct, positive impact.
            </p>
          </div>
        ),
      },
    ],
  },

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
      context: "Billing operations & analytics: dashboards, denials, reimbursement.",
      tech: ["Python", "Excel", "Google Sheets/Docs", "Brightree"],
      skills: ["Analytics", "Project Management", "System Testing", "Medical Billing", "Databases"],
      highlights: [
        "Optimized Payor Level Dashboards, Billing Cycle Processes, Patient Information Checklist, HPCPS Code Validations, Cost/Reimbursement Data, and BrightTree Consignment to be interpreted throughout all departments of Iconic Care Inc.",
        "Expressed analytical insights throughout a multitude of departments while maintaining the confidentiality of crucial company metrics.",
        "Created denial tracking and prevention dashboards to increase success rates.",
        "Constructed Iconic Care's first-ever balance sheet for tracking all crucial financial metrics.",
      ],
    },
    // …include the rest of your roles exactly as in Experience.tsx
  ],

  projects: [
    // Full PROJECTS array from ProjectsHUD.tsx goes here
  ],

  testimonials: [
    // Full TESTIMONIALS array from testimonials.ts goes here
  ],

  contact: {
    email: "Canyen2019@gmail.com",
    linkedin: "https://www.linkedin.com/in/canyen-palmer-b0b6762a0",
    github: "https://github.com/CanyenPalmer",
  },
} as const;
