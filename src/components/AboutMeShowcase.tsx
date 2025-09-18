// src/components/AboutMeShowcase.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useAnimationControls,
  useTransform,
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

  // Keep a single motion card; swap content after exit finishes
  const [index, setIndex] = React.useState(0);
  const [isExiting, setIsExiting] = React.useState(false);

  const areaRef = React.useRef<HTMLDivElement | null>(null);
  const controls = useAnimationControls();

  // Motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Subtle, responsive tilt & scale based on drag distance (feels more “attached” to cursor)
  const rotate = useTransform([x, y], ([dx, dy]) => {
    const maxTilt = 6;
    const t = (dx as number) / 25 + (dy as number) / 60;
    return Math.max(-maxTilt, Math.min(maxTilt, t));
  });
  const scale = useTransform([x, y], ([dx, dy]) => {
    const dist = Math.hypot(Number(dx), Number(dy));
    return 1 + Math.min(dist / 1200, 0.025); // up to +2.5%
  });

  const active = poses[index];
  const nextIdx = (index + 1) % count;

  // Ensure card is visible on mount / when idle
  React.useEffect(() => {
    if (!isExiting) controls.set({ x: 0, y: 0, rotate: 0, opacity: 1 });
  }, [controls, isExiting]);

  function computeExit(vx: number, vy: number) {
    const mag = Math.hypot(vx, vy) || 1;
    const ux = vx / mag;
    const uy = vy / mag;
    return {
      x: ux * EXIT_RADIUS,
      y: uy * EXIT_RADIUS,
      rotate: ux * 8 + uy * 4,
    };
  }

  async function animateOutThenAdvance(vx: number, vy: number) {
    setIsExiting(true);
    const target = computeExit(vx, vy);

    // exit with fade (keeping your preferred feel), but no underlay is shown → no flicker
    await controls.start({
      x: target.x,
      y: target.y,
      rotate: target.rotate,
      opacity: 0,
      transition: { type: "spring", stiffness: 260, damping: 28, mass: 0.8 },
    });

    // Swap to next AFTER exit to avoid any peek-through
    setIndex(nextIdx);

    // Reset instantly for next cycle
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
      void animateOutThenAdvance(ex, ey);
    } else {
      controls.start({
        x: 0,
        y: 0,
        rotate: 0,
        transition: { type: "spring", stiffness: 280, damping: 26, mass: 0.9 },
      });
    }
  };

  return (
    <div className="grid gap-10 md:grid-cols-2 items-center">
      {/* LEFT: image-only interaction area (sizes unchanged) */}
      <div
        ref={areaRef}
        className="relative h-[560px] md:h-[680px] lg:h-[740px] select-none"
        aria-label="About images"
        onDragStart={(e) => e.preventDefault()}
      >
        {/* ACTIVE CARD — persistent element that follows your cursor closely */}
        <motion.div
          className="absolute inset-0 cursor-grab"
          style={{
            zIndex: 2,
            x,
            y,
            rotate,
            scale,
            willChange: "transform",
            touchAction: "none" as unknown as React.CSSProperties["touchAction"],
          }}
          drag // free-axis
          dragElastic={0.06}
          dragMomentum={false}
          // Subtle pre-drag lift (happens as soon as pointer goes down)
          whileTap={{ y: -6, scale: 1.035, boxShadow: "0 14px 36px rgba(0,0,0,0.35)" }}
          onDragEnd={handleDragEnd}
          animate={controls}
          aria-label="About image (drag to change)"
          onDragStart={(e) => e.preventDefault()}
        >
          {/* Card frame (true white border around all 4 sides + rounded edges) */}
          <div className="relative h-full w-full p-3">
            <div className="relative h-full w-full rounded-xl border border-white bg-transparent overflow-hidden">
              {active?.img && (
                <Image
                  key={active.img} // swap content without remounting the motion wrapper
                  src={active.img}
                  alt={
                    typeof active.title === "string"
                      ? (active.title as string)
                      : active.alt ?? "About image"
                  }
                  fill
                  className="object-contain pointer-events-none select-none"
                  sizes="(max-width: 768px) 90vw, 40vw"
                  draggable={false}
                  priority
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT: details — fade out during card exit, then GLITCH IN (like your hero) */}
      <motion.div
        className="space-y-5 md:space-y-6"
        initial={false}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.25 }}
      >
        {/* Key on index so the new content re-runs the glitch each time */}
        <div key={index}>
          {active?.title && (
            <GlitchBlock>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
                {active.title}
              </h3>
            </GlitchBlock>
          )}
          <GlitchBlock delay={80}>
            <div className="prose prose-invert prose-lg md:prose-xl max-w-none text-white/85">
              {active?.body}
            </div>
          </GlitchBlock>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------- Glitch text (hero-style scramble) -------------------- */
/**
 * GlitchBlock quickly cycles characters + font stacks, then locks in.
 * - No slide/shake; purely a text scramble → resolve, matching your hero vibe.
 */
function GlitchBlock({
  children,
  duration = 600,
  delay = 0,
}: {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}) {
  const [phase, setPhase] = React.useState<"glitch" | "final">("glitch");
  const [display, setDisplay] = React.useState<string | null>(null);
  const [fontClass, setFontClass] = React.useState<string>("font-sans");

  React.useEffect(() => {
    let start = performance.now() + delay;
    let raf = 0;

    const elText =
      typeof children === "string"
        ? children
        : // Try to extract text from a simple child node like <h3>Text</h3>
          (extractText(children) ?? "");

    const glyphs =
      "!<>-_\\/[]{}—=+*^?#__________◼︎◻︎◆◇▪︎▫︎•○◘◙░▒▓█@#$%&()ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    const fonts = ["font-sans", "font-serif", "font-mono"];

    const tick = (t: number) => {
      if (t < start) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const elapsed = t - start;
      if (elapsed >= duration) {
        setDisplay(elText);
        setFontClass("font-sans"); // lock to your normal face at the end
        setPhase("final");
        return;
      }

      // Mix of real + random chars proportional to progress
      const p = elapsed / duration;
      const keep = Math.floor(p * elText.length);
      const rand = Array.from({ length: elText.length - keep }, () => {
        const idx = Math.floor(Math.random() * glyphs.length);
        return glyphs[idx];
      }).join("");

      setDisplay(elText.slice(0, keep) + rand);

      // Cycle fonts a bit
      setFontClass(fonts[Math.floor((elapsed / 90) % fonts.length)]);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // Re-run when children change (new content)
  }, [children, duration, delay]);

  return (
    <span className={phase === "glitch" ? fontClass : "font-sans"}>
      {display ?? children}
    </span>
  );
}

function extractText(node: React.ReactNode): string | null {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node || typeof node !== "object") return null;
  // @ts-ignore
  const props = node.props as { children?: React.ReactNode };
  if (!props || props.children == null) return null;
  if (typeof props.children === "string") return props.children;
  if (Array.isArray(props.children)) {
    return props.children.map(extractText).filter(Boolean).join(" ");
  }
  return extractText(props.children);
}
