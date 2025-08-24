"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TerminalBox from "./TerminalBox";

type Props = {
  proficiency: string[];
  familiarity: string[];
  techStack: string[];
  className?: string;
  minHeightPx?: number;
  minHeightPxMd?: number;
};

export default function SummaryRunner({
  proficiency,
  familiarity,
  techStack,
  className = "",
  minHeightPx = 300,
  minHeightPxMd = 380,
}: Props) {
  const [running, setRunning] = React.useState(false);

  React.useEffect(() => {
    if (!running) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setRunning(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running]);

  const minHStyle = { minHeight: `${minHeightPx}px` } as React.CSSProperties;

  return (
    <div className={`relative ${className}`} style={minHStyle}>
      <style jsx>{`
        @media (min-width: 768px) {
          div[data-summary-runner] { min-height: ${minHeightPxMd}px; }
        }
      `}</style>
      <div data-summary-runner />

      {/* Code card */}
      <AnimatePresence initial={false}>
        {!running && (
          <motion.div
            key="code"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -4, transition: { duration: 0.18 } }}
            className="absolute inset-0 rounded-xl overflow-hidden border border-white/10 bg-[#10151d]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.35)]"
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

            {/* summary.py contents with subtle syntax highlighting */}
            <pre className="px-4 py-4 font-mono text-[13px] leading-6 text-[#e6edf3] whitespace-pre-wrap h-[calc(100%-36px)] overflow-auto">
<span className="text-[#6a737d]"># Run_For_Details</span>
<span className="block"></span>
<span className="block"><span className="text-[#c678dd]">def</span> <span className="text-[#61afef]">summary</span>():</span>
<span className="block">  <span className="text-[#c678dd]">return</span> {"{"}</span>
<span className="block">    <span className="text-[#98c379]">'canyen_palmer_title'</span>: <span className="text-[#98c379]">'Data Scientist & Google-Certified Data Analyst Professional'</span>,</span>
<span className="block">    <span className="text-[#98c379]">'proficiency'</span>: <span className="text-[#d19a66]">[{stringList(proficiency)}]</span>,</span>
<span className="block">    <span className="text-[#98c379]">'familiarities'</span>: <span className="text-[#d19a66]">[{stringList(familiarity)}]</span>,</span>
<span className="block">    <span className="text-[#98c379]">'tech_stack'</span>: <span className="text-[#d19a66]">[{stringList(techStack)}]</span>,</span>
<span className="block">  {"}"}</span>
<span className="block"></span>
<span className="block"><span className="text-[#c678dd]">if</span> <span className="text-[#d19a66]">__name__</span> == <span className="text-[#98c379]">"__main__"</span>:</span>
<span className="block">  <span className="text-[#56b6c2]">print</span>(<span className="text-[#61afef]">summary</span>())</span>
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal overlay */}
      <AnimatePresence initial={false}>
        {running && (
          <motion.div
            key="term"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.18 } }}
            className="absolute inset-0 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-2 border border-b-0 border-white/10 rounded-t-xl bg-[#0f141b]/80 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <span className="inline-flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                </span>
                <span className="ml-3 font-mono">summary.py — terminal</span>
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

            <div className="rounded-b-xl border border-t-0 border-white/10 bg-[#0f141b]/70 grow min-h-0">
              <TerminalBox
                className="h-full"
                typingSpeed={22}
                lineDelay={360}
                retypeOnReenter={true}
                visibleThreshold={0.6}
                startDelayMs={150}
                keepCursorOnDone={true}
                lines={[
                  { prompt: "$ ", text: "python summary.py" },
                  { prompt: "$ ", text: "compiling..." },

                  { segments: [{ text: "{", className: "text-[#e6edf3]" }] },

                  {
                    segments: [
                      { text: "  ", className: "" },
                      { text: "'", className: "text-[#e6edf3]" },
                      { text: "canyen_palmer_title", className: "text-[#56b6c2]" },
                      { text: "'", className: "text-[#e6edf3]" },
                      { text: ": ", className: "text-[#e6edf3]" },
                      { text: "'", className: "text-[#e6edf3]" },
                      { text: "Data Scientist & Google-Certified Data Analyst Professional", className: "text-[#98c379]" },
                      { text: "'", className: "text-[#e6edf3]" },
                      { text: ",", className: "text-[#e6edf3]" },
                    ],
                  },

                  listLine("proficiency", proficiency),
                  listLine("familiarities", familiarity),
                  listLine("tech_stack", techStack, true),

                  { segments: [{ text: "}", className: "text-[#e6edf3]" }] },
                ]}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Helpers */
function stringList(items: string[]) {
  return items.map((s) => `'${s}'`).join(", ");
}

function listLine(key: string, items: string[], isLast = false) {
  const segs = [
    { text: "  ", className: "" },
    { text: "'", className: "text-[#e6edf3]" },
    { text: key, className: "text-[#56b6c2]" },
    { text: "'", className: "text-[#e6edf3]" },
    { text: ": ", className: "text-[#e6edf3]" },
    { text: "[", className: "text-[#e6edf3]" },
    ...items.flatMap((it, idx) => {
      const comma = idx < items.length - 1 ? "," : "";
      return [
        { text: "'", className: "text-[#e6edf3]" },
        { text: it, className: "text-[#98c379]" },
        { text: "'", className: "text-[#e6edf3]" },
        { text: comma + (comma ? " " : ""), className: "text-[#e6edf3]" },
      ];
    }),
    { text: "]", className: "text-[#e6edf3]" },
    { text: isLast ? "" : ",", className: "text-[#e6edf3]" },
  ];
  return { segments: segs };
}
