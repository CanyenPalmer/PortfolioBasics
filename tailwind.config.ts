// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/content/**/*.{js,ts,jsx,tsx,md,mdx}",
  ],
  // Ensure runtime-injected classes are kept
  safelist: [
    // JSON syntax colors (300 + 400 so you can toggle contrast)
    "text-sky-300", "text-emerald-300", "text-amber-300", "text-fuchsia-300",
    "text-sky-400", "text-emerald-400", "text-amber-400", "text-fuchsia-400",
    // RichText inline <code> styling used via innerHTML
    "px-1", "rounded", "bg-white/10", "border", "border-white/10", "text-white/90", "font-semibold", "italic",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
