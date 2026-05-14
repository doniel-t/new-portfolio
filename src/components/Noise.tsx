"use client";

import { useRef, useEffect } from "react";
import { canUseOffscreenCanvas } from "@/lib/offscreenCanvas";

type NoiseProps = {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number; // 0-255
};

const PREGENERATED_FRAMES = 4;
const CANVAS_SIZE = 128;

export default function Noise({
  patternSize = 250,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 15,
}: NoiseProps) {
  const grainRef = useRef<HTMLCanvasElement | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const cleanupTimerRef = useRef<number>(0);
  const usesWorkerRef = useRef(false);
  const configRef = useRef({ patternRefreshInterval, patternAlpha });

  configRef.current = { patternRefreshInterval, patternAlpha };

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas || !canUseOffscreenCanvas(canvas)) return;

    if (cleanupTimerRef.current) {
      window.clearTimeout(cleanupTimerRef.current);
      cleanupTimerRef.current = 0;
      return () => {
        cleanupTimerRef.current = window.setTimeout(() => {
          workerRef.current?.postMessage({ type: "stop" });
          workerRef.current?.terminate();
          workerRef.current = null;
          usesWorkerRef.current = false;
        }, 0);
      };
    }

    if (!workerRef.current && !usesWorkerRef.current) {
      canvas.style.width = "100%";
      canvas.style.height = "100%";

      const worker = new Worker(new URL("../workers/noiseCanvas.worker.ts", import.meta.url), {
        type: "module",
      });
      const offscreen = canvas.transferControlToOffscreen();

      workerRef.current = worker;
      usesWorkerRef.current = true;
      const { patternRefreshInterval: refreshInterval, patternAlpha: alpha } = configRef.current;
      worker.postMessage(
        {
          type: "init",
          canvas: offscreen,
          canvasSize: CANVAS_SIZE,
          refreshInterval,
          alpha,
        },
        [offscreen],
      );
    }

    return () => {
      cleanupTimerRef.current = window.setTimeout(() => {
        workerRef.current?.postMessage({ type: "stop" });
        workerRef.current?.terminate();
        workerRef.current = null;
        usesWorkerRef.current = false;
      }, 0);
    };
  }, []);

  useEffect(() => {
    workerRef.current?.postMessage({
      type: "config",
      canvasSize: CANVAS_SIZE,
      refreshInterval: patternRefreshInterval,
      alpha: patternAlpha,
    });
  }, [patternRefreshInterval, patternAlpha, patternSize, patternScaleX, patternScaleY]);

  useEffect(() => {
    if (usesWorkerRef.current) return;

    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const baseR = 0xa6;
    const baseG = 0x9f;
    const baseB = 0x8d;

    // Pre-generate noise frames
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

    // Swap frames via setInterval — no need for RAF since we're just blitting pre-rendered data
    // ~8fps (125ms) is plenty for a subtle noise texture
    let frameIndex = 0;
    const intervalMs = Math.max(100, patternRefreshInterval * (1000 / 60));
    const intervalId = setInterval(() => {
      frameIndex = (frameIndex + 1) % PREGENERATED_FRAMES;
      ctx.putImageData(frames[frameIndex], 0, 0);
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha]);

  return <canvas className="noise-overlay" ref={grainRef} style={{ imageRendering: "pixelated" }} />;
}
