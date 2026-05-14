'use client';
import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { usePageVisibility } from '@/hooks/useGPUDetection';
import { useIsMobile } from '@/hooks/useIsMobile';
import { canUseOffscreenCanvas } from '@/lib/offscreenCanvas';

interface Dot {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  vx: number;
  vy: number;
}

export interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  shockRadius?: number;
  shockStrength?: number;
  resistance?: number;
  returnDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

const DotGrid: React.FC<DotGridProps> = ({
  dotSize = 16,
  gap = 32,
  baseColor = '#5227FF',
  shockRadius = 250,
  shockStrength = 5,
  resistance = 750,
  returnDuration = 1.5,
  className = '',
  style
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const workerRef = useRef<Worker | null>(null);
  const workerCleanupTimerRef = useRef<number>(0);
  const usesWorkerRef = useRef(false);

  const isPageVisible = usePageVisibility();
  const isMobile = useIsMobile();
  const [isInViewport, setIsInViewport] = useState(false);
  const lastDrawTime = useRef(0);

  // Only animate when visible, page active, and not mobile
  const shouldRunAnimation = isPageVisible && !isMobile && isInViewport;

  // Observe visibility
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      { threshold: 0, rootMargin: '100px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canUseOffscreenCanvas(canvas)) return;

    if (workerCleanupTimerRef.current) {
      window.clearTimeout(workerCleanupTimerRef.current);
      workerCleanupTimerRef.current = 0;
      return () => {
        workerCleanupTimerRef.current = window.setTimeout(() => {
          workerRef.current?.postMessage({ type: 'stop' });
          workerRef.current?.terminate();
          workerRef.current = null;
          usesWorkerRef.current = false;
        }, 0);
      };
    }

    if (!workerRef.current && !usesWorkerRef.current) {
      const worker = new Worker(new URL('../workers/dotGridCanvas.worker.ts', import.meta.url), {
        type: 'module',
      });
      const offscreen = canvas.transferControlToOffscreen();
      workerRef.current = worker;
      usesWorkerRef.current = true;
      worker.postMessage({ type: 'init', canvas: offscreen }, [offscreen]);
    }

    return () => {
      workerCleanupTimerRef.current = window.setTimeout(() => {
        workerRef.current?.postMessage({ type: 'stop' });
        workerRef.current?.terminate();
        workerRef.current = null;
        usesWorkerRef.current = false;
      }, 0);
    };
  }, []);

  const circlePath = useMemo(() => {
    if (typeof window === 'undefined' || !window.Path2D) return null;

    const p = new Path2D();
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    return p;
  }, [dotSize]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Store CSS dimensions for proper clearing
    dimensionsRef.current = { width, height };

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    if (usesWorkerRef.current && workerRef.current) {
      workerRef.current.postMessage({
        type: 'config',
        width,
        height,
        dpr,
        dotSize,
        gap,
        baseColor,
        returnDuration,
      });
      return;
    }

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const extraX = width - gridW;
    const extraY = height - gridH;

    const startX = extraX / 2 + dotSize / 2;
    const startY = extraY / 2 + dotSize / 2;

    const dots: Dot[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        dots.push({ cx, cy, xOffset: 0, yOffset: 0, vx: 0, vy: 0 });
      }
    }
    dotsRef.current = dots;
  }, [baseColor, dotSize, gap, returnDuration]);

  useEffect(() => {
    workerRef.current?.postMessage({ type: 'active', active: shouldRunAnimation });
  }, [shouldRunAnimation]);

  useEffect(() => {
    if (!circlePath || !shouldRunAnimation || usesWorkerRef.current) return;

    let rafId: number;
    let isRunning = true;

    const draw = (timestamp: number) => {
      if (!isRunning) return;

      // Cap to 24fps
      if (timestamp - lastDrawTime.current < 1000 / 60) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      lastDrawTime.current = timestamp;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      // Use CSS dimensions for clearing (context is already scaled by dpr)
      const { width, height } = dimensionsRef.current;
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = baseColor;
      const spring = Math.max(0.012, 0.045 / Math.max(returnDuration, 0.3));
      const damping = 0.86;
      for (const dot of dotsRef.current) {
        dot.vx += -dot.xOffset * spring;
        dot.vy += -dot.yOffset * spring;
        dot.vx *= damping;
        dot.vy *= damping;
        dot.xOffset += dot.vx;
        dot.yOffset += dot.vy;

        if (
          Math.abs(dot.xOffset) < 0.02 &&
          Math.abs(dot.yOffset) < 0.02 &&
          Math.abs(dot.vx) < 0.02 &&
          Math.abs(dot.vy) < 0.02
        ) {
          dot.xOffset = 0;
          dot.yOffset = 0;
          dot.vx = 0;
          dot.vy = 0;
        }

        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;

        ctx.save();
        ctx.translate(ox, oy);
        ctx.fill(circlePath);
        ctx.restore();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      isRunning = false;
      cancelAnimationFrame(rafId);
    };
  }, [baseColor, circlePath, returnDuration, shouldRunAnimation]);

  useEffect(() => {
    if (!shouldRunAnimation) {
      workerRef.current?.postMessage({ type: 'active', active: false });
      if (usesWorkerRef.current) return;

      dotsRef.current = [];
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    buildGrid();
    let ro: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(buildGrid);
      if (wrapperRef.current) {
        ro.observe(wrapperRef.current);
      }
    } else {
      (window as Window).addEventListener('resize', buildGrid);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', buildGrid);
    };
  }, [buildGrid, shouldRunAnimation]);

  useEffect(() => {
    if (!shouldRunAnimation) return;

    const onClick = (e: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      if (usesWorkerRef.current && workerRef.current) {
        workerRef.current.postMessage({
          type: 'click',
          x: cx,
          y: cy,
          shockRadius,
          shockStrength,
          resistance,
        });
        return;
      }

      const resistanceScale = Math.max(0.3, Math.min(2, 750 / Math.max(resistance, 1)));
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
        if (dist < shockRadius) {
          const falloff = Math.max(0, 1 - dist / shockRadius);
          dot.vx += (dot.cx - cx) * shockStrength * falloff * 0.035 * resistanceScale;
          dot.vy += (dot.cy - cy) * shockStrength * falloff * 0.035 * resistanceScale;
        }
      }
    };

    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('click', onClick);
    };
  }, [resistance, returnDuration, shockRadius, shockStrength, shouldRunAnimation]);

  return (
    <section className={`p-4 flex items-center justify-center h-full w-full relative ${className}`} style={style}>
      <div ref={wrapperRef} className="w-full h-full relative">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      </div>
    </section>
  );
};

export default DotGrid;
