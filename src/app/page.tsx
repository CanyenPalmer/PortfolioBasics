"use client";

import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import { LINKS } from "@/content/links"; // from your old repo

export default function Page() {
  return (
    <main className="relative">
      {/* HERO — keep your brand hero implementation */}
      <section id="hero" aria-label="Hero">
        <Hero />
      </section>

      {/* ABOUT — copy from old portfolio */}
      <section id="about" className="container mx-auto px-6 py-24 max-w-6xl" aria-label="About Me">
        <AboutMe
          heading="About Me"
          lead="Data Scientist & Google-Certified Data Analytics Professional specializing in statistics, machine learning, predictive modeling, optimization, and visualization."
          body={[
            "I’m currently pursuing my Master’s in Data Science at the University of Pittsburgh. I focus on turning raw data into actionable insights that drive decision-making, efficiency, and outcomes.",
            "Tooling comfort: Python, SQL, R, and modern viz stacks. Libraries you’ll often see in my repos include pandas, NumPy, scikit-learn, Matplotlib/seaborn, statsmodels, and the Tidyverse for R.",
            "I care about delivery as much as modeling — clean data pipelines, reproducible notebooks, and dashboards that non-technical stakeholders can actually use."
          ]}
          images={[
            // keep if you already have these in /public/images; otherwise remove any path that doesn't exist
            "/images/cgm.jpg",
            "/images/ames.jpg",
            "/images/mycaddy.jpg",
            "/images/aboutme.jpg"
          ]}
        />
      </section>

      {/* EDUCATION — mirrors old EducationHUD */}
      <section id="education" className="container mx-auto px-6 py-24 max-w-6xl" aria-label="Education">
        <Education
          items={[
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
          ]}
        />
      </section>

      {/* EXPERIENCE — titles/metrics preserved */}
      <section id="experience" className="container mx-auto px-6 py-24 max-w-6xl" aria-label="Experience">
        <Experience
          roles={[
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
          ]}
        />
      </section>

      {/* PROJECTS — uses old project descriptions; no images required */}
      <section id="projects" className="container mx-auto px-6 py-24 max-w-6xl" aria-label="Projects">
        <Projects
          projects={[
            {
              title: "CGM Patient Analytics",
              summary:
                "15k invoice rows → 244 CGM rows. Engineered ‘Patient Responsibility’ metric; normalized messy exports; CSV → Excel pivots for ops stakeholders. Impact: $317k unpaid identified.",
              tags: ["Python", "pandas", "NumPy", "Matplotlib", "Plotly", "Excel"],
              href: "https://github.com/CanyenPalmer/CGM-Patient-Analytics"
            },
            {
              title: "MyCaddy — Physics Shot Calculator",
              summary:
                "Physics-based adjusted carry distance (lie, wind, temp, weather). Modular core; Flask app + local script.",
              tags: ["Python", "Flask", "NumPy"],
              href: "https://github.com/CanyenPalmer/MyCaddy"
            },
          ]}
          // sideIllustrationSrc not provided -> safe, nothing rendered
        />
      </section>

      {/* TESTIMONIALS — move in more quotes when you’re ready */}
      <section id="testimonials" className="container mx-auto px-6 py-24 max-w-6xl" aria-label="Testimonials">
        <Testimonials
          items={[
            { app: "MyCaddy", quote: "Helped me commit to a shot when I was unsure. We’ll definitely use this again.", name: "User Feedback" },
            { app: "CGM Patient Tracker", quote: "Surfaced unpaid claims by aligning operations with predictive alerts.", name: "Ops Lead" },
          ]}
          cols={3}
        />
      </section>

      {/* CONTACT — your existing LINKS + codebar at top */}
      <section id="contact" className="container mx-auto px-6 py-24 max-w-6xl" aria-label="Contact">
        <Contact
          links={{
            emailHref: "mailto:canyen2019@gmail.com",
            linkedinHref: LINKS.linkedin,
            githubHref: LINKS.github,
            resumeHref: LINKS.resume,
          }}
        />
      </section>
    </main>
  );
}
