"use client";

import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

type PixelDividerProps = {
  color?: string;
  pixelSize?: number; // px
  durationSec?: number; // seconds
  rise?: string; // e.g. "-160%" for up, "160%" for down
  streamsPerCol?: number; // number of simultaneous square streams per column
  direction?: "up" | "down"; // animation direction
  className?: string;
  style?: React.CSSProperties;
};

export default function PixelDivider({
  color = "#130e05",
  pixelSize = 28,
  durationSec = 4.5,
  rise = "-180%",
  streamsPerCol = 5,
  direction = "up",
  className = "",
  style = {},
}: PixelDividerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [columns, setColumns] = useState<number>(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const compute = () => {
      const width = el.clientWidth || 0;
      const cols = Math.max(1, Math.ceil(width / pixelSize) + 2);
      setColumns(cols);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [pixelSize]);

  const squares = [] as Array<{ left: number; delay: number }>;
  for (let c = 0; c < columns; c++) {
    for (let s = 0; s < streamsPerCol; s++) {
      squares.push({ left: c * pixelSize, delay: -Math.random() * durationSec });
    }
  }

  // Mask gradient direction based on animation direction
  const maskStyle: React.CSSProperties = direction === "up"
    ? {
        WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
        maskImage: "linear-gradient(to top, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
      }
    : {
        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
      };

  // CSS variable and animation name based on direction
  const cssVar = direction === "up" ? "--pixel-rise" : "--pixel-fall";
  const animationName = direction === "up" ? "pixel-divider-rise" : "pixel-divider-fall";

  // Don't render animation squares on mobile for performance
  if (isMobile) {
    return (
      <div
        ref={containerRef}
        className={`relative w-full h-full overflow-hidden pointer-events-none ${className}`}
        style={style}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden pointer-events-none ${className}`}
      style={{ ...style, ...maskStyle, [cssVar as any]: rise } as React.CSSProperties}
    >
      {squares.map((sq, idx) => (
        <div
          key={idx}
          className="pixel-divider-square"
          style={{
            position: "absolute",
            left: sq.left,
            // Position at bottom for up animation, top for down animation
            ...(direction === "up" ? { bottom: -pixelSize } : { top: -pixelSize }),
            width: pixelSize,
            height: pixelSize,
            background: color,
            animation: `${animationName} var(${"--duration"}, ${durationSec}s) linear infinite`,
            animationDelay: `${sq.delay}s`,
          } as React.CSSProperties}
        />)
      )}
    </div>
  );
}


