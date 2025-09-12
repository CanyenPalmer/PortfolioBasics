// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

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
        {children}
      </body>
    </html>
  );
}

# nothing 
