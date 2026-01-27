"use client";

import { useRef, useEffect, useState } from "react";

type NoiseProps = {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number; // 0-255
};

const PREGENERATED_FRAMES = 4;
const CANVAS_SIZE = 512; // reduced from 1024 — noise doesn't need high res

export default function Noise({
  patternSize = 250,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 15,
}: NoiseProps) {
  const grainRef = useRef<HTMLCanvasElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Observe visibility
  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    // Observe parent since the canvas is fixed/fullscreen — observe document element instead
    observer.observe(document.documentElement);
    setIsVisible(true); // fixed overlay is always "visible" if mounted
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    // Base color for the grain: #A69F8D (R:166, G:159, B:141)
    const baseR = 0xa6;
    const baseG = 0x9f;
    const baseB = 0x8d;

    // Pre-generate a few noise frames as ImageData
    const frames: ImageData[] = [];
    for (let f = 0; f < PREGENERATED_FRAMES; f++) {
      const imageData = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const intensity = Math.random();
        data[i] = Math.round(baseR * intensity);
        data[i + 1] = Math.round(baseG * intensity);
        data[i + 2] = Math.round(baseB * intensity);
        data[i + 3] = patternAlpha;
      }
      frames.push(imageData);
    }

    // Draw first frame immediately
    ctx.putImageData(frames[0], 0, 0);

    let frameIndex = 0;
    let rafCount = 0;
    let animationId = 0;

    const loop = () => {
      rafCount++;
      if (rafCount % patternRefreshInterval === 0) {
        frameIndex = (frameIndex + 1) % PREGENERATED_FRAMES;
        ctx.putImageData(frames[frameIndex], 0, 0);
      }
      animationId = window.requestAnimationFrame(loop);
    };

    if (isVisible) {
      loop();
    }

    return () => {
      window.cancelAnimationFrame(animationId);
    };
  }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha, isVisible]);

  return <canvas className="noise-overlay" ref={grainRef} style={{ imageRendering: "pixelated" }} />;
}
