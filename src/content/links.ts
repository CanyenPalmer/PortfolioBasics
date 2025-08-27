// src/content/links.ts
// Keep your exact filename; encode it so the URL is safe.
const RESUME_FILE = "/Resume (LaTeX).pdf";

export const LINKS = {
  resume: encodeURI(RESUME_FILE), // -> "/Resume%20(LaTeX).pdf"
  linkedin: "https://www.linkedin.com/in/canyen-palmer-b0b6762a0",
  github: "https://github.com/CanyenPalmer",
} as const;
