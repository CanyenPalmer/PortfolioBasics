// src/components/AboutMeShowcase.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import { profile } from "@/content/profile";

/** Shape of an About pose item from profile.about.poses */
type Pose = {
  id?: number | string;
  key?: string;
  title?: React.ReactNode;
  body?: React.ReactNode; // may include headers as “end markers”
  img?: string;
  alt?: string;
};

const SWIPE_THRESHOLD = 140; // px needed to advance
const EXIT_X = 560;          // how far a dismissed card flies on exit

export default function AboutMeShowcase() {
  const poses = (profile as any)?.about?.poses as ReadonlyArray<Pose> | undefined;
  const count = poses?.length ?? 0;
  if (!poses || count === 0) return null;

  // Active/front index
  const [index, setIndex] = React.useState(0);

  // When swiping, we render BOTH: a leaving card and the next active card.
  const [leaving, setLeaving] = React.useState<null | { idx: number; dir: 1 | -1 }>(null);

  // Motion value for the active (draggable) card
  const x = useMotionValue(0);

  const active = poses[index];

  // Compute background stack positions for depth
  // rel=0 -> front/active. We draw a few behind it for depth only.
  const stackOrder = React.useMemo(() => {
    return poses.map((_, i) => (i - index + count) % count);
  }, [index, count, poses]);

  // Handle swipe transition:
  // 1) mark current as leaving (z-index drops below the new one)
  // 2) immediately promote the next to "active" (so it appears on top)
  // 3) after a short timeout, finalize by clearing leaving state
  function go(delta: 1 | -1) {
    const next = (index + delta + count) % count;

    // put current card into "leaving" state (exits BEHIND the new one)
    setLeaving({ idx: index, dir: delta });

    // promote next card to active immediately
    setIndex(next);

    // clear leaving after exit animation
    window.setTimeout(() => {
      setLeaving(null);
      x.set(0);
    }, 380); // keep in sync with exit transition (~0.35s)
  }

  return (
    <div className="grid gap-10 md:grid-cols-2 items-center">
      {/* LEFT COLUMN: Image area — centered card stack */}
      <div className="relative h-[420px] md:h-[520px]">
        {/* BACKGROUND CARDS (depth). We skip rel=0 (front) and the one leaving. */}
        {poses.map((p, i) => {
          const rel = stackOrder[i]; // 0 = new front
          if (rel === 0) return null; // front is handled below

          // If this index is the leaving one, don't render it here (it renders in AnimatePresence below)
          if (leaving && leaving.idx === i) return null;

          const scale = 1 - Math.min(rel, 3) * 0.05;
          const translateY = Math.min(rel, 3) * 14;
          const zIndex = 20 - rel; // smaller rel -> higher in stack (but still below the active)

          return (
            <motion.div
              key={`bg-${String(poses[i].id ?? poses[i].key ?? i)}-${i}`}
              className="absolute inset-0 rounded-2xl ring-1 ring-white/10 overflow-hidden"
              style={{ zIndex }}
              initial={false}
              animate={{ scale, y: translateY, opacity: rel > 3 ? 0 : 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              aria-hidden
            >
              {p.img ? (
                <div className="relative w-full h-full flex items-center justify-center bg-white/5">
                  {/* Center the image within the frame; never crop */}
                  <Image
                    src={p.img}
                    alt={typeof p.title === "string" ? p.title : p.alt ?? "About image"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 90vw, 40vw"
                  />
                </div>
              ) : (
                <div className="h-full w-full bg-white/5" />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-black/0" />
            </motion.div>
          );
        })}

        {/* LEAVING CARD (animates out BEHIND the new active) */}
        <AnimatePresence initial={false}>
          {leaving && (
            <motion.div
              key={`leaving-${String(poses[leaving.idx].id ?? poses[leaving.idx].key ?? leaving.idx)}`}
              className="absolute inset-0 rounded-2xl overflow-hidden ring-1 ring-white/10"
              style={{ zIndex: 15 }} // LOWER than the new active (which uses zIndex: 50)
              initial={{ opacity: 1, scale: 1, y: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                x: leaving.dir > 0 ? EXIT_X : -EXIT_X,
                rotate: leaving.dir > 0 ? 6 : -6
              }}
              transition={{ duration: 0.35 }}
              aria-hidden
            >
              {poses[leaving.idx].img ? (
                <div className="relative w-full h-full flex items-center justify-center bg-white/5">
                  <Image
                    src={poses[leaving.idx].img as string}
                    alt={
                      typeof poses[leaving.idx].title === "string"
                        ? (poses[leaving.idx].title as string)
                        : poses[leaving.idx].alt ?? "About image"
                    }
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 90vw, 40vw"
                  />
                </div>
              ) : (
                <div className="h-full w-full bg-white/10" />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-black/0" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ACTIVE (DRAGGABLE) CARD — always on top */}
        <motion.div
          key={`front-${String(active.id ?? active.key ?? index)}-${index}`}
          className="absolute inset-0 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl"
          style={{ zIndex: 50, x }}
          drag="x"
          dragElastic={0.2}
          dragConstraints={{ left: 0, right: 0 }}
          whileDrag={{ rotate: 2, scale: 1.02 }}
          onDragEnd={(_, info) => {
            const dx = info.offset.x;
            if (dx > SWIPE_THRESHOLD) {
              x.set(0);
              go(1);
            } else if (dx < -SWIPE_THRESHOLD) {
              x.set(0);
              go(-1);
            } else {
              x.set(0); // snap back
            }
          }}
          initial={{ opacity: 0, scale: 0.98, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          role="group"
          aria-label="About image (drag left or right to change)"
        >
          {active.img ? (
            <div className="relative w-full h-full flex items-center justify-center bg-white/5">
              {/* Center the image; never crop or cut off */}
              <Image
                src={active.img}
                alt={
                  typeof active.title === "string"
                    ? (active.title as string)
                    : active.alt ?? "About image"
                }
                fill
                className="object-contain"
                sizes="(max-width: 768px) 90vw, 40vw"
                priority
              />
            </div>
          ) : (
            <div className="h-full w-full bg-white/10" />
          )}
          {/* subtle edge overlay to improve readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent" />
        </motion.div>
      </div>

      {/* RIGHT COLUMN: Text panel — stays fixed; never covered */}
      <div className="space-y-4">
        {active.title && (
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            {active.title}
          </h3>
        )}
        <div className="prose prose-invert max-w-none text-white/85">
          {active.body}
        </div>
      </div>
    </div>
  );
}
