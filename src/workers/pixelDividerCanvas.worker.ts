type Axis = "vertical" | "horizontal";
type Direction = "up" | "down" | "left" | "right";

type PixelDividerInitMessage = {
  type: "init";
  canvas: OffscreenCanvas;
};

type PixelDividerConfigMessage = {
  type: "config";
  axis: Axis;
  width: number;
  height: number;
  dpr: number;
  color: string;
  pixelSize: number;
  durationSec: number;
  travelMultiplier: number;
  streams: number;
  direction: Direction;
};

type PixelDividerActiveMessage = {
  type: "active";
  active: boolean;
};

type PixelDividerStopMessage = {
  type: "stop";
};

type PixelDividerMessage =
  | PixelDividerInitMessage
  | PixelDividerConfigMessage
  | PixelDividerActiveMessage
  | PixelDividerStopMessage;

type Particle = {
  x: number;
  y: number;
  progress: number;
};

const scope = self as unknown as {
  requestAnimationFrame?: (callback: FrameRequestCallback) => number;
  cancelAnimationFrame?: (handle: number) => void;
  setTimeout: typeof setTimeout;
  clearTimeout: typeof clearTimeout;
};

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let axis: Axis = "vertical";
let width = 0;
let height = 0;
let dpr = 1;
let color = "#0d0b08";
let pixelSize = 28;
let durationSec = 4.5;
let travelMultiplier = 1.8;
let streams = 5;
let direction: Direction = "up";
let active = false;
let frameId: number | null = null;
let lastTimestamp = 0;
let particles: Particle[] = [];

function requestFrame(callback: FrameRequestCallback) {
  if (scope.requestAnimationFrame) {
    return scope.requestAnimationFrame(callback);
  }

  return scope.setTimeout(() => callback(performance.now()), 1000 / 24) as unknown as number;
}

function cancelFrame(handle: number | null) {
  if (handle === null) return;

  if (scope.cancelAnimationFrame) {
    scope.cancelAnimationFrame(handle);
  } else {
    scope.clearTimeout(handle);
  }
}

function buildParticles() {
  if (!canvas || !ctx) return;

  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const nextParticles: Particle[] = [];

  if (axis === "vertical") {
    const columns = Math.max(1, Math.ceil(width / pixelSize) + 2);
    for (let c = 0; c < columns; c += 1) {
      for (let s = 0; s < streams; s += 1) {
        nextParticles.push({ x: c * pixelSize, y: 0, progress: Math.random() });
      }
    }
  } else {
    const rows = Math.max(1, Math.ceil(height / pixelSize) + 1);
    for (let r = 0; r < rows; r += 1) {
      for (let s = 0; s < streams; s += 1) {
        nextParticles.push({ x: 0, y: r * pixelSize, progress: Math.random() });
      }
    }
  }

  particles = nextParticles;
}

function drawVertical(delta: number) {
  if (!ctx || !canvas) return;

  const scaledPixel = pixelSize * dpr;
  const travelDistance = pixelSize * travelMultiplier;
  const progressDelta = delta / durationSec;
  const isUp = direction === "up";
  const buckets: number[][] = Array.from({ length: 11 }, () => []);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = color;

  for (let i = 0; i < particles.length; i += 1) {
    const particle = particles[i];
    particle.progress += progressDelta;
    if (particle.progress >= 1) particle.progress %= 1;

    const y = isUp
      ? height - particle.progress * travelDistance
      : -pixelSize + particle.progress * travelDistance;
    const yScaled = y * dpr;
    if (yScaled + scaledPixel < 0 || yScaled > canvas.height) continue;

    const opacity =
      particle.progress <= 0.7
        ? 1 - (particle.progress / 0.7) * 0.15
        : 0.85 * (1 - (particle.progress - 0.7) / 0.3);
    const bucket = Math.max(0, Math.min(10, Math.round(opacity * 10)));
    buckets[bucket].push(particle.x * dpr, yScaled);
  }

  for (let b = 10; b >= 0; b -= 1) {
    const items = buckets[b];
    if (items.length === 0) continue;
    ctx.globalAlpha = b / 10;
    for (let j = 0; j < items.length; j += 2) {
      ctx.fillRect(items[j], items[j + 1], scaledPixel, scaledPixel);
    }
  }

  ctx.globalAlpha = 1;
}

function drawHorizontal(delta: number) {
  if (!ctx || !canvas) return;

  const scaledPixel = pixelSize * dpr;
  const travelDistance = pixelSize * travelMultiplier;
  const progressDelta = delta / durationSec;
  const moveRight = direction === "right";
  const buckets: number[][] = Array.from({ length: 11 }, () => []);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = color;

  for (let i = 0; i < particles.length; i += 1) {
    const particle = particles[i];
    particle.progress += progressDelta;
    if (particle.progress >= 1) particle.progress %= 1;

    const x = moveRight
      ? -pixelSize + particle.progress * travelDistance
      : width - particle.progress * travelDistance;
    const xScaled = x * dpr;
    if (xScaled + scaledPixel < 0 || xScaled > canvas.width) continue;

    const opacity =
      particle.progress <= 0.72
        ? 1 - (particle.progress / 0.72) * 0.18
        : 0.82 * (1 - (particle.progress - 0.72) / 0.28);
    const bucket = Math.max(0, Math.min(10, Math.round(opacity * 10)));
    buckets[bucket].push(xScaled, particle.y * dpr);
  }

  for (let b = 10; b >= 0; b -= 1) {
    const points = buckets[b];
    if (points.length === 0) continue;
    ctx.globalAlpha = b / 10;
    for (let j = 0; j < points.length; j += 2) {
      ctx.fillRect(points[j], points[j + 1], scaledPixel, scaledPixel);
    }
  }

  ctx.globalAlpha = 1;
}

function tick(timestamp: number) {
  if (!active) {
    frameId = null;
    lastTimestamp = 0;
    return;
  }

  if (lastTimestamp === 0) lastTimestamp = timestamp;
  const delta = (timestamp - lastTimestamp) / 1000;

  if (delta >= 1 / 24) {
    lastTimestamp = timestamp;
    if (axis === "vertical") {
      drawVertical(delta);
    } else {
      drawHorizontal(delta);
    }
  }

  frameId = requestFrame(tick);
}

function start() {
  if (!active || frameId !== null) return;
  lastTimestamp = 0;
  frameId = requestFrame(tick);
}

function stop() {
  active = false;
  cancelFrame(frameId);
  frameId = null;
  lastTimestamp = 0;
  ctx?.clearRect(0, 0, width, height);
}

self.onmessage = (event: MessageEvent<PixelDividerMessage>) => {
  const message = event.data;

  if (message.type === "init") {
    canvas = message.canvas;
    ctx = canvas.getContext("2d", { alpha: true });
    return;
  }

  if (message.type === "config") {
    axis = message.axis;
    width = message.width;
    height = message.height;
    dpr = message.dpr;
    color = message.color;
    pixelSize = message.pixelSize;
    durationSec = message.durationSec;
    travelMultiplier = message.travelMultiplier;
    streams = message.streams;
    direction = message.direction;
    buildParticles();
    start();
    return;
  }

  if (message.type === "active") {
    active = message.active;
    if (active) {
      start();
    } else {
      stop();
    }
    return;
  }

  stop();
};

export {};

