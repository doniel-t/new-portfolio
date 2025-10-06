"use client";

import { useEffect, useRef, useState } from "react";

type PixelDividerProps = {
  color?: string;
  pixelSize?: number; // px
  durationSec?: number; // seconds
  rise?: string; // e.g. "-160%"
  streamsPerCol?: number; // number of simultaneous square streams per column
  className?: string;
  style?: React.CSSProperties;
};

export default function PixelDivider({
  color = "#130e05",
  pixelSize = 28,
  durationSec = 4.5,
  rise = "-180%",
  streamsPerCol = 5,
  className = "",
  style = {},
}: PixelDividerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [columns, setColumns] = useState<number>(0);

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

  const maskStyle: React.CSSProperties = {
    WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
    maskImage: "linear-gradient(to top, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden pointer-events-none ${className}`}
      style={{ ...style, ...maskStyle, ["--pixel-rise" as any]: rise } as React.CSSProperties}
    >
      {squares.map((sq, idx) => (
        <div
          key={idx}
          className="pixel-divider-square"
          style={{
            position: "absolute",
            left: sq.left,
            bottom: -pixelSize,
            width: pixelSize,
            height: pixelSize,
            background: color,
            animation: `pixel-divider-rise var(${"--duration"}, ${durationSec}s) linear infinite`,
            animationDelay: `${sq.delay}s`,
          } as React.CSSProperties}
        />)
      )}
    </div>
  );
}


