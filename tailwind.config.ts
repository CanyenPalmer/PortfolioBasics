// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/content/**/*.{js,ts,jsx,tsx,md,mdx}",
  ],
  // ⬇️ Safelist ensures classes used in dangerouslySetInnerHTML aren't purged
  safelist: [
    // JSON syntax colors
    "text-sky-300",
    "text-emerald-300",
    "text-amber-300",
    "text-fuchsia-300",

    // (Optional) If you decide to bump contrast later:
    // "text-sky-400",
    // "text-emerald-400",
    // "text-amber-400",
    // "text-fuchsia-400",
  ],
  theme: {
    extend: {
      // You can add custom fonts, colors, shadows, etc. here later
    },
  },
  plugins: [],
};

export default config;
