"use client";

import * as React from "react";

type Segment = { text: string; className?: string };
type Line =
  | { prompt?: string; text: string }                           // simple text line
  | { prompt?: string; segments: Segment[] };                   // colored segments

type Props = {
  lines: Line[];
  className?: string;
  typingSpeed?: number;   // ms per character
  lineDelay?: number;     // ms pause between lines
  ariaLabel?: string;
  retypeOnReenter?: boolean;
  visibleThreshold?: number;
  startDelayMs?: number;
  keepCursorOnDone?: boolean;
};

export default function TerminalBox({
  lines,
  className = "",
  typingSpeed = 24,
  lineDelay = 500,
  ariaLabel = "Terminal output",
  retypeOnReenter = true,
  visibleThreshold = 0.6,
  startDelayMs = 0,
  keepCursorOnDone = false,
}: Props) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  // typing state
  const [armed, setArmed] = React.useState(false);
  const [started, setStarted] = React.useState(false);
  const [lineIndex, setLineIndex] = React.useState(0);
  const [charIndex, setCharIndex] = React.useState(0);
  const [done, setDone] = React.useState(false);

  // timers
  const timers = React.useRef<number[]>([]);
  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  // visibility observer (retype on re-enter)
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= visibleThreshold) {
            clearTimers();
            if (retypeOnReenter) {
              setLineIndex(0);
              setCharIndex(0);
              setDone(false);
              setStarted(false);
            }
            const tid = window.setTimeout(() => {
              setArmed(true);
              setStarted(true);
            }, startDelayMs) as unknown as number;
            timers.current.push(tid);
          } else {
            clearTimers();
            setStarted(false);
            setArmed(false);
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
  }, [retypeOnReenter, visibleThreshold, startDelayMs]);

  // Return the full plain text of a line (used for typing counts)
  const getFullText = (ln: Line) =>
    "text" in ln ? ln.text : ln.segments.map((s) => s.text).join("");

  // Typing loop
  React.useEffect(() => {
    if (!armed || !started || done) return;
    const cur = lines[lineIndex];
    if (!cur) {
      setDone(true);
      return;
    }

    const full = getFullText(cur);
    if (charIndex >= full.length) {
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
  }, [armed, started, done, lines, lineIndex, charIndex, typingSpeed, lineDelay]);

  // Render a line with partial characters visible (supports segments)
  const renderLineBody = (ln: Line, isActive: boolean, isFinalAndDone: boolean) => {
    const prompt = (ln as any).prompt ?? "";
    const full = getFullText(ln);

    let visibleCount: number;
    if (done && isFinalAndDone) {
      visibleCount = full.length;
    } else if (isActive && !done) {
      visibleCount = Math.min(charIndex, full.length);
    } else if (lines.indexOf(ln) < lineIndex) {
      visibleCount = full.length;
    } else {
      visibleCount = 0;
    }

    // Build colored spans up to visibleCount
    const spans: React.ReactNode[] = [];
    if ("text" in ln) {
      const show = ln.text.slice(0, visibleCount);
      spans.push(<span key="t">{show}</span>);
    } else {
      let remaining = visibleCount;
      ln.segments.forEach((seg, i) => {
        if (remaining <= 0) return;
        const take = Math.min(seg.text.length, remaining);
        const show = seg.text.slice(0, take);
        spans.push(
          <span key={i} className={seg.className ?? ""}>
            {show}
          </span>
        );
        remaining -= take;
      });
    }

    // Cursor visibility
    const showCursor = (isActive && !done) || (keepCursorOnDone && isFinalAndDone);
    return (
      <>
        <span className="text-emerald-400">{prompt}</span>
        {spans}
        {showCursor && (
          <span
            className="inline-block w-[8px] h-[1.1em] align-[-0.15em] bg-white/80 ml-0.5 animate-[blink_1s_steps(1)_infinite]"
            aria-hidden
          />
        )}
      </>
    );
  };

  return (
    <div
      ref={rootRef}
      aria-label={ariaLabel}
      className={`rounded-xl overflow-hidden border border-white/10 bg-[#0f141b]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.35)] ${className}`}
      role="region"
    >
      {/* header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 text-xs text-white/60">
        <span className="inline-flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        </span>
        <span className="ml-3 font-mono">terminal — portfolio</span>
      </div>

      {/* body (scrollable just in case; prevents clipping) */}
      <div className="px-4 py-5 font-mono text-[13px] leading-6 text-[#e6edf3] overflow-auto">
        <div className="space-y-1 whitespace-pre-wrap break-words">
          {lines.map((ln, i) => {
            const isActive = i === lineIndex && !done && started;
            const isFinalAndDone = done && i === lines.length - 1;
            return (
              <div key={i}>
                {renderLineBody(ln, isActive, isFinalAndDone)}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}

function buildThresholds(core: number) {
  const steps = [0, 0.1, 0.25, 0.5, core, 0.75, 0.9, 1];
  return Array.from(new Set(steps)).sort((a, b) => a - b);
}
