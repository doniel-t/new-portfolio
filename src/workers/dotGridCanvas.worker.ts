type DotGridInitMessage = {
  type: "init";
  canvas: OffscreenCanvas;
};

type DotGridConfigMessage = {
  type: "config";
  width: number;
  height: number;
  dpr: number;
  dotSize: number;
  gap: number;
  baseColor: string;
  returnDuration: number;
};

type DotGridActiveMessage = {
  type: "active";
  active: boolean;
};

type DotGridClickMessage = {
  type: "click";
  x: number;
  y: number;
  shockRadius: number;
  shockStrength: number;
  resistance: number;
};

type DotGridStopMessage = {
  type: "stop";
};

type DotGridMessage =
  | DotGridInitMessage
  | DotGridConfigMessage
  | DotGridActiveMessage
  | DotGridClickMessage
  | DotGridStopMessage;

type Dot = {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  vx: number;
  vy: number;
};

const scope = self as unknown as {
  requestAnimationFrame?: (callback: FrameRequestCallback) => number;
  cancelAnimationFrame?: (handle: number) => void;
  setTimeout: typeof setTimeout;
  clearTimeout: typeof clearTimeout;
};

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let width = 0;
let height = 0;
let dpr = 1;
let dotSize = 16;
let gap = 32;
let baseColor = "#5227ff";
let returnDuration = 1.5;
let active = false;
let frameId: number | null = null;
let lastDrawTime = 0;
let dots: Dot[] = [];

function requestFrame(callback: FrameRequestCallback) {
  if (scope.requestAnimationFrame) {
    return scope.requestAnimationFrame(callback);
  }

  return scope.setTimeout(() => callback(performance.now()), 1000 / 60) as unknown as number;
}

function cancelFrame(handle: number | null) {
  if (handle === null) return;

  if (scope.cancelAnimationFrame) {
    scope.cancelAnimationFrame(handle);
  } else {
    scope.clearTimeout(handle);
  }
}

function buildGrid() {
  if (!canvas || !ctx) return;

  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const cols = Math.max(1, Math.floor((width + gap) / (dotSize + gap)));
  const rows = Math.max(1, Math.floor((height + gap) / (dotSize + gap)));
  const cell = dotSize + gap;
  const gridW = cell * cols - gap;
  const gridH = cell * rows - gap;
  const startX = (width - gridW) / 2 + dotSize / 2;
  const startY = (height - gridH) / 2 + dotSize / 2;
  const nextDots: Dot[] = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      nextDots.push({
        cx: startX + x * cell,
        cy: startY + y * cell,
        xOffset: 0,
        yOffset: 0,
        vx: 0,
        vy: 0,
      });
    }
  }

  dots = nextDots;
}

function draw(timestamp: number) {
  if (!active || !ctx) {
    frameId = null;
    return;
  }

  if (timestamp - lastDrawTime < 1000 / 60) {
    frameId = requestFrame(draw);
    return;
  }

  lastDrawTime = timestamp;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = baseColor;

  const radius = dotSize / 2;
  const spring = Math.max(0.012, 0.045 / Math.max(returnDuration, 0.3));
  const damping = 0.86;

  for (let i = 0; i < dots.length; i += 1) {
    const dot = dots[i];

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

    ctx.beginPath();
    ctx.arc(dot.cx + dot.xOffset, dot.cy + dot.yOffset, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  frameId = requestFrame(draw);
}

function start() {
  if (!active || frameId !== null) return;
  lastDrawTime = 0;
  frameId = requestFrame(draw);
}

function stop() {
  active = false;
  cancelFrame(frameId);
  frameId = null;
  ctx?.clearRect(0, 0, width, height);
}

self.onmessage = (event: MessageEvent<DotGridMessage>) => {
  const message = event.data;

  if (message.type === "init") {
    canvas = message.canvas;
    ctx = canvas.getContext("2d", { alpha: true });
    return;
  }

  if (message.type === "config") {
    width = message.width;
    height = message.height;
    dpr = message.dpr;
    dotSize = message.dotSize;
    gap = message.gap;
    baseColor = message.baseColor;
    returnDuration = message.returnDuration;
    buildGrid();
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

  if (message.type === "click") {
    const strength = Math.max(0, message.shockStrength);
    const radius = Math.max(1, message.shockRadius);
    const resistanceScale = Math.max(0.3, Math.min(2, 750 / Math.max(message.resistance, 1)));

    for (let i = 0; i < dots.length; i += 1) {
      const dot = dots[i];
      const dx = dot.cx - message.x;
      const dy = dot.cy - message.y;
      const distance = Math.hypot(dx, dy);
      if (distance >= radius) continue;

      const falloff = 1 - distance / radius;
      dot.vx += dx * strength * falloff * 0.035 * resistanceScale;
      dot.vy += dy * strength * falloff * 0.035 * resistanceScale;
    }

    start();
    return;
  }

  stop();
};

export {};

