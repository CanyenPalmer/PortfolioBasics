// src/components/ContactIconsPanel.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { profile } from "@/content/profile";

type ContactLink = {
  label: "LinkedIn" | "GitHub" | "Email" | "Resume" | string;
  href: string;
};

type Props = {
  heading?: string;
  /** Optional explicit links. If omitted, we derive from profile.contact. */
  links?: ReadonlyArray<ContactLink>;
};

export default function ContactIconsPanel({ heading = "Contact", links }: Props) {
  const derived = React.useMemo<ReadonlyArray<ContactLink>>(() => {
    if (links && links.length) return links;

    const email = (profile as any)?.contact?.email as string | undefined;
    const resume = (profile as any)?.contact?.resume as string | undefined;
    const socials = (profile as any)?.contact?.socials as
      | ReadonlyArray<{ label?: string; href: string }>
      | undefined;

    const li = socials?.find((s) => (s.label ?? "").toLowerCase().includes("linkedin"))?.href;
    const gh = socials?.find((s) => (s.label ?? "").toLowerCase().includes("github"))?.href;

    const L: ContactLink[] = [];
    if (li) L.push({ label: "LinkedIn", href: li });
    if (gh) L.push({ label: "GitHub", href: gh });
    if (email) L.push({ label: "Email", href: email.includes("mailto:") ? email : `mailto:${email}` });
    if (resume) L.push({ label: "Resume", href: resume });

    const order = ["LinkedIn", "GitHub", "Email", "Resume"] as const;
    const byLabel = Object.fromEntries(L.map((x) => [x.label, x.href]));
    return order.map((lbl) => ({ label: lbl, href: byLabel[lbl] ?? "#" }));
  }, [links]);

  const labelsLine = derived.map((d) => d.label).join(" · ");

  return (
    <div aria-label="Contact">
      <h2 className="mb-6 text-xl font-semibold tracking-wide text-cyan-200">{heading}</h2>

      <div className="rounded-xl border border-cyan-400/10 bg-black/20 p-6 md:p-8 shadow-[0_0_0_1px_rgba(0,255,255,0.05)]">
        {/* Icon Row */}
        <motion.div
          className="flex items-center justify-center gap-6 md:gap-8"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          {derived.map((d, i) => (
            <IconButton key={`${d.label}-${i}`} label={d.label} href={d.href} />
          ))}
        </motion.div>

        {/* Subheading with dot separators */}
        <p className="mt-4 text-center text-[11px] uppercase tracking-[0.14em] text-white/70">
          {labelsLine}
        </p>
      </div>
    </div>
  );
}

/* --- Icon Button --- */

function IconButton({ label, href }: { label: string; href: string }) {
  const isDisabled = href === "#";

  return (
    <a
      href={isDisabled ? undefined : href}
      target={isDisabled || label === "Email" ? undefined : "_blank"}
      rel={isDisabled || label === "Email" ? undefined : "noreferrer"}
      aria-label={label}
      title={label}
      className={[
        "group inline-flex h-14 w-14 items-center justify-center rounded-full",
        "ring-1 ring-cyan-400/20 bg-black/30 hover:bg-black/40",
        "shadow-[0_0_18px_rgba(0,255,255,0.08)] transition",
        isDisabled ? "opacity-40 pointer-events-none" : "hover:shadow-[0_0_24px_rgba(0,255,255,0.14)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70",
      ].join(" ")}
    >
      <Icon label={label} className="h-7 w-7 text-cyan-200 group-hover:text-cyan-100" />
    </a>
  );
}

/* --- Inline SVG Icons (theme-matched) --- */

function Icon({ label, className }: { label: string; className?: string }) {
  switch (label.toLowerCase()) {
    case "linkedin":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zM8 8h3.8v2.05h.05C12.6 8.9 14.3 8 16.6 8 21 8 23 10.7 23 15.2V23h-4v-6.8c0-1.6 0-3.6-2.2-3.6-2.2 0-2.6 1.7-2.6 3.5V23h-4V8z"/>
        </svg>
      );
    case "github":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 .5a11.5 11.5 0 0 0-3.64 22.42c.58.11.8-.25.8-.56v-2.1c-3.25.71-3.94-1.39-3.94-1.39-.53-1.35-1.3-1.71-1.3-1.71-1.06-.73.08-.72.08-.72 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.72 1.27 3.38.97.11-.76.41-1.27.75-1.56-2.59-.3-5.31-1.29-5.31-5.73 0-1.27.46-2.31 1.2-3.13-.12-.3-.52-1.53.11-3.2 0 0 .98-.31 3.2 1.2a10.9 10.9 0 0 1 5.82 0c2.22-1.51 3.19-1.2 3.19-1.2.64 1.67.24 2.9.12 3.2.75.82 1.2 1.86 1.2 3.13 0 4.45-2.73 5.42-5.33 5.71.42.37.8 1.1.8 2.22v3.29c0 .31.21.68.81.56A11.5 11.5 0 0 0 12 .5Z"/>
        </svg>
      );
    case "email":
    case "gmail":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20 4H4a2 2 0 0 0-2 2v1.2l10 6.25L22 7.2V6a2 2 0 0 0-2-2Zm0 4.05L12 14 4 8.05V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.05Z"/>
        </svg>
      );
    case "resume":
    case "cv":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 1.5L19.5 9H14V3.5ZM8 12.25h8v1.5H8v-1.5Zm0 3h8v1.5H8v-1.5Zm0-6h5v1.5H8v-1.5Z"/>
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
