// src/app/layout.tsx
import "./globals.css"; // ✅ this makes Tailwind styles apply

export const metadata = { title: "Canyen Palmer", description: "Portfolio" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
