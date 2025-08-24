"use client";

import * as React from "react";
import TerminalBox from "./TerminalBox";

type Props = {
  proficiency: string[];
  familiarity: string[];
  techStack: string[];
  className?: string;
};

export default function SummaryRunner({
  proficiency,
  familiarity,
  techStack,
  className = "",
}: Props) {
  const [running, setRunning] = React.useState(false);

  // Optional: allow ESC to reset when terminal is open
  React.useEffect(() => {
    if (!running) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setRunning(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running]);

  return (
    <div className={`relative ${className}`}>
      {/* Code card (visible when not running) */}
      <div
        className={`rounded-xl overflow-hidden border border-white/10 bg-[#10151d]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.35)] transition-opacity duration-300 ${running ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <span className="inline-flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
            </span>
            <span className="ml-3 font-mono">summary.py</span>
          </div>
          <button
            onClick={() => setRunning(true)}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-[11px] font-medium text-white/90 hover:bg-white/10 transition"
            aria-label="Run code"
          >
            Run Code ▷
          </button>
        </div>

        <pre className="px-4 py-4 font-mono text-[13px] leading-6 text-[#e6edf3] whitespace-pre-wrap">
<span className="text-[#6a737d]"># build a quick portfolio summary</span>
<span className="block"><span className="text-[#c678dd]">def</span> <span className="text-[#61afef]">summary</span>():</span>
<span className="block">  <span className="text-[#c678dd]">return</span> {"{"}</span>
<span className="block">    <span className="text-[#98c379]">"proficiency"</span>: <span className="text-[#98c379]">"{proficiency.join(", ")}"</span>,</span>
<span className="block">    <span className="text-[#98c379]">"familiarities"</span>: <span className="text-[#98c379]">"{familiarity.join(", ")}"</span>,</span>
<span className="block">    <span className="text-[#98c379]">"tech_stack"</span>: <span className="text-[#98c379]">"{techStack.join(", ")}"</span></span>
<span className="block">  {"}"}</span>
<span className="block"></span>
<span className="block"><span className="text-[#c678dd]">if</span> <span className="text-[#d19a66]">__name__</span> == <span className="text-[#98c379]">"__main__"</span>:</span>
<span className="block">  <span className="text-[#56b6c2]">print</span>(<span className="text-[#61afef]">summary</span>())</span>
        </pre>
      </div>

      {/* Terminal overlay (visible when running) */}
      {running && (
        <div className="absolute inset-0">
          {/* Top bar with Reset */}
          <div className="flex items-center justify-between px-4 py-2 border border-b-0 border-white/10 rounded-t-xl bg-[#0f141b]/80 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <span className="inline-flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              </span>
              <span className="ml-3 font-mono">terminal — portfolio</span>
            </div>
            <button
              onClick={() => setRunning(false)}
              className="rounded-lg border border-white/20 px-3 py-1.5 text-[11px] font-medium text-white/90 hover:bg-white/10 transition"
              aria-label="Reset and return to code"
              title="Reset"
            >
              Reset ↺
            </button>
          </div>

          {/* Terminal body (retypes each time it re-enters view; never deletes while visible) */}
          <TerminalBox
            className="rounded-b-xl border border-t-0 border-white/10 bg-[#0f141b]/70 h-[calc(100%-36px)]"
            typingSpeed={22}
            lineDelay={420}
            retypeOnReenter={true}
            visibleThreshold={0.6}
            startDelayMs={200}
            lines={[
              { prompt: "$ ", text: "python summary.py" },
              { prompt: "> ", text: "whoami" },
              {
                prompt: "> ",
                text: "Data Scientist & Google-Certified Data Analyst Professional",
              },
              { prompt: "$ ", text: "proficiency" },
              { prompt: "> ", text: proficiency.join(", ") },
              { prompt: "$ ", text: "familiarities" },
              { prompt: "> ", text: familiarity.join(", ") },
              { prompt: "$ ", text: "tech_stack --list" },
              { prompt: "> ", text: techStack.join(", ") },
            ]}
          />
        </div>
      )}
    </div>
  );
}
