"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TerminalBox from "./TerminalBox";

type Props = {
  proficiency: string[];
  familiarity: string[];
  techStack: string[];
  className?: string;
  /** Control height so terminal never cuts off (you can override via className too) */
  minHeightPx?: number;         // default ~300
  minHeightPxMd?: number;       // default ~380 for md+
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

  // ESC to reset when terminal is open
  React.useEffect(() => {
    if (!running) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setRunning(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running]);

  // computed style to guarantee space for terminal + header without clipping
  const minHStyle = { minHeight: `${minHeightPx}px` } as React.CSSProperties;

  // Build pretty Python dict output lines
  const dictLines = buildDictLines({
    title: "Data Scientist & Google-Certified Data Analyst Professional",
    proficiency,
    familiarity,
    techStack,
  });

  return (
    <div className={`relative ${className}`} style={minHStyle}>
      <style jsx>{`
        @media (min-width: 768px) {
          div[data-summary-runner] { min-height: ${minHeightPxMd}px; }
        }
      `}</style>
      <div data-summary-runner />

      {/* ----- Code card (shown when not running) ----- */}
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

            {/* Richer syntax highlighting + a playful TODO */}
            <pre className="px-4 py-4 font-mono text-[13px] leading-6 text-[#e6edf3] whitespace-pre-wrap h-[calc(100%-36px)] overflow-auto">
<span className="text-[#6a737d]"># quick portfolio summary generator</span>
<span className="block"><span className="text-[#c678dd]">def</span> <span className="text-[#61afef]">summary</span>():</span>
<span className="block">  <span className="text-[#c678dd]">return</span> {"{"}</span>
<span className="block">    <span className="text-[#98c379]">'canyen_palmer_title'</span>: <span className="text-[#98c379]">'Data Scientist & Google-Certified Data Analyst Professional'</span>,</span>
<span className="block">    <span className="text-[#98c379]">'proficiency'</span>: <span className="text-[#d19a66]">[{stringList(proficiency)}]</span>,</span>
<span className="block">    <span className="text-[#98c379]">'familiarities'</span>: <span className="text-[#d19a66]">[{stringList(familiarity)}]</span>,</span>
<span className="block">    <span className="text-[#98c379]">'tech_stack'</span>: <span className="text-[#d19a66]">[{stringList(techStack)}]</span>,</span>
<span className="block">  {"}"}</span>
<span className="block"></span>
<span className="text-[#6a737d]"># TODO: wire this to a live dataset → pretty-print w/ pandas</span>
<span className="block"><span className="text-[#c678dd]">if</span> <span className="text-[#d19a66]">__name__</span> == <span className="text-[#98c379]">"__main__"</span>:</span>
<span className="block">  <span className="text-[#56b6c2]">print</span>(<span className="text-[#61afef]">summary</span>())</span>
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----- Terminal overlay (appears when running) ----- */}
      <AnimatePresence initial={false}>
        {running && (
          <motion.div
            key="term"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.18 } }}
            className="absolute inset-0 flex flex-col"
          >
            {/* Terminal header with consistent filename */}
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

            {/* Terminal body fills remaining height; never clipped */}
            <div className="rounded-b-xl border border-t-0 border-white/10 bg-[#0f141b]/70 grow min-h-0">
              <TerminalBox
                className="h-full"
                typingSpeed={22}
                lineDelay={360}
                retypeOnReenter={true}
                visibleThreshold={0.6}
                startDelayMs={150}
                keepCursorOnDone={true}     // <-- leave cursor blinking at the end
                lines={[
                  { prompt: "$ ", text: "python summary.py" },
                  { prompt: "$ ", text: "compiling..." },
                  // Now print a real-looking Python dict (pretty format)
                  { prompt: "",   text: "{" },
                  { prompt: "  ", text: `'canyen_palmer_title': 'Data Scientist & Google-Certified Data Analyst Professional',` },
                  { prompt: "  ", text: `'proficiency': [${stringList(proficiency)}],` },
                  { prompt: "  ", text: `'familiarities': [${stringList(familiarity)}],` },
                  { prompt: "  ", text: `'tech_stack': [${stringList(techStack)}]` },
                  { prompt: "",   text: "}" },
                  // We intentionally do NOT print a new "$ " prompt line,
                  // so the cursor remains at the end of the "}" (more dramatic).
                ]}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Build a pretty-printed list of single-quoted items */
function stringList(items: string[]) {
  return items.map((s) => `'${s}'`).join(", ");
}

/** Build array of dict output lines (unused helper if you prefer single-call construction) */
function buildDictLines({
  title,
  proficiency,
  familiarity,
  techStack,
}: {
  title: string;
  proficiency: string[];
  familiarity: string[];
  techStack: string[];
}) {
  return [
    "{",
    `  'canyen_palmer_title': '${title}',`,
    `  'proficiency': [${stringList(proficiency)}],`,
    `  'familiarities': [${stringList(familiarity)}],`,
    `  'tech_stack': [${stringList(techStack)}]`,
    "}",
  ];
}
