"use client";

import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import ServicesCityscape from "@/components/ServicesCityscape";
import ProjectsHUD from "@/components/ProjectsHUD";
import EducationHUD from "@/components/EducationHUD";
import AboutMeShowcase from "@/components/AboutMeShowcase";

export default function Page() {
  return (
    <main className="relative">
      {/* Hero Section */}
      <section id="hero" aria-label="Hero">
        <Hero />
      </section>

      {/* Experience */}
      <section id="experience" aria-label="Experience">
        <Experience />
      </section>

      {/* Services */}
      <section id="services" aria-label="My Services">
        <ServicesCityscape />
      </section>

      {/* Projects */}
      <section id="projects" aria-label="Projects">
        <ProjectsHUD />
      </section>

      {/* Education */}
      <section id="education" aria-label="Education">
        <EducationHUD />
      </section>

      {/* About Me (moved after Education) */}
      <section id="about" aria-label="About Me">
        <AboutMeShowcase />
      </section>
    </main>
  );
}
