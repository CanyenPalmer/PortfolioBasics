// src/components/AboutMeShowcase.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { profile } from "@/content/profile";

/** Minimal shape of an About pose item from profile.about.poses */
type Pose = {
  id?: number | string;
  key?: string;
  title?: React.ReactNode;
  body?: React.ReactNode; // may include headers that act as “end markers” (as on your live site)
  img?: string;
  alt?: string;
};

const SWIPE_THRESHOLD = 140; // px needed to advance
const EXIT_X = 560;          // how far a dismissed card flies on exit

export default function AboutMeShowcase() {
  const poses = (profile as any)?.about?.poses as ReadonlyArray<Pose> | undefined;
  const count = poses?.length ?? 0;
  const [index, setIndex] = React.useState(0);       // active/front card index
  const [dir, setDir] = React.useState<1 | -1>(1);   // last swipe direction
  const x = useMotionValue(0);

  if (!poses || count === 0) return null;

  const active = poses[index];

  const go = React.useCallback(
    (delta: 1 | -1) => {
      setDir(delta);
      setIndex((i) => {
        const n = (i + delta + count) % count;
        return n;
      });
    },
    [count]
  );

  // Keyboard fallback (Left/Right arrows)
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <div className="grid gap-10 md:grid-cols-2 items-center">
      {/* LEFT: Card stack (draggable front card) */}
      <div className="relative h-[420px] md:h-[520px]">
        {/* Back cards for stack depth */}
        {poses.map((p, i) => {
          const rel = (i - index + count) % count; // 0 = front
          if (rel === 0) return null; // front rendered below

          const scale = 1 - Math.min(rel, 3) * 0.05;
          const translateY = Math.min(rel, 3) * 14;
          const zIndex = 20 - rel;

          return (
            <motion.div
              key={`bg-${String(p.id ?? p.key ?? i)}`}
              className="absolute inset-0 rounded-2xl ring-1 ring-white/10 overflow-hidden"
              style={{ zIndex }}
              initial={false}
              animate={{ scale, y: translateY, opacity: rel > 3 ? 0 : 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              aria-hidden
            >
              {p.img ? (
                <Image
                  src={p.img}
                  alt={typeof p.title === "string" ? p.title : p.alt ?? "About image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 40vw"
                />
              ) : (
                <div className="h-full w-full bg-white/5" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/0" />
            </motion.div>
          );
        })}

        {/* Front (active) card — draggable */}
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={`front-${String(active.id ?? active.key ?? index)}-${index}`}
            className="absolute inset-0 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl"
            style={{ zIndex: 50, x }}
            drag="x"
            dragElastic={0.2}
            dragConstraints={{ left: 0, right: 0 }}
            whileDrag={{ rotate: 2 * dir, scale: 1.02 }}
            onDragEnd={(_, info) => {
              const dx = info.offset.x;
              if (dx > SWIPE_THRESHOLD) {
                setDir(1);
                x.set(0);
                go(1);
              } else if (dx < -SWIPE_THRESHOLD) {
                setDir(-1);
                x.set(0);
                go(-1);
              } else {
                x.set(0); // snap back
              }
            }}
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, x: dir > 0 ? EXIT_X : -EXIT_X, rotate: dir > 0 ? 6 : -6 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            role="group"
            aria-label="About image (drag left or right to change)"
          >
            {active.img ? (
              <Image
                src={active.img}
                alt={typeof active.title === "string" ? active.title : active.alt ?? "About image"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 40vw"
                priority
              />
            ) : (
              <div className="h-full w-full bg-white/10" />
            )}
            {/* readable edge overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* RIGHT: Description panel for the active card */}
      <div className="space-y-4">
        {active.title && (
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            {active.title}
          </h3>
        )}
        <div className="prose prose-invert max-w-none text-white/85">
          {active.body}
        </div>

        {/* Controls (optional + accessible) */}
        <div className="mt-4 flex items-center gap-3 text-sm text-cyan-300/80">
          <button
            type="button"
            onClick={() => go(-1)}
            className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 hover:bg-cyan-400/15"
            aria-label="Previous card"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 hover:bg-cyan-400/15"
            aria-label="Next card"
          >
            Next →
          </button>
          <span className="ml-auto font-mono">
            {index + 1} / {count}
          </span>
        </div>
      </div>
    </div>
  );
}
