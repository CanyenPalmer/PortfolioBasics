"use client";
import { motion, useReducedMotion } from "framer-motion";
import { hero } from "@/content/hero.data";
import CodeEdgesStrict from "@/components/CodeEdgesStrict";


export default function Hero() {
const prefersReduced = useReducedMotion();


return (
<section id="hero" className="relative isolate overflow-hidden min-h-[88vh] flex items-stretch">
{/* Optional background */}
{hero.background && (
<img src={hero.background} alt=""
className="absolute inset-0 -z-30 h-full w-full object-cover opacity-25" />
)}
<div className="absolute inset-0 -z-20 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />


{/* Equal-height 2-col layout */}
<div className="mx-auto grid w-full max-w-6xl grid-cols-1 md:grid-cols-2 gap-6 px-6 py-12 md:py-16">
{/* LEFT: Invisible container with strict containment */}
<div className="relative">
<div className="relative z-10 h-full p-6 md:p-8 flex flex-col justify-center overflow-hidden max-w-full">
<motion.h1
initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45 }}
className="text-4xl md:text-6xl font-semibold tracking-tight max-w-[28ch] md:max-w-[34ch] break-words [overflow-wrap:anywhere]"
>
{hero.headline}
</motion.h1>


<motion.p
initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, delay: 0.05 }}
className="mt-3 text-lg md:text-xl text-white/80 max-w-[60ch] md:max-w-[66ch] break-words [overflow-wrap:anywhere]"
>
{hero.subheadline}
</motion.p>


{/* Skills snapshot (3 columns) */}
<div className="mt-6 grid gap-6 md:grid-cols-3 text-sm md:text-base">
<div className="min-w-0">
<h3 className="mb-2 font-semibold">Proficiency</h3>
<ul className="space-y-1 text-white/80 [&>li]:break-words [&>li]:[overflow-wrap:anywhere]">
{hero.skills.proficiency.map((s: string) => <li key={s}>{s}</li>)}
</ul>
</div>
<div className="min-w-0">
<h3 className="mb-2 font-semibold">Familiarity</h3>
<ul className="space-y-1 text-white/80 [&>li]:break-words [&>li]:[overflow-wrap:anywhere]">
{hero.skills.familiarity.map((s: string) => <li key={s}>{s}</li>)}
</ul>
</div>
<div className="min-w-0">
<h3 className="mb-2 font-semibold">Tech Stack</h3>
<ul className="space-y-1 text-white/80 [&>li]:break-words [&>li]:[overflow-wrap:anywhere]">
{hero.skills.techStack.map((s: string) => <li key={s}>{s}</li>)}
</ul>
</div>
</div>


{/* Personal hook */}
<p className="mt-5 text-sm text-white/70 max-w-[70ch] break-words">{hero.personal}</p>


{/* CTAs */}
<div className="mt-7 flex flex-wrap gap-3">
{hero.ctas?.map((c: any) => (
<a key={c.href} href={c.href}
className={c.variant === "primary"
? "rounded-2xl px-5 py-3 bg-white text-black hover:bg-white/90 transition"
: "rounded-2xl px-5 py-3 border border-white/20 hover:bg-white/10 transition"}>
<span className="block max-w-[18ch] truncate md:whitespace-normal md:truncate-0">{c.label}</span>
</a>
))}
</div>
</div>


{/* Ambient code - outside only */}
<CodeEdgesStrict
top={[
{ text: "SELECT hole, avg(strokes) FROM rounds GROUP BY hole;", align: "start" },
{ text: "from sklearn.metrics import roc_auc_score", align: "end" },
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


{/* RIGHT: Headshot column */}
<div className="relative">
<div className="relative z-10 h-full flex items-center justify-center overflow-hidden">
{hero.headshot && (
<img src={hero.headshot} alt="Portrait of Canyen Palmer"
className="max-h-[72%] max-w-[72%] object-cover rounded-2xl ring-1 ring-white/15" />
)}
</div>


{/* Ambient code - outside only */}
<CodeEdgesStrict
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
