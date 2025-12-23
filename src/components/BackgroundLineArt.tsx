"use client";

import React, { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

type BackgroundLineArtProps = {
  className?: string;
};

// Hook to detect if element is visible in viewport
function useIsVisible(ref: React.RefObject<HTMLElement | null>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '50px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
}

export default function BackgroundLineArt({ className }: BackgroundLineArtProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(containerRef);
  const isMobile = useIsMobile();
  
  // Pause all animations on mobile
  const shouldAnimate = isVisible && !isMobile;
  
  return (
    <div 
      ref={containerRef}
      className={"pointer-events-none absolute inset-0 z-0 " + (className ?? "")}
      aria-hidden
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full text-muted opacity-40"
        style={{ 
          // Pause animations when not visible or on mobile
          animationPlayState: shouldAnimate ? 'running' : 'paused'
        }}
      >
        {/* Huge circle on the right side */}
        <circle
          cx="120"
          cy="38"
          r="62"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          strokeDasharray="195 195"
          className={shouldAnimate ? "line-art-animate" : ""}
          style={{ 
            animationDuration: '16s',
            animationPlayState: shouldAnimate ? 'running' : 'paused'
          }}
        />

        {/* Diagonal lines across the canvas */}
        <path
          d="M -10 82 L 110 22"
          fill="none"
          stroke="currentColor"
          strokeWidth={0.4}
          vectorEffect="non-scaling-stroke"
          strokeDasharray="144 25"
          className={shouldAnimate ? "line-art-animate" : ""}
          style={{ 
            animationDuration: '10s',
            animationPlayState: shouldAnimate ? 'running' : 'paused'
          }}
        />

        <path
          d="M -6 94 L 106 54"
          fill="none"
          stroke="currentColor"
          strokeWidth={0.35}
          vectorEffect="non-scaling-stroke"
          strokeDasharray="112 48"
          className={shouldAnimate ? "line-art-animate" : ""}
          style={{ 
            animationDuration: '11.5s',
            animationPlayState: shouldAnimate ? 'running' : 'paused'
          }}
        />

        {/* Fine straight guides */}
        <line
          x1="6"
          y1="18"
          x2="96"
          y2="18"
          stroke="currentColor"
          strokeWidth={0.3}
          vectorEffect="non-scaling-stroke"
          strokeDasharray="54 36"
          className={shouldAnimate ? "line-art-animate" : ""}
          style={{ 
            animationDuration: '8.5s',
            animationPlayState: shouldAnimate ? 'running' : 'paused'
          }}
        />

        <line
          x1="8"
          y1="12"
          x2="8"
          y2="92"
          stroke="currentColor"
          strokeWidth={0.3}
          vectorEffect="non-scaling-stroke"
          strokeDasharray="40 40"
          className={shouldAnimate ? "line-art-animate" : ""}
          style={{ 
            animationDuration: '7.8s',
            animationPlayState: shouldAnimate ? 'running' : 'paused'
          }}
        />

        {/* Subtle angled accent near bottom-right */}
        <path
          d="M 60 86 L 108 66"
          fill="none"
          stroke="currentColor"
          strokeWidth={0.35}
          vectorEffect="non-scaling-stroke"
          strokeDasharray="36 20"
          className={shouldAnimate ? "line-art-animate" : ""}
          style={{ 
            animationDuration: '8.2s',
            animationPlayState: shouldAnimate ? 'running' : 'paused'
          }}
        />
      </svg>
    </div>
  );
}


