// src/app/page.tsx
"use client";

import VscodeTopBar from "@/components/VscodeTopBar";
import Hero from "@/components/HeroWithAvatar";
import AboutMeShowcase from "@/components/AboutMeShowcase";

// These components now render their own <section> with backgrounds/padding
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

      {/* HERO — keep wrapper so we can pass props to your HeroWithAvatar */}
      <section id="hero" aria-label="Hero">
        <Hero
          headline={profile.hero.headline}
          subheadline={profile.hero.subheadline}
          typer={profile.hero.typer}
        />
      </section>

      {/* ABOUT — keep wrapper for your AboutMeShowcase layout */}
      <section
        id="about"
        className="container mx-auto px-6 py-24 max-w-7xl"
        aria-label="About Me"
      >
        <AboutMeShowcase />
      </section>

      {/* EXPERIENCE — renders its own <section> with bg + spacing */}
      <Experience />

      {/* PROJECTS — renders its own <section> */}
      <ProjectsHUD />

      {/* EDUCATION — renders its own <section> with the University background */}
      <Education />

      {/* TESTIMONIALS — renders its own <section> */}
      <Testimonials />

      {/* CONTACT — keep wrapper since ContactIconsPanel is a simple block */}
      <section
        id="contact"
        className="container mx-auto px-6 py-24 max-w-7xl"
        aria-label="Contact"
      >
        <ContactIconsPanel
          heading="Contact"
          links={[
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/canyen-palmer-b0b6762a0",
            },
            { label: "GitHub", href: "https://github.com/CanyenPalmer" },
            { label: "Email", href: "mailto:canyen2019@gmail.com" },
            { label: "Resume", href: "/Canyen_Palmer_Resume.pdf" },
          ]}
        />
      </section>
    </main>
  );
}

