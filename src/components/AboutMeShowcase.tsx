// src/components/AboutMeShowcase.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
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

const SWIPE_PX = 80;        // smaller threshold so drag feels responsive
const SWIPE_VEL = 550;      // velocity threshold as an alternative trigger
const EXIT_X = 560;         // how far the leaving card flies

export default function AboutMeShowcase() {
  const poses = (profile as any)?.about?.poses as ReadonlyArray<Pose> | undefined;
  const count = poses?.length ?? 0;
  if (!poses || count === 0) return null;

  // active/front index
  const [index, setIndex] = React.useState(0);
  // card that's animating away (so it can pass "behind" the new one)
  const [leaving, setLeaving] = React.useState<null | { pose: Pose; dir: 1 | -1 }>(null);

  const x = useMotionValue(0);
  const active = poses[index];

  function advance(dir: 1 | -1) {
    // mark current as leaving
    setLeaving({ pose: active, dir });
    // immediately promote next to be the visible front card
    setIndex((i) => (i + dir + count) % count);
    // clear leaving after the exit completes
    window.setTimeout(() => setLeaving(null), 380);
  }

  function handleDragEnd(_: any, info: { offset: { x: number }; velocity: { x: number } }) {
    const dx = info.offset.x;
    const vx = info.velocity.x;
    const farEnough = Math.abs(dx) > SWIPE_PX;
    const fastEnough = Math.abs(vx) > SWIPE_VEL;

    if (dx > 0 && (farEnough || fastEnough)) {
      x.set(0);
      advance(1);
    } else if (dx < 0 && (farEnough || fastEnough)) {
      x.set(0);
      advance(-1);
    } else {
      // snap back
      x.set(0);
    }
  }

  return (
    <div className="grid gap-10 md:grid-cols-2 items-center">
      {/* LEFT: Image area (single visible card) */}
      <div className="relative h[420px] md:h-[520px] h-[420px] md:h-[520px]">
        {/* Leaving card (animates out BEHIND the new front) */}
        <AnimatePresence initial={false}>
          {leaving && (
            <motion.div
              key={`leaving-${String(leaving.pose.id ?? leaving.pose.key ?? "x")}`}
              className="absolute inset-0 rounded-2xl overflow-hidden ring-1 ring-white/10"
              style={{ zIndex: 10 }} // below the active front card
              initial={{ opacity: 1, scale: 1, y: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                x: leaving.dir > 0 ? EXIT_X : -EXIT_X,
                rotate: leaving.dir > 0 ? 6 : -6,
                transition: { duration: 0.35 }
              }}
              aria-hidden
            >
              {leaving.pose.img ? (
                <div className="relative w-full h-full flex items-center justify-center bg-white/5">
                  <Image
                    src={leaving.pose.img}
                    alt={
                      typeof leaving.pose.title === "string"
                        ? (leaving.pose.title as string)
                        : leaving.pose.alt ?? "About image"
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

        {/* Active, draggable front card (ONLY visible card while idle) */}
        <motion.div
          key={`front-${String(active.id ?? active.key ?? index)}-${index}`}
          className="absolute inset-0 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl"
          style={{ zIndex: 50, x }}
          drag="x"
          dragElastic={0.2}
          dragConstraints={{ left: 0, right: 0 }}
          whileDrag={{ rotate: 2, scale: 1.02 }}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0, scale: 0.98, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          role="group"
          aria-label="About image (drag left or right to change)"
        >
          {active.img ? (
            <div className="relative w-full h-full flex items-center justify-center bg-white/5">
              {/* Center the image; never crop */}
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
          {/* subtle edge overlay for readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent" />
        </motion.div>
      </div>

      {/* RIGHT: Text panel (never covered) */}
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
