"use client";

import { useEffect, useRef } from "react";

const GLYPHS = " .,:;+*#@";
const CELL_X = 13;
const CELL_Y = 17;

function hash(x: number, y: number) {
  let n = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

function noise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function cloudNoise(x: number, y: number) {
  return noise(x, y) * 0.62 + noise(x * 2.03 + 17, y * 2.03 + 9) * 0.26
    + noise(x * 4.07 + 31, y * 4.07 + 23) * 0.12;
}

/** Drifting character clouds with a dissipating pointer brush. */
export default function AsciiClouds() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !host || !context) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, columns = 0, rows = 0;
    let driftX = new Float32Array(0), driftY = new Float32Array(0);
    let time = 0, frame = 0, previous = 0;
    let visible = false;
    let pointer: { x: number; y: number } | null = null;
    let quietRegions: { left: number; top: number; right: number; bottom: number }[] = [];

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.font = '13px "Courier New", monospace';
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = "#fff";
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const index = row * columns + col;
          const x = (col + 0.5) * CELL_X, y = (row + 0.5) * CELL_Y;
          const u = (x + driftX[index]) / 260 - time * 0.14;
          const v = (y + driftY[index]) / 280 + time * 0.028;
          // Slow irregular currents fold the cloud field into small eddies.
          const warpX = noise(u * 0.75 + 41, v * 0.75 + time * 0.025) * 1.8;
          const warpY = noise(u * 0.75 + 7, v * 0.75 - time * 0.02) * 1.5;
          const density = Math.max(0, Math.min(1, (cloudNoise(u + warpX, v + warpY) - 0.36) * 2.7));
          const glyph = GLYPHS[Math.min(GLYPHS.length - 1, Math.floor(density * GLYPHS.length))];
          if (glyph === " ") continue;
          let quiet = 0;
          for (const region of quietRegions) {
            const dx = Math.max(region.left - x, 0, x - region.right);
            const dy = Math.max(region.top - y, 0, y - region.bottom);
            quiet = Math.max(quiet, Math.exp(-(dx * dx + dy * dy) / 3200));
          }
          const brush = Math.min(1, Math.hypot(driftX[index], driftY[index]) / 70);
          context.globalAlpha = Math.min(1, 0.13 + density * 0.72 + brush * 0.12) * (1 - quiet * 0.88);
          context.fillText(glyph, x, y);
        }
      }
    };

    const animate = (stamp: number) => {
      if (stamp - previous >= 1000 / 30) {
        const dt = Math.min((stamp - previous) / 1000, 0.1);
        previous = stamp;
        time += dt;
        const decay = Math.exp(-dt * 0.85);
        for (let i = 0; i < driftX.length; i++) { driftX[i] *= decay; driftY[i] *= decay; }
        draw();
      }
      frame = requestAnimationFrame(animate);
    };
    const syncPlayback = () => {
      cancelAnimationFrame(frame);
      if (visible && !document.hidden && !reducedMotion.matches) {
        previous = performance.now();
        frame = requestAnimationFrame(animate);
      } else draw();
    };
    const brush = (event: PointerEvent) => {
      if (reducedMotion.matches || event.pointerType === "touch") return;
      const bounds = host.getBoundingClientRect();
      const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
      if (pointer) {
        const dx = Math.max(-45, Math.min(45, x - pointer.x));
        const dy = Math.max(-45, Math.min(45, y - pointer.y));
        const steps = Math.min(8, Math.ceil(Math.hypot(x - pointer.x, y - pointer.y) / 24));
        for (let step = 1; step <= steps; step++) {
          const px = pointer.x + (x - pointer.x) * step / steps;
          const py = pointer.y + (y - pointer.y) * step / steps;
          for (let row = Math.max(0, Math.floor((py - 140) / CELL_Y)); row < Math.min(rows, Math.ceil((py + 140) / CELL_Y)); row++) {
            for (let col = Math.max(0, Math.floor((px - 140) / CELL_X)); col < Math.min(columns, Math.ceil((px + 140) / CELL_X)); col++) {
              const ox = col * CELL_X - px, oy = row * CELL_Y - py;
              const weight = Math.exp(-(ox * ox + oy * oy) / 6000);
              const i = row * columns + col;
              driftX[i] = Math.max(-150, Math.min(150, driftX[i] - dx * weight * 1.4));
              driftY[i] = Math.max(-150, Math.min(150, driftY[i] - dy * weight * 1.4));
            }
          }
        }
      }
      pointer = { x, y };
    };
    const leave = () => { pointer = null; };
    const resize = new ResizeObserver(() => {
      width = canvas.clientWidth; height = canvas.clientHeight;
      columns = Math.ceil(width / CELL_X); rows = Math.ceil(height / CELL_Y);
      driftX = new Float32Array(columns * rows); driftY = new Float32Array(columns * rows);
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bounds = host.getBoundingClientRect();
      // Clear only the actual content groups so the flow stays visible between them.
      quietRegions = Array.from(host.querySelectorAll(".hero-heading, .hero-support, .hero-masthead, .hero-bottom")).map((element) => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left - bounds.left, top: rect.top - bounds.top,
          right: rect.right - bounds.left, bottom: rect.bottom - bounds.top };
      });
      draw();
    });
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncPlayback(); });
    resize.observe(canvas);
    const copyElement = host.querySelector("[data-hero-copy]");
    if (copyElement) resize.observe(copyElement);
    intersection.observe(host);
    host.addEventListener("pointermove", brush, { passive: true });
    host.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", syncPlayback);
    reducedMotion.addEventListener("change", syncPlayback);
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); intersection.disconnect();
      host.removeEventListener("pointermove", brush); host.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", syncPlayback);
      reducedMotion.removeEventListener("change", syncPlayback);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="hero-atmosphere pointer-events-none absolute inset-0 h-full w-full select-none" />;
}
