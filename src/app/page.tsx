import Hero from "@/components/Hero";
import ServicesCityscape from "@/components/ServicesCityscape";
import Experience from "@/components/Experience";
import ProjectsHUD from "@/components/ProjectsHUD";
import VSCodeBar from "@/components/VSCodeBar";
import { useState, useCallback } from "react";
import { useSectionObserver } from "@/hooks/useSectionObserver";

export default function HomePage() {
  const [active, setActive] = useState<string | null>("home");

  // Observe the sections you want to toggle in the bar:
  useSectionObserver({
    sectionIds: ["home", "services", "experience", "projects"],
    onChange: setActive,
  });

  const onJump = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-teal-50">
      {/* VSCode-like nav */}
      <VSCodeBar activeSection={active} onJump={onJump} />

      {/* Sections */}
      <section id="home">
        <Hero />
      </section>

      <section id="services">
        <ServicesCityscape />
      </section>

      <section id="experience">
        <Experience />
      </section>

      {/* NEW: Projects section */}
      <ProjectsHUD />

      {/* (…rest of your site) */}
    </main>
  );
}
