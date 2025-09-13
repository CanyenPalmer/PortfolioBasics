// src/components/ContactSection.tsx
"use client";

import * as React from "react";
import ContactIconsPanel from "@/components/ContactIconsPanel";

/**
 * Drop-in Contact section that uses the icon bar.
 * Safe: does NOT require changes to src/content/profile.tsx.
 */
export default function ContactSection() {
  return (
    <section id="contact" aria-label="Contact">
      <div className="rounded-xl border border-cyan-400/10 bg-black/20 p-6 md:p-8 shadow-[0_0_0_1px_rgba(0,255,255,0.05)]">
        <ContactIconsPanel
          heading="Contact"
          links={[
            { label: "LinkedIn", href: "https://www.linkedin.com/in/canyen-palmer-b0b6762a0" },
            { label: "GitHub",   href: "https://github.com/CanyenPalmer" },
            { label: "Email",    href: "mailto:canyen2019@gmail.com" },
            { label: "Resume",   href: "/Canyen_Palmer_Resume.pdf" },
          ]}
        />
      </div>
    </section>
  );
}
