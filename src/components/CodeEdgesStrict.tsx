"use client";
import { motion, useReducedMotion } from "framer-motion";


type Snip = { text: string; align?: "start" | "center" | "end" };


type Props = {
top?: Snip[]; right?: Snip[]; bottom?: Snip[]; left?: Snip[];
gap?: number; strip?: number; opacityClass?: string;
};


export default function CodeEdgesStrict({
top = [], right = [], bottom = [], left = [],
gap = 22, strip = 18, opacityClass = "text-white/20",
}: Props) {
const prefersReduced = useReducedMotion();
const base =
`pointer-events-none select-none font-mono text-[10px] md:text-xs ${opacityClass} whitespace-pre`;


const drift = (axis: "x" | "y", i: number) =>
prefersReduced ? { opacity: 1 } : {
opacity: 1,
x: axis === "x" ? [0, 6, 0] : 0,
y: axis === "y" ? [0, 6, 0] : 0,
transition: { duration: 7 + (i % 3), repeat: Infinity, ease: "linear" },
};


return (
<div aria-hidden className="absolute inset-0">
{/* TOP */}
{top.length > 0 && (
<div className="absolute left-0 right-0 flex items-center"
style={{ top: -gap - strip, height: strip }}>
<div className="w-full px-2 flex justify-between">
{top.map((s, i) => (
<motion.div key={`t-${i}`} className={`${base} ${rowAlign(s.align)}`}
initial={{ opacity: 0 }} animate={drift("x", i)}>{s.text}</motion.div>
))}
</div>
</div>
)}


{/* BOTTOM */}
{bottom.length > 0 && (
<div className="absolute left-0 right-0 flex items-center"
style={{ bottom: -gap - strip, height: strip }}>
<div className="w-full px-2 flex justify-between">
{bottom.map((s, i) => (
<motion.div key={`b-${i}`} className={`${base} ${rowAlign(s.align)}`}
initial={{ opacity: 0 }} animate={drift("x", i)}>{s.text}</motion.div>
))}
</div>
</div>
)}


{/* LEFT */}
{left.length > 0 && (
<div className="absolute top-0 bottom-0 flex"
style={{ left: -gap - strip, width: strip }}>
<div className="h-full py-2 w-full flex flex-col justify-between items-center">
{left.map((s, i) => (
<motion.div key={`l-${i}`} className={base}
style={{ writingMode: "vertical-rl" }}
initial={{ opacity: 0 }} animate={drift("y", i)}>{s.text}</motion.div>
))}
</div>
</div>
)}


{/* RIGHT */}
{right.length > 0 && (
<div className="absolute top-0 bottom-0 flex"
style={{ right: -gap - strip, width: strip }}>
<div className="h-full py-2 w-full flex flex-col justify-between items-center">
{right.map((s, i) => (
<motion.div key={`r-${i}`} className={base}
style={{ writingMode: "vertical-rl" }}
initial={{ opacity: 0 }} animate={drift("y", i)}>{s.text}</motion.div>
))}
</div>
</div>
)}
</div>
);
}


function rowAlign(align: "start" | "center" | "end" | undefined) {
if (align === "start") return "self-start";
if (align === "end") return "self-end";
return "self-center";
}
