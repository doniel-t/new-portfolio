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

// ── Shared RAF manager ──
// All PixelDivider instances register a tick callback here.
// A single requestAnimationFrame loop drives them all at 24fps.
type TickCallback = (deltaTime: number) => void;

const subscribers = new Set<TickCallback>();
let rafId = 0;
let lastTimestamp = 0;

function sharedLoop(timestamp: number) {
  if (lastTimestamp === 0) lastTimestamp = timestamp;
  const delta = (timestamp - lastTimestamp) / 1000;

  // Only tick at ~24fps
  if (delta >= 1 / 24) {
    lastTimestamp = timestamp;
    for (const cb of subscribers) {
      cb(delta);
    }
  }

  if (subscribers.size > 0) {
    rafId = requestAnimationFrame(sharedLoop);
  } else {
    rafId = 0;
    lastTimestamp = 0;
  }
}

function subscribe(cb: TickCallback) {
  subscribers.add(cb);
  if (!rafId) {
    lastTimestamp = 0;
    rafId = requestAnimationFrame(sharedLoop);
  }
}

function unsubscribe(cb: TickCallback) {
  subscribers.delete(cb);
  if (subscribers.size === 0 && rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
    lastTimestamp = 0;
  }
}

// ── Component ──
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
  const dimensionsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Pre-compute constants
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
      ctxRef.current = canvas.getContext("2d");

      const columns = Math.max(1, Math.ceil(width / pixelSize) + 2);
      const particles: Particle[] = [];
      for (let c = 0; c < columns; c++) {
        for (let s = 0; s < streamsPerCol; s++) {
          particles.push({ x: c * pixelSize, progress: Math.random() });
        }
      }
      particlesRef.current = particles;
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(container);
    return () => ro.disconnect();
  }, [pixelSize, streamsPerCol]);

  // Observe visibility
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "100px" }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Subscribe to shared RAF loop when visible
  useEffect(() => {
    if (!isVisible) return;

    const tick: TickCallback = (deltaTime) => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (!canvas || !ctx) return;

      const { height } = dimensionsRef.current;
      const dpr = window.devicePixelRatio || 1;
      const scaledPixel = pixelSize * dpr;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const progressDelta = deltaTime * invDuration;
      const isUp = direction === "up";

      ctx.fillStyle = color;

      // Batch by quantized opacity (11 buckets)
      const buckets: number[][] = [];
      for (let b = 0; b <= 10; b++) buckets.push([]);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.progress += progressDelta;
        if (p.progress >= 1) p.progress = p.progress % 1;

        let y: number;
        if (isUp) {
          y = height - p.progress * travelDistance;
        } else {
          y = -pixelSize + p.progress * travelDistance;
        }

        const yScaled = y * dpr;
        if (yScaled + scaledPixel < 0 || yScaled > canvas.height) continue;

        let opacity: number;
        if (p.progress <= 0.7) {
          opacity = 1 - (p.progress / 0.7) * 0.15;
        } else {
          opacity = 0.85 * (1 - (p.progress - 0.7) / 0.3);
        }

        const bucket = Math.round(opacity * 10);
        buckets[bucket].push(p.x * dpr, yScaled);
      }

      for (let b = 10; b >= 0; b--) {
        const items = buckets[b];
        if (items.length === 0) continue;
        ctx.globalAlpha = b / 10;
        for (let j = 0; j < items.length; j += 2) {
          ctx.fillRect(items[j], items[j + 1], scaledPixel, scaledPixel);
        }
      }

      ctx.globalAlpha = 1;
    };

    subscribe(tick);
    return () => unsubscribe(tick);
  }, [isVisible, color, pixelSize, travelDistance, invDuration, direction]);

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
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
