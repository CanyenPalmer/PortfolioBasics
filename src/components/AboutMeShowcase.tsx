// src/components/AboutMeShowcase.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, PanInfo } from "framer-motion";
import { profile } from "@/content/profile";

type Pose = {
  id?: number | string;
  key?: string;
  title?: React.ReactNode;
  body?: React.ReactNode;
  img?: string;
  alt?: string;
};

const SWIPE_DIST = 80;
const SWIPE_SPEED = 550;
const EXIT_RADIUS = 560;

type LeavingSnap = {
  uid: number;     // unique key per animation
  src: string;
  alt: string;
  vx: number;
  vy: number;
};

export default function AboutMeShowcase() {
  const poses = (profile as any)?.about?.poses as ReadonlyArray<Pose> | undefined;
  const count = poses?.length ?? 0;
  if (!poses || count === 0) return null;

  const [index, setIndex] = React.useState(0);
  const [leaving, setLeaving] = React.useState<LeavingSnap | null>(null);

  const uidRef = React.useRef(0);
  const areaRef = React.useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const active = poses[index];

  function advanceForward(vec?: { vx: number; vy: number }) {
    // snapshot CURRENT visible image before changing index
    const src = active?.img ?? "";
    if (src) {
      uidRef.current += 1;
      const alt =
        typeof active.title === "string" ? (active.title as string) : active.alt ?? "About image";
      setLeaving({
        uid: uidRef.current,
        src,
        alt,
        vx: vec?.vx ?? 1,
        vy: vec?.vy ?? 0,
      });
    }

    // promote next to front immediately
    setIndex((i) => (i + 1) % count);

    // clear after exit
    window.setTimeout(() => setLeaving(null), 380);
  }

  const handleDragEnd = React.useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { x: dx, y: dy } = info.offset;
      const { x: vx, y: vy } = info.velocity;
      const dist = Math.hypot(dx, dy);
      const speed = Math.hypot(vx, vy);

      if (dist > SWIPE_DIST || speed > SWIPE_SPEED) {
        const ex = speed > 1 ? vx : dx;
        const ey = speed > 1 ? vy : dy;
        advanceForward({ vx: ex, vy: ey });
      } else {
        x.set(0);
        y.set(0);
      }
    },
    [x, y]
  );

  function exitTarget(vx: number, vy: number) {
    const mag = Math.hypot(vx, vy) || 1;
    const ux = vx / mag;
    const uy = vy / mag;
    return { x: ux * EXIT_RADIUS, y: uy * EXIT_RADIUS, rotate: ux * 8 + uy * 4 };
  }

  return (
    <div className="grid gap-10 md:grid-cols-2 items-center">
      {/* LEFT: image-only interaction area */}
      <div
        ref={areaRef}
        className="relative h-[420px] md:h-[520px] select-none"
        aria-label="About images"
        onDragStart={(e) => e.preventDefault()}
      >
        {/* LEAVING snapshot — render as <img> with a hard key so it's ALWAYS the dragged image */}
        <AnimatePresence initial={false}>
          {leaving && (
            <motion.div
              key={`leaving-${leaving.uid}`}
              className="absolute inset-0"
              style={{ zIndex: 10 }}
              initial={{ opacity: 1, scale: 1, y: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, ...exitTarget(leaving.vx, leaving.vy), transition: { duration: 0.35 } }}
              aria-hidden
              onDragStart={(e) => e.preventDefault()}
            >
              {/* Use plain <img> to avoid Next/Image node reuse */}
              <img
                key={`img-${leaving.uid}`}
                src={leaving.src}
                alt={leaving.alt}
                draggable={false}
                className="w-full h-full object-contain select-none pointer-events-none drop-shadow-md"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ACTIVE, DRAGGABLE image (keyed by index so it's a fresh node per card) */}
        <motion.div
          key={`front-${index}`}
          className="absolute inset-0 cursor-grab"
          style={{ zIndex: 50, x, y, touchAction: "none" as unknown as React.CSSProperties["touchAction"] }}
          drag
          dragElastic={0.18}
          dragConstraints={areaRef}
          dragMomentum={false}
          whileTap={{ cursor: "grabbing" }}
          whileDrag={{ rotate: 2, scale: 1.02 }}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0, scale: 0.98, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          role="group"
          aria-label="About image (drag to change)"
          onDragStart={(e) => e.preventDefault()}
        >
          {active?.img && (
            <Image
              key={`active-${index}`}
              src={active.img}
              alt={
                typeof active.title === "string" ? (active.title as string) : active.alt ?? "About image"
              }
              fill
              className="object-contain pointer-events-none select-none drop-shadow-md"
              sizes="(max-width: 768px) 90vw, 40vw"
              draggable={false}
              priority
            />
          )}
        </motion.div>
      </div>

      {/* RIGHT: text panel */}
      <div className="space-y-4">
        {active?.title && <h3 className="text-2xl font-semibold tracking-tight text-white">{active.title}</h3>}
        <div className="prose prose-invert max-w-none text-white/85">{active?.body}</div>
      </div>
    </div>
  );
}
