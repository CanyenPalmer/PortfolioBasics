"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ProjectTopBar({
  prevHref,
  nextHref,
}: {
  prevHref: string;
  nextHref: string;
}) {
  // always reassert the session flag while navigating within project pages
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("cameFromProjects", "1");
    }
  }, []);

  const flags = { onClick: () => window.sessionStorage.setItem("cameFromProjects", "1") };

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1016]/70 backdrop-blur supports-[backdrop-filter]:bg-[#0b1016]/50">
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <div className="text-sm font-semibold tracking-tight">Canyen Palmer</div>
        <nav className="flex items-center gap-6 text-sm text-white/80">
          <Link href={prevHref} {...flags} className="hover:text-white">Previous</Link>
          <Link href="/#projects" className="hover:text-white">Projects Home</Link>
          <Link href={nextHref} {...flags} className="hover:text-white">Next</Link>
        </nav>
      </div>
    </div>
  );
}
