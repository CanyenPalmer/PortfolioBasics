export default function Page() {
  return (
    <>
      {/* HERO (unchanged) */}
      {/* If your hero is client-side already, keep it that way */}
      {/* @ts-expect-error Server Component boundary if using app router */}
      <HeroSection />

      {/* EXPERIENCE (unchanged) */}
      {/* @ts-expect-error Server Component boundary if using app router */}
      <ExperienceSection />

      {/* SERVICES & AVAILABILITY (new) */}
      {/* @ts-expect-error Server Component boundary if using app router */}
      <ServicesGlobeSection />
    </>
  );
}

/* -------- Local component wrappers to avoid import path issues -------- */

import dynamic from "next/dynamic";

/** Wrap Hero as a dynamic client component (no SSR change in behavior) */
const HeroSection = dynamic(() => import("@/components/Hero"), {
  ssr: true,
});

/** Experience is a client component; render as-is */
const ExperienceSection = dynamic(() => import("@/components/Experience"), {
  ssr: true,
});

/** NEW: Services globe section (Canvas2D, no new deps) */
const ServicesGlobeSection = dynamic(() => import("@/components/ServicesGlobe"), {
  ssr: true,
});
