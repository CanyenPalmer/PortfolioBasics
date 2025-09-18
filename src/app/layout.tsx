// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import TransitionProvider from "@/providers/TransitionProvider";
import TransitionOverlay from "@/components/TransitionOverlay";

export const metadata: Metadata = {
  title: "Canyen Palmer",
  description: "Turning data into decisions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b1016] text-white antialiased">
        <TransitionProvider>
          {children}
          <TransitionOverlay />
        </TransitionProvider>
      </body>
    </html>
  );
}
