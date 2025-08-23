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
  zClass = "-z-10",
  laneHeightEm = 1.4,   // fixed lane height per line
  laneWidthCh = 40,     // clip width per line (characters)
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
  laneHeightEm?: number;
  laneWidthCh?: number;
}) {
  const base = `pointer-events-none select-none ${opacityClass} text-[10px] md:text-xs font-mono whitespace-pre`;

  // helper: a clipped lane container for one line of code
  const Lane = ({ children }: { children: React.ReactNode }) => (
    <div
      className="overflow-hidden"
      style={{ height: `${laneHeightEm}em`, maxWidth: `${laneWidthCh}ch` }}
    >
      {children}
    </div>
  );

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
              <Lane key={`t-${i}-${l.text}`}>
                <AnimatedCodeLine
                  text={l.text}
                  speedMs={speedMs}
                  startDelayMs={l.delay ?? i * 250}
                  className={base}
                />
              </Lane>
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
              <Lane key={`b-${i}-${l.text}`}>
                <AnimatedCodeLine
                  text={l.text}
                  speedMs={speedMs}
                  startDelayMs={l.delay ?? i * 250}
                  className={base}
                />
              </Lane>
            ))}
          </div>
        </div>
      )}

      {/* LEFT (vertical lanes) */}
      {left.length > 0 && (
        <div
          className="absolute top-0 bottom-0 overflow-hidden"
          style={{ left: -gap - strip, width: strip }}
        >
          <div className="h-full w-full py-2 flex flex-col items-center justify-between">
            {left.map((l, i) => (
              <div key={`l-${i}-${l.text}`} className="rotate-180">
                <span style={{ writingMode: "vertical-rl" }}>
                  <Lane>
                    <AnimatedCodeLine
                      text={l.text}
                      speedMs={speedMs}
                      startDelayMs={l.delay ?? i * 250}
                      className={base}
                    />
                  </Lane>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RIGHT (vertical lanes) */}
      {right.length > 0 && (
        <div
          className="absolute top-0 bottom-0 overflow-hidden"
          style={{ right: -gap - strip, width: strip }}
        >
          <div className="h-full w-full py-2 flex flex-col items-center justify-between">
            {right.map((l, i) => (
              <span key={`r-${i}-${l.text}`} style={{ writingMode: "vertical-rl" }}>
                <Lane>
                  <AnimatedCodeLine
                    text={l.text}
                    speedMs={speedMs}
                    startDelayMs={l.delay ?? i * 250}
                    className={base}
                  />
                </Lane>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
