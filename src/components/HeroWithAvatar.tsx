// src/components/HeroWithAvatar.tsx
"use client";

import React from "react";
import SkillsBelt from "@/components/SkillsBelt";

type Props = {
  headline: string;
  subheadline: string;
  typer?: string;
};

export default function Hero({ headline, subheadline, typer }: Props) {
  return (
    <section
      id="home"
      className="relative min-h-[72vh] overflow-hidden flex items-center"
    >
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Copy */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">{headline}</h1>

          {/* Toolbar moved here and width-capped to the text column so it won’t hit the avatar */}
          <div className="mt-4 w-full max-w-[520px]">
            <SkillsBelt speedSeconds={26} />
          </div>

          <p className="text-neutral-300 text-lg">{subheadline}</p>
          {typer ? (
            <p className="text-sm text-neutral-400 leading-relaxed">{typer}</p>
          ) : null}
        </div>

        {/* Avatar (static image, transparent background) */}
        <div className="justify-self-center">
          <img
            src="/about/avatar-hero-headshot.png"
            alt="Avatar"
            className="w-[300px] md:w-[360px] drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
