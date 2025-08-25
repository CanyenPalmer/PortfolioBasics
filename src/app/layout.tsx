import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

// Example: using Inter — you can swap for Satisfy, JetBrains Mono, etc.
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Canyen Palmer | Portfolio",
  description: "Turning data into decisions through science, code, and storytelling.",
  icons: {
    icon: "/favicon.ico", // make sure you have this in /public
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#0b0f15] text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
