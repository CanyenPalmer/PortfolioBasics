// src/components/AboutMeShowcase.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useAnimationControls,
  PanInfo,
} from "framer-motion";
import { profile } from "@/content/profile";

type Pose = {
  id?: number | string;
  key?: string;
  title?: React.ReactNode;
  body?: React.ReactNode;
  img?: string;
  alt?: string;
};

const SWIPE_DIST = 80;     // px
const SWIPE_SPEED = 550;   // px/s
const EXIT_RADIUS = 560;   // px

export default function AboutMeShowcase() {
  const poses = (profile as any)?.about?.poses as ReadonlyArray<Pose> | undefined;
  const count = poses?.length ?? 0;
  if (!poses || count === 0) return null;

  const [index, setIndex] = React.useState(0);
  const [isExiting, setIsExiting] = React.useState(false);
  const [nextIndex, setNextIndex] = React.useState<number | null>(null);

  const areaRef = React.useRef<HTMLDivElement | null>(null);

  // motion for the active card
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useAnimationControls();

  const active = poses[index];
  const upcoming = nextIndex != null ? poses[nextIndex] : poses[(index + 1) % count];

  // Ensure the active card is visible at mount (fixes "no image shows")
  React.useEffect(() => {
    controls.set({ x: 0, y: 0, rotate: 0, opacity: 1 });
  }, [controls]);

  function computeExitTarget(vx: number, vy: number) {
    const mag = Math.hypot(vx, vy) || 1;
    const ux = vx / mag;
    const uy = vy / mag;
    return { x: ux * EXIT_RADIUS, y: uy * EXIT_RADIUS, rotate: ux * 8 + uy * 4 };
  }

  async function animateOutThenAdvance(vx: number, vy: number) {
    setIsExiting(true);
    const target = computeExitTarget(vx, vy);
    setNextIndex((index + 1) % count);

    // animate the CURRENT (dragged) card out
    await controls.start({
      x: target.x,
      y: target.y,
      rotate: target.rotate,
      opacity: 0,
      transition: { duration: 0.35 },
    });

    // swap to the next card and reset transforms instantly
    setIndex((i) => (i + 1) % count);
    controls.set({ x: 0, y: 0, rotate: 0, opacity: 1 });
    x.set(0); y.set(0);
    setIsExiting(false);
    setNextIndex(null);
  }

  const handleDragEnd = React.useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const dx = info.offset.x;
      const dy = info.offset.y;
      const vx = info.velocity.x;
      const vy = info.velocity.y;

      const dist = Math.hypot(dx, dy);
      const speed = Math.hypot(vx, vy);

      if (dist > SWIPE_DIST || speed > SWIPE_SPEED) {
        const ex = speed > 1 ? vx : dx;
        const ey = speed > 1 ? vy : dy;
        // always advance forward (regardless of direction)
        animateOutThenAdvance(ex, ey).catch(() => {});
      } else {
        // snap back
        controls.start({
          x: 0,
          y: 0,
          rotate: 0,
          transition: { type: "spring", stiffness: 320, damping: 32 },
        });
      }
    },
    [controls]
  );

  return (
    <div className="grid gap-10 md:grid-cols-2 items-center">
      {/* LEFT: image-only interaction area */}
      <div
        ref={areaRef}
        className="relative h-[420px] md:h-[520px] select-none"
        aria-label="About images"
        onDragStart={(e) => e.preventDefault()}
      >
        {/* Underlay: show the NEXT image only while the current one is exiting */}
        {isExiting && upcoming?.img && (
          <div className="absolute inset-0" style={{ zIndex: 1 }}>
            <Image
              key={`under-${nextIndex}`}
              src={upcoming.img}
              alt={
                typeof upcoming.title === "string"
                  ? (upcoming.title as string)
                  : upcoming.alt ?? "About image"
              }
              fill
              className="object-contain pointer-events-none select-none drop-shadow-md"
              sizes="(max-width: 768px) 90vw, 40vw"
              draggable={false}
              priority={false}
            />
          </div>
        )}

        {/* ACTIVE CARD — this exact element you dragged flies out */}
        <motion.div
          key={`front-${index}`}
          className="absolute inset-0 cursor-grab"
          style={{
            zIndex: 2,
            x,
            y,
            touchAction: "none" as unknown as React.CSSProperties["touchAction"],
          }}
          drag
          dragElastic={0.18}
          dragConstraints={areaRef}
          dragMomentum={false}
          whileTap={{ cursor: "grabbing" }}
          whileDrag={{ rotate: 2, scale: 1.02 }}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0, scale: 0.98, y: 6 }}
          animate={controls}
          aria-label="About image (drag to change)"
          onDragStart={(e) => e.preventDefault()}
        >
          {active?.img && (
            <Image
              key={`active-${index}`}
              src={active.img}
              alt={
                typeof active.title === "string"
                  ? (active.title as string)
                  : active.alt ?? "About image"
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
        {active?.title && (
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            {active.title}
          </h3>
        )}
        <div className="prose prose-invert max-w-none text-white/85">
          {active?.body}
        </div>
      </div>
    </div>
  );
}
