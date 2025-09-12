"use client";

import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Hero />

      {/* ABOUT ME — keeps your current voice; light copy tweak to match the new art direction */}
      <section id="about" className="container mx-auto px-6 py-24 max-w-6xl">
        <AboutMe
          heading="About Me"
          lead="I build end-to-end analytics and ML workflows — from clean data pipelines to models and decision dashboards."
          body={[
            "Currently pursuing my Master’s in Data Science at the University of Pittsburgh.",
            "My focus: Python, R, SQL, and modern viz stacks — used to ship measurable impact (think: patient analytics, ops intelligence, attrition modeling).",
            "This site’s redesign keeps all original facts intact while leaning into a clean cyber-tech aesthetic.",
          ]}
          images={[
            // Keep your existing About images here — these <img> tags fail-safe if a file is missing.
            "/about/impact-dashboard.jpg",
            "/about/cgm-tracker.jpg",
            "/about/teaching-moments.jpg",
          ]}
        />
      </section>
    </main>
  );
}
