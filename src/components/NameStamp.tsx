"use client";

import React from "react";
import { Roboto_Mono, Playfair_Display, Outfit } from "next/font/google";
import { useOnceInView } from "@/hooks/useOnceInView";

const mono = Roboto_Mono({ subsets: ["latin"], weight: ["500"] });
const serif = Playfair_Display({ subsets: ["latin"], weight: ["700"] });
const brand = Outfit({ subsets: ["latin"], weight: ["800"] });

type NameStampProps = {
  text?: string;                  // default "Canyen Palmer"
  className?: string;             // pass in your size/weight utilities here
  rearmOnExit?: boolean;          // re-run when left & re-entered
  variant?: "hero" | "bar";       // "bar" = calmer timeline for VSCode top bar
};

const SYMBOLS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%+=-<>_[]{}/*";

export default function NameStamp({
  text = "Canyen Palmer",
  className = "",
  rearmOnExit = true,
  variant = "hero",
}: NameStampProps) {
  const { ref, entered } = useOnceInView<HTMLSpanElement>({
    threshold: 0.6,
    rearmOnExit,
  });

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [display, setDisplay] = React.useState(text);
  const [phase, setPhase] = React.useState<0 | 1 | 2>(2); // 0 mono, 1 serif, 2 final
  const [playing, setPlaying] = React.useState(false);

  const padLen = React.useMemo(() => text.length, [text]);

  React.useEffect(() => {
    if (prefersReduced) {
      setPhase(2);
      setDisplay(text);
      return;
    }
    if (!entered) return;

    setPlaying(true);
    let raf = 0;
    const start = performance.now();

    // Shorter sequence for the top bar
    const TOTAL = variant === "bar" ? 900 : 1400;
    const p1 = variant === "bar" ? 250 : 350; // scramble mono
    const p2 = variant === "bar" ? 500 : 750; // serif partial resolve
    const p3 = TOTAL;                         // final lock

    const tick = (now: number) => {
      const t = now - start;

      if (t <= p1) {
        // Phase 0 – scramble (mono)
        setPhase(0);
        const frac = t / p1; // 0..1
        setDisplay(scrambleTowards(text, padLen, frac * 0.5)); // ~50% correct by end
      } else if (t <= p2) {
        // Phase 1 – serif partial resolve
        setPhase(1);
        const frac = (t - p1) / (p2 - p1); // 0..1
        setDisplay(scrambleTowards(text, padLen, 0.6 + frac * 0.3)); // 60%→90%
      } else if (t <= p3) {
        // Phase 2 – final settle
        setPhase(2);
        const frac = (t - p2) / (p3 - p2);
        setDisplay(interpolateTowards(text, padLen, frac));
      } else {
        setPhase(2);
        setDisplay(text);
        setPlaying(false);
        cancelAnimationFrame(raf);
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [entered, prefersReduced, text, padLen, variant]);

  const fontClass =
    phase === 0 ? mono.className : phase === 1 ? serif.className : brand.className;

  return (
    <span
      ref={ref}
      className={[
        "relative inline-block align-baseline select-none",
        fontClass,
        className,
        playing ? "ns-playing" : "ns-static",
        variant === "bar" ? "ns-bar" : "ns-hero",
      ].join(" ")}
      aria-label={text}
    >
      <span className="relative">
        {/* chromatic shadows during play for edgy-cyber feel */}
        <span className="ns-chroma ns-red" aria-hidden="true">
          {display}
        </span>
        <span className="ns-chroma ns-cyan" aria-hidden="true">
          {display}
        </span>
        <span className="relative z-10">{display}</span>
      </span>

      <style jsx>{`
        .ns-chroma {
          position: absolute;
          inset: 0 auto auto 0;
          opacity: 0;
          transform: translateZ(0);
          pointer-events: none;
        }
        .ns-hero.ns-playing .ns-red {
          opacity: 0.35;
          color: rgba(255, 0, 0, 0.7);
          transform: translate(-1px, 0);
        }
        .ns-hero.ns-playing .ns-cyan {
          opacity: 0.35;
          color: rgba(0, 255, 255, 0.7);
          transform: translate(1px, 0);
        }
        .ns-bar.ns-playing .ns-red,
        .ns-bar.ns-playing .ns-cyan {
          opacity: 0.25;
          transform: translate(-0.5px, 0);
        }

        /* final stamp micro-pop on settle */
        .ns-hero.ns-static,
        .ns-bar.ns-static {
          animation: ns-stamp 260ms ease-out 1;
        }
        @keyframes ns-stamp {
          0% { transform: scale(1); text-shadow: 0 0 0 rgba(0,255,255,0); }
          50% { transform: scale(1.03); text-shadow: 0 0 14px rgba(0,255,255,0.18); }
          100% { transform: scale(1); text-shadow: 0 0 0 rgba(0,255,255,0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ns-chroma { display: none !important; }
          .ns-hero.ns-static, .ns-bar.ns-static { animation: none !important; }
        }
      `}</style>
    </span>
  );
}

/** Returns a string with a % of correct chars and the rest random symbols. */
function scrambleTowards(target: string, len: number, correctness: number) {
  const out: string[] = [];
  for (let i = 0; i < len; i++) {
    if (Math.random() < correctness) {
      out.push(target[i] ?? " ");
    } else {
      out.push(randSym());
    }
  }
  return out.join("");
}

/** Glides from random → correct with probability by character. */
function interpolateTowards(target: string, len: number, t: number) {
  const out: string[] = [];
  for (let i = 0; i < len; i++) {
    out.push(Math.random() < t ? target[i] ?? " " : randSym());
  }
  return out.join("");
}

function randSym() {
  const idx = (Math.random() * SYMBOLS.length) | 0;
  return SYMBOLS[idx];
}
