// trigger redeploy
"use client";

import { motion } from "framer-motion";
import { hero } from "../content/hero.data";   // ← relative import
import CodeEdgesTyped from "./CodeEdgesTyped.tsx";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch w-full max-w-6xl">
        {/* LEFT COLUMN — Text */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center h-full relative z-10 overflow-hidden"
          >
            <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-[34ch] break-words">
              {hero.headline}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/80 max-w-[66ch] break-words">
              {hero.subheadline}
            </p>

            {/* Skills snapshot */}
            <div className="mt-6 space-y-3 text-sm text-white/70">
              <p><span className="font-semibold">Proficiency:</span> {hero.skills.proficiency.join(", ")}</p>
              <p><span className="font-semibold">Familiarities:</span> {hero.skills.familiarity.join(", ")}</p>
              <p><span className="font-semibold">Tech Stack:</span> {hero.skills.techStack.join(", ")}</p>
            </div>

            <p className="mt-6 text-white/70 max-w-[70ch] break-words">{hero.personal}</p>

            <div className="mt-8 flex gap-4">
              {hero.ctas.map((cta, i) => (
                <a key={i} href={cta.href}
                   className={`px-5 py-3 rounded-xl font-medium transition ${
                     cta.variant === "primary"
                       ? "bg-blue-600 hover:bg-blue-700 text-white"
                       : "border border-white/30 hover:bg-white/10 text-white"
                   }`}>
                  {cta.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Animated code edges — LEFT column */}
          <CodeEdgesTyped
            gap={24}
            strip={20}
            speedMs={26}
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

        {/* RIGHT COLUMN — Headshot */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center h-full relative z-10"
          >
            <div className="relative h-full w-full md:w-[min(46vw,620px)] max-w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/15 flex items-center justify-center">
              <img
                src={hero.headshot}
                alt="Headshot of Canyen Palmer"
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Animated code edges — RIGHT column */}
          <CodeEdgesTyped
            gap={24}
            strip={20}
            speedMs={24}
            opacityClass="text-white/25"
            top={[{ text: "df.groupby('hole')['strokes'].mean()" }]}
            bottom={[
              { text: "from sklearn.metrics import roc_auc_score" },
              { text: "auc = roc_auc_score(y_te, model.predict_proba(X_te)[:,1])" },
            ]}
            left={[
              { text: "model = RandomForestClassifier(n_estimators=300)" },
              { text: "model.fit(X_tr, y_tr)" },
            ]}
            right={[{ text: "precision_at_k(y_te, y_prob, k=0.1)" }]}
          />
        </div>
      </div>
    </section>
  );
}
