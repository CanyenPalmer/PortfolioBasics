"use client";

import { useCallback, useState } from "react";

import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import ServicesCityscape from "@/components/ServicesCityscape";
import ProjectsHUD from "@/components/ProjectsHUD";
import VSCodeBar from "@/components/VSCodeBar";

/**
 * NOTE:
 * - We are NOT introducing any new hooks.
 * - If you already have logic elsewhere that sets `activeSection`,
 *   keep using it the same way and pass it into <VSCodeBar />.
 * - If you don’t have active highlighting, this still works perfectly;
 *   the bar buttons will scroll to sections, and nothing breaks.
 */

export default function HomePage() {
  // If your app already manages this from somewhere else, feel free to remove.
  const [activeSection] = useState<string | null>(null);

  // Use your existing onJump if you have one; this is a safe fallback.
  const onJump = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-teal-50">
      {/* VSCode-style top bar */}
      <VSCodeBar activeSection={activeSection} onJump={onJump} />

      {/* Home */}
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

      {/* Projects (the component itself includes id="projects") */}
      <ProjectsHUD />

      {/* ...any additional sections below */}
    </main>
  );
}
