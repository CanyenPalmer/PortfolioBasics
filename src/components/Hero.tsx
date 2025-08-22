"use client";

import { motion } from "framer-motion";
import { hero } from "@/content/hero.data";
import CodeEdgesStrict from "./CodeEdgesStrict";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 md:px-12">
      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch w-full max-w-6xl">
        {/* LEFT COLUMN — Text (make parent relative so edges anchor correctly) */}
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
              <p>
                <span className="font-semibold">Proficiency:</span>{" "}
                {hero.skills.proficiency.join(", ")}
              </p>
              <p>
                <span className="font-semibold">Familiarities:</span>{" "}
                {hero.skills.familiarity.join(", ")}
              </p>
              <p>
                <span className="font-semibold">Tech Stack:</span>{" "}
                {hero.skills.techStack.join(", ")}
              </p>
            </div>

            {/* Personal blurb */}
            <p className="mt-6 text-white/70 max-w-[70ch] break-words">
              {hero.personal}
            </p>

            {/* CTA Buttons */}
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

          {/* Ambient code that SURROUNDS the left column */}
          <CodeEdgesStrict
            gap={22}
            strip={18}
            opacityClass="text-white/25"
            top={[
              { text: "SELECT hole, avg(strokes) FROM rounds GROUP BY hole;", align: "start" },
              { text: "from sklearn.metrics = roc_auc_score", align: "end" },
            ]}
            bottom={[
              { text: "X_train, X_test, y_train, y_test = train_test_split(X, y)", align: "start" },
              { text: "y_pred = model.predict(X_test)", align: "end" },
            ]}
            left={[
              { text: "import pandas as pd" },
              { text: "df = pd.read_csv('golf_stats.csv')" },
            ]}
            right={[]}
          />
        </div>

        {/* RIGHT COLUMN — Headshot (tall as left; same width; edges anchored here) */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center h-full relative z-10"
          >
            {/* Stable frame: height matches the row (from headline down through Tech Stack) */}
            <div
              className="
                relative h-full w-full md:w-[min(46vw,620px)] max-w-full
                overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/15
                flex items-center justify-center
              "
            >
              <img
                src={hero.headshot}
                alt="Headshot of Canyen Palmer"
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Ambient code that SURROUNDS the right column (incl. vertical rail on the left edge) */}
          <CodeEdgesStrict
            gap={22}
            strip={18}
            opacityClass="text-white/25"
            top={[{ text: "df.groupby('hole')['strokes'].mean()", align: "center" }]}
            bottom={[{ text: "auc = roc_auc_score(y_test, y_pred)", align: "center" }]}
            left={[
              { text: "y_prob = model.predict_proba(X_test)[:,1]" },
              { text: "auc = roc_auc_score(y_test, y_prob)" },
            ]}
            right={[]}
          />
        </div>
      </div>
    </section>
  );
}

