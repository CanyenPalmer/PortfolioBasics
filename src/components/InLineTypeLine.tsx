"use client";

import * as React from "react";

type Props = {
  text: string;
  prompt?: string;
  className?: string;
  typingSpeed?: number;
  startDelayMs?: number;
  retypeOnReenter?: boolean;
  visibleThreshold?: number;
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

  const [started, setStarted] = React.useState(false);
  const [armed, setArmed] = React.useState(false);
  const [i, setI] = React.useState(0);
  const [done, setDone] = React.useState(false);

  const timers = React.useRef<number[]>([]);
  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= visibleThreshold) {
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
        <span
          className="inline-block w-[8px] h-[1.1em] align-[-0.15em] bg-white/80 ml-1 animate-[blink_1s_steps(1)_infinite]"
          aria-hidden
        />
      </span>

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
