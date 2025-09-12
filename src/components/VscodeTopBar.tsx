"use client";

import { Github, Linkedin, FileText } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full backdrop-blur bg-[#0b1016]/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-sm md:text-base tracking-wide text-white/80">
          <span className="opacity-60">~/</span> {signature}
        </span>

        <nav className="flex items-center gap-3">
          <Link
            href={resumeHref}
            className="px-3 py-1.5 rounded-lg text-sm ring-1 ring-white/15 hover:ring-white/30 transition inline-flex items-center gap-2"
          >
            <FileText size={16} />
            Resume
          </Link>
          <a
            href={linkedinHref}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg text-sm ring-1 ring-white/15 hover:ring-white/30 transition inline-flex items-center gap-2"
          >
            <Linkedin size={16} />
            LinkedIn
          </a>
          <a
            href={githubHref}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg text-sm ring-1 ring-white/15 hover:ring-white/30 transition inline-flex items-center gap-2"
          >
            <Github size={16} />
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
