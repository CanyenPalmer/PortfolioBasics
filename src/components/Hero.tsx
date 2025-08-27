"use client";

import { motion } from "framer-motion";
import { hero } from "../content/hero.data";
import CodeEdgesTyped from "./CodeEdgesTyped";
import NameCodeExplode from "./NameCodeExplode";
import SummaryRunner from "./SummaryRunner";
import SkillsBelt from "./SkillsBelt";

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
  ariaLabel = "hero-typed-line",
}: {
  text: string;
  prompt?: string;
  className?: string;
  typingSpeed?: number;   // ms/char
  startDelayMs?: number;  // ms
  retypeOnReenter?: boolean;
  visibleThreshold?: number; // 0..1
  ariaLabel?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [i, setI] = React.useState(0);
  const [armed, setArmed] = React.useState(false);
  const [started, setStarted] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const timers = React.useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= visibleThreshold) {
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
    const id = window.setTimeout(() => setI((n) => Math.min(n + 1, text.length)), typingSpeed) as unknown as number;
    timers.current.push(id);
    return () => window.clearTimeout(id);
  }, [armed, started, done, i, text, typingSpeed]);

  const visible = text.slice(0, i);
  return (
    <div ref={ref} aria-label={ariaLabel} className={className}>
      <span className="font-mono">
        {prompt && <span className="text-white/60">{prompt}</span>}
        <span className="text-white/90">{visible}</span>
        <span className={`inline-block w-[8px] h-[1.05em] translate-y-[2px] rounded-[2px] ${done ? "bg-white/30" : "bg-white/70 animate-pulse"}`} />
      </span>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full max-w-6xl mx-auto px-6 md:px-8">
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
              startDelayMs={150}
              retypeOnReenter={true}
              visibleThreshold={0.6}
              ariaLabel="tagline-typed"
            />

            {/* Tech belt under hero line, above summary.py */}
            <div className="my-4 sm:my-6" />
            <SkillsBelt />
            <div className="my-4 sm:my-6" />

            {/* summary.py terminal */}
            <SummaryRunner
              className="mt-3 mb-6"
              proficiency={hero.skills.proficiency}
              familiarity={hero.skills.familiarity}
              techStack={hero.skills.techStack}
              minHeightPx={320}
              minHeightPxMd={420}
            />

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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
