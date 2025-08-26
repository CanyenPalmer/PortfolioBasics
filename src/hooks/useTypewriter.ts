"use client";

import * as React from "react";

export type TypewriterOptions = {
  /** Milliseconds per character */
  speed?: number;
  /** Delay before typing begins (ms) */
  startDelay?: number;
  /** Optional typing callback per character */
  onTypeChar?: (index: number, char: string) => void;
};

/**
 * useTypewriter
 * - Replays from the start whenever `text` changes.
 * - Returns the progressively typed string and a boolean `done`.
 */
export function useTypewriter(text: string, opts: TypewriterOptions = {}) {
  const { speed = 12, startDelay = 80, onTypeChar } = opts;
  const [output, setOutput] = React.useState("");
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    setOutput("");
    setDone(false);

    if (!text || text.length === 0) {
      setDone(true);
      return;
    }

    let i = 0;
    let intervalId: number | undefined;

    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        i++;
        const next = text.slice(0, i);
        setOutput(next);
        onTypeChar?.(i - 1, text[i - 1] ?? "");

        if (i >= text.length) {
          window.clearInterval(intervalId);
          setDone(true);
        }
      }, Math.max(1, speed));
    }, Math.max(0, startDelay));

    return () => {
      window.clearTimeout(startId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [text, speed, startDelay, onTypeChar]);

  return { output, done };
}
