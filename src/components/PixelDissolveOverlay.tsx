"use client";

import { useEffect, useRef, useCallback } from "react";
import HashLoader from "react-spinners/HashLoader";

const PIXEL_SIZE = 28;
const CELL_DURATION = 0.36;
const MAX_DPR = 1.75;
const MAX_CELL_DELAY = 1 - CELL_DURATION;
const LOADER_COLOR = "#A69F8D";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(value: number) {
  const inverse = 1 - value;
  return 1 - inverse * inverse * inverse;
}

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function hashNoise(column: number, row: number) {
  const seed = Math.sin(column * 127.1 + row * 311.7) * 43758.5453123;
  return seed - Math.floor(seed);
}

type Phase = "idle" | "holding" | "revealing" | "done";

type PixelDissolveOverlayProps = {
  /** Set to true to start the transition */
  active: boolean;
  /** Called immediately when the screen goes black (swap content behind it) */
  onCovered?: () => void;
  /** Called when the reveal dissolve is complete */
  onDone?: () => void;
  /** How long to hold the black + "Initializing" screen in ms */
  holdMs?: number;
  /** Duration of the pixel dissolve reveal in ms */
  revealMs?: number;
  /** Color of the overlay */
  color?: string;
};

export default function PixelDissolveOverlay({
  active,
  onCovered,
  onDone,
  holdMs = 800,
  revealMs = 1000,
  color,
}: PixelDissolveOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const cellsRef = useRef<Float32Array>(new Float32Array());
  const gridRef = useRef({ columns: 0, rows: 0 });
  const phaseRef = useRef<Phase>("idle");
  const phaseStartRef = useRef(0);
  const onCoveredRef = useRef(onCovered);
  const onDoneRef = useRef(onDone);
  onCoveredRef.current = onCovered;
  onDoneRef.current = onDone;

  const darkColor = color || "#0d0b08";

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!active) {
      stop();
      if (containerRef.current) containerRef.current.style.display = "none";
      if (labelRef.current) labelRef.current.style.opacity = "0";
      phaseRef.current = "idle";
      return;
    }

    // Instant black screen
    if (containerRef.current) containerRef.current.style.display = "block";
    if (labelRef.current) labelRef.current.style.opacity = "1";

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let pixel = PIXEL_SIZE;

    const updateSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      pixel = Math.max(20, Math.round(PIXEL_SIZE * Math.min(width / 1440, 1.1)));

      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const columns = Math.ceil(width / pixel);
      const rows = Math.ceil(height / pixel);
      const delays = new Float32Array(columns * rows);
      const maxColumn = Math.max(columns - 1, 1);
      const maxRow = Math.max(rows - 1, 1);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const fromRight = 1 - col / maxColumn;
          const rowBand = Math.abs(row / maxRow - 0.5);
          const noise = hashNoise(col, row);
          const flutter = hashNoise(row + 17, col + 29);
          const score = clamp(
            fromRight * 0.82 + rowBand * 0.08 + noise * 0.06 + flutter * 0.04,
            0,
            1,
          );
          delays[row * columns + col] = score * MAX_CELL_DELAY;
        }
      }

      gridRef.current = { columns, rows };
      cellsRef.current = delays;
    };

    updateSize();

    // Draw solid black immediately
    ctx.fillStyle = darkColor;
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, width, height);

    // Fire onCovered immediately — content can swap now
    onCoveredRef.current?.();

    // Start in holding phase
    phaseRef.current = "holding";
    phaseStartRef.current = 0;

    const drawReveal = (progress: number) => {
      const eased = easeInOutCubic(progress);
      const { columns, rows } = gridRef.current;
      const delays = cellsRef.current;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = darkColor;
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "destination-out";

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const raw = (eased - delays[row * columns + col]) / CELL_DURATION;

          if (raw <= 0) continue;

          const tileX = col * pixel;
          const tileY = row * pixel;

          if (raw >= 1) {
            ctx.globalAlpha = 1;
            ctx.clearRect(tileX - 1, tileY - 1, pixel + 2, pixel + 2);
            continue;
          }

          const carve = easeOutCubic(clamp(raw, 0, 1));
          const size = Math.max(1, pixel * carve);
          const x = tileX + (pixel - size) / 2;
          const y = tileY + (pixel - size) / 2;
          ctx.globalAlpha = carve;
          ctx.fillRect(x, y, size, size);
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const tick = (timestamp: number) => {
      if (phaseStartRef.current === 0) {
        phaseStartRef.current = timestamp;
      }

      const elapsed = timestamp - phaseStartRef.current;

      if (phaseRef.current === "holding") {
        // Keep solid black
        ctx.fillStyle = darkColor;
        ctx.globalAlpha = 1;
        ctx.fillRect(0, 0, width, height);

        if (elapsed >= holdMs) {
          phaseRef.current = "revealing";
          phaseStartRef.current = timestamp;
          // Fade out the label
          if (labelRef.current) labelRef.current.style.opacity = "0";
        }
      } else if (phaseRef.current === "revealing") {
        const progress = clamp(elapsed / revealMs, 0, 1);
        drawReveal(progress);

        if (progress >= 1) {
          phaseRef.current = "done";
          if (containerRef.current) containerRef.current.style.display = "none";
          onDoneRef.current?.();
          return;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => stop();
  }, [active, holdMs, revealMs, darkColor, stop]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[200] pointer-events-none" style={{ display: "none" }}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div
        ref={labelRef}
        className="absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-200"
        style={{ opacity: 0 }}
      >
        <div className="flex flex-col items-center gap-5" style={{ color: LOADER_COLOR }}>
          <HashLoader color={LOADER_COLOR} size={72} speedMultiplier={0.9} />
          <span className="font-display text-xl leading-none">Initializing</span>
        </div>
      </div>
    </div>
  );
}
