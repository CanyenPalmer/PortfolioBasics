"use client";

import * as React from "react";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs"; // runs on WebGL in the browser

type Props = {
  src: string;               // e.g. "/images/headshot.jpg"
  alt?: string;
  className?: string;
  glowColor?: string;
  /** 0..1 — higher = sharper edge (less feather) */
  edgeSharpness?: number;
  /** downscale the image for faster segmentation — 1 = full, 0.5 = half, etc. */
  scale?: number;
};

export default function HoloHeadshotAuto({
  src,
  alt = "Hologram",
  className = "",
  glowColor = "rgba(0, 200, 255, 0.75)",
  edgeSharpness = 0.65,
  scale = 0.75,
}: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Load lightweight model
        const net = await bodyPix.load({
          architecture: "MobileNetV1",
          outputStride: 16,
          multiplier: 0.75,
          quantBytes: 2,
        });

        // Load image
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        await new Promise<void>((res, rej) => {
          img.onload = () => res();
          img.onerror = () => rej(new Error("Failed to load image"));
        });
        if (cancelled) return;

        // Segment
        const seg = await net.segmentPerson(img, {
          internalResolution: "medium",
          segmentationThreshold: 0.7, // stricter foreground
        });
        if (cancelled) return;

        const fullW = img.naturalWidth;
        const fullH = img.naturalHeight;

        // Build alpha mask (with simple feathering via neighborhood sampling)
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
            const sharpened = Math.pow(k, edgeSharpness); // tighten the edge
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

        // Draw original image into temp, inject mask alpha, then draw to out
        const temp = document.createElement("canvas");
        temp.width = fullW;
        temp.height = fullH;
        const tctx = temp.getContext("2d")!;
        tctx.drawImage(img, 0, 0);
        const td = tctx.getImageData(0, 0, fullW, fullH);
        const ta = td.data;
        const ma = mctx.getImageData(0, 0, fullW, fullH).data;
        for (let i = 0; i < ta.length; i += 4) {
          ta[i + 3] = ma[i + 3]; // replace alpha with our mask
        }
        tctx.putImageData(td, 0, 0);

        octx.drawImage(temp, 0, 0);

        setReady(true);
      } catch (e) {
        console.error(e);
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [src, edgeSharpness, scale]);

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
            // Make it look like a hologram (not a photo):
            filter: "contrast(1.35) brightness(1.22) saturate(0) hue-rotate(190deg)",
            borderRadius: 16,
          }}
        />
      </div>

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 6,
          borderRadius: 16,
          boxShadow:
            "inset 0 0 80px rgba(0,0,0,0.6), inset 0 0 160px rgba(0,0,0,0.35)",
        }}
      />

      {/* Animations */}
      <style jsx global>{`
        @keyframes pixelDrift { 0% { background-position: 0 0; } 100% { background-position: 0 -18px; } }
        @keyframes scanWobble { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
      `}</style>

      {!ready && (
        <div className="absolute inset-0 grid place-items-center text-white/60 text-sm font-mono">
          loading model…
        </div>
      )}
    </div>
  );
}
