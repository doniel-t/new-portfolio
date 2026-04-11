"use client";

import { useMotionValue, useTransform, useSpring } from "framer-motion";
import React from "react";

const springCfg = { stiffness: 220, damping: 22, mass: 0.2 } as const;
const scrollSpringCfg = { stiffness: 280, damping: 30, mass: 0.24 } as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function useParallax(
  isMobile: boolean,
  sectionRef: React.RefObject<HTMLElement | null>
) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scrollProgress = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [8, -8]), springCfg);
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-10, 10]), springCfg);
  const shiftX = useSpring(useTransform(mouseX, [-1, 1], [-8, 8]), springCfg);
  const shiftY = useSpring(useTransform(mouseY, [-1, 1], [-4, 4]), springCfg);
  const smoothScrollProgress = useSpring(scrollProgress, scrollSpringCfg);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId = 0;
    let isTrackingScroll = false;

    const updateScrollProgress = () => {
      const rect = section.getBoundingClientRect();
      const nextProgress = clamp(-rect.top / Math.max(rect.height, 1), 0, 1);
      scrollProgress.set(nextProgress);
    };

    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        updateScrollProgress();
      });
    };

    const startTracking = () => {
      if (isTrackingScroll) return;
      isTrackingScroll = true;
      updateScrollProgress();
      window.addEventListener("scroll", scheduleUpdate, { passive: true });
      window.addEventListener("resize", scheduleUpdate);
    };

    const stopTracking = () => {
      if (!isTrackingScroll) return;
      isTrackingScroll = false;
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          startTracking();
        } else {
          stopTracking();
        }
      },
      { threshold: 0 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      stopTracking();
    };
  }, [scrollProgress, sectionRef]);

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
    scrollProgress: smoothScrollProgress,
    handleParallaxMove,
    resetParallax,
  };
}
