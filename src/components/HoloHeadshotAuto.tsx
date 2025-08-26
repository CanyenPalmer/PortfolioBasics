"use client";

import * as React from "react";

type Props = {
  src: string;               // e.g. "/images/headshot.jpg"
  alt?: string;
  className?: string;
  glowColor?: string;
  edgeSharpness?: number;    // 0..1 — higher = sharper edge (less feather)
  posterizeLevels?: number;  // 0/1 -> off; 3..8 recommended

  // Horizontal transmission bars
  waveBars?: boolean;
  waveBarCount?: number;
  wavePeriodMs?: number;
  waveBarHeightPct?: number;
  waveIntensity?: number;

  // Flicker
  flicker?: boolean;
  flickerIntensity?: number;
  flickerSpeedMs?: number;
};

export default function HoloHeadshotAuto({
  src,
  alt = "Hologram",
  className = "",
  glowColor = "rgba(0, 200, 255, 0.75)",
  edgeSharpness = 0.65,
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
  const containerRef = React.useRef<HTMLDivElement>(null);
  const displayCanvasRef = React.useRef<HTMLCanvasElement>(null);

  // Offscreen masked source (native image resolution)
  const maskedCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const [ready, setReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  /** ---------------- Load + segment + posterize (once) ---------------- */
  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // dynamic import so SSR doesn’t choke (deps must be installed)
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

        const w = img.naturalWidth;
        const h = img.naturalHeight;

        // Build soft alpha mask at native size
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = w;
        maskCanvas.height = h;
        const mctx = maskCanvas.getContext("2d", { willReadFrequently: true })!;
        const maskImg = mctx.createImageData(w, h);
        const md = maskImg.data;

        const neighbors = (x: number, y: number) => {
          let sum = 0, count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const xx = x + dx, yy = y + dy;
              if (xx >= 0 && yy >= 0 && xx < w && yy < h) {
                const idx = yy * w + xx;
                sum += seg.data[idx] ? 1 : 0;
                count++;
              }
            }
          }
          return sum / count; // 0..1
        };

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = y * w + x;
            const i4 = idx * 4;
            const k = neighbors(x, y);
            const a = Math.pow(k, edgeSharpness) * 255;
            md[i4 + 0] = 255;
            md[i4 + 1] = 255;
            md[i4 + 2] = 255;
            md[i4 + 3] = Math.round(a);
          }
        }
        mctx.putImageData(maskImg, 0, 0);

        // Compose masked image into an offscreen canvas (source)
        const masked = document.createElement("canvas");
        masked.width = w;
        masked.height = h;
        const sctx = masked.getContext("2d")!;
        sctx.drawImage(img, 0, 0);
        const sd = sctx.getImageData(0, 0, w, h);
        const sa = sd.data;
        const ma = mctx.getImageData(0, 0, w, h).data;

        for (let i = 0; i < sa.length; i += 4) {
          sa[i + 3] = ma[i + 3];
        }

        // Posterize (optional)
        if (posterizeLevels && posterizeLevels >= 2) {
          const levels = Math.max(2, Math.min(16, Math.floor(posterizeLevels)));
          const step = 255 / (levels - 1);
          for (let i = 0; i < sa.length; i += 4) {
            if (sa[i + 3] > 6) {
              sa[i + 0] = Math.round(sa[i + 0] / step) * step;
              sa[i + 1] = Math.round(sa[i + 1] / step) * step;
              sa[i + 2] = Math.round(sa[i + 2] / step) * step;
            }
          }
        }

        sctx.putImageData(sd, 0, 0);
        maskedCanvasRef.current = masked;

        // First draw to the display canvas with cover-fit
        drawToDisplayCanvas();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, edgeSharpness, posterizeLevels]);

  /** --------------- ResizeObserver: cover-draw without distortion ------ */
  const drawToDisplayCanvas = React.useCallback(() => {
    const masked = maskedCanvasRef.current;
    const display = displayCanvasRef.current;
    const container = containerRef.current;
    if (!masked || !display || !container) return;

    const cw = Math.max(1, container.clientWidth);
    const ch = Math.max(1, container.clientHeight);

    // Size display canvas to container pixels
    display.width = cw;
    display.height = ch;
    const dctx = display.getContext("2d")!;
    dctx.clearRect(0, 0, cw, ch);

    // “object-fit: cover” math: crop source to match container aspect
    const sw = masked.width;
    const sh = masked.height;
    const srcAspect = sw / sh;
    const dstAspect = cw / ch;

    let sx = 0, sy = 0, sWidth = sw, sHeight = sh;
    if (srcAspect > dstAspect) {
      // source too wide, crop sides
      sHeight = sh;
      sWidth = sh * dstAspect;
      sx = (sw - sWidth) / 2;
      sy = 0;
    } else {
      // source too tall, crop top/bottom
      sWidth = sw;
      sHeight = sw / dstAspect;
      sx = 0;
      sy = (sh - sHeight) / 2;
    }

    dctx.filter = "contrast(1.35) brightness(1.22) saturate(0.85) hue-rotate(190deg)";
    dctx.imageSmoothingEnabled = true;
    dctx.imageSmoothingQuality = "high";
    dctx.drawImage(masked, sx, sy, sWidth, sHeight, 0, 0, cw, ch);
  }, []);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      drawToDisplayCanvas();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [drawToDisplayCanvas]);

  /** ---------------- Pre-generate wave bars --------------------------- */
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
      ref={containerRef}
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

      {/* Segmented, posterized figure (cover-fit canvas) */}
      <div className="absolute inset-0 z-[5]">
        <canvas
          ref={displayCanvasRef}
          aria-label={alt}
          className="w-full h-full"
          style={{
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

      {/* Horizontal Wavy Bars — animate TOP so they sweep to bottom reliably */}
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
              background:
                "linear-gradient(180deg, rgba(0,255,255,0.18) 0%, rgba(0,255,255,0.35) 50%, rgba(255,0,150,0.20) 100%)",
              mixBlendMode: "screen",
              filter: `hue-rotate(${b.hueShift}deg) blur(0.3px)`,
              backdropFilter: `
                brightness(${1 + 0.45 * waveIntensity})
                saturate(${1 + 0.55 * waveIntensity})
                contrast(${1 + 0.30 * waveIntensity})
                blur(${0.6 * waveIntensity}px)
              `,
              animation: `
                waveDownTop ${Math.round(wavePeriodMs * b.speedScale)}ms linear ${b.delayMs}ms infinite,
                waveShape 2200ms ease-in-out ${b.delayMs}ms infinite,
                barPulse ${1200 + Math.round(600 * b.speedScale)}ms ease-in-out ${b.pulseDelayMs}ms infinite
              `,
              clipPath:
                "polygon(0% 10%, 10% 7%, 25% 10%, 40% 6%, 55% 10%, 70% 7%, 85% 10%, 100% 8%, 100% 90%, 85% 93%, 70% 90%, 55% 94%, 40% 90%, 25% 93%, 10% 90%, 0% 92%)",
              opacity: 0.7,
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
            opacity: 0.15 + 0.4 * flickerIntensity,
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
        /* Bar sweeps by animating TOP so it always reaches bottom */
        @keyframes waveDownTop {
          0%   { top: -20%; }
          100% { top: 110%; }
        }
        /* Edge morph to feel like a live signal */
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

