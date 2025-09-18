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
    <html lang="en" className="mach-booting">
      <body className="bg-[#0b1016] text-white antialiased">
        {/* SSR boot overlay: covers the screen on first paint to prevent a pre-hydration flash */}
        <div id="boot-overlay" aria-hidden="true" className="fixed inset-0 z-[10000]">
          <div className="absolute inset-0 bg-[#0b1016]" />
          <div
            className="absolute inset-0 opacity-[0.14] mix-blend-screen"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.12) 1px, transparent 1px)",
              backgroundSize: "22px 22px, 22px 22px",
              backgroundPosition: "center center",
            }}
          />
        </div>

        <TransitionProvider>
          {children}
          <TransitionOverlay />
        </TransitionProvider>
      </body>
    </html>
  );
}
