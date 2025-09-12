// src/components/Contact.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";

type CanonicalLinks = {
  emailHref: string;
  linkedinHref: string;
  githubHref: string;
  resumeHref: string;
};

// Accept either the “Href” shape or the simple shape (linkedin/github/resume)
type LooseLinks =
  | Partial<CanonicalLinks>
  | {
      email?: string;             // optional raw email, we’ll turn into mailto:
      linkedin?: string;
      github?: string;
      resume?: string;
    };

type Props = {
  /** Optional raw email string (e.g., "me@example.com"). If provided we’ll build mailto: */
  email?: string;
  /** Links object (either canonical Href keys or simple keys). */
  links?: LooseLinks;
  /** Optional heading text */
  heading?: string;
};

function normalizeLinks(email: string | undefined, links: LooseLinks | undefined): CanonicalLinks {
  const l = links ?? {};

  // Pull possible values from both shapes
  const linkedin =
    (l as any).linkedinHref ?? (l as any).linkedin ?? "";
  const github =
    (l as any).githubHref ?? (l as any).github ?? "";
  const resume =
    (l as any).resumeHref ?? (l as any).resume ?? "";

  // Email can come from prop, from links.email, or links.emailHref
  const emailRaw: string | undefined =
    email ?? (l as any).email ?? undefined;
  const emailHrefExplicit: string | undefined = (l as any).emailHref;

  const emailHref =
    emailHrefExplicit ??
    (emailRaw ? `mailto:${emailRaw}` : "");

  return {
    emailHref,
    linkedinHref: linkedin,
    githubHref: github,
    resumeHref: resume,
  };
}

export default function Contact({ email, links, heading = "Contact" }: Props) {
  const hrefs = normalizeLinks(email, links);

  return (
    <section aria-label="Contact">
      <h2 className="mb-6 text-xl font-semibold tracking-wide text-cyan-200">
        {heading}
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="rounded-lg border border-cyan-400/10 bg-black/20 p-5"
      >
        <ul className="space-y-3 text-white/90">
          {hrefs.emailHref && (
            <li>
              <a
                href={hrefs.emailHref}
                className="text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200"
              >
                Email
              </a>
            </li>
          )}
          {hrefs.linkedinHref && (
            <li>
              <a
                href={hrefs.linkedinHref}
                target="_blank"
                rel="noreferrer noopener"
                className="text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200"
              >
                LinkedIn
              </a>
            </li>
          )}
          {hrefs.githubHref && (
            <li>
              <a
                href={hrefs.githubHref}
                target="_blank"
                rel="noreferrer noopener"
                className="text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200"
              >
                GitHub
              </a>
            </li>
          )}
          {hrefs.resumeHref && (
            <li>
              <a
                href={hrefs.resumeHref}
                target="_blank"
                rel="noreferrer noopener"
                className="text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200"
              >
                Resume
              </a>
            </li>
          )}
        </ul>
      </motion.div>
    </section>
  );
}
