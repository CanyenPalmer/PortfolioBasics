# create the file with the correct name (if missing)
mkdir -p src/components
cat > src/components/CodeEdgesTyped.tsx << 'EOF'
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
}: {
  top?: EdgeLine[];
  right?: EdgeLine[];
  bottom?: EdgeLine[];
  left?: EdgeLine[];
  gap?: number;
  strip?: number;
  opacityClass?: string;
  speedMs?: number;
}) {
  const base = `pointer-events-none select-none ${opacityClass} text-[10px] md:text-xs`;

  return (
    <div aria-hidden className="absolute inset-0">
      {/* TOP */}
      {top.length > 0 && (
        <div className="absolute left-0 right-0" style={{ top: -gap - strip, height: strip }}>
          <div className="h-full w-full px-2 flex items-center justify-between gap-6">
            {top.map((l, i) => (
              <AnimatedCodeLine
                key={`t-${i}-${l.text}`}
                text={l.text}
                speedMs={speedMs}
                startDelayMs={l.delay ?? i * 250}
                className={base}
              />
            ))}
          </div>
        </div>
      )}

      {/* BOTTOM */}
      {bottom.length > 0 && (
        <div className="absolute left-0 right-0" style={{ bottom: -gap - strip, height: strip }}>
          <div className="h-full w-full px-2 flex items-center justify-between gap-6">
            {bottom.map((l, i) => (
              <AnimatedCodeLine
                key={`b-${i}-${l.text}`}
                text={l.text}
                speedMs={speedMs}
                startDelayMs={l.delay ?? i * 250}
                className={base}
              />
            ))}
          </div>
        </div>
      )}

      {/* LEFT (vertical) */}
      {left.length > 0 && (
        <div className="absolute top-0 bottom-0" style={{ left: -gap - strip, width: strip }}>
          <div className="h-full w-full py-2 flex flex-col items-center justify-between">
            {left.map((l, i) => (
              <div key={`l-${i}-${l.text}`} className="rotate-180">
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
        <div className="absolute top-0 bottom-0" style={{ right: -gap - strip, width: strip }}>
          <div className="h-full w-full py-2 flex flex-col items-center justify-between">
            {right.map((l, i) => (
              <span key={`r-${i}-${l.text}`} style={{ writingMode: "vertical-rl" }}>
                <AnimatedCodeLine
                  text={l.text}
                  speedMs={speedMs}
                  startDelayMs={l.delay ?? i * 250}
                  className={base}
                />
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
EOF
