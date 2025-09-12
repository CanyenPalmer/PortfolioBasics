"use client";
import { motion } from "framer-motion";
import Link from "next/link";

type ContactLinks = { emailHref: string; linkedinHref: string; githubHref: string; resumeHref: string; };

export default function Contact({ heading = "Contact", links }: { heading?: string; links: ContactLinks; }) {
  const { emailHref, linkedinHref, githubHref, resumeHref } = links;
  return (
    <section id="contact" className="section-wrap">
      <div className="hud-panel">
        <motion.h2 initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }} className="neon-title magenta">
          {heading.toUpperCase()}
        </motion.h2>

        <div className="mt-8 text-center">
          <p className="text-white/80">Let’s talk about data, models, and shipping value.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link className="rounded-lg px-3 py-1.5 ring-1 ring-white/15 hover:ring-white/30 hover:bg-white/[0.05] transition" href={resumeHref}>Resume</Link>
            <a className="rounded-lg px-3 py-1.5 ring-1 ring-white/15 hover:ring-white/30 hover:bg-white/[0.05] transition" href={linkedinHref} target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="rounded-lg px-3 py-1.5 ring-1 ring-white/15 hover:ring-white/30 hover:bg-white/[0.05] transition" href={githubHref} target="_blank" rel="noreferrer">GitHub</a>
            <a className="rounded-lg px-3 py-1.5 ring-1 ring-white/15 hover:ring-white/30 hover:bg-white/[0.05] transition" href={emailHref}>Email</a>
          </div>
        </div>
      </div>
    </section>
  );
}

