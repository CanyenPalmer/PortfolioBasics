// src/components/AboutMeShowcase.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
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

// Snapshot used for the leaving animation
type LeavingSnap = {
  uid: number;     // unique each time to force a fresh key
  src: string;
  alt: string;
  titleText?: string;
  vx: number;
  vy: number;
};

export default function AboutMeShowcase() {
  const poses = (profile as any)?.about?.poses as ReadonlyArray<Pose> | undefined;
  const count = poses?.length ?? 0;
  if (!poses || count === 0) return null;

  const [index, setIndex] = React.useState(0);
  const [leaving, setLeaving] = React.useState<LeavingSnap | null>(null);

  const uidRef = React.useRef(0); // increments for each leaving snapshot
  const areaRef = React.useRef<HTMLDivElement | null>(null);

  // motion values for active (front) card
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const active = poses[index];

  // Advance forward to the next card with a snapshot of the current (for the wipe)
  function advanceForward(withVector?: { vx: number; vy: number }) {
    const current = active; // capture current reference
    const src = current?.img ?? "";
    if (src) {
      uidRef.current += 1;
      const alt =
        typeof current.title === "string"
          ? (current.title as string)
          : current.alt ?? "About image";
      setLeaving({
        uid: uidRef.current,
        src,
        alt,
        titleText: typeof current.title === "string" ? (current.title as string) : undefined,
        vx: withVector?.vx ?? 1,
        vy: withVector?.vy ?? 0,
      });
    }

    // promote next immediately (so the next image is visible under the leaving wipe)
    setIndex((i) => (i + 1) % count);

    // clear the leaving layer after the exit finishes
    window.setTimeout(() => setLeaving(null), 380);
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
        // Use velocity vector when available; fall back to offset
        let ex = vx, ey = vy;
        if (Math.hypot(vx, vy) < 1) {
          ex = dx; ey = dy;
        }
        advanceForward({ vx: ex, vy: ey });
      } else {
        // snap back
        x.set(0);
        y.set(0);
      }
    },
    // x & y are motion values; they don't change identity
    [x, y] 
  );

  // Compute exit target from a vector
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
        onDragStart={(e) => e.preventDefault()} // disable native ghost-drag
      >
        {/* LEAVING snapshot — always the image you just dragged */}
        <AnimatePresence initial={false}>
          {leaving && (
            <motion.div
              key={`leaving-${leaving.uid}`}  // unique each time
              className="absolute inset-0"
              style={{ zIndex: 10 }}
              initial={{ opacity: 1, scale: 1, y: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, ...exitTarget(leaving.vx, leaving.vy), transition: { duration: 0.35 } }}
              aria-hidden
              onDragStart={(e) => e.preventDefault()}
            >
              <Image
                src={leaving.src}
                alt={leaving.alt}
                fill
                className="object-contain pointer-events-none select-none drop-shadow-md"
                sizes="(max-width: 768px) 90vw, 40vw"
                draggable={false}
                priority={false}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ACTIVE, DRAGGABLE image (free direction; always advances forward) */}
        <motion.div
          key={`front-${String(active?.id ?? active?.key ?? index)}-${index}`}
          className="absolute inset-0 cursor-grab"
          style={{
            zIndex: 50,
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
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          role="group"
          aria-label="About image (drag to change)"
          onDragStart={(e) => e.preventDefault()}
        >
          {active?.img && (
            <Image
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
