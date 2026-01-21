"use client";

import { useMotionValue, useTransform, useSpring } from "framer-motion";
import React from "react";

const springCfg = { stiffness: 120, damping: 16, mass: 0.3 } as const;

export function useParallax(isMobile: boolean) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [8, -8]), springCfg);
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-10, 10]), springCfg);
  const shiftX = useSpring(useTransform(mouseX, [-1, 1], [-8, 8]), springCfg);
  const shiftY = useSpring(useTransform(mouseY, [-1, 1], [-4, 4]), springCfg);

  const handleParallaxMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      mouseX.set(px * 2 - 1);
      mouseY.set(py * 2 - 1);
    },
    [isMobile, mouseX, mouseY]
  );

  const resetParallax = React.useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return {
    rotateX,
    rotateY,
    shiftX,
    shiftY,
    handleParallaxMove,
    resetParallax,
  };
}
