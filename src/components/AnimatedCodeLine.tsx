"use client";
import React from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  text: string;
  speedMs?: number;
  holdAfterTypeMs?: number;
  holdAfterEraseMs?: number;
  startDelayMs?: number;
  loop?: boolean;
  className?: string;
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
  const [started, setStarted] = React.useState(!startWhenVisible);
  const ref = React.useRef<HTMLSpanElement>(null);

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

  React.useEffect(() => {
    if (!started) return;
    if (prefersReduced) {
      setDisplay(text);
      return;
    }
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
    const run = async () => {
      while (true) {
        // type out
        for (let i = 1; i <= text.length; i++) {
          setDisplay(text.slice(0, i));
          await sleep(speedMs);
        }
        await sleep(holdAfterTypeMs);

        // erase
        for (let i = text.length - 1; i >= 0; i--) {
          setDisplay(text.slice(0, i));
          await sleep(speedMs);
        }
        await sleep(holdAfterEraseMs);

        if (!loop) break;
      }
    };
    run();
  }, [started, prefersReduced, text, speedMs, holdAfterTypeMs, holdAfterEraseMs, loop]);

  return (
    <span ref={ref} className={`inline-flex items-center font-mono ${className}`}>
      <span aria-hidden="true" className="whitespace-pre">{display}</span>
      {/* block cursor */}
      <span
        aria-hidden="true"
        className="ml-[1px] inline-block h-[1.15em] w-[0.55ch] align-text-bottom bg-current opacity-70"
        style={{ translate: "0 0.08em" }}
      />
      <span className="sr-only">{text}</span>
    </span>
  );
}
