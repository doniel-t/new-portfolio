"use client";

import { useRef, useEffect } from "react";

type NoiseProps = {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number; // 0-255
};

export default function Noise({
  patternSize = 250,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 15,
}: NoiseProps) {
  const grainRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let animationId = 0;
    const canvasSize = 1024;

    const resize = () => {
      const el = grainRef.current;
      if (!el) return;
      el.width = canvasSize;
      el.height = canvasSize;
      el.style.width = "100%";
      el.style.height = "100%";
    };

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const data = imageData.data;

      // Base color for the grain: #A69F8D (R:166, G:159, B:141)
      const baseR = 0xA6;
      const baseG = 0x9F;
      const baseB = 0x8D;

      for (let i = 0; i < data.length; i += 4) {
        const intensity = Math.random(); // 0..1 brightness per pixel
        data[i] = Math.round(baseR * intensity);
        data[i + 1] = Math.round(baseG * intensity);
        data[i + 2] = Math.round(baseB * intensity);
        data[i + 3] = patternAlpha;
      }

      ctx.putImageData(imageData, 0, 0);
      // Tile the grain
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.imageSmoothingEnabled = false;
      ctx.restore();
    };

    const loop = () => {
      if (frame % patternRefreshInterval === 0) {
        drawGrain();
      }
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };

    window.addEventListener("resize", resize);
    resize();
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationId);
    };
  }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha]);

  return <canvas className="noise-overlay" ref={grainRef} style={{ imageRendering: "pixelated" }} />;
}


