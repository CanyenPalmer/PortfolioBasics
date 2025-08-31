export default function Page() {
  return (
    <>
      {/* HERO */}
      {/* @ts-expect-error */}
      <HeroSection />

      {/* EXPERIENCE */}
      {/* @ts-expect-error */}
      <ExperienceSection />

      {/* SERVICES (after Experience) */}
      {/* @ts-expect-error */}
      <ServicesGlobeSection />
    </>
  );
}

import dynamic from "next/dynamic";

const HeroSection = dynamic(() => import("@/components/Hero"), { ssr: true });
const ExperienceSection = dynamic(() => import("@/components/Experience"), { ssr: true });

// SVG version is safe either way; ssr:false avoids any flicker on hydration
const ServicesGlobeSection = dynamic(() => import("@/components/ServicesGlobe"), { ssr: false });
