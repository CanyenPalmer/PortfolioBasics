export const IMAGE_BY_SLUG: Record<string, { src: string; alt: string }> = {
  "cgm-patient-analytics": {
    src: "/images/cgm-patient-avatar.png",
    alt: "CGM Patient Analytics preview",
  },
  "logistic-regression-and-tree-based-ml": {
    src: "/images/logistic-regression-avatar.png",
    alt: "Logistic Regression & Tree-Based ML preview",
  },
  "real-estate-conditions-comparison-r": {
    src: "/images/real-estate-avatar.png",
    alt: "Real Estate Conditions (R) preview",
  },
  "python-101": {
    src: "/images/python-101-avatar.png",
    alt: "Python 101 preview",
  },
  "mycaddy-physics-shot-calculator": {
    src: "/images/mycaddy-avatar.png",
    alt: "MyCaddy — Physics Shot Calculator preview",
  },
  "portfoliobasics-this-site": {
    src: "/images/portfolio-basics-avatar.png",
    alt: "PortfolioBasics preview",
  },
};

export function imageForSlug(slug: string) {
  return (
    IMAGE_BY_SLUG[slug] ?? {
      src: "/images/portfolio-basics-avatar.png",
      alt: "Project preview",
    }
  );
}
