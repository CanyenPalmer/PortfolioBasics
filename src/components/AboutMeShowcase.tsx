"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const CYAN = "#00e5ff";

type Pose = {
  id: number;
  key: string;
  title: string;
  img: string;
  alt: string;
  body: React.ReactNode;
};

const POSES: readonly Pose[] = [
  {
    id: 1,
    key: "power",
    title: "Welcome to my About Me section!",
    img: "/about/pose-1-power.webp",
    alt: "Canyen in a confident power pose with neon seam accents",
    body: (
      <div className="space-y-4">
        <p>
          My name is <strong>Canyen Palmer</strong> and I am a{" "}
          <strong>Data Scientist & Google Certified Data Analytics Professional</strong>{" "}
          specializing in statistics, machine learning, optimization, predictive modeling, and
          visualization. Currently pursuing my <strong>Master’s in Data Science</strong> at the
          University of Pittsburgh, I focus on turning raw data into actionable insights that drive
          decision-making, efficiency, and business outcomes.
        </p>
        <div className="space-y-2">
          <p className="font-semibold text-cyan-300/90">🛠️ Core Proficiency</p>
          <ul className="list-disc pl-6">
            <li>
              <strong>Languages:</strong> Python, SQL, R, TypeScript, JavaScript
            </li>
            <li>
              <strong>Libraries:</strong> pandas, NumPy, scikit-learn, Matplotlib, seaborn,
              statsmodels, Tidyverse
            </li>
            <li>
              <strong>Visualization:</strong> Tableau, Excel, Google Sheets
            </li>
            <li>
              <strong>Frameworks & Tools:</strong> Flask, React, TailwindCSS, GitHub, Jupyter, VS
              Code, Quarto
            </li>
          </ul>
        </div>
        <p className="text-white/70">
          Use the arrows or glowing nodes below to explore each chapter of my story.
        </p>
      </div>
    ),
  },
  {
    id: 2,
    key: "golf",
    title: "Discovering Analytics",
    img: "/about/pose-2-golf.webp",
    alt: "Canyen mid golf swing with a neon trail arc",
    body: (
      <div className="space-y-4">
        <p>
          After being offered the opportunity to play golf and continue my education at{" "}
          <strong>Franklin College</strong>, I decided to take both my education and my game to the
          next level. I realized the quickest way to achieve rapid improvement was to conduct{" "}
          <strong>thorough analysis</strong> of my performance—identifying where I could cut strokes
          and lower my scoring average.
        </p>
        <p>
          What many saw as a suffocating amount of research became my <strong>greatest strength</strong>,
          both on the course and in my personal development. When health challenges arrived, I faced
          a hard choice: protect my body’s long-term health or pursue a career in golf. That turning
          point led me to redirect my academic path—transferring to <strong>Ball State University</strong> to
          study <strong>mathematics</strong> and <strong>computer science</strong>.
        </p>
      </div>
    ),
  },
  {
    id: 3,
    key: "terminal",
    title: "Composing Research",
    img: "/about/pose-3-terminal.webp",
    alt: "Canyen at a massive cyberpunk terminal cluster with many glowing monitors",
    body: (
      <div className="space-y-4">
        <p>
          At <strong>Ball State University</strong>, I gathered an enormous amount of data from many
          sources—educational material through assignments and lectures, professional insights from
          career fairs, and collaboration with peers that sharpened communication, teamwork, and
          leadership.
        </p>
        <p>
          Every experience became a <strong>data entry in my personal library of datasets</strong>:
          subjects, courses, and topics forming unique entries in a growing knowledge repository.
          I learned to write my own “queries” across disciplines—connecting concepts and building an
          analytical framework I still use today.
        </p>
        <p>
          I pushed beyond the classroom by pursuing certifications in{" "}
          <strong>computer science, statistics, machine learning, and data analytics</strong>,
          continuously expanding the scope and depth of that knowledge base.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    key: "hospital",
    title: "Down, But Not Out",
    img: "/about/pose-4-hospital.webp",
    alt: "Canyen recovering in a futuristic hospital bed working on a laptop",
    body: (
      <div className="space-y-4">
        <p>
          In 2023, I underwent a <strong>double foot operation</strong> that changed my life. The
          procedure resulted in a <strong>50% reduction of mobility across 8 of my 10 toes</strong>—a
          tradeoff to prevent paralysis. During recovery, academics became my anchor.
        </p>
        <p>
          That summer, I earned placement on the <strong>Dean’s List</strong> at Ball State,
          reflecting not just GPA but the determination I poured into my studies while confined to a
          wheelchair. I refined techniques for projects, portfolios, résumés, and my personal brand—
          all while learning to walk again.
        </p>
        <p>
          I once thought the hardest part would be landing a fair-paying job to support my family.
          It turned out to be something humbler: the daily act of <strong>putting on my socks</strong>{" "}
          after surgery—and choosing to keep moving forward.
        </p>
      </div>
    ),
  },
  {
    id: 5,
    key: "vision",
    title: "The Future",
    img: "/about/pose-5-vision.webp",
    alt: "Canyen on a rooftop before a neon skyline, arms crossed",
    body: (
      <div className="space-y-4">
        <p>
          After graduation, I explored what the world could offer me—and what I could offer myself.
          I gained real-world experience at an <strong>overnight manufacturing facility</strong> and a{" "}
          <strong>DME startup</strong>, while continuing freelance analytics for companies, peers,
          and family. That’s where I learned what it truly means to put <strong>passion</strong> into{" "}
          work.
        </p>
        <p>
          Today, I’m pursuing my <strong>Master’s in Data Science</strong> at the University of
          Pittsburgh, focused on giving communities access to insights that can change everyday
          lives. In a world of rising costs, I believe we can harness{" "}
          <strong>data science, machine learning, analytics, and software development</strong> to
          make life better for all.
        </p>
        <p>
          I am currently <strong>open to work and collaborate</strong> with companies who share this
          vision. If your mission is to build solutions that improve people’s lives,{" "}
          <strong>I’d love to connect and talk more.</strong>
        </p>
      </div>
    ),
  },
];

function usePreload(srcs: string[]) {
  React.useEffect(() => {
    const imgs = srcs.map((s) => {
      const i = new window.Image();
      i.src = s;
      return i;
    });
    return () => {
      imgs.forEach((i) => void (i.onload = null));
    };
  }, [srcs]);
}

export default function AboutMeShowcase() {
  const [index, setIndex] = React.useState(0);
  const total = POSES.length;

  usePreload(POSES.map((p) => p.img));

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  const current = POSES[index];

  const imgVariants = {
    initial: { opacity: 0, y: 10 },
    enter: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.18 } },
  } as const;

  const textVariants = {
    initial: { opacity: 0, y: 8 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.22 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.14 } },
  } as const;

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-[#0b1016] text-white"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-20 md:grid-cols-2 md:gap-10 lg:gap-16">
        {/* Left: Character / Pose */}
        <div className="relative order-2 md:order-1">
          <div className="pointer-events-none absolute -left-10 -top-10 -z-10 h-72 w-72 rounded-full blur-3xl [background:radial-gradient(circle,rgba(0,229,255,.16)_0%,rgba(255,59,212,.06)_70%,transparent_80%)]" />
          <div className="relative aspect-[3/4] w-full select-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.key}
                variants={imgVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className="absolute inset-0"
              >
                <Image
                  src={current.img}
                  alt={current.alt}
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, 40vw"
                  className="object-contain drop-shadow-[0_0_30px_rgba(0,229,255,.25)]"
                />
                <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-30 [background:repeating-linear-gradient(0deg,rgba(255,255,255,.05)_0_1px,transparent_1px_3px)]" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Holo Text Box */}
        <div className="order-1 md:order-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.key + "-text"}
              variants={textVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="relative rounded-2xl border border-cyan-300/30 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(0,229,255,.12)] backdrop-blur-md md:p-7 lg:p-8"
              aria-live="polite"
            >
              <div className="mb-4 flex items-center gap-2 text-sm uppercase tracking-widest text-cyan-300/90">
                <span
                  className="inline-block h-2 w-2 animate-pulse rounded-full"
                  style={{ background: CYAN }}
                />
                <span id="about-heading">{current.title}</span>
              </div>
              <div className="text-base/7 text-white/90">{current.body}</div>
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="group rounded-xl border border-white/10 px-4 py-2 font-medium text-white/90 transition hover:border-white/30 hover:bg-white/5"
                >
                  <span className="inline-block -translate-x-0.5 transition group-hover:-translate-x-1">
                    ◀
                  </span>
                </button>
                <div className="flex items-center gap-3">
                  {POSES.map((p, i) => (
                    <button
                      key={p.key}
                      aria-label={`Go to ${p.title}`}
                      onClick={() => setIndex(i)}
                      className="relative h-3.5 w-3.5 rounded-full"
                    >
                      <span
                        className="absolute inset-0 rounded-full opacity-60"
                        style={{ boxShadow: `0 0 0 1px ${CYAN}40` }}
                      />
                      <span
                        className={`absolute inset-[3px] rounded-full ${
                          i === index ? "opacity-100" : "opacity-0"
                        } transition-opacity duration-200`}
                        style={{ background: CYAN }}
                      />
                      {i === index && (
                        <span
                          className="absolute inset-0 animate-ping rounded-full"
                          style={{ background: `${CYAN}33` }}
                        />
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="group rounded-xl border border-white/10 px-4 py-2 font-medium text-white/90 transition hover:border-white/30 hover:bg-white/5"
                >
                  <span className="inline-block translate-x-0.5 transition group-hover:translate-x-1">
                    ▶
                  </span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
