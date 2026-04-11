"use client";

import HashLoader from "react-spinners/HashLoader";
import { useEffect, useRef, useState } from "react";

const HOLD_MS = 1000;
const DISSOLVE_MS = 1325;
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

export default function InitialLoadTransition() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cellsRef = useRef<Float32Array>(new Float32Array());
  const gridRef = useRef({ columns: 0, rows: 0 });
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const hasPaintedOverlayRef = useRef(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [isOverlayPainted, setIsOverlayPainted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isReducedMotionFading, setIsReducedMotionFading] = useState(false);
  const [darkColor, setDarkColor] = useState("#0d0b08");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReducedMotion = () => setReducedMotion(mediaQuery.matches);

    syncReducedMotion();
    mediaQuery.addEventListener("change", syncReducedMotion);

    return () => mediaQuery.removeEventListener("change", syncReducedMotion);
  }, []);

  useEffect(() => {
    const resolvedDark = getComputedStyle(document.documentElement)
      .getPropertyValue("--dark")
      .trim();

    if (resolvedDark) {
      setDarkColor(resolvedDark);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    hasPaintedOverlayRef.current = false;
    setIsOverlayPainted(reducedMotion);
    setShowLoader(true);

    const timeoutId = window.setTimeout(() => {
      setShowLoader(false);
    }, HOLD_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isVisible, reducedMotion]);

  useEffect(() => {
    if (!isVisible || reducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) {
      return;
    }

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

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);

      const columns = Math.ceil(width / pixel);
      const rows = Math.ceil(height / pixel);
      const delays = new Float32Array(columns * rows);
      const maxColumn = Math.max(columns - 1, 1);
      const maxRow = Math.max(rows - 1, 1);

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const fromRight = 1 - column / maxColumn;
          const rowBand = Math.abs(row / maxRow - 0.5);
          const noise = hashNoise(column, row);
          const flutter = hashNoise(row + 17, column + 29);
          const timingScore = clamp(
            fromRight * 0.82 + rowBand * 0.08 + noise * 0.06 + flutter * 0.04,
            0,
            1
          );

          delays[row * columns + column] = timingScore * MAX_CELL_DELAY;
        }
      }

      gridRef.current = { columns, rows };
      cellsRef.current = delays;
    };

    const draw = (timestamp: number) => {
      if (startRef.current === null) {
        startRef.current = timestamp;
      }

      const elapsed = timestamp - startRef.current;
      context.clearRect(0, 0, width, height);

      if (elapsed <= HOLD_MS) {
        context.fillStyle = darkColor;
        context.globalAlpha = 1;
        context.fillRect(0, 0, width, height);

        if (!hasPaintedOverlayRef.current) {
          hasPaintedOverlayRef.current = true;
          setIsOverlayPainted(true);
        }

        rafRef.current = window.requestAnimationFrame(draw);
        return;
      }

      const progress = clamp((elapsed - HOLD_MS) / DISSOLVE_MS, 0, 1);
      const easedProgress = easeInOutCubic(progress);
      const { columns, rows } = gridRef.current;
      const delays = cellsRef.current;

      context.globalCompositeOperation = "source-over";
      context.fillStyle = darkColor;
      context.globalAlpha = 1;
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "destination-out";

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const rawProgress =
            (easedProgress - delays[row * columns + column]) / CELL_DURATION;

          if (rawProgress <= 0) {
            continue;
          }

          const tileX = column * pixel;
          const tileY = row * pixel;

          if (rawProgress >= 1) {
            context.globalAlpha = 1;
            context.clearRect(tileX - 1, tileY - 1, pixel + 2, pixel + 2);
            continue;
          }

          const cellProgress = clamp(rawProgress, 0, 1);
          const carve = easeOutCubic(cellProgress);
          const size = Math.max(1, pixel * carve);
          const x = tileX + (pixel - size) / 2;
          const y = tileY + (pixel - size) / 2;

          context.globalAlpha = carve;
          context.fillRect(x, y, size, size);
        }
      }

      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";

      if (progress >= 1) {
        setIsVisible(false);
        return;
      }

      rafRef.current = window.requestAnimationFrame(draw);
    };

    updateSize();
    rafRef.current = window.requestAnimationFrame(draw);

    window.addEventListener("resize", updateSize, { passive: true });

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }

      window.removeEventListener("resize", updateSize);
    };
  }, [darkColor, isVisible, reducedMotion]);

  useEffect(() => {
    if (!reducedMotion || !isVisible) {
      return;
    }

    const fadeTimeout = window.setTimeout(() => {
      setIsReducedMotionFading(true);
    }, HOLD_MS);

    const hideTimeout = window.setTimeout(() => {
      setIsVisible(false);
    }, HOLD_MS + 220);

    return () => {
      window.clearTimeout(fadeTimeout);
      window.clearTimeout(hideTimeout);
    };
  }, [isVisible, reducedMotion]);

  useEffect(() => {
    if (!reducedMotion) {
      setIsReducedMotionFading(false);
    }
  }, [reducedMotion]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[200] pointer-events-none ${
        reducedMotion ? "transition-opacity duration-300 ease-out" : ""
      }`}
      style={{
        backgroundColor: reducedMotion ? darkColor : "transparent",
        opacity: reducedMotion && isReducedMotionFading ? 0 : 1,
      }}
    >
      <div
        aria-hidden={!(showLoader && isOverlayPainted)}
        className="absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-200 ease-out"
        style={{ opacity: showLoader && isOverlayPainted ? 1 : 0 }}
      >
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center gap-5"
          style={{ color: LOADER_COLOR }}
        >
          <HashLoader color={LOADER_COLOR} size={72} speedMultiplier={0.9} />
          <span className="font-display text-xl leading-none">Initializing</span>
        </div>
      </div>
      {!reducedMotion ? <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" /> : null}
    </div>
  );
}
