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

// ✅ Import your new CTA band
import GetInTouchBand from "@/components/sections/GetInTouchBand";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0b1016] text-white">
      <VscodeTopBar
        signature="Palmer Projects"
        linkedinHref="https://www.linkedin.com/in/canyen-palmer-b0b6762a0"
        githubHref="https://github.com/CanyenPalmer"
      />

      {/* LANDING INTRO */}
      <LandingIntro />

      {/* HERO */}
      <Hero
        headline={profile.hero.headline}
        subheadline={profile.hero.subheadline}
        typer={profile.hero.typer}
      />

      <AboutMeShowcase />
      <Experience />
      <ProjectsHUD />
      <Education />

      {/* ✅ Get In Touch CTA band below Education */}
      <GetInTouchBand />

      <Testimonials />
      <ContactSection />
    </main>
  );
}

/*yes*/
