"use client";

import * as React from "react";

type Line = {
  prompt?: string;
  text: string;
};

type Props = {
  lines: Line[];
  className?: string;
  typingSpeed?: number;   // ms per character
  lineDelay?: number;     // ms pause between lines
  ariaLabel?: string;

  /**
   * Retype each time the box re-enters the viewport.
   * While visible, it never deletes.
   */
  retypeOnReenter?: boolean;
  /** Intersection ratio (0..1) considered "in view". Default 0.6 */
  visibleThreshold?: number;
};

export default function TerminalBox({
  lines,
  className = "",
  typingSpeed = 24,
  lineDelay = 500,
  ariaLabel = "Terminal output",
  retypeOnReenter = true,
  visibleThreshold = 0.6,
}: Props) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  // typing state
  const [started, setStarted] = React.useState(false);
  const [lineIndex, setLineIndex] = React.useState(0);
  const [charIndex, setCharIndex] = React.useState(0);
  const [done, setDone] = React.useState(false);

  // Clear timers safely
  const timers = React.useRef<number[]>([]);
  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  // Visibility handling (retype on re-enter)
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= visibleThreshold) {
            if (retypeOnReenter) {
              clearTimers();
              setLineIndex(0);
              setCharIndex(0);
              setDone(false);
              setStarted(true);
            } else {
              setStarted((prev) => prev || true);
            }
          } else {
            // left view -> pause timers, but keep rendered text
            clearTimers();
            setStarted(false);
          }
        }
      },
      { threshold: buildThresholds(visibleThreshold) }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      clearTimers();
    };
  }, [retypeOnReenter, visibleThreshold]);

  // Typing loop
  React.useEffect(() => {
    if (!started || done) return;
    const cur = lines[lineIndex];
    if (!cur) {
      setDone(true);
      return;
    }

    if (charIndex >= cur.text.length) {
      const t = window.setTimeout(() => {
        if (lineIndex < lines.length - 1) {
          setLineIndex((i) => i + 1);
          setCharIndex(0);
        } else {
          setDone(true);
        }
      }, lineDelay) as unknown as number;
      timers.current.push(t);
      return () => window.clearTimeout(t);
    }

    const id = window.setTimeout(() => {
      setCharIndex((c) => c + 1);
    }, typingSpeed) as unknown as number;
    timers.current.push(id);
    return () => window.clearTimeout(id);
  }, [started, done, lines, lineIndex, charIndex, typingSpeed, lineDelay]);

  const rendered = lines.map((ln, i) => {
    const isActive = i === lineIndex && !done && started;
    // Already-completed lines show fully; active line shows partial; when finished, it remains.
    const text =
      i < lineIndex ? ln.text : isActive ? ln.text.slice(0, charIndex) : i === lineIndex && done ? ln.text : "";
    return { prompt: ln.prompt ?? "", text, isActive };
  });

  return (
    <div
      ref={rootRef}
      aria-label={ariaLabel}
      className={`rounded-xl overflow-hidden border border-white/10 bg-[#0f141b]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.35)] ${className}`}
      role="region"
    >
      {/* window header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 text-xs text-white/60">
        <span className="inline-flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        </span>
        <span className="ml-3 font-mono">terminal — portfolio</span>
      </div>

      {/* body */}
      <div className="px-4 py-5 font-mono text-[13px] leading-6 text-[#e6edf3]">
        <div className="space-y-1">
          {rendered.map((ln, i) => (
            <div key={i} className="whitespace-pre-wrap break-words">
              <span className="text-emerald-400">{ln.prompt}</span>
              <span className="align-middle">{ln.text}</span>
              {ln.isActive && (
                <span
                  className="inline-block w-[8px] h-[1.1em] align-[-0.15em] bg-white/80 ml-0.5 animate-[blink_1s_steps(1)_infinite]"
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}

/** Build a richer threshold list so the observer behaves smoothly near the cutoff. */
function buildThresholds(core: number) {
  const steps = [0, 0.1, 0.25, 0.5, core, 0.75, 0.9, 1];
  return Array.from(new Set(steps)).sort((a, b) => a - b);
}
