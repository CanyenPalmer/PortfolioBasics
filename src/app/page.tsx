"use client";

import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Education from "@/components/Education";

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* VSCode top bar remains in app/layout.tsx — unchanged */}
      <Hero />

      {/* ABOUT */}
      <section className="container mx-auto px-6 py-24 max-w-6xl">
        <AboutMe
          heading="About Me"
          lead="I build end-to-end analytics and ML workflows — from clean data pipelines to models and decision dashboards."
          body={[
            "Currently pursuing my Master’s in Data Science at the University of Pittsburgh.",
            "My toolkit centers on Python, R, SQL, and modern visualization stacks to ship measurable outcomes (CGM analytics, ops intelligence, attrition modeling).",
            "This redesign keeps all original facts intact while leaning into a clean cyber-tech aesthetic that matches my brand.",
          ]}
          images={[
            "/about/impact-dashboard.jpg",
            "/about/cgm-tracker.jpg",
            "/about/teaching-moments.jpg",
          ]}
        />
      </section>

      {/* EDUCATION */}
      <section className="container mx-auto px-6 py-24 max-w-6xl">
        <Education
          items={[
            {
              school: "University of Pittsburgh",
              degree: "M.S. in Data Science",
              range: "2024 — 2026 (Expected)",
              details: [
                "Graduate coursework integrating statistics, machine learning, and scalable analytics.",
                "Capstone focused on deploying ML for operational decision-making.",
              ],
              coursework: [
                { code: "DSCI 2001", name: "Statistical Learning" },
                { code: "DSCI 2102", name: "Machine Learning Systems" },
                { code: "DSCI 2305", name: "Data Visualization & Storytelling" },
              ],
              badges: ["Python", "R", "SQL", "ML", "MLOps", "Tableau"],
            },
            {
              school: "Undergraduate Institution",
              degree: "B.S. in [Your Major]",
              range: "2018 — 2022",
              details: [
                "Foundation in quantitative methods and software engineering.",
              ],
              coursework: [
                { code: "STAT 410", name: "Regression Analysis" },
                { code: "CS 220", name: "Data Structures" },
              ],
              badges: ["Statistics", "Linear Algebra", "Data Structures"],
            },
          ]}
        />
      </section>

      {/* EXPERIENCE */}
      <section className="container mx-auto px-6 py-24 max-w-6xl">
        <Experience
          roles={[
            {
              title: "Data Scientist",
              range: "2021—Present",
              bullets: ["Shipped predictive models and analytics workflows end-to-end."],
              metric: { value: "10%", label: "user engagement" },
            },
            {
              title: "Machine Learning Intern",
              range: "2020—2021",
              bullets: ["Prototyped feature stores & model monitoring."],
              metric: { value: "250k+", label: "data rows analyzed" },
            },
            {
              title: "Research Assistant",
              org: "University of Somewhere",
              bullets: ["Quant methods, reproducible pipelines."],
              metric: { value: "5x", label: "deployment speedup" },
            },
          ]}
        />
      </section>

      {/* PROJECTS */}
      <section className="container mx-auto px-6 py-24 max-w-6xl">
        <Projects
          projects={[
            {
              title: "E-commerce Sales Prediction",
              summary:
                "End-to-end pipeline from wrangling to modeling, plus a decision dashboard.",
              tags: ["Python", "Scikit-learn", "Pandas"],
              chart: [2, 6, 4, 8, 5, 9, 7],
              href: "https://github.com/CanyenPalmer",
            },
            {
              title: "CGM Patient Analytics",
              summary:
                "Segmentation + forecasting for clinical monitoring and ops insights.",
              tags: ["R", "Forecast", "ggplot2"],
              chart: [3, 3, 5, 6, 7, 8, 11],
            },
          ]}
          sideIllustrationSrc="/illustrations/side.png"
        />
      </section>

      {/* TESTIMONIALS */}
      <section className="container mx-auto px-6 py-24 max-w-6xl">
        <Testimonials
          items={[
            {
              app: "Best Bet NFL",
              quote:
                "Clear logic and transparency — it actually helped me understand variance instead of selling hype.",
              name: "User Feedback",
              role: "Power user",
            },
            {
              app: "CGM Patient Tracker",
              quote:
                "Surfaced $317k in unpaid claims by aligning operations with predictive alerts.",
              name: "Ops Lead",
              role: "Healthcare org",
            },
            {
              app: "MyCaddy",
              quote:
                "Loved the UX — went from manual stat tracking to automated insights in one round.",
              name: "Early Adopter",
            },
          ]}
          cols={3}
        />
      </section>

      {/* CONTACT */}
      <section className="container mx-auto px-6 py-24 max-w-6xl">
        <Contact
          links={{
            emailHref: "mailto:canyen2019@gmail.com",
            linkedinHref: "https://www.linkedin.com/in/canyen-palmer-b0b6762a0",
            githubHref: "https://github.com/CanyenPalmer",
            resumeHref: "/Canyen_Palmer_Resume.pdf",
          }}
        />
      </section>
    </main>
  );
}
