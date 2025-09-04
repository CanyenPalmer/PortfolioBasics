"use client";

import { useCallback } from "react";

// If you already have a cn() helper, swap this for your import.
// Otherwise this tiny helper is fine.
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  /** Keep passing whatever you already pass today. */
  activeSection?: "home" | "experience" | "services" | "projects" | string | null;
  /** If your page already provides a custom smooth-scroll, we’ll use it. */
  onJump?: (id: string) => void;
};

/** Order exactly as you requested: Home, Experience, My Services, Projects. */
const NODES: { id: "home" | "experience" | "services" | "projects"; label: string }[] = [
  { id: "home",       label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "services",   label: "My Services" },
  { id: "projects",   label: "Projects" }, // ← NEW
];

export default function VSCodeBar({ activeSection, onJump }: Props) {
  const jump = useCallback(
    (id: string) => {
      if (onJump) return onJump(id); // use your existing scroll function, if provided
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [onJump]
  );

  return (
    <nav className="sticky top-0 z-40 border-b border-cyan-400/20 bg-slate-950/70 backdrop-blur">
      <ul className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2">
        {NODES.map((n) => {
          const isActive = activeSection === n.id; // your current scroll-spy can keep setting this
          return (
            <li key={n.id}>
              <button
                onClick={() => jump(n.id)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-200"
                    : "border-cyan-400/20 bg-transparent text-cyan-300 hover:bg-cyan-400/5"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {n.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
