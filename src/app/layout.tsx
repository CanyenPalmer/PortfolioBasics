import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Canyen Palmer | Portfolio",
  description: "Turning data into decisions through science, code, and storytelling.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
