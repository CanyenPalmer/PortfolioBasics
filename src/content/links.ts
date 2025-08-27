// src/content/links.ts
// IMPORTANT: the PDF must be committed at public/Resume (LaTeX).pdf
// We fully encode spaces and parentheses so the URL always works.
export const LINKS = {
  resume: "/Resume%20%28LaTeX%29.pdf", // points to public/Resume (LaTeX).pdf
  linkedin: "https://www.linkedin.com/in/canyen-palmer-b0b6762a0",
  github: "https://github.com/CanyenPalmer",
  experience: "#experience",
} as const;
