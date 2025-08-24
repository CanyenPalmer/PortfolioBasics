"use client";

import * as React from "react";

type Props = {
  /** The line to type */
  text: string;
  /** Optional prompt prefix (e.g., "$ ", "> ") */
  prompt?: string;
  /** Tailwind / class names for the wrapper */
  className?: string;
  /** ms per character (lower = faster) */
  typingSpeed?: number;
  /** delay before typing after it becomes visible (ms) */
  startDelayMs?: number;
  /** Retype each time it re-enters view (never deletes while visible). Default: true */
  retypeOnReenter?: boolean;
  /** Intersection ratio (0..1) considered “in view”. Default: 0.6 */
  visibleThreshold?: number;
  /** Accessible label */
  ariaLabel?: string;
};

export default function InlineTypeLine({
  text,
  prompt = "",
  className = "",
  typingSpeed = 22,
  startDelayMs = 150,
  retypeOnReenter = true,
  visibleThreshold = 0.6,
  ariaLabel = "Typed line",
}: Props) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  // state machine
  const [started, setStarted] = React.useState(false);
  const [armed, setArmed] = React.useState(false);
  const [i, setI] = React.useState(0);
  const [done, setDone] = React.useState(false);

  // timers cleanup
  const timers = React.useRef<number[]>([]);
  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  // visibility observer
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= visibleThreshold) {
            // Reset and arm each time it re-enters (if enabled)
            clearTimers();
            if (retypeOnReenter) {
              setI(0);
              setDone(false);
              setStarted(false);
            }
            const t = window.setTimeout(() => {
              setArmed(true);
              setStarted(true);
            }, startDelayMs) as unknown as number;
            timers.current.push(t);
          } else {
            // paused out of view; keep rendered text; never delete while visible
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

  // typing loop
  React.useEffect(() => {
    if (!armed || !started || done) return;
    if (i >= text.length) {
      setDone(true);
      return;
    }
    const id = window.setTimeout(() => setI((n) => n + 1), typingSpeed) as unknown as number;
    timers.current.push(id);
    return () => window.clearTimeout(id);
  }, [armed, started, done, i, text.length, typingSpeed]);

  const shown = text.slice(0, i);

  return (
    <div ref={rootRef} aria-label={ariaLabel} className={className}>
      <span className="font-mono">
        {prompt && <span className="text-emerald-400">{prompt}</span>}
        <span>{done ? text : shown}</span>
        {/* Blinking block cursor always visible while typing; remains at end when done */}
        <span
          className="inline-block w-[8px] h-[1.1em] align-[-0.15em] bg-white/80 ml-1 animate-[blink_1s_steps(1)_infinite]"
          aria-hidden
        />
      </span>

      <style jsx>{`
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

function buildThresholds(core: number) {
  const steps = [0, 0.1, 0.25, 0.5, core, 0.75, 0.9, 1];
  return Array.from(new Set(steps)).sort((a, b) => a - b);
}
