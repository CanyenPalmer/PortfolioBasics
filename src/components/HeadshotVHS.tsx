"use client";

import * as React from "react";
import Image, { StaticImageData } from "next/image";

type Props = {
  src: string | StaticImageData;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  glitchEveryMs?: number;
  glitchDurationMs?: number;
  roundedClass?: string;
};

export default function HeadshotVHS({
  src,
  alt,
  sizes = "(min-width: 768px) min(46vw, 620px), 100vw",
  priority = true,
  className = "",
  imgClassName = "",
  glitchEveryMs = 5200,
  glitchDurationMs = 260,
  roundedClass = "rounded-2xl",
}: Props) {
  const [glitch, setGlitch] = React.useState(false);
  const [imgOk, setImgOk] = React.useState(false); // wait until the image is actually loaded

  React.useEffect(() => {
    if (!imgOk) return; // don't run glitch loop until the photo is visible
    let mounted = true;
    let t1: number | undefined;
    let t2: number | undefined;
    const loop = () => {
      if (!mounted) return;
      t1 = window.setTimeout(() => {
        setGlitch(true);
        t2 = window.setTimeout(() => {
          setGlitch(false);
          loop();
        }, glitchDurationMs);
      }, glitchEveryMs);
    };
    loop();
    return () => {
      mounted = false;
      if (t1) clearTimeout(t1);
      if (t2) clearTimeout(t2);
    };
  }, [imgOk, glitchEveryMs, glitchDurationMs]);

  // If next/image fails (path, domain, or fill quirk), we render a plain <img> fallback.
  const [useImgFallback, setUseImgFallback] = React.useState(false);

  return (
    <div
      className={[
        "relative overflow-hidden shadow-lg ring-1 ring-white/15 bg-[#0f131a]",
        "min-w-[220px]",
        roundedClass,
        className,
      ].join(" ")}
    >
      {/* BASE PHOTO */}
      {!useImgFallback ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          quality={95}
          className={[
            "object-cover z-0",
            roundedClass,
            "will-change-transform",
            imgClassName,
          ].join(" ")}
          onLoadingComplete={() => setImgOk(true)}
          onError={() => {
            setUseImgFallback(true);
            setImgOk(false);
          }}
        />
      ) : (
        // Plain <img> fallback (always works with /public files)
        <img
          src={typeof src === "string" ? src : ""}
          alt={alt}
          className={[
            "absolute inset-0 w-full h-full object-cover z-0",
            roundedClass,
            imgClassName,
          ].join(" ")}
          onLoad={() => setImgOk(true)}
        />
      )}

      {/* OVERLAYS — only show after the image has actually appeared */}
      {imgOk && (
        <>
          {/* VHS scanlines */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 mix-blend-overlay opacity-30"
            style={{
              background:
                "repeating-linear-gradient(to bottom, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 2px, transparent 3px)",
            }}
          />
          {/* Vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              boxShadow:
                "inset 0 0 80px rgba(0,0,0,0.55), inset 0 0 180px rgba(0,0,0,0.35)",
            }}
          />
          {/* Rolling brightness drift */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-30 mix-blend-soft-light"
            style={{
              background:
                "radial-gradient(120% 60% at 50% -10%, rgba(255,255,255,0.14), transparent 60%)",
              animation: "vhsRoll 9s ease-in-out infinite",
            }}
          />
          {/* Film grain */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-40 opacity-[0.08]"
            style={{
              background:
                "radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.5) 1px, transparent 1px), radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,0.35) 1px, transparent 1px)",
              backgroundSize: "4px 4px, 5px 5px",
              animation: "grainShift 1.8s steps(2) infinite",
            }}
          />
          {/* Glitch overlay */}
          <div
            aria-hidden
            className={[
              "pointer-events-none absolute inset-0 z-50 transition duration-75 ease-out",
              glitch ? "opacity-100" : "opacity-0",
            ].join(" ")}
            style={{
              filter: glitch
                ? "drop-shadow(2px 0 rgba(255,0,0,0.5)) drop-shadow(-2px 0 rgba(0,255,255,0.5))"
                : "none",
              transform: glitch ? "skewX(-1.2deg) translateY(-0.6px)" : "none",
            }}
          >
            <div className="absolute left-0 right-0 h-[10%] top-[18%] bg-white/10 mix-blend-overlay animate-slice1" />
            <div className="absolute left-0 right-0 h-[12%] top-[62%] bg-white/10 mix-blend-overlay animate-slice2" />
          </div>
        </>
      )}

      {/* Helpful badge if absolutely nothing loads */}
      {!imgOk && useImgFallback && (
        <div className="absolute bottom-2 right-2 z-[60] text-[10px] px-2 py-1 rounded bg-red-600/70 text-white font-mono">
          image failed to load
        </div>
      )}

      <style jsx global>{`
        @keyframes vhsRoll {
          0% { opacity: 0.0; transform: translateY(0); }
          50% { opacity: 0.08; transform: translateY(0.6%); }
          100% { opacity: 0.0; transform: translateY(0); }
        }
        @keyframes grainShift {
          0% { transform: translate(0,0); }
          50% { transform: translate(1px, -1px); }
          100% { transform: translate(0,0); }
        }
        @keyframes slice1 {
          0% { transform: translateX(-2%); opacity: 0.0; }
          20% { transform: translateX(1%);  opacity: 0.8; }
          40% { transform: translateX(-1%); opacity: 0.6; }
          60% { transform: translateX(0.5%); opacity: 0.4; }
          100% { transform: translateX(0); opacity: 0; }
        }
        @keyframes slice2 {
          0% { transform: translateX(2%); opacity: 0.0; }
          20% { transform: translateX(-1%); opacity: 0.8; }
          40% { transform: translateX(0.5%); opacity: 0.6; }
          60% { transform: translateX(-0.25%); opacity: 0.4; }
          100% { transform: translateX(0); opacity: 0; }
        }
        .animate-slice1 { animation: slice1 0.26s ease-out; }
        .animate-slice2 { animation: slice2 0.26s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .animate-slice1, .animate-slice2 { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
