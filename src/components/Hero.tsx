"use client";

import { motion } from "framer-motion";
import { hero } from "../content/hero.data";
import CodeEdgesTyped from "./CodeEdgesTyped";
import NameCodeExplode from "./NameCodeExplode";
import SummaryRunner from "./SummaryRunner";
import SkillsBelt from "./SkillsBelt"; // ← ADDED

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
    const id = window.setTimeout(() => setI((n) => n + 1), typingSpeed) as unknown as number;
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
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
/** ---------- /InlineTypeLine ---------- */

import HoloHeadshotAuto from "./HoloHeadshotAuto";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate w-full min-h-screen flex items-center justify-center px-6 md:px-12 pt-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch w-full max-w-6xl">
        {/* LEFT COLUMN — Text */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="
              flex flex-col justify-center h-full relative z-10 overflow-hidden
              min-h-[420px] md:min-h-[clamp(520px,70vh,860px)]
            "
          >
            {/* Animated Name */}
            <div className="mb-3">
              <NameCodeExplode
                text="Canyen Palmer"
                className="text-5xl md:text-7xl font-extrabold tracking-tight"
                intensity={70}
                stagger={0.012}
                opacityClass="text-white/25"
              />
            </div>

            {/* Typed tagline line (terminal-style) */}
            <InlineTypeLine
              className="text-[15px] md:text-[17px] text-white/80 mt-1 mb-2"
              prompt=""
              text="Turning Data Into Decisions"
              typingSpeed={18}
              startDelayMs={180}
              retypeOnReenter={true}
              visibleThreshold={0.6}
              ariaLabel="Tagline"
            />

            {/* ↓↓↓ ADDED: belt under hero statement, above summary.py ↓↓↓ */}
            <div className="my-4 sm:my-6" />
            <SkillsBelt />
            <div className="my-4 sm:my-6" />
            {/* ↑↑↑ ADDED ↑↑↑ */}

            {/* summary.py card -> Run -> terminal overlay */}
            <SummaryRunner
              className="mt-3 mb-6"
              proficiency={hero.skills.proficiency}
              familiarity={hero.skills.familiarity}
              techStack={hero.skills.techStack}
              minHeightPx={320}
              minHeightPxMd={420}
            />

            {/* CTAs */}
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

          {/* Typed code edges — LEFT */}
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
                { text: "SELECT hole, avg(strokes) FROM rounds GROUP BY hole;" },
              ]}
              right={[]}
            />
          </div>
        </div>

        {/* RIGHT COLUMN — Hologram Headshot (auto segmentation) */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center h-full relative z-10"
          >
            <HoloHeadshotAuto
              src={
                typeof hero.headshot === "string"
                  ? hero.headshot
                  : "/images/headshot.jpg"
              }
              className="
                w-full max-w-full
                h-[280px] sm:h-[340px] md:h-[clamp(520px,70vh,860px)]
                md:w-[min(46vw,620px)]
                aspect-[3/4]
              "
            />
          </motion.div>

          {/* Typed code edges — RIGHT */}
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
                { text: "auc = roc_auc_score(y_te, model.predict_proba(X_te)[:,1])" },
              ]}
              left={[
                { text: "model = RandomForestClassifier(n_estimators=300, random_state=42)" },
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
