"use client";

import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import ServicesCityscape from "@/components/ServicesCityscape";
import ProjectsHUD from "@/components/ProjectsHUD";
import EducationHUD from "@/components/EducationHUD";

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

      {/* My Services */}
      <section id="services" aria-label="My Services">
        <ServicesCityscape />
      </section>

      {/* Projects */}
      <section id="projects" aria-label="Projects">
        <ProjectsHUD />
      </section>

      {/* Education (no outer wrapper with id to avoid duplicate IDs) */}
      <EducationHUD />
    </main>
  );
}
