"use client";

import { motion } from "framer-motion";
import { hero } from "../content/hero.data";
import CodeEdgesTyped from "./CodeEdgesTyped";
import NameCodeExplode from "./NameCodeExplode";
import SummaryRunner from "./SummaryRunner";

/** ---------- InlineTypeLine (typed tagline) ---------- */
import * as React from "react";

function buildThresholds(core: number) {
  const steps = [0, 0.1, 0.25, 0.5, core, 0.75, 0.9, 1];
  return Array.from(new Set(steps)).sort((a, b) => a - b);
}

function InlineTypeLine({
  text,
  prompt = "",
  className = "",
  typingSpeed = 22,
  startDelayMs = 150,
  retypeOnReenter = true,
  visibleThreshold = 0.6,
  ariaLabel = "Typed line",
}: {
  text: string;
  prompt?: string;
  className?: string;
  typingSpeed?: number;
  startDelayMs?: number;
  retypeOnReenter?: boolean;
  visibleThreshold?: number;
  ariaLabel?: string;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  const [started, setStarted] = React.useState(false);
  const [armed, setArmed] = React.useState(false);
  const [i, setI] = React.useState(0);
  const [done, setDone] = React.useState(false);

  const timers = React.useRef<number[]>([]);
  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= visibleThreshold) {
            clearTimers();
            if (retypeOnReenter) {
              setI(0);
              setDone(false);
              setStarted(false);
            }
            const t = window.setTimeout(() => {
              setArmed(true);
              setStarted(true);
            }, startDelayMs) as unknown as number;
            timers.current.push(t);
          } else {
            clearTimers();
            setStarted(false);
            setArmed(false);
          }
        }
      },
      { threshold: buildThresholds(visibleThreshold) }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      clearTimers();
    };
  }, [retypeOnReenter, visibleThreshold, startDelayMs]);

  React.useEffect(() => {
    if (!armed || !started || done) return;
    if (i >= text.length) {
      setDone(true);
      return;
    }
    const id = window.setTimeout(
      () => setI((n) => n + 1),
      typingSpeed
    ) as unknown as number;
    timers.current.push(id);
    return () => window.clearTimeout(id);
  }, [armed, started, done, i, text.length, typingSpeed]);

  const shown = text.slice(0, i);

  return (
    <div ref={rootRef} aria-label={ariaLabel} className={className}>
      <span className="font-mono">
        {prompt && <span className="text-emerald-400">{prompt}</span>}
        <span>{done ? text : shown}</span>
        <span
          className="inline-block w-[8px] h-[1.1em] align-[-0.15em] bg-white/80 ml-1 animate-[blink_1s_steps(1)_infinite]"
          aria-hidden
        />
      </span>
      <style jsx>{`
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
/** ---------- /InlineTypeLine ---------- */

/** ---------- PixelHologram (headshot effect) ---------- */
function PixelHologram({
  src,
  alt = "Headshot of Canyen Palmer",
  glowColor = "rgba(0, 200, 255, 0.6)",
}: {
  src: string;
  alt?: string;
  glowColor?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      el.style.setProperty("--tx", `${-dx * 8}px`);
      el.style.setProperty("--ty", `${dy * 8}px`);
    };
    const onLeave = () => {
      el.style.setProperty("--tx", `0px`);
      el.style.setProperty("--ty", `0px`);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/15 w-full max-w-full h-full"
      style={{
        background: "#0b0f15",
        transform: "translate3d(var(--tx,0), var(--ty,0), 0)",
        transition: "transform 180ms ease-out",
      }}
    >
      {/* Base image */}
      <img
        src={src}
        alt={alt}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          zIndex: 20,
          borderRadius: 16,
        }}
      />

      {/* Glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          boxShadow: `0 0 40px ${glowColor}, 0 0 120px ${glowColor}`,
          opacity: 0.35,
          filter: "blur(0.5px)",
          zIndex: 0,
        }}
      />

      {/* Pixel grid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          opacity: 0.18,
          mixBlendMode: "screen",
          background:
            "radial-gradient(circle, rgba(0,220,255,0.85) 0 45%, rgba(0,220,255,0) 50%)",
          backgroundSize: "8px 8px",
          animation: "pixelDrift 8s linear infinite",
        }}
      />

      {/* Scanlines */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          opacity: 0.12,
          mixBlendMode: "screen",
          background:
            "repeating-linear-gradient(to bottom, rgba(0,255,255,0.08) 0px, rgba(0,255,255,0.08) 1px, transparent 2px, transparent 5px)",
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          boxShadow:
            "inset 0 0 80px rgba(0,0,0,0.6), inset 0 0 160px rgba(0,0,0,0.35)",
        }}
      />

      <style jsx global>{`
        @keyframes pixelDrift {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 -16px;
          }
        }
      `}</style>
    </div>
  );
}
/** ---------- /PixelHologram ---------- */

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate w-full min-h-screen flex items-center justify-center px-6 md:px-12 pt-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch w-full max-w-6xl">
        {/* LEFT COLUMN */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center h-full relative z-10 overflow-hidden min-h-[420px] md:min-h-[clamp(520px,70vh,860px)]"
          >
            <div className="mb-3">
              <NameCodeExplode
                text="Canyen Palmer"
                className="text-5xl md:text-7xl font-extrabold tracking-tight"
                intensity={70}
                stagger={0.012}
                opacityClass="text-white/25"
              />
            </div>

            <InlineTypeLine
              className="text-[15px] md:text-[17px] text-white/80 mt-1 mb-2"
              text="Turning data into decisions through science, code, and storytelling."
              typingSpeed={18}
              startDelayMs={180}
              retypeOnReenter={true}
              visibleThreshold={0.6}
              ariaLabel="Tagline"
            />

            <SummaryRunner
              className="mt-3 mb-6"
              proficiency={hero.skills.proficiency}
              familiarity={hero.skills.familiarity}
              techStack={hero.skills.techStack}
              minHeightPx={320}
              minHeightPxMd={420}
            />

            <div className="mt-8 flex gap-4">
              {hero.ctas.map((cta, i) => (
                <a
                  key={i}
                  href={cta.href}
                  className={`px-5 py-3 rounded-xl font-medium transition ${
                    cta.variant === "primary"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border border-white/30 hover:bg-white/10 text-white"
                  }`}
                >
                  {cta.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* LEFT code edges */}
          <div className="hidden md:block">
            <CodeEdgesTyped
              zClass="-z-10"
              gap={28}
              strip={24}
              laneHeightEm={1.35}
              laneWidthCh={38}
              speedMs={28}
              opacityClass="text-white/25"
              top={[
                { text: "import pandas as pd" },
                { text: "df = pd.read_csv('golf_stats.csv')" },
              ]}
              bottom={[
                { text: "from sklearn.model_selection import train_test_split" },
              ]}
              left={[
                {
                  text: "SELECT hole, avg(strokes) FROM rounds GROUP BY hole;",
                },
              ]}
              right={[]}
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center h-full relative z-10"
          >
            <div
              className="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/15
                w-full max-w-full
                h-[280px] sm:h-[340px] md:h-[clamp(520px,70vh,860px)]
                md:w-[min(46vw,620px)]
                aspect-[3/4] flex items-center justify-center"
            >
              <PixelHologram
                src={
                  typeof hero.headshot === "string"
                    ? hero.headshot
                    : "/images/headshot.jpg"
                }
              />
            </div>
          </motion.div>

          {/* RIGHT code edges */}
          <div className="hidden md:block">
            <CodeEdgesTyped
              zClass="-z-10"
              gap={28}
              strip={24}
              laneHeightEm={1.35}
              laneWidthCh={38}
              speedMs={26}
              opacityClass="text-white/25"
              top={[{ text: "df.groupby('hole')['strokes'].mean()" }]}
              bottom={[
                { text: "from sklearn.metrics import roc_auc_score" },
                {
                  text: "auc = roc_auc_score(y_te, model.predict_proba(X_te)[:,1])",
                },
              ]}
              left={[
                {
                  text: "model = RandomForestClassifier(n_estimators=300, random_state=42)",
                },
                { text: "model.fit(X_tr, y_tr)" },
              ]}
              right={[]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
