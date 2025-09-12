"use client";

import Link from "next/link";

type Props = {
  resumeHref: string;
  linkedinHref: string;
  githubHref: string;
  signature?: string;
};

export default function VscodeTopBar({
  resumeHref,
  linkedinHref,
  githubHref,
  signature = "Canyen Palmer",
}: Props) {
  return (
    <header className="sticky top-0 z-50 bg-[#0b1016]/85 backdrop-blur supports-[backdrop-filter]:bg-[#0b1016]/60 border-b border-white/10">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        {/* VSCode window controls */}
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="inline-block h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="inline-block h-3 w-3 rounded-full bg-[#28c840]" />
        </div>

        {/* navigation tabs */}
        <ul className="hidden md:flex items-center gap-5 text-sm text-white/70">
          <li className="hover:text-white"><a href="#home">Home</a></li>
          <li className="hover:text-white"><a href="#about">About</a></li>
          <li className="hover:text-white"><a href="#education">Education</a></li>
          <li className="hover:text-white"><a href="#experience">Experience</a></li>
          <li className="hover:text-white"><a href="#projects">Projects</a></li>
          <li className="hover:text-white"><a href="#testimonials">Testimonials</a></li>
          <li className="hover:text-white"><a href="#contact">Contact</a></li>
        </ul>

        <div className="grow" />

        {/* external links */}
        <div className="flex items-center gap-4 text-sm">
          <Link
            href={resumeHref}
            className="rounded-lg px-3 py-1.5 ring-1 ring-white/15 hover:ring-white/30 hover:bg-white/[0.05] transition"
          >
            Resume
          </Link>
          <a
            href={linkedinHref}
            target="_blank"
            rel="noreferrer"
            className="text-white/70 hover:text-white"
          >
            LinkedIn
          </a>
          <a
            href={githubHref}
            target="_blank"
            rel="noreferrer"
            className="text-white/70 hover:text-white"
          >
            GitHub
          </a>
          <span className="hidden md:inline text-white/50">|</span>
          <span className="hidden md:inline text-white/70">{signature}</span>
        </div>
      </nav>
    </header>
  );
}
