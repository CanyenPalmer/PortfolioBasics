"use client";

import * as React from "react";

type Props = {
  src: string;               // e.g. "/images/headshot.jpg"
  alt?: string;
  className?: string;
  glowColor?: string;

  /** Silhouette & style (lightweight cut-out) */
  edgeSharpness?: number;    // 0..1 — higher = sharper edge
  posterizeLevels?: number;  // 0/1 -> off; 3..8 recommended
  bgCutoff?: number;         // 0..1 — luminance below this fades (background suppression)

  /** Horizontal transmission bars (visual overlays + warp drivers) */
  waveBars?: boolean;
  waveBarCount?: number;     // how many bars at once
  wavePeriodMs?: number;     // sweep duration top→bottom
  waveBarHeightPct?: number; // height of each bar (% of box)
  waveIntensity?: number;    // tint intensity for the glow bars

  /** Wobble shaping (photo warp) */
  wobbleAmplitudePx?: number; // max horizontal shift at bar center
  wobbleWavelengthPx?: number;// sine wavelength (vertical px)
  wobblePhaseSpeed?: number;  // radians per ms for the sine phase
  wobbleFalloffFactor?: number;// sigma as fraction of bar height (0.3..1 good)
  wobbleFeatherPct?: number;   // how soft the bar edge is (0..1 of bar height)

  /** Flicker */
  flicker?: boolean;
  flickerIntensity?: number;
  flickerSpeedMs?: number;
};

