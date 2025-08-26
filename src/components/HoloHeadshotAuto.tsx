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
  wavePeriodMs?: number;        // full sweep duration
  waveBarHeightPct?: number;
  waveIntensity?: number;

  /** Distortion shaping (visual only, no geometry shift) */
  distortMaxBlurPx?: number;    // max blur under bar
  distortContrastBoost?: number;// e.g. 0.6 -> +60% at peak
  distortSaturationBoost?: number; // e.g. 0.7 -> +70%
  distortBrightnessBoost?: number; // e.g. 0.2 -> +20%
  distortFeatherPct?: number;   // softness outside bar core (0..1 of bar height)

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

  // mask & look
  edgeSharpness = 0.7,
  posterizeLevels = 5,
  bgCutoff = 0.18,

  // bars
  waveBars = true,
  waveBarCount = 3,
  wavePeriodMs = 9000,              // much slower (was 3800/6000)
  waveBarHeightPct = 12,
  waveIntensity = 1.0,

  // visual distortion only (no wobble/shift)
  distortMaxBlurPx = 1.2,
  distortContrastBoost = 0.6,
  distortSaturationBoost = 0.7,
  distortBrightnessBoost = 0.2,
  distortFeatherPct = 0.28,

  // flicker
  flicker = true,
  flickerIntensity = 0.25,
  flickerSpeedMs = 1750,
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const baseCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const maskedCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const [ready, setReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  /** ---------- Load image & preprocess (mask + posterize) ---------- */
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

        // Luminance-based alpha mask
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i4 = (y * w + x) * 4;
            const r = a[i4], g = a[i4 + 1], b = a[i4 + 2];
            const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
            let alpha = Math.max(0, (lum - bgCutoff) / (1 - bgCutoff));
            a[i4 + 3] = Math.round(Math.pow(alpha, edgeSharpness) * 255);
          }
        }

        // Posterize for a hologram-y, quantized look
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
    return () => { cancelled = true; };
  }, [src, edgeSharpness, posterizeLevels, bgCutoff]);

  /** ---------- Cover-fit mapping ---------- */
  const computeCoverMap = React.useCallback(() => {
    const masked = maskedCanvasRef.current,
      container = containerRef.current;
    if (!masked || !container) return null;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const sw = masked.width, sh = masked.height;
    const srcAspect = sw / sh, dstAspect = cw / ch;

    let sx = 0, sy = 0, sWidth = sw, sHeight = sh;
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
    const n = Math.max(1, waveBarCount ?? 3);
    const period = wavePeriodMs ?? 9000;
    barsRef.current = Array.from({ length: n }, (_, i) => ({
      speedScale: 0.94 + Math.random() * 0.12,
      delayMs: Math.round((i / n) * period),
      hueShift: Math.round(Math.random() * 36) - 18,
      pulseDelayMs: Math.round(Math.random() * 900),
      el: null,
    }));
  }, [waveBarCount, wavePeriodMs]);

  /** ---------- Main RAF loop: position bars + draw with visual distortion ---------- */
  React.useEffect(() => {
    let raf = 0;
    const t0 = performance.now();

    const loop = () => {
      const t = performance.now() - t0;
      const map = computeCoverMap();
      const masked = maskedCanvasRef.current;
      const dest = baseCanvasRef.current;
      const container = containerRef.current;

      // Move visual bars
      if (container && waveBars) {
        const ch = container.clientHeight;
        const barH = (waveBarHeightPct / 100) * ch;
        barsRef.current.forEach((b) => {
          if (!b.el) return;
          const sweep = (wavePeriodMs ?? 9000) * b.speedScale;
          let p = ((t - b.delayMs) % sweep) / sweep;
          if (p < 0) p += 1;
          const top = -0.2 * ch + p * (1.3 * ch);
          b.el.style.top = `${top}px`;
          b.el.style.height = `${barH}px`;
        });
      }

      // Draw with distortion only under bars (no geometric wobble)
      if (map && masked && dest) {
        const { cw, ch, sx, sy, sWidth, sHeight } = map;
        dest.width = cw;
        dest.height = ch;
        const ctx = dest.getContext("2d")!;
        ctx.clearRect(0, 0, cw, ch);

        // First, draw the whole image normally (no filter)
        ctx.filter = "none";
        ctx.drawImage(masked, sx, sy, sWidth, sHeight, 0, 0, cw, ch);

        // Then sweep through rows again; for rows near a bar, re-draw that row slice WITH filter
        const barH = (waveBarHeightPct / 100) * ch;
        const halfH = barH * 0.5;
        const feather = Math.max(1, barH * (distortFeatherPct ?? 0.28));

        // Collect centers for current time
        const centers: number[] = [];
        barsRef.current.forEach((b) => {
          const sweep = (wavePeriodMs ?? 9000) * b.speedScale;
          let p = ((t - b.delayMs) % sweep) / sweep;
          if (p < 0) p += 1;
          const top = -0.2 * ch + p * (1.3 * ch);
          centers.push(top + halfH);
        });

        const rowH = 2;
        const srcToDst = sHeight / ch;

        for (let y = 0; y < ch; y += rowH) {
          // distance to nearest bar center
          let minDist = Infinity;
          for (let i = 0; i < centers.length; i++) {
            const d = Math.abs(y - centers[i]);
            if (d < minDist) minDist = d;
          }

          // If near a bar, compute strength 0..1 and apply filters on a re-draw of that row
          if (centers.length && minDist <= halfH + feather) {
            const strength =
              1 - Math.min(1, Math.max(0, (minDist - halfH) / feather));

            // Build a filter stack that visually distorts without shifting geometry
            const blur = (distortMaxBlurPx || 0) * strength;
            const contrast = 1 + (distortContrastBoost || 0) * strength;
            const saturate = 1 + (distortSaturationBoost || 0) * strength;
            const brightness = 1 + (distortBrightnessBoost || 0) * strength;

            ctx.filter = `contrast(${contrast}) saturate(${saturate}) brightness(${brightness}) blur(${blur}px)`;

            const srcY = sy + y * srcToDst;
            const srcH = Math.min(rowH * srcToDst, sHeight - (srcY - sy));
            ctx.drawImage(masked, sx, srcY, sWidth, srcH, 0, y, cw, rowH);
          }
        }

        // Subtle hologram tint overlay
        ctx.filter = "none";
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
    distortMaxBlurPx,
    distortContrastBoost,
    distortSaturationBoost,
    distortBrightnessBoost,
    distortFeatherPct,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/15 ${className}`}
      style={{ background: "#080c11" }}
    >
      {/* Glow behind */}
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

      {/* Canvas (image + distortion) */}
      <div className="absolute inset-0 z-[4]">
        <canvas
          ref={baseCanvasRef}
          aria-label={alt}
          className="w-full h-full"
          style={{ borderRadius: 16 }}
        />
      </div>

      {/* Visual bars sweeping (match the computed centers above) */}
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
                "linear-gradient(180deg, rgba(0,255,255,0.18), rgba(255,0,150,0.15))",
              opacity: 0.7,
              mixBlendMode: "screen",
              filter: `hue-rotate(${b.hueShift}deg)`,
            }}
          />
        ))}

      {/* Optional flicker overlay */}
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
