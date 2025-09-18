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

const SWIPE_DIST = 80;
const SWIPE_SPEED = 550;
const EXIT_RADIUS = 560;

export default function AboutMeShowcase() {
  const poses = (profile as any)?.about?.poses as ReadonlyArray<Pose> | undefined;
  const count = poses?.length ?? 0;
  if (!poses || count === 0) return null;

  const [index, setIndex] = React.useState(0);
  const [isExiting, setIsExiting] = React.useState(false);

  const areaRef = React.useRef<HTMLDivElement | null>(null);
  const controls = useAnimationControls();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform([x, y], ([dx, dy]) => {
    const maxTilt = 6;
    const t = (dx as number) / 25 + (dy as number) / 60;
    return Math.max(-maxTilt, Math.min(maxTilt, t));
  });
  const scale = useTransform([x, y], ([dx, dy]) => {
    const dist = Math.hypot(Number(dx), Number(dy));
    return 1 + Math.min(dist / 1200, 0.025);
  });

  const active = poses[index];
  const nextIdx = (index + 1) % count;

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
    const target = computeExit(vx, vy);

    await controls.start({
      x: target.x,
      y: target.y,
      rotate: target.rotate,
      opacity: 0,
      transition: { type: "spring", stiffness: 260, damping: 28, mass: 0.8 },
    });

    setIndex(nextIdx);

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
      {/* LEFT: card container */}
      <div
        ref={areaRef}
        className="relative h-[560px] md:h-[680px] lg:h-[740px] select-none"
        aria-label="About images"
        onDragStart={(e) => e.preventDefault()}
      >
        {/* ACTIVE CARD */}
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
          drag
          dragElastic={0.06}
          dragMomentum={false}
          whileTap={{ y: -6, scale: 1.035, boxShadow: "0 14px 36px rgba(0,0,0,0.35)" }}
          onDragEnd={handleDragEnd}
          animate={controls}
          aria-label="About image (drag to change)"
          onDragStart={(e) => e.preventDefault()}
        >
          {/* Card frame with true white border + solid background */}
          <div className="relative h-full w-full p-3">
            <div className="relative h-full w-full rounded-xl border-2 border-white bg-[#0b1016] overflow-hidden">
              {active?.img && (
                <Image
                  key={active.img}
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

      {/* RIGHT: details */}
      <motion.div
        className="space-y-5 md:space-y-6"
        initial={false}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.25 }}
      >
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

/* -------------------- Glitch text -------------------- */
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
  const [display, setDisplay] = React.useState<string>("");

  React.useEffect(() => {
    let start = performance.now() + delay;
    let raf = 0;

    const elText =
      typeof children === "string"
        ? children
        : (extractText(children) ?? "");

    const glyphs =
      "!<>-_\\/[]{}—=+*^?#◼︎◆◇▪︎▫︎•○◘◙░▒▓█@#$%&()ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    const tick = (t: number) => {
      if (t < start) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const elapsed = t - start;
      if (elapsed >= duration) {
        setDisplay(elText);
        setPhase("final");
        return;
      }

      const p = elapsed / duration;
      const keep = Math.floor(p * elText.length);
      const rand = Array.from({ length: elText.length - keep }, () => {
        const idx = Math.floor(Math.random() * glyphs.length);
        return glyphs[idx];
      }).join("");

      setDisplay(elText.slice(0, keep) + rand);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [children, duration, delay]);

  if (phase === "glitch") {
    return <span>{display}</span>;
  }
  // When done, render the actual children → correct layout
  return <>{children}</>;
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