export default function HoloHeadshotAuto({
  src,
  alt = "Hologram",
  className = "",
  glowColor = "rgba(0, 200, 255, 0.75)",

  // cut-out look
  edgeSharpness = 0.7,
  posterizeLevels = 5,
  bgCutoff = 0.18, // darker than this treated as background

  // bars (also drive the warp)
  waveBars = true,
  waveBarCount = 3,
  wavePeriodMs = 3800,
  waveBarHeightPct = 12,
  waveIntensity = 1.0,

  // wobble
  wobbleAmplitudePx = 12,
  wobbleWavelengthPx = 42,
  wobblePhaseSpeed = 0.0065,
  wobbleFalloffFactor = 0.55,
  wobbleFeatherPct = 0.25, // small soft edge around each bar
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

  /** ---------------- Load image & build masked, posterized source --------------- */
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
        off.width = w; off.height = h;
        const octx = off.getContext("2d", { willReadFrequently: true })!;
        octx.drawImage(img, 0, 0);

        const id = octx.getImageData(0, 0, w, h);
        const a = id.data;

        // Build alpha based on luminance with neighbor smoothing (cheap cut-out).
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i4 = (y * w + x) * 4;
            const r = a[i4 + 0], g = a[i4 + 1], b = a[i4 + 2];
            const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; // 0..1

            // normalize luminance against cutoff; below cutoff fades
            let alpha = Math.max(0, (lum - bgCutoff) / (1 - bgCutoff));

            // neighbor-average (feather edge)
            let sum = 0, nb = 0;
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                const xx = x + dx, yy = y + dy;
                if (xx >= 0 && yy >= 0 && xx < w && yy < h) {
                  const j4 = (yy * w + xx) * 4;
                  const lumN = (0.2126 * a[j4+0] + 0.7152 * a[j4+1] + 0.0722 * a[j4+2]) / 255;
                  sum += Math.max(0, (lumN - bgCutoff) / (1 - bgCutoff));
                  nb++;
                }
              }
            }
            const avg = sum / Math.max(1, nb);
            alpha = Math.pow(alpha * 0.6 + avg * 0.4, edgeSharpness);

            a[i4 + 3] = Math.round(alpha * 255);
          }
        }

        // Posterize (optional)
        if (posterizeLevels && posterizeLevels >= 2) {
          const levels = Math.max(2, Math.min(16, Math.floor(posterizeLevels)));
          const step = 255 / (levels - 1);
          for (let i = 0; i < a.length; i += 4) {
            if (a[i + 3] > 6) {
              a[i + 0] = Math.round(a[i + 0] / step) * step;
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

  /** ---------------- cover-fit mapping helper ------------------ */
  const computeCoverMap = React.useCallback(() => {
    const masked = maskedCanvasRef.current, container = containerRef.current;
    if (!masked || !container) return null;

    const cw = Math.max(1, container.clientWidth);
    const ch = Math.max(1, container.clientHeight);

    const sw = masked.width, sh = masked.height;
    const srcAspect = sw / sh, dstAspect = cw / ch;

    let sx = 0, sy = 0, sWidth = sw, sHeight = sh;
    if (srcAspect > dstAspect) {
      // source too wide, crop sides
      sHeight = sh;
      sWidth  = sh * dstAspect;
      sx = (sw - sWidth) / 2;
      sy = 0;
    } else {
      // source too tall, crop top/bottom
      sWidth  = sw;
      sHeight = sw / dstAspect;
      sx = 0;
      sy = (sh - sHeight) / 2;
    }

    return { cw, ch, sx, sy, sWidth, sHeight, sw, sh };
  }, []);

  /** ---------------- Warp only where bars pass (hard-masked to bars) --- */
  React.useEffect(() => {
    let raf = 0;
    const t0 = performance.now();

    const render = () => {
      const t = performance.now() - t0;
      const map = computeCoverMap();
      const masked = maskedCanvasRef.current;
      const dest = baseCanvasRef.current;
      if (!map || !masked || !dest) {
        raf = requestAnimationFrame(render);
        return;
      }

      const { cw, ch, sx, sy, sWidth, sHeight } = map;
      dest.width = cw; dest.height = ch;
      const ctx = dest.getContext("2d")!;
      ctx.clearRect(0, 0, cw, ch);

      // Precompute bar centers and usable band (half-height with feather)
      const barCentersY: number[] = [];
      const period = wavePeriodMs ?? 3800;
      const barHeightPx = (waveBarHeightPct / 100) * ch;
      const halfH = barHeightPx * 0.5;
      const feather = Math.max(1, barHeightPx * wobbleFeatherPct); // edge softness in px

      if (waveBars) {
        for (let i = 0; i < (waveBarCount ?? 0); i++) {
          const delay = (i / Math.max(1, waveBarCount ?? 1)) * period;
          let p = ((t - delay) % period) / period;
          if (p < 0) p += 1;
          const topPct = -0.2 + p * 1.3; // -20% → 110%
          const cy = topPct * ch + halfH;
          barCentersY.push(cy);
        }
      }

      // Draw: thin horizontal strips; ONLY wobble inside bar bands.
      const rowH = 2;
      const srcToDst = sHeight / ch;
      const phase = t * (wobblePhaseSpeed ?? 0.0065);

      for (let y = 0; y < ch; y += rowH) {
        const srcY = sy + y * srcToDst;
        const srcH = Math.min(rowH * srcToDst, sHeight - (srcY - sy));

        // Default: no wobble
        let dx = 0;

        if (waveBars && barCentersY.length) {
          // Find nearest bar distance
          let minDist = Infinity;
          for (let i = 0; i < barCentersY.length; i++) {
            const d = Math.abs(y - barCentersY[i]);
            if (d < minDist) minDist = d;
          }

          // Only wobble within the bar band (+feather). Outside = zero.
          if (minDist <= halfH + feather) {
            // Strength: 1.0 at center, tapers to 0 at edge of (halfH + feather)
            const edge = halfH + feather;
            const strength = 1 - Math.min(1, Math.max(0, (minDist - halfH) / Math.max(1, feather)));
            const baseSin = Math.sin((y / (wobbleWavelengthPx ?? 42)) + phase);
            dx = baseSin * (wobbleAmplitudePx ?? 12) * strength;
          }
        }

        ctx.drawImage(
          masked,
          sx,               // source x
          srcY,             // source y
          sWidth,           // source w
          Math.max(1, srcH),// source h
          dx,               // dest x with wobble (0 outside bars)
          y,                // dest y
          cw,               // dest w
          rowH              // dest h
        );
      }

      // Global hologram color grading for the whole image
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = "rgba(0, 255, 255, 0.06)";
      ctx.fillRect(0, 0, cw, ch);
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [
    computeCoverMap,
    waveBars, waveBarCount, waveBarHeightPct, wavePeriodMs,
    wobbleAmplitudePx, wobbleWavelengthPx, wobblePhaseSpeed, wobbleFeatherPct
  ]);

  // Redraw on resize (ensures crisp cover-fit)
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const map = computeCoverMap();
      if (!map || !maskedCanvasRef.current || !baseCanvasRef.current) return;
      baseCanvasRef.current.width = map.cw;
      baseCanvasRef.current.height = map.ch;
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [computeCoverMap]);

  /** ---------------- Visual overlay bars (tint only, synced to warp) ---- */
  const bars = React.useMemo(() => {
    if (!waveBars) return [];
    const n = waveBarCount ?? 3;
    const arr: Array<{ delayMs: number; speedScale: number; hueShift: number; pulseDelayMs: number }> = [];
    for (let i = 0; i < n; i++) {
      arr.push({
        delayMs: Math.round((i / n) * (wavePeriodMs ?? 3800)),
        speedScale: 0.95 + Math.random() * 0.15,
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
          zIndex: 2,
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
          zIndex: 3,
          borderRadius: 16,
          opacity: 0.20,
          mixBlendMode: "screen",
          background:
            "repeating-linear-gradient(to bottom, rgba(0,255,255,0.16) 0px, rgba(0,255,255,0.16) 1px, transparent 2px, transparent 5px)",
          animation: "scanWobble 6s ease-in-out infinite",
        }}
      />

      {/* Base (warped) canvas — only bends where bars pass */}
      <div className="absolute inset-0 z-[4]">
        <canvas
          ref={baseCanvasRef}
          aria-label={alt}
          className="w-full h-full"
          style={{ borderRadius: 16 }}
        />
      </div>

      {/* Chromatic border shimmer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[9]"
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

      {/* Horizontal Wavy Bars: visual tint only (warp occurs on base canvas) */}
      {waveBars && ready && bars.map((b, i) => {
        const heightPct = waveBarHeightPct;
        const clip =
          "polygon(0% 10%, 10% 7%, 25% 10%, 40% 6%, 55% 10%, 70% 7%, 85% 10%, 100% 8%, 100% 90%, 85% 93%, 70% 90%, 55% 94%, 40% 90%, 25% 93%, 10% 90%, 0% 92%)";
        const sweepMs = Math.round((wavePeriodMs ?? 3800) * b.speedScale);
        const barDelay = `${b.delayMs}ms`;
        const pulseMs = `${1200 + Math.round(600 * b.speedScale)}ms`;

        return (
          <div
            key={i}
            aria-hidden
            className="absolute left-[-6%] right-[-6%] z-[8] pointer-events-none"
            style={{
              top: "-20%",
              height: `${heightPct}%`,
              background:
                "linear-gradient(180deg, rgba(0,255,255,0.18) 0%, rgba(0,255,255,0.35) 50%, rgba(255,0,150,0.20) 100%)",
              mixBlendMode: "screen",
              filter: `hue-rotate(${b.hueShift}deg) blur(0.3px)`,
              animation: `
                waveDownTop ${sweepMs}ms linear ${barDelay} infinite,
                waveShape 2200ms ease-in-out ${barDelay} infinite,
                barPulse ${pulseMs} ease-in-out ${b.pulseDelayMs}ms infinite
              `,
              clipPath: clip,
              opacity: 0.7,
              backdropFilter: `
                brightness(${1 + 0.45 * waveIntensity})
                saturate(${1 + 0.55 * waveIntensity})
                contrast(${1 + 0.30 * waveIntensity})
                blur(${0.6 * waveIntensity}px)
              `,
            }}
          />
        );
      })}

      {/* Global hologram flicker overlay */}
      {flicker && ready && (
        <div
          aria-hidden
          className="absolute inset-0 z-[10] pointer-events-none"
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
        className="pointer-events-none absolute inset-0 z-[11]"
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
        @keyframes waveDownTop { 0% { top: -20%; } 100% { top: 110%; } }
        /* Edge morph to feel like a live signal */
        @keyframes waveShape {
          0% {
            clip-path: polygon(0% 10%, 10% 7%, 25% 10%, 40% 6%, 55% 10%, 70% 7%, 85% 10%, 100% 8%, 100% 90%, 85% 93%, 70% 90%, 55% 94%, 40% 90%, 25% 93%, 10% 90%, 0% 92%);
          }
          50% {
            clip-path: polygon(0% 12%, 10% 9%, 25% 12%, 40% 8%, 55% 12%, 70% 9%, 85% 12%, 100% 10%, 100% 88%, 85% 91%, 70% 88%, 55% 92%, 40% 88%, 25% 91%, 10% 88%, 0% 90%);
          }
          100% {
            clip-path: polygon(0% 10%, 10% 7%, 25% 10%, 40% 6%, 55% 10%, 70% 7%, 85% 10%, 100% 8%, 100% 90%, 55% 94%, 40% 90%, 25% 93%, 10% 90%, 0% 92%);
          }
        }
        @keyframes barPulse {
          0%   { opacity: 0.55; filter: brightness(1) saturate(1); }
          50%  { opacity: 0.95; filter: brightness(1.12) saturate(1.08); }
          100% { opacity: 0.55; filter: brightness(1) saturate(1); }
        }
        @keyframes holoFlicker {
          0% { opacity: 0.10; } 20% { opacity: 0.22; } 35% { opacity: 0.14; }
          50% { opacity: 0.28; } 65% { opacity: 0.12; } 80% { opacity: 0.24; } 100% { opacity: 0.10; }
        }
      `}</style>

      {!ready && (
        <div className="absolute inset-0 grid place-items-center text-white/60 text-sm font-mono">
          loading…
        </div>
      )}
      {ready && error && (
        <div className="absolute inset-0 grid place-items-center text-white/60 text-xs font-mono px-3 text-center">
          hologram fallback (image load issue)
        </div>
      )}
    </div>
  );
}
