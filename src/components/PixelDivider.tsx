"use client";

import { useEffect, useRef, useState } from "react";

type PixelDividerProps = {
  color?: string;
  pixelSize?: number; // px
  durationSec?: number; // seconds
  rise?: string; // e.g. "-200%" - percentage of CONTAINER height for travel distance
  streamsPerCol?: number; // number of simultaneous square streams per column
  direction?: "up" | "down"; // animation direction
  className?: string;
  style?: React.CSSProperties;
};

type Particle = {
  x: number;
  progress: number; // 0-1, represents animation time progress
};

function parseRise(riseStr: string): number {
  const match = riseStr.match(/^(-?\d+(?:\.\d+)?)%$/);
  if (match) {
    return Math.abs(parseFloat(match[1])) / 100;
  }
  return 1.8;
}

export default function PixelDivider({
  color = "#0d0b08",
  pixelSize = 28,
  durationSec = 4.5,
  rise = "-180%",
  streamsPerCol = 5,
  direction = "up",
  className = "",
  style = {},
}: PixelDividerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const dimensionsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Pre-compute constants that don't change per frame
  const riseMultiplier = parseRise(rise);
  const travelDistance = pixelSize * riseMultiplier;
  const invDuration = 1 / durationSec;

  // Setup canvas and handle resize
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const updateSize = () => {
      const width = container.clientWidth || 0;
      const height = container.clientHeight || 0;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      dimensionsRef.current = { width, height };

      // Cache the context
      ctxRef.current = canvas.getContext("2d");

      // Calculate columns and reinitialize particles
      const columns = Math.max(1, Math.ceil(width / pixelSize) + 2);
      const particles: Particle[] = [];
      for (let c = 0; c < columns; c++) {
        for (let s = 0; s < streamsPerCol; s++) {
          particles.push({
            x: c * pixelSize,
            progress: Math.random(),
          });
        }
      }
      particlesRef.current = particles;
    };

    updateSize();

    const ro = new ResizeObserver(updateSize);
    ro.observe(container);

    return () => ro.disconnect();
  }, [pixelSize, streamsPerCol]);

  // Observe visibility to pause/resume animation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: '100px' }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Start/stop animation loop based on visibility
  useEffect(() => {
    if (!isVisible) return;

    lastTimeRef.current = 0;

    const animate = (timestamp: number) => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (!canvas || !ctx) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;

      // Cap to 24fps
      if (deltaTime < 1 / 24) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = timestamp;

      const { height } = dimensionsRef.current;
      const dpr = window.devicePixelRatio || 1;
      const scaledPixel = pixelSize * dpr;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const progressDelta = deltaTime * invDuration;
      const isUp = direction === "up";

      // Set fill color once
      ctx.fillStyle = color;

      // Update all particles and draw, batching by quantized opacity
      // Quantize opacity to 10 levels to reduce globalAlpha state changes
      const buckets: number[][] = [];
      for (let b = 0; b <= 10; b++) buckets.push([]);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.progress += progressDelta;
        if (p.progress >= 1) {
          p.progress = p.progress % 1;
        }

        // Calculate Y
        let y: number;
        if (isUp) {
          y = height - p.progress * travelDistance;
        } else {
          y = -pixelSize + p.progress * travelDistance;
        }

        // Skip offscreen particles
        const yScaled = y * dpr;
        if (yScaled + scaledPixel < 0 || yScaled > canvas.height) continue;

        // Calculate opacity
        let opacity: number;
        if (p.progress <= 0.7) {
          opacity = 1 - (p.progress / 0.7) * 0.15;
        } else {
          opacity = 0.85 * (1 - (p.progress - 0.7) / 0.3);
        }

        // Quantize to bucket (0-10)
        const bucket = Math.round(opacity * 10);
        // Store particle index and pre-computed y
        buckets[bucket].push(p.x * dpr, yScaled);
      }

      // Draw each opacity bucket
      for (let b = 10; b >= 0; b--) {
        const items = buckets[b];
        if (items.length === 0) continue;
        ctx.globalAlpha = b / 10;
        for (let j = 0; j < items.length; j += 2) {
          ctx.fillRect(items[j], items[j + 1], scaledPixel, scaledPixel);
        }
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, color, pixelSize, travelDistance, invDuration, direction]);

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

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden pointer-events-none ${className}`}
      style={{ ...style, ...maskStyle }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />
    </div>
  );
}
