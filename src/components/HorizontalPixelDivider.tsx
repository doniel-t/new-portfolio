"use client";

import { useEffect, useRef, useState } from "react";

type HorizontalPixelDividerProps = {
  color?: string;
  pixelSize?: number;
  durationSec?: number;
  travel?: string;
  streamsPerRow?: number;
  direction?: "left" | "right";
  fadeTo?: "left" | "right";
  className?: string;
  style?: React.CSSProperties;
};

type Particle = {
  y: number;
  progress: number;
};

type TickCallback = (deltaTime: number) => void;

const subscribers = new Set<TickCallback>();
let rafId = 0;
let lastTimestamp = 0;

function sharedLoop(timestamp: number) {
  if (lastTimestamp === 0) lastTimestamp = timestamp;
  const delta = (timestamp - lastTimestamp) / 1000;

  if (delta >= 1 / 24) {
    lastTimestamp = timestamp;
    for (const cb of subscribers) cb(delta);
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

function parseTravel(travelStr: string): number {
  const match = travelStr.match(/^(-?\d+(?:\.\d+)?)%$/);
  if (match) return Math.abs(Number.parseFloat(match[1])) / 100;
  return 1.5;
}

export default function HorizontalPixelDivider({
  color = "#0d0b08",
  pixelSize = 22,
  durationSec = 6,
  travel = "160%",
  streamsPerRow = 1,
  direction = "right",
  fadeTo,
  className = "",
  style = {},
}: HorizontalPixelDividerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const dimensionsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const travelMultiplier = parseTravel(travel);
  const travelDistance = pixelSize * travelMultiplier;
  const invDuration = 1 / durationSec;

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

      const rows = Math.max(1, Math.ceil(height / pixelSize) + 1);
      const particles: Particle[] = [];
      for (let r = 0; r < rows; r++) {
        for (let s = 0; s < streamsPerRow; s++) {
          particles.push({ y: r * pixelSize, progress: Math.random() });
        }
      }
      particlesRef.current = particles;
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(container);
    return () => ro.disconnect();
  }, [pixelSize, streamsPerRow]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "120px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const tick: TickCallback = (deltaTime) => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const { width } = dimensionsRef.current;
      const scaledPixel = pixelSize * dpr;
      const progressDelta = deltaTime * invDuration;
      const moveRight = direction === "right";

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;

      const buckets: number[][] = [];
      for (let b = 0; b <= 10; b++) buckets.push([]);

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.progress += progressDelta;
        if (p.progress >= 1) p.progress %= 1;

        const x = moveRight
          ? -pixelSize + p.progress * travelDistance
          : width - p.progress * travelDistance;

        const xScaled = x * dpr;
        const yScaled = p.y * dpr;
        if (xScaled + scaledPixel < 0 || xScaled > canvas.width) continue;

        let opacity = 1;
        if (p.progress <= 0.72) {
          opacity = 1 - (p.progress / 0.72) * 0.18;
        } else {
          opacity = 0.82 * (1 - (p.progress - 0.72) / 0.28);
        }

        const bucket = Math.max(0, Math.min(10, Math.round(opacity * 10)));
        buckets[bucket].push(xScaled, yScaled);
      }

      for (let b = 10; b >= 0; b--) {
        const points = buckets[b];
        if (points.length === 0) continue;
        ctx.globalAlpha = b / 10;
        for (let j = 0; j < points.length; j += 2) {
          ctx.fillRect(points[j], points[j + 1], scaledPixel, scaledPixel);
        }
      }

      ctx.globalAlpha = 1;
    };

    subscribe(tick);
    return () => unsubscribe(tick);
  }, [isVisible, color, pixelSize, direction, invDuration, travelDistance]);

  const fadeDirection = fadeTo ?? direction;
  const maskStyle: React.CSSProperties =
    fadeDirection === "right"
      ? {
          WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
          maskImage: "linear-gradient(to right, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
        }
      : {
          WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
          maskImage: "linear-gradient(to left, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)",
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
