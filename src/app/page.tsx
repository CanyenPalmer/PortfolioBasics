// src/app/page.tsx
"use client";

import VscodeTopBar from "@/components/VscodeTopBar";
import Hero from "@/components/HeroWithAvatar";
import AboutMeShowcase from "@/components/AboutMeShowcase";
// NEW
import LandingIntro from "@/components/LandingIntro";

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

      {/* LANDING INTRO — pinned cinematic section */}
      <LandingIntro />

      {/* HERO — your existing section (unchanged) */}
      <Hero
        headline={profile.headline}
        subheadline={profile.subheadline}
        typer={profile.typer}
      />

      {/* ABOUT — component owns <section> */}
      <AboutMeShowcase />

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
