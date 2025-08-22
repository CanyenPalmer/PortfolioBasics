import "./globals.css";  // ✅ imports Tailwind + global styles

export const metadata = {
  title: "Canyen Palmer",
  description: "Portfolio of Canyen Palmer – Data Scientist & Data Analyst",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0b0b0c] text-white">
        {children}
      </body>
    </html>
  );
}
