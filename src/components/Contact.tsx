"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type ContactLinks = {
  emailHref: string;
  linkedinHref: string;
  githubHref: string;
  resumeHref: string;
};

type Props = { heading?: string; links: ContactLinks; };

export default function Contact({ heading = "Contact", links }: Props) {
  const { emailHref, linkedinHref, githubHref, resumeHref } = links;

  return (
    <section id="contact" className="section-wrap">
      <div className="hud-panel">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="neon-title magenta"
        >
          {heading.toUpperCase()}
        </motion.h2>

        <div className="mt-8">
          <div className="mx-auto max-w-5xl">
            <CyberContactSVG
              emailHref={emailHref}
              linkedinHref={linkedinHref}
              githubHref={githubHref}
              resumeHref={resumeHref}
            />
          </div>

          <p className="mt-6 text-center text-white/70 text-sm">
            Prefer buttons?{" "}
            <Link className="underline underline-offset-4 hover:text-white" href={resumeHref}>Resume</Link>{" · "}
            <a className="underline underline-offset-4 hover:text-white" href={linkedinHref} target="_blank" rel="noreferrer">LinkedIn</a>{" · "}
            <a className="underline underline-offset-4 hover:text-white" href={githubHref} target="_blank" rel="noreferrer">GitHub</a>{" · "}
            <a className="underline underline-offset-4 hover:text-white" href={emailHref}>Email</a>
          </p>
        </div>
      </div>
    </section>
  );
}

function CyberContactSVG({ emailHref, linkedinHref, githubHref, resumeHref }: ContactLinks) {
  const W = 900, H = 520, CX = W/2, CY = H/2, R1 = 90, R2 = 150, R3 = 210;
  const nodes = [
    { label: "Email",    href: emailHref,    r: R2, angle: -15 },
    { label: "LinkedIn", href: linkedinHref, r: R3, angle: 52 },
    { label: "GitHub",   href: githubHref,   r: R3, angle: 182 },
    { label: "Resume",   href: resumeHref,   r: R2, angle: 250 },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet" aria-label="Contact network">
      <rect x="8" y="8" width={W-16} height={H-16} rx="20" className="fill-white/[0.03] stroke-white/10" />
      <g>
        <circle cx={CX} cy={CY} r={R3} className="stroke-white/12 fill-transparent" strokeWidth="2" />
        <circle cx={CX} cy={CY} r={R2} className="stroke-white/14 fill-transparent" strokeWidth="2" />
        <motion.circle
          cx={CX} cy={CY} r={R1}
          className="stroke-[#00e5ff] fill-transparent"
          strokeOpacity=".5" strokeWidth="2"
          animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>
      <g>
        <motion.circle cx={CX} cy={CY} r="12" className="fill-[#00e5ff]" animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
        <circle cx={CX} cy={CY} r="32" className="fill-transparent stroke-[#00e5ff]" strokeOpacity=".35" />
      </g>
      {nodes.map((n, i) => {
        const rad = (n.angle * Math.PI) / 180;
        const x = CX + n.r * Math.cos(rad), y = CY + n.r * Math.sin(rad);
        const stemLen = 34, sx = x, sy = y, ex = x + stemLen * Math.cos(rad), ey = y + stemLen * Math.sin(rad);
        return (
          <g key={i}>
            <line x1={sx} y1={sy} x2={ex} y2={ey} className="stroke-[#00e5ff]" strokeOpacity=".45" strokeWidth="2" />
            <a href={n.href} target={n.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              <g className="cursor-pointer">
                <motion.circle cx={ex} cy={ey} r="9" className="fill-[#121a26] stroke-[#00e5ff]" strokeWidth="2"
                  whileHover={{ scale: 1.15 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} />
                <text x={ex + 12} y={ey + 4} className="fill-white" opacity=".85"
                  style={{ fontSize: 13, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                  {n.label}
                </text>
              </g>
            </a>
          </g>
        );
      })}
    </svg>
  );
}
