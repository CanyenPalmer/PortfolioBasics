"use client";

import Hero from "@/components/HeroWithAvatar";
import AboutMe from "@/components/AboutMe";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import { profile } from "@/content/profile";
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

      {/* About Section */}
      <section
        id="about"
        className="container mx-auto px-6 py-24 max-w-6xl"
        aria-label="About Me"
      >
        <AboutMe
          heading="About Me"
          lead={profile.about.lead}
          body={profile.about.body}
          images={profile.about.images}
        />
      </section>

      {/* Education Section */}
      <section
        id="education"
        className="container mx-auto px-6 py-24 max-w-6xl"
        aria-label="Education"
      >
        <Education education={profile.education} />
      </section>

      {/* Experience Section */}
      <section
        id="experience"
        className="container mx-auto px-6 py-24 max-w-6xl"
        aria-label="Experience"
      >
        <Experience />
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="container mx-auto px-6 py-24 max-w-6xl"
        aria-label="Projects"
      >
        <Projects />
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="container mx-auto px-6 py-24 max-w-6xl"
        aria-label="Testimonials"
      >
        <Testimonials />
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="container mx-auto px-6 py-24 max-w-6xl"
        aria-label="Contact"
      >
        <Contact email={profile.contact.email} links={LINKS} />
      </section>
    </main>
  );
}
