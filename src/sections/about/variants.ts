import type { Variants } from "framer-motion";

export function getAboutVariants(isMobile: boolean) {
  const bentoItemVariants: Variants = {
    hidden: { opacity: 0, y: isMobile ? 0 : 20, scale: isMobile ? 1 : 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: isMobile ? 0.3 : 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: isMobile ? 0 : 0.1, delayChildren: isMobile ? 0 : 0.05 },
    },
  };

  return { bentoItemVariants, containerVariants };
}
