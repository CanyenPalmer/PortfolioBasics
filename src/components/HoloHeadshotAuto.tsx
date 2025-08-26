"use client";

import * as React from "react";

type Props = {
  src: string;               // e.g. "/images/headshot.jpg"
  alt?: string;
  className?: string;
  glowColor?: string;
  /** 0..1 — higher = sharper edge (less feather) */
  edgeSharpness?: number;
  /** downscale the image for faster segmentation — 1 = full, 0.5 = half, etc. */
  scale?: number;

  /** extra: make it feel intentionally broken */
  glitch?: boolean;
  glitchEveryMs?: number;     // cadence between bursts
  glitchDurationMs?: number;  // how long each burst lasts
  posterizeLevels?: number;   // 0/1 to skip; 3..8 recommended
};

export default function HoloHeadshotAuto({
  src,
  alt = "Hologram",
  className = "",
  glowColor = "rgba(0, 200, 255, 0.75)",
  edgeSharpness = 0.65,
  scale = 0.75,

  glitch = true,
  glitchEveryMs = 2600,
  glitchDurationMs = 420,
  posterizeLevels = 5,
}: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [glitchOn, setGlitchOn] = React.useState(false);
  const glitchTimer = React.useRef<number | null>(null);
  const glitchOffTimer = React.useRef<number | null>(null);

  // Periodic glitch trigger (CSS-only visual overlays)
  React.useEffect(() => {
    if (!glitch) return;
    const tick = () => {
      setGlitchOn(true);
      // turn off after duration
      glitchOffTimer.current = window.setTimeout(() => setGlitchOn(false), glitchDurationMs) as unknown as number;
    };
    // initial slight random offset so it doesn't sync with other animations
    const startDelay = 300 + Math.random() * 400;
    const startId = window.setTimeout(() => {
      tick();
      glitchTimer.current = window.setInterval(tick, glitchEveryMs) as unknown as number;
    }, startDelay) as unknown as number;

    return () => {
      window.clearTimeout(startId as unknown as number);
      if (glitchTimer.current) window.clearInterval(glitchTimer.current);
      if (glitchOffTimer.current) window.clearTimeout(glitchOffTimer.current);
    };
  }, [glitch, glitchEveryMs, glitchDurationMs]);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Dynamic imports so build/SSR doesn’t try to bundle them
        await import("@tensorflow/tfjs");
        const bodyPixMod = await import("@tensorflow-models/body-pix");
        const bodyPix = (bodyPixMod as any).default ?? bodyPixMod;

        const net = await bodyPix.load({
          architecture: "MobileNetV1",
          outputStride: 16,
          multiplier: 0.75,
          quantBytes: 2,
        });

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        await new Promise<void>((res, rej) => {
          img.onload = () => res();
          img.onerror = () => rej(new Error("Failed to load image"));
        });
        if (cancelled) return;

        const seg = await net.segmentPerson(img, {
          internalResolution: "medium",
          segmentationThreshold: 0.7,
        });
        if (cancelled) return;

        const fullW = img.naturalWidth;
        const fullH = img.naturalHeight;

        // Build alpha mask (soft edge)
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = fullW;
        maskCanvas.height = fullH;
        const mctx = maskCanvas.getContext("2d", { willReadFrequently: true })!;
        const maskImg = mctx.createImageData(fullW, fullH);
        const md = maskImg.data;

        const neighbors = (x: number, y: number) => {
          let sum = 0, count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const xx = x + dx, yy = y + dy;
              if (xx >= 0 && yy >= 0 && xx < fullW && yy < fullH) {
                const idx = yy * fullW + xx;
                sum += seg.data[idx] ? 1 : 0;
                count++;
              }
            }
          }
          return sum / count; // 0..1
        };

        for (let y = 0; y < fullH; y++) {
          for (let x = 0; x < fullW; x++) {
            const idx = y * fullW + x;
            const i4 = idx * 4;
            const k = neighbors(x, y);
            const sharpened = Math.pow(k, edgeSharpness);
            md[i4 + 0] = 255;
            md[i4 + 1] = 255;
            md[i4 + 2] = 255;
            md[i4 + 3] = Math.round(sharpened * 255);
          }
        }
        mctx.putImageData(maskImg, 0, 0);

        // Composite to output canvas
        const out = canvasRef.current;
        if (!out) return;
        out.width = fullW;
        out.height = fullH;
        const octx = out.getContext("2d")!;
        octx.clearRect(0, 0, fullW, fullH);

        const temp = document.createElement("canvas");
        temp.width = fullW;
        temp.height = fullH;
        const tctx = temp.getContext("2d")!;
        tctx.drawImage(img, 0, 0);

        // inject mask alpha
        const td = tctx.getImageData(0, 0, fullW, fullH);
        const ta = td.data;
        const ma = mctx.getImageData(0, 0, fullW, fullH).data;
        for (let i = 0; i < ta.length; i += 4) {
          ta[i + 3] = ma[i + 3];
        }

        // optional posterize (gives a more synthetic/phosphor feel)
        if (posterizeLevels && posterizeLevels >= 2) {
          const levels = Math.max(2, Math.min(16, Math.floor(posterizeLevels)));
          const step = 255 / (levels - 1);
          for (let i = 0; i < ta.length; i += 4) {
            // only affect visible pixels
            if (ta[i + 3] > 6) {
              ta[i + 0] = Math.round(ta[i + 0] / step) * step;
              ta[i + 1] = Math.round(ta[i + 1] / step) * step;
              ta[i + 2] = Math.round(ta[i + 2] / step) * step;
            }
          }
        }

        tctx.putImageData(td, 0, 0);
        octx.drawImage(temp, 0, 0);

        setReady(true);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Model/image load failed");
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [src, edgeSharpness, scale, posterizeLevels]);

  // Build 6 glitch bar configs (top/height/phase vary slightly each render)
  const bars = React.useMemo(() => {
    const out: Array<{ top: string; height: string; delay: number; skew: number }> = [];
    let y = 6;
    for (let i = 0; i < 6; i++) {
      const h = 6 + Math.round(Math.random() * 7); // 6–13%
      const delay = Math.random() * 0.25;          // 0–0.25s phase
      const skew = (Math.random() - 0.5) * 1.2;    // small skew
      out.push({ top: `${y}%`, height: `${h}%`, delay, skew });
      y += h + 3 + Math.round(Math.random() * 4);
      if (y > 85) break;
    }
    return out;
  }, []); // compute once per mount so it doesn't jump constantly

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/15 ${className}`}
      style={{ background: "#080c11" }}
    >
      {/* Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 1,
          borderRadius: 16,
          boxShadow: `0 0 38px ${glowColor}, 0 0 140px ${glowColor}`,
          opacity: 0.5,
          filter: "blur(0.6px)",
        }}
      />

      {/* Pixel grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 3,
          borderRadius: 16,
          opacity: 0.28,
          mixBlendMode: "screen",
          background:
            "radial-gradient(circle, rgba(0,220,255,0.95) 0 45%, rgba(0,220,255,0) 51%)",
          backgroundSize: "6px 6px",
          animation: "pixelDrift 9s linear infinite",
        }}
      />

      {/* Scanlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 4,
          borderRadius: 16,
          opacity: 0.20,
          mixBlendMode: "screen",
          background:
            "repeating-linear-gradient(to bottom, rgba(0,255,255,0.16) 0px, rgba(0,255,255,0.16) 1px, transparent 2px, transparent 5px)",
          animation: "scanWobble 6s ease-in-out infinite",
        }}
      />

      {/* Silhouette canvas with stylizing filters */}
      <div className="absolute inset-0 z-[5]">
        <canvas
          ref={canvasRef}
          aria-label={alt}
          style={{
            width: "100%",
            height: "100%",
            imageRendering: "pixelated",
            // push it toward a synthetic phosphor color space
            filter: "contrast(1.35) brightness(1.22) saturate(0.85) hue-rotate(190deg)",
            borderRadius: 16,
          }}
        />
      </div>

      {/* Chromatic border flicker (subtle) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[6]"
        style={{
          borderRadius: 16,
          animation: "holoAberration 7.5s ease-in-out infinite",
          mixBlendMode: "screen",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            border: "1px solid rgba(0,255,255,0.24)",
            filter:
              "drop-shadow(1px 0 rgba(255,0,80,0.20)) drop-shadow(-1px 0 rgba(0,220,255,0.20))",
            borderRadius: 16,
          }}
        />
      </div>

      {/* Glitch bars (cyan/magenta bursts that imply broken signal) */}
      {glitch && (
        <div className="absolute inset-0 z-[7] pointer-events-none">
          {bars.map((b, i) => (
            <div key={i} className="absolute left-0 right-0" style={{ top: b.top, height: b.height }}>
              {/* cyan bar */}
              <div
                className={`h-full ${glitchOn ? "glitch-run" : ""}`}
                style={{
                  mixBlendMode: "screen",
                  background:
                    "linear-gradient(90deg, rgba(0,255,255,0.12), rgba(0,255,255,0.35), rgba(0,255,255,0.12))",
                  transform: `skewX(${b.skew}deg)`,
                  filter: "blur(0.3px)",
                  animationDelay: `${b.delay}s`,
                }}
              />
              {/* magenta echo */}
              <div
                className={`h-full absolute inset-0 ${glitchOn ? "glitch-run-echo" : ""}`}
                style={{
                  mixBlendMode: "screen",
                  background:
                    "linear-gradient(90deg, rgba(255,0,120,0.10), rgba(255,0,120,0.28), rgba(255,0,120,0.10))",
                  transform: `translateY(1px) skewX(${b.skew * -0.8}deg)`,
                  filter: "blur(0.5px)",
                  animationDelay: `${b.delay + 0.07}s`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[8]"
        style={{
          borderRadius: 16,
          boxShadow:
            "inset 0 0 80px rgba(0,0,0,0.6), inset 0 0 160px rgba(0,0,0,0.35)",
        }}
      />

      {/* Animations */}
      <style jsx global>{`
        @keyframes pixelDrift { 0% { background-position: 0 0; } 100% { background-position: 0 -18px; } }
        @keyframes scanWobble { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
        @keyframes holoAberration {
          0%, 92%, 100% { opacity: 0; transform: none; }
          93% { opacity: 1; transform: skewX(-0.6deg) translateY(-0.5px); }
          95% { opacity: 0.6; transform: skewX(0.4deg) translateY(0.3px); }
          97% { opacity: 0.3; transform: none; }
        }
        @keyframes glitchSlide {
          0% { transform: translateX(-6%); opacity: 0.0; }
          25% { transform: translateX(3%); opacity: 0.9; }
          50% { transform: translateX(-3%); opacity: 0.75; }
          75% { transform: translateX(5%); opacity: 0.85; }
          100% { transform: translateX(0%); opacity: 0.0; }
        }
        .glitch-run { animation: glitchSlide 0.42s ease-in-out; }
        .glitch-run-echo { animation: glitchSlide 0.42s ease-in-out reverse; }
      `}</style>

      {!ready && (
        <div className="absolute inset-0 grid place-items-center text-white/60 text-sm font-mono">
          loading model…
        </div>
      )}
      {ready && error && (
        <div className="absolute inset-0 grid place-items-center text-white/60 text-xs font-mono px-3 text-center">
          hologram fallback (segmentation failed)
        </div>
      )}
    </div>
  );
}

