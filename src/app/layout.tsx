import "./globals.css";
import type { Metadata } from "next";
import VscodeTopBar from "@/components/VscodeTopBar";

export const metadata: Metadata = {
  title: "Canyen Palmer • Portfolio",
  description: "Turning data into decisions through science, code, and storytelling.",
  // You can add a favicon later in /public and uncomment:
  // icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0b1016] text-white antialiased">
        <VscodeTopBar
          resumeHref="/Resume%20(LaTeX).pdf"
          linkedinHref="https://www.linkedin.com/in/canyen-palmer-b0b6762a0"
          githubHref="https://github.com/CanyenPalmer"
          signature="Canyen Palmer"
        />
        {children}
      </body>
    </html>
  );
}
