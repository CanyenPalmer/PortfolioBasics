// src/app/page.tsx
"use client";

import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";

export default function Page() {
  return (
    <main className="flex flex-col">
      {/* HERO */}
      <section
        id="home"
        className="min-h-[100svh] md:min-h-screen flex items-center py-24 md:py-32 scroll-mt-24 md:scroll-mt-28 md:snap-start"
        aria-label="Hero"
      >
        <Hero />
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="min-h-[100svh] md:min-h-screen flex items-center py-24 md:py-32 scroll-mt-24 md:scroll-mt-28 md:snap-start"
        aria-label="About"
      >
        <About />
      </section>

      {/* EXPERIENCE */}
      <section
        id="experience"
        className="min-h-[100svh] md:min-h-screen flex items-center py-24 md:py-32 scroll-mt-24 md:scroll-mt-28 md:snap-start"
        aria-label="Experience"
      >
        <Experience />
      </section>

      {/* PROJECTS */}
      <section
        id="projects"
        className="min-h-[100svh] md:min-h-screen flex items-center py-24 md:py-32 scroll-mt-24 md:scroll-mt-28 md:snap-start"
        aria-label="Projects"
      >
        <Projects />
      </section>

      {/* EDUCATION */}
      <section
        id="education"
        className="min-h-[100svh] md:min-h-screen flex items-center py-24 md:py-32 scroll-mt-24 md:scroll-mt-28 md:snap-start"
        aria-label="Education"
      >
        <Education />
      </section>

      {/* TESTIMONIALS */}
      <section
        id="testimonials"
        className="min-h-[100svh] md:min-h-screen flex items-center py-24 md:py-32 scroll-mt-24 md:scroll-mt-28 md:snap-start"
        aria-label="Testimonials"
      >
        <Testimonials />
      </section>

      {/* CONTACT */}
      <ContactSection />
    </main>
  );
}
