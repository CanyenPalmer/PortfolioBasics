// src/content/links.ts
// Minimal change: ensure all parts of the app reference a single, correct resume URL.

export const LINKS = {
  linkedin: "https://www.linkedin.com/in/canyen-palmer-b0b6762a0",
  github: "https://github.com/CanyenPalmer",
  // Served by Next.js from /public. Spaces and parentheses are URL-encoded.
  resume: "/Canyen%20Palmer%20(Resume%20-%20LaTeX).pdf",
} as const;
