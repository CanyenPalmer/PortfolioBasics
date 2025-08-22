"use client";
import React from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  text: string;
  /** ms per character while typing/backspacing */
  speedMs?: number;
  /** pause after fully typed (ms) */
  holdAfterTypeMs?: number;
  /** pause after fully erased (ms) */
  holdAfterEraseMs?: number;
  /** start typing after this delay (ms) */
  startDelayMs?: number;
  /** loop forever */
  loop?: boolean;
  /** monospace + color inherit from parent; we only add the cursor */
  className?: string;
  /** whether to start when visible (IntersectionObserver) */
  startWhenVisible?: boolean;
};

export default function AnimatedCodeLine({
  text,
  speedMs = 28,
  holdAfterTypeMs = 900,
  holdAfterEraseMs = 500,
  startDelayMs = 0,
  loop = true,
  className = "",
  startWhenVisible = true,
}: Props) {
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = React.useState("");
  const [phase, setPhase] = React.useState<"idle"|"typing"|"hold"|"erasing">("idle");
  const [started, setStarted] = React.useState(!startWhenVisible);
  const ref = React.useRef<HTMLSpanElement>(null);

  // Visibility trigger
  React.useEffect(() => {
    if (!startWhenVisible || started) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setStarted(true);
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [startWhenVisible, started]);

  // Reduced motion: just show static text (no typing)
  React.useEffect(() => {
    if (!started) return;
    if (prefersReduced) {
      setDisplay(text);
      setPhase("hold");
      return;
    }
    // normal animation
    let t: number | undefined;

    const run = async () => {
      setPhase("idle");
      await sleep(startDelayMs);

      while (true) {
        // type
        setPhase("typing");
        for (let i = 1; i <= text.length; i++) {
          setDisplay(text.slice(0, i));
          await sleep(speedMs);
        }
        setPhase("hold");
        await sleep(holdAfterTypeMs);

        // erase
        setPhase("erasing");
        for (let i = text.length - 1; i >= 0; i--) {
          setDisplay(text.slice(0, i));
          await sleep(speedMs);
        }
        setPhase("hold");
        await sleep(holdAfterEraseMs);

        if (!loop) break;
      }
    };

    // run async
    run();
    return () => {
      if (t) window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, prefersReduced, text, speedMs, holdAfterTypeMs, holdAfterEraseMs, startDelayMs, loop]);

  return (
    <span ref={ref} className={`inline-flex items-center font-mono ${className}`}>
      <span aria-hidden="true" className="whitespace-pre">{display}</span>
      {/* block cursor */}
      <span
        aria-hidden="true"
        className="ml-[1px] inline-block h-[1.15em] w-[0.55ch] align-text-bottom bg-current opacity-70"
        style={{ translate: "0 0.08em" }}
      />
      {/* Accessible text for screen readers */}
      <span className="sr-only">{text}</span>
    </span>
  );
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
