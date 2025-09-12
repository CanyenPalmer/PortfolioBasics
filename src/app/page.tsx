import VscodeTopBar from "@/components/VscodeTopBar"; // keep yours as-is
import HeroAvatar from "@/components/hero/HeroAvatar";
import ExperienceLog from "@/components/experience/ExperienceLog";

// If your other sections are already implemented, keep rendering them below.
// We are not deleting or renaming any existing sections/IDs.

export default function HomePage() {
  return (
    <main className="bg-[#0b1016] text-white">
      <VscodeTopBar
        resumeHref="/Canyen_Palmer_Resume.pdf"
        linkedinHref="https://www.linkedin.com/in/your-handle"
        githubHref="https://github.com/your-handle"
        signature="Canyen Palmer"
      />

      {/* HERO — AVATAR LANDING */}
      <HeroAvatar
        id="home"
        name="Canyen Palmer"
        tagline="Turning data into decisions..."
        toolbar={[
          { label: "Resume", href: "/Canyen_Palmer_Resume.pdf" },
          { label: "GitHub", href: "https://github.com/your-handle", external: true },
          { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle", external: true },
          { label: "Email", href: "mailto:canyen2019@gmail.com", external: true },
        ]}
      />

      {/* EXPERIENCE — TERMINAL TIMELINE */}
      <ExperienceLog
        id="experience"
        heading="EXPERIENCE — BATTLE RECORDS"
        items={[
          // === Replace these with your exact current entries/metrics ===
          { title: "Data Scientist", org: "Tech Innovations", date: "2023 — Present", highlight: "10% user engagement" },
          { title: "Machine Learning Intern", org: "Insights Corp", date: "2021 — 2023", highlight: "250k+ rows analyzed" },
          { title: "Research Assistant", org: "University of Somewheres", date: "2019 — 2021", highlight: "5x deployment speedup" },
        ]}
      />

      {/* === Your existing sections continue below exactly as they are now === */}
      {/* <Projects id="projects" ... /> */}
      {/* <About id="about" ... /> */}
      {/* <Testimonials id="testimonials" ... /> */}
      {/* <Services id="services" ... /> */}
      {/* <Contact id="contact" ... /> */}
    </main>
  );
}
