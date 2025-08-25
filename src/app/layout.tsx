import "./globals.css";
import type { Metadata } from "next";
import VscodeTopBar from "@/components/VscodeTopBar";

export const metadata: Metadata = {
  title: "Canyen Palmer • Portfolio",
  description: "Turning data into decisions through science, code, and storytelling.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0b1016] text-white">
        <VscodeTopBar
          resumeHref="/Canyen_Palmer_Resume.pdf"
          linkedinHref="https://www.linkedin.com/in/your-handle"
          githubHref="https://github.com/your-handle"
          signature="Canyen Palmer"
        />
        {children}
      </body>
    </html>
  );
}
