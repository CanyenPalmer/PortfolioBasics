// src/app/page.tsx
"use client";

import VscodeTopBar from "@/components/VscodeTopBar";
import Hero from "@/components/HeroWithAvatar";
import AboutMeShowcase from "@/components/AboutMeShowcase";

// These components own their own <section> now
import Experience from "@/components/Experience";
import ProjectsHUD from "@/components/ProjectsHUD";
import Education from "@/components/Education";
import { Testimonials } from "@/components/Testimonials";

import ContactSection from "@/components/ContactSection";
import { profile } from "@/content/profile";

export default function Page() {
  return (
    // Desktop gets scroll-snap for that page-by-page feel; mobile scrolls naturally
    <main className="relative md:snap-y md:snap-mandatory">
      <VscodeTopBar
        signature="Canyen Palmer"
        resumeHref="/Canyen_Palmer_Resume.pdf"
        linkedinHref="https://www.linkedin.com/in/canyen-palmer-b0b6762a0"
        githubHref="https://github.com/CanyenPalmer"
      />

      {/* HERO — wrapper keeps props; now sized like a page */}
      <section
        id="hero"
        aria-label="Hero"
        className="min-h-[100svh] md:min-h-screen flex items-center py-24 md:py-32 scroll-mt-24 md:scroll-mt-28 md:snap-start"
      >
        <div className="container mx-auto px-6 max-w-7xl w-full">
          <Hero
            headline={profile.hero.headline}
            subheadline={profile.hero.subheadline}
            typer={profile.hero.typer}
          />
        </div>
      </section>

      {/* ABOUT — sized like a page; top-aligned content for natural reading */}
      <section
        id="about"
        aria-label="About"
        className="min-h-[100svh] md:min-h-screen flex items-center py-24 md:py-32 scroll-mt-24 md:scroll-mt-28 md:snap-start"
      >
        <div className="container mx-auto px-6 max-w-7xl w-full">
          <AboutMeShowcase />
        </div>
      </section>

      {/* EXPERIENCE — component owns <section> */}
      <Experience />

      {/* PROJECTS — component owns <section> */}
      <ProjectsHUD />

      {/* EDUCATION — component owns <section> */}
      <Education />

      {/* TESTIMONIALS — component owns <section> */}
      <Testimonials />

      {/* CONTACT — NEW echo layout (replaces old ContactIconsPanel) */}
      <ContactSection />
    </main>
  );
}
