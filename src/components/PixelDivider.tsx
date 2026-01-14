"use client";

import { useEffect, useRef, useCallback } from "react";

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

  // Parse the rise percentage
  const parseRise = useCallback((riseStr: string): number => {
    const match = riseStr.match(/^(-?\d+(?:\.\d+)?)%$/);
    if (match) {
      return Math.abs(parseFloat(match[1])) / 100;
    }
    return 1.8;
  }, []);

  // Initialize particles for given dimensions
  const initParticles = useCallback((columns: number) => {
    const particles: Particle[] = [];
    for (let c = 0; c < columns; c++) {
      for (let s = 0; s < streamsPerCol; s++) {
        particles.push({
          x: c * pixelSize,
          progress: Math.random(), // Random initial progress for staggering
        });
      }
    }
    particlesRef.current = particles;
  }, [pixelSize, streamsPerCol]);

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    // Calculate delta time
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
    }
    const deltaTime = (timestamp - lastTimeRef.current) / 1000; // Convert to seconds
    lastTimeRef.current = timestamp;

    const { height } = dimensionsRef.current;
    const dpr = window.devicePixelRatio || 1;
    const riseMultiplier = parseRise(rise);
    
    // Travel distance: interpret rise as percentage of container height
    // This gives the expected visual behavior where squares spread across the container
    const travelDistance = pixelSize * riseMultiplier;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Update progress (this is linear time progress, matching CSS animation)
      p.progress += deltaTime / durationSec;
      if (p.progress >= 1) {
        p.progress = p.progress % 1;
      }

      // Calculate Y position based on direction
      // Squares start at the spawn edge and travel inward
      let y: number;
      if (direction === "up") {
        // Start at bottom, travel upward
        // startY = bottom of container + pixelSize (just below visible)
        const startY = height;
        y = startY - p.progress * travelDistance;
      } else {
        // Start at top, travel downward
        const startY = -pixelSize;
        y = startY + p.progress * travelDistance;
      }

      // Calculate opacity matching the CSS keyframes:
      // 0% -> opacity: 1
      // 70% -> opacity: 0.85
      // 100% -> opacity: 0
      let opacity: number;
      if (p.progress <= 0.7) {
        // Linear interpolation from 1 to 0.85 over 0-70%
        opacity = 1 - (p.progress / 0.7) * 0.15;
      } else {
        // Linear interpolation from 0.85 to 0 over 70-100%
        opacity = 0.85 * (1 - (p.progress - 0.7) / 0.3);
      }

      // Draw the pixel
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.fillRect(p.x * dpr, y * dpr, pixelSize * dpr, pixelSize * dpr);
    }

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [color, pixelSize, durationSec, rise, direction, parseRise]);

  // Setup canvas and handle resize
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const updateSize = () => {
      const width = container.clientWidth || 0;
      const height = container.clientHeight || 0;
      const dpr = window.devicePixelRatio || 1;

      // Set canvas dimensions
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      dimensionsRef.current = { width, height };

      // Calculate columns and reinitialize particles
      const columns = Math.max(1, Math.ceil(width / pixelSize) + 2);
      initParticles(columns);
    };

    updateSize();

    const ro = new ResizeObserver(updateSize);
    ro.observe(container);

    return () => ro.disconnect();
  }, [pixelSize, initParticles]);

  // Start/stop animation loop
  useEffect(() => {
    lastTimeRef.current = 0;
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

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
