"use client";

import * as React from "react";
import { motion } from "framer-motion";

type Card = { id: string; label: string; blurb?: string };

const ROLES: Card[] = [
  { id: "role-ds", label: "Data Science", blurb: "Modeling, experimentation, ML." },
  { id: "role-de", label: "Data Engineer", blurb: "Pipelines, SQL/dbt, orchestration." },
  { id: "role-da", label: "Data Analyst", blurb: "Dashboards, analytics engineering, viz." },
];

const LOCATIONS: Card[] = [
  { id: "loc-in-onsite", label: "Indiana: On-Site" },
  { id: "loc-global-remote", label: "Globally: Remote" },
];

export default function ServicesGlobe() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Hard caps so we never melt the tab
    const DPR = 1; // force 1x to keep pixel work tiny
    let w = 0, h = 0;

    const bayer4 = (x: number, y: number) => {
      const M = [0,8,2,10, 12,4,14,6, 3,11,1,9, 15,7,13,5];
      const ix = ((x % 4) + 4) % 4;
      const iy = ((y % 4) + 4) % 4;
      return M[iy * 4 + ix] / 16;
    };

    const renderOnce = () => {
      const bb = cvs.getBoundingClientRect();
      w = Math.max(1, Math.floor(bb.width));
      h = Math.max(1, Math.floor(bb.height));
      cvs.width = w * DPR;
      cvs.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.42;

      // Soft projection glow under globe (cheap)
      const g = ctx.createRadialGradient(cx, cy + r * 0.7, r * 0.2, cx, cy + r * 0.7, r * 1.2);
      g.addColorStop(0, "rgba(0,229,255,0.20)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(cx, cy + r * 0.72, r * 0.85, r * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();

      // Internal buffer: small & clamped (static render)
      const iw = Math.min(220, Math.max(140, Math.floor(r * 1.2)));
      const ih = iw;
      const img = ctx.createImageData(iw, ih);
      const data = img.data;

      const light = [0.6, 0.4, 0.6];          // static light (no animation)
      const neon = [0, 229 / 255, 1];         // cyan
      const mag = [1, 59 / 255, 212 / 255];   // magenta edge
      const radius = iw / 2;

      for (let y = 0; y < ih; y++) {
        for (let x = 0; x < iw; x++) {
          const dx = (x + 0.5) - radius;
          const dy = (y + 0.5) - radius;
          const rr = dx * dx + dy * dy;
          const idx = (y * iw + x) * 4;

          if (rr <= radius * radius) {
            const nx = dx / radius;
            const ny = dy / radius;
            const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
            const lam = Math.max(0, nx * light[0] + ny * light[1] + nz * light[2]);
            const lum = 0.25 + 0.75 * lam;

            const threshold = bayer4(x, y);
            const on = lum >= threshold ? 1 : 0;

            const fres = Math.pow(1 - nz, 2); // edge glow

            const rC = neon[0] * on + mag[0] * fres * 0.6;
            const gC = neon[1] * on + mag[1] * fres * 0.6;
            const bC = neon[2] * on + mag[2] * fres * 0.6;

            data[idx + 0] = Math.floor(rC * 255);
            data[idx + 1] = Math.floor(gC * 255);
            data[idx + 2] = Math.floor(bC * 255);
            data[idx + 3] = 255;
          } else {
            data[idx + 3] = 0;
          }
        }
      }

      ctx.putImageData(img, Math.floor(cx - radius), Math.floor(cy - radius));
      // (Scanlines overlay handled via CSS, not drawn here)
    };

    renderOnce();
    const ro = new ResizeObserver(renderOnce);
    ro.observe(cvs);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      id="services"
      className="relative py-20 bg-[#0b1016] overflow-hidden"
      style={{ contain: "content", isolation: "isolate" }}
    >
      <div className="mx-auto w-full max-w-5xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-center text-cyan-300 tracking-wide text-3xl md:text-4xl font-semibold"
        >
          MY SERVICES & AVAILABILITY
        </motion.h2>

        {/* Rotates via CSS only (cheap). Respect reduced-motion via CSS media rule below. */}
        <div className="relative mx-auto mt-10 w-full max-w-[560px] sm:max-w-[520px] aspect-square px-2 holo-spin-slow">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full rounded-full overflow-hidden pointer-events-none"
          />
          <div className="pointer-events-none absolute inset-0 opacity-20 [background:repeating-linear-gradient(to_bottom,rgba(255,255,255,.08)_0_1px,transparent_1px_3px)]" />
        </div>

        {/* ROLES */}
        <div className="mt-10">
          <div className="text-cyan-200/90 text-sm tracking-[0.2em] mb-3">ROLES</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ROLES.map((r) => (
              <HoloCard key={r.id} label={r.label} blurb={r.blurb} variant="primary" />
            ))}
          </div>
        </div>

        {/* LOCATIONS */}
        <div className="mt-8">
          <div className="text-cyan-200/90 text-sm tracking-[0.2em] mb-3">LOCATIONS</div>
          <div className="grid gap-4 sm:grid-cols-2">
            {LOCATIONS.map((l) => (
              <HoloCard key={l.id} label={l.label} variant="alt" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HoloCard({
  label,
  blurb,
  variant = "primary",
}: {
  label: string;
  blurb?: string;
  variant?: "primary" | "alt";
}) {
  const neonClass =
    variant === "primary"
      ? "shadow-[0_0_0_1px_rgba(0,229,255,.8),0_0_12px_rgba(0,229,255,.6),inset_0_0_24px_rgba(0,229,255,.25)]"
      : "shadow-[0_0_0_1px_rgba(255,59,212,.82),0_0_12px_rgba(255,59,212,.5),inset_0_0_24px_rgba(255,59,212,.22)]";

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 320, damping: 22 }}>
      <div className={`relative overflow-hidden rounded-xl bg-transparent ${neonClass}`}>
        <div className="p-5">
          <div className="text-cyan-100 font-medium">{label}</div>
          {blurb && <p className="mt-1 text-cyan-200/70 text-sm">{blurb}</p>}
          <div className="pointer-events-none absolute inset-0 opacity-20 [background:repeating-linear-gradient(to_bottom,rgba(255,255,255,.08)_0_1px,transparent_1px_3px)]" />
        </div>
      </div>
    </motion.div>
  );
}
