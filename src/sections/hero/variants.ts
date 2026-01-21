import type { Variants } from "framer-motion";

export function getHeroVariants(isMobile: boolean) {
  const gridContainer: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: isMobile ? 0 : 0.2,
        delayChildren: isMobile ? 0 : 0.1,
      },
    },
  };

  const leftSection: Variants = {
    hidden: { opacity: 0, y: isMobile ? 0 : 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.3 : 0.6,
        ease: [0.16, 1, 0.3, 1],
        when: "beforeChildren",
        staggerChildren: isMobile ? 0 : 0.2,
        delayChildren: isMobile ? 0 : 0.1,
      },
    },
  };

  const childItem: Variants = {
    hidden: { opacity: 0, y: isMobile ? 0 : 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: isMobile ? 0.3 : 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const rightSection: Variants = {
    hidden: { opacity: 0, scale: isMobile ? 1 : 0.98, y: isMobile ? 0 : 10 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: isMobile ? 0.3 : 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return { gridContainer, leftSection, childItem, rightSection };
}
