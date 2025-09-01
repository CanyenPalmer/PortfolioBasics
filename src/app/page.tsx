export default function Page() {
  return (
    <>
      {/* HERO (unchanged) */}
      {/* If your hero is client-side already, keep it that way */}
      {/* @ts-expect-error Server Component boundary if using app router */}
      <HeroSection />

      {/* EXPERIENCE (existing) */}
      {/* @ts-expect-error Server Component boundary if using app router */}
      <ExperienceSection />

      {/* MY SERVICES (cityscape) */}
      {/* @ts-expect-error Server Component boundary if using app router */}
      <ServicesCityscape />
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

/** Services Cityscape (client component) */
const ServicesCityscape = dynamic(
  () => import("@/components/ServicesCityscape"),
  { ssr: true }
);
