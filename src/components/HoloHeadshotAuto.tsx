"use client";

import * as React from "react";

type Props = {
  src: string;               // e.g. "/images/headshot.jpg"
  alt?: string;
  className?: string;
  glowColor?: string;
  edgeSharpness?: number;    // 0..1 — higher = sharper edge (less feather)
  scale?: number;            // API hint only (not resizing to avoid artifacts)
  posterizeLevels?: number;  // 0/1 -> off; 3..8 recommended

  // Horizontal transmission bars (downward, wavy, transparent)
  waveBars?: boolean;
  waveBarCount?: number;     // how many bars in flight
  wavePeriodMs?: number;     // sweep top→bottom time per bar
  waveBarHeightPct?: number; // % height of each bar (e.g., 10 = 10%)
  waveIntensity?: number;    // distortion/brightness bump feel

  // NEW: flicker controls
  flicker?: boolean;         // global hologram flicker overlay
  flickerIntensity?: number; // 0.0–1.0 (visual strength of flicker)
  flickerSpeedMs?: number;   // base speed of flicker loop
};

export default function HoloHeadshotAuto({
  src,
  alt = "Hologram",
  className = "",
  glowColor = "rgba(0, 200, 255, 0.75)",
  edgeSharpness = 0.65,
  scale = 0.75,
  posterizeLevels = 5,

  waveBars = true,
  waveBarCount = 3,
  wavePeriodMs = 2600,
  waveBarHeightPct = 12,
  waveIntensity = 1.0,

  flicker = true,
  flickerIntensity = 0.25,
  flickerSpeedMs = 1750,
}: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // ---- BodyPix segmentation → masked canvas ----
  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Dynamic imports to avoid SSR issues (deps must still be installed)
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

        // Build soft alpha mask (feather via neighbor average)
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

        // Composite to output canvas with optional posterize
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

        const td = tctx.getImageData(0, 0, fullW, fullH);
        const ta = td.data;
        const ma = mctx.getImageData(0, 0, fullW, fullH).data;

        // Inject alpha from mask
        for (let i = 0; i < ta.length; i += 4) {
          ta[i + 3] = ma[i + 3];
        }

        // Posterize for phosphor/synthetic feel
        if (posterizeLevels && posterizeLevels >= 2) {
          const levels = Math.max(2, Math.min(16, Math.floor(posterizeLevels)));
          const step = 255 / (levels - 1);
          for (let i = 0; i < ta.length; i += 4) {
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

  // Pre-generate wave bars (staggered delays, slight speed variance)
  const bars = React.useMemo(() => {
    if (!waveBars) return [];
    const arr: Array<{ delayMs: number; speedScale: number; hueShift: number; pulseDelayMs: number }> = [];
    for (let i = 0; i < (waveBarCount ?? 3); i++) {
      arr.push({
        delayMs: Math.round((i / (waveBarCount ?? 3)) * (wavePeriodMs ?? 2600)),
        speedScale: 0.9 + Math.random() * 0.3,     // 0.9–1.2
        hueShift: Math.round(Math.random() * 36) - 18,
        pulseDelayMs: Math.round(Math.random() * 900),
      });
    }
    return arr;
  }, [waveBars, waveBarCount, wavePeriodMs]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/15 ${className}`}
      style={{ background: "#080c11" }}
    >
      {/* Outer glow */}
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

      {/* Pixel grid backdrop */}
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

      {/* Segmented, posterized figure */}
      <div className="absolute inset-0 z-[5]">
        <canvas
          ref={canvasRef}
          aria-label={alt}
          style={{
            width: "100%",
            height: "100%",
            imageRendering: "pixelated",
            filter: "contrast(1.35) brightness(1.22) saturate(0.85) hue-rotate(190deg)",
            borderRadius: 16,
          }}
        />
      </div>

      {/* Chromatic border shimmer */}
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

      {/* Horizontal Wavy Bars with pulse + distortion */}
      {waveBars &&
        ready &&
        bars.map((b, i) => (
          <div
            key={i}
            aria-hidden
            className="absolute left-[-6%] right-[-6%] z-[7] pointer-events-none"
            style={{
              top: "-20%",
              height: `${waveBarHeightPct}%`,
              // soft emissive tint so bar is visible but not overpowering
              background:
                "linear-gradient(180deg, rgba(0,255,255,0.18) 0%, rgba(0,255,255,0.35) 50%, rgba(255,0,150,0.20) 100%)",
              mixBlendMode: "screen",
              filter: `hue-rotate(${b.hueShift}deg) blur(0.3px)`,
              // distortion of image beneath (requires Chromium/WebKit)
              backdropFilter: `
                brightness(${1 + 0.45 * waveIntensity})
                saturate(${1 + 0.55 * waveIntensity})
                contrast(${1 + 0.30 * waveIntensity})
                blur(${0.6 * waveIntensity}px)
              `,
              // Sweep + edge morph + pulse
              animation: `
                waveDown ${Math.round(wavePeriodMs * b.speedScale)}ms linear ${b.delayMs}ms infinite,
                waveShape 2200ms ease-in-out ${b.delayMs}ms infinite,
                barPulse ${1200 + Math.round(600 * b.speedScale)}ms ease-in-out ${b.pulseDelayMs}ms infinite
              `,
              // Wavy silhouette edges
              clipPath:
                "polygon(0% 10%, 10% 7%, 25% 10%, 40% 6%, 55% 10%, 70% 7%, 85% 10%, 100% 8%, 100% 90%, 85% 93%, 70% 90%, 55% 94%, 40% 90%, 25% 93%, 10% 90%, 0% 92%)",
              opacity: 0.7, // base visibility; barPulse will modulate this
            }}
          />
        ))}

      {/* Global hologram flicker overlay */}
      {flicker && ready && (
        <div
          aria-hidden
          className="absolute inset-0 z-[8] pointer-events-none"
          style={{
            borderRadius: 16,
            mixBlendMode: "screen",
            background:
              "radial-gradient(60% 40% at 50% 50%, rgba(0,255,255,0.12), rgba(0,255,255,0.02) 60%, transparent 80%)",
            animation: `holoFlicker ${flickerSpeedMs}ms steps(2) infinite`,
            opacity: 0.15 + 0.4 * flickerIntensity, // dial main flicker strength
          }}
        />
      )}

      {/* Vignette edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[9]"
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
        /* Horizontal sweep top -> bottom */
        @keyframes waveDown {
          0%   { transform: translateY(-20%) skewX(-8deg); }
          50%  { transform: translateY(45%)  skewX(8deg); }
          100% { transform: translateY(120%) skewX(-8deg); }
        }
        /* Gently morph the bar edges to feel like a live signal */
        @keyframes waveShape {
          0% {
            clip-path: polygon(0% 10%, 10% 7%, 25% 10%, 40% 6%, 55% 10%, 70% 7%, 85% 10%, 100% 8%, 100% 90%, 85% 93%, 70% 90%, 55% 94%, 40% 90%, 25% 93%, 10% 90%, 0% 92%);
          }
          50% {
            clip-path: polygon(0% 12%, 10% 9%, 25% 12%, 40% 8%, 55% 12%, 70% 9%, 85% 12%, 100% 10%, 100% 88%, 85% 91%, 70% 88%, 55% 92%, 40% 88%, 25% 91%, 10% 88%, 0% 90%);
          }
          100% {
            clip-path: polygon(0% 10%, 10% 7%, 25% 10%, 40% 6%, 55% 10%, 70% 7%, 85% 10%, 100% 8%, 100% 90%, 85% 93%, 70% 90%, 55% 94%, 40% 90%, 25% 93%, 10% 90%, 0% 92%);
          }
        }
        /* Per-bar pulse (opacity+brightness shimmer) */
        @keyframes barPulse {
          0%   { opacity: 0.55; filter: brightness(1) saturate(1); }
          50%  { opacity: 0.95; filter: brightness(1.12) saturate(1.08); }
          100% { opacity: 0.55; filter: brightness(1) saturate(1); }
        }
        /* Global hologram flicker overlay */
        @keyframes holoFlicker {
          0%   { opacity: 0.10; }
          20%  { opacity: 0.22; }
          35%  { opacity: 0.14; }
          50%  { opacity: 0.28; }
          65%  { opacity: 0.12; }
          80%  { opacity: 0.24; }
          100% { opacity: 0.10; }
        }
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
