"use client";

import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Hero />

      <section id="about" className="container mx-auto px-6 py-24 max-w-6xl">
        <AboutMe
          heading="About Me"
          lead="I build end-to-end analytics and ML workflows — from clean data pipelines to models and decision dashboards."
          body={[
            "Currently pursuing my Master’s in Data Science at the University of Pittsburgh.",
            "Focus areas: Python, R, SQL, and modern viz stacks used to ship measurable impact.",
            "This redesign keeps all original facts intact while leaning into a clean cyber-tech aesthetic.",
          ]}
          images={[
            "/about/impact-dashboard.jpg",
            "/about/cgm-tracker.jpg",
            "/about/teaching-moments.jpg",
          ]}
        />
      </section>

      <section className="container mx-auto px-6 py-24 max-w-6xl">
        <Experience
          roles={[
            {
              title: "Data Scientist",
              range: "2021—Present",
              bullets: [
                "Shipped predictive models and analytics workflows end-to-end.",
              ],
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

      <section className="container mx-auto px-6 py-24 max-w-6xl">
        <Projects
          projects={[
            {
              title: "E-commerce Sales Prediction",
              summary:
                "End-to-end pipeline from wrangling to modeling, plus a decision dashboard.",
              tags: ["Python", "Scikit-learn", "Pandas"],
              chart: [2, 6, 4, 8, 5, 9, 7],
              href: "https://github.com/CanyenPalmer", // replace per-project
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
    </main>
  );
}
