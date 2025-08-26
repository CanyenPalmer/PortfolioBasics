"use client";

import * as React from "react";

type Props = {
  src: string;               // e.g. "/images/headshot.jpg"
  alt?: string;
  className?: string;
  glowColor?: string;
  edgeSharpness?: number;
  scale?: number;
  posterizeLevels?: number;

  // Wavy horizontal transmission bars
  waveBars?: boolean;
  waveBarCount?: number;
  wavePeriodMs?: number;
  waveBarHeightPct?: number;
  waveIntensity?: number;
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
}: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
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
          return sum / count;
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

        for (let i = 0; i < ta.length; i += 4) {
          ta[i + 3] = ma[i + 3];
        }

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

  const bars = React.useMemo(() => {
    if (!waveBars) return [];
    const arr: Array<{ delayMs: number }> = [];
    for (let i = 0; i < (waveBarCount ?? 3); i++) {
      arr.push({
        delayMs: Math.round((i / (waveBarCount ?? 3)) * (wavePeriodMs ?? 2600)),
      });
    }
    return arr;
  }, [waveBars, waveBarCount, wavePeriodMs]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/15 bg-black/30 ${className}`}
      style={{
        perspective: "1000px",
      }}
    >
      <canvas
        ref={canvasRef}
        aria-label={alt}
        className="w-full h-full object-cover"
      />

      {/* Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          boxShadow: `0 0 40px ${glowColor}, 0 0 120px ${glowColor}`,
          opacity: 0.35,
          filter: "blur(0.6px)",
        }}
      />

      {/* Horizontal Wavy Bars */}
      {waveBars &&
        ready &&
        bars.map((b, i) => (
          <div
            key={i}
            aria-hidden
            className="absolute left-0 w-full"
            style={{
              height: `${waveBarHeightPct}%`,
              background: `linear-gradient(to bottom, rgba(0,255,255,${0.12 *
                waveIntensity}) 0%, rgba(0,255,255,${0.25 *
                waveIntensity}) 50%, rgba(0,255,255,0) 100%)`,
              mixBlendMode: "screen",
              animation: `waveDown ${wavePeriodMs}ms linear ${b.delayMs}ms infinite`,
              opacity: 0.8,
              filter: "blur(2px)",
            }}
          />
        ))}

      {/* Vignette edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          boxShadow:
            "inset 0 0 80px rgba(0,0,0,0.6), inset 0 0 160px rgba(0,0,0,0.35)",
        }}
      />

      <style jsx global>{`
        @keyframes waveDown {
          0% {
            top: -20%;
            transform: skewX(-8deg);
          }
          50% {
            transform: skewX(8deg);
          }
          100% {
            top: 120%;
            transform: skewX(-8deg);
          }
        }
      `}</style>
    </div>
  );
}
