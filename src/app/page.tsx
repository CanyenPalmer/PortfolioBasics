"use client";

import Hero from "@/components/HeroWithAvatar";
import AboutMeShowcase from "@/components/AboutMeShowcase";
import Education from "@/components/Education";          // ✅ use actual file
import Experience from "@/components/Experience";
import ProjectsHUD from "@/components/ProjectsHUD";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";              // ✅ use actual file
import { profile } from "@/content/profile";
import { LINKS } from "@/content/links";

export default function Page() {
  return (
    <main className="relative">
      {/* Hero */}
      <section id="hero" aria-label="Hero">
        <Hero
          headline={profile.hero.headline}
          subheadline={profile.hero.subheadline}
          typer={profile.hero.typer}
        />
      </section>

      {/* About */}
      <section id="about" className="container mx-auto px-6 py-24 max-w-7xl" aria-label="About Me">
        <AboutMeShowcase />
      </section>

      {/* Education */}
      <section id="education" className="container mx-auto px-6 py-24 max-w-7xl" aria-label="Education">
        <Education />
      </section>

      {/* Experience */}
      <section id="experience" className="container mx-auto px-6 py-24 max-w-7xl" aria-label="Experience">
        <Experience />
      </section>

      {/* Projects */}
      <section id="projects" className="container mx-auto px-6 py-24 max-w-7xl" aria-label="Projects">
        <ProjectsHUD />
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="container mx-auto px-6 py-24 max-w-7xl" aria-label="Testimonials">
        <Testimonials />
      </section>

      {/* Contact */}
      <section id="contact" className="container mx-auto px-6 py-24 max-w-7xl" aria-label="Contact">
        <Contact
          email={profile.contact.email}
          links={LINKS}
        />
      </section>
    </main>
  );
}
