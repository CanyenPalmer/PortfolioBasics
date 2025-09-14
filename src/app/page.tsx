// src/app/page.tsx
"use client";

import VscodeTopBar from "@/components/VscodeTopBar";
import Hero from "@/components/HeroWithAvatar";
import AboutMeShowcase from "@/components/AboutMeShowcase";
import Experience from "@/components/Experience";
import ProjectsHUD from "@/components/ProjectsHUD";
import Education from "@/components/Education";
import { Testimonials } from "@/components/Testimonials";
import ContactIconsPanel from "@/components/ContactIconsPanel";
import { profile } from "@/content/profile";

export default function Page() {
  return (
    <main className="relative">
      <VscodeTopBar />

      {/* HERO */}
      <section id="hero" aria-label="Hero">
        <Hero
          headline={profile.hero.headline}
          subheadline={profile.hero.subheadline}
          typer={profile.hero.typer}
        />
      </section>

      {/* ABOUT */}
      <section id="about" className="container mx-auto px-6 py-24 max-w-7xl" aria-label="About Me">
        <AboutMeShowcase />
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="px-6 py-24" aria-label="Experience">
        <Experience />
      </section>

      {/* PROJECTS */}
      <section id="projects" className="px-6 py-24" aria-label="Projects">
        <ProjectsHUD />
      </section>

      {/* EDUCATION */}
      <section id="education" className="container mx-auto px-6 py-24 max-w-7xl" aria-label="Education">
        <Education />
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="container mx-auto px-6 py-24 max-w-7xl" aria-label="Testimonials">
        <Testimonials />
      </section>

      {/* CONTACT */}
      <section id="contact" className="container mx-auto px-6 py-24 max-w-7xl" aria-label="Contact">
        <ContactIconsPanel
          heading="Contact"
          links={[
            { label: "LinkedIn", href: "https://www.linkedin.com/in/canyen-palmer-b0b6762a0" },
            { label: "GitHub",   href: "https://github.com/CanyenPalmer" },
            { label: "Email",    href: "mailto:canyen2019@gmail.com" },
            { label: "Resume",   href: "/Canyen_Palmer_Resume.pdf" },
          ]}
        />
      </section>
    </main>
  );
}

