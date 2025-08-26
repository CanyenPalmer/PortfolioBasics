"use client";

import * as React from "react";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  glowColor?: string;

  /** Silhouette & style */
  edgeSharpness?: number;      // 0..1 — higher = sharper cutout
  posterizeLevels?: number;    // 0/1 => off; 3..8 recommended
  bgCutoff?: number;           // 0..1 — luminance cutoff (legacy helper)

  /** Auto background removal (border color sampling) */
  bgAutoSample?: boolean;      // sample border to detect flat-ish bg
  bgAutoThreshold?: number;    // 10..80 (RGB distance) — larger = remove more bg
  bgAutoFeather?: number;      // 0..60 (px in source space) — softer edge

  /** Bars & motion */
  waveBars?: boolean;
  waveBarCount?: number;
  wavePeriodMs?: number;       // full sweep top->bottom (↑ slower)
  waveBarHeightPct?: number;   // each bar height (% of box)
  waveIntensity?: number;

  /** Wobble shaping (photo warp only inside bars) */
  wobbleAmplitudePx?: number;
  wobbleWavelengthPx?: number;
  wobblePhaseSpeed?: number;   // radians per ms
  wobbleFeatherPct?: number;   // 0..1 of bar height

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

  // cut-out / posterize
  edgeSharpness = 0.85,
  posterizeLevels = 5,
  bgCutoff = 0.22,

  // auto bg removal (ON by default now)
  bgAutoSample = true,
  bgAutoThreshold = 42,
  bgAutoFeather = 22,

  // bars
  waveBars = true,
  waveBarCount = 3,
  wavePeriodMs = 6500,             // slower sweep than before
  waveBarHeightPct = 12,
  waveIntensity = 1.0,

  // wobble
  wobbleAmplitudePx = 12,
  wobbleWavelengthPx = 42,
  wobblePhaseSpeed = 0.0065,
  wobbleFeatherPct = 0.25,

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

  /** ---------- Load image & build masked + posterized source ---------- */
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

        // Optional: auto-sample border bg color (average of a narrow frame)
        let bgR = 0, bgG = 0, bgB = 0;
        if (bgAutoSample) {
          let sumR = 0, sumG = 0, sumB = 0, count = 0;
          const frame = Math.max(2, Math.round(Math.min(w, h) * 0.02)); // 2% border
          // top & bottom rows
          for (let y of [0, 1, frame - 1, h - 1, h - frame]) {
            for (let x = 0; x < w; x += 2) {
              const i4 = (y * w + x) * 4;
              sumR += a[i4]; sumG += a[i4 + 1]; sumB += a[i4 + 2]; count++;
            }
          }
          // left & right cols
          for (let x of [0, 1, frame - 1, w - 1, w - frame]) {
            for (let y = 0; y < h; y += 2) {
              const i4 = (y * w + x) * 4;
              sumR += a[i4]; sumG += a[i4 + 1]; sumB += a[i4 + 2]; count++;
            }
          }
          bgR = sumR / Math.max(1, count);
          bgG = sumG / Math.max(1, count);
          bgB = sumB / Math.max(1, count);
        }

        // Build alpha: combine luminance gate + chroma distance to border color
        const thr = Math.max(5, Math.min(120, bgAutoThreshold|0)); // clamp
        const featherPx = Math.max(0, Math.min(80, bgAutoFeather|0));
        const thrFeather = Math.max(1, featherPx);

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i4 = (y * w + x) * 4;
            const r = a[i4], g = a[i4 + 1], b = a[i4 + 2];

            // luminance-based foreground score
            const lum = (0.2126*r + 0.7152*g + 0.0722*b) / 255;
            let alphaLum = Math.max(0, (lum - bgCutoff) / (1 - bgCutoff));

            // chroma distance to border color (Euclidean in RGB)
            let alphaChroma = 1;
            if (bgAutoSample) {
              const dr = r - bgR, dg = g - bgG, db = b - bgB;
              const dist = Math.sqrt(dr*dr + dg*dg + db*db); // 0..441
              // make 0 at 0 distance, 1 at >= thr (with soft knee over thrFeather)
              if (dist <= thr) {
                alphaChroma = 0;
              } else if (dist >= thr + thrFeather) {
                alphaChroma = 1;
              } else {
                alphaChroma = (dist - thr) / thrFeather; // 0..1
              }
            }

            // combine — prefer chroma, keep a little luminance guard
            let alpha = Math.max(alphaChroma, alphaLum * 0.6);
            alpha = Math.pow(alpha, edgeSharpness); // sharper edges

            a[i4 + 3] = Math.round(alpha * 255);
          }
        }

        // Optional posterize to feel more “hologram”
        if (posterizeLevels && posterizeLevels >= 2) {
          const levels = Math.max(2, Math.min(16, Math.floor(posterizeLevels)));
          const step = 255/(levels-1);
          for (let i = 0; i < a.length; i+=4) {
            if (a[i+3] > 8) {
              a[i]   = Math.round(a[i]/step)*step;
              a[i+1] = Math.round(a[i+1]/step)*step;
              a[i+2] = Math.round(a[i+2]/step)*step;
            }
          }
        }

        octx.putImageData(id, 0, 0);
        maskedCanvasRef.current = off;
        setReady(true);
      } catch (e:any) {
        console.error(e);
        setError(e?.message || "Image load failed");
        setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, [src, edgeSharpness, posterizeLevels, bgCutoff, bgAutoSample, bgAutoThreshold, bgAutoFeather]);

  /** ---------- cover-fit crop mapping ---------- */
  const computeCoverMap = React.useCallback(() => {
    const masked = maskedCanvasRef.current, container = containerRef.current;
    if (!masked || !container) return null;

    const cw = Math.max(1, container.clientWidth);
    const ch = Math.max(1, container.clientHeight);

    const sw = masked.width, sh = masked.height;
    const srcAspect = sw/sh, dstAspect = cw/ch;

    let sx=0, sy=0, sWidth=sw, sHeight=sh;
    if (srcAspect > dstAspect) {
      sHeight = sh;
      sWidth  = sh * dstAspect;
      sx = (sw - sWidth)/2;
    } else {
      sWidth  = sw;
      sHeight = sw / dstAspect;
      sy = (sh - sHeight)/2;
    }
    return { cw, ch, sx, sy, sWidth, sHeight };
  }, []);

  /** ---------- Bars spec ---------- */
  const barsRef = React.useRef<BarSpec[]>([]);
  React.useEffect(() => {
    const n = Math.max(1, waveBarCount ?? 3);
    const period = wavePeriodMs ?? 6500; // slower by default
    const arr: BarSpec[] = [];
    for (let i = 0; i < n; i++) {
      arr.push({
        speedScale: 0.92 + Math.random()*0.12, // small variance
        delayMs: Math.round((i / n) * period),
        hueShift: Math.round(Math.random()*36) - 18,
        pulseDelayMs: Math.round(Math.random()*900),
        el: null,
      });
    }
    barsRef.current = arr;
  }, [waveBarCount, wavePeriodMs]);

  /** ---------- RAF: position visual bars + warp canvas from same positions ------- */
  React.useEffect(() => {
    let raf = 0;
    const t0 = performance.now();

    const loop = () => {
      const t = performance.now() - t0;
      const masked = maskedCanvasRef.current;
      const dest = baseCanvasRef.current;
      const map = computeCoverMap();
      const container = containerRef.current;

      // Position bars visually (DOM)
      if (container && waveBars) {
        const ch = container.clientHeight;
        const barH = (waveBarHeightPct/100) * ch;
        barsRef.current.forEach((b) => {
          if (!b.el) return;
          const sweep = (wavePeriodMs ?? 6500) * b.speedScale;
          let p = ((t - b.delayMs) % sweep) / sweep;
          if (p < 0) p += 1;
          const top = -0.2*ch + p * (1.3*ch); // -20%..110%
          b.el.style.top = `${top}px`;
          b.el.style.height = `${barH}px`;
        });
      }

      // Warp canvas using EXACT same centers
      if (map && masked && dest && container) {
        const { cw, ch, sx, sy, sWidth, sHeight } = map;
        dest.width = cw; dest.height = ch;
        const ctx = dest.getContext("2d")!;
        ctx.clearRect(0, 0, cw, ch);

        const barH = (waveBarHeightPct/100) * ch;
        const halfH = barH * 0.5;
        const feather = Math.max(1, barH * (wobbleFeatherPct ?? 0.25));

        // Collect centers
        const centers: number[] = [];
        barsRef.current.forEach((b) => {
          const sweep = (wavePeriodMs ?? 6500) * b.speedScale;
          let p = ((t - b.delayMs) % sweep) / sweep;
          if (p < 0) p += 1;
          const top = -0.2*ch + p * (1.3*ch);
          centers.push(top + halfH);
        });

        const rowH = 2;
        const srcToDst = sHeight / ch;
        const phase = t * (wobblePhaseSpeed ?? 0.0065);

        for (let y = 0; y < ch; y += rowH) {
          const srcY = sy + y * srcToDst;
          const srcH = Math.min(rowH * srcToDst, sHeight - (srcY - sy));

          let dx = 0;
          if (waveBars && centers.length) {
            let minDist = Infinity;
            for (let i = 0; i < centers.length; i++) {
              const d = Math.abs(y - centers[i]);
              if (d < minDist) minDist = d;
            }
            if (minDist <= halfH + feather) {
              const strength = 1 - Math.min(1, Math.max(0, (minDist - halfH) / Math.max(1, feather)));
              const baseSin = Math.sin((y / (wobbleWavelengthPx ?? 42)) + phase);
              dx = baseSin * (wobbleAmplitudePx ?? 12) * strength;
            }
          }

          ctx.drawImage(
            masked,
            sx, srcY, sWidth, Math.max(1, srcH),
            dx, y, cw, rowH
          );
        }

        // Subtle hologram tint
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = "rgba(0, 255, 255, 0.06)";
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

      {/* Warped image canvas (only bends where bars pass) */}
      <div className="absolute inset-0 z-[4]">
        <canvas
          ref={baseCanvasRef}
          aria-label={alt}
          className="w-full h-full"
          style={{ borderRadius: 16 }}
        />
      </div>

      {/* Visual bars — positioned by the same JS that drives the warp */}
      {waveBars &&
        barsRef.current.map((b, i) => (
          <div
            key={i}
            ref={(el) => (barsRef.current[i].el = el)}
            aria-hidden
            className="absolute left-[-6%] right-[-6%] z-[8] pointer-events-none"
            style={{
              top: "-20%",
              height: `${waveBarHeightPct}%`,
              background:
                "linear-gradient(180deg, rgba(0,255,255,0.18) 0%, rgba(0,255,255,0.35) 50%, rgba(255,0,150,0.20) 100%)",
              mixBlendMode: "screen",
              filter: `hue-rotate(${b.hueShift}deg) blur(0.3px)`,
              clipPath:
                "polygon(0% 10%, 10% 7%, 25% 10%, 40% 6%, 55% 10%, 70% 7%, 85% 10%, 100% 8%, 100% 90%, 85% 93%, 70% 90%, 55% 94%, 40% 90%, 25% 93%, 10% 90%, 0% 92%)",
              opacity: 0.7,
              backdropFilter: `
                brightness(${1 + 0.45 * waveIntensity})
                saturate(${1 + 0.55 * waveIntensity})
                contrast(${1 + 0.30 * waveIntensity})
                blur(${0.6 * waveIntensity}px)
              `,
              animation: `
                waveShape 2200ms ease-in-out ${b.delayMs}ms infinite,
                barPulse ${1200 + Math.round(600*b.speedScale)}ms ease-in-out ${b.pulseDelayMs}ms infinite
              `,
            }}
          />
        ))}

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

      {/* Optional global flicker */}
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

      {/* Animations */}
      <style jsx global>{`
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
        @keyframes barPulse {
          0%   { opacity: 0.55; filter: brightness(1) saturate(1); }
          50%  { opacity: 0.95; filter: brightness(1.12) saturate(1.08); }
          100% { opacity: 0.55; filter: brightness(1) saturate(1); }
        }
        @keyframes holoFlicker {
          0% { opacity: 0.10; }
          50% { opacity: 0.30; }
          100% { opacity: 0.10; }
        }
      `}</style>
    </div>
  );
}

