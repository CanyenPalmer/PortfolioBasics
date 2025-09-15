// src/components/ContactIconsPanel.tsx
"use client";

import * as React from "react";

type LinkItem = { label: string; href: string };

export default function ContactIconsPanel({
  heading = "Contact",
  links = [],
}: {
  heading?: string;
  links?: ReadonlyArray<LinkItem>;
}) {
  if (!links || links.length === 0) return null;

  return (
    <div className="w-full">
      <h3 className="mb-3 text-sm uppercase tracking-wide text-white/60">{heading}</h3>
      <ul className="flex flex-wrap gap-3">
        {links.map((l, i) => (
          <li key={i}>
            <a
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85 hover:border-white/25 hover:text-white transition"
            >
              {l.label} <span className="text-white/40">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
