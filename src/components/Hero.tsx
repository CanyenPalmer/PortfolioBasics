"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { hero } from "../content/hero.data";
import CodeEdgesTyped from "./CodeEdgesTyped";

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
              min-h-[420px] md:min-h-[520px]
            "
          >
            <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-[34ch]">
              {hero.headline}
            </h1>

            <p className="mt-4 text-lg md:text-xl text-white/80 max-w-[66ch]">
              {hero.subheadline}
            </p>

            {/* Skills snapshot */}
            <div className="mt-6 space-y-3 text-sm text-white/70">
              <p><span className="font-semibold">Proficiency:</span> {hero.skills.proficiency.join(", ")}</p>
              <p><span className="font-semibold">Familiarities:</span> {hero.skills.familiarity.join(", ")}</p>
              <p><span className="font-semibold">Tech Stack:</span> {hero.skills.techStack.join(", ")}</p>
            </div>

            <p className="mt-6 text-white/70 max-w-[70ch]">{hero.personal}</p>

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

          {/* Code edges — hidden on mobile */}
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

        {/* RIGHT COLUMN — Headshot (snap widths, keep 3/4 aspect) */}
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
                h-[280px] sm:h-[340px]        /* small screens: fixed heights */
                sm:w-[360px]                  /* snap to clean width at sm */
                md:w-[560px] lg:w-[600px]     /* desktop: fixed widths (clean sampling) */
                md:h-auto                     /* let aspect control height from md+ */
                aspect-[3/4]
                mx-auto
              "
            >
              <Image
                src={hero.headshot}
                alt="Headshot of Canyen Palmer"
                fill
                priority
                quality={95}                  // sharper output
                sizes="(min-width: 1024px) 600px, (min-width: 768px) 560px, (min-width: 640px) 360px, 100vw"
                className="object-cover rounded-2xl [image-rendering:auto]"
              />
            </div>
          </motion.div>

          {/* Code edges — hidden on mobile */}
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
