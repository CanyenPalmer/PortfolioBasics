export const metadata = { title: "Canyen Palmer", description: "Portfolio" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
