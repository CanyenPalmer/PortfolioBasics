"use client";

import { useCallback, useState } from "react";

import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import ServicesCityscape from "@/components/ServicesCityscape";
import ProjectsHUD from "@/components/ProjectsHUD";

/**
 * NOTE:
 * - The VSCodeBar is already rendered globally in layout.tsx.
 * - No need to import or render it here, otherwise you'll see duplicates.
 * - Scroll highlighting + navigation still work because the bar is global.
 */

export default function HomePage() {
  // If your app already manages activeSection elsewhere, keep using that.
  // Keeping this here won't hurt but can be removed if unused.
  const [activeSection] = useState<string | null>(null);

  const onJump = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-teal-50">
      {/* Hero */}
      <section id="home" aria-label="Home">
        <Hero />
      </section>

      {/* Experience */}
      <section id="experience" aria-label="Experience">
        <Experience />
      </section>

      {/* My Services */}
      <section id="services" aria-label="My Services">
        <ServicesCityscape />
      </section>

      {/* Projects */}
      <ProjectsHUD />

      {/* ...other sections if you add them later */}
    </main>
  );
}
