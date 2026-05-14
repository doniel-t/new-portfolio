type NoiseInitMessage = {
  type: "init";
  canvas: OffscreenCanvas;
  canvasSize: number;
  refreshInterval: number;
  alpha: number;
};

type NoiseConfigMessage = {
  type: "config";
  canvasSize: number;
  refreshInterval: number;
  alpha: number;
};

type NoiseStopMessage = {
  type: "stop";
};

type NoiseMessage = NoiseInitMessage | NoiseConfigMessage | NoiseStopMessage;

const PREGENERATED_FRAMES = 4;
const BASE_R = 0xa6;
const BASE_G = 0x9f;
const BASE_B = 0x8d;

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let frames: ImageData[] = [];
let intervalId = 0;
let frameIndex = 0;
let currentSize = 128;
let currentRefreshInterval = 2;
let currentAlpha = 15;

function stopLoop() {
  if (intervalId) {
    self.clearInterval(intervalId);
    intervalId = 0;
  }
}

function buildFrames() {
  if (!canvas || !ctx) return;

  canvas.width = currentSize;
  canvas.height = currentSize;
  frames = [];

  for (let frame = 0; frame < PREGENERATED_FRAMES; frame += 1) {
    const imageData = ctx.createImageData(currentSize, currentSize);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const intensity = Math.random();
      data[i] = Math.round(BASE_R * intensity);
      data[i + 1] = Math.round(BASE_G * intensity);
      data[i + 2] = Math.round(BASE_B * intensity);
      data[i + 3] = currentAlpha;
    }

    frames.push(imageData);
  }

  frameIndex = 0;
  ctx.putImageData(frames[0], 0, 0);
}

function startLoop() {
  stopLoop();
  if (!ctx || frames.length === 0) return;

  const intervalMs = Math.max(100, currentRefreshInterval * (1000 / 60));
  intervalId = self.setInterval(() => {
    if (!ctx || frames.length === 0) return;
    frameIndex = (frameIndex + 1) % frames.length;
    ctx.putImageData(frames[frameIndex], 0, 0);
  }, intervalMs);
}

function configure(message: NoiseConfigMessage | NoiseInitMessage) {
  currentSize = message.canvasSize;
  currentRefreshInterval = message.refreshInterval;
  currentAlpha = message.alpha;
  buildFrames();
  startLoop();
}

self.onmessage = (event: MessageEvent<NoiseMessage>) => {
  const message = event.data;

  if (message.type === "init") {
    canvas = message.canvas;
    ctx = canvas.getContext("2d", { alpha: true });
    configure(message);
    return;
  }

  if (message.type === "config") {
    configure(message);
    return;
  }

  stopLoop();
};

export {};

