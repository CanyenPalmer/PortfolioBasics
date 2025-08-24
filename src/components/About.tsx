"use client";

import React from "react";
import TerminalBox from "./TerminalBox";

export default function About() {
  return (
    <section id="about" className="max-w-3xl mx-auto px-4 pt-12 md:pt-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">About</h2>

      {/* Fake terminal that retypes each time this section comes back into view. */}
      <TerminalBox
        className="mt-4"
        typingSpeed={22}        // feel free to tweak
        lineDelay={420}         // pause between lines
        retypeOnReenter={true}  // retype each time it re-enters view
        visibleThreshold={0.6}  // how much must be visible to re-trigger
        lines={[
          { prompt: "$ ", text: "whoami" },
          {
            prompt: "> ",
            text:
              "Data Scientist & Google‑Certified Data Analyst Professional",
          },
          { prompt: "$ ", text: "proficiency" },
          { prompt: "> ", text: "Python, Excel, Tableau" },
          { prompt: "$ ", text: "familiarities" },
          { prompt: "> ", text: "R, Java, SQL, Power BI, AI" },
          { prompt: "$ ", text: "tech_stack --list" },
          {
            prompt: "> ",
            text:
              "Pandas, NumPy, SciPy, seaborn, Matplotlib, statsmodels, Tidyverse, Git, Jupyter, CSV, Quarto (.qmd)",
          },
        ]}
      />
    </section>
  );
}
