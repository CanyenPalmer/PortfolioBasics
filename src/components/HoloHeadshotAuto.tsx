"use client";

import * as React from "react";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  glowColor?: string;

  /** Silhouette & style */
  edgeSharpness?: number;
  posterizeLevels?: number;
  bgCutoff?: number;

  /** Bars & motion */
  waveBars?: boolean;
  waveBarCount?: number;
  wavePeriodMs?: number;
  waveBarHeightPct?: number;
  waveIntensity?: number;

  /** Wobble shaping (photo warp) */
  wobbleAmplitudePx?: number;
  wobbleWavelengthPx?: number;
  wobblePhaseSpeed?: number;
  wobbleFeatherPct?: number;

  /** Flicker */
  flicker?: boolean;
  flickerIntensity?: number;
  flickerSpeedMs?: number;
};

type BarSpec = {
  speedScale: number;
  delayMs: number;
  hueShift: number;
  pulseDelayMs: number;
  el: HTMLDivElement | null;
};

export default function HoloHeadshotAuto({
  src,
  alt = "Hologram",
  className = "",
  glowColor = "rgba(0, 200, 255, 0.75)",

  edgeSharpness = 0.7,
  posterizeLevels = 5,
  bgCutoff = 0.18,

  waveBars = true,
  waveBarCount = 3,
  wavePeriodMs = 3800,
  waveBarHeightPct = 12,
  waveIntensity = 1.0,

  wobbleAmplitudePx = 12,
  wobbleWavelengthPx = 42,
  wobblePhaseSpeed = 0.0065,
  wobbleFeatherPct = 0.25,

  flicker = true,
  flickerIntensity = 0.25,
  flickerSpeedMs = 1750,
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const baseCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const maskedCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const [ready, setReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  /** ---------- Load image & preprocess ---------- */
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        await new Promise<void>((res, rej) => {
          img.onload = () => res();
          img.onerror = () => rej(new Error("Failed to load image"));
        });
        if (cancelled) return;

        const w = img.naturalWidth || 1200;
        const h = img.naturalHeight || 1600;
        const off = document.createElement("canvas");
        off.width = w;
        off.height = h;
        const octx = off.getContext("2d", { willReadFrequently: true })!;
        octx.drawImage(img, 0, 0);
        const id = octx.getImageData(0, 0, w, h);
        const a = id.data;

        // Mask background by luminance
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i4 = (y * w + x) * 4;
            const r = a[i4], g = a[i4 + 1], b = a[i4 + 2];
            const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
            let alpha = Math.max(0, (lum - bgCutoff) / (1 - bgCutoff));
            a[i4 + 3] = Math.round(Math.pow(alpha, edgeSharpness) * 255);
          }
        }

        // Posterize
        if (posterizeLevels >= 2) {
          const levels = Math.max(2, Math.min(16, Math.floor(posterizeLevels)));
          const step = 255 / (levels - 1);
          for (let i = 0; i < a.length; i += 4) {
            if (a[i + 3] > 6) {
              a[i] = Math.round(a[i] / step) * step;
              a[i + 1] = Math.round(a[i + 1] / step) * step;
              a[i + 2] = Math.round(a[i + 2] / step) * step;
            }
          }
        }

        octx.putImageData(id, 0, 0);
        maskedCanvasRef.current = off;
        setReady(true);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Image load failed");
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [src, edgeSharpness, posterizeLevels, bgCutoff]);

  /** ---------- Cover-fit mapping ---------- */
  const computeCoverMap = React.useCallback(() => {
    const masked = maskedCanvasRef.current,
      container = containerRef.current;
    if (!masked || !container) return null;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const sw = masked.width,
      sh = masked.height;
    const srcAspect = sw / sh,
      dstAspect = cw / ch;

    let sx = 0,
      sy = 0,
      sWidth = sw,
      sHeight = sh;
    if (srcAspect > dstAspect) {
      sHeight = sh;
      sWidth = sh * dstAspect;
      sx = (sw - sWidth) / 2;
    } else {
      sWidth = sw;
      sHeight = sw / dstAspect;
      sy = (sh - sHeight) / 2;
    }
    return { cw, ch, sx, sy, sWidth, sHeight };
  }, []);

  /** ---------- Bar specs ---------- */
  const barsRef = React.useRef<BarSpec[]>([]);
  React.useEffect(() => {
    const n = waveBarCount ?? 3;
    const period = wavePeriodMs ?? 3800;
    barsRef.current = Array.from({ length: n }, (_, i) => ({
      speedScale: 0.95 + Math.random() * 0.15,
      delayMs: Math.round((i / n) * period),
      hueShift: Math.round(Math.random() * 36) - 18,
      pulseDelayMs: Math.round(Math.random() * 900),
      el: null,
    }));
  }, [waveBarCount, wavePeriodMs]);

  /** ---------- Main RAF loop: position bars + warp image ---------- */
  React.useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const loop = () => {
      const t = performance.now() - t0;
      const map = computeCoverMap();
      const masked = maskedCanvasRef.current;
      const dest = baseCanvasRef.current;
      const container = containerRef.current;

      if (container && waveBars) {
        const ch = container.clientHeight;
        const barH = (waveBarHeightPct / 100) * ch;
        barsRef.current.forEach((b) => {
          if (!b.el) return;
          const sweep = (wavePeriodMs ?? 3800) * b.speedScale;
          let p = ((t - b.delayMs) % sweep) / sweep;
          if (p < 0) p += 1;
          const top = -0.2 * ch + p * (1.3 * ch);
          b.el.style.top = `${top}px`;
          b.el.style.height = `${barH}px`;
        });
      }

      if (map && masked && dest) {
        const { cw, ch, sx, sy, sWidth, sHeight } = map;
        dest.width = cw;
        dest.height = ch;
        const ctx = dest.getContext("2d")!;
        ctx.clearRect(0, 0, cw, ch);

        const barH = (waveBarHeightPct / 100) * ch;
        const halfH = barH * 0.5;
        const feather = barH * (wobbleFeatherPct ?? 0.25);
        const centers: number[] = [];

        barsRef.current.forEach((b) => {
          const sweep = (wavePeriodMs ?? 3800) * b.speedScale;
          let p = ((t - b.delayMs) % sweep) / sweep;
          if (p < 0) p += 1;
          const top = -0.2 * ch + p * (1.3 * ch);
          centers.push(top + halfH);
        });

        const rowH = 2;
        const srcToDst = sHeight / ch;
        const phase = t * (wobblePhaseSpeed ?? 0.0065);

        for (let y = 0; y < ch; y += rowH) {
          const srcY = sy + y * srcToDst;
          const srcH = Math.min(rowH * srcToDst, sHeight - (srcY - sy));

          let dx = 0;
          if (centers.length) {
            let minDist = Infinity;
            centers.forEach((c) => {
              const d = Math.abs(y - c);
              if (d < minDist) minDist = d;
            });
            if (minDist <= halfH + feather) {
              const strength =
                1 - Math.min(1, Math.max(0, (minDist - halfH) / feather));
              const baseSin = Math.sin((y / wobbleWavelengthPx) + phase);
              dx = baseSin * (wobbleAmplitudePx ?? 12) * strength;
            }
          }

          ctx.drawImage(
            masked,
            sx,
            srcY,
            sWidth,
            srcH,
            dx,
            y,
            cw,
            rowH
          );
        }

        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = "rgba(0,255,255,0.06)";
        ctx.fillRect(0, 0, cw, ch);
        ctx.globalCompositeOperation = "source-over";
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [
    computeCoverMap,
    waveBars,
    waveBarHeightPct,
    wavePeriodMs,
    wobbleAmplitudePx,
    wobbleWavelengthPx,
    wobblePhaseSpeed,
    wobbleFeatherPct,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/15 ${className}`}
      style={{ background: "#080c11" }}
    >
      {/* Glow */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          zIndex: 1,
          borderRadius: 16,
          boxShadow: `0 0 38px ${glowColor}, 0 0 140px ${glowColor}`,
          opacity: 0.5,
        }}
      />

      {/* Warped canvas */}
      <div className="absolute inset-0 z-[4]">
        <canvas
          ref={baseCanvasRef}
          aria-label={alt}
          className="w-full h-full"
          style={{ borderRadius: 16 }}
        />
      </div>

      {/* Bars */}
      {waveBars &&
        barsRef.current.map((b, i) => (
          <div
            key={i}
            ref={(el) => (barsRef.current[i].el = el)}
            className="absolute left-0 right-0 z-[8] pointer-events-none"
            style={{
              top: "-20%",
              height: `${waveBarHeightPct}%`,
              background:
                "linear-gradient(180deg, rgba(0,255,255,0.2), rgba(255,0,150,0.15))",
              opacity: 0.7,
              mixBlendMode: "screen",
            }}
          />
        ))}

      {/* Flicker overlay */}
      {flicker && ready && (
        <div
          className="absolute inset-0 z-[10] pointer-events-none"
          style={{
            borderRadius: 16,
            mixBlendMode: "screen",
            background:
              "radial-gradient(60% 40% at 50% 50%, rgba(0,255,255,0.12), transparent 80%)",
            animation: `holoFlicker ${flickerSpeedMs}ms steps(2) infinite`,
            opacity: 0.15 + 0.4 * flickerIntensity,
          }}
        />
      )}

      {/* CSS animations */}
      <style jsx global>{`
        @keyframes holoFlicker {
          0% { opacity: 0.1; }
          50% { opacity: 0.3; }
          100% { opacity: 0.1; }
        }
      `}</style>
    </div>
  );
}
