"use client";

import * as React from "react";
import Image, { StaticImageData } from "next/image";

type Props = {
  src: string | StaticImageData;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;      // wrapper extras
  roundedClass?: string;   // e.g. "rounded-2xl"
  glowColor?: string;      // neon glow color
  tilt?: boolean;          // parallax tilt on hover
  intensity?: number;      // tilt intensity (px)
  effect?: "grid" | "pixel" | "none";
};

export default function HologramHeadshot({
  src,
  alt,
  sizes = "(min-width: 768px) min(46vw, 620px), 100vw",
  priority = true,
  className = "",
  roundedClass = "rounded-2xl",
  glowColor = "rgba(0, 200, 255, 0.6)",
  tilt = true,
  intensity = 10,
  effect = "pixel",
}: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [imgOk, setImgOk] = React.useState(false);
  const [imgErr, setImgErr] = React.useState(false);
  const [tx, setTx] = React.useState(0);
  const [ty, setTy] = React.useState(0);

  // Parallax tilt
  React.useEffect(() => {
    if (!tilt) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / (r.width / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      setTx(-dx * intensity);
      setTy(dy * intensity);
    };
    const onLeave = () => { setTx(0); setTy(0); };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [tilt, intensity]);

  // If src is StaticImageData, extract the URL for <img> fallback
  const srcUrl = typeof src === "string" ? src : src?.src ?? "";

  return (
    <div
      ref={ref}
      className={[
        "relative overflow-hidden shadow-lg ring-1 ring-white/15",
        roundedClass,
        className,
      ].join(" ")}
      style={{
        background: "#0b0f15",
        perspective: "1000px",
      }}
    >
      {/* IMAGE LAYER (always above effects). If next/image errors, show <img>. */}
      <div
        className={`absolute inset-0 z-20 ${roundedClass}`}
        style={{
          transform: `translate3d(${tx}px, ${ty}px, 0)`,
          transition: "transform 180ms ease-out",
          willChange: "transform",
        }}
      >
        {!imgErr ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            quality={95}
            className={["object-cover", roundedClass].join(" ")}
            onLoadingComplete={() => setImgOk(true)}
            onError={() => setImgErr(true)}
          />
        ) : (
          // Fallback that cannot fail due to Next config
          <img
            src={srcUrl}
            alt={alt}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
      </div>

      {/* Subtle neon glow (behind image) */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-0 ${roundedClass}`}
        style={{
          boxShadow: `0 0 40px ${glowColor}, 0 0 120px ${glowColor}`,
          opacity: 0.35,
          filter: "blur(0.5px)",
        }}
      />

      {/* EFFECTS (all behind image) */}
      {imgOk && effect !== "none" && (
        <>
          {effect === "grid" && (
            <>
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 z-0 ${roundedClass}`}
                style={{
                  opacity: 0.22,
                  mixBlendMode: "screen",
                  backgroundImage:
                    "linear-gradient(rgba(0,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.08) 1px, transparent 1px)",
                  backgroundSize: "26px 26px, 26px 26px",
                  transform: `translate3d(${tx * 0.3}px, ${ty * 0.3}px, 0)`,
                  animation: "holoRise 6s linear infinite",
                }}
              />
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 z-0 ${roundedClass}`}
                style={{
                  opacity: 0.25,
                  mixBlendMode: "screen",
                  background:
                    "repeating-linear-gradient(to bottom, rgba(0,255,255,0.06) 0px, rgba(0,255,255,0.06) 1px, transparent 2px, transparent 4px)",
                  transform: `translate3d(0, ${ty * 0.2}px, 0)`,
                }}
              />
            </>
          )}

          {effect === "pixel" && (
            <>
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 z-0 ${roundedClass}`}
                style={{
                  background:
                    "radial-gradient(circle, rgba(0,220,255,0.85) 0 45%, rgba(0,220,255,0.0) 50%)",
                  backgroundSize: "8px 8px",
                  backgroundPosition: "0 0",
                  opacity: 0.18,
                  mixBlendMode: "screen",
                  transform: `translate3d(${tx * 0.2}px, ${ty * 0.2}px, 0)`,
                  animation: "pixelDrift 8s linear infinite",
                }}
              />
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 z-0 ${roundedClass}`}
                style={{
                  opacity: 0.12,
                  mixBlendMode: "screen",
                  background:
                    "repeating-linear-gradient(to bottom, rgba(0,255,255,0.08) 0px, rgba(0,255,255,0.08) 1px, transparent 2px, transparent 5px)",
                }}
              />
            </>
          )}

          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 z-0 ${roundedClass}`}
            style={{
              animation: "holoAberration 7.5s ease-in-out infinite",
              mixBlendMode: "screen",
            }}
          >
            <div
              className={`absolute inset-0 ${roundedClass}`}
              style={{
                border: "1px solid rgba(0,255,255,0.22)",
                filter:
                  "drop-shadow(1px 0 rgba(255,0,80,0.20)) drop-shadow(-1px 0 rgba(0,220,255,0.20))",
              }}
            />
          </div>
        </>
      )}

      {/* Vignette (behind image) */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-0 ${roundedClass}`}
        style={{
          boxShadow:
            "inset 0 0 80px rgba(0,0,0,0.6), inset 0 0 160px rgba(0,0,0,0.35)",
        }}
      />

      {/* Minimal globals */}
      <style jsx global>{`
        @keyframes holoRise {
          0% { background-position: 0 100%, 100% 0; }
          100% { background-position: 0 0%, 0% 0; }
        }
        @keyframes pixelDrift {
          0% { background-position: 0 0; }
          100% { background-position: 0 -16px; }
        }
        @keyframes holoAberration {
          0%, 92%, 100% { opacity: 0; transform: none; }
          93% { opacity: 1; transform: skewX(-0.6deg) translateY(-0.5px); }
          95% { opacity: 0.6; transform: skewX(0.4deg) translateY(0.3px); }
          97% { opacity: 0.3; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mix-blend-screen { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
