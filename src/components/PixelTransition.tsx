"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { canUseOffscreenCanvas } from "@/lib/offscreenCanvas";

type PixelTransitionProps = {
  firstContent: React.ReactNode;
  secondContent?: React.ReactNode;
  gridSize?: number; // number of rows/cols
  pixelColor?: string; // css color
  animationStepDuration?: number; // seconds
  className?: string;
  style?: React.CSSProperties;
  aspectRatio?: string | null; // e.g. "56.25%" for 16/9; null/undefined uses natural size
  startActive?: boolean; // start with secondContent visible
  autoplayReveal?: boolean; // trigger pixel transition to reveal firstContent on mount
  autoplayDelayMs?: number;
};

export default function PixelTransition({
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = "#1C1303",
  animationStepDuration = 0.3,
  className = "",
  style = {},
  aspectRatio = undefined,
  startActive = true,
  autoplayReveal = true,
  autoplayDelayMs = 60,
}: PixelTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const workerRef = useRef<Worker | null>(null);
  const workerCleanupTimerRef = useRef<number>(0);
  const usesWorkerRef = useRef(false);
  const pendingActivateRef = useRef(startActive);

  const [, setIsActive] = useState<boolean>(startActive);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canUseOffscreenCanvas(canvas)) return;

    if (workerCleanupTimerRef.current) {
      window.clearTimeout(workerCleanupTimerRef.current);
      workerCleanupTimerRef.current = 0;
      return () => {
        workerCleanupTimerRef.current = window.setTimeout(() => {
          workerRef.current?.postMessage({ type: "stop" });
          workerRef.current?.terminate();
          workerRef.current = null;
          usesWorkerRef.current = false;
        }, 0);
      };
    }

    if (!workerRef.current && !usesWorkerRef.current) {
      const worker = new Worker(new URL("../workers/pixelWipeCanvas.worker.ts", import.meta.url), {
        type: "module",
      });
      const offscreen = canvas.transferControlToOffscreen();

      worker.onmessage = (event: MessageEvent<{ type: "midpoint" | "complete" }>) => {
        if (event.data.type !== "midpoint") return;

        const activeEl = activeRef.current;
        if (!activeEl) return;

        const activate = pendingActivateRef.current;
        activeEl.style.display = activate ? "block" : "none";
        activeEl.style.pointerEvents = activate ? "none" : "";
      };

      workerRef.current = worker;
      usesWorkerRef.current = true;
      worker.postMessage({ type: "init", canvas: offscreen }, [offscreen]);
    }

    return () => {
      workerCleanupTimerRef.current = window.setTimeout(() => {
        workerRef.current?.postMessage({ type: "stop" });
        workerRef.current?.terminate();
        workerRef.current = null;
        usesWorkerRef.current = false;
      }, 0);
    };
  }, []);

  const animatePixels = useCallback((activate: boolean) => {
    setIsActive(activate);
    pendingActivateRef.current = activate;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const activeEl = activeRef.current;
    if (!canvas || !container || !activeEl) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (usesWorkerRef.current && workerRef.current) {
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      workerRef.current.postMessage({
        type: "resize",
        width: rect.width,
        height: rect.height,
        dpr,
      });
      workerRef.current.postMessage({
        type: "play",
        mode: "content",
        color: pixelColor,
        durationMs: animationStepDuration * 2000,
        gridSize,
      });
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const totalPixels = gridSize * gridSize;
    const pixelW = rect.width / gridSize;
    const pixelH = rect.height / gridSize;

    // Create shuffled indices
    const indices: number[] = Array.from({ length: totalPixels }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const pixelState = new Uint8Array(totalPixels);
    if (!activate) {
      pixelState.fill(1); // Start all visible if hiding
    }

    const startTime = performance.now();
    const duration = animationStepDuration * 1000;

    // Phase 1: reveal pixels, Phase 2: hide pixels
    const totalDuration = duration * 2;

    const animLoop = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);

      ctx.clearRect(0, 0, rect.width, rect.height);

      if (progress <= 0.5) {
        // Phase 1: show pixels
        const phaseProgress = progress / 0.5;
        const targetCount = Math.floor(phaseProgress * totalPixels);
        for (let i = 0; i < targetCount; i++) {
          pixelState[indices[i]] = 1;
        }
      } else {
        // Switch content at midpoint
        if (progress > 0.5) {
          activeEl.style.display = activate ? "block" : "none";
          activeEl.style.pointerEvents = activate ? "none" : "";
        }
        // Phase 2: hide pixels
        const phaseProgress = (progress - 0.5) / 0.5;
        const targetCount = Math.floor(phaseProgress * totalPixels);
        for (let i = 0; i < targetCount; i++) {
          pixelState[indices[i]] = 0;
        }
      }

      ctx.fillStyle = pixelColor;
      for (let i = 0; i < totalPixels; i++) {
        if (pixelState[i]) {
          const col = i % gridSize;
          const row = Math.floor(i / gridSize);
          ctx.fillRect(col * pixelW, row * pixelH, pixelW, pixelH);
        }
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animLoop);
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(animLoop);
  }, [gridSize, pixelColor, animationStepDuration]);

  useEffect(() => {
    const activeEl = activeRef.current;
    if (!activeEl) return;
    activeEl.style.display = startActive ? "block" : "none";

    if (autoplayReveal) {
      const id = window.setTimeout(() => {
        animatePixels(false);
      }, autoplayDelayMs);
      return () => window.clearTimeout(id);
    }
  }, [autoplayReveal, autoplayDelayMs, startActive, animatePixels]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${className} relative overflow-hidden rounded-2xl border border-muted/40 bg-primary`}
      style={style}
    >
      {aspectRatio ? <div style={{ paddingTop: aspectRatio }} /> : null}

      <div className="absolute inset-0 w-full h-full">{firstContent}</div>

      <div ref={activeRef} className="absolute inset-0 w-full h-full z-[2]" style={{ display: "none" }}>
        {secondContent ?? null}
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[3]" />
    </div>
  );
}
