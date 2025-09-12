"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type ToolbarLink = {
  label: string;
  href: string;
  external?: boolean;
  aria?: string;
};

type Props = {
  id?: string; // keep #home anchor
  name: string;
  tagline: string;
  toolbar: ToolbarLink[]; // Resume, GitHub, LinkedIn, Email
  socials?: ToolbarLink[]; // optional second row (keep empty if you don’t want it)
  className?: string;
};

/**
 * Avatar-first hero that keeps your VSCode bar + section anchors.
 * - Avatar = lightweight 2D placeholder (swap later with your art/Lottie)
 * - Shards = subtle ambient motion
 * - Toolbar directly UNDER the tagline (your request)
 * - Scroll cue: “Scroll down to continue website” + arrow
 */
export default function HeroAvatar({
  id = "home",
  name,
  tagline,
  toolbar,
  socials = [],
  className,
}: Props) {
  return (
    <section
      id={id}
      aria-label="Home"
      className={`relative isolate w-full overflow-hidden bg-[#0b1016] text-white px-6 sm:px-8 md:px-12 pt-24 md:pt-28 lg:pt-32 pb-20 md:pb-24 ${className ?? ""}`}
    >
      {/* Ambient shard burst */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute left-1/2 top-1/2 size-[140vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          initial={{ opacity: 0.18, scale: 0.9 }}
          animate={{ opacity: 0.22, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background:
              "radial-gradient(closest-side, rgba(0,229,255,.12), rgba(255,59,212,.08) 40%, transparent 70%)",
            filter: "blur(28px)",
          }}
        />
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-[2px] w-24 origin-left bg-gradient-to-r from-cyan-300/70 to-fuchsia-400/70"
            style={{ left: "50%", top: "50%", rotate: i * 30 }}
            initial={{ scaleX: 0.4, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.7 }}
            transition={{ delay: 0.25 + i * 0.03, duration: 0.6 }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Neutral 2D avatar placeholder — swap later with your art */}
        <motion.div
          className="mx-auto mb-8 flex h-[240px] w-[240px] items-center justify-center rounded-full border border-cyan-500/25 bg-gradient-to-b from-[#0c1218] to-[#0b1016] shadow-[0_0_48px_rgba(0,229,255,.12)] md:h-[280px] md:w-[280px]"
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          <svg viewBox="0 0 160 160" className="h-[68%] w-[68%] text-cyan-300/90">
            <circle cx="80" cy="80" r="74" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="2" />
            <path d="M55 70c0-13 10-23 25-23s25 10 25 23-10 23-25 23-25-10-25-23z" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M50 110c9-7 22-10 30-10s21 3 30 10" fill="none" stroke="currentColor" strokeOpacity=".8" strokeWidth="2" />
            <circle cx="65" cy="74" r="3" fill="currentColor" />
            <circle cx="95" cy="74" r="3" fill="currentColor" />
            <path d="M70 90c4 3 16 3 20 0" fill="none" stroke="currentColor" strokeOpacity=".7" strokeWidth="2" />
          </svg>
        </motion.div>

        <div className="text-center">
          <motion.h1
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-extrabold tracking-tight md:text-7xl"
            style={{ textShadow: "0 0 18px rgba(0,229,255,.25), 0 0 32px rgba(255,59,212,.18)" }}
          >
            <span className="text-cyan-300">{name.split(" ")[0].toUpperCase()}</span>{" "}
            <span className="text-cyan-300">{name.split(" ")[1]?.toUpperCase() || ""}</span>
          </motion.h1>

          <motion.p
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.6 }}
            className="mt-4 text-lg md:text-xl"
          >
            <span className="text-fuchsia-400">{tagline}</span>
          </motion.p>

          {/* Toolbar under subheader */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.55 }}
            className="mx-auto mt-6 flex w-full max-w-2xl flex-wrap items-center justify-center gap-3"
            aria-label="Primary actions"
          >
            {toolbar.map((t) => {
              const inner = (
                <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90 shadow-[0_0_18px_rgba(0,229,255,.12)] hover:bg-white/7 hover:text-white">
                  {t.label}
                </span>
              );
              return t.external ? (
                <a key={t.label} href={t.href} rel="noreferrer noopener" target="_blank" aria-label={t.aria || t.label}>
                  {inner}
                </a>
              ) : (
                <Link key={t.label} href={t.href} aria-label={t.aria || t.label}>
                  {inner}
                </Link>
              );
            })}
          </motion.div>

          {/* Optional socials row */}
          {Boolean(socials.length) && (
            <div className="mt-4 flex items-center justify-center gap-4 opacity-80">
              {socials.map((s) => (
                <a key={s.label} href={s.href} rel="noreferrer noopener" target="_blank" className="transition-opacity hover:opacity-100" aria-label={s.aria || s.label}>
                  <span className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs">{s.label}</span>
                </a>
              ))}
            </div>
          )}

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 flex flex-col items-center gap-2 text-white/70"
            aria-hidden
          >
            <span className="text-sm">Scroll down to continue website</span>
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block rounded-full border border-white/15 p-2"
              style={{ boxShadow: "0 0 16px rgba(0,229,255,.2)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" />
              </svg>
            </motion.span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
