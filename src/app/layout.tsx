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
      {/* Inline the two critical rules so they apply BEFORE your CSS loads */}
      <head>
        <style
          // These two rules prevent any content from flashing before hydration.
          dangerouslySetInnerHTML={{
            __html: `
              html.mach-booting body { overflow: hidden; }
              html.mach-booting body > *:not(#boot-overlay) { visibility: hidden !important; }
            `,
          }}
        />
      </head>
      <body className="bg-[#0b1016] text-white antialiased">
        {/* SSR boot overlay: inline-styled so it renders correctly at TTFP (no Tailwind needed) */}
        <div
          id="boot-overlay"
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0 as any,
            zIndex: 10000,
            // Set the background color inline so we don't depend on Tailwind for first paint.
            backgroundColor: "#0b1016",
          }}
        >
          {/* Subtle grid (also fully inline-styled) */}
          <div
            style={{
              position: "absolute",
              inset: 0 as any,
              opacity: 0.14,
              mixBlendMode: "screen",
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

