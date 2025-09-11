"use client";

import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import ServicesCityscape from "@/components/ServicesCityscape";
import ProjectsHUD from "@/components/ProjectsHUD";
import EducationHUD from "@/components/EducationHUD";
import AboutMeShowcase from "@/components/AboutMeShowcase";
import Testimonials from "@/components/Testimonials";
import ContactReactor from "@/components/ContactReactor";

export default function Page() {
  return (
    <main className="relative">
      {/* Hero */}
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

      {/* About Me (kept after Education, per your layout) */}
      <section id="about" aria-label="About Me">
        <AboutMeShowcase />
      </section>

      {/* Testimonials (new, after About Me) */}
      <section id="testimonials" aria-label="Testimonials">
        <Testimonials />
      </section>

      {/* Contact (final closer) */}
      <section id="contact-section" aria-label="Contact">
        <ContactReactor />
      </section>
    </main>
  );
}
