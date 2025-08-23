"use client";
import AnimatedCodeLine from "./AnimatedCodeLine";

type EdgeLine = { text: string; delay?: number };

export default function CodeEdgesTyped({
  top = [],
  right = [],
  bottom = [],
  left = [],
  gap = 22,
  strip = 18,
  opacityClass = "text-white/25",
  speedMs = 28,
  zClass = "-z-10", // push behind the main content
}: {
  top?: EdgeLine[];
  right?: EdgeLine[];
  bottom?: EdgeLine[];
  left?: EdgeLine[];
  gap?: number;
  strip?: number;
  opacityClass?: string;
  speedMs?: number;
  zClass?: string;
}) {
  const base = `pointer-events-none select-none ${opacityClass} text-[10px] md:text-xs whitespace-pre`;

  return (
    <div aria-hidden className={`absolute inset-0 ${zClass}`}>
      {/* TOP */}
      {top.length > 0 && (
        <div
          className="absolute left-0 right-0 overflow-hidden"
          style={{ top: -gap - strip, height: strip }}
        >
          <div className="h-full w-full px-2 flex items-center justify-start gap-8">
            {top.map((l, i) => (
              <div key={`t-${i}-${l.text}`} className="h-[1.4em] overflow-hidden">
                <AnimatedCodeLine
                  text={l.text}
                  speedMs={speedMs}
                  startDelayMs={l.delay ?? i * 250}
                  className={base}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOTTOM */}
      {bottom.length > 0 && (
        <div
          className="absolute left-0 right-0 overflow-hidden"
          style={{ bottom: -gap - strip, height: strip }}
        >
          <div className="h-full w-full px-2 flex items-center justify-start gap-8">
            {bottom.map((l, i) => (
              <div key={`b-${i}-${l.text}`} className="h-[1.4em] overflow-hidden">
                <AnimatedCodeLine
                  text={l.text}
                  speedMs={speedMs}
                  startDelayMs={l.delay ?? i * 250}
                  className={base}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEFT (vertical) */}
      {left.length > 0 && (
        <div
          className="absolute top-0 bottom-0 overflow-hidden"
          style={{ left: -gap - strip, width: strip }}
        >
          <div className="h-full w-full py-2 flex flex-col items-center justify-between">
            {left.map((l, i) => (
              <div key={`l-${i}-${l.text}`} className="rotate-180 h-[8ch] overflow-hidden">
                <span style={{ writingMode: "vertical-rl" }}>
                  <AnimatedCodeLine
                    text={l.text}
                    speedMs={speedMs}
                    startDelayMs={l.delay ?? i * 250}
                    className={base}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RIGHT (vertical) */}
      {right.length > 0 && (
        <div
          className="absolute top-0 bottom-0 overflow-hidden"
          style={{ right: -gap - strip, width: strip }}
        >
          <div className="h-full w-full py-2 flex flex-col items-center justify-between">
            {right.map((l, i) => (
              <div key={`r-${i}-${l.text}`} className="h-[8ch] overflow-hidden">
                <span style={{ writingMode: "vertical-rl" }}>
                  <AnimatedCodeLine
                    text={l.text}
                    speedMs={speedMs}
                    startDelayMs={l.delay ?? i * 250}
                    className={base}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
