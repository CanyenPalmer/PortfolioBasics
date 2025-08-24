"use client";

import * as React from "react";
import { motion, useMotionValue, animate } from "framer-motion";

type Props = {
  text?: string;
  className?: string;

  // Physics tuning
  intensity?: number;               
  returnSpring?: { stiffness: number; damping: number }; // explosion/return spring

  // Visuals
  opacityClass?: string;            
  letterClassName?: string;
  shardScale?: number;              
  codeShardsPerLetter?: number;     
  upLeftSpreadDeg?: number;         
};

const CODE_FRAGMENTS = [
  "import","def","return","if","else","for","while",
  "SELECT *","JOIN","GROUP BY","=>","lambda",
  "fit()","predict()","ROC","AUC","mean()","std()",
  "pd.read_csv()","groupby()","merge()","plt.plot()","{ }","< />"
];

function seeded(n: number) {
  let x = Math.sin(n * 99991) * 10000;
  return x - Math.floor(x);
}
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

type LetterShard = { id: string; char: string; dx: number; dy: number; rot: number; };
type CodeShard = { id: string; token: string; dx: number; dy: number; rot: number; vertical?: boolean; };

export default function NameCodeExplode({
  text = "Canyen Palmer",
  className = "text-5xl md:text-7xl font-extrabold tracking-tight",

  intensity = 220,
  returnSpring = { stiffness: 280, damping: 30 }, // <-- tuned slower & springy

  opacityClass = "text-white/25",
  letterClassName = "",
  shardScale = 0.5,
  codeShardsPerLetter = 6,
  upLeftSpreadDeg = 170,
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const [hovering, setHovering] = React.useState(false);

  const [mag, setMag] = React.useState(intensity);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const diag = Math.hypot(window.innerWidth, window.innerHeight);
      setMag(Math.max(intensity, diag * 0.75));
    }
  }, [intensity]);

  // Find exact midpoint between last 'n' of Canyen and 'P' of Palmer
  const chars = React.useMemo(() => [...text], [text]);
  const [originDelta, setOriginDelta] = React.useState({ dx: 0, dy: 0 });
  const measureOrigin = React.useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const cbox = el.getBoundingClientRect();
    const cCX = cbox.left + cbox.width / 2;
    const cCY = cbox.top + cbox.height / 2;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-layer="visible"][data-letter-idx]'));
    if (!spans.length) return;
    const rects: Array<DOMRect | null> = Array(chars.length).fill(null);
    spans.forEach(s => { rects[+s.dataset.letterIdx!] = s.getBoundingClientRect(); });
    const tops:number[] = [], bottoms:number[] = [];
    rects.forEach(r => { if (r) { tops.push(r.top); bottoms.push(r.bottom); }});
    const lineCY = (Math.min(...tops) + Math.max(...bottoms)) / 2;
    const leftStart = text.indexOf("Canyen");
    const rightStart = text.indexOf("Palmer");
    let oX = cCX, oY = lineCY;
    if (leftStart >= 0 && rightStart >= 0) {
      const leftRect = rects[leftStart + "Canyen".length - 1];
      const rightRect = rects[rightStart];
      if (leftRect && rightRect) {
        oX = (leftRect.right + rightRect.left) / 2;
        oY = lineCY;
      }
    }
    setOriginDelta({ dx: oX - cCX, dy: oY - cCY });
  }, [chars.length, text]);
  React.useLayoutEffect(() => { measureOrigin(); }, [measureOrigin, className, letterClassName, chars.join("")]);
  React.useEffect(() => {
    const onResize = () => measureOrigin();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measureOrigin]);

  const { codeShards, letterShards } = React.useMemo(() => {
    const code: CodeShard[] = [], letters: LetterShard[] = []; let gid = 0;
    chars.forEach((ch, ci) => {
      if (ch !== " ") {
        const s0 = ci * 777 + 3;
        const angDegL = -175 + seeded(s0) * upLeftSpreadDeg;
        const angL = (angDegL * Math.PI) / 180;
        const multL = 1.0 + 0.6 * seeded(s0 + 1);
        letters.push({ id:`L-${gid++}`, char:ch,
          dx:Math.cos(angL)*mag*multL, dy:Math.sin(angL)*mag*multL,
          rot:-30+60*seeded(s0+2) });
        for (let s=0;s<codeShardsPerLetter;s++){
          const seed = ci*1000+s*17+11;
          const r1=seeded(seed), r2=seeded(seed+1), r3=seeded(seed+2);
          const ang=( (-175+r1*upLeftSpreadDeg) * Math.PI)/180;
          const mult=1.2+1.3*r2;
          code.push({
            id:`C-${gid++}`,
            token:CODE_FRAGMENTS[(ci+s)%CODE_FRAGMENTS.length],
            dx:Math.cos(ang)*mag*mult,
            dy:Math.sin(ang)*mag*mult,
            rot:-20+40*seeded(seed+3),
            vertical:r3>0.6
          });
        }
      }
    });
    return { codeShards:code, letterShards:letters };
  }, [chars, mag, codeShardsPerLetter, upLeftSpreadDeg]);

  React.useEffect(() => {
    const controls = animate(progress, hovering?1:0, {
      type:"spring",
      stiffness:returnSpring.stiffness,
      damping:returnSpring.damping
    });
    return controls.stop;
  }, [hovering, progress, returnSpring.stiffness, returnSpring.damping]);

  const eased = React.useRef(0);
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const unsub = progress.on("change", (t) => {
      eased.current = easeInOutCubic(t);
      setTick(v=>v+1);
    });
    return unsub;
  }, [progress]);

  const THRESH=0.02;

  return (
    <div
      ref={containerRef}
      className={`relative inline-block select-none ${className}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      {/* base text */}
      <span className={`relative inline-block whitespace-pre ${letterClassName}`}
        style={{opacity:(progress.get()<THRESH)?1:0,transition:"opacity 0.001s linear"}}>
        {chars.map((ch,i)=>(
          <span key={i} data-layer="visible" data-letter-idx={i} className="inline-block">{ch}</span>
        ))}
      </span>

      {/* shards */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2"
          style={{transform:`translate(calc(-50% + ${originDelta.dx}px), calc(-50% + ${originDelta.dy}px))`}}>
          {letterShards.map(p=>{
            const t=eased.current, show=progress.get()>=THRESH;
            return <motion.span key={p.id} className="absolute font-bold" aria-hidden
              style={{transform:`translate(${p.dx*t}px,${p.dy*t}px) rotate(${p.rot*t}deg)`,opacity:show?1:0}}>{p.char}</motion.span>;
          })}
          {codeShards.map(p=>{
            const t=eased.current, show=progress.get()>=THRESH;
            const sx=p.vertical?1:1+shardScale*t, sy=p.vertical?1+shardScale*t:1;
            return <motion.span key={p.id}
              className={`absolute font-mono ${opacityClass} text-[0.34em] md:text-[0.30em]`} aria-hidden
              style={{
                writingMode:p.vertical?"vertical-rl":undefined,
                transform:`translate(${p.dx*t}px,${p.dy*t}px) rotate(${p.rot*t}deg) scale(${sx},${sy})`,
                opacity:show?1:0}}>{p.token}</motion.span>;
          })}
        </div>
      </div>
    </div>
  );
}
