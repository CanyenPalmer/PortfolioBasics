"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { hero } from "../content/hero.data";
import CodeEdgesTyped from "./CodeEdgesTyped";
import NameCodeExplode from "./NameCodeExplode";
import SummaryRunner from "./SummaryRunner";
import InlineTypeLine from "./InlineTypeLine"; // <-- NEW

export default function Hero() {
  return (
    <section className="relative isolate w-full min-h-screen flex items-center justify-center px-6 md:px-12">
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

            {/* NEW: typed tagline line (acts like terminal, with blinking cursor) */}
            <InlineTypeLine
              className="text-[15px] md:text-[17px] text-white/80 mt-1 mb-2"
              prompt="" // keep clean; add "$ " or "> " if you want a visible prompt
              text="Turning data into decisions through science, code, and storytelling."
              typingSpeed={18}
              startDelayMs={180}
              retypeOnReenter={true}
              visibleThreshold={0.6}
              ariaLabel="Tagline"
            />

            {/* summary.py card -> Run -> terminal overlay (never clips / no CTA overlap) */}
            <SummaryRunner
              className="mt-3 mb-6"
              proficiency={hero.skills.proficiency}
              familiarity={hero.skills.familiarity}
              techStack={hero.skills.techStack}
              minHeightPx={320}      // ensure terminal fully visible on mobile
              minHeightPxMd={420}    // extra space on md+ so it never touches buttons
            />

            {/* CTAs (kept) */}
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

        {/* RIGHT COLUMN — Headshot */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center h-full relative z-10"
          >
            <div
              className="
                relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/15
                w-full max-w-full
                h-[280px] sm:h-[340px] md:h-[clamp(520px,70vh,860px)]
                md:w-[min(46vw,620px)]
                aspect-[3/4]
                flex items-center justify-center
              "
            >
              <Image
                src={hero.headshot}
                alt="Headshot of Canyen Palmer"
                fill
                priority
                sizes="(min-width: 768px) min(46vw, 620px), 100vw"
                quality={95}
                className="object-cover rounded-2xl"
              />
            </div>
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
                {
                  text: "auc = roc_auc_score(y_te, model.predict_proba(X_te)[:,1])",
                },
              ]}
              left={[
                {
                  text:
                    "model = RandomForestClassifier(n_estimators=300, random_state=42)",
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
