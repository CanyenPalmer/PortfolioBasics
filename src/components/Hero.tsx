"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { hero } from "../content/hero.data";
import CodeEdgesTyped from "./CodeEdgesTyped";
import NameCodeExplode from "./NameCodeExplode";
import TerminalBox from "./TerminalBox";

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
              min-h-[420px] md:minh-[clamp(520px,70vh,860px)]
            "
          >
            {/* Animated Name */}
            <div className="mb-4">
              <NameCodeExplode
                text="Canyen Palmer"
                className="text-5xl md:text-7xl font-extrabold tracking-tight"
                intensity={70}
                stagger={0.012}
                opacityClass="text-white/25"
              />
            </div>

            {/* (Removed) Title line under the name */}
            {/* <h1 className="text-2xl md:text-4xl font-bold leading-tight max-w-[34ch]">
              {hero.headline}
            </h1> */}

            {/* Fake code card that 'runs' a summary */}
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#10151d]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 text-xs text-white/60">
                <span className="inline-flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                </span>
                <span className="ml-3 font-mono">summary.py</span>
              </div>
              <pre className="px-4 py-4 font-mono text-[13px] leading-6 text-[#e6edf3] whitespace-pre-wrap">
<span className="text-[#6a737d]"># build a quick portfolio summary</span>
<span className="block"><span className="text-[#c678dd]">def</span> <span className="text-[#61afef]">summary</span>():</span>
<span className="block">  <span className="text-[#c678dd]">return</span> {"{"}</span>
<span className="block">    <span className="text-[#98c379]">"proficiency"</span>: <span className="text-[#98c379]">"{hero.skills.proficiency.join(", ")}"</span>,</span>
<span className="block">    <span className="text-[#98c379]">"familiarities"</span>: <span className="text-[#98c379]">"{hero.skills.familiarity.join(", ")}"</span>,</span>
<span className="block">    <span className="text-[#98c379]">"tech_stack"</span>: <span className="text-[#98c379]">"{hero.skills.techStack.join(", ")}"</span></span>
<span className="block">  {"}"}</span>
<span className="block"></span>
<span className="block"><span className="text-[#c678dd]">if</span> <span className="text-[#d19a66]">__name__</span> == <span className="text-[#98c379]">"__main__"</span>:</span>
<span className="block">  <span className="text-[#56b6c2]">print</span>(<span className="text-[#61afef]">summary</span>())</span>
              </pre>
            </div>

            {/* Terminal typing skills snapshot (starts after the code "runs") */}
            <TerminalBox
              className="mt-4"
              typingSpeed={22}
              lineDelay={420}
              retypeOnReenter={true}
              visibleThreshold={0.6}
              startDelayMs={600}  // small pause to feel like code executed
              lines={[
                { prompt: "$ ", text: "python summary.py" },
                { prompt: "> ", text: "whoami" },
                {
                  prompt: "> ",
                  text: "Data Scientist & Google-Certified Data Analyst Professional",
                },

                { prompt: "$ ", text: "proficiency" },
                { prompt: "> ", text: hero.skills.proficiency.join(", ") },

                { prompt: "$ ", text: "familiarities" },
                { prompt: "> ", text: hero.skills.familiarity.join(", ") },

                { prompt: "$ ", text: "tech_stack --list" },
                { prompt: "> ", text: hero.skills.techStack.join(", ") },
              ]}
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

          {/* Typed code edges — LEFT (unchanged) */}
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

        {/* RIGHT COLUMN — Headshot (unchanged) */}
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

          {/* Typed code edges — RIGHT (unchanged) */}
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
