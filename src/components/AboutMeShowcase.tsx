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
  useInView,
  useReducedMotion,
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
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(rootRef, { amount: 0.45, margin: "-20% 0% -20% 0%" });
  const prefersReduced = useReducedMotion();

  // Scroll direction (for details column slide: up vs down)
  const scrollDir = useScrollDirection(); // "down" | "up"

  // Glitch trigger: now ONLY increments on deck flip (not on section entry)
  const [glitchTrigger, setGlitchTrigger] = React.useState(0);

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

    // smoother, less “snappy” exit
    await controls.start({
      x: target.x,
      y: target.y,
      rotate: target.rotate,
      opacity: 0,
      transition: { type: "spring", stiffness: 260, damping: 28, mass: 0.8 },
    });

    // Swap to next image AFTER exit
    setIndex(nextIdx);

    // 🔔 Glitch ONLY on deck flip: increment trigger now that a new detail block is coming in
    setGlitchTrigger((t) => t + 1);

    // Reset instantly for next cycle
    controls.set({ x: 0, y: 0, rotate: 0, opacity: 1 });
    x.set(0);
    y.set(0);
    setIsExiting(false);
  }

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const dx = info.offset.x, dy = info.offset.y;
    do {
      const vx = info.velocity.x, vy = info.velocity.y;
      const dist = Math.hypot(dx, dy);
      const speed = Math.hypot(vx, vy);

      if (dist > SWIPE_DIST || speed > SWIPE_SPEED) {
        const ex = speed > 1 ? vx : dx;
        const ey = speed > 1 ? vy : dy;
        void animateOutThenAdvance(ex, ey);
        break;
      }
      controls.start({
        x: 0,
        y: 0,
        rotate: 0,
        transition: { type: "spring", stiffness: 280, damping: 26, mass: 0.9 },
      });
    } while (false);
  };

  // Variants for section entry/exit
  const easeLux = [0.22, 1, 0.36, 1] as const;

  const cardsVariants = {
    hidden: prefersReduced ? { opacity: 0 } : { opacity: 0, x: -28 },
    visible: prefersReduced
      ? { opacity: 1, transition: { duration: 0.28 } }
      : { opacity: 1, x: 0, transition: { duration: 0.68, ease: easeLux } },
  } as const;

  const detailsVariants = {
    hidden: (dir: "down" | "up") =>
      prefersReduced
        ? { opacity: 0 }
        : { opacity: 0, y: dir === "down" ? 32 : -32 },
    visible: prefersReduced
      ? { opacity: 1, transition: { duration: 0.28 } }
      : { opacity: 1, y: 0, transition: { duration: 0.68, ease: easeLux } },
  } as const;

  return (
    <div ref={rootRef} className="grid gap-10 md:grid-cols-2 items-center">
      {/* LEFT: image-only interaction area (sizes unchanged) */}
      <motion.div
        variants={cardsVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative h-[560px] md:h-[680px] lg:h-[740px] select-none"
        aria-label="About images"
      >
        <div
          ref={areaRef}
          onDragStart={(e) => e.preventDefault()}
          className="absolute inset-0"
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
            {/* Card frame — THICK white border + WHITE fill on all 4 sides */}
            <div className="relative h-full w-full p-3">
              <div className="relative h-full w-full rounded-2xl border-[6px] border-white bg-white overflow-hidden">
                {/* Playing-card indices */}
                <div className="absolute top-3 left-3 z-10 text-black/80 text-xl font-semibold select-none">
                  [{index + 1}]
                </div>
                <div className="absolute bottom-3 right-3 z-10 text-black/80 text-xl font-semibold rotate-180 select-none">
                  [{index + 1}]
                </div>

                {/* Inner inset to guarantee visible white fill around the image */}
                <div className="absolute inset-0 p-6 md:p-8 lg:p-10">
                  <div className="relative h-full w-full">
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
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT: details — slide/fade on section entry; glitch only on deck flip */}
      <motion.div
        variants={detailsVariants}
        custom={scrollDir}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="space-y-5 md:space-y-6"
      >
        {/* Inner wrapper: preserve your existing fade during card exit */}
        <motion.div
          initial={false}
          animate={{ opacity: isExiting ? 0 : 1 }}
          transition={{ duration: 0.25 }}
        >
          {/* Key on index only; glitch controlled by `trigger` prop (deck flips only) */}
          <div key={`${index}`}>
            {active?.title && (
              <GlitchBlock trigger={glitchTrigger}>
                <div className="inline-block max-w-full align-top">
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
                    {active.title}
                  </h3>
                  {/* Separator bar under the header */}
                  <div className="mt-3 h-[2px] w-20 md:w-28 bg-white/70 rounded-full" />
                </div>
              </GlitchBlock>
            )}
            <GlitchBlock delay={80} trigger={glitchTrigger}>
              <div className="prose prose-invert prose-lg md:prose-xl max-w-none text-white/85">
                {active?.body}
              </div>
            </GlitchBlock>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* -------------------- Glitch text (constrained to details column) -------------------- */
/**
 * GlitchBlock quickly cycles characters, then swaps to real children.
 * - Glitches ONLY when `trigger` changes (deck flip). On initial mount, it shows final text.
 * - Accepts `delay` for stagger between title/body.
 * - Skips motion for users preferring reduced motion.
 */
function GlitchBlock({
  children,
  duration = 600,
  delay = 0,
  trigger = 0,
}: {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  trigger?: number;
}) {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = React.useState<"glitch" | "final">("final");
  const [display, setDisplay] = React.useState<string>("");
  const lastTriggerRef = React.useRef<number>(trigger);

  React.useEffect(() => {
    // If trigger hasn't changed OR user prefers reduced motion → render final immediately
    if (prefersReduced || trigger === lastTriggerRef.current) {
      const text =
        typeof children === "string" ? children : (extractText(children) ?? "");
      setDisplay(text);
      setPhase("final");
      return;
    }

    // Record new trigger and run the glitch once
    lastTriggerRef.current = trigger;
    setPhase("glitch");
    setDisplay("");
    let start = performance.now() + delay;
    let raf = 0;

    const elText =
      typeof children === "string" ? children : (extractText(children) ?? "");

    // Cleaner, anime-ish charset (A–Z, 0–9, katakana-like)
    const glyphs = "アイウエオカキクケコサシスセソタチツテトナニヌネノﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

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
  }, [children, duration, delay, trigger, prefersReduced]);

  if (phase === "glitch") {
    return (
      <span className="inline-block max-w-full whitespace-pre-wrap break-words align-top" aria-hidden>
        {display}
      </span>
    );
  }
  // When done (or skipped), render the actual children → preserves intended layout exactly
  return <>{children}</>;
}

function extractText(node: React.ReactNode): string | null {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node || typeof node !== "object") return null;
  // @ts-ignore
  const props = (node as any).props as { children?: React.ReactNode };
  if (!props || props.children == null) return null;
  if (typeof props.children === "string") return props.children;
  if (Array.isArray(props.children)) {
    return props.children.map(extractText).filter(Boolean).join(" ");
  }
  return extractText(props.children);
}

/* -------------------- tiny scroll direction hook -------------------- */
function useScrollDirection() {
  const [dir, setDir] = React.useState<"down" | "up">("down");
  React.useEffect(() => {
    let last = window.scrollY || 0;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        if (Math.abs(y - last) > 2) {
          setDir(y > last ? "down" : "up");
          last = y;
        }
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return dir;
}
