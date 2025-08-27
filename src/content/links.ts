// src/content/links.ts
// Keep the exact filename with spaces/parentheses; we'll encode it for the URL.
const RAW_RESUME_PATH = "/Resume (LaTeX).pdf";

export const LINKS = {
  resume: encodeURI(RAW_RESUME_PATH), // -> "/Resume%20(LaTeX).pdf"
  linkedin: "https://www.linkedin.com/in/canyen-palmer-b0b6762a0",
  github: "https://github.com/CanyenPalmer",
} as const;
