"use client";

import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import { profile } from "@/content/profile";
import { LINKS } from "@/content/links";

export default function Page() {
  return (
    <main className="relative">
      <section id="hero" aria-label="Hero">
        <Hero headline={profile.hero.headline} subheadline={profile.hero.subheadline} typer={profile.hero.typer} />
      </section>

      <section id="about" className="container mx-auto px-6 py-24 max-w-6xl" aria-label="About Me">
        <AboutMe
          heading="About Me"
          lead={profile.about.lead}
          body={profile.about.body}
          images={profile.about.images /* expects /public/about/* paths */}
        />
      </section>

      <section id="education" className="container mx-auto px-6 py-24 max-w-6xl" aria-label="Education">
        <Education items={profile.education} />
      </section>

      <section id="experience" className="container mx-auto px-6 py-24 max-w-6xl" aria-label="Experience">
        <Experience roles={profile.experience} />
      </section>

      <section id="projects" className="container mx-auto px-6 py-24 max-w-6xl" aria-label="Projects">
        <Projects projects={profile.projects /* no images required */} />
      </section>

      <section id="testimonials" className="container mx-auto px-6 py-24 max-w-6xl" aria-label="Testimonials">
        <Testimonials items={profile.testimonials} cols={3} />
      </section>

      <section id="contact" className="container mx-auto px-6 py-24 max-w-6xl" aria-label="Contact">
        <Contact
          links={{
            emailHref: `mailto:${profile.contact.email}`,
            linkedinHref: LINKS.linkedin,
            githubHref: LINKS.github,
            resumeHref: LINKS.resume,
          }}
        />
      </section>
    </main>
  );
}
