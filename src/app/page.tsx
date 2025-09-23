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

// ✅ NEW: import the CTA band
import GetInTouchBand from "@/components/sections/GetInTouchBand";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0b1016] text-white">
      <VscodeTopBar
        primaryLabel="Palmer Projects"
        secondaryLabel={profile.hero.subheadline}
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

      {/* ✅ NEW: Get in Touch CTA band placed directly under Education */}
      <GetInTouchBand />

      <Testimonials />
      <ContactSection />
    </main>
  );
}
