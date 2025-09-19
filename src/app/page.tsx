// src/app/page.tsx
"use client";

import VscodeTopBar from "@/components/VscodeTopBar";
import Hero from "@/components/HeroWithAvatar";
import AboutMeShowcase from "@/components/AboutMeShowcase";
import LandingIntro from "@/components/LandingIntro";

import Experience from "@/components/Experience";
import ProjectsHUD from "@/components/ProjectsHUD";
import Education from "@/components/Education";
import { Testimonials } from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import { profile } from "@/content/profile";

export default function Page() {
  return (
    <main className="relative md:snap-y md:snap-mandatory">
      <VscodeTopBar
        signature="Canyen Palmer"
        resumeHref="/Canyen_Palmer_Resume.pdf"
        linkedinHref="https://www.linkedin.com/in/canyen-palmer-b0b6762a0"
        githubHref="https://github.com/CanyenPalmer"
      />

      {/* LANDING INTRO — pinned cinematic section */}
      <LandingIntro />

      {/* HERO — uses fields from profile.hero */}
      <Hero
        headline={profile.hero.headline}
        subheadline={profile.hero.subheadline}
        typer={profile.hero.typer}
      />

      <AboutMeShowcase />
      <Experience />
      <ProjectsHUD />
      <Education />
      <Testimonials />
      <ContactSection />
    </main>
  );
}
