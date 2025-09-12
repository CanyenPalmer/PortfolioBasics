"use client";

import Hero from "@/components/HeroWithAvatar";
import AboutMeShowcase from "@/components/AboutMeShowcase";
import EducationHUD from "@/components/EducationHUD";
import Experience from "@/components/Experience";
import ProjectsHUD from "@/components/ProjectsHUD";
import Testimonials from "@/components/Testimonials";
import ContactReactor from "@/components/ContactReactor";
import { profile } from "@/content/profile"; // keep as-is (now profile.tsx in your repo)
import { LINKS } from "@/content/links";

export default function Page() {
  return (
    <main className="relative">
      {/* Hero Section */}
      <section id="hero" aria-label="Hero">
        <Hero
          headline={profile.hero.headline}
          subheadline={profile.hero.subheadline}
          typer={profile.hero.typer}
        />
      </section>

      {/* About */}
      <section
        id="about"
        className="container mx-auto px-6 py-24 max-w-7xl"
        aria-label="About Me"
      >
        <AboutMeShowcase />
      </section>

      {/* Education */}
      <section
        id="education"
        className="container mx-auto px-6 py-24 max-w-7xl"
        aria-label="Education"
      >
        <EducationHUD />
      </section>

      {/* Experience */}
      <section
        id="experience"
        className="container mx-auto px-6 py-24 max-w-7xl"
        aria-label="Experience"
      >
        <Experience />
      </section>

      {/* Projects */}
      <section
        id="projects"
        className="container mx-auto px-6 py-24 max-w-7xl"
        aria-label="Projects"
      >
        <ProjectsHUD />
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="container mx-auto px-6 py-24 max-w-7xl"
        aria-label="Testimonials"
      >
        <Testimonials />
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="container mx-auto px-6 py-24 max-w-7xl"
        aria-label="Contact"
      >
        <ContactReactor
          links={{
            emailHref: `mailto:${profile.contact.email}`,
            linkedinHref: LINKS.linkedin,
            githubHref: LINKS.github,
            resumeHref: LINKS.resume,
          }}
        />
      </section>
    </main>
  );
}
