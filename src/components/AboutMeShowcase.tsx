// src/components/AboutMeShowcase.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useMotionValue, useAnimationControls, PanInfo } from "framer-motion";
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

  // Keep a single motion card; swap what it shows after exit finishes.
  const [index, setIndex] = React.useState(0);
  const [isExiting, setIsExiting] = React.useState(false);

  const areaRef = React.useRef<HTMLDivElement | null>(null);
  const controls = useAnimationControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const active = poses[index];
  const nextIdx = (index + 1) % count;
  const upcoming = poses[nextIdx];

  // Ensure card is visible on mount and whenever we’re idle.
  React.useEffect(() => {
    if (!isExiting) controls.set({ x: 0, y: 0, rotate: 0, opacity: 1 });
  }, [controls, isExiting]);

  function computeExit(vx: number, vy: number) {
    const mag = Math.hypot(vx, vy) || 1;
    const ux = vx / mag;
    const uy = vy / mag;
    return { x: ux * EXIT_RADIUS, y: uy * EXIT_RADIUS, rotate: ux * 8 + uy * 4 };
  }

  async function animateOutThenAdvance(vx: number, vy: number) {
    setIsExiting(true);

    // Show the NEXT image underneath during exit for a stacked feel.
    // (We don’t remount the front card; we just animate it away.)
    const target = computeExit(vx, vy);

    await controls.start({
      x: target.x,
      y: target.y,
      rotate: target.rotate,
      opacity: 0,
      transition: { duration: 0.35 },
    });

    // Swap to next image AFTER the current one has flown out.
    setIndex(nextIdx);

    // Instantly reset the same motion element and make it visible again.
    controls.set({ x: 0, y: 0, rotate: 0, opacity: 1 });
    x.set(0);
    y.set(0);
    setIsExiting(false);
  }

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const dx = info.offset.x, dy = info.offset.y;
    const vx = info.velocity.x, vy = info.velocity.y;
    const dist = Math.hypot(dx, dy);
    const speed = Math.hypot(vx, vy);

    if (dist > SWIPE_DIST || speed > SWIPE_SPEED) {
      const ex = speed > 1 ? vx : dx;
      const ey = speed > 1 ? vy : dy;
      animateOutThenAdvance(ex, ey).catch(() => {});
    } else {
      controls.start({
        x: 0,
        y: 0,
        rotate: 0,
        transition: { type: "spring", stiffness: 320, damping: 32 },
      });
    }
  };

  return (
    <div className="grid gap-10 md:grid-cols-2 items-center">
      {/* LEFT: image-only interaction area */}
      <div
        ref={areaRef}
        className="relative h-[420px] md:h-[520px] select-none"
        aria-label="About images"
        onDragStart={(e) => e.preventDefault()}
      >
        {/* Underlay: only while exiting, show the next image beneath */}
        {isExiting && upcoming?.img && (
          <div className="absolute inset-0" style={{ zIndex: 1 }}>
            <Image
              src={upcoming.img}
              alt={typeof upcoming.title === "string" ? (upcoming.title as string) : upcoming.alt ?? "About image"}
              fill
              className="object-contain pointer-events-none select-none drop-shadow-md"
              sizes="(max-width: 768px) 90vw, 40vw"
              draggable={false}
              priority={false}
            />
          </div>
        )}

        {/* ACTIVE CARD — persistent element; this exact element flies out */}
        <motion.div
          // IMPORTANT: no key here (so it never remounts)
          className="absolute inset-0 cursor-grab"
          style={{ zIndex: 2, x, y, touchAction: "none" as unknown as React.CSSProperties["touchAction"] }}
          drag
          dragElastic={0.18}
          dragConstraints={areaRef}
          dragMomentum={false}
          whileTap={{ cursor: "grabbing" }}
          whileDrag={{ rotate: 2, scale: 1.02 }}
          onDragEnd={handleDragEnd}
          // Also IMPORTANT: don't use `initial` that sets opacity:0 on remount
          animate={controls}
          aria-label="About image (drag to change)"
          onDragStart={(e) => e.preventDefault()}
        >
          {active?.img && (
            <Image
              // Key the image by its src so its content updates, but the motion wrapper stays mounted
              key={active.img}
              src={active.img}
              alt={typeof active.title === "string" ? (active.title as string) : active.alt ?? "About image"}
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
